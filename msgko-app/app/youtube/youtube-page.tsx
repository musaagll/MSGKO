import Image from 'next/image'
import { ArrowUpRight, Play } from 'lucide-react'
import { VideoCard } from '@/components/cards/VideoCard'
import { YouTubeIcon } from '@/components/ui/BrandIcons'
import type { YTVideo } from '@/lib/youtube'
import { formatViews } from '@/lib/utils'
import { SOCIAL } from '@/lib/site'

/** YouTube sayfası içeriği — veriler sunucuda çekilir (ISR), istemci JS'i yok */
export function YoutubePage({ videos, shorts }: { videos: YTVideo[]; shorts: YTVideo[] }) {
  if (videos.length === 0 && shorts.length === 0) {
    return (
      <div className="card flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-fg-3">Videolar şu an yüklenemedi. Tüm içeriklere YouTube kanalından ulaşabilirsin.</p>
        <a href={SOCIAL.youtubeVideos} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
          <YouTubeIcon size={18} />
          Kanala git
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-16">
      {videos.length > 0 && (
        <section aria-labelledby="videolar">
          <h2 id="videolar" className="display-md mb-8">Videolar</h2>
          <ul className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <li key={v.id}>
                <VideoCard video={v} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {shorts.length > 0 && (
        <section aria-labelledby="shorts">
          <h2 id="shorts" className="display-md mb-8">Shorts</h2>
          <ul className="scroller -mx-5 scroll-px-5 px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0">
            {shorts.map((v) => (
              <li key={v.id} className="w-[44vw] max-w-52 sm:w-[30vw] lg:w-auto lg:max-w-none">
                <a href={v.youtubeUrl} target="_blank" rel="noopener noreferrer" className="group block">
                  <span className="card relative block aspect-9/16 overflow-hidden">
                    {v.thumbnail && (
                      <Image src={v.thumbnail} alt="" fill sizes="(min-width: 1024px) 220px, 44vw" className="zoom-media object-cover" />
                    )}
                    <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent" />
                    <span className="absolute left-2 top-2 rounded-md bg-ember-500 px-1.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-white">Short</span>
                    <span className="absolute bottom-2 left-2 flex items-center gap-1 text-xs font-semibold text-white">
                      <Play size={12} aria-hidden="true" className="fill-current" />
                      {formatViews(v.views)}
                    </span>
                  </span>
                  <h3 className="mt-2.5 line-clamp-2 text-sm font-semibold leading-snug text-fg transition-colors group-hover:text-amethyst-200">
                    {v.title}
                  </h3>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
