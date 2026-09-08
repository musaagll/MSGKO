/**
 * Knight Online — Önemli Skill'ler
 * Sınıf başına kritik skilllar, SEO verisi ile
 */

import type { Skill } from '@/lib/types'

export type SkillSeedData = Omit<Skill, 'id' | 'updated_at' | 'created_at'>

export const KO_SKILLS: SkillSeedData[] = [
  // ── Rogue / Asas ──────────────────────────────────────────────────────────
  {
    slug: 'crit-strike',
    name: 'Critical Strike',
    name_en: 'Critical Strike',
    character_class: 'rogue',
    skill_type: 'active',
    element: 'none',
    max_level: 10,
    levels: [
      { level: 1, damage: 120, mp_cost: 30, cooldown: 3, required_level: 10 },
      { level: 5, damage: 180, mp_cost: 50, cooldown: 3, required_level: 30 },
      { level: 10, damage: 260, mp_cost: 80, cooldown: 3, required_level: 60 },
    ],
    description:
      `Critical Strike (CS), asas sınıfının temel hasar skilidir. Yüksek kritik vuruş hasarı verir. Combonun vazgeçilmez parçasıdır.`,
    content:
      `## Critical Strike\n\nAsas combosunun temel taşı. CS, düşmana yüksek kritik vuruş hasarı verir.\n\n## Nasıl Kullanılır?\n\nCS, combo başında veya sonunda kullanılır. Rakibin HP'si hızla düşer. Mortal Blow ile birlikte kullanıldığında maksimum etki sağlanır.\n\n## Max Level'de ne kadar hasar verir?\n\nMax levelda 260 baz hasar verir. STR'ye göre bu değer artabilir.`,
    seo_title: 'Knight Online Critical Strike | Asas Skill Rehberi | MSGKO',
    seo_description:
      'Knight Online Critical Strike asas skili rehberi. CS nasıl kullanılır, combo içindeki yeri, max level hasar bilgisi.',
    seo_keywords: [
      'critical strike', 'cs', 'knight online cs', 'asas cs', 'asas critical strike',
      'asas combo', 'rogue skill',
    ],
    icon_url: null,
    is_published: true,
    sort_order: 1,
  },
  {
    slug: 'mortal-blow',
    name: 'Mortal Blow',
    name_en: 'Mortal Blow',
    character_class: 'rogue',
    skill_type: 'active',
    element: 'none',
    max_level: 10,
    levels: [
      { level: 1, damage: 150, mp_cost: 40, cooldown: 5, required_level: 20 },
      { level: 5, damage: 230, mp_cost: 65, cooldown: 5, required_level: 40 },
      { level: 10, damage: 320, mp_cost: 95, cooldown: 5, required_level: 70 },
    ],
    description:
      `Mortal Blow, asasın en güçlü tek vuruş skilidir. Combonun en kritik noktasında kullanılır ve düşmana büyük hasar verir.`,
    content:
      `## Mortal Blow\n\nAsas combosunun en kritik skili. Yüksek tek vuruş hasarıyla düşmanı bitirmeye yarar.\n\n## Combo İçindeki Yeri\n\nMortal Blow, genellikle combonun sonunda kullanılır. Öncesinde CS ve Stab ile rakibin HP'si düşürülür.`,
    seo_title: 'Knight Online Mortal Blow | Asas Skill Rehberi | MSGKO',
    seo_description:
      'Knight Online Mortal Blow asas skili. Combo içindeki yeri, nasıl kullanılır, max level hasar değeri.',
    seo_keywords: [
      'mortal blow', 'knight online mortal blow', 'asas mortal blow',
      'asas combo', 'rogue skill',
    ],
    icon_url: null,
    is_published: true,
    sort_order: 2,
  },
  {
    slug: 'stun',
    name: 'Stun',
    name_en: 'Stun',
    character_class: 'rogue',
    skill_type: 'debuff',
    element: 'none',
    max_level: 5,
    levels: [
      { level: 1, mp_cost: 25, cooldown: 8, required_level: 15, description: '1 sn stun' },
      { level: 5, mp_cost: 45, cooldown: 8, required_level: 50, description: '3 sn stun' },
    ],
    description:
      `Stun, asasın rakibini geçici olarak hareketsiz bırakan kritik kontrol skilidir. PK'da combo başlamadan önce uygulanır.`,
    content:
      `## Stun\n\nRakibi 1-3 saniye hareketsiz bırakır. Bu sürede daha yüksek hasar alır ve kaçamaz.\n\n## PK'da Kullanımı\n\nStun → CS → Mortal Blow combo sırası klasik asas combosudur.`,
    seo_title: 'Knight Online Stun | Asas Kontrol Skili Rehberi | MSGKO',
    seo_description:
      'Knight Online Stun asas skili. Nasıl kullanılır, combo içindeki yeri, PK taktikleri.',
    seo_keywords: [
      'stun', 'knight online stun', 'asas stun', 'rogue stun', 'asas kontrol skili',
    ],
    icon_url: null,
    is_published: true,
    sort_order: 3,
  },

  // ── Warrior ────────────────────────────────────────────────────────────────
  {
    slug: 'charge',
    name: 'Charge',
    name_en: 'Charge',
    character_class: 'warrior',
    skill_type: 'active',
    element: 'none',
    max_level: 10,
    levels: [
      { level: 1, damage: 100, mp_cost: 35, cooldown: 6, required_level: 10 },
      { level: 10, damage: 300, mp_cost: 90, cooldown: 6, required_level: 60 },
    ],
    description:
      `Charge, warrior sınıfının temel saldırı skilidir. Hedefe hızla yaklaşarak yüksek hasar verir.`,
    content:
      `## Charge\n\nWarrior'ın vazgeçilmez saldırı skili. Hedefe koşarak saldırır ve yüksek hasar verir.\n\n## Combo İçindeki Yeri\n\nCharge ile başlayan warrior combosu en yaygın PvP ve PvE stratejisidir.`,
    seo_title: 'Knight Online Charge | Warrior Skili Rehberi | MSGKO',
    seo_description:
      'Knight Online Charge warrior skili. Nasıl kullanılır, combo içindeki yeri, max level hasar.',
    seo_keywords: [
      'charge', 'knight online charge', 'warrior charge', 'warrior skill', 'warrior combo',
    ],
    icon_url: null,
    is_published: true,
    sort_order: 10,
  },

  // ── Mage ──────────────────────────────────────────────────────────────────
  {
    slug: 'nova-strike',
    name: 'Nova Strike',
    name_en: 'Nova Strike',
    character_class: 'mage',
    skill_type: 'active',
    element: 'none',
    max_level: 10,
    levels: [
      { level: 1, damage: 200, mp_cost: 80, cooldown: 4, required_level: 20 },
      { level: 10, damage: 600, mp_cost: 200, cooldown: 4, required_level: 70 },
    ],
    description:
      `Nova Strike, mage sınıfının en güçlü AOE (alan etkili) skilidir. Geniş alana yüksek hasar verir.`,
    content:
      `## Nova Strike\n\nMage'in en güçlü AOE skili. Geniş alan hasarıyla birden fazla düşmana aynı anda büyük hasar verir.\n\n## Kullanım Alanı\n\nFarm ve PvE'de son derece etkilidir. PvP'de ise toplu düşman grubuna karşı kullanılır.`,
    seo_title: 'Knight Online Nova Strike | Mage AOE Skili Rehberi | MSGKO',
    seo_description:
      'Knight Online Nova Strike mage AOE skili. Nasıl kullanılır, hasar değerleri, farm ve PvP stratejisi.',
    seo_keywords: [
      'nova strike', 'knight online nova strike', 'mage aoe', 'mage skill', 'mage combo',
    ],
    icon_url: null,
    is_published: true,
    sort_order: 20,
  },

  // ── Priest ────────────────────────────────────────────────────────────────
  {
    slug: 'divine-heal',
    name: 'Divine Heal',
    name_en: 'Divine Heal',
    character_class: 'priest',
    skill_type: 'buff',
    element: 'light',
    max_level: 10,
    levels: [
      { level: 1, mp_cost: 50, cooldown: 2, required_level: 10, description: '500 HP iyileştirir' },
      { level: 10, mp_cost: 150, cooldown: 2, required_level: 60, description: '2500 HP iyileştirir' },
    ],
    description:
      `Divine Heal, priest sınıfının ana heal skilidir. Grubun temel hayatta kalma kaynağıdır.`,
    content:
      `## Divine Heal\n\nPriest'in en önemli heal skili. Grubun HP'sini hızla toplar.\n\n## Kullanım Stratejisi\n\nDungeon ve boss runlarında priest'in heal önceliği çok kritiktir. Divine Heal her zaman hazır tutulmalıdır.`,
    seo_title: 'Knight Online Divine Heal | Priest Skili Rehberi | MSGKO',
    seo_description:
      'Knight Online Divine Heal priest skili. Heal miktarı, mana maliyeti, dungeon ve boss runlarında kullanım stratejisi.',
    seo_keywords: [
      'divine heal', 'knight online divine heal', 'priest heal', 'priest skill',
      'heal skill', 'knight online heal',
    ],
    icon_url: null,
    is_published: true,
    sort_order: 30,
  },

  // ── Archer ────────────────────────────────────────────────────────────────
  {
    slug: 'rapid-fire',
    name: 'Rapid Fire',
    name_en: 'Rapid Fire',
    character_class: 'archer',
    skill_type: 'active',
    element: 'none',
    max_level: 10,
    levels: [
      { level: 1, damage: 90, mp_cost: 25, cooldown: 3, required_level: 10 },
      { level: 10, damage: 280, mp_cost: 70, cooldown: 3, required_level: 60 },
    ],
    description:
      `Rapid Fire, okçu sınıfının hızlı ok atış skilidir. Kısa aralıklarla birden fazla ok atar.`,
    content:
      `## Rapid Fire\n\nOkçunun temel hasar skili. Hızlı ardışık ok atışlarıyla sürekli hasar verir.\n\n## Combo İçindeki Yeri\n\nRapid Fire, okçu combosunun omurgasını oluşturur.`,
    seo_title: 'Knight Online Rapid Fire | Okçu Skili Rehberi | MSGKO',
    seo_description:
      'Knight Online Rapid Fire okçu skili. Hasar değerleri, combo içindeki yeri ve PvP kullanımı.',
    seo_keywords: [
      'rapid fire', 'knight online rapid fire', 'okçu skill', 'archer skill',
      'okçu combo', 'archer combo',
    ],
    icon_url: null,
    is_published: true,
    sort_order: 40,
  },
]

/** Slug'a göre skill verisini döndürür */
export function getSkillBySlug(slug: string): SkillSeedData | undefined {
  return KO_SKILLS.find((s) => s.slug === slug)
}

/** Sınıfa göre skill listesi */
export function getSkillsByClass(cls: string): SkillSeedData[] {
  return KO_SKILLS.filter((s) => s.character_class === cls && s.is_published)
}

/** Tüm yayınlanan skill slug'larını döndürür */
export function getPublishedSkillSlugs(): string[] {
  return KO_SKILLS.filter((s) => s.is_published).map((s) => s.slug)
}
