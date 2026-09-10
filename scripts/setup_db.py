"""Supabase PostgreSQL'e doğrudan bağlanarak tabloları oluşturur."""
import psycopg2

# Supabase PostgreSQL bağlantı bilgileri
# Host: db.<project-ref>.supabase.co  Port: 5432
DB_CONFIG = {
    "host":     "db.ucakaqmjnzttqzxakloc.supabase.co",
    "port":     5432,
    "dbname":   "postgres",
    "user":     "postgres",
    "password": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjYWthcW1qbnp0dHF6eGFrbG9jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQyNTQ3MiwiZXhwIjoyMDk2MDAxNDcyfQ.SPxl9faVMaLpnZ3Egf_JAe0xMbLNVdMt92cRGVE5b-I",
    "sslmode":  "require",
    "connect_timeout": 15,
}

SQL = """
-- market_listings
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
);
ALTER TABLE market_listings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_read      ON market_listings;
DROP POLICY IF EXISTS service_role_all ON market_listings;
CREATE POLICY public_read      ON market_listings FOR SELECT USING (TRUE);
CREATE POLICY service_role_all ON market_listings FOR ALL USING (auth.role() = 'service_role');
CREATE INDEX IF NOT EXISTS idx_ml_server    ON market_listings(server);
CREATE INDEX IF NOT EXISTS idx_ml_name      ON market_listings(item_name);
CREATE INDEX IF NOT EXISTS idx_ml_price     ON market_listings(price ASC);
CREATE INDEX IF NOT EXISTS idx_ml_scraped   ON market_listings(scraped_at DESC);

-- market_scrape_log
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
DROP POLICY IF EXISTS public_read      ON market_scrape_log;
DROP POLICY IF EXISTS service_role_all ON market_scrape_log;
CREATE POLICY public_read      ON market_scrape_log FOR SELECT USING (TRUE);
CREATE POLICY service_role_all ON market_scrape_log FOR ALL USING (auth.role() = 'service_role');
"""

try:
    print("Supabase PostgreSQL bağlanılıyor...")
    conn = psycopg2.connect(**DB_CONFIG)
    conn.autocommit = True
    cur = conn.cursor()
    print("Bağlandı ✓")
    print("Tablolar oluşturuluyor...")
    cur.execute(SQL)
    print("✓ market_listings oluşturuldu")
    print("✓ market_scrape_log oluşturuldu")
    cur.close()
    conn.close()
    print("\nKurulum tamamlandı!")
except Exception as e:
    print(f"HATA: {e}")
    # Şifre yanlış olabilir — gerçek db şifresini dene
    print("\nNot: PostgreSQL şifresi service_role key değil.")
    print("Supabase Dashboard → Settings → Database → Password")
