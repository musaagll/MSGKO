'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Play, Eye } from 'lucide-react'
import Link from 'next/link'
import { formatDuration as fmtDur, formatViews as fmtViews } from '@/lib/utils'

interface YTVid {
  id: string; title: string; thumbnail: string
  duration: string; publishedAt: string; views: number
  youtubeUrl: string; isShort?: boolean
}

type Tab = 'videos' | 'shorts'

export function YoutubePage() {
  const [videos,  setVideos]  = useState<YTVid[]>([])
  const [shorts,  setShorts]  = useState<YTVid[]>([])
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState<Tab>('videos')

  useEffect(() => {
    fetch('/api/youtube?maxResults=20')
      .then(r => r.json())
      .then(d => { setVideos(d.videos ?? []); setShorts(d.shorts ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const activeList = tab === 'videos' ? videos : shorts

  return (
    <div style={{ minHeight: '100vh', background: 'var(--void)', display: 'flex', flexDirection: 'column' }}>

      {/* Arka plan */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 55% 45% at 15% 25%, rgba(212,168,50,0.08) 0%, transparent 55%)',
      }} />
      <div className="grid-overlay" style={{ position: 'fixed' }} />

      {/* Üst çizgi */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 10,
        background: 'linear-gradient(90deg, transparent, var(--crimson), var(--ember), transparent)' }} />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative', zIndex: 10, marginTop: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px clamp(1.25rem, 4vw, 3rem)',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(8,10,15,0.9)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <Link href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--iron)', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.06em', transition: 'color 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--steel)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--iron)' }}
        >
          <ArrowLeft size={15} />
          Geri Dön
        </Link>

        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--crimson-bright)', opacity: 0.8, marginBottom: 2 }}>
            MSGKO.NET
          </p>
          <h1 style={{ fontFamily: 'var(--font-rajdhani), sans-serif', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--platinum)', lineHeight: 1 }}>
            YouTube
          </h1>
        </div>

        <a
          href="https://www.youtube.com/@musaagll/videos"
          target="_blank" rel="noopener noreferrer"
          className="btn-primary"
          style={{ padding: '7px 14px', fontSize: '0.68rem', textDecoration: 'none' }}
        >
          <ExternalLink size={11} />
          Kanala Git
        </a>
      </motion.header>

      {/* Tab bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12 }}
        style={{
          position: 'relative', zIndex: 10,
          display: 'flex', gap: 4,
          padding: '0 clamp(1.25rem, 4vw, 3rem)',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(8,10,15,0.7)',
        }}
      >
        {(['videos', 'shorts'] as Tab[]).map(t => (
          <button key={t} type="button" onClick={() => setTab(t)}
            style={{
              position: 'relative', display: 'flex', alignItems: 'center', gap: 8,
              padding: '14px 16px',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: tab === t ? 'var(--platinum)' : 'var(--iron)',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: tab === t ? '2px solid var(--crimson)' : '2px solid transparent',
              marginBottom: -1, transition: 'color 0.2s',
            }}
          >
            {t === 'videos' ? 'Videolar' : 'Shorts'}
            <span style={{
              padding: '2px 7px', fontSize: '0.58rem', fontWeight: 800,
              background: tab === t ? 'var(--crimson-subtle)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${tab === t ? 'var(--border-crimson)' : 'var(--border)'}`,
              color: tab === t ? 'var(--crimson-bright)' : 'var(--iron)',
            }}>
              {t === 'videos' ? videos.length : shorts.length}
            </span>
          </button>
        ))}
      </motion.div>

      {/* İçerik */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, padding: '2rem clamp(1.25rem, 4vw, 3rem) 4rem' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 180 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0,1,2].map(i => (
                <motion.div key={i} style={{ width: 3, height: 28, background: 'var(--crimson)', borderRadius: 2 }}
                  animate={{ scaleY: [1, 2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
              ))}
            </div>
          </div>
        ) : tab === 'shorts' ? (
          /* ── Shorts grid ── */
          <div style={{ maxWidth: 1320, margin: '0 auto', display: 'grid', gap: 14 }}
            className="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {activeList.map((v, i) => (
              <motion.a key={v.id}
                href={`https://www.youtube.com/shorts/${v.id}`}
                target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                className="card-gaming group"
                style={{ display: 'block', textDecoration: 'none', overflow: 'hidden' }}
              >
                <div style={{ position: 'relative', aspectRatio: '9/16', overflow: 'hidden', background: 'var(--abyss)' }}>
                  {v.thumbnail && (
                    <img src={v.thumbnail} alt={v.title} loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      className="group-hover:scale-[1.07]"
                    />
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,10,15,0.7) 0%, transparent 60%)' }} />
                  {/* SHORT badge */}
                  <div className="badge badge-crimson" style={{ position: 'absolute', top: 8, left: 8, fontSize: '0.5rem' }}>
                    SHORT
                  </div>
                  {/* Play hover */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.25s' }}
                    className="group-hover:opacity-100">
                    <div style={{ width: 36, height: 36, background: 'var(--crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Play size={14} fill="white" color="white" style={{ marginLeft: 2 }} />
                    </div>
                  </div>
                </div>
                <div style={{ padding: '8px 10px' }}>
                  <p className="line-clamp-2" style={{ fontSize: '0.68rem', fontWeight: 500, lineHeight: 1.45, color: 'var(--steel)', transition: 'color 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--platinum)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--steel)' }}>
                    {v.title}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        ) : (
          /* ── Videos grid ── */
          <div style={{ maxWidth: 1320, margin: '0 auto', display: 'grid', gap: 16 }}
            className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeList.map((v, i) => (
              <motion.a key={v.id}
                href={v.youtubeUrl}
                target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                className="card-gaming group"
                style={{ display: 'block', textDecoration: 'none', overflow: 'hidden' }}
                aria-label={`${v.title} videosunu izle`}
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--abyss)' }}>
                  {v.thumbnail && (
                    <img src={v.thumbnail} alt={v.title} loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }}
                      className="group-hover:scale-[1.06]"
                    />
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,10,15,0.85) 0%, transparent 55%)' }} />

                  {/* Play */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s', background: 'rgba(212,168,50,0.15)' }}
                    className="group-hover:opacity-100">
                    <div style={{ width: 52, height: 52, background: 'var(--crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 32px rgba(212,168,50,0.6)' }}>
                      <Play size={20} fill="white" color="white" style={{ marginLeft: 3 }} />
                    </div>
                  </div>

                  {/* Duration */}
                  {v.duration && (
                    <div style={{ position: 'absolute', bottom: 8, right: 8, padding: '3px 7px', background: 'rgba(8,10,15,0.92)', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--platinum)' }}>{fmtDur(v.duration)}</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '14px 16px' }}>
                  <h2 className="line-clamp-2" style={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.45, color: 'var(--steel)', marginBottom: 8, transition: 'color 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--platinum)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--steel)' }}>
                    {v.title}
                  </h2>
                  {v.views > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.62rem', color: 'var(--iron)' }}>
                      <Eye size={9} />
                      <span>{fmtViews(v.views)} görüntülenme</span>
                    </div>
                  )}
                </div>

                {/* Bottom crimson line */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--crimson), var(--ember), transparent)', transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.4s' }}
                  className="group-hover:scale-x-100" />
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
