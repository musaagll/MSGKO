import Image from 'next/image'
import { ArrowUpRight, Play } from 'lucide-react'
import type { YTVideo } from '@/lib/youtube'
import { formatViews, timeAgo } from '@/lib/utils'

interface VideoCardProps {
  video: YTVideo
  sizes?: string
  as?: 'h2' | 'h3'
  /** framed: tarayıcı penceresi çerçeveli büyük kart (ana sayfa) */
  variant?: 'plain' | 'framed'
}

/** YouTube video kartı — thumbnail, başlık, yazar, izlenme, tarih, süre */
export function VideoCard({ video, sizes, as: Heading = 'h3', variant = 'plain' }: VideoCardProps) {
  const thumb = (
    <>
      {video.thumbnail && (
        <Image
          src={video.thumbnail}
          alt=""
          fill
          sizes={sizes ?? '(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw'}
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
    </>
  )
  const meta = `musaagll · ${formatViews(video.views)} izlenme · ${timeAgo(video.publishedAt)}`

  if (variant === 'framed') {
    return (
      <a
        href={video.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group card card-interactive flex h-full flex-col overflow-hidden"
      >
        <div className="browser-bar">
          <span lang="en">youtube.com</span>
        </div>
        <div className="relative aspect-video overflow-hidden bg-black">{thumb}</div>
        <div className="flex flex-1 flex-col p-6">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amethyst-400">YouTube</span>
          <Heading className="mt-2 line-clamp-2 text-lg font-bold leading-snug tracking-tight text-fg">{video.title}</Heading>
          <p className="mt-2 text-sm text-fg-3">{meta}</p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-amethyst-400 transition-colors group-hover:text-amethyst-300">
            Videoyu İzle
            <ArrowUpRight size={15} aria-hidden="true" />
          </span>
        </div>
      </a>
    )
  }

  return (
    <a
      href={video.youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-2xl focus-visible:outline-offset-4"
    >
      <div className="card relative aspect-video overflow-hidden">{thumb}</div>
      <div className="px-0.5">
        <Heading className="line-clamp-2 font-semibold leading-snug text-fg transition-colors group-hover:text-amethyst-200">
          {video.title}
        </Heading>
        <p className="mt-1.5 text-sm text-fg-4">{meta}</p>
      </div>
    </a>
  )
}
