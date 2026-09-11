"""
MSGKO Market Scraper — Tam Versiyon v2
========================================
uskopazar.com /dashboard/getItemList API'si ile veri çeker.

Nasıl çalışır:
  1. Playwright ile req_token + cookie al (başta 1 kez, 429 sonrası yeniden)
  2. requests ile pageCount loop → tüm sayfaları çek (192/sayfa)
  3. HTML parse: span.white = item adı, span[style=color:red] = fiyat
  4. Supabase'e DELETE + batch INSERT (upsert değil — tam taze veri)

Parse yapısı (debug_parse.py + check_sample.py ile doğrulandı):
  td[0] → span.white = item adı  |  img.src = görsel
  td[1] → text = satıcı
  td[2] → button.item-properties = lokasyon (atla)
  td[3] → span[style=color:red] = fiyat
  td[5] → text = eklenme tarihi

Kanallar ve serverType (check_servertypes.py ile doğrulandı):
  zero3=0, zero4=5, zero5=8, zero8=15
  agartha3=1, agartha4=12
  pandora3=2, pandora4=11
  destan2=4, destan3=13
"""

import os, re, sys, json, time, logging, requests, asyncio
from datetime import datetime, timezone
from typing import Optional
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from urllib.parse import unquote_plus
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

# ── Kanal tanımları ────────────────────────────────────────────────────────────
CHANNELS = [
    ('zero3',    0,  'Zero 3'),
    ('zero4',    5,  'Zero 4'),
    ('zero5',    8,  'Zero 5'),
    ('zero8',    15, 'Zero 8'),
    ('agartha3', 1,  'Agartha 3'),
    ('agartha4', 12, 'Agartha 4'),
    ('pandora3', 2,  'Pandora 3'),
    ('pandora4', 11, 'Pandora 4'),
    ('destan2',  4,  'Destan 2'),
    ('destan3',  13, 'Destan 3'),
]

BASE_URL   = 'https://www.uskopazar.com'
LIMIT      = 192    # sayfa başına max ilan
MAX_PAGES  = 150    # kanal başına max sayfa güvenlik sınırı (~28800 ilan)
BATCH_SIZE = 500    # Supabase insert batch boyutu
# Kanallar arası bekleme — rate limit için kritik
INTER_CHANNEL_SLEEP = 8   # saniye
# Sayfalar arası bekleme
INTER_PAGE_SLEEP    = 0.8  # saniye
# 429 sonrası yeni token al eşiği (kaç üst üste 429)
TOKEN_REFRESH_AFTER = 2


# ── Yardımcılar ────────────────────────────────────────────────────────────────
def parse_price(raw: str) -> Optional[int]:
    """'1.234.567' veya '1,234,567' → int"""
    c = re.sub(r'[^\d]', '', str(raw))
    return int(c) if c else None

def minus_one(p: Optional[int]) -> Optional[int]:
    return (p - 1) if p and p > 1 else p

def parse_upgrade(text: str) -> tuple[str, Optional[int]]:
    """'Iron Sword (+7)' → ('Iron Sword', 7)"""
    m = re.search(r'\(\+(\d+)\)', text)
    if m:
        return text[:m.start()].strip(), int(m.group(1))
    m2 = re.search(r'(?<!\w)\+(\d+)\s*$', text.strip())
    if m2:
        return text[:m2.start()].strip(), int(m2.group(1))
    return text.strip(), None


