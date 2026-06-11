/**
 * Set bonus tables and helper functions
 * lib/calculator/sets.ts
 */

import { SetBonus, CalculatorState } from './types'

// ─── Empty SetBonus ───────────────────────────────────────────────────────────

const EMPTY: SetBonus = {
  str: 0, dex: 0, hp: 0, mp: 0, int: 0,
  ac: 0, flameres: 0, iceres: 0, lightingres: 0, ap: 0,
}

// ─── Krowaz Sets ─────────────────────────────────────────────────────────────

export const WARRIOR_KROWAZ: SetBonus[] = [
  EMPTY,
  { ...EMPTY, str: 5 },
  { ...EMPTY, str: 5, ac: 20 },
  { ...EMPTY, str: 5, ac: 20, hp: 20 },
  { ...EMPTY, str: 10, ac: 20, hp: 20 },
  { ...EMPTY, str: 10, ac: 30, hp: 20, ap: 5 },
]

export const ROGUE_KROWAZ: SetBonus[] = [
  EMPTY,
  { ...EMPTY, dex: 5 },
  { ...EMPTY, dex: 5, ac: 20 },
  { ...EMPTY, dex: 5, ac: 20, hp: 20 },
  { ...EMPTY, dex: 10, ac: 20, hp: 20 },
  { ...EMPTY, dex: 10, ac: 30, hp: 20, ap: 5 },
]

export const PRIEST_KROWAZ: SetBonus[] = [
  EMPTY,
  { ...EMPTY, int: 5 },
  { ...EMPTY, int: 5, ac: 20 },
  { ...EMPTY, int: 5, ac: 20, hp: 20 },
  { ...EMPTY, int: 10, ac: 20, hp: 20 },
  { ...EMPTY, int: 10, ac: 30, hp: 20, ap: 5 },
]

export const MAGE_KROWAZ: SetBonus[] = [
  EMPTY,
  { ...EMPTY, str: 5 },
  { ...EMPTY, str: 5, ac: 20 },
  { ...EMPTY, str: 5, ac: 20, mp: 20 },
  { ...EMPTY, str: 10, ac: 20, mp: 20 },
  { ...EMPTY, str: 10, ac: 30, mp: 20, ap: 5 },
]

export const KURIAN_KROWAZ: SetBonus[] = [
  EMPTY,
  { ...EMPTY, str: 5 },
  { ...EMPTY, str: 5, ac: 20 },
  { ...EMPTY, str: 5, ac: 20, hp: 20 },
  { ...EMPTY, str: 10, ac: 20, hp: 20 },
  { ...EMPTY, str: 10, ac: 30, hp: 20, ap: 5 },
]

// ─── Mithril Sets ─────────────────────────────────────────────────────────────

export const WARRIOR_MITHRIL: SetBonus[] = [
  EMPTY,
  EMPTY,
  EMPTY,
  { ...EMPTY, ac: 30 },
  { ...EMPTY, ac: 30, str: 5 },
  { ...EMPTY, ac: 40, str: 5, hp: 10 },
]

export const ROGUE_MITHRIL: SetBonus[] = [
  EMPTY,
  EMPTY,
  EMPTY,
  { ...EMPTY, ac: 30 },
  { ...EMPTY, ac: 30, dex: 5 },
  { ...EMPTY, ac: 40, dex: 5, hp: 10 },
]

export const PRIEST_MITHRIL: SetBonus[] = [
  EMPTY,
  EMPTY,
  EMPTY,
  { ...EMPTY, ac: 30 },
  { ...EMPTY, ac: 30, int: 5 },
  { ...EMPTY, ac: 40, int: 5, hp: 10 },
]

export const MAGE_MITHRIL: SetBonus[] = [
  EMPTY,
  EMPTY,
  EMPTY,
  { ...EMPTY, ac: 30 },
  { ...EMPTY, ac: 30, str: 5 },
  { ...EMPTY, ac: 40, str: 5, mp: 10 },
]

export const KURIAN_MITHRIL: SetBonus[] = [
  EMPTY,
  EMPTY,
  EMPTY,
  { ...EMPTY, ac: 30 },
  { ...EMPTY, ac: 30, str: 5 },
  { ...EMPTY, ac: 40, str: 5, hp: 10 },
]

// ─── Secret Set (all classes) ─────────────────────────────────────────────────

export const SECRET_SET: SetBonus[] = [
  EMPTY,
  EMPTY,
  EMPTY,
  { ...EMPTY, ac: 15, str: 3 },
  { ...EMPTY, ac: 20, str: 5 },
  { ...EMPTY, ac: 25, str: 5, dex: 5 },
]

// ─── Holy Knight Set ──────────────────────────────────────────────────────────

export const HOLY_KNIGHT_SET: SetBonus[] = [
  EMPTY,
  EMPTY,
  EMPTY,
  { ...EMPTY, str: 5, ac: 20 },
  { ...EMPTY, str: 10, ac: 25 },
  { ...EMPTY, str: 10, ac: 30, hp: 15 },
]

// ─── Rosetta Set ──────────────────────────────────────────────────────────────

export const ROSETTA_SET: SetBonus[] = [
  EMPTY,
  EMPTY,
  { ...EMPTY, ac: 10 },
  { ...EMPTY, ac: 15, str: 3 },
  { ...EMPTY, ac: 20, str: 5 },
  { ...EMPTY, ac: 25, str: 8 },
]

// ─── Kurian-specific sets (same values, distinct labels) ──────────────────────

export const KURIAN_KROWAZ_KURIAN: SetBonus[] = KURIAN_KROWAZ

export const KURIAN_HOLY_KNIGHT_KURIAN: SetBonus[] = HOLY_KNIGHT_SET

// ─── Helper: get bonus for a given piece count ────────────────────────────────

/**
 * Returns the SetBonus for a given number of equipped pieces.
 * Clamps pieces to [0, setTable.length - 1].
 */
export function getSetBonusByPieces(setTable: SetBonus[], pieces: number): SetBonus {
  const index = Math.max(0, Math.min(pieces, setTable.length - 1))
  return setTable[index]
}

// ─── Aggregate all active set bonuses from state ──────────────────────────────

/**
 * Sums all 7 set bonus objects stored in CalculatorState into a single SetBonus.
 */
export function getAllSetBonuses(state: CalculatorState): SetBonus {
  const sources: SetBonus[] = [
    state.setBonusKrowaz,
    state.setBonusMithril,
    state.setBonusSecret,
    state.setBonusHolyKnight,
    state.setBonusRosetta,
    state.setBonusKrowazKurian,
    state.setBonusHolyKnightKurian,
  ]

  return sources.reduce<SetBonus>(
    (acc, bonus) => ({
      str:         acc.str         + bonus.str,
      dex:         acc.dex         + bonus.dex,
      hp:          acc.hp          + bonus.hp,
      mp:          acc.mp          + bonus.mp,
      int:         acc.int         + bonus.int,
      ac:          acc.ac          + bonus.ac,
      flameres:    acc.flameres    + bonus.flameres,
      iceres:      acc.iceres      + bonus.iceres,
      lightingres: acc.lightingres + bonus.lightingres,
      ap:          acc.ap          + bonus.ap,
    }),
    { ...EMPTY }
  )
}
