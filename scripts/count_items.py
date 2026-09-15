"""
uskopazar.com'da kac farkli item var ve toplam kac ilan var?
limitType=192 ile pageCount artırarak tüm sayfaları cek.
"""
import asyncio, sys, io, re, json
from urllib.parse import unquote_plus
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

results = []

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True, args=['--no-sandbox'])
        ctx = await browser.new_context(
            viewport={'width':1920,'height':1080},
            user_agent='Mozilla/5.0 Chrome/152.0.0.0',
            locale='tr-TR',
        )
        await ctx.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined});")
        page = await ctx.new_page()

        token_data = {}
        async def on_request(req):
            if 'getItemList' in req.url:
                body = req.post_data or ''
                params = {}
                for p in body.split('&'):
                    if '=' in p:
                        k,_,v = p.partition('=')
                        params[k] = unquote_plus(v)
                if 'req_token' in params:
                    token_data.update(params)

        async def on_response(resp):
            if 'getItemList' in resp.url and resp.status == 200:
                html = await resp.text()
                results.append(html)

        page.on('request', on_request)
        page.on('response', on_response)

        await page.goto('https://www.uskopazar.com/', wait_until='domcontentloaded', timeout=30000)
        await page.wait_for_timeout(5000)
        el = page.locator('text=Bugünlük kapat')
        if await el.count() > 0:
            await el.first.click()
            await page.wait_for_timeout(500)

        # Zero 3 sec, 192 kayit
        await page.evaluate("document.getElementById('btn_zero3').click()")
        await page.wait_for_timeout(3000)
        await page.evaluate("""
            const s=document.getElementById('btn_top_list');
            s.value='192';s.dispatchEvent(new Event('change',{bubbles:true}));
        """)
        await page.wait_for_timeout(3000)
        print(f"Sayfa 1 alindi ({len(results[-1]) if results else 0} byte)")

        # Toplam ilan sayisini bul — pagination veya sayac elementinden
        try:
            total_text = await page.evaluate("""() => {
                // Sayfada toplam ilan sayisini gosteren element ara
                const els = document.querySelectorAll('*');
                for(const el of els) {
                    const t = el.innerText || '';
                    if(/toplam|total|ilan say/i.test(t) && t.length < 100) return t;
                }
                // Pagination son sayfa numarasini bul
                const pags = document.querySelectorAll('[class*="page"] a, [class*="paginat"] a');
                const nums = [];
                pags.forEach(p => { const n=parseInt(p.innerText); if(!isNaN(n)) nums.push(n); });
                return 'max_page: ' + (Math.max(...nums) || '?');
            }""")
            print(f"Toplam bilgisi: {total_text}")
        except:
            pass

        # HTML'den tablo satir sayisini say
        if results:
            soup = BeautifulSoup(results[-1], 'html.parser')
            rows = soup.select('tbody tr')
            print(f"Sayfa 1 satir sayisi: {len(rows)}")
            if rows:
                # Ilk 5 item ismini goster
                print("Ilk 5 item:")
                for r in rows[:5]:
                    cells = r.find_all('td')
                    if cells:
                        spans = cells[0].find_all('span')
                        name = spans[0].get_text(strip=True) if spans else cells[0].get_text(strip=True).split('\n')[0]
                        price_spans = cells[3].find_all('span') if len(cells)>3 else []
                        price = price_spans[0].get_text(strip=True) if price_spans else '?'
                        print(f"  {name} | {price}")

        # Simdi pageCount=2 ile dene
        if token_data:
            import requests as req_lib
            sess = req_lib.Session()
            sess.headers.update({
                'User-Agent': 'Mozilla/5.0 Chrome/152.0.0.0',
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': 'https://www.uskopazar.com/',
            })
            # Playwright cookie'lerini aktar
            cookies = await ctx.cookies()
            for c in cookies:
                if 'uskopazar' in c.get('domain',''):
                    sess.cookies.set(c['name'], c['value'])

            print("\nPage 2-5 test ediliyor...")
            for pg in range(2, 6):
                data = {
                    'fingerprint': token_data.get('fingerprint','417c2f83'),
                    'req_token':   token_data['req_token'],
                    'pageCount':   pg,
                    'merchantType':0, 'orderType':0,
                    'limitType':   192,
                    'serverType':  0,
                    'searchType':  0, 'itemType':0,
                    'minVal':0, 'maxVal':0, 'Item_Arti':0, 'tarih':'',
                }
                r = sess.post('https://www.uskopazar.com/dashboard/getItemList',
                    data=data, headers={'Accept':'text/html,*/*;q=0.01','Content-Type':'application/x-www-form-urlencoded'},
                    timeout=15)
                if r.status_code == 200:
                    soup2 = BeautifulSoup(r.text, 'html.parser')
                    rows2 = soup2.select('tbody tr')
                    print(f"  Sayfa {pg}: {len(rows2)} satir ({len(r.text)} byte)")
                    if len(rows2) < 10:
                        print(f"  Son sayfa. Toplam sayfa: {pg}")
                        break
                else:
                    print(f"  Sayfa {pg}: HTTP {r.status_code}")
                    break

        await browser.close()

asyncio.run(main())
