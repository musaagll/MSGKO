"""
MSGKO Market Scraper
=====================
Kaynak   : uskopazar.com
Kanallar : zero3, zero4, zero5, zero8,
           agartha3, agartha4,
           pandora3, pandora4,
           destan2, destan3
- 192 kayit secilir (max, sayfalama yok)
- Her kanal ayri Supabase kaydina gider
- Fiyat -1 (rekabet stratejisi)
- Item gorseli raw_data.img_url'de
"""

import os, re, sys, json, time, logging, asyncio, requests
from datetime import datetime, timezone
from typing import Optional
from dotenv import load_dotenv
from playwright.async_api import async_playwright, Page, TimeoutError as PWTimeout
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# ── Ortam ──────────────────────────────────────────────────────────────────────
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
log = logging.getLogger('msgko')

# ── Kanallar ───────────────────────────────────────────────────────────────────
# (db_key, html_btn_id)
CHANNELS = [
    ('zero3',    'btn_zero3'),
    ('zero4',    'btn_zero4'),
    ('zero5',    'btn_zero5'),
    ('zero8',    'btn_zero8'),
    ('agartha3', 'btn_agartha3'),
    ('agartha4', 'btn_agartha4'),
    ('pandora3', 'btn_pandora3'),
    ('pandora4', 'btn_pandora4'),
    ('destan2',  'btn_destan2'),
    ('destan3',  'btn_destan3'),
]

SITE_URL   = 'https://www.uskopazar.com/'
PAGE_SIZE  = 192   # Maksimum — sayfalama yok
BATCH_SIZE = 200


# ── Yardimcilar ────────────────────────────────────────────────────────────────
def parse_price(raw: str) -> Optional[int]:
    c = re.sub(r'[^\d]', '', str(raw))
    return int(c) if c else None

def minus_one(p: Optional[int]) -> Optional[int]:
    return (p - 1) if p and p > 1 else p

def parse_upgrade(text: str) -> tuple[str, Optional[int]]:
    m = re.search(r'\(\+(\d+)\)', text)
    if m:
        return text[:m.start()].strip(), int(m.group(1))
    m2 = re.search(r'(?<!\w)\+(\d+)\s*$', text.strip())
    if m2:
        return text[:m2.start()].strip(), int(m2.group(1))
    return text.strip(), None


# ── Scraper ────────────────────────────────────────────────────────────────────
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
        await close_modal(page)

        # Sayfa yuklenip yuklenmedigini kontrol et
        if await page.locator('input[placeholder="Search Text"]').count() == 0:
            log.error('Sayfa yuklenemedi!')
            await page.screenshot(path=os.path.join(_base, 'debug_load.png'))
            await browser.close()
            return results

        log.info('Sayfa hazir')

        # 192 kayit sec — bir kere yeterli
        await set_page_size(page, PAGE_SIZE)
        await page.wait_for_timeout(1500)
        log.info('')

        for db_key, btn_id in CHANNELS:
            log.info(f'[{db_key}] cekiliyor...')
            t0 = time.time()
            try:
                listings = await scrape_channel(page, db_key, btn_id)
                results[db_key] = listings
                log.info(f'[{db_key}] {len(listings)} ilan - {int((time.time()-t0)*1000)}ms')
            except Exception as e:
                log.error(f'[{db_key}] HATA: {e}')
                results[db_key] = []
            await asyncio.sleep(1.5)

        await browser.close()
    return results


async def close_modal(page: Page):
    for sel in ['text=Bugünlük kapat', 'text=Kapat', '[aria-label="Close"]']:
        try:
            el = page.locator(sel)
            if await el.count() > 0:
                await el.first.click()
                await page.wait_for_timeout(700)
                log.info('Modal kapatildi')
                return
        except Exception:
            pass
    await page.keyboard.press('Escape')
    await page.wait_for_timeout(200)


async def set_page_size(page: Page, size: int):
    """id=btn_top_list ile kayit boyutunu sec."""
    await page.evaluate(
        '''(sz) => {
            const sel = document.getElementById('btn_top_list');
            if (!sel) return;
            sel.value = String(sz);
            sel.dispatchEvent(new Event('change', {bubbles: true}));
        }''', size
    )
    await page.wait_for_timeout(1500)
    log.info(f'Kayit boyutu: {size}')


