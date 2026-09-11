"""
MSGKO Market Scraper — Tam Versiyon v3 (Playwright YOK)
=========================================================
uskopazar.com /dashboard/getItemList API'si ile veri çeker.

Nasıl çalışır:
  1. Ana sayfaya GET → HTML içindeki REQ_TOKEN'ı regex ile al (Playwright YOK)
     Ya da /dashboard/reqToken POST → yeni token al
  2. requests ile pageCount loop → tüm sayfaları çek (192/sayfa)
  3. HTML parse: span.white = item adı, span[style=color:red] = fiyat
  4. Supabase'e DELETE + batch INSERT

Token: Her sayfa yüklemesinde HTML içinde var:
  var REQ_TOKEN = "eyJ...";
  Ayrıca POST /dashboard/reqToken → {"ok":true,"token":"eyJ..."}

Kanallar ve serverType (doğrulandı):
  zero3=0, zero4=5, zero5=8, zero8=15
  agartha3=1, agartha4=12
  pandora3=2, pandora4=11
  destan2=4, destan3=13
"""

import os, re, sys, json, time, logging, requests
from datetime import datetime, timezone
from typing import Optional
from dotenv import load_dotenv
from bs4 import BeautifulSoup
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

BASE_URL            = 'https://www.uskopazar.com'
LIMIT               = 192    # sayfa başına max ilan
MAX_PAGES           = 150    # kanal başına max sayfa
BATCH_SIZE          = 500    # Supabase insert batch
INTER_PAGE_SLEEP    = 0.5    # sayfalar arası bekleme (sn)


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


