"""REQ_TOKEN nasil set ediliyor"""
import sys, io, re, requests
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BASE = 'https://www.uskopazar.com'
sess = requests.Session()
sess.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
    'Referer': BASE + '/',
})
r = sess.get(BASE, timeout=20)
html = r.text

# Tüm inline script'lerde REQ_TOKEN araması
scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
print(f'Toplam inline script: {len(scripts)}')
for i, sc in enumerate(scripts):
    if 'REQ_TOKEN' in sc or 'req_token' in sc.lower():
        print(f'\n=== Inline script {i} (ilk 2000 karakter) ===')
        print(sc[:2000])

# app.bundle.js içinde REQ_TOKEN
try:
    r2 = sess.get(f'{BASE}/assets/js/app.bundle.js', timeout=15)
    js = r2.text
    print(f'\napp.bundle.js boyut: {len(js)}')
    # REQ_TOKEN araması
    for m in re.finditer(r'.{0,100}REQ_TOKEN.{0,100}', js):
        print(f'  {m.group()}')
    # req_token araması
    for m in re.finditer(r'.{0,100}req_token.{0,100}', js):
        print(f'  {m.group()}')
except Exception as e:
    print(f'app.bundle.js hatasi: {e}')
