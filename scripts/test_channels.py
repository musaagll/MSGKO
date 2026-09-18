import sys, io, requests
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

URL = "https://ucakaqmjnzttqzxakloc.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYWthcW1qbnp0dHF6eGFrbG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQyNTQ3MiwiZXhwIjoyMDk2MDAxNDcyfQ.SPxl9faVMaLpnZ3Egf_JAe0xMbLNVdMt92cRGVE5b-I"
H  = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Prefer": "count=exact"}

channels = ["zero3","zero4","zero5","zero8","agartha3","agartha4","pandora3","pandora4","destan2","destan3"]

print(f"{'Kanal':12s} {'Ham':8s} {'Unique':8s} {'Son Çekim':20s} {'En Ucuz Item':30s}")
print("-"*80)

for ch in channels:
    # ham sayı
    r1 = requests.get(f"{URL}/rest/v1/market_listings?server=eq.{ch}&select=id,scraped_at&order=scraped_at.desc&limit=1",
        headers=H)
    cnt = r1.headers.get("Content-Range", "*/0").split("/")[-1]
    items = r1.json()
    son = items[0]["scraped_at"][:16] if items else "—"

    # unique
    r2 = requests.post(f"{URL}/rest/v1/rpc/get_market_listings_count",
        json={"p_server": ch, "p_q": None, "p_upgrade": -1},
        headers={**H, "Content-Type": "application/json"})
    unique = r2.json() if r2.ok else "?"

    # en ucuz 1
    r3 = requests.post(f"{URL}/rest/v1/rpc/get_market_listings",
        json={"p_server": ch, "p_q": None, "p_sort": "price_asc", "p_upgrade": -1, "p_limit": 1, "p_offset": 0},
        headers={**H, "Content-Type": "application/json"})
    ucuz = ""
    if r3.ok and r3.json():
        x = r3.json()[0]
        ucuz = f"{x['item_name'][:28]} {x['price']:,}₦"

    print(f"{ch:12s} {cnt:8s} {str(unique):8s} {son:20s} {ucuz}")
