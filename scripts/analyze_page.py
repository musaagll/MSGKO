"""uskopazar.com sayfa yapısını analiz et — shard araması örneği"""
import asyncio, json, os
from playwright.async_api import async_playwright

_base = os.path.dirname(os.path.abspath(__file__))

async def analyze():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True, args=['--no-sandbox'])
        ctx = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/152.0.0.0 Safari/537.36',
            locale='tr-TR',
        )
        await ctx.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined});")
        page = await ctx.new_page()

        print("Sayfa aciliyor...")
        await page.goto('https://www.uskopazar.com/', wait_until='domcontentloaded', timeout=30000)
        await page.wait_for_timeout(5000)

        # Modal kapat
        for sel in ['text=Bugünlük kapat', 'text=Bugünlük kapat']:
            try:
                el = page.locator(sel)
                if await el.count() > 0:
                    await el.first.click()
                    await page.wait_for_timeout(800)
                    print(f"Modal kapatildi")
                    break
            except: pass

        # Search Text input'una "shard" yaz
        print("\n'shard' aranıyor...")
        search = page.locator('input[placeholder="Search Text"]')
        await search.fill('shard')
        await page.wait_for_timeout(3000)

        # Screenshot
        await page.screenshot(path=os.path.join(_base, 'shard_search.png'))
        print("Screenshot: shard_search.png")

        # Tablo satırlarını incele
        rows = await page.query_selector_all('tbody tr')
        print(f"\nSatir sayisi: {len(rows)}")

        if rows:
            print("\n=== ILK 3 SATIR DETAYLI ANALIZ ===")
            for i, row in enumerate(rows[:3]):
                print(f"\n--- Satir {i+1} ---")
                cells = await row.query_selector_all('td')
                print(f"Hucre sayisi: {len(cells)}")
                for j, cell in enumerate(cells):
                    text = (await cell.inner_text()).strip()
                    # img var mi?
                    img = await cell.query_selector('img')
                    img_src = await img.get_attribute('src') if img else None
                    # a link var mi?
                    link = await cell.query_selector('a')
                    link_text = (await link.inner_text()).strip() if link else None
                    link_href = await link.get_attribute('href') if link else None
                    # span'lar
                    spans = await cell.query_selector_all('span')
                    span_texts = [(await s.inner_text()).strip() for s in spans]

                    print(f"  [{j}] text='{text[:50]}' | img={img_src} | link='{link_text}' href='{link_href}' | spans={span_texts[:3]}")

        # Toplam kayit sayisini bul
        print("\n=== TOPLAM KAYIT BILGISI ===")
        # "24 Kayıt" dropdown veya text
        kayit_els = await page.query_selector_all('*')
        for el in kayit_els:
            try:
                t = (await el.inner_text()).strip()
                if 'Kayıt' in t and len(t) < 20:
                    tag = await el.evaluate('el => el.tagName')
                    print(f"  '{t}' ({tag})")
            except: pass

        # Pagination var mi?
        print("\n=== PAGINATION ===")
        pag_els = await page.query_selector_all('[class*="page"], [class*="pagination"], [class*="pager"]')
        print(f"Pagination element sayisi: {len(pag_els)}")

        # Sayfanin HTML yapisi - tablo header
        print("\n=== TABLO HEADER ===")
        thead = await page.query_selector('thead')
        if thead:
            print(await thead.inner_text())

        await browser.close()

asyncio.run(analyze())
