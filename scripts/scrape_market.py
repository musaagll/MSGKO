"""
MSGKO — USKO Pazar Scraper (Playwright)
========================================
Kaynak: uskopazar.com

Kurulum:
    pip install playwright requests python-dotenv
    playwright install chromium

Çalıştırma:
    python scripts/scrape_market.py

Windows Task Scheduler (her 5 dk):
    Program : C:\\...\\Python312\\python.exe
    Argüman : C:\\...\\MSGKO\\scripts\\scrape_market.py
    Başlangıç: C:\\...\\MSGKO
"""

import os, re, sys, json, time, logging, asyncio, requests
from datetime import datetime, timezone
from typing import Optional
from dotenv import load_dotenv
from playwright.async_api import async_playwright, Page, TimeoutError as PWTimeout

# Windows terminal encoding sorunu için
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# ── Ortam değişkenleri ─────────────────────────────────────────────────────────
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

# ── Sunucu tanımları ───────────────────────────────────────────────────────────
# Screenshot'tan görülen tab'lar:
#   ZERO 3 / ZERO 4 / ZERO 5 / ZERO 8 (direkt tab)
#   AGARTHA ▾  → dropdown → AGARTHA 3 / AGARTHA 4
#   PANDORA ▾  → dropdown → PANDORA 3 / PANDORA 4
#   DESTAN ▾   → dropdown → DESTAN 2
#
# Format: (db_key, parent_text_veya_None, tab_text)
# parent_text varsa önce parent'a tıkla (dropdown aç), sonra tab_text'e tıkla
SERVERS = [
    ('zero',    None,      'ZERO 3'),
    ('destan',  'DESTAN',  'DESTAN 2'),
    ('pandora', 'PANDORA', 'PANDORA 3'),
    ('agartha', 'AGARTHA', 'AGARTHA 3'),
]

SITE_URL   = 'https://www.uskopazar.com/'
BATCH_SIZE = 200


# ── Yardımcılar ────────────────────────────────────────────────────────────────
def parse_price(raw: str) -> Optional[int]:
    cleaned = re.sub(r'[^\d]', '', str(raw))
    return int(cleaned) if cleaned else None

def minus_one(p: Optional[int]) -> Optional[int]:
    return (p - 1) if p and p > 1 else p

def parse_upgrade(text: str) -> tuple[str, Optional[int]]:
    m = re.search(r'\(\+(\d+)\)|(?<!\w)\+(\d+)', text)
    if m:
        lvl  = int(m.group(1) or m.group(2))
        name = re.sub(r'\s*\(\+\d+\)|\s*\+\d+\s*$', '', text).strip()
        return name, lvl
    return text.strip(), None


# ── Playwright scraper ────────────────────────────────────────────────────────
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
                'AppleWebKit/537.36 (KHTML, like Gecko) '
                'Chrome/152.0.0.0 Safari/537.36'
            ),
            locale='tr-TR',
            timezone_id='Europe/Istanbul',
        )
        await ctx.add_init_script(
            "Object.defineProperty(navigator,'webdriver',{get:()=>undefined});"
        )
        page: Page = await ctx.new_page()

        log.info('uskopazar.com açılıyor...')
        await page.goto(SITE_URL, wait_until='domcontentloaded', timeout=30_000)
        await page.wait_for_timeout(5000)

        await close_modal(page)

        # Sayfa hazır?
        search_el = page.locator('input[placeholder="Search Text"]')
        if await search_el.count() == 0:
            log.error('Sayfa yüklenemedi — screenshot kaydedildi')
            await page.screenshot(path=os.path.join(_base, 'debug_main.png'))
            await browser.close()
            return results

        log.info(f'Sayfa hazir OK - {await page.title()}')
        log.info('')

        for db_key, parent_text, tab_text in SERVERS:
            log.info(f'>> [{tab_text}] scraping...')
            t0 = time.time()
            try:
                listings = await scrape_tab(page, db_key, parent_text, tab_text)
                existing = results.get(db_key, [])
                if len(listings) > len(existing):
                    results[db_key] = listings
                    log.info(f'  [{tab_text}] -> {len(listings)} ilan (en iyi)')
                else:
                    log.info(f'  [{tab_text}] -> mevcut daha iyi ({len(existing)}), atland')
            except Exception as e:
                log.error(f'  [{tab_text}] Hata: {e}')
            log.info(f'  Süre: {int((time.time()-t0)*1000)}ms')
            log.info('')
            await asyncio.sleep(2)

        await browser.close()
    return results


