// ============================================================
// MSGKO Item Provider — Real KO items with local icons
// Icons extracted from KO client ui.src → public/assets/icons/
// ============================================================

import type { Item } from '../types/character'
import type { ItemProvider } from './ItemProvider'
import itemsWithIcons from '../db/ko-items-with-icons.json'

// ─── Build lookup map from extracted items ─────────────────────────────────────

interface RawItem {
  item_id: number
  item_name: string
  item_name_en: string
  item_type: string
  kind: number
  equipment_slot_key: string
  class_restriction: string
  nation_restriction: string
  req_level: number
  icon_url: string | null
  model_url: string | null
}

const SLOT_KEY_MAP: Record<string, number> = {
  RIGHT_HAND: 6,
  LEFT_HAND: 7,
  HELM: 1,
  PAULDRON: 2,
  CHEST: 3,
  GAUNTLETS: 4,
  BOOTS: 5,
  RING1: 8,
  RING2: 9,
  EARRING: 10,
  NECKLACE: 11,
  BELT: 12,
  SHIELD: 7,
}

function rawToItem(raw: RawItem): Item {
  return {
    item_id: raw.item_id,
    item_name: raw.item_name,
    item_name_en: raw.item_name_en,
    item_type: raw.item_type as Item['item_type'],
    equipment_slot: SLOT_KEY_MAP[raw.equipment_slot_key] ?? 0,
    class_restriction: raw.class_restriction as Item['class_restriction'],
    nation_restriction: raw.nation_restriction as Item['nation_restriction'],
    icon_url: raw.icon_url ?? undefined,
    model_url: raw.model_url ?? undefined,
    is_weapon: raw.item_type === 'weapon',
    is_armor: raw.item_type === 'armor',
    is_mock: false,
  }
}

const ALL_ITEMS = new Map<number, Item>(
  (itemsWithIcons as RawItem[]).map(r => [r.item_id, rawToItem(r)])
)

export class MockItemProvider implements ItemProvider {
  async getItem(itemId: number): Promise<Item | null> {
    return ALL_ITEMS.get(itemId) ?? null
  }

  async getItemsByIds(itemIds: number[]): Promise<Item[]> {
    return itemIds
      .map(id => ALL_ITEMS.get(id))
      .filter((i): i is Item => Boolean(i))
  }

  async searchItems(query: string): Promise<Item[]> {
    const q = query.toLowerCase()
    return Array.from(ALL_ITEMS.values()).filter(
      i => i.item_name.toLowerCase().includes(q) ||
           (i.item_name_en ?? '').toLowerCase().includes(q)
    ).slice(0, 20)
  }
}

// ─── REAL Knight Online items ─────────────────────────────────────────────────

