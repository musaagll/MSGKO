/**
 * Calculator state reducer
 * lib/calculator/reducer.ts
 */

import type {
  CalculatorState,
  CharacterClass,
  StatPoints,
  EquippedItems,
  EquippedItem,
  BuffState,
  SetBonus,
  AchievementBonus,
} from './types'
import {
  getSetBonusByPieces,
  WARRIOR_KROWAZ,
  ROGUE_KROWAZ,
  PRIEST_KROWAZ,
  MAGE_KROWAZ,
  KURIAN_KROWAZ,
  WARRIOR_MITHRIL,
  ROGUE_MITHRIL,
  PRIEST_MITHRIL,
  MAGE_MITHRIL,
  KURIAN_MITHRIL,
  SECRET_SET,
  HOLY_KNIGHT_SET,
  ROSETTA_SET,
  KURIAN_KROWAZ_KURIAN,
  KURIAN_HOLY_KNIGHT_KURIAN,
} from './sets'

// ─── Empty Helpers ────────────────────────────────────────────────────────────

const EMPTY_STATS: StatPoints = { str: 0, dex: 0, hp: 0, mp: 0, int: 0 }

const EMPTY_EQUIPPED: EquippedItems = {
  rightHand: null,
  leftHand: null,
  armor: null,
  accessory: null,
  leftPathos: null,
  rightPathos: null,
  tattoo: null,
  wings: null,
  emblem: null,
}

const EMPTY_SET_BONUS: SetBonus = {
  str: 0,
  dex: 0,
  hp: 0,
  mp: 0,
  int: 0,
  ac: 0,
  flameres: 0,
  iceres: 0,
  lightingres: 0,
  ap: 0,
}

const EMPTY_ACHIEVEMENT: AchievementBonus = {
  ap: 0,
  ac: 0,
  str: 0,
  dex: 0,
  hp: 0,
  mp: 0,
  int: 0,
  flameres: 0,
  iceres: 0,
  lightingres: 0,
}

const INITIAL_BUFFS: BuffState = {
  strScroll: false,
  dexScroll: false,
  hpScroll: false,
  mpScroll: false,
  intScroll: false,
  lionScroll: false,
  wolf: false,
  apScroll: false,
  redPotion: false,
  weaponEnchant: false,
  berserker: false,
  commanderDetermination: false,
  bluePotion: false,
  armorEnchant: false,
  frozenArmor: false,
  frozenShell: false,
  iceBarrier: false,
  acBuff: 1,
  gemDefense: false,
  magicShield: false,
  hpBuff: 1,
  spellOfLife: false,
  gemLife: false,
  battleCry: false,
  priestBook: false,
  priestLimitedBook: false,
  priestStr: false,
  mageFR: false,
  mageIR: false,
  mageLR: false,
  mageFrozenArmor: false,
  mageFrozenShell: false,
  mageIceBarrier: false,
  malice: false,
  torment: false,
  parasite: false,
  superParasite: false,
  confusion: false,
  massive: false,
  subside: false,
  petHp: false,
  petAc: false,
  petAp: false,
}

// ─── Initial State ────────────────────────────────────────────────────────────

export const initialState: CalculatorState = {
  characterClass: 'Warrior',
  rogueSubClass: 'Assassin',
  levelId: 1,
  level: 1,
  rebirthLevel: 0,
  statPoints: { ...EMPTY_STATS },
  rebirthStatPoints: { ...EMPTY_STATS },
  bonusStatPoints: { ...EMPTY_STATS },
  totalPoints: 10,
  usedPoints: 0,
  totalRebirthPoints: 0,
  usedRebirthPoints: 0,
  equipped: { ...EMPTY_EQUIPPED },
  itemStat: null,
  buffs: { ...INITIAL_BUFFS },
  setBonusKrowaz: { ...EMPTY_SET_BONUS },
  setBonusMithril: { ...EMPTY_SET_BONUS },
  setBonusSecret: { ...EMPTY_SET_BONUS },
  setBonusHolyKnight: { ...EMPTY_SET_BONUS },
  setBonusRosetta: { ...EMPTY_SET_BONUS },
  setBonusKrowazKurian: { ...EMPTY_SET_BONUS },
  setBonusHolyKnightKurian: { ...EMPTY_SET_BONUS },
  achievement: { ...EMPTY_ACHIEVEMENT },
  warriorDefenseSkill: 0,
  warriorResistSkill: 0,
  kurianDefenseSkill: 0,
  kurianResistSkill: 0,
  priestWeaponType: 'Sword',
}

