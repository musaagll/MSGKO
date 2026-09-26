import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { FeatureCards } from '@/components/sections/FeatureCards'
import { LatestVideos } from '@/components/sections/LatestVideos'
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
    <>
      <HeroSection />
      <FeatureCards />
      <LatestVideos videos={videos} />
    </>
  )
}
