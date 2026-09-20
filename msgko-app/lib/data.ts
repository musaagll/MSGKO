import type { NavItem, SocialLink, Feature } from './types'

// ─── Navigation ──────────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  { label: 'Ana Sayfa', href: '/' },
]

// ─── Features ────────────────────────────────────────────────────────────────

export const FEATURES: Feature[] = [
  {
    id: '1',
    icon: '⚔',
    title: '4 Sınıf Rehberi',
    description: 'Warrior, Rogue, Mage ve Priest için skill ağaçları, stat dağılımı ve Master açma rehberleri — hepsi tek platformda.',
  },
  {
    id: '2',
    icon: '▶',
    title: '120+ Video',
    description: 'Asas combo\'dan farm rotasına, PK taktiklerinden boss öldürmeye kadar gerçek oyun görüntülü içerik.',
  },
  {
    id: '3',
    icon: '◎',
    title: '9 Site GB Karşılaştırma',
    description: 'KnightPin, ByNoGame, KoPazar dahil 9 platformun anlık GB kurunu tek ekranda karşılaştır.',
  },
  {
    id: '4',
    icon: '◈',
    title: 'Canlı USKO Pazar',
    description: 'Zero, Destan, Pandora ve Agartha sunucularından anlık pazar ilanları — fiyat, +level ve satıcı filtresiyle.',
  },
]

// ─── Social ───────────────────────────────────────────────────────────────────

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: 'youtube', url: 'https://www.youtube.com/@musaagll', label: 'YouTube Kanalı' },
  { platform: 'instagram', url: 'https://www.instagram.com/msgclip/', label: 'Instagram' },
]