async def close_modal(page: Page):
    """Popup/modal kapat."""
    for sel in [
        'text=Bugünlük kapat',
        'button:has-text("Bugünlük kapat")',
        'text=Kapat',
        '[aria-label="Close"]',
        'button.close',
    ]:
        try:
            el = page.locator(sel)
            if await el.count() > 0:
                await el.first.click()
                log.info(f'Modal kapatıldı ({sel})')
                await page.wait_for_timeout(800)
                return
        except Exception:
            pass
    await page.keyboard.press('Escape')
    await page.wait_for_timeout(300)


async def scrape_tab(
    page: Page, db_key: str,
    parent_text: Optional[str], tab_text: str
) -> list[dict]:
    """Bir sekmedeki tüm ilanları çek."""
    listings: list[dict] = []
    now = datetime.now(timezone.utc).isoformat()

    # Dropdown parent'ı aç
    if parent_text:
        parent_el = page.locator(f'#btn_grp_{parent_text.lower()}, button:has-text("{parent_text}"), span:has-text("{parent_text}")')
        if await parent_el.count() > 0:
            # AdSense iframe engelini aşmak için JavaScript ile tıkla
            try:
                await parent_el.first.click(timeout=5000)
            except Exception:
                # JS ile zorla tıkla
                await parent_el.first.evaluate('el => el.click()')
            await page.wait_for_timeout(1500)
        else:
            log.warning(f'  [{tab_text}] Parent bulunamadi: {parent_text}')

    # Sekmeye tıkla
    tab_el = page.locator(f'button:has-text("{tab_text}"), a:has-text("{tab_text}"), span:has-text("{tab_text}"), li:has-text("{tab_text}")')
    if await tab_el.count() == 0:
        tab_el = page.locator(f'*:has-text("{tab_text}")').first
    if await tab_el.count() == 0:
        log.warning(f'  [{tab_text}] Sekme bulunamadi')
        return listings

    try:
        await tab_el.first.click(timeout=5000)
    except Exception:
        await tab_el.first.evaluate('el => el.click()')
    await page.wait_for_timeout(4000)
    await close_modal(page)

    # İlan satırlarını bekle
    rows = []
    for sel in ['tbody tr', "div[role='row']", "span[role='row']", 'tr.item-row']:
        try:
            await page.wait_for_selector(sel, timeout=10_000)
            rows = await page.query_selector_all(sel)
            if rows:
                log.info(f'  [{tab_text}] {len(rows)} satır ({sel})')
                break
        except PWTimeout:
            continue

    if not rows:
        await page.screenshot(path=os.path.join(_base, f'debug_{db_key}_{tab_text.replace(" ","_")}.png'))
        log.warning(f'  [{tab_text}] Satır yok — screenshot kaydedildi')
        return listings

    for row in rows:
        try:
            lst = await parse_row(row, db_key, tab_text, now)
            if lst:
                listings.append(lst)
        except Exception as e:
            log.debug(f'Satır hatası: {e}')

    return listings


