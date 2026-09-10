"""
MSGKO — USKO Pazar Scraper (Playwright)
========================================
Kaynak   : uskopazar.com
Yontem   : Playwright headless Chromium

Kolon yapisi (debug_scrape.py ile dogrulanmis):
  [0] Item Adi  — img.src + span[0].text
  [1] Kullanici — satici adi
  [2] Lokasyon  — ATLA (koordinat, fiyat degil)
  [3] Ucret     — spans[0] = BIRIM FIYAT ("888" veya "2.195")
  [4] (bos)
  [5] Eklenme Tarihi

Strateji:
  - Select[2] = kayit sayisi dropdown -> 96 sec
  - Pagination YOK -> tek sayfada max 96 ilan
  - Fiyattan -1 uygula (rekabet stratejisi)
  - Item gorsel URL'sini raw_data'ya ekle

Kurulum:
    pip install playwright requests python-dotenv
    playwright install chromium

Calistirma:
    set PYTHONUTF8=1 && python -X utf8 scripts/scrape_market.py
"""

import os, re, sys, json, time, logging, asyncio, requests
from datetime import datetime, timezone
from typing import Optional
from dotenv import load_dotenv
from playwright.async_api import async_playwright, Page, TimeoutError as PWTimeout
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# ── Ortam degiskenleri ─────────────────────────────────────────────────────────
_base = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(_base, '.env'))
load_dotenv(os.path.join(_base, '..', 'msgko-admin', '.env.local'))
SUPABASE_URL = os.environ.get('SUPABASE_URL') or os.environ.get('NEXT_PUBLIC_SUPABASE_URL', '')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_KEY') or os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)],
)
log = logging.getLogger('msgko_scraper')

# ── Sunucu tanimlari ───────────────────────────────────────────────────────────
# (db_key, btn_grp_id)  — find_buttons.py ile dogrulanmis ID'ler
SERVERS = [
    ('zero',    'btn_grp_zero'),
    ('destan',  'btn_grp_destan'),
    ('pandora', 'btn_grp_pandora'),
    ('agartha', 'btn_grp_agartha'),
]

SITE_URL   = 'https://www.uskopazar.com/'
BATCH_SIZE = 200
PAGE_SIZE  = 96   # sayfa basina max ilan (Select[2])


# ── Yardimcilar ────────────────────────────────────────────────────────────────
def parse_price(raw: str) -> Optional[int]:
    """'2.195' veya '1.800.000' -> integer"""
    cleaned = re.sub(r'[^\d]', '', str(raw))
    return int(cleaned) if cleaned else None

def minus_one(p: Optional[int]) -> Optional[int]:
    return (p - 1) if p and p > 1 else p

def parse_upgrade(text: str) -> tuple[str, Optional[int]]:
    """'Shard(+1)' -> ('Shard', 1) | 'Raptor +9' -> ('Raptor', 9)"""
    m = re.search(r'\(\+(\d+)\)', text)
    if m:
        return text[:m.start()].strip(), int(m.group(1))
    m2 = re.search(r'(?<!\w)\+(\d+)\s*$', text.strip())
    if m2:
        return text[:m2.start()].strip(), int(m2.group(1))
    return text.strip(), None


# ── Playwright scraper ─────────────────────────────────────────────────────────
async def scrape() -> dict[str, list[dict]]:
    results: dict[str, list[dict]] = {}

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-dev-shm-usage'],
        )
        ctx = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent=(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36'
            ),
            locale='tr-TR',
            timezone_id='Europe/Istanbul',
        )
        await ctx.add_init_script(
            "Object.defineProperty(navigator,'webdriver',{get:()=>undefined});"
        )
        page: Page = await ctx.new_page()

        log.info('uskopazar.com aciliyor...')
        await page.goto(SITE_URL, wait_until='domcontentloaded', timeout=30_000)
        await page.wait_for_timeout(5000)

        # Modal kapat
        await close_modal(page)

        # Sayfa hazir mi?
        if await page.locator('input[placeholder="Search Text"]').count() == 0:
            log.error('Sayfa yuklenemedi')
            await page.screenshot(path=os.path.join(_base, 'debug_main.png'))
            await browser.close()
            return results

        log.info('Sayfa hazir')
        log.info('')

        # Ilk olarak 96 kayit sec — bu ayar tum sunucular icin gecerli
        await select_page_size(page, PAGE_SIZE)
        await page.wait_for_timeout(2000)

        for db_key, btn_id in SERVERS:
            log.info(f'>> [{btn_id}] basliyor...')
            t0 = time.time()
            try:
                listings = await scrape_server(page, db_key, btn_id)
                results[db_key] = listings
                log.info(f'  [{btn_id}] -> {len(listings)} ilan')
            except Exception as e:
                log.error(f'  [{btn_id}] Hata: {type(e).__name__}: {str(e)[:120]}')
                results[db_key] = []
            log.info(f'  Sure: {int((time.time()-t0)*1000)}ms')
            log.info('')
            await asyncio.sleep(2)

        await browser.close()
    return results


