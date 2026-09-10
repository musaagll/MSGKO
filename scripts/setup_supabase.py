"""
MSGKO — Supabase Tablo Kurulumu
market_listings ve market_scrape_log tablolarını oluşturur.
"""
import requests

SUPABASE_URL = "https://ucakaqmjnzttqzxakloc.supabase.co"
SERVICE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYWthcW1qbnp0dHF6eGFrbG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQyNTQ3MiwiZXhwIjoyMDk2MDAxNDcyfQ.SPxl9faVMaLpnZ3Egf_JAe0xMbLNVdMt92cRGVE5b-I"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

# ── SQL ifadeleri (her biri ayrı çalışacak) ────────────────────────────────────
STATEMENTS = [
    # 1. market_listings tablosu
    """
    CREATE TABLE IF NOT EXISTS market_listings (
        id              BIGSERIAL PRIMARY KEY,
        server          TEXT NOT NULL,
        item_name       TEXT NOT NULL,
        item_count      INT  NOT NULL DEFAULT 1,
        upgrade_level   INT,
        price           BIGINT NOT NULL,
        price_per_unit  BIGINT,
        seller_name     TEXT,
        scraped_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        raw_data        TEXT
    )
    """,
    # 2. RLS aç
    "ALTER TABLE market_listings ENABLE ROW LEVEL SECURITY",
    # 3. Public read policy
    """
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename='market_listings' AND policyname='public_read'
      ) THEN
        CREATE POLICY public_read ON market_listings FOR SELECT USING (TRUE);
      END IF;
    END $$
    """,
    # 4. Service role policy
    """
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename='market_listings' AND policyname='service_role_all'
      ) THEN
        CREATE POLICY service_role_all ON market_listings
          FOR ALL USING (auth.role() = 'service_role');
      END IF;
    END $$
    """,
    # 5. Index'ler
    "CREATE INDEX IF NOT EXISTS idx_market_server   ON market_listings(server)",
    "CREATE INDEX IF NOT EXISTS idx_market_item_name ON market_listings(item_name)",
    "CREATE INDEX IF NOT EXISTS idx_market_price     ON market_listings(price ASC)",
    "CREATE INDEX IF NOT EXISTS idx_market_scraped   ON market_listings(scraped_at DESC)",

    # 6. market_scrape_log tablosu
    """
    CREATE TABLE IF NOT EXISTS market_scrape_log (
        id          SERIAL PRIMARY KEY,
        server      TEXT NOT NULL,
        status      TEXT NOT NULL,
        items_count INT  NOT NULL DEFAULT 0,
        error_msg   TEXT,
        duration_ms INT,
        scraped_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
    """,
    # 7. scrape_log RLS
    "ALTER TABLE market_scrape_log ENABLE ROW LEVEL SECURITY",
    """
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename='market_scrape_log' AND policyname='service_role_all'
      ) THEN
        CREATE POLICY service_role_all ON market_scrape_log
          FOR ALL USING (auth.role() = 'service_role');
      END IF;
    END $$
    """,
    """
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename='market_scrape_log' AND policyname='public_read'
      ) THEN
        CREATE POLICY public_read ON market_scrape_log FOR SELECT USING (TRUE);
      END IF;
    END $$
    """,
]

def run_sql(sql: str) -> bool:
    """Supabase'de SQL çalıştırır — exec_sql RPC üzerinden."""
    resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/rpc/exec_sql",
        json={"sql": sql.strip()},
        headers=HEADERS,
        timeout=30,
    )
    if resp.status_code in (200, 204):
        return True
    # 404 = exec_sql fonksiyonu yok, önce onu oluşturmamız lazım
    return False

def create_exec_sql_fn():
    """Önce exec_sql helper fonksiyonunu oluştur."""
    fn_sql = """
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$
    """
    # Bu adımı doğrudan PostgREST ile yapamayız ama
    # Supabase'in /sql endpoint'ini deneyelim
    resp = requests.post(
        f"{SUPABASE_URL}/sql",
        json={"query": fn_sql.strip()},
        headers=HEADERS,
        timeout=30,
    )
    return resp.status_code in (200, 201, 204)

def main():
    print("=" * 50)
    print("MSGKO — Supabase Tablo Kurulumu")
    print("=" * 50)

    # Önce test — market_listings var mı?
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/market_listings?select=id&limit=1",
        headers=HEADERS,
        timeout=10,
    )
    if r.status_code == 200:
        print("✓ market_listings tablosu zaten var!")
        print("✓ Kurulum zaten tamamlanmış.")
        return True

    print("market_listings tablosu yok, oluşturuluyor...")
    print()

    # exec_sql helper'ı oluşturmayı dene
    print("exec_sql fonksiyonu oluşturuluyor...")
    ok = create_exec_sql_fn()
    print(f"  exec_sql: {'OK' if ok else 'ATILDI (normal)'}")

    # Her SQL ifadesini çalıştır
    success = 0
    for i, stmt in enumerate(STATEMENTS, 1):
        preview = stmt.strip().split('\n')[0][:60]
        result = run_sql(stmt)
        status = "✓" if result else "✗"
        print(f"  [{i:02d}] {status} {preview}...")
        if result:
            success += 1

    print()
    if success == 0:
        print("⚠ exec_sql RPC çalışmadı.")
        print("  Supabase Dashboard > SQL Editor'dan şu dosyayı çalıştırın:")
        print("  msgko-admin/supabase-market.sql")
        return False
    else:
        print(f"✓ {success}/{len(STATEMENTS)} SQL ifadesi çalıştırıldı")

    # Final kontrol
    r2 = requests.get(
        f"{SUPABASE_URL}/rest/v1/market_listings?select=id&limit=1",
        headers=HEADERS,
        timeout=10,
    )
    if r2.status_code == 200:
        print("✓ market_listings tablosu başarıyla oluşturuldu!")
        return True
    else:
        print(f"✗ market_listings hâlâ erişilemiyor: {r2.status_code}")
        return False

if __name__ == "__main__":
    ok = main()
    exit(0 if ok else 1)
