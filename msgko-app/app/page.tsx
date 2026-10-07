import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { ClassGuideSection } from '@/components/sections/ClassGuideSection'
import { LatestVideos } from '@/components/sections/LatestVideos'
import { QuickAccessSection } from '@/components/sections/QuickAccessSection'
import { FeatureCards } from '@/components/sections/FeatureCards'
import { WallpaperTeaser } from '@/components/sections/WallpaperTeaser'
import { CommunitySection } from '@/components/sections/CommunitySection'
import { getYoutubeVideos } from '@/lib/youtube'
import type { YTVideo } from '@/lib/youtube'
import { SITE_URL } from '@/lib/site'

export const revalidate = 3600

export const metadata: Metadata = {
  title: {
    absolute: 'MSGKO — Knight Online Rehber Platformu',
  },
  description:
    'MSGKO.net — Türkiye\'nin Knight Online rehber platformu. Asas, Okçu, Warrior, Mage, Priest build rehberleri, boss drop listesi, harita rehberleri, farm rotaları ve güncel içerikler.',
  alternates: {
    canonical: SITE_URL,
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
      <ClassGuideSection />
      <LatestVideos videos={videos} />
      <QuickAccessSection />
      <FeatureCards />
      <WallpaperTeaser />
      <CommunitySection />
    </>
  )
}
