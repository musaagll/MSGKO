'use client'

import { useState, useEffect } from 'react'

interface Sunucu {
  sunucu: string
  alisFiyati: number
  satisFiyati: number
}

interface GbKuruData {
  guncellendi: string
  sunucular: Sunucu[]
}

// Sadece MSGKO'daki sunucularla eşleştir
const SUNUCU_MAP: Record<string, string> = {
  Zero:    'zero',
  Agartha: 'agartha',
  Pandora: 'pandora',
  Destan:  'destan',
  Oreads:  'oreads',
}

const SUNUCU_COLOR: Record<string, string> = {
  Zero:    '#60a5fa',
  Agartha: '#fbbf24',
  Pandora: '#34d399',
  Destan:  '#a78bfa',
  Oreads:  '#fb923c',
}

export function GbKuruSection() {
  const [data, setData]       = useState<GbKuruData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/gb-fiyatlari?kuru=1')
      .then(r => r.json())
      .then((d: GbKuruData) => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // 5 dk yenile
  useEffect(() => {
    const t = setInterval(() => {
      fetch('/api/gb-fiyatlari?kuru=1')
        .then(r => r.json())
        .then((d: GbKuruData) => setData(d))
        .catch(() => {})
    }, 5 * 60 * 1000)
    return () => clearInterval(t)
  }, [])

  const sunucular = data?.sunucular.filter(s => SUNUCU_MAP[s.sunucu]) ?? []

  return (
    <section
      className="w-full border-b border-white/[0.04]"
      style={{ background: 'rgba(255,255,255,0.015)' }}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 py-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">

          {/* Başlık */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[0.6rem] tracking-[0.2em] uppercase font-bold text-white/30">
              GB Kuru
            </span>
            <span className="text-[0.58rem] text-white/20">·</span>
            <span className="text-[0.6rem] text-white/20">5dk önce</span>
          </div>

          {/* Sunucu kurları */}
          {loading ? (
            <div className="flex gap-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-4 w-20 rounded bg-white/[0.06] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {sunucular.map(s => (
                <div key={s.sunucu} className="flex items-center gap-1.5 text-[0.72rem]">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: SUNUCU_COLOR[s.sunucu] ?? '#94a3b8' }}
                  />
                  <span className="text-white/45 font-medium">{s.sunucu}</span>
                  <span className="text-white/60 font-semibold tabular-nums">
                    {s.satisFiyati}₺
                  </span>
                  <span className="text-white/20 text-[0.6rem]">
                    /{s.alisFiyati}₺
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Kaynak */}
          <a
            href="https://ucuzagb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-[0.58rem] text-white/20 hover:text-white/40 transition-colors flex-shrink-0"
          >
            ucuzagb.com ↗
          </a>
        </div>
      </div>
    </section>
  )
}
