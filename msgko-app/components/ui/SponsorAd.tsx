'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

/**
 * Tam genişlik sponsor banner — Navbar'ın (height: 64px) hemen altında, sticky.
 * GIF otomatik döngü halinde çalışır (tüm tarayıcılarda desteklenir).
 */
export function SponsorAd() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      style={{
        position: 'sticky',
        top: 64,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 45,
        height: 'clamp(90px, 14vw, 160px)',
        background: '#000',
        borderBottom: '2px solid rgba(212,168,50,0.55)',
        borderTop: '2px solid rgba(212,168,50,0.3)',
        overflow: 'hidden',
        flexShrink: 0,
      }}
      role="complementary"
      aria-label="Sponsor reklamı"
    >
      {/* GIF — tam kapsıyor, tüm tarayıcılarda döngü halinde çalışır */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Reklam/Romaelit.GIF"
        alt="Romaelit — Sponsor"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* Kenar solma efektleri */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 80,
        background: 'linear-gradient(90deg, rgba(6,8,15,0.3), transparent)',
        pointerEvents: 'none', zIndex: 2,
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 80,
        background: 'linear-gradient(270deg, rgba(6,8,15,0.3), transparent)',
        pointerEvents: 'none', zIndex: 2,
      }} />

      {/* "SPONSOR" etiketi — sol üst */}
      <div style={{
        position: 'absolute', top: 7, left: 12, zIndex: 5,
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '2px 8px',
        background: 'rgba(6,8,15,0.72)',
        border: '1px solid rgba(212,168,50,0.4)',
        backdropFilter: 'blur(6px)',
      }}>
        <div style={{
          width: 5, height: 5,
          background: '#F0C050',
          borderRadius: '50%',
          animation: 'dotPulse 2s infinite',
        }} />
        <span style={{
          fontSize: '0.48rem', fontWeight: 800,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(212,168,50,0.85)',
        }}>
          Sponsor
        </span>
      </div>

      {/* Kapat (X) — sağ üst */}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Reklamı kapat"
        style={{
          position: 'absolute', top: 7, right: 12, zIndex: 5,
          width: 24, height: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(6,8,15,0.72)',
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(6px)',
          color: 'rgba(255,255,255,0.45)',
          cursor: 'pointer',
          transition: 'color 0.15s, border-color 0.15s',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.color = '#fff'
          el.style.borderColor = 'rgba(212,168,50,0.55)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.color = 'rgba(255,255,255,0.45)'
          el.style.borderColor = 'rgba(255,255,255,0.15)'
        }}
      >
        <X size={12} />
      </button>
    </div>
  )
}