async def close_modal(page: Page):
    """Popup/modal kapat."""
    for sel in ['text=Bugünlük kapat', 'text=Kapat', '[aria-label="Close"]']:
        try:
            el = page.locator(sel)
            if await el.count() > 0:
                await el.first.click()
                await page.wait_for_timeout(800)
                log.info('Modal kapatildi')
                return
        except Exception:
            pass
    await page.keyboard.press('Escape')
    await page.wait_for_timeout(300)


async def select_page_size(page: Page, size: int):
    """
    Sayfa basina ilan sayisini sec.
    id='btn_top_list' — find_buttons.py ile dogrulanmis
    """
    try:
        await page.evaluate(
            '''(size) => {
                const sel = document.getElementById('btn_top_list');
                if (sel) {
                    sel.value = String(size);
                    sel.dispatchEvent(new Event('change', {bubbles: true}));
                }
            }''',
            size
        )
        await page.wait_for_timeout(2000)
        log.info(f'Kayit sayisi {size} secildi')
    except Exception as e:
        log.debug(f'Kayit boyutu ayarlanamadi: {e}')


async def scrape_server(page: Page, db_key: str, btn_id: str) -> list[dict]:
    """Bir sunucunun ilanlarini cek."""

    # Sunucu butonuna tikla — ID ile JS click (reklam engeli atlar)
    clicked = await page.evaluate(
        '''(btnId) => {
            const el = document.getElementById(btnId);
            if (el) { el.click(); return true; }
            return false;
        }''',
        btn_id
    )
    if not clicked:
        log.warning(f'  [{btn_id}] Buton bulunamadi (id={btn_id})')
        return []

    await page.wait_for_timeout(4000)
    await close_modal(page)

    # 96 kayit secimini garantile
    await select_page_size(page, PAGE_SIZE)
    await page.wait_for_timeout(2500)

    # Satirlari bekle ve al
    rows = await wait_and_get_rows(page)
    if not rows:
        log.warning(f'  [{btn_id}] Hic satir bulunamadi')
        await page.screenshot(path=os.path.join(_base, f'debug_{db_key}.png'))
        return []

    log.info(f'  [{btn_id}] {len(rows)} satir bulundu')

    now = datetime.now(timezone.utc).isoformat()
    listings = []
    for row in rows:
        try:
            listing = await parse_row(row, db_key, now)
            if listing:
                listings.append(listing)
        except Exception as e:
            log.debug(f'  Satir hatasi: {e}')

    return listings


async def wait_and_get_rows(page: Page) -> list:
    """tbody tr satirlarini bekle ve don."""
    try:
        await page.wait_for_selector('tbody tr', timeout=15_000)
        rows = await page.query_selector_all('tbody tr')
        return rows
    except PWTimeout:
        return []


