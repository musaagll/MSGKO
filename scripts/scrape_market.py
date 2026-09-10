"""
MSGKO — USKO Pazar Scraper
==========================
Kaynak: uskopazar.com (Selenium tabanlı)
Hedef:  Supabase market_listings tablosu

Yöntem:
  - uskopazar.com sitesini headless Chrome ile açar
  - Her sunucu için tüm ilanları çeker
  - Fiyatlardan -1 yaparak "en ucuz rakip altı" fiyatı hesaplar
  - Sonuçları Supabase'e yazar

Kurulum:
    pip install -r scripts/requirements.txt

Çalıştırma:
    python scripts/scrape_market.py

Cron (Linux/Mac) — her 5 dakika:
    */5 * * * * cd /path/to/MSGKO && python scripts/scrape_market.py >> /tmp/msgko_scraper.log 2>&1

Windows Task Scheduler:
    Program: python
    Argüman: C:\\...\\MSGKO\\scripts\\scrape_market.py
    Başlangıç: C:\\...\\MSGKO
    Tetikleyici: Her 5 dakikada bir
"""

import os
import re
import sys
import time
import json
import logging
import requests
from datetime import datetime, timezone
from typing import Optional

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import (
    TimeoutException, NoSuchElementException, WebDriverException
)
from webdriver_manager.chrome import ChromeDriverManager
from dotenv import load_dotenv

# ── Ortam değişkenleri ─────────────────────────────────────────────────────────
_base = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(_base, '.env'))
load_dotenv(os.path.join(_base, '..', 'msgko-admin', '.env.local'))
load_dotenv(os.path.join(_base, '..', 'msgko-app', '.env.local'))

SUPABASE_URL = os.environ.get('SUPABASE_URL') or os.environ.get('NEXT_PUBLIC_SUPABASE_URL', '')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_KEY') or os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')

# ── Logging ────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)],
)
log = logging.getLogger('msgko_scraper')

# ── Sunucu tanımları ───────────────────────────────────────────────────────────
# uskopazar.com'daki button ID'leri: btn_zero3, btn_zero4, btn_agartha3 ...
# Biz 4 ana sunucuyu destekliyoruz: Zero, Destan, Pandora, Agartha
# Her sunucunun birden fazla kanalı olabilir (Zero 3, Zero 4, Zero 5...)
# Önce Zero 3'ü dene, sonra diğerlerine geç

SERVERS = [
    # (db_key, uskopazar_btn_id, display_label)
    ('zero',    'zero3',    'Zero 3'),
    ('zero',    'zero4',    'Zero 4'),
    ('zero',    'zero5',    'Zero 5'),
    ('destan',  'destan2',  'Destan 2'),
    ('pandora', 'pandora3', 'Pandora 3'),
    ('pandora', 'pandora4', 'Pandora 4'),
    ('agartha', 'agartha3', 'Agartha 3'),
    ('agartha', 'agartha4', 'Agartha 4'),
]

# Scraper ayarları
SITE_URL     = 'https://www.uskopazar.com/'
PAGE_WAIT    = 15    # sayfa yükleme timeout (sn)
ELEM_WAIT    = 10    # element bekleme (sn)
RESULT_WAIT  = 20    # sonuç satırları bekleme (sn)
BATCH_SIZE   = 200   # Supabase insert batch boyutu
DELAY_SERVER = 3.0   # sunucular arası bekleme (sn)


# ── Fiyat yardımcıları ─────────────────────────────────────────────────────────
def parse_price(raw: str) -> Optional[int]:
    """'1.234.567' veya '1,234,567' → integer"""
    cleaned = re.sub(r'[^\d]', '', str(raw))
    return int(cleaned) if cleaned else None


def minus_one(price: Optional[int]) -> Optional[int]:
    """En ucuz rakibin 1 altı fiyatı"""
    if price and price > 1:
        return price - 1
    return price


