"""sample_response.html'i parse et — hangi itemlar var, fiyat yapısı nasıl"""
import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from bs4 import BeautifulSoup

with open('scripts/sample_response.html', encoding='utf-8', errors='replace') as f:
    html = f.read()

soup = BeautifulSoup(html, 'lxml')
rows = soup.select('tbody tr')
print(f"Satir sayisi: {len(rows)}\n")

for row in rows:
    cells = row.find_all('td')
    if len(cells) < 4:
        continue

    # span.white (item adi)
    ws = cells[0].find('span', class_='white')
    name_white = ws.get_text(strip=True) if ws else 'YOK'

    # tippy'den item_title
    tippy_el = cells[0].find(attrs={'data-tippy-content': True})
    tippy_name = ''
    if tippy_el:
        tc = tippy_el.get('data-tippy-content', '')
        m = re.search(r'item_title[^>]*>([^<]+)', tc)
        tippy_name = m.group(1).strip() if m else ''

    # fiyat td[3]
    price_el = cells[3].find('span', style=lambda s: s and 'color:red' in s.replace(' ', ''))
    price = price_el.get_text(strip=True) if price_el else 'YOK'

    # td[4] — ilan miktarı?
    c4 = cells[4].get_text(strip=True) if len(cells) > 4 else ''

    print(f"  white={name_white!r:40s}  tippy={tippy_name!r:40s}  fiyat={price:12s}  td4={c4!r}")
