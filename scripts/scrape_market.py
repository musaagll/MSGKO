"""
MSGKO Market Scraper v4
========================
- Playwright YOK — pure requests
- REQ_TOKEN HTML'den alınır (var REQ_TOKEN = "...";)
- Kanal rotation: her çalışmada 1 kanal, sırayla devir
- Konsol penceresi yok (pythonw.exe ile çalışır)
- Log: scripts/scraper.log dosyasına yazılır
"""

import os, re, sys, json, time, logging, requests
from datetime import datetime, timezone
from typing import Optional
from dotenv import load_dotenv
from bs4 import BeautifulSoup

# ── Log dosyasına yaz (konsol yok, pencere açılmıyor) ─────────────────────────
_base    = os.path.dirname(os.path.abspath(__file__))
_logfile = os.path.join(_base, 'scraper.log')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(_logfile, encoding='utf-8'),
        logging.StreamHandler(sys.stdout),  # Task Scheduler'da görünmez
    ],
)
log = logging.getLogger('msgko')

# ── Ortam ──────────────────────────────────────────────────────────────────────
load_dotenv(os.path.join(_base, '.env'))
load_dotenv(os.path.join(_base, '..', 'msgko-admin', '.env.local'))
SUPABASE_URL = os.environ.get('SUPABASE_URL') or os.environ.get('NEXT_PUBLIC_SUPABASE_URL', '')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_KEY') or os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')

# ── Sabitler ───────────────────────────────────────────────────────────────────
BASE_URL         = 'https://www.uskopazar.com'
LIMIT            = 192    # sayfa başına max ilan
MAX_PAGES        = 200    # kanal başına max sayfa
BATCH_SIZE       = 500    # Supabase batch
PAGE_SLEEP       = 0.5    # sayfalar arası bekleme (sn)
STATE_FILE       = os.path.join(_base, '.scraper_state')

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


# ── Yardımcılar ────────────────────────────────────────────────────────────────
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

def next_channel() -> tuple[int, str, int, str]:
    """State dosyasından sonraki kanal indeksini al, güncelle."""
    try:
        with open(STATE_FILE) as f:
            last = int(f.read().strip())
    except Exception:
        last = -1
    idx = (last + 1) % len(CHANNELS)
    try:
        with open(STATE_FILE, 'w') as f:
            f.write(str(idx))
    except Exception as e:
        log.warning(f'State yazma hatasi: {e}')
    db_key, server_type, label = CHANNELS[idx]
    return idx, db_key, server_type, label


# ── Session ────────────────────────────────────────────────────────────────────
HEADERS = {
    'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                       'AppleWebKit/537.36 (KHTML, like Gecko) '
                       'Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
}
POST_HEADERS = {
    **HEADERS,
    'X-Requested-With': 'XMLHttpRequest',
    'Accept':           'text/html, */*; q=0.01',
    'Content-Type':     'application/x-www-form-urlencoded; charset=UTF-8',
    'Referer':          f'{BASE_URL}/',
}