def parse_upgrade(text: str) -> tuple[str, Optional[int]]:
    """
    'Raptor (+9)' veya 'Raptor +9' → ('Raptor', 9)
    'Chitin Shell Helmet' → ('Chitin Shell Helmet', None)
    """
    match = re.search(r'\(\+(\d+)\)|(?<!\w)\+(\d+)', text)
    if match:
        lvl = int(match.group(1) or match.group(2))
        name = re.sub(r'\s*\(\+\d+\)|\s*\+\d+\s*$', '', text).strip()
        return name, lvl
    return text.strip(), None


# ── Selenium driver ────────────────────────────────────────────────────────────
def make_driver() -> webdriver.Chrome:
    """Headless Chrome driver oluştur."""
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920,1080')
    options.add_argument(
        'user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    )
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=options)


# ── uskopazar.com scraper ──────────────────────────────────────────────────────
def scrape_server_channel(
    driver: webdriver.Chrome,
    db_key: str,
    btn_id: str,
    label: str,
    wait: WebDriverWait,
) -> list[dict]:
    """
    Bir sunucu kanalının tüm ilanlarını çeker.
    """
    listings: list[dict] = []
    now = datetime.now(timezone.utc).isoformat()

    log.info(f'  [{label}] Sunucu seçiliyor (btn_id={btn_id})...')

    # ── Sunucu butonuna tıkla ─────────────────────────────────────────────────
    try:
        btn = wait.until(EC.element_to_be_clickable((By.ID, f'btn_{btn_id}')))
        btn.click()
        time.sleep(2)
    except TimeoutException:
        log.warning(f'  [{label}] Sunucu butonu bulunamadı — atlanıyor')
        return listings

    # ── Arama kutusunu temizle (önceki aramayı sıfırla) ───────────────────────
    try:
        search = driver.find_element(By.ID, 'xsearchInput')
        search.clear()
        time.sleep(0.5)
    except NoSuchElementException:
        log.warning(f'  [{label}] Arama kutusu bulunamadı')
        return listings

    # ── Upgrade select'i 0'a al (tüm itemler) ───────────────────────────────
    try:
        upg_select = Select(driver.find_element(By.ID, 'itemarti_ust'))
        upg_select.select_by_value('0')
        time.sleep(1)
    except (NoSuchElementException, Exception) as e:
        log.debug(f'  [{label}] Upgrade select hatası: {e}')

    # ── Sonuçları bekle ve çek ────────────────────────────────────────────────
    try:
        wait_result = WebDriverWait(driver, RESULT_WAIT)
        wait_result.until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "span[role='row']"))
        )
    except TimeoutException:
        log.warning(f'  [{label}] Sonuç satırları yüklenemedi')
        return listings

    rows = driver.find_elements(By.CSS_SELECTOR, "span[role='row']")
    log.info(f'  [{label}] {len(rows)} satır bulundu')

    for row in rows:
        try:
            listing = _parse_row(row, db_key, label, now)
            if listing:
                listings.append(listing)
        except Exception as e:
            log.debug(f'  Satır parse hatası: {e}')
            continue

    log.info(f'  [{label}] {len(listings)} ilan parse edildi')
    return listings


