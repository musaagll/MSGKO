"""uskopazar zero3'te Raptor/Shard var mı - özel arama ile test"""
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

def search(server_type, search_text, server_name):
    """Arama kutusu ile item ara"""
    r = sess.post(BASE + '/dashboard/getItemList', data={
        'fingerprint': '417c2f83', 'req_token': token,
        'pageCount': 1, 'merchantType': 0, 'orderType': 0,
        'limitType': 24, 'serverType': server_type,
        'searchType': 1,        # <-- item adına göre arama
        'itemType': 0,
        'minVal': 0, 'maxVal': 0, 'Item_Arti': 0,
        'tarih': '',
        'Search_Text': search_text,  # arama terimi
    }, timeout=15)
    print(f'\n{server_name} - "{search_text}" arama: HTTP {r.status_code}')
    if r.status_code == 200:
        soup = BeautifulSoup(r.text, 'lxml')
        rows = soup.select('tbody tr')
        dc = soup.find(id='dataCount')
        total = dc['value'] if dc else '?'
        print(f'  Toplam: {total}, Bu sayfada: {len(rows)}')
        for row in rows[:5]:
            cells = row.find_all('td')
            if len(cells) < 4: continue
            ws = cells[0].find('span', class_='white')
            name = ws.get_text(strip=True) if ws else '?'
            pe = cells[3].find('span')
            price = pe.get_text(strip=True) if pe else '?'
            print(f'  {name} | {price}')

import time
# zero3 = serverType 0
search(0, 'Raptor', 'Zero3')
time.sleep(2)
search(0, 'Shard', 'Zero3')
time.sleep(2)
# zero5 = serverType 8
search(8, 'Raptor', 'Zero5')
