// ============================================================
// MSGKO Character Viewer — Core Character Types
// ============================================================

// ─── Enums ───────────────────────────────────────────────────────────────────

export type Nation = 'karus' | 'el_morad'
export type Race = 'barbarian' | 'human_male' | 'human_female' | 'orc_1' | 'orc_2' | 'orc_3' | 'orc_4'
export type CharacterClass = 'warrior' | 'rogue' | 'mage' | 'priest'
export type Gender = 'male' | 'female'
export type DataSource = 'mock' | 'db_import' | 'user_submit' | 'api'

// ─── Server ──────────────────────────────────────────────────────────────────

export interface Server {
  id: string
  server_code: string   // 'zero' | 'destan' | 'ares' etc.
  server_name: string   // 'Zero' | 'Destan' | 'Ares'
  server_type: 'private' | 'official'
  is_active: boolean
  sort_order: number
}

// ─── Character ───────────────────────────────────────────────────────────────

export interface Character {
  id: string
  character_name: string
  server: Server

  // Nation & Identity
  nation: Nation
  race: Race
  class: CharacterClass
  gender: Gender

  // Display info
  level: number

  // Data provenance
  data_source: DataSource
  is_verified: boolean

  // Relations (may be populated)
  equipment?: EquipmentSet
  cospre?: CospreSet

  // Timestamps
  created_at: string
  updated_at: string
}

// ─── Equipment ───────────────────────────────────────────────────────────────

/**
 * Equipment slot index mapping.
 * These are MSGKO's internal slot IDs.
 * The actual Knight Online slot IDs are unknown — this is our abstraction layer.
 */
export const EQUIPMENT_SLOTS = {
  HELMET: 1,
  ARMOR: 2,
  PADS: 3,
  GLOVES: 4,
  BOOTS: 5,
  RIGHT_HAND: 6,
  LEFT_HAND: 7,
  RING_1: 8,
  RING_2: 9,
  NECKLACE: 10,
  EARRING_1: 11,
  EARRING_2: 12,
  WINGS: 13,
  PET: 14,
} as const

export type EquipmentSlotKey = keyof typeof EQUIPMENT_SLOTS
export type EquipmentSlotId = typeof EQUIPMENT_SLOTS[EquipmentSlotKey]

export interface EquipmentSlotInfo {
  slot_id: EquipmentSlotId
  slot_key: EquipmentSlotKey
  slot_label: string        // Display label e.g. "Helmet", "Right Hand"
  slot_label_tr: string     // Turkish label e.g. "Kask", "Sağ El"
}

export const SLOT_INFO: Record<EquipmentSlotKey, EquipmentSlotInfo> = {
  HELMET:      { slot_id: 1,  slot_key: 'HELMET',      slot_label: 'Helmet',      slot_label_tr: 'Kask' },
  ARMOR:       { slot_id: 2,  slot_key: 'ARMOR',       slot_label: 'Armor',       slot_label_tr: 'Zırh' },
  PADS:        { slot_id: 3,  slot_key: 'PADS',        slot_label: 'Pads',        slot_label_tr: 'Tayt' },
  GLOVES:      { slot_id: 4,  slot_key: 'GLOVES',      slot_label: 'Gloves',      slot_label_tr: 'Eldiven' },
  BOOTS:       { slot_id: 5,  slot_key: 'BOOTS',       slot_label: 'Boots',       slot_label_tr: 'Bot' },
  RIGHT_HAND:  { slot_id: 6,  slot_key: 'RIGHT_HAND',  slot_label: 'Right Hand',  slot_label_tr: 'Sağ El' },
  LEFT_HAND:   { slot_id: 7,  slot_key: 'LEFT_HAND',   slot_label: 'Left Hand',   slot_label_tr: 'Sol El' },
  RING_1:      { slot_id: 8,  slot_key: 'RING_1',      slot_label: 'Ring 1',      slot_label_tr: 'Yüzük 1' },
  RING_2:      { slot_id: 9,  slot_key: 'RING_2',      slot_label: 'Ring 2',      slot_label_tr: 'Yüzük 2' },
  NECKLACE:    { slot_id: 10, slot_key: 'NECKLACE',    slot_label: 'Necklace',    slot_label_tr: 'Kolye' },
  EARRING_1:   { slot_id: 11, slot_key: 'EARRING_1',   slot_label: 'Earring 1',   slot_label_tr: 'Küpe 1' },
  EARRING_2:   { slot_id: 12, slot_key: 'EARRING_2',   slot_label: 'Earring 2',   slot_label_tr: 'Küpe 2' },
  WINGS:       { slot_id: 13, slot_key: 'WINGS',       slot_label: 'Wings',       slot_label_tr: 'Kanat' },
  PET:         { slot_id: 14, slot_key: 'PET',         slot_label: 'Pet',         slot_label_tr: 'Evcil' },
}

