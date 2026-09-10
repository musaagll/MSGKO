"""
MSGKO — USKO Pazar Scraper
==========================
mgame.com.tr pazar sayfasından item ilanlarını çeker,
Supabase'e yazar. Her 5 dakikada bir çalıştırılır.

Kurulum:
    pip install requests beautifulsoup4 supabase python-dotenv

Çalıştırma:
    python scripts/scrape_market.py

Cron (Linux/Mac):
    */5 * * * * /usr/bin/python3 /path/to/scripts/scrape_market.py >> /var/log/msgko_scraper.log 2>&1

Windows Task Scheduler:
    Her 5 dakikada bir: python scrape_market.py
"""

import os
import re
import sys
import time
import json
import logging
from datetime import datetime, timezone
from typing import Optional

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# ── Ortam değişkenleri ─────────────────────────────────────────────────────────
# .env veya sistem ortam değişkenlerinden yükle
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'msgko-admin', '.env.local'))
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'msgko-app', '.env.local'))

SUPABASE_URL      = os.environ.get('NEXT_PUBLIC_SUPABASE_URL', '')
SUPABASE_KEY      = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
# Scraper için ayrı .env dosyası da destekleniyor
if not SUPABASE_URL or not SUPABASE_KEY:
    load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
    SUPABASE_URL  = os.environ.get('SUPABASE_URL', SUPABASE_URL)
    SUPABASE_KEY  = os.environ.get('SUPABASE_SERVICE_KEY', SUPABASE_KEY)

# ── Logging ────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
log = logging.getLogger('msgko_scraper')

# ── Sunucu tanımları ───────────────────────────────────────────────────────────
# mgame.com.tr pazar URL yapısı:
#   /knight/tr/market?server=<serverNo>&page=<page>
# Server numaraları resmi siteden alınmıştır.
SERVERS = {
    'zero':    1,
    'agartha': 2,
    'pandora': 3,
    'destan':  5,
}

BASE_URL   = 'https://www.nttgame.com/knight/tr/market'
HEADERS    = {
    'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Accept':          'text/html,application/xhtml+xml,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Referer':         'https://www.nttgame.com/knight/tr/',
}
REQUEST_TIMEOUT = 30    # saniye
MAX_PAGES       = 50    # sunucu başına maksimum sayfa
DELAY_BETWEEN   = 1.0   # istekler arası bekleme (saniye) — rate limiting için
BATCH_SIZE      = 200   # Supabase'e tek seferde insert edilecek kayıt sayısı


# ── Fiyat parser ───────────────────────────────────────────────────────────────
def parse_price(price_str: str) -> Optional[int]:
    """'1.234.567' veya '1,234,567' formatındaki fiyatı integer'a çevirir."""
    if not price_str:
        return None
    cleaned = re.sub(r'[^\d]', '', str(price_str))
    try:
        return int(cleaned) if cleaned else None
    except ValueError:
        return None


def parse_upgrade_level(name: str) -> tuple[str, Optional[int]]:
    """
    'Raptor +9' → ('Raptor', 9)
    'Chitin Shell Helmet' → ('Chitin Shell Helmet', None)
    """
    match = re.search(r'\+(\d+)\s*$', name.strip())
    if match:
        level = int(match.group(1))
        clean_name = name[:match.start()].strip()
        return clean_name, level
    return name.strip(), None


