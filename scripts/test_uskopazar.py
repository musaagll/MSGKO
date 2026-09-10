"""uskopazar.com Selenium testi — gerçek element kontrolü"""
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

def make_driver():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless=new')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_experimental_option('excludeSwitches', ['enable-automation', 'enable-logging'])
    options.add_experimental_option('useAutomationExtension', False)
    options.add_argument(
        'user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36'
    )
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    return driver

print("uskopazar.com test başlıyor...")
driver = make_driver()

try:
    print("1. Sayfa açılıyor...")
    driver.get("https://www.uskopazar.com/")
    print(f"   Title: {driver.title}")
    print(f"   URL: {driver.current_url}")
    
    print("2. xsearchInput bekleniyor (15sn)...")
    wait = WebDriverWait(driver, 15)
    try:
        el = wait.until(EC.presence_of_element_located((By.ID, "xsearchInput")))
        print("   ✓ xsearchInput BULUNDU")
    except:
        print("   ✗ xsearchInput BULUNAMADI")
        # Sayfanın kaynak koduna bak
        src = driver.page_source[:2000]
        print(f"   Kaynak (ilk 2000 karakter):\n{src}")
        driver.quit()
        exit()

    print("3. Zero 3 butonu aranıyor...")
    btns = driver.find_elements(By.CSS_SELECTOR, "[id^='btn_']")
    print(f"   Bulunan butonlar: {[b.get_attribute('id') for b in btns[:10]]}")

    print("4. Satır sayısı (span[role=row])...")
    rows = driver.find_elements(By.CSS_SELECTOR, "span[role='row']")
    print(f"   Satır sayısı: {len(rows)}")

    if rows:
        print("5. İlk 3 satır içeriği:")
        for i, row in enumerate(rows[:3]):
            print(f"   Satır {i+1}: {row.text[:100]}")

except Exception as e:
    print(f"HATA: {e}")
    # Ekran görüntüsü al
    driver.save_screenshot("scripts/debug_screenshot.png")
    print("Ekran görüntüsü: scripts/debug_screenshot.png")
finally:
    driver.quit()
    print("Driver kapatıldı.")
