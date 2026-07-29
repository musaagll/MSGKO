'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, ZoomIn, Monitor, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft } from 'lucide-react'

interface Wallpaper {
  id: number; src: string; label: string; category: string
  click_count: number; download_count: number
}

type Tab = 'pc' | 'phone'

const TABS: { id: Tab; label: string; icon: React.ReactNode; aspect: string }[] = [
  { id: 'pc',    label: 'PC',    icon: <Monitor size={15} />,    aspect: '16/9' },
  { id: 'phone', label: 'Phone', icon: <Smartphone size={15} />, aspect: '9/16' },
]

export function WallpaperClient() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
  const [tab, setTab] = useState<Tab>('pc')
  const [lightbox, setLightbox] = useState<Wallpaper | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const supabase = createClient()
    void (async () => {
      try {
        const { data, error } = await supabase
          .from('wallpapers').select('*').order('id', { ascending: true })
        setWallpapers(!error && data && data.length > 0 ? data : [])
      } catch { setWallpapers([]) }
      finally { setLoading(false) }
    })()
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

  const filtered = wallpapers.filter(w => w.category === tab)
  const currentTab = TABS.find(t => t.id === tab)!

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#07070B' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 20% 20%, rgba(109,40,217,0.10) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 80% 80%, rgba(236,72,153,0.07) 0%, transparent 55%)'
      }} />
      <div className="fixed top-0 left-0 right-0 h-px z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.7), rgba(236,72,153,0.5), transparent)' }} />

      {/* Header */}
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 flex-shrink-0 mt-16"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-200 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span className="text-[0.78rem] font-medium tracking-[0.06em]">Geri Dön</span>
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <p className="text-[0.62rem] font-bold tracking-[0.3em] uppercase mb-0.5" style={{ color: 'rgba(139,92,246,0.7)' }}>MSGKO.NET</p>
          <h1 className="text-[1.1rem] font-black tracking-[0.12em] uppercase text-white" style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
            Knight Online Wallpaper
          </h1>
        </div>
        <div className="w-20" />
      </motion.header>

      {/* Tab seçici */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>

        {/* Tablar */}
        <div className="flex items-center gap-2">
          {TABS.map(t => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-4 py-2 text-[0.8rem] font-bold tracking-[0.08em] uppercase transition-all duration-200"
              style={{
                background: tab === t.id ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${tab === t.id ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.07)'}`,
                color: tab === t.id ? 'rgba(167,139,250,0.95)' : 'rgba(255,255,255,0.35)',
                borderRadius: '6px',
              }}>
              {t.icon}
              {t.label}
              {tab === t.id && (
                <span className="text-[0.6rem] px-1.5 py-0.5 rounded-sm"
                  style={{ background: 'rgba(139,92,246,0.25)', color: 'rgba(167,139,250,0.8)' }}>
                  {wallpapers.filter(w => w.category === t.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Ücretsiz badge */}
        <div className="flex items-center gap-1.5">
          <motion.div className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#22c55e', boxShadow: '0 0 5px rgba(34,197,94,0.8)' }}
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }} />
          <span className="text-[0.62rem] text-green-400/70 font-medium tracking-[0.08em] uppercase">Ücretsiz</span>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="relative z-10 flex-1 px-6 md:px-12 py-8 pb-16">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="flex gap-1.5">
                  {[0,1,2].map(i => (
                    <motion.div key={i} className="w-1 h-6 rounded-full" style={{ background: 'rgba(139,92,246,0.5)' }}
                      animate={{ scaleY: [1,2,1] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                  ))}
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="text-white/20">{currentTab.icon}</div>
                <p className="text-[0.85rem] text-white/25">Henüz {currentTab.label} wallpaper yok</p>
              </div>
            ) : (
              <div className={`max-w-[1400px] mx-auto grid gap-5 md:gap-6 ${
                tab === 'phone'
                  ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}>
                {filtered.map((wp, i) => (
                  <motion.div key={wp.id}
                    initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative overflow-hidden cursor-pointer"
                    style={{
                      aspectRatio: currentTab.aspect,
                      background: '#0e0e14',
                      border: '1px solid rgba(139,92,246,0.14)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      borderRadius: '10px',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'
                      e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.5), 0 0 32px rgba(139,92,246,0.1)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(139,92,246,0.14)'
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)'
                    }}
                    onClick={() => { setLightbox(wp); track(wp.id, 'click') }}>
                    <img src={wp.src} alt={`Knight Online Wallpaper — ${wp.label}`} loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                    <div className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(7,7,11,0.75) 0%, rgba(7,7,11,0.1) 50%, transparent 100%)' }} />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3"
                      style={{ background: 'rgba(7,7,11,0.45)', backdropFilter: 'blur(3px)' }}>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <div className="w-10 h-10 flex items-center justify-center border border-white/25 bg-white/10 text-white hover:bg-purple-500/35 hover:border-purple-400/60 transition-all duration-200 rounded-md"
                          onClick={e => { e.stopPropagation(); setLightbox(wp) }}>
                          <ZoomIn size={15} />
                        </div>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <a href={wp.src} download={wp.label + '.png'}
                          className="w-10 h-10 flex items-center justify-center border border-white/25 bg-white/10 text-white hover:bg-purple-500/35 hover:border-purple-400/60 transition-all duration-200 rounded-md"
                          onClick={e => { e.stopPropagation(); track(wp.id, 'download') }}
                          aria-label={`${wp.label} indir`}>
                          <Download size={15} />
                        </a>
                      </motion.div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5">
                      <p className="text-[0.68rem] font-bold tracking-[0.14em] uppercase text-white/55 group-hover:text-white/80 transition-colors duration-200">
                        {wp.label}
                      </p>
                    </div>
                    <div className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                      style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.8), rgba(236,72,153,0.6))' }} />
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
          <>
            <motion.div key="lb-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[500] bg-black/95" style={{ backdropFilter: 'blur(12px)' }}
              onClick={() => setLightbox(null)} />
            <motion.div key="lb-content" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[501] flex flex-col items-center justify-center p-6 md:p-12"
              onClick={() => setLightbox(null)}>
              <img src={lightbox.src} alt={`Knight Online Wallpaper — ${lightbox.label}`}
                className="max-w-full max-h-[80vh] object-contain"
                style={{ border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 0 80px rgba(0,0,0,0.8), 0 0 40px rgba(139,92,246,0.1)' }} />
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="flex items-center gap-4 mt-5" onClick={e => e.stopPropagation()}>
                <p className="text-[0.72rem] font-bold tracking-[0.16em] uppercase text-white/40">{lightbox.label}</p>
                <div className="w-px h-4 bg-white/10" />
                <a href={lightbox.src} download={lightbox.label + '.png'}
                  className="flex items-center gap-2 px-5 py-2.5 text-[0.75rem] font-bold tracking-[0.1em] uppercase border border-purple-500/40 bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 hover:text-white transition-all duration-200"
                  onClick={() => track(lightbox.id, 'download')}>
                  <Download size={13} /> İndir
                </a>
              </motion.div>
            </motion.div>
            <button type="button" onClick={() => setLightbox(null)}
              className="fixed top-5 right-5 z-[502] w-10 h-10 flex items-center justify-center border border-white/20 bg-black/60 text-white hover:bg-white/10 transition-all duration-200"
              aria-label="Kapat">
              <X size={16} />
            </button>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
