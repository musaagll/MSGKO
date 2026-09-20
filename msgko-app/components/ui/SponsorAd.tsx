'use client'

import { useRef, useEffect, useState } from 'react'

export function SponsorAd() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    // Her ihtimale karşı muted'ı zorla
    v.muted = true
    v.volume = 0

    const tryPlay = () => {
      v.play().catch(() => {
        // Autoplay engellendiyse 1sn sonra tekrar dene
        setTimeout(() => v.play().catch(() => {}), 1000)
      })
    }

    v.addEventListener('loadedmetadata', () => setLoaded(true))
    v.addEventListener('canplaythrough', tryPlay, { once: true })

    // Zaten hazırsa hemen başlat
    if (v.readyState >= 4) {
      setLoaded(true)
      tryPlay()
    }

    // Görünürlük değişince devam ettir
    const handleVisibility = () => {
      if (!document.hidden && v.paused) tryPlay()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <div
      style={{
        width: '100%',
        background: '#000',
        borderTop: '2px solid #D4A832',
        borderBottom: '2px solid #D4A832',
        position: 'relative',
        overflow: 'hidden',
        // Minimum yükseklik — video yüklenene kadar alan korunur
        minHeight: loaded ? undefined : 120,
      }}
    >
      {/* SPONSOR etiketi */}
      <div style={{
        position: 'absolute', top: 8, left: 12, zIndex: 5,
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '2px 10px',
        background: 'rgba(6,8,15,0.85)',
        border: '1px solid #D4A832',
      }}>
        <div style={{
          width: 5, height: 5, borderRadius: '50%',
          background: '#F0C050',
          animation: 'dotPulse 2s infinite',
        }} />
        <span style={{
          fontSize: '0.48rem', fontWeight: 800,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: '#F0C050',
        }}>
          Sponsor
        </span>
      </div>

      {/* Skeleton — video yüklenene kadar görünür */}
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, #0a0e1c 25%, #111827 50%, #0a0e1c 75%)',
          backgroundSize: '400px 100%',
          animation: 'skeleton-shimmer 1.6s infinite linear',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 3, height: 24,
                background: 'rgba(212,168,50,0.4)',
                borderRadius: 2,
                animation: `skeleton-shimmer 0.8s ${i * 0.15}s ease-in-out infinite alternate`,
              }} />
            ))}
          </div>
        </div>
      )}

      {/* Video */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          // Görünürlük: yüklenene kadar hidden (alan hâlâ var, min-height sayesinde)
          visibility: loaded ? 'visible' : 'hidden',
        }}
      >
        <source src="/Reklam/RomaEliteGif.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
