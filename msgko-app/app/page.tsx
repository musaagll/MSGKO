import { HeroSection } from '@/components/sections/HeroSection'
import { YoutubeVideoSection } from '@/components/sections/YoutubeVideoSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { getYoutubeVideos } from '@/lib/youtube'
import type { YTVideo } from '@/lib/youtube'

export const revalidate = 3600 // Her 1 saatte bir yenile

export default async function HomePage() {
  let videos: YTVideo[] = []
  try {
    videos = await getYoutubeVideos(4)
  } catch {
    // YouTube API hatası durumunda boş liste ile devam et
    videos = []
  }

  return (
    <main>
      <HeroSection />
      <YoutubeVideoSection videos={videos} />
      <FeaturesSection />
    </main>
  )
}
