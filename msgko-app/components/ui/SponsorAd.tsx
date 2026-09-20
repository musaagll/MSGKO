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
        maxWidth: 860,
        margin: '0 auto',
        background: '#000',
        borderTop: '1px solid rgba(59,130,246,0.3)',
        borderBottom: '1px solid rgba(59,130,246,0.3)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: loaded ? undefined : 80,
      }}
    >
      {/* SPONSOR etiketi */}
      <div style={{
        position: 'absolute', top: 6, left: 10, zIndex: 5,
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '2px 8px',
        background: 'rgba(6,9,18,0.85)',
        border: '1px solid rgba(59,130,246,0.35)',
      }}>
        <div style={{
          width: 4, height: 4, borderRadius: '50%',
          background: '#60A5FA',
          animation: 'dotPulse 2s infinite',
        }} />
        <span style={{
          fontSize: '0.44rem', fontWeight: 800,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: '#60A5FA',
        }}>
          Sponsor
        </span>
      </div>

      {/* Skeleton */}
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, #090e1c 25%, #111827 50%, #090e1c 75%)',
          backgroundSize: '400px 100%',
          animation: 'skeleton-shimmer 1.6s infinite linear',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: 80,
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 3, height: 18,
                background: 'rgba(59,130,246,0.3)',
                borderRadius: 2,
                animation: `skeleton-shimmer 0.8s ${i * 0.15}s ease-in-out infinite alternate`,
              }} />
            ))}
          </div>
        </div>
      )}

      {/* Video — max-height ile yükseklik sınırlandırıldı */}
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
          maxHeight: 180,
          objectFit: 'cover',
          visibility: loaded ? 'visible' : 'hidden',
        }}
      >
        <source src="/ads/sponsor.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
