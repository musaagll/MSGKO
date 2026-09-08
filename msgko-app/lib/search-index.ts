/**
 * MSGKO — Site Genelinde Arama İndeksi
 *
 * Tüm içerik tipleri (rehber, boss, harita, item, build, farm, haber, sayfa, video)
 * bu merkezi index'te tutulur.
 *
 * Türkçe varyasyon desteği: alias map ile farklı yazım biçimleri normalize edilir.
 * Typo tolerans: normalize() ile benzer yazımlar eşleştirilir.
 */

// ── Tipler ────────────────────────────────────────────────────────────────────

export type SearchItemType =
  | 'video'
  | 'kategori'
  | 'sayfa'
  | 'rehber'
  | 'boss'
  | 'harita'
  | 'item'
  | 'build'
  | 'farm'
  | 'haber'
  | 'quest'
  | 'modal'

export interface SearchItem {
  id: string
  type: SearchItemType
  title: string
  description: string
  action: 'link' | 'modal' | 'external'
  href?: string
  externalUrl?: string
  modalId?: string
  keywords: string[]
  badge?: string
  badgeColor?: string
}

// ── Türkçe Alias Normalizer ───────────────────────────────────────────────────

/**
 * Türkçe harfleri ASCII karşılıklarına dönüştürür.
 * Hem kullanıcı sorgusuna hem keyword'lere uygulanır.
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i')
    .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .trim()
}

/**
 * Yaygın yazım hatalarını doğru forma çevirir.
 * Örn: "knigt online" → "knight online"
 */
const TYPO_MAP: Record<string, string> = {
  'knigt online':    'knight online',
  'knight onlne':    'knight online',
  'knigth online':   'knight online',
  'knightonline':    'knight online',
  'knight  online':  'knight online',
  'ko online':       'knight online',
  'k.o':             'ko',
  'assassin':        'asas',
  'roge':            'rogue',
  'okcu':            'okçu',
  'felancore':       'felankor',
  'felankors':       'felankor',
  'isilons':         'isiloon',
  'forogtten temple':'forgotten temple',
  'ronark':          'ronark land',
  'arderam':         'ardream',
}

function fixTypo(query: string): string {
  const lower = query.toLowerCase().trim()
  return TYPO_MAP[lower] ?? lower
}

// ── Search Index ──────────────────────────────────────────────────────────────

