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

interface EtkinlikData {
  etkinlikler: Etkinlik[]
}

const GUN_ADLARI = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi']

// Sonraki saati hesapla (Türkiye saati = UTC+3)
function nextOccurrence(etkinlik: Etkinlik): { label: string; msDiff: number } {
  const now = new Date()
  const trOffset = 3 * 60 // UTC+3 dakika
  const trNow = new Date(now.getTime() + (trOffset + now.getTimezoneOffset()) * 60000)

  let bestMs = Infinity
  let bestLabel = ''

  const days = etkinlik.gunler ?? [0,1,2,3,4,5,6]

  for (const gun of days) {
    for (const saat of etkinlik.saatler) {
      const [hh, mm] = saat.split(':').map(Number)
      // Bu haftaki o gün
      const diff = (gun - trNow.getDay() + 7) % 7
      const candidate = new Date(trNow)
      candidate.setDate(candidate.getDate() + diff)
      candidate.setHours(hh, mm, 0, 0)

      let ms = candidate.getTime() - trNow.getTime()
      if (ms <= 0) ms += 7 * 24 * 3600000 // geçtiyse haftaya

      if (ms < bestMs) {
        bestMs = ms
        const inHrs  = Math.floor(ms / 3600000)
        const inMins = Math.floor((ms % 3600000) / 60000)
        if (inHrs < 24) {
          bestLabel = inHrs > 0
            ? `${inHrs}sa ${inMins}dk`
            : `${inMins}dk`
        } else {
          const inDays = Math.floor(inHrs / 24)
          bestLabel = `${inDays}g ${inHrs % 24}sa`
        }
      }
    }
  }
  return { label: bestLabel, msDiff: bestMs }
}

const SIMGE_MAP: Record<string, string> = {
  'bi-fire': '🔥',
  'bi-shield-shaded': '🛡️',
  'bi-puzzle': '🧩',
  'bi-shield-slash': '⚔️',
  'bi-bug': '🏛️',
  'bi-gem': '💎',
  'bi-moon-stars': '🌙',
  'bi-flag': '🏰',
  'bi-door-open': '🚪',
  'bi-wrench': '🔧',
}

export function EtkinlikSection() {
  const [data, setData]         = useState<EtkinlikData | null>(null)
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [, setTick]             = useState(0)

  useEffect(() => {
    fetch('/api/gb-fiyatlari?etkinlik=1')
      .then(r => r.json())
      .then((d: EtkinlikData) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Her dakika geri sayım güncelle
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 60000)
    return () => clearInterval(t)
  }, [])

  if (loading) return null
  if (!data?.etkinlikler.length) return null

  // Günlük etkinlikler — en yakın olana göre sırala
  const sorted = [...data.etkinlikler]
    .filter(e => !e.dogrulanmadi)
    .map(e => ({ ...e, next: nextOccurrence(e) }))
    .sort((a, b) => a.next.msDiff - b.next.msDiff)

  const visible = expanded ? sorted : sorted.slice(0, 5)

  return (
    <section
      className="w-full border-t border-white/[0.04] py-8"
      style={{ background: '#07070B' }}
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8">

        {/* Başlık */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[0.6rem] tracking-[0.25em] uppercase font-bold text-purple-400/60 mb-0.5">
              ETKİNLİK TAKVİMİ
            </p>
            <h2 className="text-[1rem] font-black tracking-[0.04em] uppercase text-white/80">
              Sıradaki Etkinlikler
            </h2>
          </div>
          <a
            href="https://ucuzagb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.6rem] text-white/20 hover:text-white/45 transition-colors"
          >
            ucuzagb.com ↗
          </a>
        </div>

        {/* Liste */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {visible.map(etkinlik => (
            <div
              key={etkinlik.ad}
              className="group flex items-start gap-3 p-3 border border-white/[0.05]
                rounded-sm hover:border-white/[0.1] transition-colors"
              style={{ background: 'rgba(255,255,255,0.02)' }}
              title={etkinlik.not ?? ''}
            >
              <span className="text-xl flex-shrink-0 mt-0.5">
                {SIMGE_MAP[etkinlik.simge] ?? '📅'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.75rem] font-semibold text-white/80 truncate leading-snug">
                  {etkinlik.ad}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  {/* Saatler */}
                  <span className="text-[0.62rem] text-white/35">
                    {etkinlik.saatler.join(', ')}
                  </span>
                  {/* Gün bilgisi */}
                  {etkinlik.tur === 'haftalik' && etkinlik.gunler && (
                    <span className="text-[0.58rem] text-purple-400/50 font-semibold">
                      {etkinlik.gunler.map(g => GUN_ADLARI[g]).join('/')}
                    </span>
                  )}
                </div>
                {/* Geri sayım */}
                <p className="text-[0.65rem] font-bold mt-1" style={{ color: '#22c55e' }}>
                  {etkinlik.next.label} kaldı
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tümünü göster */}
        {sorted.length > 5 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 text-[0.7rem] text-white/25 hover:text-white/55 transition-colors
              tracking-wider uppercase"
          >
            {expanded ? '▲ Daha az göster' : `▼ Tümünü göster (${sorted.length})`}
          </button>
        )}
      </div>
    </section>
  )
}
