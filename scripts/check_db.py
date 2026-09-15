"""Supabase'deki veri durumunu kontrol et"""
import sys, io, requests, json
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

URL = "https://ucakaqmjnzttqzxakloc.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYWthcW1qbnp0dHF6eGFrbG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQyNTQ3MiwiZXhwIjoyMDk2MDAxNDcyfQ.SPxl9faVMaLpnZ3Egf_JAe0xMbLNVdMt92cRGVE5b-I"
H = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Prefer": "count=exact"}

channels = ["zero3","zero4","zero5","zero8","agartha3","agartha4","pandora3","pandora4","destan2","destan3"]

print("=== HAM TABLO vs VIEW ===")
for ch in channels:
    r1 = requests.get(f"{URL}/rest/v1/market_listings?server=eq.{ch}&select=id&limit=1", headers=H)
    r2 = requests.get(f"{URL}/rest/v1/market_listings_grouped?server=eq.{ch}&select=id&limit=1", headers=H)
    c1 = r1.headers.get("Content-Range","*/0").split("/")[-1]
    c2 = r2.headers.get("Content-Range","*/0").split("/")[-1]
    print(f"  {ch:12s} ham={c1:6s} view={c2:6s}")

print()
print("=== zero4'te Raptor/Shard ham tablodan ===")
for item in ["Raptor","Shard","Glave","Mirage","Chitin","Iron"]:
    r = requests.get(f"{URL}/rest/v1/market_listings?server=eq.zero4&item_name=ilike.*{item}*&select=id&limit=1", headers=H)
    cnt = r.headers.get("Content-Range","*/0").split("/")[-1]
    print(f"  {item:15s}: {cnt}")

print()
print("=== zero4 ham - en pahalı 10 ===")
r = requests.get(f"{URL}/rest/v1/market_listings?server=eq.zero4&select=item_name,price,upgrade_level&order=price.desc&limit=10", headers=H)
for d in r.json():
    print(f"  {d['item_name']:40s} +{d['upgrade_level']} = {d['price']:,}")

print()
print("=== zero4 ham - en ucuz 10 ===")
r = requests.get(f"{URL}/rest/v1/market_listings?server=eq.zero4&select=item_name,price,upgrade_level&order=price.asc&limit=10", headers=H)
for d in r.json():
    print(f"  {d['item_name']:40s} +{d['upgrade_level']} = {d['price']:,}")
