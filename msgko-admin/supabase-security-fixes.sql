-- ============================================================
-- MSGKO — Güvenlik ve tutarlılık düzeltmeleri (Ekim 2026)
-- Supabase Dashboard > SQL Editor'da bir kez çalıştırın.
-- Tekrar çalıştırılması güvenlidir (idempotent).
-- ============================================================

-- 1. content_tags: RLS kapalıydı → anon key ile yazılabiliyordu
ALTER TABLE IF EXISTS content_tags ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'content_tags' AND policyname = 'service_role_all') THEN
    CREATE POLICY "service_role_all" ON content_tags FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'content_tags' AND policyname = 'public_read') THEN
    CREATE POLICY "public_read" ON content_tags FOR SELECT USING (TRUE);
  END IF;
END $$;

-- 2. Wallpaper sayaçları için atomik artış (site /api/wallpapers bunu çağırır).
--    Yalnızca iki sayaç kolonu artırılabilir; başka kolon/tablo etkilenemez.
CREATE OR REPLACE FUNCTION increment_wallpaper_stat(wallpaper_id INT, col_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF col_name = 'click_count' THEN
    UPDATE wallpapers SET click_count = click_count + 1 WHERE id = wallpaper_id;
  ELSIF col_name = 'download_count' THEN
    UPDATE wallpapers SET download_count = download_count + 1 WHERE id = wallpaper_id;
  ELSE
    RAISE EXCEPTION 'invalid column: %', col_name;
  END IF;
END;
$$;
REVOKE ALL ON FUNCTION increment_wallpaper_stat(INT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_wallpaper_stat(INT, TEXT) TO anon, authenticated, service_role;

-- 3. page_views: anonim insert yalnızca geçerli site yollarına izin versin
DROP POLICY IF EXISTS "public_insert" ON page_views;
CREATE POLICY "public_insert" ON page_views
  FOR INSERT WITH CHECK (
    page ~ '^/[a-z0-9/-]{0,120}$'
    AND referrer IS NULL
    AND user_agent IS NULL
  );

-- 4. (Opsiyonel) page_views 180 günden eski kayıtları temizle — tablo sınırsız büyümesin.
-- DELETE FROM page_views WHERE created_at < NOW() - INTERVAL '180 days';

-- ============================================================
-- Doğrulama:
--   SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY 1;
--   (rowsecurity = false olan tablo kalmamalı)
-- ============================================================
