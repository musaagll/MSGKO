import type { NavItem, SocialLink, Feature } from './types'

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

// ─── Social ───────────────────────────────────────────────────────────────────

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: 'youtube', url: 'https://www.youtube.com/@musaagll', label: 'YouTube Kanalı' },
  { platform: 'instagram', url: 'https://www.instagram.com/msgclip/', label: 'Instagram' },
]
