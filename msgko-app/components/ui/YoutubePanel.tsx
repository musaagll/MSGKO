'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface YTVid {
  id: string
  title: string
  thumbnail: string
  duration: string
  publishedAt: string
  views: number
  youtubeUrl: string
}

function fmtDur(iso: string): string {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return ''
  const h = parseInt(m[1] || '0'), mn = parseInt(m[2] || '0'), s = parseInt(m[3] || '0')
  return h > 0 ? `${h}:${String(mn).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${mn}:${String(s).padStart(2,'0')}`
}

function fmtViews(n: number): string {
  if (n < 1000) return String(n)
  if (n < 1_000_000) return `${(n/1000).toFixed(1)}B`
  return `${(n/1_000_000).toFixed(1)}M`
}

export function YoutubePanel() {
  const [videos, setVideos] = useState<YTVid[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/youtube?maxResults=20')
      .then(r => r.json())
      .then(d => { setVideos(d.videos ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-40 gap-1.5">
      {[0,1,2].map(i => (
        <motion.div
          key={i}
          className="w-1 h-6 rounded-full"
          style={{ background: 'rgba(255,80,80,0.6)' }}
          animate={{ scaleY: [1, 2, 1] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
        />
      ))}
    </div>
  )

  if (!videos.length) return (
    <div className="flex items-center justify-center h-40">
      <p className="text-[0.82rem]" style={{ color: 'rgba(255,255,255,0.3)' }}>Video bulunamadı</p>
    </div>
  )

  return (
    <div className="flex flex-col">
      {videos.map((v, i) => (
        <motion.a
          key={v.id}
          href={v.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          className="flex items-start gap-3 px-5 py-3.5 group transition-colors duration-150 hover:bg-white/[0.04]"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          {/* Thumbnail */}
          <div className="relative w-28 aspect-video flex-shrink-0 overflow-hidden bg-[#1a1a1a]">
            {v.thumbnail && (
              <img
                src={v.thumbnail}
                alt={v.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
            {v.duration && (
              <span className="absolute bottom-1 right-1 bg-black/90 text-white text-[0.58rem] font-bold px-1 py-0.5">
                {fmtDur(v.duration)}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-[0.8rem] font-medium leading-snug line-clamp-2 group-hover:text-white transition-colors duration-150"
              style={{ color: 'rgba(255,255,255,0.8)' }}>
              {v.title}
            </p>
            {v.views > 0 && (
              <p className="text-[0.68rem] mt-1.5" style={{ color: 'rgba(180,180,200,0.35)' }}>
                {fmtViews(v.views)} görüntülenme
              </p>
            )}
          </div>
        </motion.a>
      ))}
    </div>
  )
}