async def parse_row(row, db_key: str, label: str, now: str) -> Optional[dict]:
    """
    uskopazar.com tablo satırı parse.
    Sütunlar: Item Adı | Kullanıcı Adı | Lokasyon | Ücret | Eklenme Tarihi
    Fiyat: "820,561(Click)" formatı
    """
    cells = await row.query_selector_all('td')
    if len(cells) < 3:
        return None

    texts = [(await c.inner_text()).strip() for c in cells]

    # İtem adı — 1. sütun, img title veya a text
    raw_name = ''
    name_el = await cells[0].query_selector('a, span[title], img[alt]')
    if name_el:
        raw_name = (
            await name_el.get_attribute('title') or
            await name_el.get_attribute('alt') or
            await name_el.inner_text()
        )
    if not raw_name:
        raw_name = texts[0]

    raw_name = raw_name.strip()
    if not raw_name or raw_name.lower() in ('item adı', 'item', ''):
        return None

    item_name, upgrade_level = parse_upgrade(raw_name)
    if not item_name:
        return None

    # Fiyat — 4. sütun (index 3), "(Click)" temizle
    # Bazen 3. sütun, bazen 4. — sayısal içeren hücreyi bul
    price_raw = ''
    for t in texts[2:]:
        cleaned = re.sub(r'\(.*?\)', '', t).strip()
        if re.match(r'^[\d.,\s]+$', cleaned) and len(cleaned) > 1:
            price_raw = cleaned
            break
    # Eğer bulamazsak link href içindeki fiyatı dene
    if not price_raw:
        link = await row.query_selector('a[href*="Click"], a.price-link')
        if link:
            price_raw = re.sub(r'\(.*?\)', '', await link.inner_text()).strip()

    price = parse_price(price_raw)
    if not price or price <= 0:
        return None

    # Satıcı — 2. sütun
    seller = texts[1] if len(texts) > 1 else None
    if seller and seller.lower() in ('kullanıcı adı', 'satıcı', 'seller', ''):
        seller = None

    pm = minus_one(price)

    return {
        'server':        db_key,
        'item_name':     item_name,
        'item_count':    1,
        'upgrade_level': upgrade_level,
        'price':         pm,
        'price_per_unit': pm,
        'seller_name':   seller,
        'scraped_at':    now,
        'raw_data':      json.dumps({
            'original': price, 'minus_one': pm,
            'source': 'uskopazar.com', 'label': label,
            'raw_name': raw_name, 'cells': texts[:5],
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
    requests.delete(f'{SUPABASE_URL}/rest/v1/market_listings?server=eq.{k}', headers=_h(), timeout=30)

def sb_insert(listings: list[dict]) -> int:
    n = 0
    for i in range(0, len(listings), BATCH_SIZE):
        b = listings[i:i+BATCH_SIZE]
        r = requests.post(f'{SUPABASE_URL}/rest/v1/market_listings', json=b, headers=_h(), timeout=30)
        if r.status_code in (200, 201):
            n += len(b)
            log.info(f'  Batch {i//BATCH_SIZE+1}: {len(b)} OK')
        else:
            log.error(f'  Batch hatası: {r.status_code} {r.text[:100]}')
    return n

def sb_log(server: str, status: str, count: int, err: Optional[str], ms: int):
    try:
        requests.post(f'{SUPABASE_URL}/rest/v1/market_scrape_log',
            json={'server': server, 'status': status, 'items_count': count, 'error_msg': err, 'duration_ms': ms},
            headers=_h(), timeout=10)
    except Exception:
        pass


# ── main ───────────────────────────────────────────────────────────────────────
def main():
    log.info('=' * 60)
    log.info(f'MSGKO Scraper — {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    log.info('=' * 60)
    if not SUPABASE_URL or not SUPABASE_KEY:
        log.error('scripts/.env eksik!')
        sys.exit(1)

    t_start  = time.time()
    results  = asyncio.run(scrape())

    log.info('--- Supabase yazma ---')
    grand = 0
    for db_key, listings in results.items():
        if not listings:
            sb_log(db_key, 'error', 0, 'no listings', 0)
            continue
        t0 = time.time()
        sb_delete(db_key)
        n   = sb_insert(listings)
        grand += n
        ms  = int((time.time()-t0)*1000)
        sb_log(db_key, 'success' if n else 'error', n, None if n else 'insert failed', ms)
        log.info(f'[{db_key}] OK {n} ilan ({ms}ms)')

    log.info('=' * 60)
    log.info(f'Toplam: {grand} ilan - {int((time.time()-t_start)*1000)}ms')
    log.info('=' * 60)

if __name__ == '__main__':
    main()
