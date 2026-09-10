"""Chrome Selenium bağlantı testi"""
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

print("Test 1: Headless=new...")
try:
    options = webdriver.ChromeOptions()
    options.add_argument('--headless=new')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.get("https://www.google.com")
    print(f"  ✓ Sayfa yüklendi: {driver.title}")
    driver.quit()
    print("  ✓ headless=new ÇALIŞIYOR")
except Exception as e:
    print(f"  ✗ headless=new ÇALIŞMIYOR: {type(e).__name__}")
    
    # Test 2: Eski headless
    print("\nTest 2: headless (eski)...")
    try:
        options2 = webdriver.ChromeOptions()
        options2.add_argument('--headless')
        options2.add_argument('--no-sandbox')
        options2.add_argument('--disable-dev-shm-usage')
        options2.add_argument('--disable-gpu')
        options2.add_experimental_option('excludeSwitches', ['enable-logging'])
        service2 = Service(ChromeDriverManager().install())
        driver2 = webdriver.Chrome(service=service2, options=options2)
        driver2.get("https://www.google.com")
        print(f"  ✓ Sayfa: {driver2.title}")
        driver2.quit()
        print("  ✓ headless (eski) ÇALIŞIYOR")
    except Exception as e2:
        print(f"  ✗ ÇALIŞMIYOR: {type(e2).__name__}")
        
        # Test 3: headless yok
        print("\nTest 3: Headless YOK (görünür pencere)...")
        try:
            options3 = webdriver.ChromeOptions()
            options3.add_argument('--no-sandbox')
            options3.add_argument('--disable-dev-shm-usage')
            options3.add_experimental_option('excludeSwitches', ['enable-logging'])
            service3 = Service(ChromeDriverManager().install())
            driver3 = webdriver.Chrome(service=service3, options=options3)
            driver3.get("https://www.google.com")
            print(f"  ✓ Sayfa: {driver3.title}")
            time.sleep(2)
            driver3.quit()
            print("  ✓ Görünür mod ÇALIŞIYOR")
        except Exception as e3:
            print(f"  ✗ ÇALIŞMIYOR: {e3}")
