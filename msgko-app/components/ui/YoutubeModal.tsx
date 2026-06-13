'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Clock, ArrowUpRight, Eye } from 'lucide-react'
import { formatDuration, timeAgo, formatViews } from '@/lib/utils'

interface YTVideo {
  id: string
  title: string
  thumbnail: string
  duration: string
  publishedAt: string
  views: number
  youtubeUrl: string
  isShort: boolean
}

interface YoutubeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function YoutubeModal({ isOpen, onClose }: YoutubeModalProps) {
  const [tab, setTab] = useState<'videos' | 'shorts'>('videos')
  const [videos, setVideos] = useState<YTVideo[]>([])
  const [shorts, setShorts] = useState<YTVideo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setActiveVideo(null); onClose() }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
      fetchVideos()
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const fetchVideos = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/youtube?maxResults=30')
      if (!res.ok) throw new Error('API hatası')
      const data = await res.json()
      setVideos(data.videos ?? [])
      setShorts(data.shorts ?? [])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const currentList = tab === 'videos' ? videos : shorts

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="yt-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[300]"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={() => { setActiveVideo(null); onClose() }}
          />

          {/* Modal */}
          <motion.div
            key="yt-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-4 md:inset-8 z-[301] flex flex-col overflow-hidden"
            style={{
              background: 'rgba(7,7,11,0.97)',
              border: '1px solid rgba(255,0,0,0.15)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(255,0,0,0.05)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="YouTube Videoları"
          >
            {/* Top gradient border */}
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,50,50,0.7), rgba(255,150,0,0.5), transparent)' }}
            />

            {/* Ambient */}
            <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(255,0,0,0.05) 0%, transparent 60%)', filter: 'blur(40px)' }}
            />

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.25)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,80,80,1)" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-[0.95rem] tracking-[0.06em]">YouTube</p>
                  <a href="https://www.youtube.com/@musaagll" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-white transition-colors duration-200"
                    style={{ color: 'rgba(180,180,200,0.4)', fontSize: '0.72rem' }}
                  >
                    @musaagll <ArrowUpRight size={11} />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[0.68rem] tracking-[0.1em] hidden sm:block" style={{ color: 'rgba(255,255,255,0.18)' }}>
                  ESC ile kapat
                </span>
                <button
                  type="button"
                  onClick={() => { setActiveVideo(null); onClose() }}
                  className="w-8 h-8 flex items-center justify-center transition-all duration-200"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,80,80,0.4)'
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.background = 'rgba(255,80,80,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                    e.currentTarget.style.background = 'transparent'
                  }}
                  aria-label="Kapat"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-shrink-0 px-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {(['videos', 'shorts'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setTab(t); setActiveVideo(null) }}
                  className="relative flex items-center gap-2 px-1 py-4 mr-8 text-[0.8rem] font-semibold tracking-[0.08em] uppercase transition-all duration-200"
                  style={{ color: tab === t ? '#fff' : 'rgba(180,180,200,0.35)' }}
                >
                  {t === 'videos' ? 'Videolar' : 'Shorts'}
                  {(t === 'videos' ? videos : shorts).length > 0 && (
                    <span className="px-1.5 py-0.5 text-[0.6rem] font-bold"
                      style={{
                        background: tab === t ? 'rgba(255,80,80,0.15)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${tab === t ? 'rgba(255,80,80,0.3)' : 'rgba(255,255,255,0.08)'}`,
                        color: tab === t ? 'rgba(255,120,120,0.9)' : 'rgba(180,180,200,0.35)',
                      }}
                    >
                      {(t === 'videos' ? videos : shorts).length}
                    </span>
                  )}
                  {tab === t && (
                    <motion.div
                      layoutId="yt-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px]"
                      style={{ background: 'linear-gradient(90deg, rgba(255,80,80,0.9), rgba(255,150,0,0.7))' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
              {activeVideo && (
                <div className="flex-1 bg-black">
                  <iframe
                    key={activeVideo}
                    src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube Video"
                  />
                </div>
              )}

              <div className={`overflow-y-auto ${activeVideo ? 'w-80 flex-shrink-0' : 'flex-1 p-8'}`}
                style={{ borderLeft: activeVideo ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
              >
                {loading && (
                  <div className="flex items-center justify-center h-40 gap-2">
                    {[0,1,2].map(i => (
                      <motion.div key={i} className="w-1 h-8 rounded-full"
                        style={{ background: 'rgba(255,80,80,0.5)' }}
                        animate={{ scaleY: [1, 2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                )}

                {!loading && error && (
                  <div className="flex flex-col items-center justify-center h-40 gap-3">
                    <p className="text-[0.82rem]" style={{ color: 'rgba(255,80,80,0.7)' }}>Videolar yüklenemedi</p>
                    <button type="button" onClick={fetchVideos}
                      className="px-4 py-1.5 text-[0.72rem] border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors duration-200">
                      Tekrar Dene
                    </button>
                  </div>
                )}

                {!loading && !error && currentList.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-40 gap-3">
                    <Clock size={28} style={{ color: 'rgba(255,255,255,0.15)' }} />
                    <p className="text-[0.82rem]" style={{ color: 'rgba(255,255,255,0.3)' }}>Video bulunamadı</p>
                  </div>
                )}

                {!loading && !error && currentList.length > 0 && (
                  <div className={
                    activeVideo ? 'flex flex-col'
                    : tab === 'shorts' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'
                    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  }>
                    {currentList.map((video, i) => (
                      <motion.button
                        key={video.id}
                        type="button"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => setActiveVideo(video.id)}
                        aria-label={`${video.title} videosunu oynat`}
                        className={`text-left group transition-all duration-200 overflow-hidden ${activeVideo ? 'flex items-start gap-3 p-3' : ''}`}
                        style={activeVideo ? {
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          background: activeVideo === video.id ? 'rgba(255,80,80,0.06)' : 'transparent',
                          borderLeft: activeVideo === video.id ? '2px solid rgba(255,80,80,0.5)' : '2px solid transparent',
                        } : {
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.05)',
                        }}
                        onMouseEnter={(e) => {
                          if (!activeVideo) {
                            e.currentTarget.style.borderColor = 'rgba(255,80,80,0.25)'
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4), 0 0 16px rgba(255,80,80,0.06)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!activeVideo) {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                            e.currentTarget.style.boxShadow = 'none'
                          }
                        }}
                      >
                        <div className={`relative overflow-hidden bg-[#141420] flex-shrink-0 ${
                          activeVideo ? 'w-20 aspect-video'
                          : tab === 'shorts' ? 'aspect-[9/16] w-full' : 'aspect-video w-full'
                        }`}>
                          {video.thumbnail ? (
                            <img src={video.thumbnail} alt={video.title} loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.06]"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(255,80,80,0.05)' }}>
                              <Play size={20} style={{ color: 'rgba(255,80,80,0.3)' }} aria-hidden="true" />
                            </div>
                          )}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                            style={{ background: 'rgba(0,0,0,0.3)' }}>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ background: 'rgba(255,80,80,0.85)', boxShadow: '0 0 16px rgba(255,80,80,0.4)' }}>
                              <Play size={14} fill="white" className="text-white ml-0.5" aria-hidden="true" />
                            </div>
                          </div>
                          {!activeVideo && video.duration && (
                            <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 text-white text-[0.62rem] font-bold"
                              style={{ background: 'rgba(0,0,0,0.85)' }}>
                              {formatDuration(video.duration)}
                            </span>
                          )}
                        </div>

                        <div className={activeVideo ? 'flex-1 min-w-0' : 'p-3'}>
                          <p className={`text-white font-medium leading-snug line-clamp-2 group-hover:text-red-300 transition-colors duration-200 ${
                            activeVideo ? 'text-[0.74rem]' : 'text-[0.82rem] mb-2'
                          }`}>
                            {video.title}
                          </p>
                          {!activeVideo && (
                            <div className="flex items-center gap-2 text-[0.68rem]" style={{ color: 'rgba(180,180,200,0.4)' }}>
                              <div className="flex items-center gap-1">
                                <Eye size={10} aria-hidden="true" />
                                <span>{formatViews(video.views)}</span>
                              </div>
                              <span style={{ color: 'rgba(255,255,255,0.12)' }} aria-hidden="true">·</span>
                              <span>{timeAgo(video.publishedAt)}</span>
                            </div>
                          )}
                          {activeVideo && (
                            <p className="text-[0.64rem] mt-0.5" style={{ color: 'rgba(180,180,200,0.35)' }}>
                              {timeAgo(video.publishedAt)}
                            </p>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
