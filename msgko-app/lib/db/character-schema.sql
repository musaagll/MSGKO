-- ============================================================
-- MSGKO Character Viewer — Supabase Schema
-- Supabase Dashboard > SQL Editor'da çalıştırın
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- SERVERS
-- ============================================================
CREATE TABLE IF NOT EXISTS ko_servers (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_code  VARCHAR(50)  UNIQUE NOT NULL,  -- 'zero', 'destan', etc.
  server_name  VARCHAR(100) NOT NULL,
  server_type  VARCHAR(20)  NOT NULL DEFAULT 'private', -- 'private' | 'official'
  is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
  sort_order   INT          NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE ko_servers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_servers"       ON ko_servers FOR SELECT USING (TRUE);
CREATE POLICY "service_write_servers"     ON ko_servers FOR ALL    USING (auth.role() = 'service_role');

INSERT INTO ko_servers (server_code, server_name, server_type, sort_order) VALUES
  ('zero',   'Zero',   'private', 1),
  ('destan', 'Destan', 'private', 2),
  ('ares',   'Ares',   'private', 3),
  ('diez',   'Diez',   'private', 4)
ON CONFLICT (server_code) DO NOTHING;

-- ============================================================
-- ITEMS
-- NOTE: item_id values here are internal MSGKO IDs.
--       Real Knight Online item IDs are not known at this stage.
--       Items marked is_mock = TRUE are placeholder data.
-- ============================================================
CREATE TABLE IF NOT EXISTS ko_items (
  item_id            BIGINT       PRIMARY KEY,
  item_name          VARCHAR(255) NOT NULL,
  item_name_en       VARCHAR(255),

  -- Type
  item_type          VARCHAR(50)  NOT NULL, -- 'weapon','armor','accessory','cospre','pet','consumable'
  equipment_slot     INT,                   -- 1-14 (see EQUIPMENT_SLOTS in character.ts)

  -- Restrictions
  class_restriction  VARCHAR(50),           -- 'warrior','rogue','mage','priest','all'
  nation_restriction VARCHAR(50) DEFAULT 'all',

  -- Visual assets — change these URLs to swap 3D models without touching code
  icon_url           TEXT,
  model_url          TEXT,
  texture_url        TEXT,

  -- 3D model positioning
  model_format       VARCHAR(10)  DEFAULT 'glb',
  model_scale        FLOAT        DEFAULT 1.0,
  model_position     JSONB        DEFAULT '{"x":0,"y":0,"z":0}',
  model_rotation     JSONB        DEFAULT '{"x":0,"y":0,"z":0}',

  -- Classification flags
  is_cospre          BOOLEAN      DEFAULT FALSE,
  is_weapon          BOOLEAN      DEFAULT FALSE,
  is_armor           BOOLEAN      DEFAULT FALSE,
  is_accessory       BOOLEAN      DEFAULT FALSE,

  -- Upgrade
  max_upgrade        INT          DEFAULT 11,
  item_grade         VARCHAR(20),            -- 'low','middle','high','unique','reverse'

  description        TEXT,

  -- ⚠️ Mock flag — set TRUE for placeholder data
  is_mock            BOOLEAN      DEFAULT FALSE,

  created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ko_items_type  ON ko_items(item_type);
CREATE INDEX IF NOT EXISTS idx_ko_items_slot  ON ko_items(equipment_slot);
CREATE INDEX IF NOT EXISTS idx_ko_items_name  ON ko_items(item_name);

ALTER TABLE ko_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_items"    ON ko_items FOR SELECT USING (TRUE);
CREATE POLICY "service_write_items"  ON ko_items FOR ALL    USING (auth.role() = 'service_role');

-- ============================================================
-- ITEM UPGRADE VISUALS
-- Allows different glow/model per upgrade level
-- ============================================================
CREATE TABLE IF NOT EXISTS ko_item_upgrades (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id        BIGINT NOT NULL REFERENCES ko_items(item_id) ON DELETE CASCADE,
  upgrade_level  INT    NOT NULL,
  icon_url       TEXT,
  model_url      TEXT,
  glow_color     VARCHAR(7),         -- hex e.g. '#FF00FF'
  particle_effect VARCHAR(50),       -- 'fire','lightning','ice','none'
  UNIQUE(item_id, upgrade_level)
);

ALTER TABLE ko_item_upgrades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_upgrades"   ON ko_item_upgrades FOR SELECT USING (TRUE);
CREATE POLICY "service_write_upgrades" ON ko_item_upgrades FOR ALL    USING (auth.role() = 'service_role');

-- ============================================================
-- CHARACTERS
-- ============================================================
CREATE TABLE IF NOT EXISTS ko_characters (
  id             UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_name VARCHAR(255) NOT NULL,
  server_id      UUID         NOT NULL REFERENCES ko_servers(id),

  -- Identity
  nation         VARCHAR(20)  NOT NULL, -- 'karus' | 'el_morad'
  race           VARCHAR(50)  NOT NULL, -- 'barbarian','human_male','human_female','orc_1',...
  class          VARCHAR(50)  NOT NULL, -- 'warrior','rogue','mage','priest'
  gender         VARCHAR(10)  NOT NULL, -- 'male' | 'female'
  level          INT          NOT NULL DEFAULT 1,

  -- Provenance — where did this data come from?
  data_source    VARCHAR(50)  NOT NULL DEFAULT 'mock', -- 'mock','db_import','user_submit','api'
  is_verified    BOOLEAN      NOT NULL DEFAULT FALSE,

  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  UNIQUE(character_name, server_id)
);

CREATE INDEX IF NOT EXISTS idx_ko_characters_name   ON ko_characters(character_name);
CREATE INDEX IF NOT EXISTS idx_ko_characters_server ON ko_characters(server_id);

ALTER TABLE ko_characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_characters"    ON ko_characters FOR SELECT USING (TRUE);
CREATE POLICY "service_write_characters"  ON ko_characters FOR ALL    USING (auth.role() = 'service_role');

-- ============================================================
-- CHARACTER EQUIPMENT
-- One row per equipped slot per character
-- ============================================================
CREATE TABLE IF NOT EXISTS ko_character_equipment (
  id            UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id  UUID    NOT NULL REFERENCES ko_characters(id) ON DELETE CASCADE,
  slot_id       INT     NOT NULL,  -- matches EQUIPMENT_SLOTS values in character.ts
  item_id       BIGINT  NOT NULL,
  upgrade_level INT     NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(character_id, slot_id)
);

CREATE INDEX IF NOT EXISTS idx_ko_equipment_char ON ko_character_equipment(character_id);
CREATE INDEX IF NOT EXISTS idx_ko_equipment_item ON ko_character_equipment(item_id);

ALTER TABLE ko_character_equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_equipment"    ON ko_character_equipment FOR SELECT USING (TRUE);
CREATE POLICY "service_write_equipment"  ON ko_character_equipment FOR ALL    USING (auth.role() = 'service_role');

-- ============================================================
-- CHARACTER COSPRE (separate from equipment)
-- ============================================================
CREATE TABLE IF NOT EXISTS ko_character_cospre (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  character_id  UUID        NOT NULL REFERENCES ko_characters(id) ON DELETE CASCADE,
  cospre_type   VARCHAR(50) NOT NULL, -- 'valkyrie','pathos','wings','fairy','tattoo','emblem','talisman'
  item_id       BIGINT,
  enabled       BOOLEAN     NOT NULL DEFAULT TRUE,
  upgrade_level INT         NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(character_id, cospre_type)
);

CREATE INDEX IF NOT EXISTS idx_ko_cospre_char ON ko_character_cospre(character_id);

ALTER TABLE ko_character_cospre ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_cospre"    ON ko_character_cospre FOR SELECT USING (TRUE);
CREATE POLICY "service_write_cospre"  ON ko_character_cospre FOR ALL    USING (auth.role() = 'service_role');

-- ============================================================
-- COSPRE SLOT OVERRIDES (configurable — which slots does each cospre override?)
-- This avoids hardcoding cospre behavior in frontend code.
-- ============================================================
CREATE TABLE IF NOT EXISTS ko_cospre_overrides (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  cospre_type  VARCHAR(50) NOT NULL,
  overrides_slot INT       NOT NULL,  -- slot_id that this cospre visually replaces
  UNIQUE(cospre_type, overrides_slot)
);

ALTER TABLE ko_cospre_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_cospre_overrides"   ON ko_cospre_overrides FOR SELECT USING (TRUE);
CREATE POLICY "service_write_cospre_overrides" ON ko_cospre_overrides FOR ALL    USING (auth.role() = 'service_role');

-- NOTE: These override values are PLACEHOLDER/UNKNOWN until confirmed with real KO data.
-- Valkyrie typically overrides helmet+armor+gloves+boots but this is NOT confirmed for all versions.
INSERT INTO ko_cospre_overrides (cospre_type, overrides_slot) VALUES
  ('valkyrie', 1), ('valkyrie', 2), ('valkyrie', 4), ('valkyrie', 5),
  ('pathos',   4),   -- Pathos overrides gloves only (unconfirmed)
  ('wings',    13)   -- Wings overrides wings slot
ON CONFLICT DO NOTHING;

-- ============================================================
-- SETUP COMPLETE
-- ============================================================
