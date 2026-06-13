/**
 * Site genelinde aranabilir içerik index'i.
 * Yeni içerik eklendikçe buraya ekle.
 */

export type SearchItemType =
  | 'video'
  | 'kategori'
  | 'sayfa'
  | 'rehber'
  | 'modal'

export interface SearchItem {
  id: string
  type: SearchItemType
  title: string
  description: string
  /** Tıklandığında ne olacak: url yönlendirmesi veya modal açma */
  action: 'link' | 'modal' | 'external'
  href?: string
  externalUrl?: string
  /** Modal ID'si — action=modal ise kullanılır */
  modalId?: string
  /** Arama skoru için ek eşleşme kelimeleri */
  keywords: string[]
  badge?: string
  badgeColor?: string
}

export const SEARCH_INDEX: SearchItem[] = [
  // ── Sayfalar ─────────────────────────────────────────────────────────
  {
    id: 'anasayfa',
    type: 'sayfa',
    title: 'Ana Sayfa',
    description: 'MSGKO ana sayfası — Knight Online rehber platformu',
    action: 'link',
    href: '/',
    keywords: ['ana sayfa', 'msgko', 'anasayfa', 'msgko.net', 'home'],
    badge: 'Sayfa',
    badgeColor: 'purple',
  },
  {
    id: 'duyurular',
    type: 'sayfa',
    title: 'Duyurular',
    description: 'Knight Online güncel duyuruları ve patch notları',
    action: 'link',
    href: '/duyurular',
    keywords: ['duyuru', 'duyurular', 'patch', 'güncelleme', 'haber', 'yama', 'patch notes', 'etkinlik', 'event'],
    badge: 'Sayfa',
    badgeColor: 'amber',
  },
  {
    id: 'destek',
    type: 'sayfa',
    title: 'Destek',
    description: 'KoPazar, ByNoGame ve KnightPİN üzerinden destek ol',
    action: 'link',
    href: '/destek',
    keywords: ['destek', 'bağış', 'kopazar', 'bynogame', 'knightpin', 'donate', 'support', 'destekle'],
    badge: 'Sayfa',
    badgeColor: 'pink',
  },

  // ── Karakterler / Rehberler ───────────────────────────────────────────
  {
    id: 'asas-rehber',
    type: 'rehber',
    title: 'Asas Rehberi',
    description: 'Asas build, combo, skill dizilimi ve PK taktikleri',
    action: 'modal',
    modalId: 'asas',
    keywords: [
      'asas', 'asas rehber', 'asas build', 'asas combo', 'asas skill',
      'asas pk', 'asas taktik', 'asas nasıl oynanır', 'asas stat',
      'asas item', 'rogue', 'rogue build', 'asas dizilim', 'asas teknikleri',
    ],
    badge: 'Rehber',
    badgeColor: 'blue',
  },
  {
    id: 'okcu-rehber',
    type: 'rehber',
    title: 'Okçu Rehberi',
    description: 'Okçu build, skill dizilimi, PK taktikleri ve item rehberi',
    action: 'modal',
    modalId: 'okcu',
    keywords: [
      'okçu', 'okcu', 'okçu rehber', 'okçu build', 'okçu combo', 'okçu skill',
      'okçu pk', 'archer', 'archer build', 'okçu stat', 'okçu item', 'bow',
    ],
    badge: 'Rehber',
    badgeColor: 'blue',
  },
  {
    id: 'warrior-rehber',
    type: 'rehber',
    title: 'Warrior Rehberi',
    description: 'Knight Online warrior build, stat dağılımı ve PK rehberi',
    action: 'modal',
    modalId: 'yakinda',
    keywords: [
      'warrior', 'warrior rehber', 'warrior build', 'warrior pk',
      'savaşçı', 'tank', 'tank build', 'warrior stat', 'warrior item',
    ],
    badge: 'Yakında',
    badgeColor: 'amber',
  },
  {
    id: 'mage-rehber',
    type: 'rehber',
    title: 'Mage Rehberi',
    description: 'Knight Online mage build, INT stat ve PK taktikleri',
    action: 'modal',
    modalId: 'yakinda',
    keywords: [
      'mage', 'mage rehber', 'mage build', 'büyücü', 'sihirbaz',
      'aoe mage', 'mage stat', 'int build', 'mage pk', 'mage item',
    ],
    badge: 'Yakında',
    badgeColor: 'amber',
  },
  {
    id: 'priest-rehber',
    type: 'rehber',
    title: 'Priest Rehberi',
    description: 'Knight Online priest build, heal ve attack priest rehberi',
    action: 'modal',
    modalId: 'yakinda',
    keywords: [
      'priest', 'priest rehber', 'priest build', 'rahip', 'heal',
      'heal priest', 'attack priest', 'priest stat', 'buf', 'buff',
    ],
    badge: 'Yakında',
    badgeColor: 'amber',
  },

  // ── İçerik Kategorileri ───────────────────────────────────────────────
  {
    id: 'farm-rehber',
    type: 'kategori',
    title: 'Farm Rehberi',
    description: 'Exp farm rotaları, item farm bölgeleri ve WS taktikleri',
    action: 'link',
    href: '/#rehber-kategorileri',
    keywords: [
      'farm', 'exp farm', 'item farm', 'farm rotası', 'farm bölgesi',
      'exp', 'leveling', 'ws', 'ws taktik', 'ws farm',
    ],
    badge: 'Kategori',
    badgeColor: 'green',
  },
  {
    id: 'pk-rehber',
    type: 'kategori',
    title: 'PK Taktikleri',
    description: 'Knight Online PK taktikleri, kombo sırası ve WS rehberi',
    action: 'link',
    href: '/#rehber-kategorileri',
    keywords: [
      'pk', 'pvp', 'pk taktik', 'pk rehber', 'pk nasıl', 'kill',
      'combo', 'kombo', 'pvp taktik', 'arena', 'ws pk', 'pk build',
    ],
    badge: 'Kategori',
    badgeColor: 'red',
  },
  {
    id: 'anahtar-gorevi',
    type: 'rehber',
    title: 'Guardian of 7 Keys — Anahtar Görevi',
    description: 'Knight Online Guardian of 7 Keys anahtar görevi rehberi',
    action: 'link',
    href: '/#rehber-kategorileri',
    keywords: [
      'guardian of 7 keys', 'anahtar görevi', 'anahtar', '7 keys',
      'guardian', 'human görevi', 'görevi nasıl', 'quest',
    ],
    badge: 'Rehber',
    badgeColor: 'purple',
  },

  // ── Videolar ─────────────────────────────────────────────────────────
  {
    id: 'video-1',
    type: 'video',
    title: 'ZERO - NooaaH Culluk Asas WS İtemli Asas Movie 2026 | Knight Online',
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
    title: 'Knight Online — Güncel Rehber Guardian of 7 Keys | Anahtar Görevi Human',
    description: 'Guardian of 7 Keys anahtar görevi detaylı rehber videosu',
    action: 'external',
    externalUrl: 'https://www.youtube.com/watch?v=2N4zMIvjHSg',
    keywords: [
      'guardian of 7 keys', 'anahtar görevi', 'human', 'rehber', 'görev',
      'quest', '7 keys', 'guardian', 'anahtar video',
    ],
    badge: 'Video',
    badgeColor: 'red',
  },

  // ── Modaller / Paneller ───────────────────────────────────────────────
  {
    id: 'youtube-panel',
    type: 'modal',
    title: 'YouTube Videoları',
    description: 'Tüm Knight Online eğitim ve rehber videoları',
    action: 'modal',
    modalId: 'youtube',
    keywords: [
      'youtube', 'video', 'izle', 'shorts', 'kanal', 'yeni video',
      'son videolar', 'eğitim videosu', 'rehber video',
    ],
    badge: 'İçerik',
    badgeColor: 'red',
  },
  {
    id: 'instagram-panel',
    type: 'modal',
    title: 'Instagram Reels',
    description: 'msgclip Instagram kısa videolar ve highlight\'lar',
    action: 'modal',
    modalId: 'instagram',
    keywords: [
      'instagram', 'reel', 'reels', 'msgclip', 'kısa video',
      'highlight', 'clip', 'instagram video',
    ],
    badge: 'İçerik',
    badgeColor: 'pink',
  },
  {
    id: 'wallpaper',
    type: 'modal',
    title: 'Wallpaper Galerisi',
    description: 'MSGKO Knight Online duvar kağıtları — ücretsiz indir',
    action: 'modal',
    modalId: 'wallpaper',
    keywords: [
      'wallpaper', 'duvar kağıdı', 'arka plan', 'indirme', 'indir',
      'masaüstü', 'resim', 'görsel', 'background',
    ],
    badge: 'İçerik',
    badgeColor: 'purple',
  },
  {
    id: 'duyurular-modal',
    type: 'modal',
    title: 'Knight Online Duyuruları',
    description: 'Güncel Knight Online duyuruları, etkinlikler ve patch notları',
    action: 'modal',
    modalId: 'duyurular',
    keywords: [
      'duyuru', 'haber', 'patch', 'güncelleme', 'yama', 'etkinlik',
      'event', 'patch notes', 'ko duyuru',
    ],
    badge: 'Duyuru',
    badgeColor: 'amber',
  },
  {
    id: 'iletisim',
    type: 'modal',
    title: 'İletişim',
    description: 'Instagram ve e-posta ile iletişime geç',
    action: 'modal',
    modalId: 'iletisim',
    keywords: [
      'iletişim', 'iletisim', 'email', 'mail', 'instagram', 'ulaş',
      'mesaj', 'contact', 'msgclip',
    ],
    badge: 'Sayfa',
    badgeColor: 'purple',
  },
]

// ── Arama fonksiyonu ────────────────────────────────────────────────────────
export function searchItems(query: string, limit = 8): SearchItem[] {
  const q = query.toLowerCase().trim()
  if (q.length < 1) return []

  const scored = SEARCH_INDEX.map((item) => {
    let score = 0
    const titleLower = item.title.toLowerCase()
    const descLower = item.description.toLowerCase()

    // Başlıkta tam eşleşme — en yüksek skor
    if (titleLower === q) score += 100
    // Başlık ile başlıyor
    else if (titleLower.startsWith(q)) score += 80
    // Başlıkta geçiyor
    else if (titleLower.includes(q)) score += 60
    // Açıklamada geçiyor
    if (descLower.includes(q)) score += 20
    // Keyword tam eşleşme
    item.keywords.forEach((kw) => {
      if (kw === q) score += 50
      else if (kw.startsWith(q)) score += 35
      else if (kw.includes(q)) score += 20
      // Sorgu keyword içinde geçiyor
      else if (q.includes(kw) && kw.length > 3) score += 10
    })

    return { item, score }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.item)
}