export const SEARCH_INDEX: SearchItem[] = [

  // ── Sayfalar ──────────────────────────────────────────────────────────────
  {
    id: 'anasayfa',
    type: 'sayfa',
    title: 'Ana Sayfa',
    description: 'MSGKO ana sayfası — Knight Online rehber platformu',
    action: 'link',
    href: '/',
    keywords: ['ana sayfa', 'msgko', 'anasayfa', 'msgko.net', 'home', 'knight online'],
    badge: 'Sayfa',
    badgeColor: 'purple',
  },
  {
    id: 'destek',
    type: 'sayfa',
    title: 'Destek',
    description: 'KoPazar, ByNoGame ve KnightPİN üzerinden destek ol',
    action: 'link',
    href: '/destek',
    keywords: ['destek', 'bağış', 'kopazar', 'bynogame', 'knightpin', 'donate', 'support'],
    badge: 'Sayfa',
    badgeColor: 'pink',
  },
  {
    id: 'wallpaper',
    type: 'sayfa',
    title: 'Knight Online Wallpaper',
    description: 'MSGKO Knight Online duvar kağıtları — ücretsiz indir',
    action: 'link',
    href: '/wallpaper',
    keywords: [
      'wallpaper', 'duvar kağıdı', 'arka plan', 'indirme', 'indir',
      'masaüstü', 'resim', 'görsel', 'background', 'knight online wallpaper',
    ],
    badge: 'İçerik',
    badgeColor: 'purple',
  },

  // ── Rehberler (Karakter Sınıfları) ────────────────────────────────────────
  {
    id: 'rehber-index',
    type: 'rehber',
    title: 'Tüm Karakter Rehberleri',
    description: 'Asas, Okçu, Warrior, Mage, Priest — tüm sınıf rehberleri',
    action: 'link',
    href: '/rehber',
    keywords: ['rehber', 'karakter rehberi', 'tüm rehberler', 'sınıf rehberi', 'knight online rehber'],
    badge: 'Rehber',
    badgeColor: 'blue',
  },
  {
    id: 'rehber-asas',
    type: 'rehber',
    title: 'Knight Online Asas Rehberi',
    description: 'Asas build, combo, skill dizilimi ve PK taktikleri',
    action: 'link',
    href: '/rehber/asas',
    keywords: [
      'asas', 'asas rehber', 'asas build', 'asas combo', 'asas skill',
      'asas pk', 'asas taktik', 'asas nasıl oynanır', 'asas stat',
      'asas item', 'rogue', 'rogue build', 'assassin', 'asas dizilim',
      'asas teknikleri', 'str dex', 'asas pvp', 'ko asas',
    ],
    badge: 'Rehber',
    badgeColor: 'blue',
  },
  {
    id: 'rehber-okcu',
    type: 'rehber',
    title: 'Knight Online Okçu Rehberi',
    description: 'Okçu build, skill dizilimi, PK taktikleri ve item rehberi',
    action: 'link',
    href: '/rehber/okcu',
    keywords: [
      'okçu', 'okcu', 'okçu rehber', 'okçu build', 'okçu combo', 'okçu skill',
      'okçu pk', 'archer', 'archer build', 'okçu stat', 'okçu item',
      'okçu nasıl oynanır', 'dex build', 'ko okcu', 'bow',
    ],
    badge: 'Rehber',
    badgeColor: 'blue',
  },
  {
    id: 'rehber-warrior',
    type: 'rehber',
    title: 'Knight Online Warrior Rehberi',
    description: 'Warrior build, stat dağılımı, tank ve DPS oynanışı',
    action: 'link',
    href: '/rehber/warrior',
    keywords: [
      'warrior', 'warrior rehber', 'warrior build', 'warrior pk',
      'savaşçı', 'tank', 'tank build', 'warrior stat', 'warrior item',
      'warrior nasıl', 'ko warrior', 'warrior ws',
    ],
    badge: 'Rehber',
    badgeColor: 'blue',
  },
  {
    id: 'rehber-mage',
    type: 'rehber',
    title: 'Knight Online Mage Rehberi',
    description: 'Mage build, INT stat ve AOE PK taktikleri',
    action: 'link',
    href: '/rehber/mage',
    keywords: [
      'mage', 'mage rehber', 'mage build', 'büyücü', 'sihirbaz',
      'aoe mage', 'mage stat', 'int build', 'mage pk', 'mage item',
      'mage nasıl', 'ko mage',
    ],
    badge: 'Rehber',
    badgeColor: 'blue',
  },
  {
    id: 'rehber-priest',
    type: 'rehber',
    title: 'Knight Online Priest Rehberi',
    description: 'Priest build, heal ve attack priest rehberi',
    action: 'link',
    href: '/rehber/priest',
    keywords: [
      'priest', 'priest rehber', 'priest build', 'rahip', 'heal',
      'heal priest', 'attack priest', 'priest stat', 'buf', 'buff',
      'priest nasıl', 'ko priest',
    ],
    badge: 'Rehber',
    badgeColor: 'blue',
  },
  {
    id: 'rehber-battle-priest',
    type: 'rehber',
    title: 'Knight Online Battle Priest Rehberi',
    description: 'BP build, hibrit STR/INT oynanış rehberi',
    action: 'link',
    href: '/rehber/battle-priest',
    keywords: [
      'battle priest', 'bp', 'battle priest build', 'bp rehber',
      'battle priest stat', 'bp pk', 'hibrit build',
    ],
    badge: 'Rehber',
    badgeColor: 'blue',
  },

  // ── Boss'lar ──────────────────────────────────────────────────────────────
  {
    id: 'boss-index',
    type: 'boss',
    title: 'Tüm Boss Rehberleri',
    description: 'Felankor, Isiloon, Kundun ve tüm boss\'ların drop ve spawn bilgisi',
    action: 'link',
    href: '/boss',
    keywords: ['boss', 'boss listesi', 'tüm boslar', 'knight online boss', 'boss rehberi'],
    badge: 'Boss',
    badgeColor: 'red',
  },
  {
    id: 'boss-felankor',
    type: 'boss',
    title: 'Knight Online Felankor',
    description: 'CZ\'nin en güçlü world boss\'u — spawn, drop ve taktikler',
    action: 'link',
    href: '/boss/felankor',
    keywords: [
      'felankor', 'felankor drop', 'felankor spawn', 'felankor nerede',
      'felankor ne düşürür', 'felankor öldürme', 'cz boss', 'world boss',
      'knight online felankor',
    ],
    badge: 'Boss',
    badgeColor: 'red',
  },
  {
    id: 'boss-isiloon',
    type: 'boss',
    title: 'Knight Online Isiloon',
    description: 'CZ world boss\'u — spawn, drop ve taktikler',
    action: 'link',
    href: '/boss/isiloon',
    keywords: ['isiloon', 'isiloon drop', 'isiloon spawn', 'knight online isiloon'],
    badge: 'Boss',
    badgeColor: 'red',
  },
  {
    id: 'boss-kundun',
    type: 'boss',
    title: 'Knight Online Kundun',
    description: 'Forgotten Temple (FT) dungeon boss\'u',
    action: 'link',
    href: '/boss/kundun',
    keywords: ['kundun', 'kundun drop', 'ft boss', 'forgotten temple boss', 'knight online kundun'],
    badge: 'Boss',
    badgeColor: 'red',
  },
  {
    id: 'boss-talos',
    type: 'boss',
    title: 'Knight Online Talos',
    description: 'Eslant haritasında spawn olan world boss',
    action: 'link',
    href: '/boss/talos',
    keywords: ['talos', 'talos drop', 'talos spawn', 'eslant boss', 'knight online talos'],
    badge: 'Boss',
    badgeColor: 'red',
  },
  {
    id: 'boss-titans',
    type: 'boss',
    title: 'Knight Online Titans',
    description: 'CZ\'de spawn olan güçlü world boss grubu',
    action: 'link',
    href: '/boss/titans',
    keywords: ['titans', 'titan', 'cz titan', 'knight online titans'],
    badge: 'Boss',
    badgeColor: 'red',
  },
  {
    id: 'boss-apostle',
    type: 'boss',
    title: 'Knight Online Apostle of God',
    description: 'CZ\'de düzenli spawn olan world boss',
    action: 'link',
    href: '/boss/apostle-of-god',
    keywords: ['apostle of god', 'apostle', 'knight online apostle'],
    badge: 'Boss',
    badgeColor: 'red',
  },

  // ── Haritalar ─────────────────────────────────────────────────────────────
  {
    id: 'harita-index',
    type: 'harita',
    title: 'Tüm Harita Rehberleri',
    description: 'CZ, Ardream, FT ve tüm Knight Online haritaları',
    action: 'link',
    href: '/harita',
    keywords: ['harita', 'harita listesi', 'tüm haritalar', 'knight online harita'],
    badge: 'Harita',
    badgeColor: 'green',
  },
  {
    id: 'harita-cz',
    type: 'harita',
    title: 'Ronark Land (CZ)',
    description: 'Knight Online ana PvP haritası — boss\'lar ve farm',
    action: 'link',
    href: '/harita/ronark-land',
    keywords: [
      'cz', 'ronark land', 'controlled zone', 'knight online cz',
      'cz farm', 'cz boss', 'pvp haritası', 'ronark',
    ],
    badge: 'Harita',
    badgeColor: 'green',
  },
  {
    id: 'harita-ardream',
    type: 'harita',
    title: 'Ardream',
    description: '30-59 seviye PvP haritası',
    action: 'link',
    href: '/harita/ardream',
    keywords: ['ardream', 'knight online ardream', 'ardream pvp', 'ardream farm'],
    badge: 'Harita',
    badgeColor: 'green',
  },
  {
    id: 'harita-ft',
    type: 'harita',
    title: 'Forgotten Temple (FT)',
    description: 'Knight Online en zorlu dungeon — FT anahtarı gerekir',
    action: 'link',
    href: '/harita/forgotten-temple',
    keywords: [
      'forgotten temple', 'ft', 'knight online ft', 'ft dungeon',
      'ft anahtar', 'ft farm', 'ft boss',
    ],
    badge: 'Harita',
    badgeColor: 'green',
  },
  {
    id: 'harita-rlb',
    type: 'harita',
    title: 'Ronark Land Base (RLB)',
    description: 'CZ öncesi PvP bölgesi',
    action: 'link',
    href: '/harita/ronark-land-base',
    keywords: ['rlb', 'ronark land base', 'knight online rlb'],
    badge: 'Harita',
    badgeColor: 'green',
  },
  {
    id: 'harita-eslant',
    type: 'harita',
    title: 'Eslant',
    description: '55-70 seviye PvE farm haritası',
    action: 'link',
    href: '/harita/eslant',
    keywords: ['eslant', 'knight online eslant', 'eslant farm'],
    badge: 'Harita',
    badgeColor: 'green',
  },

  // ── Item'lar ──────────────────────────────────────────────────────────────
  {
    id: 'item-index',
    type: 'item',
    title: 'Item Veritabanı',
    description: 'Knight Online silah, zırh ve aksesuar rehberleri',
    action: 'link',
    href: '/item',
    keywords: ['item', 'item listesi', 'item veritabanı', 'knight online item', 'silah', 'zırh'],
    badge: 'Item',
    badgeColor: 'amber',
  },
  {
    id: 'item-raptor',
    type: 'item',
    title: 'Raptor',
    description: 'Warrior mızrağı — drop, özellik ve upgrade rehberi',
    action: 'link',
    href: '/item/raptor',
    keywords: [
      'raptor', 'knight online raptor', 'raptor drop', 'raptor nereden düşer',
      'raptor özellikleri', 'raptor upgrade', 'raptor +8', 'raptor +9',
      'warrior mızrak',
    ],
    badge: 'Item',
    badgeColor: 'amber',
  },
  {
    id: 'item-dual-blade',
    type: 'item',
    title: 'Dual Blade',
    description: 'Asas çift bıçak silahı',
    action: 'link',
    href: '/item/dual-blade',
    keywords: ['dual blade', 'asas silahı', 'rogue silah', 'dual blade drop'],
    badge: 'Item',
    badgeColor: 'amber',
  },

  // ── Build'ler ─────────────────────────────────────────────────────────────
  {
    id: 'build-index',
    type: 'build',
    title: 'Build Rehberleri',
    description: 'PvP, PvE ve farm build\'leri — stat dağılımı ve skill tree',
    action: 'link',
    href: '/build',
    keywords: [
      'build', 'build rehberi', 'pvp build', 'pve build', 'farm build',
      'stat dağılımı', 'skill tree', 'knight online build',
    ],
    badge: 'Build',
    badgeColor: 'purple',
  },

  // ── Farm ──────────────────────────────────────────────────────────────────
  {
    id: 'farm-index',
    type: 'farm',
    title: 'Farm Rehberleri',
    description: 'Exp, item ve noah farm rotaları',
    action: 'link',
    href: '/farm',
    keywords: [
      'farm', 'exp farm', 'item farm', 'farm rotası', 'farm bölgesi',
      'exp', 'leveling', 'noah farm', 'ws farm', 'en iyi farm yeri',
      'knight online farm',
    ],
    badge: 'Farm',
    badgeColor: 'green',
  },

  // ── Haberler ──────────────────────────────────────────────────────────────
  {
    id: 'haber-index',
    type: 'haber',
    title: 'Knight Online Haberler',
    description: 'Güncel güncellemeler, patch notları ve etkinlikler',
    action: 'link',
    href: '/haber',
    keywords: [
      'haber', 'güncelleme', 'patch', 'etkinlik', 'bakım', 'duyuru',
      'knight online haber', 'knight online güncelleme', 'son haberler',
    ],
    badge: 'Haber',
    badgeColor: 'pink',
  },

  // ── Quest'ler ─────────────────────────────────────────────────────────────
  {
    id: 'quest-guardian',
    type: 'quest',
    title: 'Guardian of 7 Keys — Anahtar Görevi',
    description: 'Knight Online Guardian of 7 Keys anahtar görevi rehberi',
    action: 'link',
    href: '/rehber/asas',  // quest route henüz yok, en alakalı sayfaya yönlendir
    keywords: [
      'guardian of 7 keys', 'anahtar görevi', 'anahtar', '7 keys',
      'guardian', 'human görevi', 'görevi nasıl', 'quest',
    ],
    badge: 'Quest',
    badgeColor: 'purple',
  },

  // ── İçerik Modalleri ──────────────────────────────────────────────────────
  {
    id: 'youtube-panel',
    type: 'modal',
    title: 'YouTube Videoları',
    description: 'Tüm Knight Online eğitim ve rehber videoları',
    action: 'link',
    href: '/youtube',
    keywords: [
      'youtube', 'video', 'izle', 'shorts', 'kanal', 'yeni video',
      'son videolar', 'eğitim videosu', 'rehber video', 'musaagll',
    ],
    badge: 'Video',
    badgeColor: 'red',
  },
  {
    id: 'instagram-panel',
    type: 'modal',
    title: 'Instagram Reels',
    description: 'msgclip Instagram kısa videolar',
    action: 'link',
    href: '/instagram',
    keywords: ['instagram', 'reel', 'reels', 'msgclip', 'kısa video', 'clip'],
    badge: 'İçerik',
    badgeColor: 'pink',
  },
  {
    id: 'iletisim',
    type: 'sayfa',
    title: 'İletişim',
    description: 'Instagram ve e-posta ile iletişime geç',
    action: 'link',
    href: '/iletisim',
    keywords: ['iletişim', 'email', 'mail', 'ulaş', 'mesaj', 'contact', 'msgclip'],
    badge: 'Sayfa',
    badgeColor: 'purple',
  },

  // ── Videolar ──────────────────────────────────────────────────────────────
  {
    id: 'video-1',
    type: 'video',
    title: 'ZERO - NooaaH Culluk Asas WS İtemli Asas Movie 2026',
    description: 'Asas PK ve WS taktikleri — 2026 meta',
    action: 'external',
    externalUrl: 'https://www.youtube.com/watch?v=61-BoM0df3E',
    keywords: [
      'zero', 'nooaah', 'culluk', 'ws', 'asas movie', 'ws itemli',
      'asas pk', '2026', 'asas video', 'asas ws',
    ],
    badge: 'Video',
    badgeColor: 'red',
  },
  {
    id: 'video-2',
    type: 'video',
    title: 'Knight Online — Guardian of 7 Keys | Anahtar Görevi Human',
    description: 'Guardian of 7 Keys anahtar görevi detaylı rehber',
    action: 'external',
    externalUrl: 'https://www.youtube.com/watch?v=2N4zMIvjHSg',
    keywords: [
      'guardian of 7 keys', 'anahtar görevi', 'human', 'rehber', 'görev',
      'quest', '7 keys', 'anahtar video',
    ],
    badge: 'Video',
    badgeColor: 'red',
  },
]

