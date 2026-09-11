"""req_token nasil uretiliyor - JS analizi"""
import sys, io, re, requests
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BASE = 'https://www.uskopazar.com'
sess = requests.Session()
sess.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Referer': BASE + '/',
})

# Ana sayfayı al
r = sess.get(BASE, timeout=20)
html = r.text
ci_session = sess.cookies.get('ci_session', '')
print(f'ci_session: {ci_session[:30]}')

# JS dosyalarını bul
js_files = re.findall(r'src=["\']([^"\']+\.js[^"\']*)["\']', html)
# assets/js içindekiler
local_js = [j for j in js_files if 'assets' in j or j.startswith('/')]
print(f'Local JS: {local_js}')

# Her JS dosyasını indir, req_token ara
for js in local_js[:6]:
    url = js if js.startswith('http') else BASE + '/' + js.lstrip('/')
    try:
        r2 = sess.get(url, timeout=10)
        content = r2.text
        if 'req_token' in content:
            print(f'\n=== {js} — req_token BULUNDU ===')
            # req_token etrafındaki kodu göster
            idx = content.find('req_token')
            while idx >= 0:
                snippet = content[max(0,idx-80):idx+120]
                print(f'  ...{snippet}...')
                idx = content.find('req_token', idx+1)
                if idx > 0 and content.find('req_token', idx+1) - idx > 500:
                    break
        if 'getItemList' in content:
            print(f'\n=== {js} — getItemList BULUNDU ===')
            idx = content.find('getItemList')
            print(f'  {content[max(0,idx-50):idx+200]}')
    except Exception as e:
        print(f'  {js}: HATA {e}')

# Tüm inline script taglerinde ara
scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
for i, sc in enumerate(scripts):
    if 'req_token' in sc:
        print(f'\n=== Inline script {i} — req_token ===')
        idx = sc.find('req_token')
        print(sc[max(0,idx-100):idx+300])
