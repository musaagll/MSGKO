"""pageCount ile son sayfaya kadar git, toplam ilan sayisini bul"""
import sys, io, re, requests, asyncio
from bs4 import BeautifulSoup
from urllib.parse import unquote_plus
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright

async def get_token():
    token_data = {}
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
        page.on('request', on_req)
        await page.goto('https://www.uskopazar.com/', wait_until='domcontentloaded', timeout=30000)
        await page.wait_for_timeout(4000)
        el = page.locator('text=Bugünlük kapat')
        if await el.count() > 0:
            await el.first.click()
            await page.wait_for_timeout(400)
        await page.evaluate("document.getElementById('btn_zero3').click()")
        await page.wait_for_timeout(3000)
        # Cookie'leri al
        cookies = {c['name']:c['value'] for c in await ctx.cookies() if 'uskopazar' in c.get('domain','')}
        await browser.close()
    return token_data, cookies

token_data, cookies = asyncio.run(get_token())
print(f"Token alindi: {token_data.get('req_token','')[:30]}...")

sess = requests.Session()
sess.headers.update({
    'User-Agent': 'Mozilla/5.0 Chrome/152.0.0.0',
    'X-Requested-With': 'XMLHttpRequest',
    'Referer': 'https://www.uskopazar.com/',
    'Accept': 'text/html, */*; q=0.01',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
})
for k,v in cookies.items():
    sess.cookies.set(k, v)

def fetch_page(page_num, server_type=0, search='', upgrade=0):
    data = {
        'fingerprint': token_data.get('fingerprint','417c2f83'),
        'req_token':   token_data['req_token'],
        'pageCount':   page_num,
        'merchantType':0, 'orderType':0,
        'limitType':   192,
        'serverType':  server_type,
        'searchType':  0, 'itemType':0,
        'minVal':0, 'maxVal':0,
        'Item_Arti':   upgrade,
        'tarih':       '',
        'searchValue': search,
    }
    r = sess.post('https://www.uskopazar.com/dashboard/getItemList', data=data, timeout=20)
    if r.status_code != 200:
        return None, 0
    soup = BeautifulSoup(r.text, 'html.parser')
    rows = soup.select('tbody tr')
    return soup, len(rows)

# Zero3 toplam sayfa bul (binary search yerine lineer — kolay)
print("\nZero3 toplam sayfa aranıyor...")
total_pages = 1
for pg in range(1, 100):
    soup, count = fetch_page(pg)
    print(f"  Sayfa {pg}: {count} satir")
    if count < 192:
        total_pages = pg
        print(f"  Son sayfa: {pg} (toplam {(pg-1)*192 + count} ilan)")
        break
    if pg >= 50:
        print("  50+ sayfa, duruyorum")
        total_pages = 50
        break

print(f"\nZero3 toplam ilan tahmini: ~{total_pages*192}")

# Simdi searchValue=shard test et
print("\n'shard' araniyor...")
s_soup, s_count = fetch_page(1, search='shard')
print(f"shard sayfasi {s_count} satir")
if s_soup and s_count > 0:
    rows = s_soup.select('tbody tr')
    for r in rows[:5]:
        cells = r.find_all('td')
        if cells:
            spans = cells[0].find_all('span')
            name = spans[0].get_text(strip=True) if spans else '?'
            price = cells[3].find('span').get_text(strip=True) if len(cells)>3 and cells[3].find('span') else '?'
            print(f"  {name} | {price}")