# ── HTML Parser ────────────────────────────────────────────────────────────────
def parse_market_page(html: str, server: str) -> list[dict]:
    """
    mgame.com.tr pazar sayfasının HTML'ini parse eder.
    İlan listesini dict listesi olarak döndürür.
    
    NOT: Sayfa yapısı değişirse bu fonksiyonu güncelle.
    Mevcut yapı: <table class="market-list"> veya benzeri tablo/liste yapısı.
    """
    soup = BeautifulSoup(html, 'html.parser')
    listings = []
    now = datetime.now(timezone.utc).isoformat()

    # ── Yöntem 1: JSON embed (sayfada __NEXT_DATA__ veya window.__data__ varsa) ─
    # Bazı modern sayfalar JSON'ı direkt HTML içine gömer
    script_tags = soup.find_all('script', type='application/json')
    for script in script_tags:
        try:
            data = json.loads(script.string)
            items = _extract_from_json(data, server, now)
            if items:
                log.info(f"  JSON embed yöntemiyle {len(items)} ilan bulundu")
                return items
        except Exception:
            pass

    # __NEXT_DATA__ kontrolü
    next_data = soup.find('script', id='__NEXT_DATA__')
    if next_data:
        try:
            data = json.loads(next_data.string)
            items = _extract_from_json(data, server, now)
            if items:
                log.info(f"  __NEXT_DATA__ yöntemiyle {len(items)} ilan bulundu")
                return items
        except Exception:
            pass

    # ── Yöntem 2: Tablo yapısı (klasik HTML tablo) ─────────────────────────────
    # mgame pazar sayfasındaki muhtemel tablo selector'ları
    table_selectors = [
        'table.market-list',
        'table.market_list', 
        'table.tb_market',
        '#market_list table',
        '.market-items table',
        'table.list',
        'table',  # fallback — ilk tablo
    ]
    
    market_table = None
    for selector in table_selectors:
        market_table = soup.select_one(selector)
        if market_table:
            log.debug(f"  Tablo selector: {selector}")
            break

    if market_table:
        rows = market_table.find_all('tr')
        for row in rows[1:]:  # başlık satırını atla
            cells = row.find_all(['td', 'th'])
            if len(cells) < 3:
                continue
            try:
                listing = _parse_table_row(cells, server, now)
                if listing:
                    listings.append(listing)
            except Exception as e:
                log.debug(f"  Satır parse hatası: {e}")
        
        if listings:
            log.info(f"  Tablo yöntemiyle {len(listings)} ilan bulundu")
            return listings

    # ── Yöntem 3: Liste/card yapısı ────────────────────────────────────────────
    item_selectors = [
        '.market-item',
        '.item-listing',
        '.market_item',
        'li.item',
        '.list-item',
    ]
    
    for selector in item_selectors:
        items_el = soup.select(selector)
        if items_el:
            for item_el in items_el:
                try:
                    listing = _parse_list_item(item_el, server, now)
                    if listing:
                        listings.append(listing)
                except Exception as e:
                    log.debug(f"  List item parse hatası: {e}")
            if listings:
                log.info(f"  Liste yöntemiyle ({selector}) {len(listings)} ilan bulundu")
                return listings

    log.warning(f"  [{server}] Hiç ilan bulunamadı — sayfa yapısı tanınamıyor")
    return listings


def _extract_from_json(data: dict, server: str, now: str) -> list[dict]:
    """JSON embed'den item listesini çıkar."""
    listings = []
    # Yaygın JSON yapıları için dene
    possible_paths = [
        data.get('props', {}).get('pageProps', {}).get('items', []),
        data.get('props', {}).get('pageProps', {}).get('marketItems', []),
        data.get('items', []),
        data.get('marketItems', []),
        data.get('data', {}).get('items', []) if isinstance(data.get('data'), dict) else [],
        data.get('list', []),
    ]
    
    for item_list in possible_paths:
        if not isinstance(item_list, list) or not item_list:
            continue
        for item in item_list:
            if not isinstance(item, dict):
                continue
            # Olası alan adları
            name = (item.get('itemName') or item.get('item_name') or
                    item.get('name') or item.get('item') or '')
            price = parse_price(str(item.get('price') or item.get('noah') or 0))
            count = int(item.get('count') or item.get('quantity') or item.get('qty') or 1)
            seller = item.get('seller') or item.get('sellerName') or item.get('charName') or ''
            
            if name and price:
                clean_name, upgrade = parse_upgrade_level(name)
                listings.append({
                    'server': server,
                    'item_name': clean_name,
                    'item_count': count,
                    'upgrade_level': upgrade,
                    'price': price,
                    'price_per_unit': price // count if count > 0 else price,
                    'seller_name': seller or None,
                    'scraped_at': now,
                    'raw_data': item,
                })
        if listings:
            return listings
    return listings


