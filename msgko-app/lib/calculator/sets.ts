/**
 * Set bonus tables
 * lib/calculator/sets.ts
 *
 * Kobugda.com kaynak verilerinden alınan gerçek set bonusları.
 * Index = kaç parça takılı (0 = hiç, 5 = full set)
 */

import { SetBonus, CalculatorState } from './types'

const EMPTY: SetBonus = {
  str: 0, dex: 0, hp: 0, mp: 0, int: 0,
  ac: 0, flameres: 0, iceres: 0, lightingres: 0, ap: 0,
}

// ─── WARRIOR KROWAZ ───────────────────────────────────────────────────────────
export const WARRIOR_KROWAZ: SetBonus[] = [
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY, hp: 25,  mp: 175, str: 8 },
  { ...EMPTY, hp: 100, mp: 350, str: 13, iceres: 5 },
  { ...EMPTY, hp: 650, mp: 250, str: 15, iceres: 10, lightingres: 10 },
  { ...EMPTY, hp: 600, mp: 600, str: 15, iceres: 10, lightingres: 10 },
]

// ─── ROGUE KROWAZ ─────────────────────────────────────────────────────────────
export const ROGUE_KROWAZ: SetBonus[] = [
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY, hp: 100, mp: 50,  str: 4,  dex: 8 },
  { ...EMPTY, hp: 150, mp: 100, str: 5,  dex: 13, iceres: 5 },
  { ...EMPTY, hp: 100, mp: 200, str: 10, dex: 15, iceres: 10, lightingres: 10 },
  { ...EMPTY, hp: 400, mp: 500, str: 10, dex: 15, iceres: 10, lightingres: 10 },
]

// ─── PRIEST KROWAZ ────────────────────────────────────────────────────────────
export const PRIEST_KROWAZ: SetBonus[] = [
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY, hp: 113, mp: 150, str: 4,  int: 8 },
  { ...EMPTY, hp: 350, mp: 100, str: 5,  int: 13, iceres: 5 },
  { ...EMPTY, hp: 300, mp: 350, str: 10, int: 15, iceres: 10, lightingres: 10 },
  { ...EMPTY, hp: 500, mp: 400, str: 10, int: 15, iceres: 10, lightingres: 10 },
]

// ─── MAGE KROWAZ ──────────────────────────────────────────────────────────────
export const MAGE_KROWAZ: SetBonus[] = [
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY, hp: 150, mp: 150, str: 4,  ac: 25 },
  { ...EMPTY, hp: 200, mp: 200, str: 5,  ac: 30, iceres: 5 },
  { ...EMPTY, hp: 200, mp: 800, str: 10, ac: 35, iceres: 10, lightingres: 10 },
  { ...EMPTY, hp: 300, mp: 800, str: 10, ac: 40, iceres: 10, lightingres: 10 },
]

// ─── KURIAN KROWAZ ────────────────────────────────────────────────────────────
export const KURIAN_KROWAZ: SetBonus[] = [
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY, hp: 25,  mp: 175, str: 8 },
  { ...EMPTY, hp: 100, mp: 350, str: 13, iceres: 5 },
  { ...EMPTY, hp: 650, mp: 250, str: 15, iceres: 10, lightingres: 10 },
  { ...EMPTY, hp: 600, mp: 600, str: 15, iceres: 10, lightingres: 10 },
]

// ─── WARRIOR MITHRIL ──────────────────────────────────────────────────────────
export const WARRIOR_MITHRIL: SetBonus[] = [
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY, str: 5,  hp: 200 },
  { ...EMPTY, str: 8,  hp: 300, ac: 15 },
  { ...EMPTY, str: 10, hp: 500, ac: 20, iceres: 10 },
]

export const ROGUE_MITHRIL: SetBonus[] = [
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY, dex: 5,  hp: 200 },
  { ...EMPTY, dex: 8,  hp: 300, ac: 15 },
  { ...EMPTY, dex: 10, hp: 500, ac: 20, iceres: 10 },
]

export const PRIEST_MITHRIL: SetBonus[] = [
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY, int: 5,  hp: 200 },
  { ...EMPTY, int: 8,  hp: 300, ac: 15 },
  { ...EMPTY, int: 10, hp: 500, ac: 20, iceres: 10 },
]

export const MAGE_MITHRIL: SetBonus[] = [
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY, str: 5,  mp: 200, ac: 15 },
  { ...EMPTY, str: 8,  mp: 300, ac: 20 },
  { ...EMPTY, str: 10, mp: 500, ac: 25, iceres: 10 },
]

export const KURIAN_MITHRIL: SetBonus[] = [
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY, str: 5,  hp: 200 },
  { ...EMPTY, str: 8,  hp: 300, ac: 15 },
  { ...EMPTY, str: 10, hp: 500, ac: 20, iceres: 10 },
]

// ─── SECRET SET ───────────────────────────────────────────────────────────────
export const SECRET_SET: SetBonus[] = [
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY, str: 3, dex: 3, hp: 100 },
  { ...EMPTY, str: 5, dex: 5, hp: 200, ac: 10 },
  { ...EMPTY, str: 7, dex: 7, hp: 300, ac: 15, iceres: 5, lightingres: 5 },
]

// ─── HOLY KNIGHT SET ──────────────────────────────────────────────────────────
export const HOLY_KNIGHT_SET: SetBonus[] = [
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY, str: 5,  hp: 150, ac: 10 },
  { ...EMPTY, str: 8,  hp: 250, ac: 15 },
  { ...EMPTY, str: 10, hp: 400, ac: 20, iceres: 10, lightingres: 10 },
]

// ─── ROSETTA SET ──────────────────────────────────────────────────────────────
export const ROSETTA_SET: SetBonus[] = [
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY, str: 3, dex: 3 },
  { ...EMPTY, str: 5, dex: 5, hp: 100 },
  { ...EMPTY, str: 7, dex: 7, hp: 200, ac: 10 },
  { ...EMPTY, str: 10, dex: 10, hp: 300, ac: 15, iceres: 5, lightingres: 5 },
]

// ─── KURIAN KROWAZ (Kurian-only set) ─────────────────────────────────────────
export const KURIAN_KROWAZ_KURIAN: SetBonus[] = [
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY, hp: 25,  mp: 175, str: 8 },
  { ...EMPTY, hp: 100, mp: 350, str: 13, iceres: 5 },
  { ...EMPTY, hp: 650, mp: 250, str: 15, iceres: 10, lightingres: 10 },
  { ...EMPTY, hp: 600, mp: 600, str: 15, iceres: 10, lightingres: 10 },
]

// ─── KURIAN HOLY KNIGHT (Kurian-only) ────────────────────────────────────────
export const KURIAN_HOLY_KNIGHT_KURIAN: SetBonus[] = [
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY },
  { ...EMPTY, str: 5,  hp: 150, ac: 10 },
  { ...EMPTY, str: 8,  hp: 250, ac: 15 },
  { ...EMPTY, str: 10, hp: 400, ac: 20, iceres: 10, lightingres: 10 },
]

// ─── Helper ───────────────────────────────────────────────────────────────────

export function getSetBonusByPieces(setTable: SetBonus[], pieces: number): SetBonus {
  const index = Math.max(0, Math.min(pieces, setTable.length - 1))
  return setTable[index]
}

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
