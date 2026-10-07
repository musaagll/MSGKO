/**
 * Site genelindeki sabitler — kök adres, navigasyon, sosyal hesaplar, iletişim.
 * Header, footer, mobil menü ve arama bu tek kaynaktan beslenir.
 */

/**
 * Sitenin kanonik kök adresi — canonical, sitemap, robots, OG ve JSON-LD
 * hepsi bu tek değerden üretilir. Host (www / apex) tercihi değişirse
 * yalnızca burası güncellenir.
 */
export const SITE_URL = 'https://msgko.net'

export const SOCIAL = {
  youtube: 'https://www.youtube.com/@musaagll',
  youtubeSubscribe: 'https://www.youtube.com/@musaagll?sub_confirmation=1',
  youtubeVideos: 'https://www.youtube.com/@musaagll/videos',
  instagram: 'https://www.instagram.com/msgclip/',
  instagramDm: 'https://ig.me/m/msgclip',
  x: 'https://x.com/musaagll',
} as const

export const CONTACT_EMAIL = 'imusaagll@gmail.com'

export const SUPPORT_PLATFORMS = [
  { id: 'kopazar', name: 'KoPazar', url: 'https://www.kopazar.com/streamer/musaagll' },
  { id: 'bynogame', name: 'ByNoGame', url: 'https://donate.bynogame.com/musaagll' },
  { id: 'knightpin', name: 'KnightPin', url: 'https://www.knightpin.com/tr/donate/musaagll' },
] as const

export interface NavLink {
  label: string
  href: string
  description?: string
}

/** Veritabanı bölümleri — header açılır menüsü, footer ve ana sayfa */
export const DATABASE_LINKS: NavLink[] = [
  { label: 'Boss Rehberleri', href: '/boss', description: 'Spawn yeri, drop listesi ve taktikler' },
  { label: 'Haritalar', href: '/harita', description: 'Farm noktaları, bosslar ve NPC’ler' },
  { label: 'Item Veritabanı', href: '/item', description: 'Özellikler, drop ve upgrade bilgisi' },
]

/** Medya ve araçlar */
export const MEDIA_LINKS: NavLink[] = [
  { label: 'Videolar', href: '/youtube', description: 'YouTube eğitim videoları ve shorts' },
  { label: 'Instagram', href: '/instagram', description: 'Kısa klipler ve reels' },
  { label: 'Wallpaper', href: '/wallpaper', description: 'HD Knight Online duvar kağıtları' },
  { label: 'GB Fiyatları', href: '/gb-fiyatlari', description: 'Sitelerin GB fiyat karşılaştırması' },
]

export const SECONDARY_LINKS: NavLink[] = [
  { label: 'Destek Ol', href: '/destek' },
  { label: 'İletişim', href: '/iletisim' },
]