// ─── Action Union Type ────────────────────────────────────────────────────────

export type Action =
  | { type: 'SET_CLASS'; payload: CharacterClass }
  | { type: 'SET_ROGUE_SUBCLASS'; payload: 'Assassin' | 'Archer' }
  | { type: 'SET_LEVEL'; payload: { levelId: number; level: number; rebirthLevel: number } }
  | { type: 'SET_STAT'; payload: { stat: keyof StatPoints; value: number } }
  | { type: 'SET_REBIRTH_STAT'; payload: { stat: keyof StatPoints; value: number } }
  | { type: 'TOGGLE_BUFF'; payload: keyof BuffState }
  | { type: 'SET_BUFF_VALUE'; payload: { buff: 'acBuff' | 'hpBuff'; value: number } }
  | { type: 'EQUIP_ITEM'; payload: { slot: keyof EquippedItems; item: EquippedItem } }
  | { type: 'UNEQUIP_ITEM'; payload: { slot: keyof EquippedItems } }
  | { type: 'SET_ACHIEVEMENT'; payload: AchievementBonus }
  | { type: 'SET_WARRIOR_DEFENSE_SKILL'; payload: number }
  | { type: 'SET_WARRIOR_RESIST_SKILL'; payload: number }
  | { type: 'SET_KURIAN_DEFENSE_SKILL'; payload: number }
  | { type: 'SET_KURIAN_RESIST_SKILL'; payload: number }
  | { type: 'SET_PRIEST_WEAPON_TYPE'; payload: string }
  | {
      type: 'SET_SET_BONUS'
      payload: {
        setName:
          | 'krowaz'
          | 'mithril'
          | 'secret'
          | 'holyKnight'
          | 'rosetta'
          | 'krowazKurian'
          | 'holyKnightKurian'
        pieces: number
      }
    }

// ─── Buff Conflict Helper ─────────────────────────────────────────────────────

