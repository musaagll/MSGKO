import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { YoutubeVideoSection } from '@/components/sections/YoutubeVideoSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { GbKuruSection } from '@/components/sections/GbKuruSection'
import { EtkinlikSection } from '@/components/sections/EtkinlikSection'
import { SponsorAd } from '@/components/ui/SponsorAd'
import { getYoutubeVideos } from '@/lib/youtube'
import type { YTVideo } from '@/lib/youtube'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'MSGKO.net — Knight Online Rehber ve Eğitim Sitesi',
  description:
    'MSGKO.net — Türkiye\'nin Knight Online rehber platformu. Asas, Okçu, Warrior, Mage, Priest build rehberleri, boss drop listesi, harita rehberleri, farm rotaları ve güncel içerikler.',
  alternates: {
    canonical: 'https://msgko.net',
  },
}

export default async function HomePage() {
  let videos: YTVideo[] = []
  try {
    videos = await getYoutubeVideos(4)
  } catch {
    videos = []
  }

  return (
    <main>
      <GbKuruSection />
      <HeroSection />
      <SponsorAd />
      <YoutubeVideoSection videos={videos} />
      <FeaturesSection />
      <EtkinlikSection />
    </main>
  )
}