def _parse_row(row, db_key: str, label: str, now: str) -> Optional[dict]:
    """
    HTML satırından ilan bilgisini çıkar.

    uskopazar.com satır yapısı:
      <span role="row">
        <div role="cell">
          <span data-tippy-content="İtem Adı (+9) ...">...</span>
        </div>
        <div role="cell">
          <span>SaticiAdi</span>         ← 2. cell
        </div>
        <div role="cell">
          <span style="color: red;">1.234.567</span>  ← fiyat
        </div>
        <div role="cell">
          <span>Adet</span>              ← opsiyonel
        </div>
      </span>
    """
    cells = row.find_elements(By.CSS_SELECTOR, "div[role='cell']")
    if len(cells) < 2:
        return None

    # ── İtem adı — data-tippy-content attribute'undan ─────────────────────────
    try:
        tippy_el = row.find_element(By.CSS_SELECTOR, "span[data-tippy-content]")
        raw_name  = tippy_el.get_attribute('data-tippy-content') or tippy_el.text
    except NoSuchElementException:
        # tippy yoksa ilk cell metnini kullan
        raw_name = cells[0].text.strip()

    if not raw_name:
        return None

    item_name, upgrade_level = parse_upgrade(raw_name)
    if not item_name:
        return None

    # ── Fiyat — kırmızı span ──────────────────────────────────────────────────
    price_raw = None
    try:
        price_el  = row.find_element(By.CSS_SELECTOR, "span[style='color: red;']")
        price_raw = price_el.text.strip()
    except NoSuchElementException:
        # Fallback: tüm cell metinlerinden sayısal olanı bul
        for cell in cells:
            t = cell.text.strip()
            if re.match(r'^[\d.,]+$', t.replace(' ', '')) and len(t) > 2:
                price_raw = t
                break

    price = parse_price(price_raw)
    if not price or price <= 0:
        return None

    # ── Satıcı adı — 2. cell ─────────────────────────────────────────────────
    seller = None
    try:
        if len(cells) >= 2:
            seller_spans = cells[1].find_elements(By.TAG_NAME, 'span')
            if seller_spans:
                seller = seller_spans[0].text.strip() or None
            else:
                seller = cells[1].text.strip() or None
    except Exception:
        pass

    # ── Adet — 4. cell (opsiyonel) ───────────────────────────────────────────
    item_count = 1
    try:
        if len(cells) >= 4:
            cnt_text = cells[3].text.strip()
            cnt = parse_price(cnt_text)
            if cnt and 1 <= cnt <= 100000:
                item_count = cnt
    except Exception:
        pass

    # ── -1 fiyat (en ucuz rakip altı) ────────────────────────────────────────
    price_minus_one = minus_one(price)

    return {
        'server':        db_key,
        'item_name':     item_name,
        'item_count':    item_count,
        'upgrade_level': upgrade_level,
        'price':         price_minus_one,      # -1 uygulanmış fiyat
        'price_per_unit': (price_minus_one // item_count) if item_count > 0 else price_minus_one,
        'seller_name':   seller,
        'scraped_at':    now,
        'raw_data':      json.dumps({
            'original_price': price,
            'minus_one_price': price_minus_one,
            'source': 'uskopazar.com',
            'server_label': label,
            'raw_name': raw_name,
        }, ensure_ascii=False),
    }


# ── Supabase ───────────────────────────────────────────────────────────────────
def _sb_headers() -> dict:
    return {
        'apikey':        SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type':  'application/json',
        'Prefer':        'return=minimal',
    }


def supabase_delete(db_key: str) -> bool:
    """Bir sunucunun eski ilanlarını sil."""
    url  = f'{SUPABASE_URL}/rest/v1/market_listings?server=eq.{db_key}'
    resp = requests.delete(url, headers=_sb_headers(), timeout=30)
    ok   = resp.status_code in (200, 204)
    if not ok:
        log.error(f'  Supabase DELETE hatası: {resp.status_code} {resp.text[:100]}')
    return ok


def supabase_insert(listings: list[dict]) -> int:
    """Toplu insert. Başarıyla yazılan kayıt sayısını döndür."""
    if not listings:
        return 0
    written = 0
    url     = f'{SUPABASE_URL}/rest/v1/market_listings'
    for i in range(0, len(listings), BATCH_SIZE):
        batch = listings[i:i + BATCH_SIZE]
        resp  = requests.post(url, json=batch, headers=_sb_headers(), timeout=30)
        if resp.status_code in (200, 201):
            written += len(batch)
            log.info(f'  Batch {i // BATCH_SIZE + 1}: {len(batch)} ilan yazıldı ✓')
        else:
            log.error(f'  Batch {i // BATCH_SIZE + 1} hatası: {resp.status_code} {resp.text[:150]}')
    return written


def supabase_log(server: str, status: str, count: int,
                 error: Optional[str], duration_ms: int) -> None:
    url     = f'{SUPABASE_URL}/rest/v1/market_scrape_log'
    payload = {
        'server': server, 'status': status,
        'items_count': count, 'error_msg': error,
        'duration_ms': duration_ms,
    }
    try:
        requests.post(url, json=payload, headers=_sb_headers(), timeout=10)
    except Exception:
        pass


# ── Ana akış ───────────────────────────────────────────────────────────────────
def run():
    log.info('=' * 60)
    log.info(f'MSGKO Market Scraper — {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    log.info(f'Kaynak: uskopazar.com')
    log.info('=' * 60)

    if not SUPABASE_URL or not SUPABASE_KEY:
        log.error('SUPABASE_URL veya SUPABASE_SERVICE_KEY eksik!')
        log.error('scripts/.env dosyasını oluşturun:')
        log.error('  SUPABASE_URL=https://xxx.supabase.co')
        log.error('  SUPABASE_SERVICE_KEY=eyJ...')
        sys.exit(1)

    # İşlenen db_key'leri takip et (Zero 3/4/5 hepsini 'zero' key'ine yazar)
    # Her db_key için en çok ilan olan kanalı seç
    db_key_listings: dict[str, list[dict]] = {}
    total_start = time.time()

    driver = None
    try:
        log.info('Chrome driver başlatılıyor...')
        driver = make_driver()
        wait   = WebDriverWait(driver, PAGE_WAIT)

        log.info(f'uskopazar.com yükleniyor...')
        driver.get(SITE_URL)

        # Sayfanın tam yüklenmesini bekle
        wait.until(EC.presence_of_element_located((By.ID, 'xsearchInput')))
        log.info('Sayfa yüklendi ✓')
        log.info('')

        for db_key, btn_id, label in SERVERS:
            log.info(f'▶ [{label}] scraping...')
            t0 = time.time()

            try:
                listings = scrape_server_channel(driver, db_key, btn_id, label, wait)

                # Bu db_key için daha önce çekilenden fazlaysa güncelle
                existing = db_key_listings.get(db_key, [])
                if len(listings) > len(existing):
                    db_key_listings[db_key] = listings
                    log.info(f'  [{label}] → {db_key} için en iyi sonuç: {len(listings)} ilan')
                else:
                    log.info(f'  [{label}] → mevcut {len(existing)} ilan daha fazla, atlandı')

            except Exception as e:
                log.error(f'  [{label}] Beklenmeyen hata: {e}')

            log.info(f'  Süre: {int((time.time()-t0)*1000)}ms')
            log.info('')
            time.sleep(DELAY_SERVER)

    except WebDriverException as e:
        log.error(f'Chrome driver hatası: {e}')
    finally:
        if driver:
            driver.quit()
            log.info('Driver kapatıldı.')

    # ── Supabase'e yaz ────────────────────────────────────────────────────────
    log.info('')
    log.info('── Supabase yazma ──────────────────────────────────────')
    grand_total = 0

    for db_key, listings in db_key_listings.items():
        if not listings:
            log.warning(f'[{db_key}] Hiç ilan yok, atlandı')
            supabase_log(db_key, 'error', 0, 'No listings scraped', 0)
            continue

        t0 = time.time()
        log.info(f'[{db_key}] Eski ilanlar siliniyor...')
        supabase_delete(db_key)

        log.info(f'[{db_key}] {len(listings)} ilan yazılıyor...')
        written = supabase_insert(listings)
        grand_total += written

        duration_ms = int((time.time() - t0) * 1000)
        status = 'success' if written > 0 else 'error'
        supabase_log(db_key, status, written, None if written > 0 else 'Insert failed', duration_ms)
        log.info(f'[{db_key}] ✓ {written} ilan yazıldı ({duration_ms}ms)')

    # ── Özet ─────────────────────────────────────────────────────────────────
    total_ms = int((time.time() - total_start) * 1000)
    log.info('')
    log.info('=' * 60)
    log.info(f'Toplam: {grand_total} ilan — {total_ms}ms')
    log.info('=' * 60)


if __name__ == '__main__':
    run()