function applyBuffConflicts(buffs: BuffState, toggledBuff: keyof BuffState): BuffState {
  const next = { ...buffs }

  // Wolf ↔ PriestBook ↔ PriestLimitedBook ↔ CommanderDetermination ↔ ApScroll (sadece biri aktif)
  if (toggledBuff === 'wolf' && next.wolf) {
    next.priestBook = false
    next.priestLimitedBook = false
    next.commanderDetermination = false
    next.apScroll = false
  }
  if (toggledBuff === 'priestBook' && next.priestBook) {
    next.wolf = false
    next.priestLimitedBook = false
    next.commanderDetermination = false
    next.apScroll = false
  }
  if (toggledBuff === 'priestLimitedBook' && next.priestLimitedBook) {
    next.wolf = false
    next.priestBook = false
    next.commanderDetermination = false
    next.apScroll = false
  }
  if (toggledBuff === 'commanderDetermination' && next.commanderDetermination) {
    next.wolf = false
    next.priestBook = false
    next.priestLimitedBook = false
    next.apScroll = false
  }
  if (toggledBuff === 'apScroll' && next.apScroll) {
    next.wolf = false
    next.priestBook = false
    next.priestLimitedBook = false
    next.commanderDetermination = false
  }

  // Power of Lion ↔ bireysel stat scroll'ları
  if (toggledBuff === 'lionScroll' && next.lionScroll) {
    next.strScroll = false
    next.dexScroll = false
    next.hpScroll = false
    next.mpScroll = false
    next.intScroll = false
  }
  if (
    (
      ['strScroll', 'dexScroll', 'hpScroll', 'mpScroll', 'intScroll'] as (keyof BuffState)[]
    ).includes(toggledBuff)
  ) {
    if (next[toggledBuff]) next.lionScroll = false
  }

  // Frozen armor (mage): birbirini devre dışı bırakır
  if (toggledBuff === 'mageFrozenArmor' && next.mageFrozenArmor) {
    next.mageFrozenShell = false
    next.mageIceBarrier = false
    next.acBuff = 1
  }
  if (toggledBuff === 'mageFrozenShell' && next.mageFrozenShell) {
    next.mageFrozenArmor = false
    next.mageIceBarrier = false
    next.acBuff = 1
  }
  if (toggledBuff === 'mageIceBarrier' && next.mageIceBarrier) {
    next.mageFrozenArmor = false
    next.mageFrozenShell = false
    next.acBuff = 1
  }

  // Mage immunity: birbirini devre dışı bırakır
  if (toggledBuff === 'mageFR' && next.mageFR) {
    next.mageIR = false
    next.mageLR = false
    next.magicShield = false
  }
  if (toggledBuff === 'mageIR' && next.mageIR) {
    next.mageFR = false
    next.mageLR = false
    next.magicShield = false
  }
  if (toggledBuff === 'mageLR' && next.mageLR) {
    next.mageFR = false
    next.mageIR = false
    next.magicShield = false
  }
  if (toggledBuff === 'magicShield' && next.magicShield) {
    next.mageFR = false
    next.mageIR = false
    next.mageLR = false
  }

  // Pet buff: sadece biri aktif
  if (toggledBuff === 'petHp' && next.petHp) {
    next.petAc = false
    next.petAp = false
  }
  if (toggledBuff === 'petAc' && next.petAc) {
    next.petHp = false
    next.petAp = false
  }
  if (toggledBuff === 'petAp' && next.petAp) {
    next.petHp = false
    next.petAc = false
  }

  // Spell of Life ↔ HP Buff
  if (toggledBuff === 'spellOfLife' && next.spellOfLife) {
    next.hpBuff = 1
  }

  return next
}

// ─── Level Stat Point Computation ────────────────────────────────────────────

