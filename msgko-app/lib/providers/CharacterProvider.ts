// ============================================================
// Character Data Provider Interface
// ============================================================

import type {
  Character,
  CharacterSearchResult,
  Server,
} from '../types/character'

/**
 * Abstraction for fetching character data.
 * Implementations can be:
 *  - MockCharacterProvider (testing/demo)
 *  - SupabaseCharacterProvider (production)
 *  - ServerAPICharacterProvider (real-time from KO server API, if available)
 */
export interface CharacterProvider {
  /**
   * Search for a character by server code and player name.
   * Returns null if not found.
   */
  getCharacter(serverCode: string, playerName: string): Promise<CharacterSearchResult>

  /**
   * Get all available servers.
   */
  getServers(): Promise<Server[]>
}