const REAL_ITEMS: Item[] = [

  // ── ROGUE WEAPONS ──────────────────────────────────────────────────────────

  {
    item_id: 389060000,
    item_name: 'Shard',
    item_name_en: 'Shard',
    item_type: 'weapon',
    equipment_slot: 6,
    class_restriction: 'rogue',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Weapon/shard.png`,
    model_url: undefined,
    is_weapon: true,
    max_upgrade: 11,
    item_grade: 'unique',
    is_mock: false,
  },
  {
    item_id: 389060001,
    item_name: 'Shard(+1)',
    item_name_en: 'Shard(+1)',
    item_type: 'weapon',
    equipment_slot: 6,
    class_restriction: 'rogue',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Weapon/shard.png`,
    model_url: undefined,
    is_weapon: true,
    max_upgrade: 11,
    item_grade: 'unique',
    is_mock: false,
  },
  // ... +2 to +11 follow same pattern

  {
    item_id: 389050000,
    item_name: 'Mirage Dagger',
    item_name_en: 'Mirage Dagger',
    item_type: 'weapon',
    equipment_slot: 7,
    class_restriction: 'rogue',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Weapon/mirage%20dagger.png`,
    model_url: undefined,
    is_weapon: true,
    max_upgrade: 11,
    item_grade: 'unique',
    is_mock: false,
  },

  {
    item_id: 389040000,
    item_name: 'Raptor',
    item_name_en: 'Raptor',
    item_type: 'weapon',
    equipment_slot: 6,
    class_restriction: 'warrior',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Weapon/raptor.png`,
    model_url: undefined,
    is_weapon: true,
    max_upgrade: 11,
    item_grade: 'unique',
    is_mock: false,
  },

  {
    item_id: 389030000,
    item_name: 'Iron Bow',
    item_name_en: 'Iron Bow',
    item_type: 'weapon',
    equipment_slot: 6,
    class_restriction: 'rogue',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Weapon/iron%20bow.png`,
    model_url: undefined,
    is_weapon: true,
    max_upgrade: 11,
    item_grade: 'high',
    is_mock: false,
  },

  {
    item_id: 389020000,
    item_name: 'Mirage',
    item_name_en: 'Mirage',
    item_type: 'weapon',
    equipment_slot: 6,
    class_restriction: 'warrior',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Weapon/mirage.png`,
    model_url: undefined,
    is_weapon: true,
    max_upgrade: 11,
    item_grade: 'unique',
    is_mock: false,
  },

  {
    item_id: 389010000,
    item_name: 'Graham',
    item_name_en: 'Graham',
    item_type: 'weapon',
    equipment_slot: 6,
    class_restriction: 'warrior',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Weapon/graham.png`,
    model_url: undefined,
    is_weapon: true,
    max_upgrade: 11,
    item_grade: 'unique',
    is_mock: false,
  },

  {
    item_id: 388010000,
    item_name: 'Elixir Staff',
    item_name_en: 'Elixir Staff',
    item_type: 'weapon',
    equipment_slot: 6,
    class_restriction: 'mage',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Weapon/elixir%20staff.png`,
    model_url: undefined,
    is_weapon: true,
    max_upgrade: 11,
    item_grade: 'unique',
    is_mock: false,
  },

  {
    item_id: 388020000,
    item_name: "Ron's Staff",
    item_name_en: "Ron's Staff",
    item_type: 'weapon',
    equipment_slot: 6,
    class_restriction: 'mage',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Weapon/Ron's%20Staff.png`,
    model_url: undefined,
    is_weapon: true,
    max_upgrade: 11,
    item_grade: 'unique',
    is_mock: false,
  },

  {
    item_id: 388030000,
    item_name: 'Impact',
    item_name_en: 'Impact',
    item_type: 'weapon',
    equipment_slot: 6,
    class_restriction: 'priest',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Weapon/impact.png`,
    model_url: undefined,
    is_weapon: true,
    max_upgrade: 11,
    item_grade: 'unique',
    is_mock: false,
  },

  {
    item_id: 388040000,
    item_name: 'Iron Impact',
    item_name_en: 'Iron Impact',
    item_type: 'weapon',
    equipment_slot: 6,
    class_restriction: 'priest',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Weapon/iron%20impact.png`,
    model_url: undefined,
    is_weapon: true,
    max_upgrade: 11,
    item_grade: 'unique',
    is_mock: false,
  },

  // ── WARRIOR ARMOR (Chitin Shell) ────────────────────────────────────────────

  {
    item_id: 310001000,
    item_name: 'Chitin Armor Helmet',
    item_name_en: 'Chitin Armor Helmet',
    item_type: 'armor',
    equipment_slot: 1,
    class_restriction: 'warrior',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Warrior/chitin%20armor%20helmet.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'high',
    is_mock: false,
  },
  {
    item_id: 310002000,
    item_name: 'Chitin Armor Pauldron',
    item_name_en: 'Chitin Armor Pauldron',
    item_type: 'armor',
    equipment_slot: 2,
    class_restriction: 'warrior',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Warrior/chitin%20armor%20pauldron.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'high',
    is_mock: false,
  },
  {
    item_id: 310003000,
    item_name: 'Chitin Armor Pads',
    item_name_en: 'Chitin Armor Pads',
    item_type: 'armor',
    equipment_slot: 3,
    class_restriction: 'warrior',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Warrior/chitin%20armor%20pads.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'high',
    is_mock: false,
  },
  {
    item_id: 310004000,
    item_name: 'Chitin Armor Gauntlets',
    item_name_en: 'Chitin Armor Gauntlets',
    item_type: 'armor',
    equipment_slot: 4,
    class_restriction: 'warrior',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Warrior/chitin%20armor%20gauntlet.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'high',
    is_mock: false,
  },
  {
    item_id: 310005000,
    item_name: 'Chitin Armor Boots',
    item_name_en: 'Chitin Armor Boots',
    item_type: 'armor',
    equipment_slot: 5,
    class_restriction: 'warrior',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Warrior/chitin%20armor%20boots.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'high',
    is_mock: false,
  },

  // ── ROGUE ARMOR (Rogue Chitin Shell) ────────────────────────────────────────

  {
    item_id: 380001000,
    item_name: 'Rogue Chitin Armor Helmet',
    item_name_en: 'Rogue Chitin Armor Helmet',
    item_type: 'armor',
    equipment_slot: 1,
    class_restriction: 'rogue',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Rogue/rogue%20chitin%20armor%20helmet.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'high',
    is_mock: false,
  },
  {
    item_id: 380002000,
    item_name: 'Rogue Chitin Armor Pauldron',
    item_name_en: 'Rogue Chitin Armor Pauldron',
    item_type: 'armor',
    equipment_slot: 2,
    class_restriction: 'rogue',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Rogue/rogue%20chitin%20armor%20pauldron.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'high',
    is_mock: false,
  },
  {
    item_id: 380003000,
    item_name: 'Rogue Chitin Armor Pads',
    item_name_en: 'Rogue Chitin Armor Pads',
    item_type: 'armor',
    equipment_slot: 3,
    class_restriction: 'rogue',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Rogue/rogue%20chitin%20armor%20pads.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'high',
    is_mock: false,
  },
  {
    item_id: 380004000,
    item_name: 'Rogue Chitin Armor Gauntlets',
    item_name_en: 'Rogue Chitin Armor Gauntlets',
    item_type: 'armor',
    equipment_slot: 4,
    class_restriction: 'rogue',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Rogue/rogue%20chitin%20armor%20gauntlet.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'high',
    is_mock: false,
  },
  {
    item_id: 380005000,
    item_name: 'Rogue Chitin Armor Boots',
    item_name_en: 'Rogue Chitin Armor Boots',
    item_type: 'armor',
    equipment_slot: 5,
    class_restriction: 'rogue',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Rogue/rogue%20chitin%20armor%20boots.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'high',
    is_mock: false,
  },

  // ── ROGUE ARMOR (Mythril) ───────────────────────────────────────────────────

  {
    item_id: 381001000,
    item_name: 'Mythril Helmet',
    item_name_en: 'Mythril Helmet',
    item_type: 'armor',
    equipment_slot: 1,
    class_restriction: 'rogue',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Rogue/Mythril%20Helmet.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'unique',
    is_mock: false,
  },
  {
    item_id: 381002000,
    item_name: 'Mythril Pauldron',
    item_name_en: 'Mythril Pauldron',
    item_type: 'armor',
    equipment_slot: 2,
    class_restriction: 'rogue',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Rogue/Mythril%20Pauldron.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'unique',
    is_mock: false,
  },
  {
    item_id: 381003000,
    item_name: 'Mythril Pad',
    item_name_en: 'Mythril Pad',
    item_type: 'armor',
    equipment_slot: 3,
    class_restriction: 'rogue',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Rogue/Mythril%20Pad.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'unique',
    is_mock: false,
  },
  {
    item_id: 381004000,
    item_name: 'Mythril Gauntlet',
    item_name_en: 'Mythril Gauntlet',
    item_type: 'armor',
    equipment_slot: 4,
    class_restriction: 'rogue',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Rogue/Mythril%20Gauntlet.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'unique',
    is_mock: false,
  },
  {
    item_id: 381005000,
    item_name: 'Mythril Boots',
    item_name_en: 'Mythril Boots',
    item_type: 'armor',
    equipment_slot: 5,
    class_restriction: 'rogue',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Rogue/Mythril%20Boots.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'unique',
    is_mock: false,
  },

  // ── MAGE ARMOR (Crimson) ────────────────────────────────────────────────────

  {
    item_id: 350001000,
    item_name: 'Crimson Helmet',
    item_name_en: 'Crimson Helmet',
    item_type: 'armor',
    equipment_slot: 1,
    class_restriction: 'mage',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Mage/crimson%20helmet.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'high',
    is_mock: false,
  },
  {
    item_id: 350002000,
    item_name: 'Crimson Robe',
    item_name_en: 'Crimson Robe',
    item_type: 'armor',
    equipment_slot: 2,
    class_restriction: 'mage',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Mage/crimson%20robe.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'high',
    is_mock: false,
  },
  {
    item_id: 350003000,
    item_name: 'Crimson Pants',
    item_name_en: 'Crimson Pants',
    item_type: 'armor',
    equipment_slot: 3,
    class_restriction: 'mage',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Mage/crimson%20pants.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'high',
    is_mock: false,
  },
  {
    item_id: 350004000,
    item_name: 'Crimson Gloves',
    item_name_en: 'Crimson Gloves',
    item_type: 'armor',
    equipment_slot: 4,
    class_restriction: 'mage',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Mage/crimson%20gloves.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'high',
    is_mock: false,
  },
  {
    item_id: 350005000,
    item_name: 'Crimson Boots',
    item_name_en: 'Crimson Boots',
    item_type: 'armor',
    equipment_slot: 5,
    class_restriction: 'mage',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Mage/crimson%20boots.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'high',
    is_mock: false,
  },

  // ── PRIEST ARMOR ────────────────────────────────────────────────────────────

  {
    item_id: 360001000,
    item_name: 'Priest Chitin Armor Helmet',
    item_name_en: 'Priest Chitin Armor Helmet',
    item_type: 'armor',
    equipment_slot: 1,
    class_restriction: 'priest',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Priest/priest%20chitin%20armor%20helmet.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'high',
    is_mock: false,
  },
  {
    item_id: 360002000,
    item_name: 'Priest Chitin Armor Pauldron',
    item_name_en: 'Priest Chitin Armor Pauldron',
    item_type: 'armor',
    equipment_slot: 2,
    class_restriction: 'priest',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Priest/priest%20chitin%20armor%20pauldron.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'high',
    is_mock: false,
  },

  // ── WARRIOR ARMOR (Dragon Scale) ────────────────────────────────────────────

  {
    item_id: 320001000,
    item_name: 'Dragon Scale Helmet',
    item_name_en: 'Dragon Scale Helmet',
    item_type: 'armor',
    equipment_slot: 1,
    class_restriction: 'warrior',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Warrior/Dragon%20Scale%20Helmet.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'unique',
    is_mock: false,
  },
  {
    item_id: 320002000,
    item_name: 'Dragon Scale Armor Top',
    item_name_en: 'Dragon Scale Armor Top',
    item_type: 'armor',
    equipment_slot: 2,
    class_restriction: 'warrior',
    nation_restriction: 'all',
    icon_url: `${ICON_BASE}/Armor/Warrior/Dragon%20Scale%20Armor%20Top.png`,
    model_url: undefined,
    is_armor: true,
    max_upgrade: 11,
    item_grade: 'unique',
    is_mock: false,
  },
]

