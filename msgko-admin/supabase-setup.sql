-- ============================================================
-- MSGKO Admin Panel — Supabase Kurulum SQL
-- Supabase Dashboard > SQL Editor'da çalıştırın
-- ============================================================

-- 1. Wallpapers tablosu
CREATE TABLE IF NOT EXISTS wallpapers (
  id          SERIAL PRIMARY KEY,
  label       TEXT NOT NULL,
  src         TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'genel',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS — sadece service role erişebilir
ALTER TABLE wallpapers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON wallpapers
  FOR ALL USING (auth.role() = 'service_role');

-- 2. Videos tablosu
CREATE TABLE IF NOT EXISTS videos (
  id            SERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  youtube_id    TEXT NOT NULL,
  published_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sort_order    INT NOT NULL DEFAULT 0,
  is_visible    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON videos
  FOR ALL USING (auth.role() = 'service_role');

-- Public read (site tarafı videolara erişebilsin)
CREATE POLICY "public_read_visible" ON videos
  FOR SELECT USING (is_visible = TRUE);

-- 3. Admin settings tablosu
CREATE TABLE IF NOT EXISTS admin_settings (
  id                  INT PRIMARY KEY DEFAULT 1,
  totp_enabled        BOOLEAN NOT NULL DEFAULT FALSE,
  totp_secret         TEXT,
  site_title          TEXT NOT NULL DEFAULT 'MSGKO — Knight Online Gelişim Rehberi',
  site_description    TEXT NOT NULL DEFAULT 'Knight Online Türkçe rehber ve eğitim platformu.',
  site_keywords       TEXT,
  youtube_channel     TEXT NOT NULL DEFAULT 'https://www.youtube.com/@musaagll',
  instagram_handle    TEXT NOT NULL DEFAULT 'msgclip',
  footer_links        JSONB,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON admin_settings
  FOR ALL USING (auth.role() = 'service_role');

-- Varsayılan kayıt
INSERT INTO admin_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- 4. Wallpapers storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('wallpapers', 'wallpapers', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Storage policy — service role yazabilir, herkes okuyabilir
CREATE POLICY "public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'wallpapers');

CREATE POLICY "service_role_write" ON storage.objects
  FOR ALL USING (bucket_id = 'wallpapers' AND auth.role() = 'service_role');

-- ============================================================
-- Kurulum tamamlandı!
-- ============================================================