# ── Playwright token alıcı ─────────────────────────────────────────────────────
async def _pw_get_token() -> Optional[dict]:
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        log.error('playwright yuklu degil!')
        return None

    captured: dict = {}
    try:
        async with async_playwright() as pw:
            browser = await pw.chromium.launch(
                headless=True,
                args=['--no-sandbox', '--disable-dev-shm-usage',
                      '--disable-blink-features=AutomationControlled'])
            ctx = await browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                           'AppleWebKit/537.36 (KHTML, like Gecko) '
                           'Chrome/124.0.0.0 Safari/537.36',
                locale='tr-TR',
            )
            await ctx.add_init_script(
                "Object.defineProperty(navigator,'webdriver',{get:()=>undefined});")
            page = await ctx.new_page()

            async def on_req(req):
                if 'getItemList' in req.url:
                    body = req.post_data or ''
                    params: dict = {}
                    for p in body.split('&'):
                        if '=' in p:
                            k, _, v = p.partition('=')
                            params[k] = unquote_plus(v)
                    if params.get('req_token'):
                        captured['req_token']   = params['req_token']
                        captured['fingerprint'] = params.get('fingerprint', '417c2f83')
                        log.info(f'Token yakalandi: {params["req_token"][:20]}...')

            page.on('request', on_req)

            log.info('Sayfa yukleniyor...')
            await page.goto(BASE_URL, wait_until='networkidle', timeout=45_000)
            await page.wait_for_timeout(3_000)

            # Popup kapat
            for txt in ['Bugünlük kapat', 'Kapat', 'Close']:
                el = page.locator(f'text={txt}')
                if await el.count() > 0:
                    await el.first.click()
                    await page.wait_for_timeout(500)
                    break

            log.info(f'Sayfa title: {await page.title()}')
            log.info(f'Token durumu: {"var" if captured.get("req_token") else "yok"}')

            # Token alındı mı kontrol et
            if not captured.get('req_token'):
                # Butonları dene
                for btn_id in ['btn_zero3', 'btn_zero4', 'btn_agartha3', 'btn_pandora3']:
                    try:
                        count = await page.locator(f'#{btn_id}').count()
                        log.info(f'  {btn_id} count={count}')
                        if count > 0:
                            await page.locator(f'#{btn_id}').click()
                            await page.wait_for_timeout(5_000)
                            if captured.get('req_token'):
                                break
                    except Exception as e:
                        log.warning(f'  {btn_id} hata: {e}')

            # Hâlâ yok — JS fetch dene
            if not captured.get('req_token'):
                log.info('JS fetch deneniyor...')
                try:
                    await page.evaluate("""
                        window.__kiroFetch = fetch('/dashboard/getItemList', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded',
                                      'X-Requested-With': 'XMLHttpRequest'},
                            body: 'pageCount=1&merchantType=0&orderType=0&limitType=1&serverType=0&searchType=0&itemType=0&minVal=0&maxVal=0&Item_Arti=0&tarih='
                        });
                    """)
                    await page.wait_for_timeout(4_000)
                except Exception as e:
                    log.warning(f'JS fetch hata: {e}')

            cookies = {c['name']: c['value']
                       for c in await ctx.cookies()
                       if 'uskopazar' in c.get('domain', '')}
            captured['cookies'] = cookies
            log.info(f'Cookies: {list(cookies.keys())}')
            await browser.close()
    except Exception as e:
        log.error(f'Playwright hatasi: {e}')
        return None

    return captured if captured.get('req_token') else None


