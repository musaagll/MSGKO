'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'

const REELS = [
  { id: 'DZFCMQMNr5C', title: 'Video 1' },
  { id: 'DZCa-y9to-h', title: 'Video 2' },
  { id: 'DYtiLyONbys', title: 'Video 3' },
  { id: 'DYNgnvAt07I', title: 'Video 4' },
  { id: 'DXv-iDcNL0a', title: 'Video 5' },
]

export function InstagramPanel() {
  const [activeReel, setActiveReel] = useState<string | null>(null)

  return (
    <div className="flex flex-col h-full">
      {/* Profile */}
      <div className="px-5 py-3.5 flex items-center gap-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(131,58,180,0.12)' }}>
        <div className="w-10 h-10 rounded-full flex-shrink-0 p-[2px]"
          style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}>
          <div className="w-full h-full rounded-full bg-[#07070B] flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="msgclip"
              width={28}
              height={28}
              className="object-contain"
              style={{ mixBlendMode: 'screen' }}
            />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-[0.82rem]">msgclip</p>
          <p className="text-[0.65rem]" style={{ color: 'rgba(180,180,200,0.4)' }}>@msgclip · Knight Online</p>
        </div>
        <a href="https://www.instagram.com/msgclip" target="_blank" rel="noopener noreferrer"
          className="flex-shrink-0 px-3 py-1.5 text-[0.65rem] font-bold tracking-[0.06em] uppercase text-white hover:opacity-80 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d)' }}>
          Takip Et
        </a>
      </div>

      {/* 3-column grid of embeds */}
      <div className="flex-1 overflow-y-auto p-3">
        {/*
          Instagram embed içinde beyaz header var.
          overflow:hidden + negative margin ile header'ı gizliyoruz.
          Sadece video thumbnail kısmı görünür.
        */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {REELS.map((reel, i) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className="relative cursor-pointer group"
              style={{ aspectRatio: '9/16' }}
              onClick={() => setActiveReel(reel.id)}
            >
              {/* iframe container — header ve footer gizleme */}
              <div className="absolute inset-0 overflow-hidden"
                style={{ border: '1px solid rgba(131,58,180,0.2)' }}>
                {/* 
                  Üst header ~56px, alt footer ~130px gizleniyor.
                  Container daha uzun, overflow:hidden ile kesilir.
                */}
                <div style={{
                  marginTop: '-56px',
                  marginBottom: '-200px',
                  height: 'calc(100% + 56px + 200px)',
                  pointerEvents: 'none'
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

                {/* Play hint on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(131,58,180,0.8)', backdropFilter: 'blur(4px)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="https://www.instagram.com/msgclip"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 text-[0.75rem] font-bold tracking-[0.1em] uppercase text-white hover:opacity-85 transition-opacity"
          style={{
            background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 60%, #fcb045 100%)',
            boxShadow: '0 4px 20px rgba(131,58,180,0.25)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
          Tümünü Instagram&apos;da Gör
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {activeReel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[400] bg-black/85"
              onClick={() => setActiveReel(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[401]"
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
                  className="absolute -top-10 right-0 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                  aria-label="Kapat"
                >
                  <X size={20} />
                </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
