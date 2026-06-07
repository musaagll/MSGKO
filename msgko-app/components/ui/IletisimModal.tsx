'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface IletisimModalProps {
  isOpen: boolean
  onClose: () => void
}

export function IletisimModal({ isOpen, onClose }: IletisimModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="iletisim-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 z-[300] backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="iletisim-modal"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[301] w-[90vw] max-w-sm bg-[#111111] border border-white/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.8)]"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-[#999999] hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
              aria-label="Kapat"
            >
              <X size={18} />
            </button>

            <div className="px-8 py-10 flex flex-col items-center text-center">
              <h2 className="text-white font-extrabold text-lg tracking-[0.1em] uppercase mb-8">
                İletişim
              </h2>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/msgclip"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-4 px-5 py-4 border border-white/[0.08] bg-[#0B0B0F] hover:bg-[#2A2A2A] hover:border-white/20 transition-all duration-200 group mb-3"
              >
                <div className="w-9 h-9 flex items-center justify-center flex-shrink-0 border border-white/[0.08] bg-[#2A2A2A] group-hover:border-white/20 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#D8D8D8]">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[0.7rem] text-[#999999] uppercase tracking-[0.08em] mb-0.5">Instagram</p>
                  <p className="text-[0.82rem] text-white font-medium">@msgclip</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#555] group-hover:text-[#999] ml-auto transition-colors">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </a>

              {/* Gmail */}
              <a
                href="mailto:imusaagll@gmail.com"
                className="w-full flex items-center gap-4 px-5 py-4 border border-white/[0.08] bg-[#0B0B0F] hover:bg-[#2A2A2A] hover:border-white/20 transition-all duration-200 group"
              >
                <div className="w-9 h-9 flex items-center justify-center flex-shrink-0 border border-white/[0.08] bg-[#2A2A2A] group-hover:border-white/20 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#D8D8D8]">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[0.7rem] text-[#999999] uppercase tracking-[0.08em] mb-0.5">E-posta</p>
                  <p className="text-[0.82rem] text-white font-medium">imusaagll@gmail.com</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#555] group-hover:text-[#999] ml-auto transition-colors">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