// One equip entry: which item in which slot at what upgrade
export interface EquipmentEntry {
  slot_id: EquipmentSlotId
  item_id: number
  upgrade_level: number
  // Populated after item lookup:
  item?: Item
}

// The full equipment set for a character — slot_key → entry
export type EquipmentSet = Partial<Record<EquipmentSlotKey, EquipmentEntry>>

// ─── Cospre ──────────────────────────────────────────────────────────────────

export type CospreType =
  | 'valkyrie'
  | 'pathos'
  | 'wings'
  | 'fairy'
  | 'tattoo'
  | 'emblem'
  | 'talisman'

export interface CospreEntry {
  cospre_type: CospreType
  item_id: number | null
  enabled: boolean
  upgrade_level: number
  // Populated after item lookup:
  item?: Item
}

export type CospreSet = Partial<Record<CospreType, CospreEntry>>

// ─── Item ─────────────────────────────────────────────────────────────────────

export type ItemType = 'weapon' | 'armor' | 'accessory' | 'cospre' | 'pet' | 'consumable'
export type ItemGrade = 'low' | 'middle' | 'high' | 'unique' | 'reverse'
export type ModelFormat = 'glb' | 'gltf'

export interface Item {
  item_id: number
  item_name: string
  item_name_en?: string
  item_type: ItemType

  // Slot this item occupies
  equipment_slot?: EquipmentSlotId

  // Restrictions
  class_restriction?: CharacterClass | 'all'
  nation_restriction?: Nation | 'all'

  // Visual assets — these are URLs, changeable via DB
  icon_url?: string
  model_url?: string
  texture_url?: string

  // 3D model positioning overrides
  model_format?: ModelFormat
  model_scale?: number
  model_position?: { x: number; y: number; z: number }
  model_rotation?: { x: number; y: number; z: number }

  // Classification
  is_cospre?: boolean
  is_weapon?: boolean
  is_armor?: boolean
  is_accessory?: boolean

  // Upgrade
  max_upgrade?: number
  upgrade_visuals?: UpgradeVisual[]

  // Grade
  item_grade?: ItemGrade

  description?: string

  // ⚠️  NOTE: item_id values in mock data are clearly marked as MOCK.
  //     Real Knight Online item IDs are unknown at this stage.
  is_mock?: boolean
}

export interface UpgradeVisual {
  upgrade_level: number
  icon_url?: string
  model_url?: string
  glow_color?: string
  particle_effect?: string
}

// ─── Search ──────────────────────────────────────────────────────────────────

export interface CharacterSearchParams {
  server: string
  playerName: string
}

export interface CharacterSearchResult {
  found: boolean
  character?: Character
  error?: string
  is_mock?: boolean   // Clearly flag mock results
}

// ─── 3D Assembly ─────────────────────────────────────────────────────────────

/** Resolved model URLs for a character — fed directly into Three.js */
export interface CharacterModelSet {
  base_body: string        // e.g. /models/bodies/rogue_karus_male.glb
  helmet?: string
  armor?: string
  pads?: string
  gloves?: string
  boots?: string
  right_hand?: string
  left_hand?: string
  wings?: string
  pet?: string
  cospre_overlay?: string  // Active cospre model (if any)
}
