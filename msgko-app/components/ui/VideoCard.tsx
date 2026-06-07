'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { formatViews, formatDate, getCategoryBadgeClass } from '@/lib/utils'
import type { VideoCardProps } from '@/lib/types'

export function VideoCard({ video }: VideoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })

  const categorySlug = video.category?.slug ?? ''
  const badgeClass = getCategoryBadgeClass(categorySlug)
  const badgeLabel = video.category?.name ?? categorySlug.toUpperCase()

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setTilt({ x: (y - 0.5) * 12, y: (x - 0.5) * -12 })
    setGlowPos({ x: x * 100, y: y * 100 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setGlowPos({ x: 50, y: 50 })
  }

  return (
    <div className="perspective" ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <motion.article
        style={{ rotateX: tilt.x, rotateY: tilt.y, transformStyle: 'preserve-3d' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative bg-[#0E0E14] border border-white/[0.07] overflow-hidden cursor-pointer group"
      >
        {/* Moving glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[1]"
          style={{
            background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(139,92,246,0.12) 0%, transparent 60%)`,
          }}
        />

        <a
          href={video.youtube_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${video.title} videosunu izle`}
        >
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden bg-[#141420]">
            {video.thumbnail_url ? (
              <Image
                src={video.thumbnail_url}
                alt={video.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#07070B]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

            {badgeLabel && (
              <span className={`absolute top-2.5 left-2.5 text-[0.6rem] font-bold tracking-[0.1em] px-2 py-0.5 uppercase z-[2] ${badgeClass}`}>
                {badgeLabel}
              </span>
            )}
            {video.duration && (
              <span className="absolute bottom-2 right-2 bg-black/90 text-white text-[0.65rem] font-bold px-1.5 py-0.5 z-[2]">
                {video.duration}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="p-4 relative z-[2]">
            <h3 className="text-[0.85rem] font-semibold leading-snug text-white mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors duration-200">
              {video.title}
            </h3>
            <div className="flex items-center gap-1.5 text-[0.7rem] text-[#7878A0]">
              <Image
                src="/logo.png"
                alt="MSG"
                width={16}
                height={16}
                className="object-contain flex-shrink-0"
                style={{ mixBlendMode: 'screen' }}
              />
              <span>MSG</span>
              <span className="opacity-40">•</span>
              <span>{formatViews(video.views)} görüntülenme</span>
              <span className="opacity-40">•</span>
              <span>{formatDate(video.published_at)}</span>
            </div>
          </div>
        </a>

        {/* Purple bottom border on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </motion.article>
    </div>
  )
}
