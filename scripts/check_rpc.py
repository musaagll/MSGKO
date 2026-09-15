"""RPC fonksiyonunu test et"""
import sys, io, requests, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

URL = "https://ucakaqmjnzttqzxakloc.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYWthcW1qbnp0dHF6eGFrbG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQyNTQ3MiwiZXhwIjoyMDk2MDAxNDcyfQ.SPxl9faVMaLpnZ3Egf_JAe0xMbLNVdMt92cRGVE5b-I"
H = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json", "Prefer": "count=exact"}

# RPC test - zero4, price_asc, 50 limit
r = requests.post(f"{URL}/rest/v1/rpc/get_market_listings", json={
    "p_server": "zero4", "p_sort": "price_asc", "p_limit": 50, "p_offset": 0
}, headers=H)
print(f"RPC status: {r.status_code}")
print(f"Count header: {r.headers.get('Content-Range','yok')}")
if r.status_code == 200:
    data = r.json()
    print(f"Dönen kayıt: {len(data)}")
    for d in data[:5]:
        print(f"  {d['item_name']:40s} +{d['upgrade_level']} x{d['item_count']} = {d['price']:,}")
else:
    print(f"HATA: {r.text[:300]}")

print()
# RPC test - Raptor araması
r2 = requests.post(f"{URL}/rest/v1/rpc/get_market_listings", json={
    "p_server": "zero4", "p_q": "Raptor", "p_sort": "price_asc", "p_limit": 10, "p_offset": 0
}, headers=H)
print(f"Raptor arama: {r2.status_code} | {r2.headers.get('Content-Range','?')}")
if r2.status_code == 200:
    for d in r2.json()[:5]:
        print(f"  {d['item_name']} +{d['upgrade_level']} = {d['price']:,}")
