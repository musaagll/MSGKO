-- ============================================================
-- MSGKO — Wallpaper Tablosu Düzeltmesi
-- Supabase Dashboard > SQL Editor'da çalıştırın.
-- Supabase pause sonrası görseller gelmiyor sorunu için.
-- ============================================================

-- 1. Public read policy ekle (anon key ile GET çalışsın)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'wallpapers' AND policyname = 'public_read'
  ) THEN
    CREATE POLICY "public_read" ON wallpapers
      FOR SELECT USING (TRUE);
  END IF;
END $$;

-- 2. click_count ve download_count kolonları eksikse ekle
ALTER TABLE wallpapers
  ADD COLUMN IF NOT EXISTS click_count    INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS download_count INT NOT NULL DEFAULT 0;

-- 3. Doğrulama: Kaç wallpaper var?
SELECT COUNT(*) AS wallpaper_count FROM wallpapers;

-- 4. Storage bucket hâlâ public mi?
SELECT id, name, public FROM storage.buckets WHERE id = 'wallpapers';

-- ============================================================
-- Tamamlandı. Site tarafında /api/wallpapers çağrısı
-- artık anon key ile çalışır.
-- ============================================================
