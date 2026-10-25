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
  // logo: koyu zemin için beyaz sürümler (public/partners)
  { id: 'kopazar', name: 'KoPazar', url: 'https://www.kopazar.com/streamer/musaagll', logo: { src: '/partners/kopazar.svg', width: 200, height: 50 } },
  { id: 'bynogame', name: 'ByNoGame', url: 'https://donate.bynogame.com/musaagll', logo: { src: '/partners/bynogame.png', width: 480, height: 134 } },
  { id: 'knightpin', name: 'KnightPin', url: 'https://www.knightpin.com/tr/donate/musaagll', logo: { src: '/partners/knightpin.png', width: 661, height: 246 } },
] as const

export interface NavLink {
  label: string
  href: string
  description?: string
}

/** Medya ve araçlar */
export const MEDIA_LINKS: NavLink[] = [
  { label: 'Videolar', href: '/youtube', description: 'YouTube eğitim videoları ve shorts' },
  { label: 'Instagram', href: '/instagram', description: 'Kısa klipler ve reels' },
  { label: 'Wallpaper', href: '/wallpaper', description: 'HD Knight Online duvar kağıtları' },
]

export const SECONDARY_LINKS: NavLink[] = [
  { label: 'Destek Ol', href: '/destek' },
  { label: 'İletişim', href: '/iletisim' },
]
