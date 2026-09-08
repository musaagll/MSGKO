/**
 * Knight Online — Haritalar
 * Tüm oyun haritaları, özellikler ve SEO verisi
 */

import type { KOMap } from '@/lib/types'

export type MapSeedData = Omit<KOMap, 'id' | 'view_count' | 'updated_at' | 'created_at'>

export const KO_MAPS: MapSeedData[] = [
  // ── PvE / Leveling Haritaları ─────────────────────────────────────────────

  {
    slug: 'moradon',
    name: 'Moradon',
    name_en: 'Moradon',
    map_type: 'town',
    min_level: 1,
    max_level: null,
    is_war_zone: false,
    is_pk_zone: false,
    has_dungeon: false,
    description:
      'Moradon, Knight Online\'ın merkezinde yer alan ana kasabadır. Human ve Karus ırklarının bir arada bulunabildiği tarafsız bölgedir. Banka, pazar ve NPC\'lere buradan ulaşılır.',
    excerpt: 'Knight Online\'ın ana kasabası Moradon; alışveriş, banka ve tüm NPC\'lerin bulunduğu merkezi bölgedir.',
    key_features: [
      { text: 'Tarafsız bölge — Human ve Karus bir arada' },
      { text: 'Ana pazar ve alışveriş merkezi' },
      { text: 'Banka ve item depolama' },
      { text: 'Tüm ırk NPC\'leri burada bulunur' },
    ],
    farm_spots: [],
    bosses_here: [],
    npcs_here: [
      { name: 'Merchant NPC', function: 'İtem alım/satım' },
      { name: 'Banker NPC', function: 'Banka ve depolama' },
      { name: 'Quest NPC', function: 'Görev başlatma' },
    ],
    content: null,
    seo_title: 'Knight Online Moradon Haritası | NPC, Pazar ve Rehber | MSGKO',
    seo_description:
      'Knight Online Moradon haritası rehberi. NPC konumları, pazar rehberi, banka sistemi ve Moradon\'da yapılacaklar. MSGKO\'da tam bilgi.',
    seo_keywords: ['moradon', 'knight online moradon', 'moradon npc', 'moradon pazar'],
    image_url: null,
    is_published: true,
    sort_order: 1,
  },
  {
    slug: 'el-morad',
    name: 'El Morad',
    name_en: 'El Morad',
    map_type: 'town',
    min_level: 1,
    max_level: null,
    is_war_zone: false,
    is_pk_zone: false,
    has_dungeon: false,
    description:
      'El Morad, Human ırkının ana üssüdür. Oyuna yeni başlayan Human karakterler buradan başlar. El Morad Kalesi etrafında yoğun PvP aktivitesi yaşanır.',
    excerpt: 'Human ırkının ana şehri El Morad; başlangıç noktası, NPC\'ler ve kale çevresi PvP bölgesiyle önemli bir merkez.',
    key_features: [
      { text: 'Human ırkı başlangıç şehri' },
      { text: 'El Morad Kalesi stratejik öneme sahip' },
      { text: 'CSW (Castle Siege War) merkezi' },
    ],
    farm_spots: [],
    bosses_here: [],
    npcs_here: [
      { name: 'Potion NPC', function: 'İksir satışı' },
      { name: 'Weapons NPC', function: 'Silah satışı' },
    ],
    content: null,
    seo_title: 'Knight Online El Morad | Human Ana Şehri Rehberi | MSGKO',
    seo_description: 'Knight Online El Morad haritası. Human başlangıç şehri, NPC konumları ve kale çevresi rehberi.',
    seo_keywords: ['el morad', 'knight online el morad', 'human şehri'],
    image_url: null,
    is_published: true,
    sort_order: 2,
  },
  {
    slug: 'karus',
    name: 'Karus',
    name_en: 'Karus',
    map_type: 'town',
    min_level: 1,
    max_level: null,
    is_war_zone: false,
    is_pk_zone: false,
    has_dungeon: false,
    description:
      'Karus, Karus ırkının ana üssüdür. Karus karakterler oyuna buradan başlar. Karus Kalesi etrafında PvP savaşları yaşanır.',
    excerpt: 'Karus ırkının ana şehri; başlangıç noktası, NPC\'ler ve kale çevresi PvP ile temel bir merkez.',
    key_features: [
      { text: 'Karus ırkı başlangıç şehri' },
      { text: 'Karus Kalesi stratejik öneme sahip' },
    ],
    farm_spots: [],
    bosses_here: [],
    npcs_here: [
      { name: 'Potion NPC', function: 'İksir satışı' },
      { name: 'Weapons NPC', function: 'Silah satışı' },
    ],
    content: null,
    seo_title: 'Knight Online Karus | Karus Ana Şehri Rehberi | MSGKO',
    seo_description: 'Knight Online Karus haritası. Karus başlangıç şehri, NPC konumları ve rehberi.',
    seo_keywords: ['karus', 'knight online karus', 'karus şehri'],
    image_url: null,
    is_published: true,
    sort_order: 3,
  },
  {
    slug: 'ronark-land',
    name: 'Ronark Land (CZ)',
    name_en: 'Ronark Land',
    map_type: 'pvp',
    min_level: 60,
    max_level: null,
    is_war_zone: true,
    is_pk_zone: true,
    has_dungeon: false,
    description:
      'Ronark Land (kısaca CZ — Controlled Zone), Knight Online\'ın ana PvP savaş alanıdır. Human ve Karus ırklarının çatıştığı, boss\'ların spawn olduğu ve en değerli item\'ların düştüğü haritadır. Felankor ve diğer büyük boss\'lar burada belirir.',
    excerpt:
      'Ronark Land (CZ), Knight Online\'ın ana PvP haritası. Felankor başta olmak üzere önemli boss\'lar burada spawn olur.',
    key_features: [
      { text: 'Ana PvP savaş alanı — Human vs Karus' },
      { text: 'Felankor, Isiloon ve diğer büyük boss\'lar burada' },
      { text: 'En yüksek exp ve item drop oranları' },
      { text: 'PK öldürme ile NP (National Point) kazanılır' },
      { text: 'Colony Zone\'a giriş buradan yapılır' },
    ],
    farm_spots: [
      {
        name: 'CZ Kuzey Bölgesi',
        level_range: '60-70',
        mob_types: ['Lycaon', 'Harpy'],
        notes: 'Orta seviye exp farm',
      },
      {
        name: 'CZ Merkez',
        level_range: '70+',
        mob_types: ['Dark Mare', 'Wight'],
        notes: 'Yüksek risk, yüksek ödül',
      },
    ],
    bosses_here: [
      { boss_slug: 'felankor', boss_name: 'Felankor' },
      { boss_slug: 'isiloon', boss_name: 'Isiloon' },
      { boss_slug: 'apostle-of-god', boss_name: 'Apostle of God' },
    ],
    npcs_here: [
      { name: 'Mage NPC', function: 'Işınlanma ve temel satışlar' },
    ],
    content: null,
    seo_title: 'Knight Online Ronark Land (CZ) | PvP, Boss ve Farm Rehberi | MSGKO',
    seo_description:
      'Knight Online Ronark Land (CZ) haritası rehberi. Felankor, Isiloon boss konumları, farm rotaları, PK taktikleri ve CZ\'de hayatta kalma rehberi.',
    seo_keywords: [
      'ronark land', 'cz', 'knight online cz', 'knight online ronark land',
      'cz farm', 'cz boss', 'knight online pvp haritası',
    ],
    image_url: null,
    is_published: true,
    sort_order: 10,
  },
  {
    slug: 'ardream',
    name: 'Ardream',
    name_en: 'Ardream',
    map_type: 'pvp',
    min_level: 30,
    max_level: 59,
    is_war_zone: true,
    is_pk_zone: true,
    has_dungeon: false,
    description:
      'Ardream, 30-59 seviye arası oyuncular için tasarlanmış PvP haritasıdır. Yeni başlayanların PvP deneyimi kazandığı ilk savaş alanıdır. Human vs Karus çatışması burada gerçekleşir.',
    excerpt: 'Knight Online Ardream; 30-59 seviye PvP haritası, yeni oyuncuların PK deneyimi kazandığı ilk savaş alanı.',
    key_features: [
      { text: '30-59 arası PvP bölgesi' },
      { text: 'Yeni başlayanlar için ideal PvP ortamı' },
      { text: 'Orta seviye drop ve exp' },
    ],
    farm_spots: [
      {
        name: 'Ardream Güney',
        level_range: '30-45',
        mob_types: ['Skeleton', 'Werewolf'],
        notes: 'Başlangıç seviyesi farm',
      },
    ],
    bosses_here: [],
    npcs_here: [],
    content: null,
    seo_title: 'Knight Online Ardream | 30-59 Seviye PvP Haritası Rehberi | MSGKO',
    seo_description:
      'Knight Online Ardream haritası. 30-59 seviye PvP bölgesi, farm rotaları ve Ardream\'de hayatta kalma taktikleri.',
    seo_keywords: ['ardream', 'knight online ardream', 'ardream pvp', 'ardream farm'],
    image_url: null,
    is_published: true,
    sort_order: 11,
  },
  {
    slug: 'ronark-land-base',
    name: 'Ronark Land Base (RLB)',
    name_en: 'Ronark Land Base',
    map_type: 'pvp',
    min_level: 50,
    max_level: null,
    is_war_zone: true,
    is_pk_zone: true,
    has_dungeon: false,
    description:
      'Ronark Land Base (RLB), CZ\'nin dışında yer alan ve ana üslere yakın bir PvP bölgesidir. Savunma ve saldırı stratejilerinin uygulandığı bir ara bölgedir.',
    excerpt: 'Knight Online RLB (Ronark Land Base); CZ öncesi PvP pratiği için ideal, stratejik öneme sahip bölge.',
    key_features: [
      { text: 'Base koruma ve saldırı savaşları' },
      { text: 'CZ\'ye geçiş noktası' },
    ],
    farm_spots: [],
    bosses_here: [],
    npcs_here: [],
    content: null,
    seo_title: 'Knight Online RLB (Ronark Land Base) | PvP Haritası Rehberi | MSGKO',
    seo_description: 'Knight Online RLB haritası. Ronark Land Base PvP bölgesi, savaş taktikleri rehberi.',
    seo_keywords: ['rlb', 'ronark land base', 'knight online rlb'],
    image_url: null,
    is_published: true,
    sort_order: 12,
  },
  {
    slug: 'forgotten-temple',
    name: 'Forgotten Temple (FT)',
    name_en: 'Forgotten Temple',
    map_type: 'dungeon',
    min_level: 60,
    max_level: null,
    is_war_zone: false,
    is_pk_zone: false,
    has_dungeon: true,
    description:
      'Forgotten Temple, Knight Online\'ın en zorlu ve ödüllendirici dungeon\'larından biridir. İçinde güçlü mob\'lar ve değerli drop\'lar bulunur. FT anahtarı ile girilebilen bu dungeon, deneyimli oyuncular için tasarlanmıştır.',
    excerpt:
      'Knight Online Forgotten Temple (FT); değerli drop\'lar ve güçlü mob\'larla dolu zorlu bir dungeon. FT anahtarı gerekir.',
    key_features: [
      { text: 'FT anahtarı ile giriş yapılır' },
      { text: 'Nadir ve değerli item\'lar düşer' },
      { text: 'Yüksek exp kazanımı' },
      { text: 'Grup aktivitesi önerilir' },
    ],
    farm_spots: [
      {
        name: 'FT İçi',
        level_range: '65+',
        mob_types: ['FT Mobs'],
        notes: 'Yüksek exp ve nadir drop',
      },
    ],
    bosses_here: [
      { boss_slug: 'riote', boss_name: 'Riote' },
    ],
    npcs_here: [],
    content: null,
    seo_title: 'Knight Online Forgotten Temple (FT) | Dungeon Rehberi | MSGKO',
    seo_description:
      'Knight Online Forgotten Temple (FT) dungeon rehberi. FT anahtarı nasıl alınır, FT\'de ne düşer, boss\'lar ve farm taktikleri.',
    seo_keywords: [
      'forgotten temple', 'ft', 'knight online ft', 'knight online forgotten temple',
      'ft dungeon', 'ft anahtar', 'ft farm',
    ],
    image_url: null,
    is_published: true,
    sort_order: 20,
  },
  {
    slug: 'juraid-mountain',
    name: 'Juraid Mountain',
    name_en: 'Juraid Mountain',
    map_type: 'dungeon',
    min_level: 65,
    max_level: null,
    is_war_zone: false,
    is_pk_zone: false,
    has_dungeon: true,
    description:
      'Juraid Mountain, Knight Online\'ın başka bir önemli dungeon bölgesidir. Güçlü boss\'lar ve özel drop\'larıyla bilinir. Grup halinde girilmesi önerilen zorlu bir bölgedir.',
    excerpt: 'Knight Online Juraid Mountain dungeon\'u; güçlü boss\'lar ve nadir drop\'larıyla grup için tasarlanmış zorlu bölge.',
    key_features: [
      { text: 'Grup aktivitesi gerektirir' },
      { text: 'Nadir ve değerli item drop\'ları' },
      { text: 'Juraid boss\'u güçlü bir düşmandır' },
    ],
    farm_spots: [],
    bosses_here: [
      { boss_slug: 'juraid-boss', boss_name: 'Juraid Monster' },
    ],
    npcs_here: [],
    content: null,
    seo_title: 'Knight Online Juraid Mountain | Dungeon Boss ve Drop Rehberi | MSGKO',
    seo_description: 'Knight Online Juraid Mountain dungeon rehberi. Boss\'lar, drop listesi ve grup taktikleri.',
    seo_keywords: ['juraid mountain', 'knight online juraid', 'juraid dungeon', 'juraid boss'],
    image_url: null,
    is_published: true,
    sort_order: 21,
  },
  {
    slug: 'colony-zone',
    name: 'Colony Zone (CZ İçi)',
    name_en: 'Colony Zone',
    map_type: 'pvp',
    min_level: 70,
    max_level: null,
    is_war_zone: true,
    is_pk_zone: true,
    has_dungeon: false,
    description:
      'Colony Zone, CZ\'nin içinde yer alan ve özel olayların gerçekleştiği bir savaş bölgesidir. Colony olayı aktif olduğunda büyük PvP çatışmaları yaşanır.',
    excerpt: 'Colony Zone; CZ içindeki özel savaş etkinliği bölgesi, büyük PvP çatışmaları ve özel ödüller.',
    key_features: [
      { text: 'Colony event süresinde aktif' },
      { text: 'Büyük PvP çatışmaları' },
      { text: 'Colony kazanan taraf özel ödül alır' },
    ],
    farm_spots: [],
    bosses_here: [],
    npcs_here: [],
    content: null,
    seo_title: 'Knight Online Colony Zone | Colony Savaşı Rehberi | MSGKO',
    seo_description: 'Knight Online Colony Zone rehberi. Colony savaşı nasıl yapılır, ödüller neler, taktikler.',
    seo_keywords: ['colony zone', 'knight online colony', 'colony savaşı'],
    image_url: null,
    is_published: true,
    sort_order: 13,
  },
  {
    slug: 'eslant',
    name: 'Eslant',
    name_en: 'Eslant',
    map_type: 'pve',
    min_level: 55,
    max_level: 70,
    is_war_zone: false,
    is_pk_zone: false,
    has_dungeon: false,
    description:
      'Eslant, orta-yüksek seviye oyuncular için ideal PvE farm haritasıdır. Çeşitli güçlü mob\'lar ve değerli item drop\'ları ile önemli bir leveling bölgesidir.',
    excerpt: 'Knight Online Eslant; 55-70 seviye PvE farm için ideal, güçlü mob\'lar ve değerli item drop\'larıyla önemli harita.',
    key_features: [
      { text: '55-70 arası ideal exp farm' },
      { text: 'Nadir item drop\'ları' },
      { text: 'PK riski nispeten düşük' },
    ],
    farm_spots: [
      {
        name: 'Eslant Güneydog',
        level_range: '55-65',
        mob_types: ['Eslant Werewolf', 'Cyclops'],
        notes: 'Orta-yüksek exp farm',
      },
    ],
    bosses_here: [],
    npcs_here: [],
    content: null,
    seo_title: 'Knight Online Eslant Haritası | Farm Rotası ve Rehber | MSGKO',
    seo_description: 'Knight Online Eslant haritası rehberi. 55-70 seviye farm rotaları, mob drop listesi.',
    seo_keywords: ['eslant', 'knight online eslant', 'eslant farm', 'eslant mob'],
    image_url: null,
    is_published: true,
    sort_order: 8,
  },
  {
    slug: 'delos',
    name: 'Delos',
    name_en: 'Delos',
    map_type: 'pvp',
    min_level: 50,
    max_level: null,
    is_war_zone: true,
    is_pk_zone: true,
    has_dungeon: false,
    description:
      'Delos, hem PvE hem de PvP aktivitesi olan karma bir haritadır. Önemli NPC\'ler ve çeşitli görevler barındırır. Delos Kalesi ele geçirildiğinde özel avantajlar sağlar.',
    excerpt: 'Knight Online Delos; karma PvP/PvE haritası, Delos Kalesi stratejik önemi ve NPC\'leriyle önemli bir bölge.',
    key_features: [
      { text: 'Delos Kalesi ele geçirilebilir' },
      { text: 'Karma PvP/PvE bölgesi' },
      { text: 'Özel NPC\'ler ve görevler' },
    ],
    farm_spots: [],
    bosses_here: [],
    npcs_here: [
      { name: 'Delos NPC', function: 'Görev ve satış' },
    ],
    content: null,
    seo_title: 'Knight Online Delos Haritası | Kale, PvP ve Rehber | MSGKO',
    seo_description: 'Knight Online Delos haritası. Delos Kalesi rehberi, PvP taktikleri ve farm alanları.',
    seo_keywords: ['delos', 'knight online delos', 'delos kalesi', 'delos pvp'],
    image_url: null,
    is_published: true,
    sort_order: 9,
  },
]

/** Slug'a göre harita verisini döndürür */
export function getMapBySlug(slug: string): MapSeedData | undefined {
  return KO_MAPS.find((m) => m.slug === slug)
}

/** Tüm yayınlanan harita slug'larını döndürür */
export function getPublishedMapSlugs(): string[] {
  return KO_MAPS.filter((m) => m.is_published).map((m) => m.slug)
}

/** Harita tipine göre filtrele */
export function getMapsByType(type: KOMap['map_type']): MapSeedData[] {
  return KO_MAPS.filter((m) => m.map_type === type && m.is_published)
}
