"""uskopazar.com HTML yapısını tam analiz et - lokasyon, tippy, item detay"""
import sys, io, re, requests, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from bs4 import BeautifulSoup

BASE = 'https://www.uskopazar.com'
sess = requests.Session()
sess.headers.update({
    'User-Agent': 'Mozilla/5.0 Chrome/124.0.0.0',
    'Accept-Language': 'tr-TR',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'text/html, */*; q=0.01',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Referer': BASE + '/',
})
r0 = sess.get(BASE, timeout=20)
m = re.search(r'var\s+REQ_TOKEN\s*=\s*"([^"]+)"', r0.text)
token = m.group(1) if m else ''
print(f'Token: {token[:20]}...')

r = sess.post(BASE + '/dashboard/getItemList', data={
    'fingerprint': '417c2f83', 'req_token': token,
    'pageCount': 1, 'merchantType': 0, 'orderType': 1,
    'limitType': 5, 'serverType': 0, 'searchType': 0,
    'itemType': 0, 'minVal': 0, 'maxVal': 0, 'Item_Arti': 0, 'tarih': '',
}, timeout=15)
print(f'HTTP: {r.status_code}')
if r.status_code != 200:
    print(r.text[:200])
    sys.exit()

soup = BeautifulSoup(r.text, 'lxml')
rows = soup.select('tbody tr')
print(f'Satir sayisi: {len(rows)}')

for i, row in enumerate(rows[:3]):
    cells = row.find_all('td')
    if len(cells) < 4:
        continue
    print(f'\n{"="*50} Satir {i+1} {"="*50}')
    for j, cell in enumerate(cells):
        txt = cell.get_text(strip=True)[:80]
        html_preview = str(cell)[:400]
        print(f'\n  td[{j}] text="{txt}"')
        print(f'  html: {html_preview}')

    # Özellikle tippy content'i ayrıca göster
    tippy = cells[0].find(attrs={'data-tippy-content': True})
    if tippy:
        tc = tippy.get('data-tippy-content', '')
        print(f'\n  TIPPY HTML ({len(tc)} chars):')
        print(f'  {tc[:600]}')

    # Lokasyon
    loc_btn = cells[2].find('button') if len(cells) > 2 else None
    if loc_btn:
        print(f'\n  LOKASYON: data-x={loc_btn.get("data-x")} data-z={loc_btn.get("data-z")} text={loc_btn.get_text(strip=True)[:50]}')
