import sys, io, requests
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

URL = "https://ucakaqmjnzttqzxakloc.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYWthcW1qbnp0dHF6eGFrbG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQyNTQ3MiwiZXhwIjoyMDk2MDAxNDcyfQ.SPxl9faVMaLpnZ3Egf_JAe0xMbLNVdMt92cRGVE5b-I"
H  = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}

print("=== 1. zero4 toplam ilan (direkt tablo) ===")
r = requests.get(f"{URL}/rest/v1/market_listings?server=eq.zero4&select=id&limit=1",
    headers={**H, "Prefer": "count=exact"})
print(f"  Content-Range: {r.headers.get('Content-Range')}")

print("\n=== 2. zero4 unique item (RPC yeni) ===")
r2 = requests.post(f"{URL}/rest/v1/rpc/get_market_listings_count", json={
    "p_server": "zero4", "p_q": None, "p_upgrade": -1
}, headers=H)
print(f"  Status: {r2.status_code}, count: {r2.json()}")

print("\n=== 3. zero4 price_asc ilk 5 (RPC) ===")
r3 = requests.post(f"{URL}/rest/v1/rpc/get_market_listings", json={
    "p_server": "zero4", "p_q": None, "p_sort": "price_asc",
    "p_upgrade": -1, "p_limit": 5, "p_offset": 0
}, headers=H)
print(f"  Status: {r3.status_code}")
if r3.ok:
    for x in r3.json():
        print(f"  {x.get('item_name'):40s} x{x.get('item_count')} | {x.get('price'):,}")
else: print(f"  HATA: {r3.text[:300]}")

print("\n=== 4. all_zero Raptor arama (RPC) ===")
r4 = requests.post(f"{URL}/rest/v1/rpc/get_market_listings", json={
    "p_server": "all_zero", "p_q": "Raptor", "p_sort": "price_asc",
    "p_upgrade": -1, "p_limit": 10, "p_offset": 0
}, headers=H)
print(f"  Status: {r4.status_code}")
if r4.ok:
    d4 = r4.json()
    print(f"  Bulunan: {len(d4)}")
    for x in d4[:5]:
        print(f"  {x.get('server'):10s} | {x.get('item_name'):40s} +{x.get('upgrade_level')} | {x.get('price'):,}")
else: print(f"  HATA: {r4.text[:300]}")

print("\n=== 5. all_zero count (RPC) ===")
r5 = requests.post(f"{URL}/rest/v1/rpc/get_market_listings_count", json={
    "p_server": "all_zero", "p_q": None, "p_upgrade": -1
}, headers=H)
print(f"  Status: {r5.status_code}, count: {r5.json()}")

print("\n=== 6. zero4 ham tabloda Raptor var mı? ===")
r6 = requests.get(f"{URL}/rest/v1/market_listings?server=eq.zero4&item_name=ilike.*Raptor*&select=item_name,price&limit=1",
    headers={**H, "Prefer": "count=exact"})
print(f"  Content-Range: {r6.headers.get('Content-Range')}")