class MarketSession:
    def __init__(self):
        self.sess        = requests.Session()
        self.fingerprint = '417c2f83'
        self.token       = ''
        self.sess.headers.update(HEADERS)

    def get_token(self) -> bool:
        """Ana sayfadan REQ_TOKEN al."""
        for attempt in range(3):
            try:
                r = self.sess.get(BASE_URL, timeout=20)
                if r.status_code == 200:
                    m = re.search(
                        r'var\s+REQ_TOKEN\s*=\s*["\']([A-Za-z0-9\-_.=+/]+)["\']',
                        r.text)
                    if m:
                        self.token = m.group(1)
                        log.info(f'Token alindi: {self.token[:20]}...')
                        # POST için header güncelle
                        self.sess.headers.update(POST_HEADERS)
                        return True
                    # reqToken endpoint'ini dene
                    r2 = self.sess.post(
                        f'{BASE_URL}/dashboard/reqToken',
                        headers={**POST_HEADERS, 'Content-Length': '0'},
                        timeout=10)
                    if r2.ok:
                        d = r2.json()
                        if d.get('ok') and d.get('token'):
                            self.token = d['token']
                            log.info(f'Token (endpoint): {self.token[:20]}...')
                            self.sess.headers.update(POST_HEADERS)
                            return True
                    log.warning(f'Token HTML/endpoint bulunamadi (deneme {attempt+1})')
                else:
                    log.warning(f'Ana sayfa HTTP {r.status_code} (deneme {attempt+1})')
            except Exception as e:
                log.warning(f'Token hatasi (deneme {attempt+1}): {e}')
            if attempt < 2:
                time.sleep(15)
        return False

    def refresh_token(self) -> bool:
        """Mevcut session ile hızlı token yenile."""
        try:
            r = self.sess.post(
                f'{BASE_URL}/dashboard/reqToken',
                headers={**POST_HEADERS, 'Content-Length': '0'},
                timeout=10)
            if r.ok:
                d = r.json()
                if d.get('ok') and d.get('token'):
                    self.token = d['token']
                    log.info(f'Token yenilendi: {self.token[:20]}...')
                    return True
        except Exception as e:
            log.warning(f'Token yenileme hatasi: {e}')
        return False

    def fetch(self, server_type: int, page_num: int, label: str) -> Optional[str]:
        """Bir sayfa çek. 429 → bekle+yenile, hata → None."""
        for attempt in range(3):
            try:
                r = self.sess.post(
                    f'{BASE_URL}/dashboard/getItemList',
                    data={
                        'fingerprint':  self.fingerprint,
                        'req_token':    self.token,
                        'pageCount':    page_num,
                        'merchantType': 0,
                        'orderType':    0,   # 0 = ucuzdan pahalıya → tüm fiyat aralığı
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
                if r.status_code == 200:
                    return r.text
                elif r.status_code == 429:
                    wait = 60 * (attempt + 1)  # 60, 120, 180 sn
                    log.warning(f'  [{label}] p{page_num} → 429 — {wait}sn bekleniyor')
                    time.sleep(wait)
                    self.refresh_token() or self.get_token()
                else:
                    log.warning(f'  [{label}] p{page_num} → HTTP {r.status_code}')
                    if attempt < 2:
                        time.sleep(5)
                    else:
                        return None
            except requests.Timeout:
                log.warning(f'  [{label}] p{page_num} → Timeout (deneme {attempt+1})')
                time.sleep(10)
            except requests.ConnectionError as e:
                log.warning(f'  [{label}] p{page_num} → Baglanti hatasi: {e}')
                time.sleep(15)
            except Exception as e:
                log.warning(f'  [{label}] p{page_num} → Hata: {e}')
                time.sleep(10)
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
        raw_name = ''
        name_span = cells[0].find('span', class_='white')
        if name_span:
            raw_name = name_span.get_text(strip=True)
        if not raw_name:
            trunc = cells[0].find('span', class_='truncate')
            if trunc:
                inner = trunc.find('span')
                raw_name = inner.get_text(strip=True) if inner else trunc.get_text(strip=True)
        if not raw_name:
            raw_name = cells[0].get_text(separator=' ', strip=True).split('\n')[0].strip()
        raw_name = raw_name.strip()
        if not raw_name:
            continue

        # ── Görsel ────────────────────────────────────────────────────────────
        img = cells[0].find('img')
        img_url = img.get('src') if img else None

        # ── Upgrade seviyesi ──────────────────────────────────────────────────
        upgrade_level: Optional[int] = None
        tippy = cells[0].find(attrs={'data-tippy-content': True})
        if tippy:
            tc = tippy.get('data-tippy-content', '')
            m = re.search(r'\(\+(\d+)\)', tc)
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

        # ── Fiyat ─────────────────────────────────────────────────────────────
        price_el = None
        if len(cells) > 3:
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

        # ── Lokasyon (td[2] → button data-x data-z) ──────────────────────────
        loc_x: Optional[int] = None
        loc_z: Optional[int] = None
        if len(cells) > 2:
            loc_btn = cells[2].find('button')
            if loc_btn:
                try:
                    loc_x = int(loc_btn.get('data-x', ''))
                    loc_z = int(loc_btn.get('data-z', ''))
                except (ValueError, TypeError):
                    pass

        # ── Tippy item detayları (item_title, item_type, item_property) ───────
        item_details: Optional[str] = None
        if tippy:
            item_details = tippy.get('data-tippy-content', '') or None

        # ── Tarih ─────────────────────────────────────────────────────────────
        date_val = cells[5].get_text(strip=True) if len(cells) > 5 else None

        pm = price  # Gerçek pazar fiyatı
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
                'source':         'uskopazar.com',
                'img_url':        img_url,
                'raw_name':       item_name,
                'listed_date':    date_val,
                'channel':        channel_key,
                'loc_x':          loc_x,
                'loc_z':          loc_z,
                'item_details':   item_details,
            }, ensure_ascii=False),
        })
    return results


# ── Supabase ───────────────────────────────────────────────────────────────────
def _sb_h() -> dict:
    return {
        'apikey':        SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type':  'application/json',
        'Prefer':        'return=minimal',
    }

def sb_delete(server_key: str) -> None:
    try:
        requests.delete(
            f'{SUPABASE_URL}/rest/v1/market_listings?server=eq.{server_key}',
            headers=_sb_h(), timeout=30)
    except Exception as e:
        log.warning(f'DELETE hatasi: {e}')