// ─── Build lookup map ──────────────────────────────────────────────────────────

const ITEM_MAP = new Map(REAL_ITEMS.map(i => [i.item_id, i]))

// ─── Auto-generate upgrade variants for weapons ────────────────────────────────
// KO stores each upgrade as a separate item_id (base + upgrade_level)
function buildUpgradeItems(): Map<number, Item> {
  const map = new Map(ITEM_MAP)
  for (const baseItem of REAL_ITEMS) {
    if (!baseItem.is_weapon && !baseItem.is_armor) continue
    for (let upg = 1; upg <= 11; upg++) {
      const upgId = baseItem.item_id + upg
      if (!map.has(upgId)) {
        map.set(upgId, {
          ...baseItem,
          item_id: upgId,
          item_name: `${baseItem.item_name_en}(+${upg})`,
          item_name_en: `${baseItem.item_name_en}(+${upg})`,
        })
      }
    }
  }
  return map
}

const ALL_ITEMS = buildUpgradeItems()

export class MockItemProvider implements ItemProvider {
  async getItem(itemId: number): Promise<Item | null> {
    return ALL_ITEMS.get(itemId) ?? null
  }

  async getItemsByIds(itemIds: number[]): Promise<Item[]> {
    return itemIds
      .map(id => ALL_ITEMS.get(id))
      .filter((i): i is Item => Boolean(i))
  }

  async searchItems(query: string): Promise<Item[]> {
    const q = query.toLowerCase()
    return Array.from(ALL_ITEMS.values()).filter(
      i => i.item_name.toLowerCase().includes(q) ||
           (i.item_name_en ?? '').toLowerCase().includes(q)
    ).slice(0, 20)
  }
}
