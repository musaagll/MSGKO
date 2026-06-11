/**
 * Pure calculation functions for the Knight Online Advanced Calculator
 * lib/calculator/formulas.ts
 *
 * All functions are pure — they depend only on their inputs and produce
 * deterministic outputs. No side effects, no I/O.
 *
 * AP formula: Math.floor(Math.floor(0.005 * weaponAP * (stat + 40)
 *                                   + coeff * weaponAP * level * stat + 3)
 *              * bonusMultiplier) + extra
 *
 * Source: kobugda.com calculator (reverse-engineered)
 */

import type { CalculatorState, CalculatorResult, StatPoints, SetBonus } from './types'
import {
  getWarriorCoefficients,
  getRogueCoefficients,
  getPriestCoefficients,
  getMageCoefficients,
  getKurianCoefficients,
  WARRIOR_DEFENSE_SKILLS,
  WARRIOR_RESIST_SKILLS,
  KURIAN_DEFENSE_SKILLS,
  KURIAN_RESIST_SKILLS,
  AC_BUFF_VALUES,
  HP_BUFF_VALUES,
  ARMOR_ENCHANT_AC,
  GEM_DEFENSE_AC,
  GEM_LIFE_HP,
  MAGIC_SHIELD_AC,
  FROZEN_ARMOR_AC,
  FROZEN_SHELL_AC,
  ICE_BARRIER_AC,
} from './coefficients'
import { getAllSetBonuses } from './sets'

// ─── Tier helper ──────────────────────────────────────────────────────────────

/**
 * Returns the tier index used to look up AP coefficients.
 *   tier 0 → level < 10
 *   tier 1 → level 10–59
 *   tier 2 → level ≥ 60
 */
function getTier(level: number): number {
  let tier = 0
  if (level >= 10) tier++
  if (level >= 60) tier++
  return tier
}

// ─── Bonus stat helpers ───────────────────────────────────────────────────────

/**
 * Returns the total STR bonus coming from scrolls, rebirth points,
 * set bonuses, buffs, and achievements.
 *
 * Matches the original JS `bonusStr` variable:
 *   bonusStr + rebithStr + setBonusKrowaz.str + setBonusMithril.str
 *   + setBonusSecret.str + setBonusHolyKnight.str + achievement.str
 *   + setBonusRosetta.str
 * (Kurian-specific sets added in getTotalBonusStrKurian)
 */
function getTotalBonusStr(state: CalculatorState): number {
  const { buffs, bonusStatPoints, rebirthStatPoints, achievement } = state

  // Stat scrolls / buffs that add directly to STR
  let bonus = 0
  if (buffs.strScroll) bonus += 15
  if (buffs.lionScroll) bonus += 10
  if (buffs.battleCry) bonus += 15
  if (buffs.priestStr) bonus += 30 // Priest-only buff, harmless on others

  bonus +=
    bonusStatPoints.str +
    rebirthStatPoints.str +
    state.setBonusKrowaz.str +
    state.setBonusMithril.str +
    state.setBonusSecret.str +
    state.setBonusHolyKnight.str +
    achievement.str +
    state.setBonusRosetta.str

  return bonus
}

/**
 * Same as getTotalBonusStr but also includes Kurian-exclusive sets.
 * Used only for Kurian AP calculation.
 */
function getTotalBonusStrKurian(state: CalculatorState): number {
  return (
    getTotalBonusStr(state) +
    state.setBonusKrowazKurian.str +
    state.setBonusHolyKnightKurian.str
  )
}

/**
 * Returns the total DEX bonus from all sources.
 *   bonusDex + rebithDex + setBonusKrowaz.dex + setBonusMithril.dex
 *   + setBonusSecret.dex + setBonusHolyKnight.dex + achievement.dex
 *   + setBonusRosetta.dex
 */
