import type { Metadata } from 'next'
import { WallpaperClient } from './wallpaper-client'

export const metadata: Metadata = {
  title: 'Knight Online Wallpaper — MSGKO',
  description:
    'Knight Online duvar kağıtları. Ücretsiz Knight Online wallpaper, masaüstü ve mobil arka plan görselleri. MSGKO özel tasarım Knight Online ekran görselleri — msgko.net',
  keywords: [
    'knight online wallpaper', 'knight online duvar kağıdı', 'knight online arka plan',
    'knight online masaüstü wallpaper', 'knight online resim', 'knight online görsel',
    'msgko wallpaper', 'knight online hd wallpaper', 'knight online 4k wallpaper',
    'knight online background', 'knight online ekran görüntüsü',
    'knight online asas wallpaper', 'knight online okçu wallpaper',
    'ücretsiz knight online wallpaper', 'knight online telefon wallpaper',
  ],
  alternates: {
    canonical: 'https://msgko.net/wallpaper',
  },
  openGraph: {
    title: 'Knight Online Wallpaper — MSGKO',
    description: 'Ücretsiz Knight Online duvar kağıtları. Masaüstü ve mobil için özel tasarım Knight Online wallpaperlar.',
    url: 'https://msgko.net/wallpaper',
    type: 'website',
  },
}

export default function WallpaperPage() {
  return <WallpaperClient />
}
