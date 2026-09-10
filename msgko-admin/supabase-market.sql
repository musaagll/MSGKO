-- ============================================================
-- MSGKO — Market (Pazar) Tabloları
-- Supabase Dashboard > SQL Editor'da çalıştırın.
-- ============================================================

-- ── market_listings: Anlık item ilanları ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS market_listings (
  id              BIGSERIAL PRIMARY KEY,
  -- Sunucu
  server          TEXT NOT NULL,                  -- 'zero','destan','pandora','agartha'
  -- Item bilgileri
  item_name       TEXT NOT NULL,
  item_count      INT  NOT NULL DEFAULT 1,
  upgrade_level   INT,                            -- NULL = upgrade yok
  -- Fiyat (Noah cinsinden)
  price           BIGINT NOT NULL,
  price_per_unit  BIGINT,                         -- Adet başına fiyat
  -- Satıcı
  seller_name     TEXT,
  -- Zaman
  listed_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  scraped_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Ham veri (debug için)
  raw_data        JSONB
);

-- RLS
ALTER TABLE market_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON market_listings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "public_read" ON market_listings
  FOR SELECT USING (TRUE);

-- Index'ler — arama ve sıralama için kritik
CREATE INDEX IF NOT EXISTS idx_market_server ON market_listings(server);
CREATE INDEX IF NOT EXISTS idx_market_item_name ON market_listings(item_name);
CREATE INDEX IF NOT EXISTS idx_market_price ON market_listings(price ASC);
CREATE INDEX IF NOT EXISTS idx_market_scraped_at ON market_listings(scraped_at DESC);
CREATE INDEX IF NOT EXISTS idx_market_server_item ON market_listings(server, item_name);

-- ── market_scrape_log: Scrape geçmişi / durum takibi ─────────────────────────
CREATE TABLE IF NOT EXISTS market_scrape_log (
  id          SERIAL PRIMARY KEY,
  server      TEXT NOT NULL,
  status      TEXT NOT NULL,                      -- 'success','error','partial'
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

-- ── Temizleme fonksiyonu: 30 dakikadan eski ilanları sil ─────────────────────
-- Bu fonksiyonu scraper her çalıştığında çağırır
CREATE OR REPLACE FUNCTION cleanup_old_listings()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM market_listings
  WHERE scraped_at < NOW() - INTERVAL '30 minutes';
END;
$$;

-- ============================================================
-- Kurulum tamamlandı!
-- Tablolar: market_listings, market_scrape_log
-- ============================================================
