'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowUpRight, Play } from 'lucide-react'

interface WsMovieModalProps {
  isOpen: boolean
  onClose: () => void
}

const INSTAGRAM_REELS = [
  { id: 'DZFCMQMNr5C', title: 'Video 1' },
  { id: 'DZCa-y9to-h', title: 'Video 2' },
  { id: 'DYtiLyONbys', title: 'Video 3' },
  { id: 'DYNgnvAt07I', title: 'Video 4' },
  { id: 'DXv-iDcNL0a', title: 'Video 5' },
]

export function WsMovieModal({ isOpen, onClose }: WsMovieModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="ws-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[300]"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="ws-modal"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-4 md:inset-12 lg:inset-20 z-[301] flex flex-col overflow-hidden"
            style={{
              background: 'rgba(7,7,11,0.96)',
              border: '1px solid rgba(131,58,180,0.25)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(131,58,180,0.08)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Instagram Videoları"
          >
            {/* Top gradient border */}
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(131,58,180,0.8), rgba(253,29,29,0.6), rgba(252,176,69,0.5), transparent)' }}
            />

            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(131,58,180,0.08) 0%, transparent 60%)',
                filter: 'blur(40px)',
              }}
            />

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
                    padding: '1px',
                  }}
                >
                  <div className="w-full h-full bg-[#07070B] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-white font-bold text-[0.95rem] tracking-[0.06em]">Ws Movie</p>
                  <a
                    href="https://www.instagram.com/msgclip"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 transition-colors duration-200 hover:text-white"
                    style={{ color: 'rgba(180,180,200,0.45)', fontSize: '0.72rem' }}
                  >
                    @msgclip
                    <ArrowUpRight size={11} />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[0.68rem] tracking-[0.1em] hidden sm:block"
                  style={{ color: 'rgba(255,255,255,0.18)' }}>
                  ESC ile kapat
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center transition-all duration-200 border border-white/[0.08] text-white/40 hover:border-pink-500/40 hover:text-white hover:bg-pink-500/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                  aria-label="Kapat"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {INSTAGRAM_REELS.map((reel, i) => (
                  <motion.div
                    key={reel.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="relative group overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-purple-500/40 hover:shadow-[0_0_24px_rgba(131,58,180,0.12)]"
                    style={{
                      paddingBottom: '177.78%',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(131,58,180,0.15)',
                    }}
                  >
                    <iframe
                      src={`https://www.instagram.com/reel/${reel.id}/embed/`}
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      scrolling="no"
                      title={reel.title}
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex justify-center">
                <motion.a
                  href="https://www.instagram.com/msgclip"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 px-8 py-3.5 font-bold text-[0.82rem] tracking-[0.1em] uppercase text-white transition-all duration-200 relative overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
                    boxShadow: '0 8px 32px rgba(131,58,180,0.3)',
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)' }}
                  />
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="flex-shrink-0">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  <span className="relative z-10">Tüm Videolar İçin Instagram&apos;ı Ziyaret Et</span>
                  <ArrowUpRight size={15} className="relative z-10" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