# ── Session ────────────────────────────────────────────────────────────────────
class MarketSession:
    def __init__(self):
        self.sess        = requests.Session()
        self.fingerprint = '417c2f83'
        self.req_token   = ''
        self._consecutive_429 = 0
        self.sess.headers.update({
            'User-Agent':       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                                'AppleWebKit/537.36 (KHTML, like Gecko) '
                                'Chrome/124.0.0.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept':           'text/html, */*; q=0.01',
            'Content-Type':     'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer':          f'{BASE_URL}/',
        })

    def init(self) -> bool:
        log.info('Token aliniyor (Playwright)...')
        data = asyncio.run(_pw_get_token())
        if not data:
            log.warning('Playwright token alinamadi — cookies olmadan deneniyor...')
            # Token olmadan da bazen çalışıyor — siteyi ziyaret edip cookie al
            try:
                r = self.sess.get(BASE_URL, timeout=15)
                if r.status_code == 200:
                    log.info('Cookies alindi (token olmadan)')
                    self.req_token = 'no-token'
                    return True
            except Exception as e:
                log.error(f'Fallback da basarisiz: {e}')
            return False
        self.fingerprint = data.get('fingerprint', '417c2f83')
        self.req_token   = data.get('req_token', '')
        self._consecutive_429 = 0
        for k, v in data.get('cookies', {}).items():
            self.sess.cookies.set(k, v, domain='www.uskopazar.com')
        log.info(f'Token: {self.req_token[:28]}...')
        return bool(self.req_token)

    def _post(self, server_type: int, page_num: int) -> Optional[requests.Response]:
        return self.sess.post(
            f'{BASE_URL}/dashboard/getItemList',
            data={
                'fingerprint':  self.fingerprint,
                'req_token':    self.req_token,
                'pageCount':    page_num,
                'merchantType': 0,
                'orderType':    0,
                'limitType':    LIMIT,
                'serverType':   server_type,
                'searchType':   0,
                'itemType':     0,
                'minVal':       0,
                'maxVal':       0,
                'Item_Arti':    0,
                'tarih':        '',
            },
            timeout=25,
        )

    def fetch_page(self, server_type: int, page_num: int, label: str) -> Optional[str]:
        """
        Bir sayfayı çek.
        - 200 → veriyi döndür
        - 429 → 1 kez 20sn bekle + token yenile, tekrar dene; hâlâ 429 → None döndür (kanal bitti say)
        - Diğer hata → 2 retry
        """
        for attempt in range(3):
            try:
                r = self._post(server_type, page_num)

                if r.status_code == 200:
                    self._consecutive_429 = 0
                    return r.text

                elif r.status_code == 429:
                    self._consecutive_429 += 1
                    log.warning(f'  [{label}] p{page_num} → 429 (deneme {attempt+1}/3)')

                    if attempt == 0:
                        # İlk 429: 20sn bekle, token yenile
                        log.info('  20sn bekleniyor + token yenileniyor...')
                        time.sleep(20)
                        self.init()
                    elif attempt == 1:
                        # İkinci 429: 40sn daha bekle
                        log.info('  40sn bekleniyor...')
                        time.sleep(40)
                    else:
                        # Üçüncü 429: bu kanal için sayfa çekimi bitti
                        log.info(f'  [{label}] 3 kez 429 — kanal tamamlandı sayılıyor')
                        return None

                else:
                    log.warning(f'  [{label}] p{page_num} → HTTP {r.status_code}')
                    if attempt < 2:
                        time.sleep(5)
                    else:
                        return None

            except requests.RequestException as e:
                log.warning(f'  [{label}] p{page_num} istek hatasi: {e}')
                time.sleep(5 * (attempt + 1))

        return None


