-- ============================================================
-- MSGKO — Topical Authority Migration v2
-- Mevcut tablolar KORUNUR, yeni tablolar eklenir.
-- Supabase Dashboard > SQL Editor'da çalıştırın.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. REHBER (Guide) tablosu
--    Karakter sınıfı rehberleri: asas, okcu, warrior, mage, priest, archer, battle-priest
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS guides (
  id              SERIAL PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,           -- 'asas', 'warrior', 'mage' ...
  title           TEXT NOT NULL,
  subtitle        TEXT,
  character_class TEXT NOT NULL,                  -- 'rogue','warrior','mage','priest','archer'
  excerpt         TEXT,
  content         TEXT,                           -- Markdown / HTML
  seo_title       TEXT,
  seo_description TEXT,
  seo_keywords    TEXT[],
  canonical_url   TEXT,
  schema_type     TEXT DEFAULT 'Article',
  difficulty      TEXT DEFAULT 'orta',            -- 'basit','orta','ileri'
  game_version    TEXT DEFAULT 'USKO',
  author          TEXT DEFAULT 'musaagll',
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  view_count      INT NOT NULL DEFAULT 0,
  sort_order      INT NOT NULL DEFAULT 0,
  published_at    TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON guides
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "public_read_published" ON guides
  FOR SELECT USING (is_published = TRUE);

-- ────────────────────────────────────────────────────────────
-- 2. BUILD tablosu
--    Sınıf bazlı stat/skill build'leri
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS builds (
  id              SERIAL PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  character_class TEXT NOT NULL,
  build_type      TEXT NOT NULL,                  -- 'pvp','pve','farm','hybrid'
  excerpt         TEXT,
  content         TEXT,
  -- Stat dağılımı (JSON)
  stats           JSONB DEFAULT '{}',             -- {"str":200,"dex":120,"int":0,"hp":0}
  -- Skill tree (JSON)
  skill_tree      JSONB DEFAULT '[]',             -- [{name,level,required}]
  -- Item önerileri (JSON)
  recommended_items JSONB DEFAULT '[]',           -- [{slot,name,slug}]
  seo_title       TEXT,
  seo_description TEXT,
  seo_keywords    TEXT[],
  difficulty      TEXT DEFAULT 'orta',
  game_version    TEXT DEFAULT 'USKO',
  author          TEXT DEFAULT 'musaagll',
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  view_count      INT NOT NULL DEFAULT 0,
  sort_order      INT NOT NULL DEFAULT 0,
  published_at    TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE builds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON builds
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "public_read_published" ON builds
  FOR SELECT USING (is_published = TRUE);

-- ────────────────────────────────────────────────────────────
-- 3. ITEM tablosu
--    Silah, zırh, aksesuar, takı — Knight Online item database
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS items (
  id              SERIAL PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  name_en         TEXT,
  item_type       TEXT NOT NULL,                  -- 'weapon','armor','accessory','ring','necklace','shield','helmet','gloves','boots','cape'
  sub_type        TEXT,                           -- 'sword','spear','staff','bow','dagger'
  character_class TEXT[],                         -- ['warrior','rogue','mage','priest','archer'] veya []
  race            TEXT DEFAULT 'all',             -- 'human','karus','all'
  -- Statlar (JSON)
  base_stats      JSONB DEFAULT '{}',             -- {"ap":150,"ac":0,"hp":0,"mp":0,"str":0,"dex":0,"int":0}
  bonus_stats     JSONB DEFAULT '[]',             -- [{stat,value,type}]
  -- Item level / grade
  item_grade      TEXT DEFAULT 'normal',          -- 'normal','unique','legendary'
  min_level       INT DEFAULT 1,
  upgrade_max     INT DEFAULT 9,                  -- max upgrade seviyesi
  -- Drop bilgisi (JSON)
  drop_info       JSONB DEFAULT '[]',             -- [{mob_slug,map_slug,drop_rate}]
  -- Craft/obtained info
  obtain_methods  JSONB DEFAULT '[]',             -- [{type:'drop'|'quest'|'craft'|'shop'|'boss',source}]
  -- Item tanımı ve SEO
  description     TEXT,
  content         TEXT,
  seo_title       TEXT,
  seo_description TEXT,
  seo_keywords    TEXT[],
  -- Görseller
  image_url       TEXT,
  icon_url        TEXT,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  view_count      INT NOT NULL DEFAULT 0,
  sort_order      INT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON items
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "public_read_published" ON items
  FOR SELECT USING (is_published = TRUE);

CREATE INDEX IF NOT EXISTS idx_items_item_type ON items(item_type);
CREATE INDEX IF NOT EXISTS idx_items_slug ON items(slug);

-- ────────────────────────────────────────────────────────────
-- 4. BOSS tablosu
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bosses (
  id              SERIAL PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  name_en         TEXT,
  boss_type       TEXT DEFAULT 'world',           -- 'world','dungeon','event','mini'
  -- Konum
  map_slug        TEXT,                           -- 'ronark-land','forgotten-temple' ...
  spawn_coords    TEXT,
  spawn_interval  TEXT,                           -- '24 saat','8 saat','rastgele'
  -- Boss istatistikleri
  level           INT,
  hp              BIGINT,
  element         TEXT,                           -- 'fire','ice','lightning','none'
  -- Drop listesi (JSON)
  drop_list       JSONB DEFAULT '[]',             -- [{item_slug,item_name,drop_rate,upgrade_range}]
  -- İlgili questler (JSON)
  related_quests  JSONB DEFAULT '[]',             -- [{quest_slug,quest_name}]
  -- Spawn item gereksinimi
  spawn_item      TEXT,
  -- Açıklama ve SEO
  description     TEXT,
  content         TEXT,
  seo_title       TEXT,
  seo_description TEXT,
  seo_keywords    TEXT[],
  image_url       TEXT,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  view_count      INT NOT NULL DEFAULT 0,
  sort_order      INT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE bosses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON bosses
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "public_read_published" ON bosses
  FOR SELECT USING (is_published = TRUE);

-- ────────────────────────────────────────────────────────────
-- 5. MOB tablosu
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mobs (
  id              SERIAL PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  name_en         TEXT,
  mob_type        TEXT DEFAULT 'normal',          -- 'normal','elite','mini-boss','event'
  map_slug        TEXT,
  level           INT,
  hp              INT,
  element         TEXT,
  exp_reward      INT,
  drop_list       JSONB DEFAULT '[]',
  description     TEXT,
  content         TEXT,
  seo_title       TEXT,
  seo_description TEXT,
  seo_keywords    TEXT[],
  image_url       TEXT,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  view_count      INT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE mobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON mobs
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "public_read_published" ON mobs
  FOR SELECT USING (is_published = TRUE);

-- ────────────────────────────────────────────────────────────
-- 6. MAP (Harita) tablosu
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS maps (
  id              SERIAL PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  name_en         TEXT,
  map_type        TEXT DEFAULT 'pve',             -- 'pve','pvp','dungeon','town','event'
  -- Level aralığı
  min_level       INT,
  max_level       INT,
  -- Harita özellikleri
  is_war_zone     BOOLEAN DEFAULT FALSE,
  is_pk_zone      BOOLEAN DEFAULT FALSE,
  has_dungeon     BOOLEAN DEFAULT FALSE,
  -- JSON detaylar
  key_features    JSONB DEFAULT '[]',             -- [{text}]
  farm_spots      JSONB DEFAULT '[]',             -- [{name,coords,level_range,mob_types}]
  bosses_here     JSONB DEFAULT '[]',             -- [{boss_slug,boss_name}]
  npcs_here       JSONB DEFAULT '[]',             -- [{name,function}]
  -- Açıklama ve SEO
  description     TEXT,
  content         TEXT,
  seo_title       TEXT,
  seo_description TEXT,
  seo_keywords    TEXT[],
  image_url       TEXT,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  view_count      INT NOT NULL DEFAULT 0,
  sort_order      INT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE maps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON maps
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "public_read_published" ON maps
  FOR SELECT USING (is_published = TRUE);

-- ────────────────────────────────────────────────────────────
-- 7. QUEST tablosu
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quests (
  id              SERIAL PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  name_en         TEXT,
  quest_type      TEXT DEFAULT 'main',            -- 'main','daily','repeatable','event','guild'
  race            TEXT DEFAULT 'all',             -- 'human','karus','all'
  -- Gereksinimler
  min_level       INT DEFAULT 1,
  max_level       INT,
  prerequisite_quest TEXT,
  -- Ödüller (JSON)
  rewards         JSONB DEFAULT '[]',             -- [{type:'exp'|'item'|'noah',value,item_slug}]
  -- Görev adımları (JSON)
  steps           JSONB DEFAULT '[]',             -- [{order,description,npc_name,map_slug,kill_target,kill_count}]
  -- NPC bilgisi
  start_npc       TEXT,
  start_npc_map   TEXT,
  end_npc         TEXT,
  -- Açıklama ve SEO
  description     TEXT,
  content         TEXT,
  seo_title       TEXT,
  seo_description TEXT,
  seo_keywords    TEXT[],
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  view_count      INT NOT NULL DEFAULT 0,
  sort_order      INT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON quests
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "public_read_published" ON quests
  FOR SELECT USING (is_published = TRUE);

-- ────────────────────────────────────────────────────────────
-- 8. SKILL tablosu
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id              SERIAL PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  name_en         TEXT,
  character_class TEXT NOT NULL,
  skill_type      TEXT DEFAULT 'active',          -- 'active','passive','buff','debuff','summon'
  element         TEXT DEFAULT 'none',
  -- Beceri seviyeleri (JSON)
  levels          JSONB DEFAULT '[]',             -- [{level,damage,mp_cost,cooldown,required_level}]
  max_level       INT DEFAULT 1,
  -- Açıklama
  description     TEXT,
  content         TEXT,
  seo_title       TEXT,
  seo_description TEXT,
  seo_keywords    TEXT[],
  icon_url        TEXT,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order      INT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON skills
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "public_read_published" ON skills
  FOR SELECT USING (is_published = TRUE);

-- ────────────────────────────────────────────────────────────
-- 9. HABER (News) tablosu
--    Knight Online güncellemeleri, patch notları, etkinlikler
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news (
  id              SERIAL PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  news_type       TEXT DEFAULT 'update',          -- 'update','patch','event','maintenance','announcement'
  excerpt         TEXT,
  content         TEXT,
  image_url       TEXT,
  source_url      TEXT,
  game_version    TEXT,
  seo_title       TEXT,
  seo_description TEXT,
  seo_keywords    TEXT[],
  author          TEXT DEFAULT 'musaagll',
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  view_count      INT NOT NULL DEFAULT 0,
  published_at    TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON news
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "public_read_published" ON news
  FOR SELECT USING (is_published = TRUE);

-- ────────────────────────────────────────────────────────────
-- 10. HATA (Error/Issue) tablosu
--     Oyun hataları, launcher sorunları, bağlantı sorunları
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS errors (
  id              SERIAL PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  error_type      TEXT DEFAULT 'launcher',        -- 'launcher','connection','account','graphics','patch','game'
  excerpt         TEXT,
  content         TEXT,                           -- Çözüm adımları (Markdown)
  symptoms        JSONB DEFAULT '[]',             -- Belirti listesi
  solutions       JSONB DEFAULT '[]',             -- [{order,title,description,is_main}]
  related_errors  JSONB DEFAULT '[]',             -- [{slug,title}]
  seo_title       TEXT,
  seo_description TEXT,
  seo_keywords    TEXT[],
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  view_count      INT NOT NULL DEFAULT 0,
  sort_order      INT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE errors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON errors
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "public_read_published" ON errors
  FOR SELECT USING (is_published = TRUE);

-- ────────────────────────────────────────────────────────────
-- 11. FARM tablosu
--     Farm rotaları ve exp noktaları
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS farm_spots (
  id              SERIAL PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  farm_type       TEXT DEFAULT 'exp',             -- 'exp','item','noah','boss','dungeon'
  map_slug        TEXT,
  -- Level aralığı
  min_level       INT,
  max_level       INT,
  -- İdeal karakterler
  best_classes    TEXT[],                         -- ['warrior','rogue']
  -- JSON detaylar
  mobs_here       JSONB DEFAULT '[]',             -- [{mob_slug,mob_name,exp,drop_rate}]
  key_drops       JSONB DEFAULT '[]',             -- [{item_slug,item_name,drop_rate}]
  tips            JSONB DEFAULT '[]',             -- [{text}]
  -- Açıklama ve SEO
  excerpt         TEXT,
  content         TEXT,
  seo_title       TEXT,
  seo_description TEXT,
  seo_keywords    TEXT[],
  image_url       TEXT,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  view_count      INT NOT NULL DEFAULT 0,
  sort_order      INT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE farm_spots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON farm_spots
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "public_read_published" ON farm_spots
  FOR SELECT USING (is_published = TRUE);

-- ────────────────────────────────────────────────────────────
-- 12. SEO_REDIRECTS tablosu
--     URL değişikliklerinde 301/302 yönlendirme yönetimi
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seo_redirects (
  id              SERIAL PRIMARY KEY,
  source_path     TEXT NOT NULL UNIQUE,           -- '/kategoriler/asas'
  target_path     TEXT NOT NULL,                  -- '/rehber/asas'
  redirect_type   INT NOT NULL DEFAULT 301,       -- 301 veya 302
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE seo_redirects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON seo_redirects
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "public_read_active" ON seo_redirects
  FOR SELECT USING (is_active = TRUE);

-- ────────────────────────────────────────────────────────────
-- 13. CONTENT_TAGS tablosu
--     Entity'ler arası ilişki ve tag sistemi
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS content_tags (
  id              SERIAL PRIMARY KEY,
  tag_type        TEXT NOT NULL,                  -- 'entity_type', 'topic', 'class', 'mechanic'
  slug            TEXT NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  UNIQUE(tag_type, slug)
);

-- ────────────────────────────────────────────────────────────
-- 14. ENTITY_RELATIONS tablosu
--     İçerikler arası ilişki (internal linking için)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS entity_relations (
  id              SERIAL PRIMARY KEY,
  source_type     TEXT NOT NULL,                  -- 'guide','item','boss','map','quest','build','farm'
  source_slug     TEXT NOT NULL,
  target_type     TEXT NOT NULL,
  target_slug     TEXT NOT NULL,
  relation_type   TEXT NOT NULL DEFAULT 'related',-- 'related','drops','spawns_in','used_in','rewards','requires'
  weight          FLOAT DEFAULT 1.0,              -- Alaka düzeyi skoru
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(source_type, source_slug, target_type, target_slug)
);

ALTER TABLE entity_relations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON entity_relations
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "public_read" ON entity_relations
  FOR SELECT USING (TRUE);

-- ────────────────────────────────────────────────────────────
-- 15. Başlangıç redirect verileri
--     /kategoriler/* → /rehber/* yönlendirmeleri
-- ────────────────────────────────────────────────────────────
INSERT INTO seo_redirects (source_path, target_path, redirect_type, notes)
VALUES
  ('/kategoriler/asas',  '/rehber/asas',    301, 'Footer/data.ts kategoriler → yeni rehber sistemi'),
  ('/kategoriler/okcu',  '/rehber/okcu',    301, 'Footer/data.ts kategoriler → yeni rehber sistemi'),
  ('/kategoriler',       '/rehber',         301, 'Genel kategoriler sayfası → rehber index')
ON CONFLICT (source_path) DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- 16. page_views tablosu (daha önce manuel oluşturulduysa skip)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_views (
  id          BIGSERIAL PRIMARY KEY,
  page        TEXT NOT NULL,
  referrer    TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_all" ON page_views
  FOR ALL USING (auth.role() = 'service_role');
-- Herkes insert yapabilsin (anonim sayfa görüntülenme kaydı)
CREATE POLICY "public_insert" ON page_views
  FOR INSERT WITH CHECK (TRUE);

CREATE INDEX IF NOT EXISTS idx_page_views_page ON page_views(page);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);

-- ────────────────────────────────────────────────────────────
-- 17. admin_settings'e yeni alanlar ekle (varsa skip)
-- ────────────────────────────────────────────────────────────
ALTER TABLE admin_settings
  ADD COLUMN IF NOT EXISTS seo_index_enabled    BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS sitemap_enabled       BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS analytics_id         TEXT,
  ADD COLUMN IF NOT EXISTS adsense_publisher_id TEXT,
  ADD COLUMN IF NOT EXISTS default_og_image     TEXT,
  ADD COLUMN IF NOT EXISTS robots_txt_custom    TEXT;

-- ============================================================
-- Migration v2 tamamlandı!
-- Yeni tablolar: guides, builds, items, bosses, mobs, maps,
--                quests, skills, news, errors, farm_spots,
--                seo_redirects, content_tags, entity_relations
-- Güncellenen tablolar: admin_settings (6 yeni kolon)
-- ============================================================
