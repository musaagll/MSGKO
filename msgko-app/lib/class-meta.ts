/**
 * Sınıflara ait sunum verileri — görsel, rol etiketi, kısa slogan.
 * Oyun verisi lib/ko-data/classes.ts'te; burası yalnızca tasarım katmanı.
 */
import type { KOClassSlug } from '@/lib/ko-data/classes'

export interface ClassMeta {
  /** Karakter çizimi (public/wallpaper — wallpaper sayfasıyla aynı dosyalar) */
  art: string
  /** Kırpmada karakterin konumu (object-position) */
  focus: string
  /** Sınıfı simgeleyen silah render'ı */
  weapon: string
  role: string
  tagline: string
}

const wp = (name: string) => `/wallpaper/ChatGPT Image 9 Haz 2026 ${name}.png`

export const CLASS_META: Record<KOClassSlug, ClassMeta> = {
  warrior: {
    art: wp('19_57_36'),
    focus: '50% 30%',
    weapon: '/dreadshield.png',
    role: 'Tank · Yakın Dövüş',
    tagline: 'Ön safın sarsılmaz duvarı',
  },
  assassin: {
    art: wp('12_29_30'),
    focus: '45% 30%',
    weapon: '/assassin-icon.png',
    role: 'DPS · Gizlilik',
    tagline: 'Gölgelerden gelen tek kombo',
  },
  archer: {
    art: wp('12_29_13'),
    focus: '45% 30%',
    weapon: '/archer-icon.png',
    role: 'DPS · Menzil',
    tagline: 'Uzaktan gelen ölümcül yağmur',
  },
  mage: {
    art: wp('20_06_28'),
    focus: '40% 30%',
    weapon: '/staffwoe.png',
    role: 'Büyü · Alan Hasarı',
    tagline: 'Elementlere hükmeden güç',
  },
  priest: {
    art: wp('19_54_36'),
    focus: '50% 30%',
    weapon: '/dreadshield.png',
    role: 'Heal · Destek',
    tagline: 'Partinin hayat çizgisi',
  },
}

/** Veritabanı bölümlerinin kapak görselleri */
export const SECTION_ART = {
  boss: wp('20_02_08'),
  harita: wp('12_29_20'),
  item: wp('19_52_34'),
  wallpaper: wp('20_00_52'),
} as const
