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
 * Source: kobugda.com calculator source code
 */

// ─── Coefficient Tables ───────────────────────────────────────────────────────

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

/**
 * Returns the `c` coefficient for a Warrior at the given tier.
 * @param tier  0 (level<10), 1 (level 10-59), 2 (level≥60)
 * @param weaponType  Warrior weapon type — always 'axe'
 */
export function getWarriorCoefficients(tier: number, weaponType: 'axe'): number {
  return COEFFICIENTS.warrior[weaponType][tier] ?? COEFFICIENTS.warrior[weaponType][0]
}

/**
 * Returns the `c` coefficient for a Rogue at the given tier.
 * @param tier  0 (level<10), 1 (level 10-59), 2 (level≥60)
 * @param weaponType  'dagger' (Assassin) or 'bow' (Archer)
 */
export function getRogueCoefficients(tier: number, weaponType: 'dagger' | 'bow'): number {
  return COEFFICIENTS.rogue[weaponType][tier] ?? COEFFICIENTS.rogue[weaponType][0]
}

/**
 * Returns the `c` coefficient for a Priest at the given tier.
 * @param tier  0 (level<10), 1 (level 10-59), 2 (level≥60)
 * @param weaponType  'sword' or 'club'
 */
export function getPriestCoefficients(tier: number, weaponType: 'sword' | 'club'): number {
  return COEFFICIENTS.priest[weaponType][tier] ?? COEFFICIENTS.priest[weaponType][0]
}

/**
 * Returns the `c` coefficient for a Mage at the given tier.
 * @param tier  0 (level<10), 1 (level 10-59), 2 (level≥60)
 * @param weaponType  Mage weapon type — always 'staff'
 */
export function getMageCoefficients(tier: number, weaponType: 'staff'): number {
  return COEFFICIENTS.mage[weaponType][tier] ?? COEFFICIENTS.mage[weaponType][0]
}

/**
 * Returns the `c` coefficient for a Kurian at the given tier.
 * @param tier  0 (level<10), 1 (level 10-59), 2 (level≥60)
 * @param weaponType  Kurian weapon type — always 'sword'
 */
export function getKurianCoefficients(tier: number, weaponType: 'sword'): number {
  return COEFFICIENTS.kurian[weaponType][tier] ?? COEFFICIENTS.kurian[weaponType][0]
}

// ─── Passive Skill Constants ──────────────────────────────────────────────────

/**
 * Warrior Defense Skill AC bonus percentages.
 * Index corresponds to skill id (0 = no skill).
 */
export const WARRIOR_DEFENSE_SKILLS = [0, 10, 15, 20, 25, 30, 40] as const

/**
 * Warrior Resist Skill resistance bonuses.
 * Index corresponds to skill id (0 = no skill).
 */
export const WARRIOR_RESIST_SKILLS = [0, 30, 60, 90] as const

/**
 * Kurian Defense Skill AC bonus percentages.
 * Index corresponds to skill id (0 = no skill).
 */
export const KURIAN_DEFENSE_SKILLS = [0, 5, 8, 10, 13, 15, 20] as const

/**
 * Kurian Resist Skill resistance bonuses.
 * Index corresponds to skill id (0 = no skill).
 */
export const KURIAN_RESIST_SKILLS = [0, 15, 30, 45] as const

// ─── Buff Constants ───────────────────────────────────────────────────────────

/**
 * AC buff level → AC bonus value mapping.
 * Key 1 = OFF (no buff), keys 2–5 correspond to buff tiers.
 */
export const AC_BUFF_VALUES: Record<number, number> = {
  1: 0,
  2: 200,
  3: 300,
  4: 350,
  5: 380,
}

/**
 * HP buff level → HP bonus value mapping.
 * Key 1 = OFF, key 5 = Undying (60% of max HP — handled separately).
 */
export const HP_BUFF_VALUES: Record<number, number> = {
  1: 0,
  2: 1500,
  3: 2000,
  4: 2200,
  5: 0, // 5 = Undying — grants 60% of max HP, calculated dynamically
}

/**
 * Flat AC bonus granted by an Armor Enchant Scroll (estimated).
 */
export const ARMOR_ENCHANT_AC = 15