function getTotalBonusDex(state: CalculatorState): number {
  const { buffs, bonusStatPoints, rebirthStatPoints, achievement } = state

  let bonus = 0
  if (buffs.dexScroll) bonus += 15
  if (buffs.lionScroll) bonus += 10
  if (buffs.battleCry) bonus += 15

  bonus +=
    bonusStatPoints.dex +
    rebirthStatPoints.dex +
    state.setBonusKrowaz.dex +
    state.setBonusMithril.dex +
    state.setBonusSecret.dex +
    state.setBonusHolyKnight.dex +
    achievement.dex +
    state.setBonusRosetta.dex

  return bonus
}

/**
 * Returns the total INT bonus from all sources.
 *   bonusInt + rebithInt + setBonusKrowaz.int + setBonusMithril.int
 *   + setBonusSecret.int + setBonusHolyKnight.int + achievement.int
 *   + setBonusRosetta.int
 */
function getTotalBonusInt(state: CalculatorState): number {
  const { buffs, bonusStatPoints, rebirthStatPoints, achievement } = state

  let bonus = 0
  if (buffs.intScroll) bonus += 15
  if (buffs.lionScroll) bonus += 10

  bonus +=
    bonusStatPoints.int +
    rebirthStatPoints.int +
    state.setBonusKrowaz.int +
    state.setBonusMithril.int +
    state.setBonusSecret.int +
    state.setBonusHolyKnight.int +
    achievement.int +
    state.setBonusRosetta.int

  return bonus
}

// ─── Bonus multiplier ─────────────────────────────────────────────────────────

/**
 * Computes the AP percentage multiplier.
 *
 * Rules (matches original source):
 *   - If massive OR subside is active: subtract 20 (and skip wolf / commanderDetermination / apScroll)
 *   - Otherwise: add wolf (+20), commanderDetermination (+30), apScroll (+22)
 *   - redPotion always adds +10 (even under massive/subside)
 *   - Pathos / Tattoo / Wings / Emblem damagePercentage always add
 *   - extraPercent is an additional caller-supplied percentage (e.g. berserker, priestBook)
 *
 * @returns (bonusPercent + 100) / 100
 */
function getBonusMultiplier(state: CalculatorState, extraPercent = 0): number {
  const { buffs, equipped } = state
  let bonusPercent = 0

  // Equipment damage percentages
  bonusPercent += equipped.leftPathos?.itemStat.damagePercentage ?? 0
  bonusPercent += equipped.rightPathos?.itemStat.damagePercentage ?? 0
  bonusPercent += equipped.tattoo?.itemStat.damagePercentage ?? 0
  bonusPercent += equipped.wings?.itemStat.damagePercentage ?? 0
  bonusPercent += equipped.emblem?.itemStat.damagePercentage ?? 0

  if (buffs.massive || buffs.subside) {
    bonusPercent -= 20
  } else {
    if (buffs.wolf) bonusPercent += 20
    if (buffs.commanderDetermination) bonusPercent += 30
    if (buffs.apScroll) bonusPercent += 22
  }

  if (buffs.redPotion) bonusPercent += 10
  bonusPercent += extraPercent

  return (bonusPercent + 100) / 100
}

/**
 * Priest-specific multiplier — no massive/subside guard in the original.
 * Massive/subside are NOT checked; all buffs stack freely.
 */
function getPriestBonusMultiplier(state: CalculatorState): number {
  const { buffs, equipped } = state
  let bonusPercent = 0

  bonusPercent += equipped.leftPathos?.itemStat.damagePercentage ?? 0
  bonusPercent += equipped.rightPathos?.itemStat.damagePercentage ?? 0
  bonusPercent += equipped.tattoo?.itemStat.damagePercentage ?? 0
  bonusPercent += equipped.wings?.itemStat.damagePercentage ?? 0
  bonusPercent += equipped.emblem?.itemStat.damagePercentage ?? 0

  if (buffs.wolf) bonusPercent += 20
  if (buffs.commanderDetermination) bonusPercent += 30
  if (buffs.priestBook) bonusPercent += 50
  if (buffs.priestLimitedBook) bonusPercent += 55
  if (buffs.redPotion) bonusPercent += 10
  if (buffs.apScroll) bonusPercent += 22

  return (bonusPercent + 100) / 100
}

// ─── Per-class AP calculations ────────────────────────────────────────────────

