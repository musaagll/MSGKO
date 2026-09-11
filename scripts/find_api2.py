"""
uskopazar.com /dashboard/getItemList endpoint'ini analiz et.
Request body ve response yapısını bul.
"""
import asyncio, sys, io, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright

captured = {}

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

        # getItemList isteğini yakala
        async def on_request(request):
            if 'getItemList' in request.url or 'verify_fingerprint' in request.url:
                body = None
                try:
                    body = request.post_data
                except:
                    pass
                print(f"\n=== REQUEST: {request.url} ===")
                print(f"  Method: {request.method}")
                print(f"  Headers: {dict(request.headers)}")
                print(f"  Body: {body}")
                captured['request'] = {
                    'url': request.url,
                    'method': request.method,
                    'headers': dict(request.headers),
                    'body': body
                }

        async def on_response(response):
            if 'getItemList' in response.url:
                try:
                    body = await response.json()
                    print(f"\n=== RESPONSE: {response.url} ===")
                    print(f"  Status: {response.status}")
                    print(f"  Headers: {dict(response.headers)}")
                    print(f"  Body keys: {list(body.keys()) if isinstance(body, dict) else type(body)}")
                    if isinstance(body, dict):
                        for k, v in body.items():
                            if isinstance(v, list) and v:
                                print(f"  {k}[0]: {str(v[0])[:200]}")
                            else:
                                print(f"  {k}: {str(v)[:100]}")
                    elif isinstance(body, list) and body:
                        print(f"  List[0]: {str(body[0])[:300]}")
                    captured['response'] = body
                except Exception as e:
                    print(f"  Response parse hatasi: {e}")
                    try:
                        text = await response.text()
                        print(f"  Raw (200 char): {text[:200]}")
                    except:
                        pass

        page.on('request', on_request)
        page.on('response', on_response)

        print("Sayfa yukleniyor...")
        await page.goto('https://www.uskopazar.com/', wait_until='domcontentloaded', timeout=30000)
        await page.wait_for_timeout(5000)

        el = page.locator('text=Bugünlük kapat')
        if await el.count() > 0:
            await el.first.click()
            await page.wait_for_timeout(500)

        print("ZERO 3 seciliyor...")
        await page.evaluate("document.getElementById('btn_zero3').click()")
        await page.wait_for_timeout(6000)

        print("\nCookies:")
        cookies = await ctx.cookies()
        for c in cookies:
            if 'uskopazar' in c.get('domain', ''):
                print(f"  {c['name']} = {c['value'][:50]}")

        await browser.close()

    # Sonuclari kaydet
    with open('scripts/api_capture.json', 'w', encoding='utf-8') as f:
        json.dump(captured, f, ensure_ascii=False, indent=2)
    print("\nCapture kaydedildi: scripts/api_capture.json")

asyncio.run(main())
