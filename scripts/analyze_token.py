"""Token nasil uretiliyor - HTML/JS analizi"""
import sys, io, re, requests
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

sess = requests.Session()
sess.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'tr-TR,tr;q=0.9',
})

r = sess.get('https://www.uskopazar.com/', timeout=20)
print(f'HTTP: {r.status_code}, boyut: {len(r.text)}')
print(f'Cookies: {dict(sess.cookies)}')

html = r.text

# req_token var mi HTML'de
for pattern in [
    r"req_token['\"]?\s*[:=,]\s*['\"]([^'\"]{10,})",
    r"'req_token'\s*,\s*'([^']+)'",
    r'"req_token"\s*,\s*"([^"]+)"',
    r'req_token.*?value.*?[\'"]([^\'"]{10,})',
]:
    m = re.search(pattern, html)
    if m:
        print(f'req_token pattern bulundu: {m.group(1)[:50]}')
        break
else:
    print('req_token HTML icinde yok')

# fingerprint
for pattern in [r"fingerprint['\"]?\s*[:=,]\s*['\"]([^'\"]+)", r"fingerprint.*?['\"]([a-f0-9]{8,})"]:
    m = re.search(pattern, html)
    if m:
        print(f'fingerprint: {m.group(1)}')
        break

# getItemList cagrilisi
idx = html.find('getItemList')
if idx >= 0:
    print(f'getItemList bulundu: {html[max(0,idx-100):idx+200]}')

# JS dosyalari
js_links = re.findall(r'src=["\']([^"\']+\.js[^"\']*)', html)
print(f'\nJS dosyalari ({len(js_links)}):')
for j in js_links[:8]:
    print(f'  {j}')