function calculateWarriorAP(state: CalculatorState): number {
  const level = Math.min(state.level, 83)
  const tier = getTier(level)

  const str = state.statPoints.str
  const totalStr = str + getTotalBonusStr(state)

  // STR > 150 grants a flat extra bonus; str === 160 loses 1 point (game quirk)
  let extra = 0
  if (str > 150) extra = str - 150
  if (str === 160) extra--

  const coeff = getWarriorCoefficients(tier, 'axe')

  let rightAP = state.equipped.rightHand?.itemStat.attackPower ?? 0
  let leftAP = state.equipped.leftHand?.itemStat.attackPower ?? 0

  if (state.buffs.weaponEnchant) {
    rightAP += 5
    if (leftAP > 0) leftAP += 3
  }

  let weaponAP = rightAP + Math.floor(leftAP * 0.5)
  if (weaponAP < 3) weaponAP = 3

  // Berserker is included in the multiplier as an extra percent
  const extraPercent = state.buffs.berserker ? 20 : 0
  const multiplier = getBonusMultiplier(state, extraPercent)

  let ap =
    Math.floor(
      Math.floor(
        0.005 * weaponAP * (totalStr + 40) + coeff * weaponAP * level * totalStr + 3
      ) * multiplier
    ) + extra

  if (state.buffs.weaponEnchant) ap += 1
  if (state.buffs.petAp) ap += 5

  return ap + state.achievement.ap
}

function calculateRogueAP(state: CalculatorState): number {
  const level = Math.min(state.level, 83)
  const tier = getTier(level)

  const dex = state.statPoints.dex
  const totalDex = dex + getTotalBonusDex(state)

  const weaponType = state.rogueSubClass === 'Archer' ? 'bow' : 'dagger'
  const coeff = getRogueCoefficients(tier, weaponType)

  let rightAP = state.equipped.rightHand?.itemStat.attackPower ?? 0
  let leftAP = state.equipped.leftHand?.itemStat.attackPower ?? 0

  if (state.buffs.weaponEnchant) {
    rightAP += 5
    if (leftAP > 0) leftAP += 3
  }

  let weaponAP: number
  if (state.rogueSubClass === 'Archer') {
    // Archer: bow is right-hand only; fall back to left if right is 0
    weaponAP = rightAP > 0 ? rightAP : leftAP
  } else {
    // Assassin: dual-wield — left contributes 50 %
    weaponAP = rightAP + Math.floor(leftAP * 0.5)
  }
  if (weaponAP < 3) weaponAP = 3

  const multiplier = getBonusMultiplier(state)

  let ap = Math.floor(
    Math.floor(
      0.005 * weaponAP * (totalDex + 40) + coeff * weaponAP * level * totalDex + 3
    ) * multiplier
  )

  if (state.buffs.weaponEnchant) ap += 1
  if (state.buffs.petAp) ap += 5

  return ap + state.achievement.ap
}

function calculatePriestAP(state: CalculatorState): number {
  const level = Math.min(state.level, 83)
  const tier = getTier(level)

  // Orijinal kaynakta: calculate_ap_priest(n, t)
  // n=true → INT build (Staff/Wand), n=false → STR build (Sword/Club)
  // Biz priestWeaponType'tan derive ediyoruz.
  const isIntBuild = false // Priest her zaman STR bazlı (kobugda'da default bu)

  const stat = isIntBuild ? state.statPoints.int : state.statPoints.str
  const totalStat = stat + (isIntBuild ? getTotalBonusInt(state) : getTotalBonusStr(state))

  let extra = 0
  if (stat > 150) extra = stat - 150
  if (stat === 160) extra--

  const weaponType =
    state.priestWeaponType === 'Club - 1H' || state.priestWeaponType === 'Club - 2H'
      ? 'club'
      : 'sword'
  const coeff = getPriestCoefficients(tier, weaponType)

  let weaponAP = state.equipped.rightHand?.itemStat.attackPower ?? 0
  if (state.buffs.weaponEnchant) weaponAP += 5
  if (weaponAP < 3) weaponAP = 3

  // Priest multiplier includes priestBook/priestLimitedBook and has no massive guard
  const multiplier = getPriestBonusMultiplier(state)

  let ap =
    Math.floor(
      Math.floor(
        0.005 * weaponAP * (totalStat + 40) + coeff * weaponAP * level * totalStat + 3
      ) * multiplier
    ) + extra

  if (state.buffs.weaponEnchant) ap += 1
  if (state.buffs.petAp) ap += 5

  return ap + state.achievement.ap
}

