import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { YoutubeVideoSection } from '@/components/sections/YoutubeVideoSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { GbKuruSection } from '@/components/sections/GbKuruSection'
import { EtkinlikSection } from '@/components/sections/EtkinlikSection'
import { QuickAccessSection } from '@/components/sections/QuickAccessSection'
import { ClassGuideSection } from '@/components/sections/ClassGuideSection'
import { SponsorAd } from '@/components/ui/SponsorAd'
import { getYoutubeVideos } from '@/lib/youtube'
import type { YTVideo } from '@/lib/youtube'

export const revalidate = 3600

export const metadata: Metadata = {
  title: {
    absolute: 'MSGKO — Knight Online Rehber Platformu',
  },
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
      {/* Canlı GB kuru ticker */}
      <GbKuruSection />

      {/* Cinematic hero */}
      <HeroSection />

      {/* Hızlı erişim — Oyun Merkezi */}
      <QuickAccessSection />

      {/* Son videolar */}
      <YoutubeVideoSection videos={videos} />

      {/* Karakter sınıfı rehberleri */}
      <ClassGuideSection />

      {/* Sponsor reklam şeridi — içerik bölümleri arasında */}
      <SponsorAd />

      {/* Platform özellikleri */}
      <FeaturesSection />

      {/* Etkinlik takvimi */}
      <EtkinlikSection />
    </main>
  )
}