function computeLevelPoints(
  level: number,
  rebirthLevel: number,
): { total: number; totalRebirth: number } {
  let total: number
  if (level <= 1) {
    total = 10
  } else if (level <= 83) {
    let pts = (level - 1) * 3
    if (level > 60) pts += (level - 60) * 2
    total = pts + 10
  } else {
    total = 302
  }
  const totalRebirth = rebirthLevel > 0 ? rebirthLevel * 2 : 0
  return { total, totalRebirth }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

export function calculatorReducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case 'SET_CLASS': {
      return { ...state, characterClass: action.payload }
    }

    case 'SET_ROGUE_SUBCLASS': {
      return { ...state, rogueSubClass: action.payload }
    }

    case 'SET_LEVEL': {
      const { levelId, level, rebirthLevel } = action.payload
      const { total, totalRebirth } = computeLevelPoints(level, rebirthLevel)
      return {
        ...state,
        levelId,
        level,
        rebirthLevel,
        totalPoints: total,
        totalRebirthPoints: totalRebirth,
      }
    }

    case 'SET_STAT': {
      const { stat, value } = action.payload
      const newStatPoints = { ...state.statPoints, [stat]: value }
      const usedPoints =
        newStatPoints.str +
        newStatPoints.dex +
        newStatPoints.hp +
        newStatPoints.mp +
        newStatPoints.int
      return { ...state, statPoints: newStatPoints, usedPoints }
    }

    case 'SET_REBIRTH_STAT': {
      const { stat, value } = action.payload
      const newRebirthStatPoints = { ...state.rebirthStatPoints, [stat]: value }
      const usedRebirthPoints =
        newRebirthStatPoints.str +
        newRebirthStatPoints.dex +
        newRebirthStatPoints.hp +
        newRebirthStatPoints.mp +
        newRebirthStatPoints.int
      return { ...state, rebirthStatPoints: newRebirthStatPoints, usedRebirthPoints }
    }

    case 'TOGGLE_BUFF': {
      const key = action.payload
      const currentValue = state.buffs[key]
      // Only toggle boolean buffs; numeric buffs (acBuff, hpBuff) are handled by SET_BUFF_VALUE
      if (typeof currentValue !== 'boolean') return state
      const toggled: BuffState = { ...state.buffs, [key]: !currentValue }
      const resolved = applyBuffConflicts(toggled, key)
      return { ...state, buffs: resolved }
    }

    case 'SET_BUFF_VALUE': {
      const { buff, value } = action.payload
      return { ...state, buffs: { ...state.buffs, [buff]: value } }
    }

    case 'EQUIP_ITEM': {
      const { slot, item } = action.payload
      return {
        ...state,
        equipped: { ...state.equipped, [slot]: item },
        itemStat: item.itemStat,
      }
    }

    case 'UNEQUIP_ITEM': {
      const { slot } = action.payload
      return {
        ...state,
        equipped: { ...state.equipped, [slot]: null },
      }
    }

    case 'SET_ACHIEVEMENT': {
      return { ...state, achievement: action.payload }
    }

    case 'SET_WARRIOR_DEFENSE_SKILL': {
      return { ...state, warriorDefenseSkill: action.payload }
    }

    case 'SET_WARRIOR_RESIST_SKILL': {
      return { ...state, warriorResistSkill: action.payload }
    }

    case 'SET_KURIAN_DEFENSE_SKILL': {
      return { ...state, kurianDefenseSkill: action.payload }
    }

    case 'SET_KURIAN_RESIST_SKILL': {
      return { ...state, kurianResistSkill: action.payload }
    }

    case 'SET_PRIEST_WEAPON_TYPE': {
      return { ...state, priestWeaponType: action.payload }
    }

    case 'SET_SET_BONUS': {
      const { setName, pieces } = action.payload
      const cls = state.characterClass
      let bonus: SetBonus = { ...EMPTY_SET_BONUS }

      if (setName === 'krowaz') {
        const table =
          cls === 'Warrior'
            ? WARRIOR_KROWAZ
            : cls === 'Rogue'
              ? ROGUE_KROWAZ
              : cls === 'Priest'
                ? PRIEST_KROWAZ
                : cls === 'Mage'
                  ? MAGE_KROWAZ
                  : KURIAN_KROWAZ
        bonus = getSetBonusByPieces(table, pieces)
        return { ...state, setBonusKrowaz: bonus }
      }

      if (setName === 'mithril') {
        const table =
          cls === 'Warrior'
            ? WARRIOR_MITHRIL
            : cls === 'Rogue'
              ? ROGUE_MITHRIL
              : cls === 'Priest'
                ? PRIEST_MITHRIL
                : cls === 'Mage'
                  ? MAGE_MITHRIL
                  : KURIAN_MITHRIL
        bonus = getSetBonusByPieces(table, pieces)
        return { ...state, setBonusMithril: bonus }
      }

      if (setName === 'secret') {
        bonus = getSetBonusByPieces(SECRET_SET, pieces)
        return { ...state, setBonusSecret: bonus }
      }

      if (setName === 'holyKnight') {
        bonus = getSetBonusByPieces(HOLY_KNIGHT_SET, pieces)
        return { ...state, setBonusHolyKnight: bonus }
      }

      if (setName === 'rosetta') {
        bonus = getSetBonusByPieces(ROSETTA_SET, pieces)
        return { ...state, setBonusRosetta: bonus }
      }

      if (setName === 'krowazKurian') {
        bonus = getSetBonusByPieces(KURIAN_KROWAZ_KURIAN, pieces)
        return { ...state, setBonusKrowazKurian: bonus }
      }

      if (setName === 'holyKnightKurian') {
        bonus = getSetBonusByPieces(KURIAN_HOLY_KNIGHT_KURIAN, pieces)
        return { ...state, setBonusHolyKnightKurian: bonus }
      }

      return state
    }

    default:
      return state
  }
}
