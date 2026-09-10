"""market_scrape_log tablosunu Supabase'de oluşturur."""
import requests, json

URL = "https://ucakaqmjnzttqzxakloc.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYWthcW1qbnp0dHF6eGFrbG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQyNTQ3MiwiZXhwIjoyMDk2MDAxNDcyfQ.SPxl9faVMaLpnZ3Egf_JAe0xMbLNVdMt92cRGVE5b-I"
H = {"apikey": KEY, "Authorization": f"Bearer {KEY}",
     "Content-Type": "application/json", "Prefer": "return=minimal"}

# Tabloya doğrudan bir kayıt insert etmeyi dene — tablo yoksa oluştururuz
# Önce var mı kontrol et
r = requests.get(f"{URL}/rest/v1/market_scrape_log?select=id&limit=1", headers=H)
if r.status_code == 200:
    print("market_scrape_log zaten var ✓")
else:
    print(f"market_scrape_log yok ({r.status_code}), Supabase SQL Editor'da çalıştırın:")
    print("""
CREATE TABLE IF NOT EXISTS market_scrape_log (
    id          SERIAL PRIMARY KEY,
    server      TEXT NOT NULL,
    status      TEXT NOT NULL,
    items_count INT  NOT NULL DEFAULT 0,
    error_msg   TEXT,
    duration_ms INT,
    scraped_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE market_scrape_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON market_scrape_log
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "public_read" ON market_scrape_log
  FOR SELECT USING (TRUE);
""")
