import type { NavItem, FooterColumn, SocialLink, Feature } from './types'

// ─── Navigation ──────────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  { label: 'Ana Sayfa', href: '/' },
]

// ─── Features ────────────────────────────────────────────────────────────────

export const FEATURES: Feature[] = [
  {
    id: '1',
    icon: '✕',
    title: 'Güncel İçerik',
    description: "Knight Online'ın en güncel bilgileri ve taktikleri.",
  },
  {
    id: '2',
    icon: '▶',
    title: 'Detaylı Anlatım',
    description: 'Adım adım, anlaşılır ve uygulamalı anlatımlar.',
  },
  {
    id: '3',
    icon: '◎',
    title: 'Profesyonel Taktikler',
    description: 'Deneyimli oyunculardan özel taktikler ve ipuçları.',
  },
  {
    id: '4',
    icon: '◈',
    title: 'Kaliteli İçerik',
    description: 'Yüksek kaliteli ve düzenli eğitim videoları.',
  },
]

// ─── Footer ───────────────────────────────────────────────────────────────────

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: 'HIZLI ERİŞİM',
    links: [
      { label: 'Ana Sayfa', href: '/' },
      { label: 'Asas Eğitimleri', href: '/kategoriler/asas' },
      { label: 'Okçu Eğitimleri', href: '/kategoriler/okcu' },
      { label: 'İletişim', href: '/iletisim' },
    ],
  },
  {
    heading: 'KATEGORİLER',
    links: [
      { label: 'Asas PK Taktikleri', href: '/kategoriler/asas' },
      { label: 'Asas Farm Rotaları', href: '/kategoriler/asas' },
      { label: 'Okçu PK Taktikleri', href: '/kategoriler/okcu' },
      { label: 'Okçu Skill Rehberleri', href: '/kategoriler/okcu' },
      { label: 'Okçu Farm Rotaları', href: '/kategoriler/okcu' },
    ],
  },
]

// ─── Social ───────────────────────────────────────────────────────────────────

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: 'youtube', url: 'https://www.youtube.com/@musaagll', label: 'YouTube Kanalı' },
  { platform: 'instagram', url: 'https://www.instagram.com/msgclip/', label: 'Instagram' },
]
