'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play, Eye, Clock, ArrowUpRight } from 'lucide-react'
import type { YTVideo } from '@/lib/youtube'
import { formatViews, timeAgo } from '@/lib/utils'

export function YoutubeVideoSection({ videos }: { videos: YTVideo[] }) {
  if (!videos.length) return null

  const [featured, ...rest] = videos
  const secondary = rest.slice(0, 3)

  return (
    <section
      style={{
        position: 'relative',
        padding: 'var(--section-pt) 0 var(--section-pb)',
        background: 'var(--abyss)',
        overflow: 'hidden',
      }}
      aria-label="Son videolar"
    >
      {/* Arka plan */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 55% at 100% 0%, rgba(200,150,12,0.07) 0%, transparent 55%)',
      }} />
      <div className="grid-overlay" />

      {/* Üst çizgi */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, var(--border-crimson), transparent)' }} />

      <div style={{ position: 'relative', maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--page-px)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <motion.p
              className="section-label"
              style={{ marginBottom: 10 }}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            >
              Eğitim İçerikleri
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.06 }}
              style={{
                fontFamily: 'var(--font-rajdhani), sans-serif',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 900,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--platinum)',
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
            className="btn-ghost hidden sm:flex"
          >
            Tümünü Gör <ArrowUpRight size={12} />
          </motion.a>
        </div>

        {/* Grid: 1 büyük + 3 küçük */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1,1fr)', gap: 16 }}
          className="lg:grid-cols-[1fr_360px]">

          {/* Featured kart */}
          <motion.a
            href={featured.youtubeUrl}
            target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="card-gaming group"
            style={{ display: 'block', textDecoration: 'none' }}
            aria-label={`${featured.title} videosunu izle`}
          >
            {/* Thumbnail */}
            <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--void)' }}>
              {featured.thumbnail && (
                <Image
                  src={featured.thumbnail} alt={featured.title} fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
              )}
              {/* Gradient */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,10,15,0.9) 0%, rgba(8,10,15,0.2) 40%, transparent 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,10,15,0.3) 0%, transparent 40%)' }} />

              {/* Play butonu */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: 'opacity 0.3s',
              }} className="group-hover:opacity-100">
                <div style={{
                  width: 64, height: 64,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--crimson)',
                  boxShadow: '0 0 40px rgba(200,150,12,0.6)',
                }}>
                  <Play size={24} fill="white" color="white" style={{ marginLeft: 3 }} />
                </div>
              </div>

              {/* Duration */}
              {featured.durationFormatted && (
                <div style={{
                  position: 'absolute', bottom: 12, right: 12,
                  display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px',
                  background: 'rgba(8,10,15,0.9)',
                  border: '1px solid var(--border)',
                }}>
                  <Clock size={9} style={{ color: 'var(--crimson-bright)' }} />
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--platinum)' }}>{featured.durationFormatted}</span>
                </div>
              )}

              {/* NEW badge */}
              <div style={{
                position: 'absolute', top: 12, left: 12,
              }} className="badge badge-crimson">
                En Son Video
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: '16px 20px 20px' }}>
              <h3 style={{
                fontSize: '1rem', fontWeight: 700, lineHeight: 1.45,
                color: 'var(--platinum)', marginBottom: 10,
                transition: 'color 0.2s',
              }} className="group-hover:text-crimson-bright">
                {featured.title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.65rem', color: 'var(--iron)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Image src="/logo.png" alt="MSG" width={12} height={12} style={{ mixBlendMode: 'screen', opacity: 0.7 }} />
                  <span>MSG</span>
                </div>
                <span>·</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Eye size={9} />
                  <span>{formatViews(featured.views)}</span>
                </div>
                <span>·</span>
                <span>{timeAgo(featured.publishedAt)}</span>
              </div>
            </div>

            {/* Alt kırmızı çizgi */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, var(--crimson), var(--ember), transparent)',
              transform: 'scaleX(0)', transformOrigin: 'left',
              transition: 'transform 0.4s ease',
            }} className="group-hover:scale-x-100" />
          </motion.a>

          {/* Sağ küçük kartlar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {secondary.map((video, i) => (
              <motion.a
                key={video.id}
                href={video.youtubeUrl}
                target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.15, duration: 0.5 }}
                whileHover={{ x: 4 }}
                className="card-gaming group"
                style={{ display: 'flex', gap: 12, padding: '10px', textDecoration: 'none' }}
                aria-label={`${video.title} videosunu izle`}
              >
                {/* Thumb */}
                <div style={{ position: 'relative', width: 112, flexShrink: 0, aspectRatio: '16/9', overflow: 'hidden', background: 'var(--void)' }}>
                  {video.thumbnail && (
                    <Image src={video.thumbnail} alt={video.title} fill sizes="112px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.08]" />
                  )}
                  <div style={{ position: 'absolute', inset: 0, opacity: 0, transition: 'opacity 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(200,150,12,0.3)' }}
                    className="group-hover:opacity-100">
                    <Play size={16} fill="white" color="white" style={{ marginLeft: 2 }} />
                  </div>
                  {video.durationFormatted && (
                    <div style={{ position: 'absolute', bottom: 4, right: 4, padding: '2px 5px', background: 'rgba(8,10,15,0.95)' }}>
                      <span style={{ fontSize: '0.55rem', fontWeight: 700, color: 'var(--platinum)' }}>{video.durationFormatted}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2px 0' }}>
                  <h3 style={{ fontSize: '0.77rem', fontWeight: 600, lineHeight: 1.4, color: 'var(--steel)', transition: 'color 0.2s' }}
                    className="line-clamp-2 group-hover:text-platinum">
                    {video.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.6rem', color: 'var(--iron)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Eye size={8} /><span>{formatViews(video.views)}</span>
                    </div>
                    <span>·</span>
                    <span>{timeAgo(video.publishedAt)}</span>
                  </div>
                </div>
              </motion.a>
            ))}

            {/* Mobile link */}
            <a href="https://www.youtube.com/@musaagll/videos" target="_blank" rel="noopener noreferrer"
              className="sm:hidden btn-ghost"
              style={{ justifyContent: 'center', marginTop: 4, textDecoration: 'none' }}>
              Tüm Videolar <ArrowUpRight size={11} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
