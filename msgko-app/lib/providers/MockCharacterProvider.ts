// ============================================================
// Mock Character Provider — DEMO DATA
// Uses real KO item IDs mapped to real item names + icons
// ============================================================

import type { Character, CharacterSearchResult, Server } from '../types/character'
import type { CharacterProvider } from './CharacterProvider'

export const MOCK_SERVERS: Server[] = [
  { id: '1', server_code: 'zero',   server_name: 'Zero',   server_type: 'private', is_active: true, sort_order: 1 },
  { id: '2', server_code: 'destan', server_name: 'Destan', server_type: 'private', is_active: true, sort_order: 2 },
  { id: '3', server_code: 'ares',   server_name: 'Ares',   server_type: 'private', is_active: true, sort_order: 3 },
  { id: '4', server_code: 'diez',   server_name: 'Diez',   server_type: 'private', is_active: true, sort_order: 4 },
]

// Item IDs correspond to MockItemProvider entries
// Shard +11      = 389060011 (base 389060000 + 11)
// Mirage Dagger +11 = 389050011
// Rogue Chitin Armor Helmet +9 = 380001009
// etc.

const MOCK_CHARACTERS: Character[] = [
  // ── Rogue Karus (most popular setup) ──────────────────────────────────────
  {
    id: 'char-1stmsg',
    character_name: '1stMSG',
    server: MOCK_SERVERS[0],
    nation: 'karus',
    race: 'orc_1',
    class: 'rogue',
    gender: 'male',
    level: 83,
    data_source: 'mock',
    is_verified: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    equipment: {
      HELMET:     { slot_id: 1,  item_id: 381001009, upgrade_level: 9 },   // Mythril Helmet +9
      ARMOR:      { slot_id: 2,  item_id: 381002009, upgrade_level: 9 },   // Mythril Pauldron +9
      PADS:       { slot_id: 3,  item_id: 381003008, upgrade_level: 8 },   // Mythril Pad +8
      GLOVES:     { slot_id: 4,  item_id: 381004008, upgrade_level: 8 },   // Mythril Gauntlet +8
      BOOTS:      { slot_id: 5,  item_id: 381005008, upgrade_level: 8 },   // Mythril Boots +8
      RIGHT_HAND: { slot_id: 6,  item_id: 389060011, upgrade_level: 11 },  // Shard +11
      LEFT_HAND:  { slot_id: 7,  item_id: 389050011, upgrade_level: 11 },  // Mirage Dagger +11
    },
    cospre: {},
  },

  // ── Warrior El Morad ──────────────────────────────────────────────────────
  {
    id: 'char-testwarrior',
    character_name: 'TestWarrior',
    server: MOCK_SERVERS[0],
    nation: 'el_morad',
    race: 'human_male',
    class: 'warrior',
    gender: 'male',
    level: 77,
    data_source: 'mock',
    is_verified: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    equipment: {
      HELMET:     { slot_id: 1,  item_id: 310001007, upgrade_level: 7 },  // Chitin Armor Helmet +7
      ARMOR:      { slot_id: 2,  item_id: 310002007, upgrade_level: 7 },  // Chitin Armor Pauldron +7
      PADS:       { slot_id: 3,  item_id: 310003007, upgrade_level: 7 },  // Chitin Armor Pads +7
      GLOVES:     { slot_id: 4,  item_id: 310004007, upgrade_level: 7 },  // Chitin Armor Gauntlets +7
      BOOTS:      { slot_id: 5,  item_id: 310005007, upgrade_level: 7 },  // Chitin Armor Boots +7
      RIGHT_HAND: { slot_id: 6,  item_id: 389040009, upgrade_level: 9 },  // Raptor +9
    },
    cospre: {},
  },

  // ── Mage Karus ────────────────────────────────────────────────────────────
  {
    id: 'char-magelord',
    character_name: 'MageLord',
    server: MOCK_SERVERS[1],
    nation: 'karus',
    race: 'orc_2',
    class: 'mage',
    gender: 'male',
    level: 80,
    data_source: 'mock',
    is_verified: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    equipment: {
      HELMET:     { slot_id: 1,  item_id: 350001008, upgrade_level: 8 },  // Crimson Helmet +8
      ARMOR:      { slot_id: 2,  item_id: 350002008, upgrade_level: 8 },  // Crimson Robe +8
      PADS:       { slot_id: 3,  item_id: 350003007, upgrade_level: 7 },  // Crimson Pants +7
      GLOVES:     { slot_id: 4,  item_id: 350004007, upgrade_level: 7 },  // Crimson Gloves +7
      BOOTS:      { slot_id: 5,  item_id: 350005007, upgrade_level: 7 },  // Crimson Boots +7
      RIGHT_HAND: { slot_id: 6,  item_id: 388010010, upgrade_level: 10 }, // Elixir Staff +10
    },
    cospre: {},
  },
]

export class MockCharacterProvider implements CharacterProvider {
  async getCharacter(serverCode: string, playerName: string): Promise<CharacterSearchResult> {
    await new Promise(r => setTimeout(r, 300))

    const character = MOCK_CHARACTERS.find(
      c =>
        c.server.server_code === serverCode &&
        c.character_name.toLowerCase() === playerName.toLowerCase()
    )

    if (!character) {
      return {
        found: false,
        error: `"${playerName}" karakteri ${serverCode.toUpperCase()} serverında bulunamadı.`,
        is_mock: true,
      }
    }

    return { found: true, character, is_mock: true }
  }

  async getServers(): Promise<Server[]> {
    return MOCK_SERVERS
  }
}
