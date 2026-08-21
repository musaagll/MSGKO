import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { YoutubeVideoSection } from '@/components/sections/YoutubeVideoSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { ReklamSection } from '@/components/sections/ReklamSection'
import { AdSense } from '@/components/ui/AdSense'
import { getYoutubeVideos } from '@/lib/youtube'
import type { YTVideo } from '@/lib/youtube'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'MSGKO - Knight Online Gelişim & Strateji Rehberi',
  description:
    'Karakter gelişiminden farm, WS, PK stratejilerine; meta analizlerinden profesyonel eğitimlere kadar kapsamlı içerik deneyimi burada seni bekliyor. Knight Online\'a dair her şey burada.',
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
      <HeroSection />
      <YoutubeVideoSection videos={videos} />
      {/* Video bölümü ile features arasında reklam */}
      <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 py-4">
        <AdSense slot="8727584512" />
      </div>
      <FeaturesSection />
      <ReklamSection />

    </main>
  )
}
