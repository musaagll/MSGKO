"""
uskopazar.com arka plan API isteklerini yakala.
Playwright network intercept ile JSON endpoint'leri bul.
"""
import asyncio, sys, io, json, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright

_base = os.path.dirname(os.path.abspath(__file__))

async def main():
    api_calls = []

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True, args=['--no-sandbox'])
        ctx = await browser.new_context(
            viewport={'width':1920,'height':1080},
            user_agent='Mozilla/5.0 Chrome/152.0.0.0',
            locale='tr-TR'
        )
        await ctx.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined});")
        page = await ctx.new_page()

        # Tum network isteklerini yakala
        async def on_request(request):
            url = request.url
            method = request.method
            # JSON veya API gibi gorunen URL'leri kaydet
            if any(x in url for x in ['api', 'json', 'data', 'market', 'item', 'pazar']):
                api_calls.append({'method': method, 'url': url})

        async def on_response(response):
            url = response.url
            ct = response.headers.get('content-type', '')
            # JSON response dondurenler
            if 'json' in ct and response.status == 200:
                try:
                    body = await response.json()
                    # Veri icerenler
                    if isinstance(body, (list, dict)) and len(str(body)) > 100:
                        print(f"\nJSON API BULUNDU: {url}")
                        print(f"  Content-Type: {ct}")
                        print(f"  Veri ornegi: {str(body)[:200]}")
                        api_calls.append({
                            'url': url,
                            'content_type': ct,
                            'sample': str(body)[:300]
                        })
                except Exception:
                    pass

        page.on('request', on_request)
        page.on('response', on_response)

        print("Sayfa yukleniyor...")
        await page.goto('https://www.uskopazar.com/', wait_until='domcontentloaded', timeout=30000)
        await page.wait_for_timeout(5000)

        # Modal kapat
        el = page.locator('text=Bugünlük kapat')
        if await el.count() > 0:
            await el.first.click()
            await page.wait_for_timeout(500)

        print("ZERO 3 seciliyor...")
        await page.evaluate("document.getElementById('btn_zero3').click()")
        await page.wait_for_timeout(5000)

        # 192 kayit
        await page.evaluate("""
            const sel = document.getElementById('btn_top_list');
            if (sel) { sel.value='192'; sel.dispatchEvent(new Event('change',{bubbles:true})); }
        """)
        await page.wait_for_timeout(3000)

        print("\n=== YAKALANAN API CAGLRISI ===")
        seen = set()
        for call in api_calls:
            url = call.get('url', '')
            if url not in seen:
                seen.add(url)
                print(f"  {call.get('method','GET')} {url}")
                if 'sample' in call:
                    print(f"    Sample: {call['sample'][:150]}")

        # Sayfanin JS kaynak kodunda fetch/axios cagrisi ara
        print("\n=== JS KAYNAK KOD ANALIZI ===")
        scripts = await page.query_selector_all('script[src]')
        print(f"Script sayisi: {len(scripts)}")
        
        # Sayfa HTML'inde API URL patternlerini ara
        html = await page.content()
        import re
        api_patterns = re.findall(r'(?:fetch|axios|api|endpoint)[\'"\s]*[:\(]*[\'"]([^\'"\s]{10,})[\'"]', html, re.IGNORECASE)
        for p in set(api_patterns[:20]):
            if any(c in p for c in ['/', '.', 'http']):
                print(f"  {p}")

        # Screenshot
        await page.screenshot(path=os.path.join(_base, 'api_analysis.png'))

        await browser.close()

asyncio.run(main())
