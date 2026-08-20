// ============================================================
// Character 3D Model Assembler
// Resolves equipment → 3D model URLs for Three.js
// ============================================================

import type {
  Character,
  CharacterModelSet,
  EquipmentSet,
  CospreSet,
  EquipmentSlotKey,
  EQUIPMENT_SLOTS,
} from '../types/character'
import type { ItemProvider } from '../providers/ItemProvider'

export class CharacterAssembler {
  constructor(private itemProvider: ItemProvider) {}

  /**
   * Main assembly: character + equipment → resolved 3D model URLs
   */
  async assembleCharacter(
    character: Character,
    equipment?: EquipmentSet,
    cospre?: CospreSet
  ): Promise<CharacterModelSet> {
    // 1. Base body model URL
    const base_body = this.getBaseBodyModel(character)

    // 2. Get equipment models
    const equipmentModels = await this.getEquipmentModels(equipment)

    // 3. Apply cospre overrides (if any active)
    const finalModels = this.applyCospreOverrides(equipmentModels, cospre)

    return {
      base_body,
      ...finalModels,
    }
  }

  /**
   * Determine base body model path based on race/gender/class.
   * NOTE: These paths are placeholders. Real KO models will use same structure
   * but different filenames once asset pipeline is ready.
   */
  private getBaseBodyModel(character: Character): string {
    const { race, gender, class: cls } = character

    // Pattern: /models/bodies/{race}_{gender}_{class}.glb
    // These files DO NOT exist yet — they're placeholders for the asset system.
    return `/assets/models/bodies/${race}_${gender}_${cls}.glb`
  }

  /**
   * Resolve equipment item IDs → model URLs
   */
  private async getEquipmentModels(equipment?: EquipmentSet): Promise<{
    helmet?: string
    armor?: string
    pads?: string
    gloves?: string
    boots?: string
    right_hand?: string
    left_hand?: string
    wings?: string
    pet?: string
  }> {
    if (!equipment) return {}

    // Gather all item IDs
    const itemIds = Object.values(equipment)
      .filter(Boolean)
      .map(e => e.item_id)

    if (itemIds.length === 0) return {}

    // Bulk fetch items
    const items = await this.itemProvider.getItemsByIds(itemIds)

    // Map slot → model URL
    const models: Record<string, string | undefined> = {}

    for (const [slotKey, entry] of Object.entries(equipment)) {
      if (!entry) continue
      const item = items.find(i => i.item_id === entry.item_id)
      if (!item?.model_url) continue

      // Check if upgrade visual exists
      let modelUrl = item.model_url

      // If item has upgrade-specific visuals, use them
      if (entry.upgrade_level > 0 && item.upgrade_visuals) {
        const upgradeVisual = item.upgrade_visuals.find(
          u => u.upgrade_level === entry.upgrade_level
        )
        if (upgradeVisual?.model_url) {
          modelUrl = upgradeVisual.model_url
        }
      }

      // Map to assembler keys
      const mapping: Record<EquipmentSlotKey, string> = {
        HELMET: 'helmet',
        ARMOR: 'armor',
        PADS: 'pads',
        GLOVES: 'gloves',
        BOOTS: 'boots',
        RIGHT_HAND: 'right_hand',
        LEFT_HAND: 'left_hand',
        WINGS: 'wings',
        PET: 'pet',
        RING_1: '', // Rings/earrings/necklace may not have visible 3D models
        RING_2: '',
        NECKLACE: '',
        EARRING_1: '',
        EARRING_2: '',
      }

      const key = mapping[slotKey as EquipmentSlotKey]
      if (key) {
        models[key] = modelUrl
      }
    }

    return models
  }

  /**
   * Apply cospre overrides.
   * If a cospre is active, it may replace certain equipment visuals.
   * 
   * ⚠️ IMPORTANT: Which slots each cospre overrides is NOT confirmed for real KO.
   * This logic should ideally come from the ko_cospre_overrides table.
   * For now, hardcoded placeholder behavior:
   *   - Valkyrie: overrides helmet+armor+gloves+boots
   *   - Pathos: overrides gloves only
   *   - Wings: overrides wings slot
   */
  private applyCospreOverrides(
    models: Record<string, string | undefined>,
    cospre?: CospreSet
  ): Record<string, string | undefined> {
    if (!cospre) return models

    const result = { ...models }

    // Valkyrie override
    if (cospre.valkyrie?.enabled && cospre.valkyrie.item_id) {
      // In reality, we'd fetch the valkyrie item model_url
      // For now, placeholder logic:
      const valkyrieModel = '/assets/models/cospre/placeholder_valkyrie.glb'
      result.helmet = valkyrieModel
      result.armor = valkyrieModel
      result.gloves = valkyrieModel
      result.boots = valkyrieModel
    }

    // Pathos override (gloves only — UNCONFIRMED)
    if (cospre.pathos?.enabled && cospre.pathos.item_id) {
      result.gloves = '/assets/models/cospre/placeholder_pathos.glb'
    }

    // Wings override
    if (cospre.wings?.enabled && cospre.wings.item_id) {
      result.wings = '/assets/models/cospre/placeholder_wings_cospre.glb'
    }

    return result
  }
}