function calculateMageAP(state: CalculatorState): number {
  const level = Math.min(state.level, 83)
  const tier = getTier(level)

  const str = state.statPoints.str
  const totalStr = str + getTotalBonusStr(state)

  let extra = 0
  if (str > 150) extra = str - 150
  if (str === 160) extra--

  const coeff = getMageCoefficients(tier, 'staff')

  let weaponAP = state.equipped.rightHand?.itemStat.attackPower ?? 0
  if (state.buffs.weaponEnchant) weaponAP += 5
  if (weaponAP < 3) weaponAP = 3

  const multiplier = getBonusMultiplier(state)

  let ap =
    Math.floor(
      Math.floor(
        0.005 * weaponAP * (totalStr + 40) + coeff * weaponAP * level * totalStr + 3
      ) * multiplier
    ) + extra

  if (state.buffs.weaponEnchant) ap += 1
  if (state.buffs.petAp) ap += 5

  return ap + state.achievement.ap
}

function calculateKurianAP(state: CalculatorState): number {
  const level = Math.min(state.level, 83)
  const tier = getTier(level)

  const str = state.statPoints.str
  // Kurian includes its own set bonuses in the STR total
  const totalStr = str + getTotalBonusStrKurian(state)

  let extra = 0
  if (str > 150) extra = str - 150
  if (str === 160) extra--

  const coeff = getKurianCoefficients(tier, 'sword')

  // Kurian only uses right-hand weapon
  let weaponAP = state.equipped.rightHand?.itemStat.attackPower ?? 0
  if (state.buffs.weaponEnchant) weaponAP += 5
  if (weaponAP < 3) weaponAP = 3

  const multiplier = getBonusMultiplier(state)

  let ap =
    Math.floor(
      Math.floor(
        0.005 * weaponAP * (totalStr + 40) + coeff * weaponAP * level * totalStr + 3
      ) * multiplier
    ) + extra

  if (state.buffs.weaponEnchant) ap += 1
  if (state.buffs.petAp) ap += 5

  return ap + state.achievement.ap
}

// ─── Public: calculateAP ──────────────────────────────────────────────────────

/**
 * Dispatches to the correct per-class AP function and returns the result.
 * Returns 0 on any unexpected error.
 */
export function calculateAP(state: CalculatorState): number {
  try {
    switch (state.characterClass) {
      case 'Warrior': return calculateWarriorAP(state)
      case 'Rogue':   return calculateRogueAP(state)
      case 'Priest':  return calculatePriestAP(state)
      case 'Mage':    return calculateMageAP(state)
      case 'Kurian':  return calculateKurianAP(state)
      default:        return 0
    }
  } catch {
    return 0
  }
}

// ─── Public: calculateAC ──────────────────────────────────────────────────────

/**
 * Calculates total Armor Class.
 *
 * Sources (in order):
 *   1. Equipped armor base defense
 *   2. Buff bonuses (blue potion, armor enchant, frozen armor / shell / barrier, AC buff tiers)
 *   3. Pet AC
 *   4. Set bonuses + achievement
 *   5. Warrior / Kurian passive defense skill (percentage amplifier applied last)
 */
