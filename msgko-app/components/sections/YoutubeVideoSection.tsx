'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play, Eye, Clock, ArrowUpRight } from 'lucide-react'
import type { YTVideo } from '@/lib/youtube'
import { formatViews, timeAgo } from '@/lib/utils'

interface Props { videos: YTVideo[] }

export function YoutubeVideoSection({ videos }: Props) {
  if (!videos.length) return null

  const [featured, ...rest] = videos
  const secondary = rest.slice(0, 3)

  return (
    <section className="relative overflow-hidden" aria-label="Son videolar"
      style={{ padding: 'var(--section-py) 0', background: 'var(--bg-void)' }}>

      {/* ── Arka plan ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 65% 50% at 50% 0%, rgba(212,168,83,0.04) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 0% 100%,  rgba(184,144,58,0.03) 0%, transparent 50%)
          `,
        }}
      />

      {/* ── Üst çizgi ── */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.25), rgba(212,168,83,0.18), transparent)' }}
      />

      <div className="relative max-w-[1280px] mx-auto"
        style={{ padding: '0 clamp(1.25rem, 4vw, 2.5rem)' }}>

        {/* ── Section başlık ── */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.p
              className="section-label mb-2"
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            >
              Eğitim İçerikleri
            </motion.p>
            <motion.h2
              className="text-platinum"
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              style={{
                fontFamily: 'var(--font-rajdhani), sans-serif',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                fontWeight: 900,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Son Videolar
            </motion.h2>
          </div>

          <motion.a
            href="https://www.youtube.com/@musaagll/videos"
            target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            whileHover={{ y: -2 }}
            className="hidden sm:flex items-center gap-2 text-[0.72rem] font-bold tracking-[0.12em] uppercase transition-all duration-250"
            style={{
              padding: '0.6rem 1.25rem',
              border: '1px solid rgba(212,168,83,0.25)',
              background: 'rgba(212,168,83,0.04)',
              color: 'rgba(212,168,83,0.65)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'rgba(212,168,83,0.55)'
              el.style.background  = 'rgba(212,168,83,0.09)'
              el.style.color       = 'rgba(212,168,83,1)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'rgba(212,168,83,0.25)'
              el.style.background  = 'rgba(212,168,83,0.04)'
              el.style.color       = 'rgba(212,168,83,0.65)'
            }}
          >
            Tümünü Gör
            <ArrowUpRight size={12} aria-hidden="true" />
          </motion.a>
        </div>

        {/* ══════════════════════════════════════════════════
            LAYOUT — İlk video büyük (editorial), diğerleri yan
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">

          {/* ── Büyük / Featured kart ── */}
          <motion.a
            href={featured.youtubeUrl}
            target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -4 }}
            className="group relative block overflow-hidden"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              transition: 'border-color 0.35s ease, box-shadow 0.35s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'var(--border-gold)'
              el.style.boxShadow   = 'var(--shadow-gold)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'var(--border-subtle)'
              el.style.boxShadow   = 'none'
            }}
            aria-label={`${featured.title} videosunu izle`}
          >
            {/* Thumbnail */}
            <div className="relative overflow-hidden bg-[#0A0A0F]" style={{ aspectRatio: '16/9' }}>
              {featured.thumbnail ? (
                <Image
                  src={featured.thumbnail} alt={featured.title} fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0F0F16, var(--bg-void))' }} />
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 45%, transparent 100%)' }}
              />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-350">
                <div className="w-16 h-16 flex items-center justify-center"
                  style={{
                    background: 'rgba(212,168,83,0.92)',
                    boxShadow: '0 0 40px rgba(212,168,83,0.45)',
                  }}>
                  <Play size={22} className="text-black ml-0.5" fill="currentColor" />
                </div>
              </div>

              {/* Duration */}
              {featured.durationFormatted && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5"
                  style={{
                    background: 'rgba(0,0,0,0.88)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}>
                  <Clock size={9} style={{ color: 'var(--gold-bright)' }} />
                  <span className="text-[0.65rem] font-bold" style={{ color: 'rgba(242,242,244,0.85)' }}>
                    {featured.durationFormatted}
                  </span>
                </div>
              )}

              {/* Featured badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1"
                style={{
                  background: 'rgba(212,168,83,0.12)',
                  border: '1px solid rgba(212,168,83,0.3)',
                }}>
                <span className="text-[0.58rem] font-bold tracking-[0.2em] uppercase"
                  style={{ color: 'rgba(212,168,83,0.9)' }}>Son Video</span>
              </div>
            </div>

            {/* Info */}
            <div className="p-5">
              <h3
                className="font-bold leading-snug mb-3 transition-colors duration-200"
                style={{
                  fontSize: 'clamp(0.92rem, 1.4vw, 1.05rem)',
                  color: 'rgba(242,242,244,0.88)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--gold-bright)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(242,242,244,0.88)' }}
              >
                {featured.title}
              </h3>

              <div className="flex items-center gap-3 text-[0.68rem]"
                style={{ color: 'rgba(160,160,184,0.42)' }}>
                <div className="flex items-center gap-1.5">
                  <Image src="/logo.png" alt="MSG" width={12} height={12}
                    className="opacity-60" style={{ mixBlendMode: 'screen' }} />
                  <span>MSG</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
                <div className="flex items-center gap-1">
                  <Eye size={9} />
                  <span>{formatViews(featured.views)}</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
                <span>{timeAgo(featured.publishedAt)}</span>
              </div>
            </div>

            {/* Gold bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left"
              style={{ background: 'linear-gradient(90deg, var(--gold-bright), rgba(212,168,83,0.3), transparent)' }}
            />
          </motion.a>

          {/* ── Sağ kolon — 3 küçük kart ── */}
          <div className="flex flex-col gap-3">
            {secondary.map((video, i) => (
              <motion.a
                key={video.id}
                href={video.youtubeUrl}
                target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.1, duration: 0.55 }}
                whileHover={{ x: 4 }}
                className="group flex gap-3 overflow-hidden"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.75rem',
                  transition: 'border-color 0.3s ease, background 0.3s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'rgba(212,168,83,0.2)'
                  el.style.background  = 'rgba(212,168,83,0.025)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'var(--border-subtle)'
                  el.style.background  = 'var(--bg-surface)'
                }}
                aria-label={`${video.title} videosunu izle`}
              >
                {/* Thumbnail */}
                <div className="relative flex-shrink-0 overflow-hidden bg-[#0A0A0F]"
                  style={{ width: 120, aspectRatio: '16/9' }}>
                  {video.thumbnail ? (
                    <Image
                      src={video.thumbnail} alt={video.title} fill
                      sizes="120px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                  ) : (
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0F0F16, var(--bg-void))' }} />
                  )}
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250">
                    <div className="w-8 h-8 flex items-center justify-center"
                      style={{ background: 'rgba(212,168,83,0.88)' }}>
                      <Play size={12} className="text-black ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                  {video.durationFormatted && (
                    <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5"
                      style={{ background: 'rgba(0,0,0,0.88)' }}>
                      <span className="text-[0.58rem] font-bold" style={{ color: 'rgba(242,242,244,0.8)' }}>
                        {video.durationFormatted}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <h3 className="text-[0.78rem] font-semibold leading-snug line-clamp-2 transition-colors duration-200"
                    style={{ color: 'rgba(242,242,244,0.78)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(212,168,83,0.85)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(242,242,244,0.78)' }}
                  >
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[0.62rem]"
                    style={{ color: 'rgba(160,160,184,0.35)' }}>
                    <div className="flex items-center gap-1">
                      <Eye size={8} />
                      <span>{formatViews(video.views)}</span>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.08)' }}>·</span>
                    <span>{timeAgo(video.publishedAt)}</span>
                  </div>
                </div>
              </motion.a>
            ))}

            {/* "Tüm videolar" linki — küçük ekranlarda */}
            <a
              href="https://www.youtube.com/@musaagll/videos"
              target="_blank" rel="noopener noreferrer"
              className="sm:hidden flex items-center justify-center gap-2 py-3 text-[0.7rem] font-bold tracking-[0.12em] uppercase transition-all duration-250 mt-1"
              style={{
                border: '1px solid rgba(212,168,83,0.2)',
                color: 'rgba(212,168,83,0.6)',
              }}
            >
              Tümünü Gör <ArrowUpRight size={11} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
