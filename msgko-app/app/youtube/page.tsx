import type { Metadata } from 'next'
import { ArrowUpRight } from 'lucide-react'
import { YoutubePage } from './youtube-page'
import { PageHero } from '@/components/ui/PageHero'
import { YouTubeIcon } from '@/components/ui/BrandIcons'
import { getYoutubeVideosAndShorts } from '@/lib/youtube'
import { SITE_URL, SOCIAL } from '@/lib/site'
import { BASE_OPEN_GRAPH } from '@/lib/seo'

// Video listesi sunucuda üretilir ve saatte bir yenilenir
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'YouTube — MSGKO Knight Online',
  description: 'MSGKO YouTube kanalı. Knight Online asas, okçu, farm ve PK eğitim videoları. musaagll tarafından hazırlanmış güncel içerikler.',
  alternates: { canonical: `${SITE_URL}/youtube` },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    title: 'YouTube — MSGKO Knight Online',
    description: 'Knight Online eğitim videoları. Asas, okçu, farm ve PK taktikleri.',
    url: `${SITE_URL}/youtube`,
  },
}

export default async function Page() {
  const { videos, shorts } = await getYoutubeVideosAndShorts(24)

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Ana Sayfa', href: '/' }, { label: 'YouTube', href: '/youtube' }]}
        eyebrow="@musaagll"
        title="YouTube"
        description={
          <p>
            Knight Online eğitim videoları: asas ve okçu PK, farm rotaları, sınıf taktikleri ve oyun içi anlar.
            Tüm videolar musaagll tarafından hazırlanıyor.
          </p>
        }
      >
        <div className="flex flex-wrap gap-3">
          <a href={SOCIAL.youtubeSubscribe} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <YouTubeIcon size={18} />
            Abone Ol
          </a>
          <a href={SOCIAL.youtubeVideos} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            Kanala git
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </PageHero>

      <div className="container-site py-10 sm:py-14">
        <YoutubePage videos={videos} shorts={shorts} />
      </div>
    </>
  )
}