export function calculateAC(state: CalculatorState): number {
  const { buffs, equipped } = state
  const setBonus = getAllSetBonuses(state)

  let ac = 0

  // 1. Item AC — tüm slotlardan defense topla
  for (const slot of Object.values(equipped)) {
    if (slot) ac += slot.itemStat.defense ?? 0
  }

  // 2. Buff bonuses
  if (buffs.bluePotion) ac += 60
  if (buffs.armorEnchant) ac += ARMOR_ENCHANT_AC
  if (buffs.gemDefense) ac += GEM_DEFENSE_AC
  if (buffs.magicShield) ac += MAGIC_SHIELD_AC

  // Frozen armor buffs: sadece en güçlüsü uygulanır (birbirini dışlar)
  if (buffs.frozenArmor || buffs.mageFrozenArmor) {
    ac += FROZEN_ARMOR_AC
  } else if (buffs.frozenShell || buffs.mageFrozenShell) {
    ac += FROZEN_SHELL_AC
  } else if (buffs.iceBarrier || buffs.mageIceBarrier) {
    ac += ICE_BARRIER_AC
  }

  // AC Buff dropdown (id:1=OFF, 2=200, 3=300, 4=350, 5=380)
  ac += AC_BUFF_VALUES[buffs.acBuff] ?? 0

  // 3. Pet AC
  if (buffs.petAc) ac += 20

  // 4. Set bonuses + achievement
  ac += setBonus.ac
  ac += state.achievement.ac

  // 5. Passive defense skill (percentage amplifier — applies on total)
  if (state.characterClass === 'Warrior' && state.warriorDefenseSkill > 0) {
    const pct = WARRIOR_DEFENSE_SKILLS[state.warriorDefenseSkill] ?? 0
    ac = Math.floor(ac * (1 + pct / 100))
  }
  if (state.characterClass === 'Kurian' && state.kurianDefenseSkill > 0) {
    const pct = KURIAN_DEFENSE_SKILLS[state.kurianDefenseSkill] ?? 0
    ac = Math.floor(ac * (1 + pct / 100))
  }

  return Math.max(0, ac)
}

// ─── Public: calculateHP ──────────────────────────────────────────────────────

/**
 * Calculates total bonus HP (flat additions on top of base HP).
 *
 * Sources:
 *   1. All equipped-item bonusHp values (every slot)
 *   2. HP buff tiers (levels 2–4; level 5 = Undying is excluded here,
 *      handled separately in the UI)
 *   3. Pet HP
 *   4. Set bonuses + achievement
 */
export function calculateHP(state: CalculatorState): number {
  const { buffs, equipped } = state
  const setBonus = getAllSetBonuses(state)

  let hp = 0

  // 1. Item bonuses (tüm slotlardan)
  for (const slot of Object.values(equipped)) {
    if (slot) hp += slot.itemStat.bonusHp ?? 0
  }

  // 2. HP buff dropdown
  // id:2=1500, id:3=2000, id:4=Undying(60% base HP — burada sabit 2200 gösteriyoruz), id:5=2200
  if (buffs.hpBuff === 2) hp += 1500
  else if (buffs.hpBuff === 3) hp += 2000
  else if (buffs.hpBuff === 4) hp += 2200  // Undying ~60%, sabit yaklaşık değer
  else if (buffs.hpBuff === 5) hp += 2200

  // 3. Spell of Life (Priest)
  if (buffs.spellOfLife) hp += 1000

  // 4. Pet HP
  if (buffs.petHp) hp += 200

  // 5. Gem of Life
  if (buffs.gemLife) hp += GEM_LIFE_HP

  // 6. Set + achievement
  hp += setBonus.hp
  hp += state.achievement.hp

  return Math.max(0, hp)
}

// ─── Public: calculateMP ──────────────────────────────────────────────────────

/**
 * Calculates total bonus MP (flat additions on top of base MP).
 */
export function calculateMP(state: CalculatorState): number {
  const { buffs, equipped } = state
  const setBonus = getAllSetBonuses(state)

  let mp = 0

  // 1. Item bonuses
  for (const slot of Object.values(equipped)) {
    if (slot) mp += slot.itemStat.bonusMp ?? 0
  }

  // 2. Set + achievement
  mp += setBonus.mp
  mp += state.achievement.mp

  return Math.max(0, mp)
}

// ─── Public: calculateFR / calculateIR / calculateLR ─────────────────────────