def sb_insert(listings: list[dict]) -> int:
    n = 0
    for i in range(0, len(listings), BATCH_SIZE):
        batch = listings[i:i + BATCH_SIZE]
        try:
            r = requests.post(
                f'{SUPABASE_URL}/rest/v1/market_listings',
                json=batch, headers=_sb_h(), timeout=60)
            if r.status_code in (200, 201):
                n += len(batch)
            else:
                log.error(f'INSERT hatasi: {r.status_code} {r.text[:100]}')
        except Exception as e:
            log.error(f'INSERT exception: {e}')
    return n

def sb_log(server: str, status: str, count: int, err: Optional[str], ms: int) -> None:
    try:
        requests.post(
            f'{SUPABASE_URL}/rest/v1/market_scrape_log',
            json={'server': server, 'status': status,
                  'items_count': count, 'error_msg': err, 'duration_ms': ms},
            headers=_sb_h(), timeout=10)
    except Exception:
        pass


# ── main ───────────────────────────────────────────────────────────────────────
def main() -> None:
    t_start = time.time()
    log.info('=' * 60)
    log.info(f'MSGKO Scraper v4 — {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')

    if not SUPABASE_URL or not SUPABASE_KEY:
        log.error('SUPABASE_URL / SUPABASE_SERVICE_KEY eksik!')
        sys.exit(1)

    # Hangi kanalı çekeceğimizi belirle
    idx, db_key, server_type, label = next_channel()
    log.info(f'Kanal [{idx}]: {label} (serverType={server_type})')

    # Token al
    sess = MarketSession()
    if not sess.get_token():
        log.warning('Token alinamadi — site erisilemez, run atlaniyor')
        sys.exit(0)

    # İlk sayfa + bağlantı testi (aynı istek)
    log.info(f'[{label}] Sayfa 1 cekiliyor...')
    first_html = None
    for wait in [0, 60, 120]:
        if wait:
            log.info(f'{wait}sn bekleniyor...')
            time.sleep(wait)
            sess.refresh_token() or sess.get_token()
        try:
            r = sess.sess.post(
                f'{BASE_URL}/dashboard/getItemList',
                data={
                    'fingerprint': sess.fingerprint,
                    'req_token':   sess.token,
                    'pageCount': 1, 'merchantType': 0, 'orderType': 0,
                    'limitType': LIMIT, 'serverType': server_type,
                    'searchType': 0, 'itemType': 0, 'minVal': 0, 'maxVal': 0,
                    'Item_Arti': 0, 'tarih': '',
                },
                timeout=25,
            )
            if r.status_code == 200:
                first_html = r.text
                log.info('Baglanti OK!')
                break
            log.warning(f'Sayfa 1: HTTP {r.status_code}')
        except Exception as e:
            log.warning(f'Sayfa 1 hatasi: {e}')

    if not first_html:
        log.warning('Site engelliyor — run atlaniyor')
        sys.exit(0)

    # Tüm sayfaları çek
    now = datetime.now(timezone.utc).isoformat()
    all_listings: list[dict] = []
    consecutive_empty = 0

    for pg in range(1, MAX_PAGES + 1):
        html = first_html if pg == 1 else sess.fetch(server_type, pg, label)

        if html is None:
            log.warning(f'  [{label}] Sayfa {pg} alinamadi — bitti')
            break

        listings = parse_html(html, db_key, now)

        if not listings:
            consecutive_empty += 1
            log.info(f'  [{label}] Sayfa {pg}: 0 ilan (bos: {consecutive_empty})')
            if consecutive_empty >= 2:
                break
            time.sleep(PAGE_SLEEP)
            continue

        consecutive_empty = 0
        all_listings.extend(listings)
        log.info(f'  [{label}] Sayfa {pg:3d}: {len(listings):3d} ilan '
                 f'(toplam={len(all_listings):5d}, {int(time.time()-t_start)}s)')

        if len(listings) < LIMIT:
            log.info(f'  [{label}] Son sayfa — bitti')
            break
        time.sleep(PAGE_SLEEP)

    log.info(f'[{label}] TOPLAM: {len(all_listings)} ilan')

    # Supabase'e yaz
    if all_listings:
        t0 = time.time()
        sb_delete(db_key)
        n = sb_insert(all_listings)
        ms = int((time.time() - t0) * 1000)
        sb_log(db_key, 'success' if n else 'error', n,
               None if n else 'insert failed', ms)
        log.info(f'[{db_key}] {n} ilan yazildi ({ms}ms)')
    else:
        sb_log(db_key, 'error', 0, 'no listings', 0)
        log.warning(f'[{db_key}] ilan yok')

    log.info(f'Tamamlandi — {int(time.time()-t_start)}sn')
    log.info('=' * 60)


if __name__ == '__main__':
    main()
