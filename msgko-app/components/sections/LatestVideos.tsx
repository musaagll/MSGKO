import { ArrowUpRight } from 'lucide-react'
import { VideoCard } from '@/components/cards/VideoCard'
import { YouTubeIcon } from '@/components/ui/BrandIcons'
import { SectionAction, SectionHeading } from '@/components/ui/SectionHeading'
import type { YTVideo } from '@/lib/youtube'
import { SOCIAL } from '@/lib/site'

/** Ana sayfa: son videolar — tarayıcı çerçeveli kartlar (masaüstü 3, tablet 2, mobil 1 kolon) */
export function LatestVideos({ videos }: { videos: YTVideo[] }) {
  return (
    <section aria-labelledby="son-videolar" className="section">
      <div className="container-site">
        <SectionHeading
          id="son-videolar"
          eyebrow="YouTube"
          title="Son Videolar"
          description="PK, farm ve sınıf taktikleri — @musaagll kanalından en yeni içerikler."
        />

        {videos.length > 0 ? (
          <>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((v, i) => (
                <li key={v.id} className={`reveal ${i === 2 ? 'sm:hidden lg:block' : ''}`}>
                  <VideoCard video={v} variant="framed" />
                </li>
              ))}
            </ul>
            <SectionAction label="Tüm Videolar" href="/youtube" />
          </>
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