# ── HTML Parser ────────────────────────────────────────────────────────────────
def parse_html(html: str, channel_key: str, now: str) -> list[dict]:
    soup = BeautifulSoup(html, 'lxml')
    rows = soup.select('tbody tr')
    if not rows:
        rows = [tr for tr in soup.find_all('tr') if tr.find('td')]

    results: list[dict] = []
    for row in rows:
        cells = row.find_all('td')
        if len(cells) < 4:
            continue

        # ── Item adı ──────────────────────────────────────────────────────────
        name_span = cells[0].find('span', class_='white')
        if name_span:
            raw_name = name_span.get_text(strip=True)
        else:
            trunc = cells[0].find('span', class_='truncate')
            if trunc:
                inner = trunc.find('span')
                raw_name = inner.get_text(strip=True) if inner else trunc.get_text(strip=True)
            else:
                raw_name = cells[0].get_text(strip=True).split('\n')[0].strip()

        raw_name = raw_name.strip()
        if not raw_name:
            continue

        # ── Görsel URL ────────────────────────────────────────────────────────
        img = cells[0].find('img')
        img_url = img.get('src') if img else None

        # ── Upgrade seviyesi ──────────────────────────────────────────────────
        tippy = cells[0].find(attrs={'data-tippy-content': True})
        upgrade_level: Optional[int] = None
        if tippy:
            tippy_html = tippy.get('data-tippy-content', '')
            m = re.search(r'\(\+(\d+)\)', tippy_html)
            if m:
                upgrade_level = int(m.group(1))
                raw_name = re.sub(r'\(\+\d+\)', '', raw_name).strip()

        if upgrade_level is None:
            raw_name, upgrade_level = parse_upgrade(raw_name)

        item_name = raw_name.strip()
        if not item_name:
            continue

        # ── Satıcı ────────────────────────────────────────────────────────────
        seller = cells[1].get_text(strip=True) if len(cells) > 1 else None

        # ── Fiyat: span[style*=color:red] ────────────────────────────────────
        price_el = None
        if len(cells) > 3:
            # BeautifulSoup style= bazen dict, bazen string
            for sp in cells[3].find_all('span'):
                st = sp.get('style', '')
                if isinstance(st, str) and 'color' in st and 'red' in st:
                    price_el = sp
                    break
            if not price_el:
                price_el = cells[3].find('span')
        price_raw = price_el.get_text(strip=True) if price_el else ''
        if not price_raw and len(cells) > 3:
            price_raw = cells[3].get_text(strip=True).split('\n')[0].strip()
        price = parse_price(price_raw)
        if not price or price <= 0:
            continue

        # ── Liste tarihi ──────────────────────────────────────────────────────
        date_val = cells[5].get_text(strip=True) if len(cells) > 5 else None

        pm = minus_one(price)
        results.append({
            'server':         channel_key,
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
                'raw_name':       item_name,
                'listed_date':    date_val,
                'channel':        channel_key,
            }, ensure_ascii=False),
        })

    return results


# ── Scraper ana döngüsü ────────────────────────────────────────────────────────
def scrape_all_channels(sess: MarketSession) -> dict[str, list[dict]]:
    results: dict[str, list[dict]] = {}

    for ch_idx, (db_key, server_type, label) in enumerate(CHANNELS):
        log.info(f'━━━ [{ch_idx+1}/{len(CHANNELS)}] {label} (serverType={server_type}) ━━━')
        all_listings: list[dict] = []
        t0   = time.time()
        now  = datetime.now(timezone.utc).isoformat()
        consecutive_empty = 0

        for pg in range(1, MAX_PAGES + 1):
            html = sess.fetch_page(server_type, pg, label)

            if html is None:
                log.warning(f'  [{label}] Sayfa {pg} alinamadi (429 veya hata) — kanal sonlandırılıyor')
                break  # çekilen ilanlar results'a yazılacak

            listings = parse_html(html, db_key, now)

            if not listings:
                consecutive_empty += 1
                log.info(f'  [{label}] Sayfa {pg}: 0 ilan (ard arda bos: {consecutive_empty})')
                if consecutive_empty >= 2:
                    log.info(f'  [{label}] 2 ard arda bos sayfa → bitti')
                    break
                time.sleep(INTER_PAGE_SLEEP)
                continue

            consecutive_empty = 0
            all_listings.extend(listings)
            elapsed = int(time.time() - t0)
            log.info(f'  [{label}] Sayfa {pg}: {len(listings):3d} ilan  '
                     f'(toplam={len(all_listings):5d}, {elapsed}s)')

            # Son sayfa kontrolü
            if len(listings) < LIMIT:
                log.info(f'  [{label}] Son sayfa ({len(listings)} < {LIMIT}) — bitti')
                break

            time.sleep(INTER_PAGE_SLEEP)

        ms = int((time.time() - t0) * 1000)
        log.info(f'  [{label}] TOPLAM: {len(all_listings)} ilan ({ms}ms)')
        results[db_key] = all_listings

        if ch_idx < len(CHANNELS) - 1:
            log.info(f'  Sonraki kanal icin {INTER_CHANNEL_SLEEP}sn bekleniyor...')
            time.sleep(INTER_CHANNEL_SLEEP)

    return results


# ── Supabase ───────────────────────────────────────────────────────────────────
def _sb_headers() -> dict:
    return {
        'apikey':        SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type':  'application/json',
        'Prefer':        'return=minimal',
    }

