/**
 * Knight Online — Örnek Item'lar
 * Gerçek item database için parse-ko-items.js çıktısı kullanılacak.
 * Şimdilik SEO altyapısını test etmek için kapsamlı örnek set.
 */

import type { KOItem } from '@/lib/types'

export type ItemSeedData = Omit<KOItem, 'id' | 'view_count' | 'updated_at' | 'created_at'>

export const KO_ITEMS: ItemSeedData[] = [
  // ── Warrior Silahları ──────────────────────────────────────────────────────

  {
    slug: 'raptor',
    name: 'Raptor',
    name_en: 'Raptor',
    item_type: 'weapon',
    sub_type: 'spear',
    character_class: ['warrior'],
    race: 'all',
    base_stats: { ap: 165, ap_range: 12 },
    bonus_stats: [
      { stat: 'str', value: 8, type: 'flat' },
    ],
    item_grade: 'unique',
    min_level: 70,
    upgrade_max: 9,
    drop_info: [
      { mob_slug: 'felankor', mob_name: 'Felankor', map_slug: 'ronark-land', drop_rate: '%3' },
      { mob_slug: 'isiloon', mob_name: 'Isiloon', map_slug: 'ronark-land', drop_rate: '%2' },
    ],
    obtain_methods: [
      { type: 'boss', source: 'Felankor', source_slug: 'felankor' },
      { type: 'boss', source: 'Isiloon', source_slug: 'isiloon' },
    ],
    description:
      'Raptor, Knight Online\'ın warrior sınıfı için en prestijli mızrak silahlarından biridir. Yüksek AP değeri ve STR bonusuyla PvP ve PvE\'de üst düzey performans sağlar. +8 ve +9 versiyonları oyunun en değerli item\'ları arasındadır.',
    content:
      '## Raptor Nedir?\n\nRaptor, Knight Online\'ın warrior sınıfına özel güçlü bir mızrak (spear) silahıdır. Benzersiz görünümü ve yüksek AP değeriyle öne çıkar.\n\n## Özellikleri\n\n- Taban AP: 165\n- STR Bonusu: +8\n- Minimum Level: 70\n- Sınıf: Warrior\n\n## Raptor Nereden Düşer?\n\nRaptor, Felankor ve Isiloon gibi CZ world boss\'larından düşebilir. Drop oranı düşük olduğundan değerli bir item\'dır.\n\n## Raptor Upgrade Rehberi\n\n+7\'ye kadar upgrade başarı oranı makul seviyededir. +8 ve +9 için yüksek upgrade materyali gerekir. Upgrade başarısız olursa item düşebilir veya kaybolabilir — dikkatli olun.\n\n## Raptor vs Diğer Mızraklar\n\nRaptor, aynı slot\'taki diğer mızraklara kıyasla STR bonusu sayesinde daha yüksek fiziksel hasar sağlar.',
    seo_title: 'Knight Online Raptor | Özellikleri, Drop ve Upgrade Rehberi | MSGKO',
    seo_description:
      'Knight Online Raptor mızrak rehberi. Raptor nereden düşer, özellikleri neler, nasıl upgrade edilir, hangi karakter kullanır. Warrior için en iyi mızrak hakkında tam bilgi.',
    seo_keywords: [
      'raptor', 'knight online raptor', 'raptor drop', 'raptor nereden düşer',
      'raptor özellikleri', 'raptor upgrade', 'raptor +8', 'raptor +9',
      'knight online mızrak', 'warrior mızrak',
    ],
    image_url: null,
    icon_url: null,
    is_published: true,
    sort_order: 1,
  },

  // ── Rogue / Asas Silahları ─────────────────────────────────────────────────

  {
    slug: 'dual-blade',
    name: 'Dual Blade',
    name_en: 'Dual Blade',
    item_type: 'weapon',
    sub_type: 'dagger',
    character_class: ['rogue'],
    race: 'all',
    base_stats: { ap: 85, ap_range: 10 },
    bonus_stats: [
      { stat: 'dex', value: 5, type: 'flat' },
    ],
    item_grade: 'unique',
    min_level: 60,
    upgrade_max: 9,
    drop_info: [
      { mob_slug: 'isiloon', mob_name: 'Isiloon', map_slug: 'ronark-land', drop_rate: '%5' },
    ],
    obtain_methods: [
      { type: 'boss', source: 'Isiloon', source_slug: 'isiloon' },
    ],
    description:
      'Dual Blade, asas sınıfı için yüksek hız ve DEX bonusuyla öne çıkan çift bıçak silahıdır. Combo odaklı oynanışta çok etkilidir.',
    content:
      '## Dual Blade Nedir?\n\nDual Blade, asas (rogue) sınıfının kullanabileceği çift bıçak silahıdır. Yüksek saldırı hızı ve DEX bonusuyla combo odaklı oynanışta çok etkilidir.\n\n## Özellikleri\n\n- Taban AP: 85 (çift)\n- DEX Bonusu: +5\n- Minimum Level: 60\n- Sınıf: Rogue/Asas\n\n## Nereden Düşer?\n\nIsiloon boss\'undan düşebilir.',
    seo_title: 'Knight Online Dual Blade | Asas Silahı Drop ve Rehber | MSGKO',
    seo_description:
      'Knight Online Dual Blade asas silahı. Özellikleri, nereden düşer, nasıl upgrade edilir. Rogue için en iyi bıçak rehberi.',
    seo_keywords: [
      'dual blade', 'knight online dual blade', 'asas silahı', 'rogue silah',
      'dual blade drop', 'dual blade upgrade',
    ],
    image_url: null,
    icon_url: null,
    is_published: true,
    sort_order: 10,
  },

  // ── Mage Silahları ─────────────────────────────────────────────────────────

  {
    slug: 'chitins-staff',
    name: 'Chitins Staff',
    name_en: 'Chitin Staff',
    item_type: 'weapon',
    sub_type: 'staff',
    character_class: ['mage', 'priest'],
    race: 'all',
    base_stats: { ap: 90, ap_range: 15, mp: 300 },
    bonus_stats: [
      { stat: 'int', value: 10, type: 'flat' },
      { stat: 'mp', value: 200, type: 'flat' },
    ],
    item_grade: 'unique',
    min_level: 65,
    upgrade_max: 9,
    drop_info: [
      { mob_slug: 'apostle-of-god', mob_name: 'Apostle of God', map_slug: 'ronark-land', drop_rate: '%8' },
    ],
    obtain_methods: [
      { type: 'boss', source: 'Apostle of God', source_slug: 'apostle-of-god' },
    ],
    description:
      'Chitins Staff, mage ve priest sınıfları için yüksek INT ve MP bonusuyla güçlü bir asa silahıdır.',
    content:
      '## Chitins Staff\n\nMage ve Priest için en güçlü asalardan biri. INT ve MP bonusları ile büyü gücünü önemli ölçüde artırır.\n\n## Özellikleri\n\n- Taban AP: 90\n- INT Bonusu: +10\n- MP Bonusu: +200\n- Minimum Level: 65',
    seo_title: 'Knight Online Chitins Staff | Mage Silahı Drop ve Rehber | MSGKO',
    seo_description:
      'Knight Online Chitins Staff mage/priest asası. Özellikleri, nereden düşer, nasıl upgrade edilir.',
    seo_keywords: [
      'chitins staff', 'knight online chitins staff', 'mage silahı',
      'chitins staff drop', 'chitins staff upgrade',
    ],
    image_url: null,
    icon_url: null,
    is_published: true,
    sort_order: 20,
  },

  // ── Zırhlar ────────────────────────────────────────────────────────────────

  {
    slug: 'chitin-shell-helmet',
    name: 'Chitin Shell Helmet',
    name_en: 'Chitin Shell Helmet',
    item_type: 'helmet',
    sub_type: null,
    character_class: ['warrior', 'rogue'],
    race: 'all',
    base_stats: { ac: 85, hp: 200 },
    bonus_stats: [
      { stat: 'str', value: 5, type: 'flat' },
    ],
    item_grade: 'unique',
    min_level: 60,
    upgrade_max: 9,
    drop_info: [
      { mob_name: 'Çeşitli CZ Mobları', map_slug: 'ronark-land', drop_rate: 'Düşük' },
    ],
    obtain_methods: [
      { type: 'drop', source: 'CZ Mobları' },
    ],
    description:
      'Chitin Shell Helmet, warrior ve rogue için güçlü bir kask. Yüksek AC ve HP bonusuyla dayanıklılığı artırır.',
    content:
      '## Chitin Shell Helmet\n\nWarrior ve Rogue için AC ve HP bonuslu güçlü bir kask.\n\n## Özellikleri\n\n- Taban AC: 85\n- HP Bonusu: +200\n- STR Bonusu: +5',
    seo_title: 'Knight Online Chitin Shell Helmet | Zırh Rehberi | MSGKO',
    seo_description:
      'Knight Online Chitin Shell Helmet kaskı. Özellikleri, nereden düşer, nasıl upgrade edilir.',
    seo_keywords: [
      'chitin shell helmet', 'knight online chitin', 'chitin helmet',
      'knight online zırh', 'warrior kask',
    ],
    image_url: null,
    icon_url: null,
    is_published: true,
    sort_order: 30,
  },

  // ── Aksesuarlar ────────────────────────────────────────────────────────────

  {
    slug: 'iron-necklace',
    name: 'Iron Necklace of Fighter',
    name_en: 'Iron Necklace of Fighter',
    item_type: 'necklace',
    sub_type: null,
    character_class: ['warrior'],
    race: 'all',
    base_stats: { str: 10, hp: 100 },
    bonus_stats: [],
    item_grade: 'unique',
    min_level: 50,
    upgrade_max: 0,
    drop_info: [
      { mob_name: 'Çeşitli Moblar', drop_rate: 'Orta' },
    ],
    obtain_methods: [
      { type: 'drop', source: 'Çeşitli moblar' },
    ],
    description:
      'Iron Necklace of Fighter, warrior sınıfı için STR ve HP bonusu sağlayan önemli bir kolye.',
    content:
      '## Iron Necklace of Fighter\n\nWarrior için STR ve HP bonusu sağlayan temel kolye item\'ı.',
    seo_title: 'Knight Online Iron Necklace | Aksesuar Rehberi | MSGKO',
    seo_description: 'Knight Online Iron Necklace of Fighter kolye rehberi. Özellikleri ve nereden düşer.',
    seo_keywords: [
      'iron necklace', 'knight online necklace', 'knight online kolye',
      'warrior kolye', 'iron necklace of fighter',
    ],
    image_url: null,
    icon_url: null,
    is_published: true,
    sort_order: 40,
  },
]

/** Slug'a göre item verisini döndürür */
export function getItemBySlug(slug: string): ItemSeedData | undefined {
  return KO_ITEMS.find((i) => i.slug === slug)
}

/** Tüm yayınlanan item slug'larını döndürür */
export function getPublishedItemSlugs(): string[] {
  return KO_ITEMS.filter((i) => i.is_published).map((i) => i.slug)
}

/** Tip'e göre item listesi */
export function getItemsByType(type: KOItem['item_type']): ItemSeedData[] {
  return KO_ITEMS.filter((i) => i.item_type === type && i.is_published)
}

/** Sınıfa göre item listesi */
export function getItemsByClass(cls: string): ItemSeedData[] {
  return KO_ITEMS.filter(
    (i) => i.is_published && (i.character_class.includes(cls as never) || i.character_class.length === 0)
  )
}