def _parse_table_row(cells, server: str, now: str) -> Optional[dict]:
    """HTML tablo satırından ilan bilgisi çıkar."""
    # Hücre sayısına göre farklı mapping dene
    # Genellikle: [İtem Adı] [Adet] [Fiyat] [Satıcı] veya [İtem Adı] [Fiyat] [Satıcı]
    texts = [c.get_text(strip=True) for c in cells]
    
    if len(texts) < 2:
        return None
    
    # İsim genellikle ilk hücrede
    name = texts[0]
    if not name or name.lower() in ('item', 'items', 'name', 'isim', 'item adı'):
        return None
    
    # Fiyatı bul — sayısal olan hücreyi ara
    price = None
    count = 1
    seller = None
    
    for i, text in enumerate(texts[1:], 1):
        # Fiyat mı? (sadece rakam ve nokta/virgül)
        if re.match(r'^[\d.,]+$', text.replace(' ', '')):
            candidate = parse_price(text)
            if candidate and candidate > 0:
                if price is None:
                    price = candidate
                elif price and candidate < price:
                    # Daha küçük sayı adet olabilir
                    count = candidate
        # Satıcı adı (harf içeriyor ve çok büyük değil)
        elif text and not re.match(r'^[\d.,]+$', text) and len(text) < 50:
            if i == len(texts) - 1:  # son hücre genellikle satıcı
                seller = text

    if not name or not price:
        return None

    clean_name, upgrade = parse_upgrade_level(name)
    return {
        'server': server,
        'item_name': clean_name,
        'item_count': count,
        'upgrade_level': upgrade,
        'price': price,
        'price_per_unit': price // count if count > 0 else price,
        'seller_name': seller,
        'scraped_at': now,
        'raw_data': {'cells': texts},
    }


def _parse_list_item(el, server: str, now: str) -> Optional[dict]:
    """HTML liste/card elementinden ilan bilgisi çıkar."""
    text = el.get_text(separator=' ', strip=True)
    
    # İsim
    name_el = el.select_one('.item-name, .name, h3, h4, .title, strong')
    name = name_el.get_text(strip=True) if name_el else ''
    
    # Fiyat
    price_el = el.select_one('.price, .noah, .cost, .value, [class*="price"]')
    price_text = price_el.get_text(strip=True) if price_el else ''
    price = parse_price(price_text)
    
    # Eğer bulamazsak metinden çıkarmaya çalış
    if not name:
        numbers = re.findall(r'[\d.,]+', text)
        if numbers:
            price = parse_price(numbers[-1])
        words = re.split(r'\s+\d', text)
        if words:
            name = words[0].strip()

    if not name or not price:
        return None

    clean_name, upgrade = parse_upgrade_level(name)
    
    # Adet
    count_el = el.select_one('.count, .quantity, .qty, .amount')
    count = int(parse_price(count_el.get_text(strip=True)) or 1) if count_el else 1
    
    # Satıcı
    seller_el = el.select_one('.seller, .char, .user, .owner')
    seller = seller_el.get_text(strip=True) if seller_el else None
    
    return {
        'server': server,
        'item_name': clean_name,
        'item_count': count,
        'upgrade_level': upgrade,
        'price': price,
        'price_per_unit': price // count if count > 0 else price,
        'seller_name': seller,
        'scraped_at': datetime.now(timezone.utc).isoformat(),
        'raw_data': {'text': text[:200]},
    }


# ── Sayfa sayısı tespiti ────────────────────────────────────────────────────────
def get_total_pages(soup: BeautifulSoup) -> int:
    """Toplam sayfa sayısını HTML'den çıkar."""
    # Pagination elementleri
    pag_selectors = [
        '.pagination', '.paging', '#pagination',
        'nav[aria-label*="page"]', '.page-nav',
    ]
    for sel in pag_selectors:
        pag = soup.select_one(sel)
        if pag:
            # Son sayfayı bul
            links = pag.find_all('a')
            pages = []
            for link in links:
                t = link.get_text(strip=True)
                if t.isdigit():
                    pages.append(int(t))
            if pages:
                return max(pages)
    
    # "Sayfa X / Y" pattern'i
    text = soup.get_text()
    match = re.search(r'(\d+)\s*/\s*(\d+)', text)
    if match:
        return int(match.group(2))
    
    return 1  # bilinmiyorsa tek sayfa kabul et


