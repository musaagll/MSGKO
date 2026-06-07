'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight, Play, Eye, Clock } from 'lucide-react'
import type { YTVideo } from '@/lib/youtube'

function formatViews(n: number): string {
  if (n < 1000) return String(n)
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}B`
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`
  if (diff < 604800) return `${Math.floor(diff / 86400)} gün önce`
  if (diff < 2592000) return `${Math.floor(diff / 604800)} hafta önce`
  return `${Math.floor(diff / 2592000)} ay önce`
}

interface Props {
  videos: YTVideo[]
}

export function YoutubeVideoSection({ videos }: Props) {
  if (!videos.length) return null

  return (
    <section className="relative py-24 px-8 overflow-hidden" aria-label="Son videolar">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 60%),
            #0E0E14
          `,
        }}
      />
      {/* Top border glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(236,72,153,0.4), transparent)',
        }}
      />

      <div className="relative max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[0.7rem] font-semibold tracking-[0.25em] uppercase mb-2"
              style={{ color: 'rgba(139,92,246,0.8)' }}
            >
              Eğitim İçerikleri
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="font-display text-3xl font-bold tracking-[0.08em] uppercase text-white"
            >
              Son Videolar
            </motion.h2>
          </div>

          <motion.a
            href="https://www.youtube.com/@musaagll/videos"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-[0.78rem] font-semibold tracking-[0.08em] uppercase transition-all duration-200 border border-purple-500/30 text-white/70 bg-purple-500/[0.06] hover:border-purple-500/60 hover:bg-purple-500/[0.12] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
          >
            Tümünü Gör
            <ArrowUpRight size={14} />
          </motion.a>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {videos.map((video, i) => (
            <motion.a
              key={video.id}
              href={video.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="group block relative overflow-hidden bg-white/[0.02] border border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:border-purple-500/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(139,92,246,0.1)] transition-[border-color,box-shadow] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
              aria-label={`${video.title} videosunu izle`}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-[#141420]">
                {video.thumbnail ? (
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(135deg, #1a1a2e, #07070B)' }}
                  />
                )}

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
                  }}
                />

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(139,92,246,0.9)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 0 24px rgba(139,92,246,0.6)',
                    }}
                  >
                    <Play size={18} className="text-white ml-0.5" fill="white" />
                  </div>
                </div>

                {/* Duration badge */}
                {video.durationFormatted && (
                  <div
                    className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5"
                    style={{
                      background: 'rgba(0,0,0,0.85)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <Clock size={9} className="text-purple-400" />
                    <span className="text-white text-[0.65rem] font-bold">
                      {video.durationFormatted}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-[0.84rem] font-semibold leading-snug text-white mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors duration-200">
                  {video.title}
                </h3>

                <div
                  className="flex items-center gap-2 text-[0.68rem]"
                  style={{ color: 'rgba(180,180,200,0.5)' }}
                >
                  {/* Author */}
                  <div className="flex items-center gap-1.5">
                    <Image
                      src="/logo.png"
                      alt="MSG"
                      width={14}
                      height={14}
                      className="object-contain opacity-70"
                      style={{ mixBlendMode: 'screen' }}
                    />
                    <span>MSG</span>
                  </div>

                  <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>

                  {/* Views */}
                  <div className="flex items-center gap-1">
                    <Eye size={10} />
                    <span>{formatViews(video.views)}</span>
                  </div>

                  <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>

                  <span>{timeAgo(video.publishedAt)}</span>
                </div>
              </div>

              {/* Bottom purple line on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)' }}
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
