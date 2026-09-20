'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export function SponsorAd() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      style={{
        position: 'sticky',
        top: 64,
        zIndex: 45,
        width: '100%',
        borderBottom: '2px solid rgba(212,168,50,0.55)',
        borderTop: '2px solid rgba(212,168,50,0.3)',
        overflow: 'hidden',
        lineHeight: 0,          /* img altında boşluk olmasın */
        flexShrink: 0,
      }}
      role="complementary"
      aria-label="Sponsor reklamı"
    >
      {/* GIF — tam genişlik, oran korunur */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Reklam/Romaelit.GIF"
        alt="Romaelit — Sponsor"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          maxHeight: '200px',
          objectFit: 'cover',
        }}
      />

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