// ── Arama Fonksiyonu ──────────────────────────────────────────────────────────

/**
 * Siteyi arar. Türkçe normalizasyon, typo düzeltme ve skor tabanlı sıralama uygular.
 *
 * @param rawQuery - Kullanıcının ham sorgusu
 * @param limit    - Maksimum sonuç sayısı (default: 10)
 */
export function searchItems(rawQuery: string, limit = 10): SearchItem[] {
  // 1. Temizle ve typo düzelt
  const fixed = fixTypo(rawQuery.trim())
  const q = normalize(fixed)
  if (q.length < 1) return []

  const scored = SEARCH_INDEX.map((item) => {
    let score = 0

    const titleN  = normalize(item.title)
    const descN   = normalize(item.description)

    // Başlıkta tam eşleşme
    if (titleN === q)           score += 120
    else if (titleN.startsWith(q)) score += 90
    else if (titleN.includes(q))   score += 65

    // Açıklamada
    if (descN.includes(q))         score += 20

    // Keyword'lerde
    for (const kw of item.keywords) {
      const kwN = normalize(kw)
      if (kwN === q)               score += 70
      else if (kwN.startsWith(q))  score += 45
      else if (kwN.includes(q))    score += 25
      else if (q.includes(kwN) && kwN.length > 3) score += 12
    }

    // Tür önceliği — rehber ve boss içerikleri öne çıksın
    if (score > 0) {
      if (item.type === 'rehber') score += 8
      if (item.type === 'boss')   score += 6
      if (item.type === 'harita') score += 5
      if (item.type === 'item')   score += 4
      if (item.type === 'build')  score += 3
    }

    return { item, score }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.item)
}
