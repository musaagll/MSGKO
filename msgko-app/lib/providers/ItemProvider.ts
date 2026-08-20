// ============================================================
// Item Data Provider Interface
// ============================================================

import type { Item } from '../types/character'

/**
 * Abstraction for fetching item data.
 * Implementations can be:
 *  - MockItemProvider (testing/demo)
 *  - SupabaseItemProvider (production)
 */
export interface ItemProvider {
  /**
   * Get a single item by ID.
   * Returns null if not found.
   */
  getItem(itemId: number): Promise<Item | null>

  /**
   * Get multiple items by IDs (bulk fetch).
   * Returns only found items.
   */
  getItemsByIds(itemIds: number[]): Promise<Item[]>

  /**
   * Search items by name (optional).
   */
  searchItems?(query: string): Promise<Item[]>
}
