"""uskopazar.com Zero3 ilk sayfasını çek - ne gösteriyor?"""
import sys, io, re, requests
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from bs4 import BeautifulSoup

BASE = 'https://www.uskopazar.com'
sess = requests.Session()
sess.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'tr-TR,tr;q=0.9',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'text/html, */*; q=0.01',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Referer': BASE + '/',
})

r0 = sess.get(BASE, timeout=20)
m = re.search(r'var REQ_TOKEN = "([^"]+)"', r0.text)
token = m.group(1) if m else ''
print(f'Token: {token[:20]}')

# orderType=0, ilk 24 ilan
r = sess.post(BASE + '/dashboard/getItemList', data={
    'fingerprint': '417c2f83', 'req_token': token,
    'pageCount': 1, 'merchantType': 0, 'orderType': 0,
    'limitType': 24, 'serverType': 0, 'searchType': 0,
    'itemType': 0, 'minVal': 0, 'maxVal': 0, 'Item_Arti': 0, 'tarih': '',
}, timeout=15)
print(f'HTTP: {r.status_code}')

if r.status_code == 200:
    soup = BeautifulSoup(r.text, 'lxml')
    rows = soup.select('tbody tr')
    print(f'\nUskopazar Zero3 ilk {len(rows)} ilan:')
    for row in rows:
        cells = row.find_all('td')
        if len(cells) < 4: continue
        ws = cells[0].find('span', class_='white')
        name = ws.get_text(strip=True) if ws else '?'
        pe = cells[3].find('span')
        price = pe.get_text(strip=True) if pe else '?'
        seller = cells[1].get_text(strip=True)
        print(f'  {name:40s} {price:15s} {seller}')
