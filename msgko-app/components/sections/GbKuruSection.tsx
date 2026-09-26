'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Sunucu { sunucu: string; alisFiyati: number; satisFiyati: number }
interface GbKuruData { guncellendi: string; sunucular: Sunucu[] }

const SUNUCU_MAP: Record<string, boolean> = {
  Zero: true, Agartha: true, Pandora: true, Destan: true, Oreads: true,
}

const SUNUCU_COLOR: Record<string, string> = {
  Zero: '#e8c96a', Agartha: '#60a5fa', Pandora: '#34d399', Destan: '#a78bfa', Oreads: '#fb923c',
}

export function GbKuruSection() {
  const [data,    setData]    = useState<GbKuruData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = () =>
    fetch('/api/gb-fiyatlari?kuru=1')
      .then(r => r.json())
      .then((d: GbKuruData) => {
        if (d && Array.isArray(d.sunucular)) {
          setData(d)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))

  useEffect(() => { fetchData() }, [])
  useEffect(() => {
    const t = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(t)
  }, [])

  const sunucular = data?.sunucular.filter(s => SUNUCU_MAP[s.sunucu]) ?? []

  return (
    <div style={{ background: 'rgba(7,8,13,0.98)', borderBottom: '1px solid rgba(201,168,76,0.10)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: 2, position: 'absolute', left: 0, top: 0, bottom: 0, background: 'linear-gradient(180deg, transparent, #c9a84c, transparent)', opacity: 0.6 }} />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(16px,3vw,40px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 28px', minHeight: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ width: 5, height: 5, background: '#c9a84c', transform: 'rotate(45deg)', animation: 'dotPulse 2s infinite' }} />
          <span style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#e8c96a', opacity: 0.8 }}>GB Kuru</span>
          <span style={{ fontSize: '0.52rem', color: '#5a5448' }}>· canlı</span>
        </div>
        {loading ? (
          <div style={{ display: 'flex', gap: 16 }}>
            {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 12, width: 72 }} />)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px' }}>
            {sunucular.map(s => (
              <div key={s.sunucu} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.68rem' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: SUNUCU_COLOR[s.sunucu] ?? '#5a5448', flexShrink: 0 }} />
                <span style={{ color: '#9a9080', fontWeight: 500 }}>{s.sunucu}</span>
                <span style={{ color: '#f0ead6', fontWeight: 800 }}>{s.satisFiyati}₺</span>
                <span style={{ color: '#5a5448', fontSize: '0.58rem' }}>/{s.alisFiyati}₺</span>
              </div>
            ))}
          </div>
        )}
        <Link href="/gb-fiyatlari" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#e8c96a', opacity: 0.6, textDecoration: 'none', flexShrink: 0, transition: 'opacity 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.6' }}>
          Karşılaştır
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </div>
    </div>
  )
}
