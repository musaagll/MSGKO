'use client'

import { useState, useEffect } from 'react'

interface Etkinlik {
  ad: string; kisa: string; tur: 'gunluk' | 'haftalik'
  gunler: number[] | null; saatler: string[]; simge: string
  minLevel?: number; sureDk?: number; not?: string; dogrulanmadi?: boolean
}
interface EtkinlikData { etkinlikler: Etkinlik[] }

const GUN: string[] = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']

function nextOccurrence(e: Etkinlik): { label: string; msDiff: number; urgent: boolean } {
  const now     = new Date()
  const trNow   = new Date(now.getTime() + (3 * 60 + now.getTimezoneOffset()) * 60000)
  let bestMs    = Infinity, bestLabel = ''
  const days    = e.gunler ?? [0,1,2,3,4,5,6]
  for (const gun of days) {
    for (const saat of e.saatler) {
      const [hh, mm] = saat.split(':').map(Number)
      const diff     = (gun - trNow.getDay() + 7) % 7
      const c        = new Date(trNow)
      c.setDate(c.getDate() + diff); c.setHours(hh, mm, 0, 0)
      let ms = c.getTime() - trNow.getTime()
      if (ms <= 0) ms += 7 * 24 * 3600000
      if (ms < bestMs) {
        bestMs = ms
        const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000)
        bestLabel = h < 24 ? (h > 0 ? `${h}sa ${m}dk` : `${m}dk`) : `${Math.floor(h/24)}g ${h%24}sa`
      }
    }
  }
  return { label: bestLabel, msDiff: bestMs, urgent: bestMs < 3600000 }
}

const SIMGE_MAP: Record<string, string> = {
  'bi-fire': '🔥', 'bi-shield-shaded': '⚔', 'bi-puzzle': '◈',
  'bi-shield-slash': '⚔', 'bi-bug': '⚑', 'bi-gem': '◆',
  'bi-moon-stars': '◉', 'bi-flag': '⚑', 'bi-door-open': '▶', 'bi-wrench': '⊕',
}

export function EtkinlikSection() {
  const [data,    setData]    = useState<EtkinlikData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [, setTick]           = useState(0)

  useEffect(() => {
    fetch('/api/gb-fiyatlari?etkinlik=1')
      .then(r => r.json())
      .then((d: EtkinlikData) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 60000)
    return () => clearInterval(t)
  }, [])

  if (loading || !data?.etkinlikler.length) return null

  const sorted = [...data.etkinlikler]
    .filter(e => !e.dogrulanmadi)
    .map(e => ({ ...e, next: nextOccurrence(e) }))
    .sort((a, b) => a.next.msDiff - b.next.msDiff)

  const visible = expanded ? sorted : sorted.slice(0, 5)

  return (
    <section
      style={{
        padding: '3rem 0 4rem',
        background: 'var(--abyss)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--page-px)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 8 }}>Etkinlik Takvimi</p>
            <h2 style={{
              fontFamily: 'var(--font-rajdhani), sans-serif',
              fontSize: 'clamp(1rem, 2vw, 1.3rem)',
              fontWeight: 900, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: 'var(--steel)',
            }}>
              Sıradaki Etkinlikler
            </h2>
          </div>
        </div>

        {/* Crimson divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, var(--crimson), var(--ember), transparent)', marginBottom: 24 }} />

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: 8 }}
          className="sm:grid-cols-2 lg:grid-cols-5">
          {visible.map((etkinlik, idx) => (
            <div
              key={etkinlik.ad}
              className="card-gaming"
              style={{
                padding: '12px 14px',
                display: 'flex', alignItems: 'flex-start', gap: 10,
                borderColor: etkinlik.next.urgent ? 'rgba(212,168,50,0.25)' : undefined,
                background: etkinlik.next.urgent ? 'rgba(212,168,50,0.04)' : undefined,
                position: 'relative', overflow: 'hidden',
              }}
              title={etkinlik.not ?? ''}
            >
              {/* Urgent scan line */}
              {etkinlik.next.urgent && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: 'var(--crimson)', opacity: 0.6,
                }} />
              )}

              {/* Simge */}
              <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: 1, opacity: 0.7, lineHeight: 1 }} aria-hidden="true">
                {SIMGE_MAP[etkinlik.simge] ?? '◈'}
              </span>

              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--steel)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {etkinlik.ad}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 8px', marginTop: 3 }}>
                  <span style={{ fontSize: '0.58rem', color: 'var(--iron)' }}>
                    {etkinlik.saatler.join(', ')}
                  </span>
                  {etkinlik.tur === 'haftalik' && etkinlik.gunler && (
                    <span style={{ fontSize: '0.55rem', color: 'var(--crimson-bright)', fontWeight: 700, opacity: 0.7 }}>
                      {etkinlik.gunler.map(g => GUN[g]).join('/')}
                    </span>
                  )}
                </div>

                <p style={{
                  fontSize: '0.65rem', fontWeight: 800, marginTop: 6,
                  color: etkinlik.next.urgent ? 'var(--crimson-bright)' :
                         etkinlik.next.msDiff < 21600000 ? 'var(--ember)' : '#10B981',
                }}>
                  {etkinlik.next.label} kaldı
                </p>
              </div>

              {/* Sıra numarası */}
              {idx < 3 && (
                <div style={{
                  position: 'absolute', bottom: 0, right: 6,
                  fontFamily: 'var(--font-rajdhani), sans-serif',
                  fontSize: '2.5rem', fontWeight: 900, lineHeight: 1,
                  color: 'var(--border)', pointerEvents: 'none', userSelect: 'none',
                }} aria-hidden="true">
                  {idx + 1}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Toggle */}
        {sorted.length > 5 && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              marginTop: 16, display: 'flex', alignItems: 'center', gap: 6,
              fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--iron)', background: 'none', border: 'none', cursor: 'pointer',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--crimson-bright)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--iron)' }}
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
            {expanded ? 'Daha az' : `Tümü (${sorted.length})`}
          </button>
        )}
      </div>
    </section>
  )
}
