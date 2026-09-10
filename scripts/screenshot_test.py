"""undetected-chromedriver ile uskopazar.com testi"""
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time, os

print("=== undetected-chromedriver ile uskopazar.com ===")

options = uc.ChromeOptions()
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--window-size=1920,1080')

driver = uc.Chrome(options=options, headless=True)

try:
    print("1. Sayfa açılıyor...")
    driver.get("https://www.uskopazar.com/")
    time.sleep(8)
    
    out = os.path.join(os.path.dirname(__file__), "uskopazar_uc.png")
    driver.save_screenshot(out)
    print(f"Screenshot: {out}")
    print(f"Title: {driver.title}")
    
    src = driver.page_source
    if 'cloudflare' in src.lower():
        print("⚠ Hâlâ Cloudflare var")
    else:
        print("✓ Cloudflare yok")

    # xsearchInput
    els = driver.find_elements(By.ID, "xsearchInput")
    print(f"xsearchInput: {'BULUNDU ✓' if els else 'YOK ✗'}")
    
    # btn_ butonları
    btns = driver.find_elements(By.CSS_SELECTOR, "[id^='btn_']")
    print(f"Butonlar: {[b.get_attribute('id') for b in btns[:10]]}")

    # Satırlar
    rows = driver.find_elements(By.CSS_SELECTOR, "span[role='row']")
    print(f"Satır sayısı: {len(rows)}")
    
    if rows:
        print("\nİlk 3 satır:")
        for i, r in enumerate(rows[:3]):
            print(f"  {i+1}: {r.text[:120]}")

except Exception as e:
    print(f"HATA: {e}")
    driver.save_screenshot(os.path.join(os.path.dirname(__file__), "error_uc.png"))
finally:
    driver.quit()
    print("Driver kapatıldı.")
