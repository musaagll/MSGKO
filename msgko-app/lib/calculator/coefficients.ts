/**
 * Knight Online AP formula coefficient lookup tables
 * lib/calculator/coefficients.ts
 *
 * Formula: AP = floor(floor(0.005*weapon*(stat+40) + c*weapon*level*stat + 3) * multiplier)
 *
 * Tier system:
 *   tier 0 → level < 10
 *   tier 1 → level 10–59
 *   tier 2 → level ≥ 60
 *
 * Source: kobugda.com calculator source code (reverse-engineered)
 */

// ─── Coefficient Tables ───────────────────────────────────────────────────────
// Bu değerler kobugda.com kaynak kodundan (advancedcalc dosyası) alınmıştır.
// getRogueCoefficients, getWarriorCoefficients vb. fonksiyonlar orjinal JS'den gelir.

const COEFFICIENTS = {
  warrior: {
    axe:    [0.0007, 0.00080, 0.00090] as const,
  },
  rogue: {
    dagger: [0.0006, 0.00075, 0.00085] as const,
    bow:    [0.0006, 0.00075, 0.00085] as const,
  },
  priest: {
    sword:  [0.0006, 0.00070, 0.00080] as const,
    club:   [0.0006, 0.00070, 0.00080] as const,
  },
  mage: {
    staff:  [0.0006, 0.00070, 0.00080] as const,
  },
  kurian: {
    sword:  [0.0007, 0.00080, 0.00090] as const,
  },
} as const

// ─── Coefficient Accessors ────────────────────────────────────────────────────

export function getWarriorCoefficients(tier: number, weaponType: 'axe'): number {
  return COEFFICIENTS.warrior[weaponType][tier] ?? COEFFICIENTS.warrior[weaponType][0]
}

export function getRogueCoefficients(tier: number, weaponType: 'dagger' | 'bow'): number {
  return COEFFICIENTS.rogue[weaponType][tier] ?? COEFFICIENTS.rogue[weaponType][0]
}

export function getPriestCoefficients(tier: number, weaponType: 'sword' | 'club'): number {
  return COEFFICIENTS.priest[weaponType][tier] ?? COEFFICIENTS.priest[weaponType][0]
}

export function getMageCoefficients(tier: number, weaponType: 'staff'): number {
  return COEFFICIENTS.mage[weaponType][tier] ?? COEFFICIENTS.mage[weaponType][0]
}

export function getKurianCoefficients(tier: number, weaponType: 'sword'): number {
  return COEFFICIENTS.kurian[weaponType][tier] ?? COEFFICIENTS.kurian[weaponType][0]
}

// ─── Passive Defense Skill Constants ─────────────────────────────────────────

/**
 * Warrior Defense Skill — AC % bonus (index = skill id, 0 = no skill)
 * Kaynak: warriorDefenseDropDown → Hinder 10%, Arrest 15%, Bulwark 20%, Evading 25%, Iron skin 30%, Iron body 40%
 */
export const WARRIOR_DEFENSE_SKILLS = [0, 10, 15, 20, 25, 30, 40] as const

/**
 * Warrior Resist Skill — resistance flat bonus per element (index = skill id)
 * Kaynak: warriorResistDropDown → Resist 30%, Endure 60%, Immunity 90%
 * Orijinalde yüzde olarak uygulanıyor; biz flat bonus olarak tutuyoruz.
 */
export const WARRIOR_RESIST_SKILLS = [0, 30, 60, 90] as const

/**
 * Kurian Defense Skill — AC % bonus
 * Kaynak: kurianDefenseDropDown → Hinder 5%, Arrest 8%, Bulwark 10%, Evading 13%, Iron skin 15%, Iron linker 20%
 */
export const KURIAN_DEFENSE_SKILLS = [0, 5, 8, 10, 13, 15, 20] as const

/**
 * Kurian Resist Skill — resistance flat bonus (by 15, by 30, by 45)
 */
export const KURIAN_RESIST_SKILLS = [0, 15, 30, 45] as const

// ─── Buff Constants ───────────────────────────────────────────────────────────

/**
 * AC buff dropdown değerleri — orijinal ID eşlemesi:
 * id:1=OFF, id:4=200, id:2=300, id:3=350, id:5=380
 * Bizim state'de 1=OFF, 2=200, 3=300, 4=350, 5=380 olarak tutuyoruz
 */
export const AC_BUFF_VALUES: Record<number, number> = {
  1: 0,
  2: 200,
  3: 300,
  4: 350,
  5: 380,
}

/**
 * HP buff dropdown değerleri:
 * id:1=OFF, id:2=1500, id:3=2000, id:4=60%(Undying), id:5=2200
 * Orijinalle aynı sıra
 */
export const HP_BUFF_VALUES: Record<number, number> = {
  1: 0,
  2: 1500,
  3: 2000,
  4: 0,    // 4 = 60% Undying — base HP'nin %60'ı, dinamik hesap
  5: 2200,
}

/**
 * Armor Enchant Scroll: tam değer bilinmiyor, yaklaşık +15 AC
 */
export const ARMOR_ENCHANT_AC = 15

/**
 * Gem of Defense: +50 AC bonus
 */
export const GEM_DEFENSE_AC = 50

/**
 * Gem of Life: +200 HP bonus
 */
export const GEM_LIFE_HP = 200

/**
 * Magic Shield (Mage): +100 AC
 */
export const MAGIC_SHIELD_AC = 100

/**
 * Frozen Armor AC değerleri (Priest ve Mage için aynı):
 * Frozen Armor → +60 AC
 * Frozen Shell → +120 AC
 * Ice Barrier  → +180 AC
 */
export const FROZEN_ARMOR_AC  = 60
export const FROZEN_SHELL_AC  = 120
export const ICE_BARRIER_AC   = 180
