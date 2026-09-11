"""
uskopazar.com itemType parametresini test et
itemType=0 = hepsi, 1,2,3... = kategori
"""
import sys, io, re, requests, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from bs4 import BeautifulSoup

BASE = 'https://www.uskopazar.com'
sess = requests.Session()
sess.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'tr-TR,tr;q=0.9',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'text/html, */*; q=0.01',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Referer': BASE + '/',
})

# Token al
r0 = sess.get(BASE, timeout=20)
m = re.search(r'var\s+REQ_TOKEN\s*=\s*["\']([A-Za-z0-9\-_.=+/]+)["\']', r0.text)
if not m:
    print("Token alinamadi!")
    sys.exit(1)
token = m.group(1)
print(f"Token: {token[:20]}...")

def post(server_type=0, item_type=0, order_type=0, page=1):
    r = sess.post(f'{BASE}/dashboard/getItemList', data={
        'fingerprint': '417c2f83',
        'req_token': token,
        'pageCount': page,
        'merchantType': 0,
        'orderType': order_type,
        'limitType': 24,
        'serverType': server_type,
        'searchType': 0,
        'itemType': item_type,
        'minVal': 0, 'maxVal': 0,
        'Item_Arti': 0, 'tarih': '',
    }, timeout=15)
    return r

def parse_items(html):
    soup = BeautifulSoup(html, 'lxml')
    rows = soup.select('tbody tr')
    items = []
    for row in rows:
        cells = row.find_all('td')
        if len(cells) < 4: continue
        ws = cells[0].find('span', class_='white')
        name = ws.get_text(strip=True) if ws else cells[0].get_text(strip=True)[:30]
        price_el = cells[3].find('span')
        price = price_el.get_text(strip=True) if price_el else '?'
        items.append(f"{name} | {price}")
    return items

# Zero3 farklı orderType'ları dene
print("\n=== Zero3, orderType=0 (varsayilan) ===")
r = post(server_type=0, item_type=0, order_type=0)
print(f"HTTP: {r.status_code}")
if r.status_code == 200:
    for x in parse_items(r.text)[:5]:
        print(f"  {x}")

import time; time.sleep(2)

print("\n=== Zero3, orderType=1 ===")
r = post(server_type=0, item_type=0, order_type=1)
print(f"HTTP: {r.status_code}")
if r.status_code == 200:
    for x in parse_items(r.text)[:5]:
        print(f"  {x}")

time.sleep(2)

print("\n=== Zero3, orderType=2 ===")
r = post(server_type=0, item_type=0, order_type=2)
print(f"HTTP: {r.status_code}")
if r.status_code == 200:
    for x in parse_items(r.text)[:5]:
        print(f"  {x}")

time.sleep(2)

# Ana sayfadaki orderType seçeneklerine bak
print("\n=== Ana sayfa orderType dropdown ===")
idx = r0.text.find('orderType')
if idx >= 0:
    print(r0.text[max(0,idx-50):idx+300])

idx2 = r0.text.find('spanid_order')
if idx2 >= 0:
    print(r0.text[max(0,idx2-20):idx2+500])