# ── HTTP istekleri ─────────────────────────────────────────────────────────────
session = requests.Session()
session.headers.update(HEADERS)


def fetch_page(server_no: int, page: int) -> Optional[str]:
    """Pazar sayfasını indir, HTML döndür."""
    # Deneyeceğimiz URL yapıları — mgame'in gerçek URL'ini bulmak için
    urls_to_try = [
        f'{BASE_URL}?server={server_no}&page={page}',
        f'https://www.nttgame.com/knight/tr/market/list?serverNo={server_no}&page={page}',
        f'https://www.nttgame.com/knight/tr/market/{server_no}?page={page}',
        f'https://www.mgame.com.tr/ko/market?server={server_no}&page={page}',
        f'https://www.mgame.com.tr/ko/market/list?serverNo={server_no}&page={page}',
    ]
    
    for url in urls_to_try:
        try:
            resp = session.get(url, timeout=REQUEST_TIMEOUT, allow_redirects=True)
            if resp.status_code == 200:
                content = resp.text
                # İçerik boş veya login sayfasına yönlendirildiyse atla
                if len(content) > 500 and 'login' not in resp.url.lower():
                    log.debug(f"  URL çalışıyor: {url}")
                    return content
            elif resp.status_code == 403:
                log.warning(f"  403 Forbidden: {url} — auth gerekiyor olabilir")
            elif resp.status_code == 404:
                continue  # bir sonraki URL'i dene
        except requests.RequestException as e:
            log.debug(f"  İstek hatası {url}: {e}")
            continue
    
    return None


# ── Supabase yazıcı ────────────────────────────────────────────────────────────
def supabase_insert_batch(listings: list[dict]) -> bool:
    """Supabase REST API ile toplu insert."""
    if not listings:
        return True
    
    url     = f'{SUPABASE_URL}/rest/v1/market_listings'
    headers = {
        'apikey':        SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type':  'application/json',
        'Prefer':        'return=minimal',
    }
    
    # raw_data JSON serileştir
    payload = []
    for item in listings:
        row = dict(item)
        if 'raw_data' in row and row['raw_data'] is not None:
            row['raw_data'] = json.dumps(row['raw_data'], ensure_ascii=False)
        payload.append(row)
    
    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=30)
        if resp.status_code in (200, 201):
            return True
        else:
            log.error(f"  Supabase insert hatası: {resp.status_code} — {resp.text[:200]}")
            return False
    except requests.RequestException as e:
        log.error(f"  Supabase bağlantı hatası: {e}")
        return False


def supabase_delete_old(server: str) -> bool:
    """Bir sunucunun eski ilanlarını sil (yeni scrape öncesi)."""
    url     = f'{SUPABASE_URL}/rest/v1/market_listings?server=eq.{server}'
    headers = {
        'apikey':        SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Prefer':        'return=minimal',
    }
    try:
        resp = requests.delete(url, headers=headers, timeout=30)
        return resp.status_code in (200, 204)
    except requests.RequestException as e:
        log.error(f"  Supabase delete hatası: {e}")
        return False


def supabase_log_scrape(server: str, status: str, count: int,
                         error: Optional[str], duration_ms: int) -> None:
    """Scrape logunu Supabase'e yaz."""
    url     = f'{SUPABASE_URL}/rest/v1/market_scrape_log'
    headers = {
        'apikey':        SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type':  'application/json',
        'Prefer':        'return=minimal',
    }
    payload = {
        'server':      server,
        'status':      status,
        'items_count': count,
        'error_msg':   error,
        'duration_ms': duration_ms,
    }
    try:
        requests.post(url, json=payload, headers=headers, timeout=10)
    except Exception:
        pass  # log hatası kritik değil


