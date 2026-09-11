"""Parse'ı requests'ten gelen gerçek HTML ile test et"""
import sys, io, re, requests, asyncio, json
from bs4 import BeautifulSoup
from urllib.parse import unquote_plus
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright

async def get_token():
    td = {}
    ck = {}
    async with async_playwright() as pw:
        b = await pw.chromium.launch(headless=True, args=['--no-sandbox'])
        ctx = await b.new_context(viewport={'width':1920,'height':1080},
            user_agent='Mozilla/5.0 Chrome/152.0.0.0', locale='tr-TR')
        await ctx.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined});")
        p = await ctx.new_page()
        async def on_req(req):
            if 'getItemList' in req.url:
                params = {}
                for x in (req.post_data or '').split('&'):
                    if '=' in x:
                        k,_,v = x.partition('=')
                        params[k] = unquote_plus(v)
                if 'req_token' in params:
                    td.update(params)
        p.on('request', on_req)
        await p.goto('https://www.uskopazar.com/', wait_until='domcontentloaded', timeout=30000)
        await p.wait_for_timeout(4000)
        el = p.locator('text=Bugünlük kapat')
        if await el.count() > 0:
            await el.first.click()
            await p.wait_for_timeout(400)
        await p.evaluate("document.getElementById('btn_zero3').click()")
        await p.wait_for_timeout(3000)
        ck = {c['name']:c['value'] for c in await ctx.cookies() if 'uskopazar' in c.get('domain','')}
        await b.close()
    return td, ck

td, ck = asyncio.run(get_token())
print(f"Token: {td.get('req_token','')[:30]}...")

sess = requests.Session()
sess.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/152.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'text/html, */*; q=0.01',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Referer': 'https://www.uskopazar.com/',
})
for k,v in ck.items():
    sess.cookies.set(k, v, domain='www.uskopazar.com')

# Sayfa 1 al
r = sess.post('https://www.uskopazar.com/dashboard/getItemList', data={
    'fingerprint': td.get('fingerprint','417c2f83'),
    'req_token': td['req_token'],
    'pageCount': 1, 'merchantType':0, 'orderType':0,
    'limitType': 192, 'serverType': 0,
    'searchType':0, 'itemType':0, 'minVal':0, 'maxVal':0, 'Item_Arti':0, 'tarih':'',
}, timeout=20)

print(f"HTTP: {r.status_code}, boyut: {len(r.text)}")

# HTML'i kaydet
with open('scripts/real_page1.html', 'w', encoding='utf-8') as f:
    f.write(r.text)

soup = BeautifulSoup(r.text, 'lxml')
rows = soup.select('tbody tr')
print(f"tbody tr: {len(rows)}")

# İlk 10 satırı parse et
print("\nİlk 10 satır:")
for row in rows[:10]:
    cells = row.find_all('td')
    if len(cells) < 4:
        continue

    # span.white'den item adı
    white_span = cells[0].find('span', class_='white')
    name_via_white = white_span.get_text(strip=True) if white_span else 'YOK'

    # truncate span içindeki iç span
    trunc = cells[0].find('span', class_='truncate')
    inner = trunc.find('span') if trunc else None
    name_via_inner = inner.get_text(strip=True) if inner else 'YOK'

    # tippy'den
    tippy_el = cells[0].find(attrs={'data-tippy-content': True})
    tippy_name = ''
    if tippy_el:
        tippy_html = tippy_el.get('data-tippy-content','')
        m = re.search(r"item_title[^>]*>(.*?)</div>", tippy_html)
        tippy_name = m.group(1).strip() if m else ''

    # Fiyat
    price_el = cells[3].find('span', style=re.compile(r'color\s*:\s*red', re.I))
    price = price_el.get_text(strip=True) if price_el else cells[3].get_text(strip=True).split('\n')[0]

    # Satıcı
    seller = cells[1].get_text(strip=True)

    print(f"  white={name_via_white!r}  inner={name_via_inner!r}  tippy={tippy_name!r}  fiyat={price}  satici={seller}")

# Kaç farklı item ismi var?
all_names = set()
for row in rows:
    cells = row.find_all('td')
    if len(cells) < 2: continue
    white = cells[0].find('span', class_='white')
    if white:
        name = white.get_text(strip=True)
        if name:
            all_names.add(name)

print(f"\nFarklı item sayısı (192 satırda): {len(all_names)}")
print("Örnekler:", list(all_names)[:10])
