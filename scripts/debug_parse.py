"""HTML parse sorununu debug et"""
import sys, io, re, requests, asyncio, json
from bs4 import BeautifulSoup
from urllib.parse import unquote_plus
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright

async def get_token_and_html():
    token_data = {}
    html_result = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True, args=['--no-sandbox'])
        ctx = await browser.new_context(viewport={'width':1920,'height':1080},
            user_agent='Mozilla/5.0 Chrome/152.0.0.0', locale='tr-TR')
        await ctx.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined});")
        page = await ctx.new_page()

        async def on_req(req):
            if 'getItemList' in req.url:
                body = req.post_data or ''
                params = {}
                for p in body.split('&'):
                    if '=' in p:
                        k,_,v = p.partition('=')
                        params[k] = unquote_plus(v)
                if 'req_token' in params:
                    token_data.update(params)

        async def on_resp(resp):
            if 'getItemList' in resp.url and resp.status == 200:
                html_result.append(await resp.text())

        page.on('request', on_req)
        page.on('response', on_resp)

        await page.goto('https://www.uskopazar.com/', wait_until='domcontentloaded', timeout=30000)
        await page.wait_for_timeout(4000)
        el = page.locator('text=Bugünlük kapat')
        if await el.count() > 0:
            await el.first.click()
            await page.wait_for_timeout(400)
        await page.evaluate("document.getElementById('btn_zero3').click()")
        await page.wait_for_timeout(4000)
        cookies = {c['name']:c['value'] for c in await ctx.cookies() if 'uskopazar' in c.get('domain','')}
        await browser.close()
    return token_data, cookies, html_result[0] if html_result else ''

token_data, cookies, html = asyncio.run(get_token_and_html())
print(f"HTML boyutu: {len(html)}")

# HTML'i kaydet
with open('scripts/sample_response.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("HTML kaydedildi: scripts/sample_response.html")

soup = BeautifulSoup(html, 'html.parser')

# Tüm tablo satırlarını bul
rows = soup.select('tbody tr')
print(f"tbody tr sayisi: {len(rows)}")

# Farklı selector dene
rows2 = soup.find_all('tr')
print(f"tum tr sayisi: {len(rows2)}")

# İlk satırı detaylı incele
if rows:
    row = rows[0]
    print("\n=== ILK SATIR HTML ===")
    print(row.prettify()[:2000])

elif rows2:
    # tbody olmayan tr'leri incele
    for r in rows2[:3]:
        tds = r.find_all('td')
        if tds:
            print(f"\ntr (td={len(tds)}):")
            print(r.prettify()[:1000])
            break
else:
    # Tamamen farklı yapı
    print("\n=== HTML BAŞLANGIÇ (1000 char) ===")
    print(html[:1000])
    print("\n=== HTML ORTA (500 char) ===")
    print(html[len(html)//2:len(html)//2+500])