# ── Ana scrape fonksiyonu ──────────────────────────────────────────────────────
def scrape_server(server_name: str, server_no: int) -> int:
    """
    Bir sunucunun tüm pazar ilanlarını çeker.
    Toplam çekilen ilan sayısını döndürür.
    """
    log.info(f"▶ [{server_name.upper()}] Scraping başlıyor (serverNo={server_no})")
    start_time = time.time()
    all_listings: list[dict] = []
    
    page = 1
    max_pages = MAX_PAGES
    
    while page <= max_pages:
        log.info(f"  Sayfa {page}/{max_pages} çekiliyor...")
        
        html = fetch_page(server_no, page)
        
        if html is None:
            log.error(f"  [{server_name}] Sayfa {page} çekilemedi — durduruluyor")
            break
        
        soup = BeautifulSoup(html, 'html.parser')
        
        # İlk sayfada toplam sayfa sayısını tespit et
        if page == 1:
            detected_pages = get_total_pages(soup)
            max_pages = min(detected_pages, MAX_PAGES)
            log.info(f"  Toplam sayfa: {max_pages}")
        
        # İlanları parse et
        listings = parse_market_page(html, server_name)
        
        if not listings:
            log.info(f"  Sayfa {page}: boş — scraping durduruldu")
            break
        
        all_listings.extend(listings)
        log.info(f"  Sayfa {page}: {len(listings)} ilan ({len(all_listings)} toplam)")
        
        page += 1
        
        # Rate limiting — sunucuyu yormamak için bekle
        if page <= max_pages:
            time.sleep(DELAY_BETWEEN)
    
    # Supabase'e yaz
    total_written = 0
    if all_listings:
        log.info(f"  Eski ilanlar siliniyor...")
        supabase_delete_old(server_name)
        
        log.info(f"  {len(all_listings)} ilan Supabase'e yazılıyor...")
        
        # Batch'ler halinde yaz
        for i in range(0, len(all_listings), BATCH_SIZE):
            batch = all_listings[i:i + BATCH_SIZE]
            if supabase_insert_batch(batch):
                total_written += len(batch)
                log.info(f"  Batch {i//BATCH_SIZE + 1}: {len(batch)} ilan yazıldı")
            else:
                log.error(f"  Batch {i//BATCH_SIZE + 1} yazma hatası!")
    else:
        log.warning(f"  [{server_name}] Hiç ilan çekilemedi!")
    
    duration_ms = int((time.time() - start_time) * 1000)
    status = 'success' if total_written > 0 else ('error' if not all_listings else 'partial')
    
    supabase_log_scrape(
        server=server_name,
        status=status,
        count=total_written,
        error=None if total_written > 0 else 'No listings found',
        duration_ms=duration_ms,
    )
    
    log.info(f"✓ [{server_name.upper()}] Tamamlandı: {total_written} ilan ({duration_ms}ms)")
    return total_written


def main():
    """Tüm sunucular için scraping çalıştır."""
    log.info("=" * 60)
    log.info(f"MSGKO Market Scraper — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    log.info("=" * 60)
    
    # Supabase bağlantısını kontrol et
    if not SUPABASE_URL or not SUPABASE_KEY:
        log.error("SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY tanımlı değil!")
        log.error("scripts/.env dosyası oluşturun:")
        log.error("  SUPABASE_URL=https://xxx.supabase.co")
        log.error("  SUPABASE_SERVICE_KEY=eyJ...")
        sys.exit(1)
    
    log.info(f"Supabase: {SUPABASE_URL[:40]}...")
    log.info(f"Sunucular: {', '.join(SERVERS.keys())}")
    log.info("")
    
    total_start = time.time()
    grand_total = 0
    
    for server_name, server_no in SERVERS.items():
        try:
            count = scrape_server(server_name, server_no)
            grand_total += count
        except Exception as e:
            log.error(f"[{server_name}] Beklenmeyen hata: {e}")
            supabase_log_scrape(server_name, 'error', 0, str(e), 0)
        
        log.info("")
        # Sunucular arası bekleme
        time.sleep(2.0)
    
    total_ms = int((time.time() - total_start) * 1000)
    log.info("=" * 60)
    log.info(f"Toplam: {grand_total} ilan, {total_ms}ms")
    log.info("=" * 60)


if __name__ == '__main__':
    main()