async def parse_row(row, db_key: str, now: str) -> Optional[dict]:
    """
    Satiri parse et (debug_scrape.py ile dogrulanmis yapi):

      cells[0]: img src + span[0] = item adi
      cells[1]: satici adi
      cells[2]: ATLA (lokasyon/koordinat)
      cells[3]: spans[0] = birim fiyat ("888", "2.195", "1.800.000")
      cells[5]: eklenme tarihi (opsiyonel)
    """
    cells = await row.query_selector_all('td')
    if len(cells) < 4:
        return None

    # ── [0] Item adi + gorsel ─────────────────────────────────────────────────
    img_el  = await cells[0].query_selector('img')
    img_url = await img_el.get_attribute('src') if img_el else None

    spans_0 = await cells[0].query_selector_all('span')
    raw_name = ''
    for sp in spans_0:
        t = (await sp.inner_text()).strip()
        if t:
            raw_name = t
            break

    if not raw_name:
        raw_name = (await cells[0].inner_text()).strip().split('\n')[0]

    raw_name = raw_name.strip()
    if not raw_name or raw_name.lower() in ('item adi', 'item adı', ''):
        return None

    item_name, upgrade_level = parse_upgrade(raw_name)
    if not item_name:
        return None

    # ── [1] Satici ────────────────────────────────────────────────────────────
    seller = (await cells[1].inner_text()).strip() or None
    if seller and seller.lower() in ('kullanici adi', 'kullanıcı adı', ''):
        seller = None

    # ── [2] Lokasyon — ATLA ──────────────────────────────────────────────────
    # Koordinat bilgisi, fiyat degil

    # ── [3] Birim fiyat ───────────────────────────────────────────────────────
    # spans[0] = birim fiyat ("888", "2.195", "1.800.000")
    # spans[1] = kisa format ("1 M 800 K") — ihtiyac yok
    spans_3  = await cells[3].query_selector_all('span')
    price_raw = ''
    if spans_3:
        price_raw = (await spans_3[0].inner_text()).strip()
    if not price_raw:
        # Fallback: hucre metninin ilk satiri
        cell3 = (await cells[3].inner_text()).strip()
        price_raw = cell3.split('\n')[0].strip()

    price = parse_price(price_raw)
    if not price or price <= 0:
        return None

    # ── [5] Tarih ─────────────────────────────────────────────────────────────
    listed_date = None
    if len(cells) > 5:
        listed_date = (await cells[5].inner_text()).strip() or None

    # ── Fiyat -1 ─────────────────────────────────────────────────────────────
    pm = minus_one(price)

    return {
        'server':         db_key,
        'item_name':      item_name,
        'item_count':     1,
        'upgrade_level':  upgrade_level,
        'price':          pm,
        'price_per_unit': pm,
        'seller_name':    seller,
        'scraped_at':     now,
        'raw_data':       json.dumps({
            'original_price': price,
            'minus_one':      pm,
            'source':         'uskopazar.com',
            'img_url':        img_url,
            'raw_name':       raw_name,
            'listed_date':    listed_date,
        }, ensure_ascii=False),
    }


# ── Supabase ───────────────────────────────────────────────────────────────────
def _h():
    return {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
    }

def sb_delete(k: str):
    requests.delete(
        f'{SUPABASE_URL}/rest/v1/market_listings?server=eq.{k}',
        headers=_h(), timeout=30
    )

def sb_insert(listings: list[dict]) -> int:
    n = 0
    for i in range(0, len(listings), BATCH_SIZE):
        b = listings[i:i+BATCH_SIZE]
        r = requests.post(
            f'{SUPABASE_URL}/rest/v1/market_listings',
            json=b, headers=_h(), timeout=30
        )
        if r.status_code in (200, 201):
            n += len(b)
            log.info(f'  Batch {i//BATCH_SIZE+1}: {len(b)} ilan yazildi')
        else:
            log.error(f'  Batch hatasi: {r.status_code} {r.text[:100]}')
    return n

def sb_log(server: str, status: str, count: int, err: Optional[str], ms: int):
    try:
        requests.post(
            f'{SUPABASE_URL}/rest/v1/market_scrape_log',
            json={
                'server': server, 'status': status,
                'items_count': count, 'error_msg': err, 'duration_ms': ms,
            },
            headers=_h(), timeout=10
        )
    except Exception:
        pass


# ── main ───────────────────────────────────────────────────────────────────────
def main():
    log.info('=' * 60)
    log.info(f'MSGKO Scraper - {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    log.info('=' * 60)
    if not SUPABASE_URL or not SUPABASE_KEY:
        log.error('scripts/.env eksik!')
        sys.exit(1)

    t_start = time.time()
    results = asyncio.run(scrape())

    log.info('--- Supabase yazma ---')
    grand = 0
    for db_key, listings in results.items():
        if not listings:
            log.warning(f'[{db_key}] hic ilan yok')
            sb_log(db_key, 'error', 0, 'no listings', 0)
            continue
        t0 = time.time()
        sb_delete(db_key)
        n   = sb_insert(listings)
        grand += n
        ms  = int((time.time()-t0)*1000)
        sb_log(db_key, 'success' if n else 'error', n, None if n else 'insert failed', ms)
        log.info(f'[{db_key}] {n} ilan yazildi ({ms}ms)')

    log.info('=' * 60)
    log.info(f'Toplam: {grand} ilan - {int((time.time()-t_start)*1000)}ms')
    log.info('=' * 60)


if __name__ == '__main__':
    main()