def sb_delete(server_key: str) -> None:
    r = requests.delete(
        f'{SUPABASE_URL}/rest/v1/market_listings?server=eq.{server_key}',
        headers=_sb_headers(), timeout=30,
    )
    if r.status_code not in (200, 204):
        log.warning(f'  DELETE hatasi [{server_key}]: {r.status_code}')

def sb_insert(listings: list[dict]) -> int:
    inserted = 0
    for i in range(0, len(listings), BATCH_SIZE):
        batch = listings[i:i + BATCH_SIZE]
        r = requests.post(
            f'{SUPABASE_URL}/rest/v1/market_listings',
            json=batch, headers=_sb_headers(), timeout=60,
        )
        if r.status_code in (200, 201):
            inserted += len(batch)
        else:
            log.error(f'  INSERT hatasi ({i}..{i+len(batch)}): '
                      f'{r.status_code} {r.text[:200]}')
    return inserted

def sb_log(server: str, status: str, count: int,
           err: Optional[str], ms: int) -> None:
    try:
        requests.post(
            f'{SUPABASE_URL}/rest/v1/market_scrape_log',
            json={
                'server':       server,
                'status':       status,
                'items_count':  count,
                'error_msg':    err,
                'duration_ms':  ms,
            },
            headers=_sb_headers(), timeout=10,
        )
    except Exception:
        pass


# ── main ───────────────────────────────────────────────────────────────────────
def main() -> None:
    log.info('=' * 65)
    log.info(f'MSGKO Scraper v2 — {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    log.info(f'Kanallar: {", ".join(c[0] for c in CHANNELS)}')
    log.info('=' * 65)

    if not SUPABASE_URL or not SUPABASE_KEY:
        log.error('SUPABASE_URL / SUPABASE_SERVICE_KEY eksik!')
        sys.exit(1)

    sess = MarketSession()
    if not sess.init():
        sys.exit(1)

    # Bağlantı testi — hemen 429 geliyorsa bekle
    log.info('Baglanti testi yapiliyor...')
    for wait_secs in [0, 30, 60, 120]:
        if wait_secs > 0:
            log.info(f'Site engeli var, {wait_secs}sn bekleniyor...')
            time.sleep(wait_secs)
            sess.init()
        test_r = sess.sess.post(
            f'{BASE_URL}/dashboard/getItemList',
            data={
                'fingerprint': sess.fingerprint,
                'req_token':   sess.req_token,
                'pageCount': 1, 'merchantType': 0, 'orderType': 0,
                'limitType': 1, 'serverType': 0,
                'searchType': 0, 'itemType': 0, 'minVal': 0, 'maxVal': 0,
                'Item_Arti': 0, 'tarih': '',
            },
            timeout=15,
        )
        if test_r.status_code == 200:
            log.info('Baglanti OK!')
            break
        log.warning(f'Test: HTTP {test_r.status_code}')
    else:
        log.error('Site hala engeliyor — scraper durduruluyor!')
        sys.exit(1)

    t_start = time.time()
    results = scrape_all_channels(sess)

    log.info('')
    log.info('━━━ Supabase yazma ━━━')
    grand_total = 0
    for db_key, listings in results.items():
        if not listings:
            log.warning(f'[{db_key}] ilan yok — atlandı')
            sb_log(db_key, 'error', 0, 'no listings', 0)
            continue
        t0 = time.time()
        sb_delete(db_key)
        n  = sb_insert(listings)
        grand_total += n
        ms = int((time.time() - t0) * 1000)
        sb_log(db_key, 'success' if n else 'error', n,
               None if n else 'insert failed', ms)
        log.info(f'  [{db_key}] {n:5d} ilan yazildi ({ms}ms)')

    total_ms = int((time.time() - t_start) * 1000)
    log.info('=' * 65)
    log.info(f'TOPLAM: {grand_total} ilan — {total_ms // 1000}sn ({total_ms}ms)')
    log.info('=' * 65)


if __name__ == '__main__':
    main()
