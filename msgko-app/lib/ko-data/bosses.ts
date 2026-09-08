/**
 * Knight Online — Boss'lar
 * Önemli boss'ların tam bilgisi, drop listesi ve SEO verisi
 */

import type { Boss } from '@/lib/types'

export type BossSeedData = Omit<Boss, 'id' | 'view_count' | 'updated_at' | 'created_at'>

export const KO_BOSSES: BossSeedData[] = [
  {
    slug: 'felankor',
    name: 'Felankor',
    name_en: 'Felankor',
    boss_type: 'world',
    map_slug: 'ronark-land',
    spawn_coords: 'CZ Merkez',
    spawn_interval: '24 saat',
    level: 120,
    hp: 50000000,
    element: 'dark',
    description:
      `Felankor, Knight Online'ın en güçlü ve en ünlü world boss'udur. Ronark Land'ın (CZ) tam merkezinde spawn olur ve her iki ırk için de büyük bir hedef teşkil eder. Kill'i alan klan/parti çok değerli unique itemlar kazanır. Felankor dropları oyunun en değerli itemları arasındadır.`,
    content:
      `## Felankor Nedir?\n\nFelankor, Knight Online dünyasının en güçlü World Boss'udur. Ronark Land (CZ) haritasında spawn olur ve tüm sunucunun dikkatini çeker.\n\n## Spawn Zamanı\n\nFelankor'un spawn zamanı yaklaştığında sunucu genelinde duyuru yapılır. Her 24 saatte bir spawn olur.\n\n## Nasıl Öldürülür?\n\nFelankor'u öldürmek için güçlü bir grup gereklidir. En az 5-10 kişilik organize bir parti önerilir. Priest buffları kritik önem taşır.\n\n## Drop Listesi\n\nFelankor'dan en değerli unique itemlar düşer.`,
    drop_list: [
      { item_slug: 'bifrost-piece', item_name: 'Bifrost Parçası', drop_rate: 'Garanti', upgrade_range: 'N/A' },
      { item_slug: 'felankor-armor', item_name: 'Felankor Zırhı', drop_rate: '%15', upgrade_range: '+0~+3' },
      { item_slug: 'chaos-baal', item_name: 'Chaos Baal Sword', drop_rate: '%10', upgrade_range: '+0~+5' },
      { item_slug: 'draki', item_name: 'Draki', drop_rate: '%8', upgrade_range: '+0~+3' },
    ],
    related_quests: [
      { quest_slug: 'felankor-kill', quest_name: 'Felankor\'u öldür' },
    ],
    spawn_item: null,
    seo_title: 'Knight Online Felankor | Spawn, Drop ve Boss Rehberi | MSGKO',
    seo_description:
      'Knight Online Felankor boss rehberi. Felankor nerede spawn olur, ne zaman çıkar, hangi item\'ları düşürür ve nasıl öldürülür. CZ\'nin en güçlü boss\'u hakkında tam bilgi.',
    seo_keywords: [
      'felankor', 'knight online felankor', 'felankor drop', 'felankor spawn',
      'felankor nerede', 'felankor ne düşürür', 'felankor öldürme',
      'knight online boss', 'cz boss',
    ],
    image_url: null,
    is_published: true,
    sort_order: 1,
  },
  {
    slug: 'isiloon',
    name: 'Isiloon',
    name_en: 'Isiloon',
    boss_type: 'world',
    map_slug: 'ronark-land',
    spawn_coords: 'CZ Kuzey',
    spawn_interval: '12 saat',
    level: 100,
    hp: 20000000,
    element: 'ice',
    description:
      'Isiloon, Ronark Land\'da spawn olan önemli bir world boss\'tur. Felankor kadar nadir olmasa da değerli drop\'lara sahiptir. Orta güçlükte bir parti ile öldürülebilir.',
    content:
      '## Isiloon Nedir?\n\nIsiloon, CZ\'de düzenli olarak spawn olan world boss\'lardan biridir.\n\n## Nasıl Öldürülür?\n\n5+ kişilik parti ile öldürülebilir. Priest buff\'ları ve hasar odaklı DPS karakterler gerekir.\n\n## Drop Listesi\n\nOrta-yüksek kalite unique item\'lar düşer.',
    drop_list: [
      { item_slug: 'isiloon-armor', item_name: 'Isiloon Zırhı', drop_rate: '%20', upgrade_range: '+0~+5' },
      { item_slug: 'unique-weapon-1', item_name: 'Unique Silah', drop_rate: '%15', upgrade_range: '+0~+5' },
    ],
    related_quests: [],
    spawn_item: null,
    seo_title: 'Knight Online Isiloon | Spawn, Drop ve Rehber | MSGKO',
    seo_description:
      'Knight Online Isiloon boss rehberi. Isiloon nerede çıkar, ne düşürür, nasıl öldürülür. CZ world boss tam bilgisi.',
    seo_keywords: [
      'isiloon', 'knight online isiloon', 'isiloon drop', 'isiloon spawn',
      'isiloon nerede', 'isiloon ne düşürür',
    ],
    image_url: null,
    is_published: true,
    sort_order: 2,
  },
  {
    slug: 'apostle-of-god',
    name: 'Apostle of God',
    name_en: 'Apostle of God',
    boss_type: 'world',
    map_slug: 'ronark-land',
    spawn_coords: 'CZ',
    spawn_interval: '8 saat',
    level: 90,
    hp: 10000000,
    element: 'light',
    description:
      'Apostle of God, CZ\'de düzenli spawn olan orta güçlükte bir world boss\'tur. Değerli drop\'ları ve görece erişilebilir zorluğu ile popüler bir boss\'tur.',
    content: '## Apostle of God\n\nCZ\'de düzenli spawn olan önemli bir boss. Orta güçlükte gruplar rahatlıkla öldürebilir.',
    drop_list: [
      { item_slug: 'apostle-armor', item_name: 'Apostle Zırhı', drop_rate: '%25', upgrade_range: '+0~+5' },
    ],
    related_quests: [],
    spawn_item: null,
    seo_title: 'Knight Online Apostle of God | Boss Rehberi | MSGKO',
    seo_description: 'Knight Online Apostle of God boss rehberi. Spawn, drop ve öldürme taktikleri.',
    seo_keywords: ['apostle of god', 'knight online apostle', 'apostle boss'],
    image_url: null,
    is_published: true,
    sort_order: 3,
  },
  {
    slug: 'kundun',
    name: 'Kundun',
    name_en: 'Kundun',
    boss_type: 'dungeon',
    map_slug: 'forgotten-temple',
    spawn_coords: 'FT İçi',
    spawn_interval: 'Dungeon süresince',
    level: 80,
    hp: 5000000,
    element: 'dark',
    description:
      'Kundun, Forgotten Temple dungeon\'ının ana boss\'udur. FT anahtarı ile girilebilen dungeon\'da son boss olarak karşınıza çıkar. Drop\'ları çok değerlidir.',
    content: '## Kundun — FT Boss\n\nForgotten Temple\'ın son boss\'u. Grup halinde öldürülmesi önerilir.',
    drop_list: [
      { item_slug: 'kundun-set', item_name: 'Kundun Seti', drop_rate: '%30', upgrade_range: '+0~+5' },
    ],
    related_quests: [],
    spawn_item: 'ft-key',
    seo_title: 'Knight Online Kundun | FT Boss Drop ve Rehber | MSGKO',
    seo_description: 'Knight Online Kundun boss rehberi. Forgotten Temple son boss, drop listesi ve öldürme taktikleri.',
    seo_keywords: ['kundun', 'knight online kundun', 'ft boss', 'kundun drop', 'forgotten temple boss'],
    image_url: null,
    is_published: true,
    sort_order: 5,
  },
  {
    slug: 'talos',
    name: 'Talos',
    name_en: 'Talos',
    boss_type: 'world',
    map_slug: 'eslant',
    spawn_coords: 'Eslant',
    spawn_interval: '6 saat',
    level: 75,
    hp: 3000000,
    element: 'none',
    description:
      'Talos, Eslant haritasında spawn olan düzenli bir world boss\'tur. Orta seviye oyuncular için erişilebilir bir boss olup değerli drop\'lar bırakır.',
    content: '## Talos\n\nEslant\'ın önemli world boss\'u. Orta güçlükte bir grup rahatlıkla öldürebilir.',
    drop_list: [
      { item_slug: 'talos-weapon', item_name: 'Talos Silahı', drop_rate: '%20', upgrade_range: '+0~+5' },
    ],
    related_quests: [],
    spawn_item: null,
    seo_title: 'Knight Online Talos | Spawn, Drop ve Rehber | MSGKO',
    seo_description: 'Knight Online Talos boss rehberi. Eslant world boss, spawn zamanı, drop listesi.',
    seo_keywords: ['talos', 'knight online talos', 'talos boss', 'talos drop', 'eslant boss'],
    image_url: null,
    is_published: true,
    sort_order: 6,
  },
  {
    slug: 'titans',
    name: 'Titans',
    name_en: 'Titans',
    boss_type: 'world',
    map_slug: 'ronark-land',
    spawn_coords: 'CZ Güney',
    spawn_interval: '4 saat',
    level: 85,
    hp: 8000000,
    element: 'fire',
    description:
      'Titans, CZ\'de düzenli aralıklarla spawn olan güçlü bir world boss grubudur. Birden fazla Titan aynı anda spawn olabilir. Güçlü ödülleri ile çok talep gören bir boss\'tur.',
    content: '## Titans\n\nCZ\'nin güçlü Titan boss\'ları. Birden fazla spawn olabilir, dikkatli olun.',
    drop_list: [
      { item_slug: 'titan-armor', item_name: 'Titan Zırhı', drop_rate: '%18', upgrade_range: '+0~+5' },
    ],
    related_quests: [],
    spawn_item: null,
    seo_title: 'Knight Online Titans | Boss Rehberi | MSGKO',
    seo_description: 'Knight Online Titans boss rehberi. CZ Titans spawn, drop listesi ve grup taktikleri.',
    seo_keywords: ['titans', 'knight online titans', 'titans boss', 'titans drop'],
    image_url: null,
    is_published: true,
    sort_order: 4,
  },
  {
    slug: 'bellon',
    name: 'Bellon',
    name_en: 'Bellon',
    boss_type: 'world',
    map_slug: 'delos',
    spawn_coords: 'Delos',
    spawn_interval: '8 saat',
    level: 70,
    hp: 4000000,
    element: 'none',
    description:
      'Bellon, Delos haritasında spawn olan bir world boss\'tur. Orta güçlükte bir boss olup düzenli farmlara elverişlidir.',
    content: '## Bellon\n\nDelos\'un önemli world boss\'u. Orta seviye gruplar için ideal.',
    drop_list: [
      { item_slug: 'bellon-drop', item_name: 'Bellon Drop', drop_rate: '%25', upgrade_range: '+0~+5' },
    ],
    related_quests: [],
    spawn_item: null,
    seo_title: 'Knight Online Bellon | Boss Rehberi | MSGKO',
    seo_description: 'Knight Online Bellon boss rehberi. Delos world boss, spawn ve drop bilgisi.',
    seo_keywords: ['bellon', 'knight online bellon', 'bellon boss', 'delos boss'],
    image_url: null,
    is_published: true,
    sort_order: 7,
  },
]

/** Slug'a göre boss verisini döndürür */
export function getBossBySlug(slug: string): BossSeedData | undefined {
  return KO_BOSSES.find((b) => b.slug === slug)
}

/** Tüm yayınlanan boss slug'larını döndürür */
export function getPublishedBossSlugs(): string[] {
  return KO_BOSSES.filter((b) => b.is_published).map((b) => b.slug)
}

/** Haritaya göre boss listesi */
export function getBossesByMap(mapSlug: string): BossSeedData[] {
  return KO_BOSSES.filter((b) => b.map_slug === mapSlug && b.is_published)
}
