import Image from 'next/image'
import { Play } from 'lucide-react'
import type { YTVideo } from '@/lib/youtube'
import { formatViews, timeAgo } from '@/lib/utils'

/** YouTube video kartı — doküman: thumbnail, başlık, yazar, izlenme, tarih, süre */
export function VideoCard({ video, sizes, as: Heading = 'h3' }: { video: YTVideo; sizes?: string; as?: 'h2' | 'h3' }) {
  return (
    <a
      href={video.youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-2xl focus-visible:outline-offset-4"
    >
      <div className="card relative aspect-video overflow-hidden">
        {video.thumbnail && (
          <Image
            src={video.thumbnail}
            alt=""
            fill
            sizes={sizes ?? '(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw'}
            className="zoom-media object-cover"
          />
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 scale-90 items-center justify-center rounded-full bg-white/90 text-ink-950 opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
        >
          <Play size={20} className="ml-0.5 fill-current" />
        </span>
        {video.durationFormatted && (
          <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white">
            {video.durationFormatted}
          </span>
        )}
      </div>
      <div className="px-0.5">
        <Heading className="line-clamp-2 font-semibold leading-snug text-fg transition-colors group-hover:text-amethyst-200">
          {video.title}
        </Heading>
        <p className="mt-1.5 text-sm text-fg-4">
          musaagll · {formatViews(video.views)} izlenme · {timeAgo(video.publishedAt)}
        </p>
      </div>
    </a>
  )
}
