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
    equipment_slot: (SLOT_KEY_MAP[raw.equipment_slot_key] ?? 0) as Item['equipment_slot'],
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
