"""Her GB sitesinin logo/og:image URL'sini bul"""
import sys, io, re, requests
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

SITES = {
    'bynogame':   'https://www.bynogame.com',
    'sonteklif':  'https://www.sonteklif.com',
    'gamesatis':  'https://www.gamesatis.com',
    'oyuneks':    'https://oyuneks.com',
    'kabasakal':  'https://kabasakalonline.com',
    'oyunfor':    'https://www.oyunfor.com',
    'bursagb':    'https://www.bursagb.com',
    'kopazar':    'https://www.kopazar.com',
    'knightpin':  'https://knightpin.com',
}

H = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html',
}

for name, url in SITES.items():
    try:
        r = requests.get(url, headers=H, timeout=10)
        html = r.text
        # og:image
        og = re.search(r'og:image["\s][^>]*content=["\']([^"\']+)', html)
        # apple-touch-icon
        apple = re.search(r'apple-touch-icon[^>]+href=["\']([^"\']+)', html)
        # link rel=icon
        icon = re.search(r'rel=["\'](?:shortcut )?icon["\'][^>]+href=["\']([^"\']+)', html)
        icon2 = re.search(r'href=["\']([^"\']+)["\'][^>]+rel=["\'](?:shortcut )?icon["\']', html)
        # img src logo
        logo_img = re.search(r'(?i)src=["\']([^"\']*logo[^"\']*\.(?:png|svg|webp))["\']', html)

        print(f"\n{name}:")
        if og:      print(f"  og:image      = {og.group(1)[:100]}")
        if apple:   print(f"  apple-touch   = {apple.group(1)[:100]}")
        if icon:    print(f"  icon          = {icon.group(1)[:100]}")
        if icon2:   print(f"  icon2         = {icon2.group(1)[:100]}")
        if logo_img:print(f"  logo img      = {logo_img.group(1)[:100]}")
        if not any([og, apple, icon, icon2, logo_img]):
            print("  NOTHING FOUND")
    except Exception as e:
        print(f"\n{name}: ERROR {e}")
