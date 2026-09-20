'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Volume2, VolumeX } from 'lucide-react'

export function SponsorAd() {
  const [dismissed, setDismissed] = useState(false)
  const [muted, setMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  if (dismissed) return null

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setMuted(videoRef.current.muted)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 40, scale: 0.92 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 40, scale: 0.92 }}
        transition={{ duration: 0.45, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-6 right-6 z-[350]"
        style={{ width: 'clamp(220px, 22vw, 280px)' }}
      >
        {/* Kart */}
        <div
          style={{
            background: 'rgba(10, 14, 28, 0.96)',
            border: '1px solid rgba(212,168,50,0.25)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.8), 0 0 32px rgba(212,168,50,0.08)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Üst altın çizgi */}
          <div style={{
            height: 2,
            background: 'linear-gradient(90deg, transparent, #D4A832, #F0C050, #D4A832, transparent)',
          }} />

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '6px 10px',
            borderBottom: '1px solid rgba(212,168,50,0.08)',
          }}>
            <span style={{
              fontSize: '0.52rem', fontWeight: 800, letterSpacing: '0.28em',
              textTransform: 'uppercase', color: 'rgba(212,168,50,0.55)',
            }}>
              Sponsor
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {/* Ses toggle */}
              <button
                type="button"
                onClick={toggleMute}
                style={{
                  width: 22, height: 22, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', background: 'transparent', border: 'none',
                  color: 'rgba(212,168,50,0.45)', cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(212,168,50,0.9)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(212,168,50,0.45)' }}
                aria-label={muted ? 'Sesi aç' : 'Sesi kapat'}
              >
                {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
              </button>
              {/* Kapat */}
              <button
                type="button"
                onClick={() => setDismissed(true)}
                style={{
                  width: 22, height: 22, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', background: 'transparent', border: 'none',
                  color: 'rgba(255,255,255,0.25)', cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.25)' }}
                aria-label="Reklamı kapat"
              >
                <X size={12} />
              </button>
            </div>
          </div>

          {/* Video */}
          <div style={{ position: 'relative', aspectRatio: '16/9', background: '#06080F' }}>
            <video
              ref={videoRef}
              src="/Reklam/romaelit-animation.mov"
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            {/* Altın kenarlık efekti */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4)',
            }} />
          </div>

          {/* Alt çizgi */}
          <div style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(212,168,50,0.2), transparent)',
          }} />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
