"""Sayfalama yapısını analiz et — kaç sayfa var, nasıl geçiliyor"""
import asyncio, sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright, TimeoutError as PWTimeout

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True, args=['--no-sandbox'])
        ctx = await browser.new_context(
            viewport={'width':1920,'height':1080},
            user_agent='Mozilla/5.0 Chrome/152.0.0.0',
            locale='tr-TR'
        )
        await ctx.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined});")
        page = await ctx.new_page()

        print("Sayfa aciliyor...")
        await page.goto('https://www.uskopazar.com/', wait_until='domcontentloaded', timeout=30000)
        await page.wait_for_timeout(5000)

        # Modal kapat
        el = page.locator('text=Bugünlük kapat')
        if await el.count() > 0:
            await el.first.click()
            await page.wait_for_timeout(500)

        # ZERO 3 sec
        print("\nZERO 3 seciliyor...")
        await page.evaluate("document.getElementById('btn_zero3').click()")
        await page.wait_for_timeout(3000)

        # 192 kayit sec
        print("192 kayit seciliyor...")
        await page.evaluate("""
            const sel = document.getElementById('btn_top_list');
            sel.value = '192';
            sel.dispatchEvent(new Event('change', {bubbles: true}));
        """)
        await page.wait_for_timeout(3000)

        # Satir sayisi
        rows = await page.query_selector_all('tbody tr')
        print(f"192 kayit ile satir sayisi: {len(rows)}")

        # Pagination elementlerini bul
        print("\n=== PAGINATION ANALIZI ===")

        # Tum sayfa numarasi elementlerini bul
        pag_candidates = await page.query_selector_all(
            'button, a, span, li, div'
        )
        page_nums = []
        for el in pag_candidates:
            try:
                t = (await el.inner_text()).strip()
                if t.isdigit() and 1 <= int(t) <= 100:
                    tag = await el.evaluate('el => el.tagName')
                    cls = (await el.get_attribute('class') or '')[:50]
                    if 'page' in cls.lower() or tag in ('BUTTON', 'A'):
                        page_nums.append((t, tag, cls[:30]))
            except:
                pass

        print(f"Sayfa numarasi butonlari: {page_nums[:10]}")

        # Toplam kayit sayisi
        print("\n=== TOPLAM KAYIT ===")
        # Sayfa iceriginde "toplam X kayit" gibi metin ara
        body_text = await page.evaluate("document.body.innerText")
        # Sayisal ifadeler
        for line in body_text.split('\n'):
            line = line.strip()
            if any(w in line.lower() for w in ['toplam', 'total', 'kayıt sayı', 'sonuç']):
                if len(line) < 100:
                    print(f"  '{line}'")

        # Ilk satirin fiyatini al, sonraki sayfaya gec, ikinci satirin fiyatini karsilastir
        if rows:
            first_row = rows[0]
            cells = await first_row.query_selector_all('td')
            if len(cells) >= 4:
                spans = await cells[3].query_selector_all('span')
                first_price = (await spans[0].inner_text()).strip() if spans else '?'
                first_item = (await cells[0].inner_text()).strip().split('\n')[0]
                print(f"\nIlk satir: {first_item} | fiyat: {first_price}")

        # Son satir
        if rows:
            last_row = rows[-1]
            cells = await last_row.query_selector_all('td')
            if len(cells) >= 4:
                spans = await cells[3].query_selector_all('span')
                last_price = (await spans[0].inner_text()).strip() if spans else '?'
                last_item = (await cells[0].inner_text()).strip().split('\n')[0]
                print(f"Son satir: {last_item} | fiyat: {last_price}")

        # Sonraki sayfa butonu var mi?
        print("\n=== SONRAKI SAYFA ===")
        next_candidates = await page.query_selector_all(
            'button:has-text("Sonraki"), button:has-text(">"), '
            'a:has-text("Next"), [aria-label*="next"], [aria-label*="sonraki"]'
        )
        print(f"'Sonraki' buton sayisi: {len(next_candidates)}")

        # Tum pagination ile ilgili elementler
        pg_els = await page.query_selector_all('[class*="paginat"], [class*="Paginat"], nav')
        for el in pg_els[:5]:
            t = (await el.inner_text()).strip()[:80]
            cls = (await el.get_attribute('class') or '')[:40]
            print(f"  '{t}' | class={cls}")

        # Screenshot
        await page.screenshot(path='scripts/pagination_check.png')
        print("\nScreenshot: scripts/pagination_check.png")

        await browser.close()

asyncio.run(main())
