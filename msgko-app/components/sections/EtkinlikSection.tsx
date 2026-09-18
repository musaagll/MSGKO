'use client'

import { useState, useEffect } from 'react'

interface Etkinlik {
  ad: string
  kisa: string
  tur: 'gunluk' | 'haftalik'
  gunler: number[] | null
  saatler: string[]
  simge: string
  minLevel?: number
  sureDk?: number
  not?: string
  dogrulanmadi?: boolean
}

interface EtkinlikData { etkinlikler: Etkinlik[] }

const GUN_ADLARI = ['Paz','Pzt','Sal','Çar','Per','Cum','Cmt']

function nextOccurrence(etkinlik: Etkinlik): { label: string; msDiff: number } {
  const now     = new Date()
  const trOffset = 3 * 60
  const trNow   = new Date(now.getTime() + (trOffset + now.getTimezoneOffset()) * 60000)
  let bestMs    = Infinity
  let bestLabel = ''
  const days    = etkinlik.gunler ?? [0,1,2,3,4,5,6]

  for (const gun of days) {
    for (const saat of etkinlik.saatler) {
      const [hh, mm] = saat.split(':').map(Number)
      const diff     = (gun - trNow.getDay() + 7) % 7
      const candidate = new Date(trNow)
      candidate.setDate(candidate.getDate() + diff)
      candidate.setHours(hh, mm, 0, 0)
      let ms = candidate.getTime() - trNow.getTime()
      if (ms <= 0) ms += 7 * 24 * 3600000
      if (ms < bestMs) {
        bestMs = ms
        const inHrs  = Math.floor(ms / 3600000)
        const inMins = Math.floor((ms % 3600000) / 60000)
        if (inHrs < 24) {
          bestLabel = inHrs > 0 ? `${inHrs}sa ${inMins}dk` : `${inMins}dk`
        } else {
          bestLabel = `${Math.floor(inHrs / 24)}g ${inHrs % 24}sa`
        }
      }
    }
  }
  return { label: bestLabel, msDiff: bestMs }
}

/* Simge → minimal SVG yerine tek karakter emoji haritası — temiz görünür */
const SIMGE_MAP: Record<string, string> = {
  'bi-fire': '🔥', 'bi-shield-shaded': '🛡', 'bi-puzzle': '◈',
  'bi-shield-slash': '⚔', 'bi-bug': '🏛', 'bi-gem': '◆',
  'bi-moon-stars': '◉', 'bi-flag': '⚑', 'bi-door-open': '▶',
  'bi-wrench': '⊕',
}

/* Renk kategorisi — msDiff'e göre: 0-1sa kırmızı, 1-6sa sarı, diğer nötr */
function urgencyStyle(msDiff: number): { color: string; label: string } {
  const hrs = msDiff / 3600000
  if (hrs < 1)  return { color: 'rgba(239,68,68,0.85)',  label: 'rgba(239,68,68,0.85)' }
  if (hrs < 6)  return { color: 'rgba(212,168,83,0.9)',   label: 'rgba(212,168,83,0.9)' }
  return             { color: 'rgba(160,160,184,0.45)',   label: 'rgba(160,160,184,0.45)' }
}

export function EtkinlikSection() {
  const [data,    setData]    = useState<EtkinlikData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [, setTick] = useState(0)

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
      className="w-full"
      style={{ background: 'var(--bg-void)', borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div
        className="max-w-[1280px] mx-auto"
        style={{ padding: '2.5rem clamp(1.25rem, 4vw, 2.5rem) 3rem' }}
      >
        {/* ── Başlık ── */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="section-label mb-1.5">Etkinlik Takvimi</p>
            <h2
              style={{
                fontFamily: 'var(--font-rajdhani), sans-serif',
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'rgba(242,242,244,0.7)',
              }}
            >
              Sıradaki Etkinlikler
            </h2>
          </div>
        </div>

        {/* ── Gold divider ── */}
        <div className="divider-gold mb-6" />

        {/* ── Kart grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {visible.map((etkinlik, idx) => {
            const urg = urgencyStyle(etkinlik.next.msDiff)
            const isUrgent = etkinlik.next.msDiff < 3600000
            return (
              <div
                key={etkinlik.ad}
                className="group relative flex items-start gap-3 transition-all duration-250"
                style={{
                  padding: '0.875rem 1rem',
                  background: 'var(--bg-surface)',
                  border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.14)' : 'var(--border-subtle)'}`,
                }}
                title={etkinlik.not ?? ''}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = isUrgent ? 'rgba(239,68,68,0.28)' : 'rgba(212,168,83,0.18)'
                  el.style.background  = isUrgent ? 'rgba(239,68,68,0.025)' : 'rgba(212,168,83,0.025)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = isUrgent ? 'rgba(239,68,68,0.14)' : 'var(--border-subtle)'
                  el.style.background  = 'var(--bg-surface)'
                }}
              >
                {/* Simge */}
                <span
                  className="flex-shrink-0 leading-none mt-0.5 select-none"
                  style={{ fontSize: '1.1rem', opacity: 0.7 }}
                  aria-hidden="true"
                >
                  {SIMGE_MAP[etkinlik.simge] ?? '◈'}
                </span>

                <div className="min-w-0 flex-1">
                  {/* Ad */}
                  <p
                    className="truncate leading-snug"
                    style={{ fontSize: '0.74rem', fontWeight: 600, color: 'rgba(242,242,244,0.72)' }}
                  >
                    {etkinlik.ad}
                  </p>

                  {/* Saatler + gün */}
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span style={{ fontSize: '0.6rem', color: 'rgba(160,160,184,0.35)' }}>
                      {etkinlik.saatler.join(', ')}
                    </span>
                    {etkinlik.tur === 'haftalik' && etkinlik.gunler && (
                      <span style={{ fontSize: '0.58rem', color: 'rgba(212,168,83,0.45)', fontWeight: 600 }}>
                        {etkinlik.gunler.map(g => GUN_ADLARI[g]).join('/')}
                      </span>
                    )}
                  </div>

                  {/* Geri sayım */}
                  <p
                    className="mt-1.5 font-bold"
                    style={{ fontSize: '0.65rem', color: urg.color }}
                  >
                    {etkinlik.next.label} kaldı
                  </p>
                </div>

                {/* Sıra numarası — faint watermark */}
                {idx < 3 && (
                  <div
                    className="absolute bottom-1 right-2 font-black leading-none pointer-events-none select-none"
                    style={{
                      fontFamily: 'var(--font-rajdhani), sans-serif',
                      fontSize: '2.2rem',
                      color: 'rgba(212,168,83,0.04)',
                    }}
                    aria-hidden="true"
                  >
                    {idx + 1}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Tümünü göster ── */}
        {sorted.length > 5 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-5 flex items-center gap-1.5 transition-colors duration-200"
            style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(160,160,184,0.28)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(212,168,83,0.6)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(160,160,184,0.28)' }}
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} aria-hidden="true">
              <path d="M6 9l6 6 6-6"/>
            </svg>
            {expanded ? 'Daha az göster' : `Tümünü göster (${sorted.length})`}
          </button>
        )}
      </div>
    </section>
  )
}
