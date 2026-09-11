"""
uskopazar.com serverType degerlerini bul.
Playwright'tan yakalanan request'te serverType=0 idi.
JS kaynak kodunda serverType mapping'ini ara.
"""
import asyncio, sys, io, re, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright

async def main():
    captured_requests = []

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True, args=['--no-sandbox'])
        ctx = await browser.new_context(
            viewport={'width':1920,'height':1080},
            user_agent='Mozilla/5.0 Chrome/152.0.0.0',
            locale='tr-TR'
        )
        await ctx.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined});")
        page = await ctx.new_page()

        async def on_request(req):
            if 'getItemList' in req.url:
                body = req.post_data or ''
                params = {}
                for part in body.split('&'):
                    if '=' in part:
                        k, _, v = part.partition('=')
                        from urllib.parse import unquote_plus
                        params[k] = unquote_plus(v)
                captured_requests.append({'url': req.url, 'params': params})

        page.on('request', on_request)

        print("Sayfa yukleniyor...")
        await page.goto('https://www.uskopazar.com/', wait_until='domcontentloaded', timeout=30000)
        await page.wait_for_timeout(4000)

        el = page.locator('text=Bugünlük kapat')
        if await el.count() > 0:
            await el.first.click()
            await page.wait_for_timeout(500)

        # Her butona tikla ve serverType'i gozlemle
        buttons = [
            ('btn_zero3',    'Zero 3'),
            ('btn_zero4',    'Zero 4'),
            ('btn_zero5',    'Zero 5'),
            ('btn_zero8',    'Zero 8'),
            ('btn_agartha3', 'Agartha 3'),
            ('btn_agartha4', 'Agartha 4'),
            ('btn_pandora3', 'Pandora 3'),
            ('btn_pandora4', 'Pandora 4'),
            ('btn_destan2',  'Destan 2'),
            ('btn_destan3',  'Destan 3'),
        ]

        before_count = 0
        for btn_id, label in buttons:
            prev_count = len(captured_requests)
            await page.evaluate(f"document.getElementById('{btn_id}').click()")
            await page.wait_for_timeout(2000)
            new_reqs = captured_requests[prev_count:]
            for req in new_reqs:
                params = req['params']
                print(f"{label}: serverType={params.get('serverType','?')} limitType={params.get('limitType','?')} searchValue={params.get('searchValue','')!r}")

        # 192 kayit sec ve tekrar bak
        print("\n--- 192 kayit secildikten sonra ---")
        await page.evaluate("""
            const sel = document.getElementById('btn_top_list');
            if (sel) { sel.value='192'; sel.dispatchEvent(new Event('change',{bubbles:true})); }
        """)
        await page.wait_for_timeout(2000)

        # Zero 3'u tekrar tikla
        prev = len(captured_requests)
        await page.evaluate("document.getElementById('btn_zero3').click()")
        await page.wait_for_timeout(2000)
        for req in captured_requests[prev:]:
            params = req['params']
            print(f"Zero 3 (192): serverType={params.get('serverType','?')} limitType={params.get('limitType','?')}")

        await browser.close()

asyncio.run(main())
