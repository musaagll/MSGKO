/**
 * Calculator-specific TypeScript types
 * lib/calculator/types.ts
 */

// ─── Character Class ─────────────────────────────────────────────────────────

export type CharacterClass = 'Warrior' | 'Rogue' | 'Priest' | 'Mage' | 'Kurian'

// ─── Stat Points ─────────────────────────────────────────────────────────────

export interface StatPoints {
  str: number
  dex: number
  hp: number
  mp: number
  int: number
}

// ─── Equipment ───────────────────────────────────────────────────────────────

export interface ItemStat {
  attackPower?: number
  attackSpeed?: number
  effectiveRange?: number
  weight?: number
  durability?: number
  defense?: number
  poisonDamage?: number
  glacierDamage?: number
  flameDamage?: number
  lightingDamage?: number
  damagePercentage?: number
  defensePercentage?: number
  damageAgainstClass?: boolean
  bonusHealth?: number
  bonusStrength?: number
  bonusDexterity?: number
  bonusMagicPower?: number
  bonusIntelligence?: number
  bonusHp?: number
  bonusMp?: number
  resistanceFlame?: number
  resistanceGlacier?: number
  resistanceLighting?: number
  resistancePoison?: number
  resistanceDark?: number
  resistanceMagic?: number
  requiredLevel?: number
  requiredStr?: number
  requiredDex?: number
  requiredMagicPower?: number
  requiredInt?: number
  requiredHealth?: number
  canChangeStatBonus?: boolean
  canChangeShieldBonus?: boolean
  canChangeRecovery?: boolean
}

export interface EquippedItem {
  itemStat: ItemStat
}

export interface EquippedItems {
  rightHand: EquippedItem | null
  leftHand: EquippedItem | null
  armor: EquippedItem | null
  accessory: EquippedItem | null
  leftPathos: EquippedItem | null
  rightPathos: EquippedItem | null
  tattoo: EquippedItem | null
  wings: EquippedItem | null
  emblem: EquippedItem | null
}

// ─── Buff State ───────────────────────────────────────────────────────────────

export interface BuffState {
  // Stat Scrolls
  strScroll: boolean       // +15 STR
  dexScroll: boolean       // +15 DEX
  hpScroll: boolean        // +15 HP
  mpScroll: boolean        // +15 MP
  intScroll: boolean       // +15 INT
  lionScroll: boolean      // +10 all stats

  // AP Buffs
  wolf: boolean                        // +20% AP
  apScroll: boolean                    // +22% AP
  redPotion: boolean                   // +10% AP
  weaponEnchant: boolean               // +5 weapon AP, +1 AP
  berserker: boolean                   // +20% AP (Warrior only)
  commanderDetermination: boolean      // +30% AP

  // AC Buffs
  bluePotion: boolean      // +60 AC
  armorEnchant: boolean    // AC bonus
  frozenArmor: boolean     // +60 AC
  frozenShell: boolean     // +120 AC
  iceBarrier: boolean      // +180 AC
  acBuff: number           // 1=OFF, 2=200, 3=300, 4=350, 5=380
  gemDefense: boolean      // AC bonus
  magicShield: boolean     // Mage

  // HP Buffs
  hpBuff: number           // 1=OFF, 2=1500, 3=2000, 4=60%, 5=2200
  spellOfLife: boolean     // HP buff
  gemLife: boolean         // HP bonus

  // Class-Specific Buffs
  battleCry: boolean           // +15 all stats (Warrior buff)
  priestBook: boolean          // +50% AP
  priestLimitedBook: boolean   // +55% AP
  priestStr: boolean           // +30 STR (Priest only)

  // Mage Immunity
  mageFR: boolean              // +80 FR
  mageIR: boolean              // +80 IR
  mageLR: boolean              // +80 LR
  mageFrozenArmor: boolean     // AC (Mage)
  mageFrozenShell: boolean     // AC (Mage)
  mageIceBarrier: boolean      // AC (Mage)

  // Debuffs
  malice: boolean
  torment: boolean
  parasite: boolean
  superParasite: boolean
  confusion: boolean           // -30 MP
  massive: boolean             // -20% AP
  subside: boolean             // -20% AP

  // Pet Buffs
  petHp: boolean               // +200 HP
  petAc: boolean               // +20 AC
  petAp: boolean               // +5 AP
}

// ─── Set Bonus ────────────────────────────────────────────────────────────────

export interface SetBonus {
  str: number
  dex: number
  hp: number
  mp: number
  int: number
  ac: number
  flameres: number
  iceres: number
  lightingres: number
  ap: number
}

// ─── Achievement Bonus ────────────────────────────────────────────────────────

export interface AchievementBonus {
  ap: number
  ac: number
  str: number
  dex: number
  hp: number
  mp: number
  int: number
  flameres: number
  iceres: number
  lightingres: number
}

// ─── Calculator State ─────────────────────────────────────────────────────────

export interface CalculatorState {
  // Class & Level
  characterClass: CharacterClass
  rogueSubClass: 'Assassin' | 'Archer'
  levelId: number
  level: number
  rebirthLevel: number

  // Stat Points
  statPoints: StatPoints
  rebirthStatPoints: StatPoints
  bonusStatPoints: StatPoints
  totalPoints: number
  usedPoints: number
  totalRebirthPoints: number
  usedRebirthPoints: number

  // Equipment
  equipped: EquippedItems
  itemStat: ItemStat | null

  // Buffs
  buffs: BuffState

  // Set Bonuses
  setBonusKrowaz: SetBonus
  setBonusMithril: SetBonus
  setBonusSecret: SetBonus
  setBonusHolyKnight: SetBonus
  setBonusRosetta: SetBonus
  setBonusKrowazKurian: SetBonus
  setBonusHolyKnightKurian: SetBonus

  // Achievement
  achievement: AchievementBonus

  // Passive Skills
  warriorDefenseSkill: number    // 0–6
  warriorResistSkill: number     // 0–3
  kurianDefenseSkill: number     // 0–6
  kurianResistSkill: number      // 0–3
  priestWeaponType: string       // 'Sword' | 'Club - 1H' | 'Club - 2H'
}

// ─── Calculator Result ────────────────────────────────────────────────────────

export interface CalculatorResult {
  ap: number
  ac: number
  hp: number
  mp: number
  fr: number    // flame resistance
  ir: number    // ice resistance
  lr: number    // lighting resistance
  freeStatPoints: number
  freeRebirthPoints: number
}
