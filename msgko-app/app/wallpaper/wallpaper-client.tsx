'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, ZoomIn, Monitor, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Wallpaper {
  id: number; src: string; label: string; category: string
  click_count: number; download_count: number
}

type Tab = 'pc' | 'phone'

const TABS: { id: Tab; label: string; icon: React.ReactNode; aspect: string }[] = [
  { id: 'pc',    label: 'PC / Desktop', icon: <Monitor size={14} />,    aspect: '16/9' },
  { id: 'phone', label: 'Mobile',       icon: <Smartphone size={14} />, aspect: '9/16' },
]

export function WallpaperClient() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
  const [tab,        setTab]        = useState<Tab>('pc')
  const [lightbox,   setLightbox]   = useState<Wallpaper | null>(null)
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch('/api/wallpapers')
      .then(r => r.json())
      .then((data: Wallpaper[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setWallpapers(data.map(w => ({
            ...w,
            category: (w.category === 'pc' || w.category === 'phone') ? w.category : 'pc',
          })))
        } else {
          setWallpapers([])
        }
      })
      .catch(() => setWallpapers([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const track = (id: number, type: 'click' | 'download') => {
    fetch('/api/wallpapers', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type }),
    }).catch(() => {})
  }

  const filtered    = wallpapers.filter(w => w.category === tab)
  const currentTab  = TABS.find(t => t.id === tab)!

  return (
    <div style={{ minHeight: '100vh', background: 'var(--void)', display: 'flex', flexDirection: 'column' }}>

      {/* Arka plan */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 55% 50% at 10% 20%, rgba(200,150,12,0.07) 0%, transparent 55%)',
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
          position: 'relative', zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px clamp(1.25rem, 4vw, 3rem)',
          marginTop: 64,
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
          <h1 style={{ fontFamily: 'var(--font-rajdhani), sans-serif', fontSize: '1.15rem', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--platinum)', lineHeight: 1 }}>
            Knight Online Wallpaper
          </h1>
        </div>

        {/* Ücretsiz badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.8)', animation: 'dotPulse 2s infinite' }} />
          <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#10B981', opacity: 0.8 }}>
            Ücretsiz
          </span>
        </div>
      </motion.header>

      {/* Tab seçici */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        style={{
          position: 'relative', zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px clamp(1.25rem, 4vw, 3rem)',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(8,10,15,0.7)',
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {TABS.map(t => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '8px 16px',
                fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer',
                background: tab === t.id ? 'var(--crimson-subtle)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${tab === t.id ? 'var(--border-crimson)' : 'var(--border)'}`,
                color: tab === t.id ? 'var(--crimson-bright)' : 'var(--iron)',
                transition: 'all 0.2s',
              }}
            >
              {t.icon}
              {t.label}
              <span style={{
                fontSize: '0.6rem', padding: '2px 6px',
                background: tab === t.id ? 'rgba(200,150,12,0.2)' : 'rgba(255,255,255,0.06)',
                color: tab === t.id ? 'var(--crimson-bright)' : 'var(--iron)',
                fontWeight: 700,
              }}>
                {wallpapers.filter(w => w.category === t.id).length}
              </span>
            </button>
          ))}
        </div>

        <span style={{ fontSize: '0.65rem', color: 'var(--iron)' }}>
          {filtered.length} duvar kağıdı
        </span>
      </motion.div>

      {/* Grid */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, padding: '2rem clamp(1.25rem, 4vw, 3rem) 4rem' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[0,1,2].map(i => (
                    <motion.div key={i} style={{ width: 3, height: 28, background: 'var(--crimson)', borderRadius: 2 }}
                      animate={{ scaleY: [1, 2, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                  ))}
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--iron)' }}>
                <p style={{ fontSize: '0.85rem' }}>Henüz {currentTab.label} wallpaper yok</p>
              </div>
            ) : (
              <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gap: 16 }}
                className={tab === 'phone' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}>
                {filtered.map((wp, i) => (
                  <motion.div
                    key={wp.id}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 + i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="card-gaming group"
                    style={{ aspectRatio: currentTab.aspect, cursor: 'pointer', overflow: 'hidden' }}
                    onClick={() => { setLightbox(wp); track(wp.id, 'click') }}
                  >
                    <img
                      src={wp.src}
                      alt={`Knight Online Wallpaper — ${wp.label}`}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease', display: 'block' }}
                      className="group-hover:scale-[1.06]"
                    />
                    {/* Gradient */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(8,10,15,0.8) 0%, transparent 55%)',
                    }} />

                    {/* Hover overlay */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(8,10,15,0.5)',
                      backdropFilter: 'blur(2px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      opacity: 0, transition: 'opacity 0.25s',
                    }} className="group-hover:opacity-100">
                      <button
                        style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer' }}
                        onClick={e => { e.stopPropagation(); setLightbox(wp) }}
                        aria-label="Büyüt"
                      >
                        <ZoomIn size={15} />
                      </button>
                      <a
                        href={wp.src}
                        download={wp.label + '.png'}
                        style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--crimson)', border: '1px solid rgba(200,150,12,0.5)', color: '#0A0C14', textDecoration: 'none' }}
                        onClick={e => { e.stopPropagation(); track(wp.id, 'download') }}
                        aria-label={`${wp.label} indir`}
                      >
                        <Download size={15} />
                      </a>
                    </div>

                    {/* Bottom meta */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 12px' }}>
                      <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }}
                        className="group-hover:text-white">
                        {wp.label}
                      </p>
                    </div>

                    {/* Top crimson line on hover */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                      background: 'linear-gradient(90deg, var(--crimson), var(--ember), transparent)',
                      transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.4s',
                    }} className="group-hover:scale-x-100" />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(8,10,15,0.97)',
              backdropFilter: 'blur(16px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 20,
            }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              style={{ position: 'relative', maxWidth: '92vw', maxHeight: '88vh' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Üst kırmızı çizgi */}
              <div style={{ height: 2, background: 'linear-gradient(90deg, var(--crimson), var(--ember), transparent)', marginBottom: 0 }} />

              <img
                src={lightbox.src}
                alt={lightbox.label}
                style={{ maxWidth: '88vw', maxHeight: '80vh', objectFit: 'contain', display: 'block' }}
              />

              {/* Alt bar */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'var(--abyss)',
                border: '1px solid var(--border)',
                borderTop: 'none',
              }}>
                <div>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--platinum)' }}>{lightbox.label}</p>
                  <div style={{ display: 'flex', gap: 12, marginTop: 3 }}>
                    <span style={{ fontSize: '0.6rem', color: 'var(--iron)' }}>👁 {lightbox.click_count ?? 0} görüntüleme</span>
                    <span style={{ fontSize: '0.6rem', color: 'var(--iron)' }}>⬇ {lightbox.download_count ?? 0} indirme</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a
                    href={lightbox.src}
                    download={lightbox.label + '.png'}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.7rem', textDecoration: 'none' }}
                    onClick={() => track(lightbox.id, 'download')}
                  >
                    <Download size={13} />
                    İndir
                  </a>
                  <button
                    onClick={() => setLightbox(null)}
                    style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: '1px solid var(--border-md)', color: 'var(--iron)', cursor: 'pointer' }}
                    aria-label="Kapat"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