# ── Session (Playwright YOK — pure requests) ───────────────────────────────────
class MarketSession:
    def __init__(self):
        self.sess        = requests.Session()
        self.fingerprint = '417c2f83'
        self.req_token   = ''
        self.sess.headers.update({
            'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                               'AppleWebKit/537.36 (KHTML, like Gecko) '
                               'Chrome/124.0.0.0 Safari/537.36',
            'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
            'Accept':          'text/html,application/xhtml+xml,*/*;q=0.8',
        })

    def init(self) -> bool:
        """Ana sayfayı ziyaret et, REQ_TOKEN'ı HTML'den al."""
        log.info('Token aliniyor (requests — Playwright yok)...')

        for attempt in range(3):
            try:
                r = self.sess.get(BASE_URL, timeout=20)
                if r.status_code != 200:
                    log.warning(f'Ana sayfa HTTP {r.status_code}')
                    time.sleep(10)
                    continue

                # 1) HTML içindeki REQ_TOKEN
                m = re.search(
                    r'var\s+REQ_TOKEN\s*=\s*["\']([A-Za-z0-9\-_.=]+)["\']',
                    r.text)
                if m:
                    self.req_token = m.group(1)
                    log.info(f'Token HTML\'den alindi: {self.req_token[:28]}...')
                    # getItemList için header ayarla
                    self.sess.headers.update({
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept':           'text/html, */*; q=0.01',
                        'Content-Type':     'application/x-www-form-urlencoded; charset=UTF-8',
                        'Referer':          f'{BASE_URL}/',
                    })
                    return True

                # 2) /dashboard/reqToken endpoint
                log.info('HTML\'de token yok, /dashboard/reqToken deneniyor...')
                r2 = self.sess.post(
                    f'{BASE_URL}/dashboard/reqToken',
                    headers={'X-Requested-With': 'XMLHttpRequest',
                              'Referer': f'{BASE_URL}/'},
                    timeout=15)
                if r2.status_code == 200:
                    try:
                        d = r2.json()
                        if d.get('ok') and d.get('token'):
                            self.req_token = d['token']
                            log.info(f'Token endpoint\'ten alindi: {self.req_token[:28]}...')
                            self.sess.headers.update({
                                'X-Requested-With': 'XMLHttpRequest',
                                'Accept':           'text/html, */*; q=0.01',
                                'Content-Type':     'application/x-www-form-urlencoded; charset=UTF-8',
                                'Referer':          f'{BASE_URL}/',
                            })
                            return True
                    except Exception:
                        pass

                log.warning(f'Token bulunamadi (deneme {attempt+1}/3)')
                time.sleep(15)

            except requests.RequestException as e:
                log.error(f'Ana sayfa hatasi: {e}')
                time.sleep(15)

        log.error('Token alinamadi!')
        return False

    def refresh_token(self) -> bool:
        """Mevcut session ile yeni token al."""
        try:
            r = self.sess.post(
                f'{BASE_URL}/dashboard/reqToken',
                headers={'X-Requested-With': 'XMLHttpRequest',
                          'Referer': f'{BASE_URL}/'},
                timeout=15)
            if r.status_code == 200:
                d = r.json()
                if d.get('ok') and d.get('token'):
                    self.req_token = d['token']
                    log.info(f'Token yenilendi: {self.req_token[:28]}...')
                    return True
        except Exception as e:
            log.warning(f'Token yenileme hatasi: {e}')
        return False

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
        429 → 1) 60sn bekle + token yenile, 2) 120sn bekle + init,
              3) None dön (kanal bitti).
        """
        for attempt in range(3):
            try:
                r = self._post(server_type, page_num)

                if r.status_code == 200:
                    return r.text

                elif r.status_code == 429:
                    log.warning(f'  [{label}] p{page_num} → 429 (deneme {attempt+1}/3)')
                    if attempt == 0:
                        log.info('  60sn bekleniyor + token yenileniyor...')
                        time.sleep(60)
                        self.refresh_token() or self.init()
                    elif attempt == 1:
                        log.info('  120sn bekleniyor + tam init...')
                        time.sleep(120)
                        self.init()
                    else:
                        log.info(f'  [{label}] 3 kez 429 — kanal sonlandiriliyor')
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

        # ── Görsel ────────────────────────────────────────────────────────────
        img = cells[0].find('img')
        img_url = img.get('src') if img else None

        # ── Upgrade seviyesi ──────────────────────────────────────────────────
        tippy = cells[0].find(attrs={'data-tippy-content': True})
        upgrade_level: Optional[int] = None
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

        # ── Tarih ─────────────────────────────────────────────────────────────
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
                log.warning(f'  [{label}] Sayfa {pg} alinamadi — kanal sonlandiriliyor')
                break

            listings = parse_html(html, db_key, now)

            if not listings:
                consecutive_empty += 1
                log.info(f'  [{label}] Sayfa {pg}: 0 ilan (ard arda bos: {consecutive_empty})')
                if consecutive_empty >= 2:
                    break
                time.sleep(INTER_PAGE_SLEEP)
                continue

            consecutive_empty = 0
            all_listings.extend(listings)
            log.info(f'  [{label}] Sayfa {pg}: {len(listings):3d} ilan  '
                     f'(toplam={len(all_listings):5d}, {int(time.time()-t0)}s)')

            if len(listings) < LIMIT:
                log.info(f'  [{label}] Son sayfa — bitti')
                break

            time.sleep(INTER_PAGE_SLEEP)

        log.info(f'  [{label}] TOPLAM: {len(all_listings)} ilan ({int((time.time()-t0)*1000)}ms)')
        results[db_key] = all_listings

        if ch_idx < len(CHANNELS) - 1:
            log.info(f'  Sonraki kanal icin {INTER_CHANNEL_SLEEP}sn...')
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
        headers=_sb_headers(), timeout=30)
    if r.status_code not in (200, 204):
        log.warning(f'  DELETE hatasi [{server_key}]: {r.status_code}')

def sb_insert(listings: list[dict]) -> int:
    inserted = 0
    for i in range(0, len(listings), BATCH_SIZE):
        batch = listings[i:i + BATCH_SIZE]
        r = requests.post(
            f'{SUPABASE_URL}/rest/v1/market_listings',
            json=batch, headers=_sb_headers(), timeout=60)
        if r.status_code in (200, 201):
            inserted += len(batch)
        else:
            log.error(f'  INSERT hatasi: {r.status_code} {r.text[:200]}')
    return inserted

def sb_log(server: str, status: str, count: int, err: Optional[str], ms: int) -> None:
    try:
        requests.post(
            f'{SUPABASE_URL}/rest/v1/market_scrape_log',
            json={'server': server, 'status': status,
                  'items_count': count, 'error_msg': err, 'duration_ms': ms},
            headers=_sb_headers(), timeout=10)
    except Exception:
        pass


# ── main ───────────────────────────────────────────────────────────────────────
def main() -> None:
    log.info('=' * 65)
    log.info(f'MSGKO Scraper v3 — {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    log.info('=' * 65)

    if not SUPABASE_URL or not SUPABASE_KEY:
        log.error('SUPABASE_URL / SUPABASE_SERVICE_KEY eksik!')
        sys.exit(1)

    # Hangi kanalı çekeceğimizi belirle — sıralı rotation
    # Son çekilen kanalı dosyada tut
    state_file = os.path.join(_base, '.scraper_state')
    try:
        with open(state_file) as f:
            last_idx = int(f.read().strip())
    except Exception:
        last_idx = -1

    # Sonraki kanal
    next_idx = (last_idx + 1) % len(CHANNELS)
    db_key, server_type, label = CHANNELS[next_idx]

    log.info(f'Kanal: {label} ({db_key}, serverType={server_type})')
    log.info(f'Onceki indeks: {last_idx} → Siradaki: {next_idx}')

    sess = MarketSession()
    if not sess.init():
        log.warning('Token alinamadi — bu run atlaniyor.')
        sys.exit(0)

    # Bağlantı testi
    log.info('Baglanti testi...')
    for wait_secs in [0, 60, 120]:
        if wait_secs > 0:
            log.info(f'{wait_secs}sn bekleniyor...')
            time.sleep(wait_secs)
            sess.refresh_token() or sess.init()
        test_r = sess._post(server_type, 1)
        if test_r and test_r.status_code == 200:
            log.info('Baglanti OK!')
            break
        log.warning(f'Test: HTTP {test_r.status_code if test_r else "hata"}')
    else:
        log.warning('Site engelliyor — bu run atlaniyor')
        sys.exit(0)

    # Tek kanalı çek
    t_start = time.time()
    now = datetime.now(timezone.utc).isoformat()
    all_listings: list[dict] = []
    consecutive_empty = 0

    for pg in range(1, MAX_PAGES + 1):
        html = sess.fetch_page(server_type, pg, label)
        if html is None:
            log.warning(f'  [{label}] Sayfa {pg} alinamadi — bitti')
            break

        listings = parse_html(html, db_key, now)
        if not listings:
            consecutive_empty += 1
            if consecutive_empty >= 2:
                break
            time.sleep(INTER_PAGE_SLEEP)
            continue

        consecutive_empty = 0
        all_listings.extend(listings)
        log.info(f'  [{label}] Sayfa {pg}: {len(listings):3d} ilan  '
                 f'(toplam={len(all_listings):5d}, {int(time.time()-t_start)}s)')

        if len(listings) < LIMIT:
            break
        time.sleep(INTER_PAGE_SLEEP)

    log.info(f'[{label}] TOPLAM: {len(all_listings)} ilan ({int(time.time()-t_start)}s)')

    # Supabase'e yaz
    if all_listings:
        t0 = time.time()
        sb_delete(db_key)
        n = sb_insert(all_listings)
        ms = int((time.time() - t0) * 1000)
        sb_log(db_key, 'success' if n else 'error', n, None if n else 'insert failed', ms)
        log.info(f'[{db_key}] {n} ilan yazildi ({ms}ms)')
    else:
        sb_log(db_key, 'error', 0, 'no listings', 0)
        log.warning(f'[{db_key}] ilan yok — Supabase guncellenmedi')

    # State'i güncelle
    try:
        with open(state_file, 'w') as f:
            f.write(str(next_idx))
        log.info(f'State guncellendi: {next_idx}')
    except Exception as e:
        log.warning(f'State yazma hatasi: {e}')

    total_ms = int((time.time() - t_start) * 1000)
    log.info('=' * 65)
    log.info(f'Tamamlandi: {label} — {total_ms // 1000}sn')
    log.info('=' * 65)


if __name__ == '__main__':
    main()