/**
 * Calculates total Flame Resistance.
 *
 * Sources:
 *   1. Item resistanceFlame from all slots
 *   2. Set bonus flameres + achievement flameres
 *   3. Mage Immunity (+80 if active)
 *   4. Warrior / Kurian passive resist skill (flat addition)
 */
export function calculateFR(state: CalculatorState): number {
  const setBonus = getAllSetBonuses(state)

  let fr = 0

  for (const slot of Object.values(state.equipped)) {
    if (slot) fr += slot.itemStat.resistanceFlame ?? 0
  }

  fr += setBonus.flameres
  fr += state.achievement.flameres

  if (state.buffs.mageFR) fr += 80

  if (state.characterClass === 'Warrior' && state.warriorResistSkill > 0) {
    fr += WARRIOR_RESIST_SKILLS[state.warriorResistSkill] ?? 0
  }
  if (state.characterClass === 'Kurian' && state.kurianResistSkill > 0) {
    fr += KURIAN_RESIST_SKILLS[state.kurianResistSkill] ?? 0
  }

  return Math.max(0, fr)
}

/**
 * Calculates total Ice (Glacier) Resistance.
 *
 * Same structure as FR; uses mageIR buff and resistanceGlacier item stat.
 */
export function calculateIR(state: CalculatorState): number {
  const setBonus = getAllSetBonuses(state)

  let ir = 0

  for (const slot of Object.values(state.equipped)) {
    if (slot) ir += slot.itemStat.resistanceGlacier ?? 0
  }

  ir += setBonus.iceres
  ir += state.achievement.iceres

  if (state.buffs.mageIR) ir += 80

  if (state.characterClass === 'Warrior' && state.warriorResistSkill > 0) {
    ir += WARRIOR_RESIST_SKILLS[state.warriorResistSkill] ?? 0
  }
  if (state.characterClass === 'Kurian' && state.kurianResistSkill > 0) {
    ir += KURIAN_RESIST_SKILLS[state.kurianResistSkill] ?? 0
  }

  return Math.max(0, ir)
}

/**
 * Calculates total Lightning Resistance.
 *
 * Same structure as FR; uses mageLR buff and resistanceLighting item stat.
 */
export function calculateLR(state: CalculatorState): number {
  const setBonus = getAllSetBonuses(state)

  let lr = 0

  for (const slot of Object.values(state.equipped)) {
    if (slot) lr += slot.itemStat.resistanceLighting ?? 0
  }

  lr += setBonus.lightingres
  lr += state.achievement.lightingres

  if (state.buffs.mageLR) lr += 80

  if (state.characterClass === 'Warrior' && state.warriorResistSkill > 0) {
    lr += WARRIOR_RESIST_SKILLS[state.warriorResistSkill] ?? 0
  }
  if (state.characterClass === 'Kurian' && state.kurianResistSkill > 0) {
    lr += KURIAN_RESIST_SKILLS[state.kurianResistSkill] ?? 0
  }

  return Math.max(0, lr)
}

// ─── Public: recalculate ──────────────────────────────────────────────────────

/**
 * Runs all calculations and returns a CalculatorResult snapshot.
 * This is the main entry point called by the reducer / useMemo hook.
 */
export function recalculate(state: CalculatorState): CalculatorResult {
  const freeStatPoints = state.totalPoints - state.usedPoints
  const freeRebirthPoints = state.totalRebirthPoints - state.usedRebirthPoints

  try {
    return {
      ap: calculateAP(state),
      ac: calculateAC(state),
      hp: calculateHP(state),
      mp: calculateMP(state),
      fr: calculateFR(state),
      ir: calculateIR(state),
      lr: calculateLR(state),
      freeStatPoints: Math.max(0, freeStatPoints),
      freeRebirthPoints: Math.max(0, freeRebirthPoints),
    }
  } catch {
    return {
      ap: 0,
      ac: 0,
      hp: 0,
      mp: 0,
      fr: 0,
      ir: 0,
      lr: 0,
      freeStatPoints: Math.max(0, freeStatPoints),
      freeRebirthPoints: Math.max(0, freeRebirthPoints),
    }
  }
}
