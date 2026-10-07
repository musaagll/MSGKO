import { ArrowUpRight } from 'lucide-react'
import { VideoCard } from '@/components/cards/VideoCard'
import { YouTubeIcon } from '@/components/ui/BrandIcons'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { YTVideo } from '@/lib/youtube'
import { SOCIAL } from '@/lib/site'

/** Ana sayfa: son 4 video (doküman: masaüstü 4, tablet 2, mobil 1 kolon) */
export function LatestVideos({ videos }: { videos: YTVideo[] }) {
  return (
    <section aria-labelledby="son-videolar" className="section border-y border-white/6 bg-ink-900/40">
      <div className="container-site">
        <SectionHeading
          id="son-videolar"
          eyebrow="YouTube"
          title="Son Videolar"
          description="PK, farm ve sınıf taktikleri — @musaagll kanalından en yeni içerikler."
          action={{ label: 'Tüm videolar', href: '/youtube' }}
        />

        {videos.length > 0 ? (
          <ul className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {videos.map((v) => (
              <li key={v.id}>
                <VideoCard video={v} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="card flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-fg-3">Videolar şu an yüklenemedi. Tüm içeriklere YouTube kanalından ulaşabilirsin.</p>
            <a href={SOCIAL.youtubeVideos} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              <YouTubeIcon size={18} />
              Kanala git
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
