'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeft, ExternalLink } from 'lucide-react'
import Image from 'next/image'

const REELS = [
  { id: 'DZFCMQMNr5C', title: 'Video 1' },
  { id: 'DZCa-y9to-h', title: 'Video 2' },
  { id: 'DYtiLyONbys', title: 'Video 3' },
  { id: 'DYNgnvAt07I', title: 'Video 4' },
  { id: 'DXv-iDcNL0a', title: 'Video 5' },
]

interface InstagramModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InstagramModal({ isOpen, onClose }: InstagramModalProps) {
  const [activeReel, setActiveReel] = useState<string | null>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeReel) setActiveReel(null)
        else onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, activeReel, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="instagram-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[400] flex flex-col"
          style={{ background: '#07070B' }}
          role="dialog"
          aria-modal="true"
          aria-label="Instagram Reels"
        >
          {/* Mesh arka plan */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `
              radial-gradient(ellipse 60% 50% at 20% 20%, rgba(131,58,180,0.10) 0%, transparent 60%),
              radial-gradient(ellipse 50% 60% at 80% 80%, rgba(253,29,29,0.07) 0%, transparent 55%),
              radial-gradient(ellipse 80% 40% at 50% 0%, rgba(7,7,11,0.9) 0%, transparent 50%)
            `
          }} />

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(131,58,180,0.7), rgba(253,29,29,0.5), transparent)' }}
          />

          {/* ── Header ── */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          >
            {/* Geri butonu */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-200 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
              <span className="text-[0.78rem] font-medium tracking-[0.06em]">Geri Dön</span>
            </button>

            {/* Başlık */}
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
              <p className="text-[0.62rem] font-bold tracking-[0.3em] uppercase mb-0.5"
                style={{ color: 'rgba(131,58,180,0.8)' }}>
                MSGKO.NET
              </p>
              <h1 className="text-[1.1rem] font-black tracking-[0.12em] uppercase text-white"
                style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                Instagram
              </h1>
            </div>

            {/* Kapat */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center border border-white/[0.08] text-white/40 hover:border-pink-500/40 hover:text-white hover:bg-pink-500/10 transition-all duration-200"
              aria-label="Kapat"
            >
              <X size={15} />
            </button>
          </motion.header>

          {/* ── Profil şeridi ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="relative z-10 flex items-center justify-between px-6 md:px-12 py-3 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex-shrink-0 p-[2px]"
                style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}>
                <div className="w-full h-full rounded-full bg-[#07070B] flex items-center justify-center overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="msgclip"
                    width={24}
                    height={24}
                    className="object-contain"
                    style={{ mixBlendMode: 'screen' }}
                  />
                </div>
              </div>
              <div>
                <p className="text-white font-bold text-[0.82rem]">msgclip</p>
                <p className="text-[0.62rem] text-white/30">@msgclip · Knight Online</p>
              </div>
            </div>
            <a
              href="https://www.instagram.com/msgclip"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-1.5 text-[0.68rem] font-bold tracking-[0.06em] uppercase text-white hover:opacity-80 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d)' }}
            >
              <ExternalLink size={11} />
              Takip Et
            </a>
          </motion.div>

          {/* ── Reels Grid ── */}
          <div className="relative z-10 flex-1 overflow-y-auto px-6 md:px-12 py-8">
            <div className="max-w-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {REELS.map((reel, i) => (
                <motion.div
                  key={reel.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="relative cursor-pointer group"
                  style={{ aspectRatio: '9/16' }}
                  onClick={() => setActiveReel(reel.id)}
                >
                  <div className="absolute inset-0 overflow-hidden"
                    style={{
                      border: '1px solid rgba(131,58,180,0.2)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(131,58,180,0.5)'
                      ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.5), 0 0 24px rgba(131,58,180,0.15)'
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(131,58,180,0.2)'
                      ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)'
                    }}
                  >
                    {/* iframe: header ve footer gizleme */}
                    <div style={{
                      marginTop: '-56px',
                      marginBottom: '-200px',
                      height: 'calc(100% + 56px + 200px)',
                      pointerEvents: 'none',
                    }}>
                      <iframe
                        src={`https://www.instagram.com/reel/${reel.id}/embed/`}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        scrolling="no"
                        title={reel.title}
                        loading="lazy"
                      />
                    </div>

                    {/* Click overlay */}
                    <div className="absolute inset-0 bg-transparent group-hover:bg-black/20 transition-colors duration-200" />

                    {/* Play hint */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(131,58,180,0.85)', backdropFilter: 'blur(4px)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                          <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                      </div>
                    </div>

                    {/* Top accent on hover */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left"
                      style={{ background: 'linear-gradient(90deg, #833ab4, #fd1d1d)' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="max-w-[1000px] mx-auto mt-8"
            >
              <a
                href="https://www.instagram.com/msgclip"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 text-[0.75rem] font-bold tracking-[0.1em] uppercase text-white hover:opacity-85 transition-opacity"
                style={{
                  background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 60%, #fcb045 100%)',
                  boxShadow: '0 4px 24px rgba(131,58,180,0.3)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                Tümünü Instagram&apos;da Gör
                <ExternalLink size={12} />
              </a>
            </motion.div>

            <div className="h-12" />
          </div>
        </motion.div>
      )}

      {/* ── Fullscreen Reel Overlay ── */}
      <AnimatePresence>
        {activeReel && (
          <>
            <motion.div
              key="reel-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[500] bg-black/90"
              style={{ backdropFilter: 'blur(10px)' }}
              onClick={() => setActiveReel(null)}
            />
            <motion.div
              key="reel-content"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[501]"
              style={{ width: 'min(380px, 88vw)', aspectRatio: '9/16' }}
            >
              <iframe
                src={`https://www.instagram.com/reel/${activeReel}/embed/`}
                className="w-full h-full"
                frameBorder="0"
                scrolling="no"
                title="Instagram Reel"
              />
              <button
                type="button"
                onClick={() => setActiveReel(null)}
                className="absolute -top-10 right-0 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                aria-label="Kapat"
              >
                <X size={20} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AnimatePresence>
  )
}
