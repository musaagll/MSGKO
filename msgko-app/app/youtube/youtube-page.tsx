'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { formatDuration as fmtDur, formatViews as fmtViews } from '@/lib/utils'

interface YTVid {
  id: string
  title: string
  thumbnail: string
  duration: string
  publishedAt: string
  views: number
  youtubeUrl: string
  isShort?: boolean
}

type Tab = 'videos' | 'shorts'

export function YoutubePage() {
  const [videos, setVideos] = useState<YTVid[]>([])
  const [shorts, setShorts] = useState<YTVid[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('videos')

  useEffect(() => {
    fetch('/api/youtube?maxResults=20')
      .then(r => r.json())
      .then(d => {
        setVideos(d.videos ?? [])
        setShorts(d.shorts ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const activeList = tab === 'videos' ? videos : shorts

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#07070B' }}>
      {/* Mesh arka plan */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 55% 45% at 15% 25%, rgba(255,68,68,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 45% 55% at 85% 75%, rgba(139,92,246,0.05) 0%, transparent 55%)
        `
      }} />

      {/* Top accent line */}
      <div className="fixed top-0 left-0 right-0 h-px pointer-events-none z-10"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,68,68,0.7), rgba(139,92,246,0.5), transparent)' }}
      />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 flex-shrink-0 mt-16"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-200 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span className="text-[0.78rem] font-medium tracking-[0.06em]">Geri Dön</span>
        </Link>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <p className="text-[0.62rem] font-bold tracking-[0.3em] uppercase mb-0.5"
            style={{ color: 'rgba(255,68,68,0.8)' }}>MSGKO.NET</p>
          <h1 className="text-[1.1rem] font-black tracking-[0.12em] uppercase text-white"
            style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>YouTube</h1>
        </div>

        <a href="https://www.youtube.com/@musaagll/videos" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-1.5 text-[0.68rem] font-bold tracking-[0.06em] uppercase text-white hover:opacity-80 transition-opacity"
          style={{ background: 'rgba(255,68,68,0.85)' }}>
          <ExternalLink size={11} />
          Kanala Git
        </a>
      </motion.header>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="relative z-10 flex items-center gap-1 px-6 md:px-12 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        {(['videos', 'shorts'] as Tab[]).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className="relative flex items-center gap-1.5 px-4 py-2 text-[0.75rem] font-bold tracking-[0.06em] uppercase transition-all duration-200"
            style={{ color: tab === t ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)' }}>
            {t === 'videos' ? 'Videolar' : 'Shorts'}
            <span className="text-[0.62rem] px-1.5 py-0.5 rounded-sm"
              style={{ background: 'rgba(255,68,68,0.15)', color: 'rgba(255,120,120,0.7)' }}>
              {t === 'videos' ? videos.length : shorts.length}
            </span>
            {tab === t && (
              <motion.div layoutId="yt-page-tab"
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                style={{ background: 'rgba(255,68,68,0.8)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </motion.div>

      {/* İçerik */}
      <div className="relative z-10 flex-1 px-6 md:px-12 py-8 pb-16">
        {loading ? (
          <div className="flex items-center justify-center h-40 gap-1.5">
            {[0, 1, 2].map(i => (
              <motion.div key={i} className="w-1 h-6 rounded-full"
                style={{ background: 'rgba(255,80,80,0.6)' }}
                animate={{ scaleY: [1, 2, 1] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
              />
            ))}
          </div>
        ) : tab === 'shorts' ? (
          <div className="max-w-[1280px] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {activeList.map((v, i) => (
              <motion.a key={v.id}
                href={`https://www.youtube.com/shorts/${v.id}`}
                target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group flex flex-col overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}
              >
                <div className="relative w-full overflow-hidden bg-[#1a1a1a]" style={{ aspectRatio: '9/16' }}>
                  {v.thumbnail && (
                    <img src={v.thumbnail} alt={v.title} loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5"
                    style={{ background: 'rgba(255,30,30,0.9)' }}>
                    <span className="text-[0.52rem] font-bold tracking-wider text-white">SHORT</span>
                  </div>
                </div>
                <div className="px-2 py-2">
                  <p className="text-[0.72rem] font-medium leading-snug line-clamp-2 group-hover:text-white transition-colors"
                    style={{ color: 'rgba(255,255,255,0.7)' }}>{v.title}</p>
                </div>
              </motion.a>
            ))}
          </div>
        ) : (
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {activeList.map((v, i) => (
              <motion.a key={v.id}
                href={v.youtubeUrl} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px' }}
              >
                <div className="relative aspect-video overflow-hidden bg-[#1a1a1a]">
                  {v.thumbnail && (
                    <img src={v.thumbnail} alt={v.title} loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                  {v.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/90 text-white text-[0.6rem] font-bold px-1.5 py-0.5">
                      {fmtDur(v.duration)}
                    </span>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(255,30,30,0.9)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-[0.84rem] font-semibold leading-snug line-clamp-2 group-hover:text-red-300 transition-colors mb-2"
                    style={{ color: 'rgba(255,255,255,0.85)' }}>{v.title}</h2>
                  {v.views > 0 && (
                    <p className="text-[0.68rem]" style={{ color: 'rgba(180,180,200,0.4)' }}>
                      {fmtViews(v.views)} görüntülenme
                    </p>
                  )}
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