async def scrape_channel(page: Page, db_key: str, btn_id: str) -> list[dict]:
    """Bir kanalin tum ilanlarini cek."""

    # Kanal butonuna JS click (reklam iframe'ini atar)
    ok = await page.evaluate(
        '''(id) => {
            const el = document.getElementById(id);
            if (el) { el.click(); return true; }
            return false;
        }''', btn_id
    )
    if not ok:
        log.warning(f'[{db_key}] btn #{btn_id} bulunamadi')
        return []

    await page.wait_for_timeout(3500)
    await close_modal(page)

    # 192 kayit secimini garantile (kanal degisince sifirlanabilir)
    await set_page_size(page, PAGE_SIZE)
    await page.wait_for_timeout(2000)

    # Satirlari bekle
    try:
        await page.wait_for_selector('tbody tr', timeout=15_000)
    except PWTimeout:
        log.warning(f'[{db_key}] satirlar yuklenemedi')
        return []

    rows = await page.query_selector_all('tbody tr')
    if not rows:
        return []

    now = datetime.now(timezone.utc).isoformat()
    out = []
    for row in rows:
        try:
            item = await parse_row(row, db_key, now)
            if item:
                out.append(item)
        except Exception:
            pass
    return out


async def parse_row(row, db_key: str, now: str) -> Optional[dict]:
    """
    uskopazar.com tablo satiri:
      td[0] = img + item adi
      td[1] = satici
      td[2] = lokasyon (ATLA)
      td[3] = ucret (spans[0] = birim fiyat)
      td[5] = eklenme tarihi
    """
    cells = await row.query_selector_all('td')
    if len(cells) < 4:
        return None

    # Gorsel
    img = await cells[0].query_selector('img')
    img_url = await img.get_attribute('src') if img else None

    # Item adi
    spans_0  = await cells[0].query_selector_all('span')
    raw_name = ''
    for sp in spans_0:
        t = (await sp.inner_text()).strip()
        if t:
            raw_name = t
            break
    if not raw_name:
        raw_name = (await cells[0].inner_text()).strip().split('\n')[0]
    raw_name = raw_name.strip()
    if not raw_name:
        return None

    item_name, upgrade = parse_upgrade(raw_name)
    if not item_name:
        return None

    # Satici
    seller = (await cells[1].inner_text()).strip() or None

    # Fiyat — td[3] > spans[0]
    spans_3 = await cells[3].query_selector_all('span')
    price_raw = (await spans_3[0].inner_text()).strip() if spans_3 else ''
    if not price_raw:
        price_raw = (await cells[3].inner_text()).strip().split('\n')[0]
    price = parse_price(price_raw)
    if not price or price <= 0:
        return None

    # Tarih
    date_val = None
    if len(cells) > 5:
        date_val = (await cells[5].inner_text()).strip() or None

    pm = minus_one(price)

    return {
        'server':        db_key,
        'item_name':     item_name,
        'item_count':    1,
        'upgrade_level': upgrade,
        'price':         pm,
        'price_per_unit': pm,
        'seller_name':   seller,
        'scraped_at':    now,
        'raw_data':      json.dumps({
            'original_price': price,
            'minus_one':      pm,
            'source':         'uskopazar.com',
            'img_url':        img_url,
            'raw_name':       raw_name,
            'listed_date':    date_val,
            'channel':        db_key,
        }, ensure_ascii=False),
    }


# ── Supabase ───────────────────────────────────────────────────────────────────
def _h():
    return {
        'apikey':        SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type':  'application/json',
        'Prefer':        'return=minimal',
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
        else:
            log.error(f'INSERT hatasi: {r.status_code} {r.text[:100]}')
    return n

def sb_log(server: str, status: str, count: int, err: Optional[str], ms: int):
    try:
        requests.post(
            f'{SUPABASE_URL}/rest/v1/market_scrape_log',
            json={'server': server, 'status': status,
                  'items_count': count, 'error_msg': err, 'duration_ms': ms},
            headers=_h(), timeout=10
        )
    except Exception:
        pass


# ── main ───────────────────────────────────────────────────────────────────────
def main():
    log.info('=' * 60)
    log.info(f'MSGKO Scraper - {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    log.info(f'Kanallar: {", ".join(c[0] for c in CHANNELS)}')
    log.info('=' * 60)

    if not SUPABASE_URL or not SUPABASE_KEY:
        log.error('SUPABASE_URL / SUPABASE_SERVICE_KEY eksik! scripts/.env kontrol edin.')
        sys.exit(1)

    t_start = time.time()
    results = asyncio.run(scrape())

    log.info('')
    log.info('--- Supabase yazma ---')
    grand = 0
    for db_key, listings in results.items():
        if not listings:
            log.warning(f'[{db_key}] hic ilan yok')
            sb_log(db_key, 'error', 0, 'no listings', 0)
            continue
        t0 = time.time()
        sb_delete(db_key)
        n  = sb_insert(listings)
        grand += n
        ms = int((time.time()-t0)*1000)
        sb_log(db_key, 'success' if n else 'error', n,
               None if n else 'insert failed', ms)
        log.info(f'[{db_key}] {n} ilan yazildi ({ms}ms)')

    total_ms = int((time.time()-t_start)*1000)
    log.info('=' * 60)
    log.info(f'TOPLAM: {grand} ilan - {total_ms}ms ({total_ms//1000}sn)')
    log.info('=' * 60)


if __name__ == '__main__':
    main()
