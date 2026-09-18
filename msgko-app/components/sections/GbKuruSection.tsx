'use client'

import { useState, useEffect } from 'react'

interface Sunucu { sunucu: string; alisFiyati: number; satisFiyati: number }
interface GbKuruData { guncellendi: string; sunucular: Sunucu[] }

const SUNUCU_MAP: Record<string, string> = {
  Zero: 'zero', Agartha: 'agartha', Pandora: 'pandora', Destan: 'destan', Oreads: 'oreads',
}

/* Her sunucu için farklı bir nüans — hepsi neutral/gold tonu */
const SUNUCU_DOT: Record<string, string> = {
  Zero:    'rgba(212,168,83,0.9)',
  Agartha: 'rgba(232,196,106,0.9)',
  Pandora: 'rgba(196,196,208,0.7)',
  Destan:  'rgba(180,144,100,0.9)',
  Oreads:  'rgba(242,242,244,0.55)',
}

export function GbKuruSection() {
  const [data,    setData]    = useState<GbKuruData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = () =>
    fetch('/api/gb-fiyatlari?kuru=1')
      .then(r => r.json())
      .then((d: GbKuruData) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))

  useEffect(() => { fetchData() }, [])
  useEffect(() => {
    const t = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(t)
  }, [])

  const sunucular = data?.sunucular.filter(s => SUNUCU_MAP[s.sunucu]) ?? []

  return (
    <section
      className="w-full"
      style={{
        background: 'rgba(6,6,8,0.98)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div
        className="max-w-[1280px] mx-auto flex flex-wrap items-center gap-x-8 gap-y-2"
        style={{ padding: '0.65rem clamp(1.25rem, 4vw, 2.5rem)' }}
      >
        {/* Etiket */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-1 h-3" style={{ background: 'rgba(212,168,83,0.5)' }} />
          <span className="text-[0.58rem] font-bold tracking-[0.28em] uppercase"
            style={{ color: 'rgba(212,168,83,0.55)' }}>
            GB Kuru
          </span>
          <span className="text-[0.55rem]" style={{ color: 'rgba(160,160,184,0.2)' }}>
            · canlı
          </span>
        </div>

        {/* Veri */}
        {loading ? (
          <div className="flex gap-5">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-3 rounded-sm animate-pulse"
                style={{ width: 72, background: 'rgba(255,255,255,0.05)' }} />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {sunucular.map(s => (
              <div key={s.sunucu} className="flex items-center gap-2 text-[0.71rem]">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: SUNUCU_DOT[s.sunucu] ?? 'rgba(160,160,184,0.5)' }}
                />
                <span className="font-medium" style={{ color: 'rgba(160,160,184,0.45)' }}>
                  {s.sunucu}
                </span>
                <span className="font-bold tabular-nums" style={{ color: 'rgba(212,168,83,0.85)' }}>
                  {s.satisFiyati}₺
                </span>
                <span className="text-[0.6rem] tabular-nums" style={{ color: 'rgba(160,160,184,0.25)' }}>
                  /{s.alisFiyati}₺
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Sağ — link */}
        <Link_GB />
      </div>
    </section>
  )
}

/* Ayrı client component olmadan basit anchor */
function Link_GB() {
  return (
    <a
      href="/gb-fiyatlari"
      className="ml-auto hidden sm:flex items-center gap-1.5 text-[0.62rem] font-bold tracking-[0.14em] uppercase transition-colors duration-200 flex-shrink-0"
      style={{ color: 'rgba(212,168,83,0.35)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(212,168,83,0.75)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(212,168,83,0.35)' }}
    >
      Tüm fiyatlar
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </a>
  )
}
