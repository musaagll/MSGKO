import sys, io, requests, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

URL = "https://ucakaqmjnzttqzxakloc.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYWthcW1qbnp0dHF6eGFrbG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQyNTQ3MiwiZXhwIjoyMDk2MDAxNDcyfQ.SPxl9faVMaLpnZ3Egf_JAe0xMbLNVdMt92cRGVE5b-I"
H  = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}

# Test 1: get_market_listings
r1 = requests.post(f"{URL}/rest/v1/rpc/get_market_listings", json={
    "p_server": "zero4", "p_q": None, "p_sort": "price_asc",
    "p_upgrade": -1, "p_limit": 5, "p_offset": 0
}, headers=H)
print(f"get_market_listings: {r1.status_code}")
if r1.ok:
    d = r1.json()
    print(f"  kayit: {len(d)}")
    if d: print(f"  ornek: {d[0].get('item_name')} {d[0].get('price')}")
else:
    print(f"  HATA: {r1.text[:200]}")

# Test 2: get_market_listings_count
r2 = requests.post(f"{URL}/rest/v1/rpc/get_market_listings_count", json={
    "p_server": "zero4", "p_q": None, "p_upgrade": -1
}, headers=H)
print(f"get_market_listings_count: {r2.status_code}")
if r2.ok: print(f"  count: {r2.json()}")
else: print(f"  HATA: {r2.text[:100]}")

# Test 3: all_zero
r3 = requests.post(f"{URL}/rest/v1/rpc/get_market_listings", json={
    "p_server": "all_zero", "p_q": "Raptor", "p_sort": "price_asc",
    "p_upgrade": -1, "p_limit": 5, "p_offset": 0
}, headers=H)
print(f"all_zero Raptor: {r3.status_code}")
if r3.ok:
    d3 = r3.json()
    print(f"  kayit: {len(d3)}")
    for x in d3[:3]: print(f"    {x.get('server')} | {x.get('item_name')} | {x.get('price')}")
else: print(f"  HATA: {r3.text[:200]}")

# Test 4: Direkt tablo sorgusu — karşılaştırma
r4 = requests.get(f"{URL}/rest/v1/market_listings?server=eq.zero4&order=price.asc&limit=5",
    headers={**H, "Prefer": "count=exact"})
print(f"Direkt tablo zero4: {r4.status_code} | {r4.headers.get('Content-Range')}")
if r4.ok:
    for x in r4.json(): print(f"    {x.get('item_name')} | {x.get('price')}")
