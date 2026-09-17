'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

// ── Tipler ──────────────────────────────────────────────────────────────────
interface SitePrice {
  server: string
  sell: number | null
  buy: number | null
}

interface SiteData {
  name: string
  url: string
  prices: SitePrice[]
}

interface PricesData {
  [siteName: string]: SiteData
}

// ── KO sunucularının sırası ve renkleri ─────────────────────────────────────
const SERVER_ORDER = ['Zero', 'Pandora', 'Agartha', 'Destan', 'Oreads', 'Dryads', 'Minark', 'Felis']
const SERVER_COLOR: Record<string, string> = {
  Zero:    '#60a5fa',
  Pandora: '#34d399',
  Agartha: '#fbbf24',
  Destan:  '#a78bfa',
  Oreads:  '#fb923c',
  Dryads:  '#f472b6',
  Minark:  '#94a3b8',
  Felis:   '#86efac',
}

function timeAgo(iso: string): string {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (d < 60)   return `${d}sn önce`
  if (d < 3600) return `${Math.floor(d / 60)}dk önce`
  return `${Math.floor(d / 3600)}sa önce`
}

// ── Ana bileşen ──────────────────────────────────────────────────────────────
export function GbFiyatlariClient() {
  const [sites, setSites]           = useState<PricesData>({})
  const [updatedAt, setUpdatedAt]   = useState<string | null>(null)
  const [loading, setLoading]       = useState(true)
  const [activeServer, setActive]   = useState('Zero')
  const [mode, setMode]             = useState<'sell' | 'buy'>('sell')
  const [lastFetch, setLastFetch]   = useState<Date | null>(null)

  const fetchPrices = useCallback(async () => {
    try {
      const r = await fetch('/api/gb-fiyatlari', { cache: 'no-store' })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const d = await r.json()
      setSites(d.sites ?? {})
      setUpdatedAt(d.updatedAt ?? null)
      setLastFetch(new Date())
    } catch { /* ignore */ } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPrices() }, [fetchPrices])
  useEffect(() => {
    const t = setInterval(fetchPrices, 5 * 60 * 1000)
    return () => clearInterval(t)
  }, [fetchPrices])

  // Seçili sunucu için tüm sitelerin fiyatları
  const serverPrices = Object.entries(sites)
    .map(([key, site]) => {
      const sp = site.prices.find(p => p.server === activeServer)
      return {
        key,
        name: site.name,
        url:  site.url,
        sell: sp?.sell ?? null,
        buy:  sp?.buy  ?? null,
      }
    })
    .filter(s => s.sell !== null || s.buy !== null)
    .sort((a, b) => {
      const av = mode === 'sell' ? (a.sell ?? Infinity) : (b.buy ?? -Infinity)
      const bv = mode === 'sell' ? (b.sell ?? Infinity) : (a.buy ?? -Infinity)
      return mode === 'sell' ? av - bv : bv - av
    })

  const bestSell = Math.min(...serverPrices.map(s => s.sell ?? Infinity))
  const bestBuy  = Math.max(...serverPrices.map(s => s.buy  ?? -Infinity))

  // Tüm sunucular için özet (en ucuz satış)
  const serverSummary = SERVER_ORDER.map(srv => {
    const prices = Object.values(sites)
      .map(site => site.prices.find(p => p.server === srv)?.sell ?? null)
      .filter((v): v is number => v !== null)
    const minSell = prices.length ? Math.min(...prices) : null
    const maxBuy = Object.values(sites)
      .map(site => site.prices.find(p => p.server === srv)?.buy ?? null)
      .filter((v): v is number => v !== null)
    const bestBuyForSrv = maxBuy.length ? Math.max(...maxBuy) : null
    return { server: srv, minSell, bestBuy: bestBuyForSrv }
  })

  return (
    <div className="min-h-screen" style={{ background: '#07070f' }}>

      {/* ── Header ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-6">
        <nav className="mb-4">
          <ol className="flex items-center gap-2 text-[0.68rem] text-white/20">
            <li><Link href="/" className="hover:text-white/50 transition-colors">Ana Sayfa</Link></li>
            <li className="text-white/10">/</li>
            <li className="text-white/40">GB Fiyatları</li>
          </ol>
        </nav>

        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-green-400"
                style={{ boxShadow: '0 0 6px #4ade80' }} />
              <span className="text-[0.6rem] tracking-[0.25em] uppercase font-bold text-green-400/70">
                Canlı Fiyatlar
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              GB <span className="text-green-400">Fiyatları</span>
            </h1>
            <p className="text-[0.78rem] text-white/30 mt-1">
              9 site · 8 sunucu · 5dk güncelleme
            </p>
          </div>
          <div className="flex items-center gap-3 text-[0.7rem] text-white/25">
            {updatedAt && <span>Güncellendi: <span className="text-white/50">{timeAgo(updatedAt)}</span></span>}
            <button onClick={fetchPrices}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/[0.08]
                hover:border-white/20 transition-all text-white/40 hover:text-white/70">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
              Yenile
            </button>
          </div>
        </div>

        {/* ── Sunucu Özet Kartları ── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-20 rounded animate-pulse"
                style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {serverSummary.map(({ server, minSell, bestBuy: bestBuyVal }) => {
              const active = activeServer === server
              const color  = SERVER_COLOR[server] ?? '#94a3b8'
              return (
                <button
                  key={server}
                  onClick={() => setActive(server)}
                  className="flex flex-col items-start p-3 rounded transition-all duration-150 text-left"
                  style={{
                    background:  active ? `${color}12` : 'rgba(255,255,255,0.02)',
                    border:      `1px solid ${active ? color + '40' : 'rgba(255,255,255,0.06)'}`,
                    boxShadow:   active ? `0 0 16px ${color}18` : 'none',
                  }}
                >
                  <span className="text-[0.7rem] font-bold mb-1" style={{ color: active ? color : 'rgba(255,255,255,0.45)' }}>
                    {server}
                  </span>
                  {minSell ? (
                    <span className="text-[1rem] font-black tabular-nums text-white/90">
                      {minSell}₺
                    </span>
                  ) : (
                    <span className="text-[0.75rem] text-white/20">—</span>
                  )}
                  {bestBuyVal && (
                    <span className="text-[0.62rem] text-white/30 mt-0.5">
                      Alış: {bestBuyVal}₺
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Detay Tablo ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-24">

        {/* Filtre bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: SERVER_COLOR[activeServer] ?? '#94a3b8' }} />
            <h2 className="text-[0.9rem] font-bold text-white/80"
              style={{ color: SERVER_COLOR[activeServer] ?? '#94a3b8' }}>
              {activeServer} Sunucusu
            </h2>
            <span className="text-[0.72rem] text-white/30 ml-2">
              {serverPrices.length} site karşılaştırıldı
            </span>
          </div>

          {/* Satış / Alış toggle */}
          <div className="flex rounded overflow-hidden border border-white/[0.07]">
            {(['sell', 'buy'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="px-4 py-1.5 text-[0.72rem] font-semibold tracking-wider uppercase transition-all"
                style={{
                  background: mode === m ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color:      mode === m ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)',
                }}>
                {m === 'sell' ? 'Satış Fiyatı' : 'Alış Fiyatı'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-14 rounded animate-pulse"
                style={{ background: 'rgba(255,255,255,0.03)', animationDelay: `${i * 0.05}s` }} />
            ))}
          </div>
        ) : serverPrices.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-[0.85rem] text-white/25">Bu sunucu için fiyat bulunamadı</p>
          </div>
        ) : (
          <div className="rounded overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Desktop tablo */}
            <table className="w-full text-[0.82rem] border-collapse hidden md:table">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th className="text-left py-3 px-5 text-[0.6rem] tracking-[0.2em] uppercase text-white/30 font-semibold">
                    Site
                  </th>
                  <th className="text-right py-3 px-5 text-[0.6rem] tracking-[0.2em] uppercase text-white/30 font-semibold">
                    Satış Fiyatı
                  </th>
                  <th className="text-right py-3 px-5 text-[0.6rem] tracking-[0.2em] uppercase text-white/30 font-semibold">
                    Alış Fiyatı
                  </th>
                  <th className="text-right py-3 px-5 text-[0.6rem] tracking-[0.2em] uppercase text-white/30 font-semibold w-28">
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody>
                {serverPrices.map((s, idx) => {
                  const isBestSell = s.sell !== null && s.sell === bestSell
                  const isBestBuy  = s.buy  !== null && s.buy  === bestBuy
                  return (
                    <tr key={s.key}
                      className="border-b hover:bg-white/[0.02] transition-colors"
                      style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      {/* Site adı */}
                      <td className="py-3 px-5">
                        <a href={s.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 group">
                          <span className="text-[0.82rem] font-semibold text-white/75
                            group-hover:text-white transition-colors">
                            {s.name}
                          </span>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            className="text-white/20 group-hover:text-white/50 transition-colors">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </a>
                      </td>
                      {/* Satış */}
                      <td className="py-3 px-5 text-right">
                        {s.sell !== null ? (
                          <div className="flex items-center justify-end gap-2">
                            {isBestSell && (
                              <span className="text-[0.58rem] font-bold px-1.5 py-0.5 rounded-sm
                                bg-green-500/15 text-green-400 border border-green-500/25">
                                EN UCUZ
                              </span>
                            )}
                            <span className={`font-black text-[0.92rem] tabular-nums ${
                              isBestSell ? 'text-green-400' : 'text-white/75'
                            }`}>
                              {s.sell.toLocaleString('tr-TR')}₺
                            </span>
                          </div>
                        ) : (
                          <span className="text-white/20 text-xs">—</span>
                        )}
                      </td>
                      {/* Alış */}
                      <td className="py-3 px-5 text-right">
                        {s.buy !== null ? (
                          <div className="flex items-center justify-end gap-2">
                            {isBestBuy && (
                              <span className="text-[0.58rem] font-bold px-1.5 py-0.5 rounded-sm
                                bg-blue-500/15 text-blue-400 border border-blue-500/25">
                                EN YÜKSEK
                              </span>
                            )}
                            <span className={`font-semibold tabular-nums ${
                              isBestBuy ? 'text-blue-400' : 'text-white/45'
                            }`}>
                              {s.buy.toLocaleString('tr-TR')}₺
                            </span>
                          </div>
                        ) : (
                          <span className="text-white/20 text-xs">—</span>
                        )}
                      </td>
                      {/* Durum */}
                      <td className="py-3 px-5 text-right">
                        <a href={s.url} target="_blank" rel="noopener noreferrer"
                          className="inline-block text-[0.68rem] font-semibold tracking-wider uppercase
                            px-3 py-1 border border-white/[0.08] text-white/35
                            hover:border-white/25 hover:text-white/70 transition-all">
                          Siteye Git
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Mobil kartlar */}
            <div className="md:hidden divide-y divide-white/[0.04]">
              {serverPrices.map(s => {
                const isBestSell = s.sell !== null && s.sell === bestSell
                const isBestBuy  = s.buy  !== null && s.buy  === bestBuy
                return (
                  <div key={s.key} className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <a href={s.url} target="_blank" rel="noopener noreferrer"
                        className="text-[0.82rem] font-semibold text-white/75 hover:text-white transition-colors">
                        {s.name}
                      </a>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {s.sell !== null && (
                        <p className={`font-black text-[0.88rem] tabular-nums ${
                          isBestSell ? 'text-green-400' : 'text-white/75'
                        }`}>
                          {s.sell.toLocaleString('tr-TR')}₺
                          {isBestSell && <span className="text-[0.58rem] ml-1 text-green-400/70">★</span>}
                        </p>
                      )}
                      {s.buy !== null && (
                        <p className={`text-[0.68rem] tabular-nums ${
                          isBestBuy ? 'text-blue-400/80' : 'text-white/30'
                        }`}>
                          Alış: {s.buy.toLocaleString('tr-TR')}₺
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Kaynak notu */}
        <p className="text-[0.62rem] text-white/15 text-center mt-6">
          Veriler{' '}
          <a href="https://ucuzagb.com" target="_blank" rel="noopener noreferrer"
            className="hover:text-white/40 transition-colors underline underline-offset-2">
            ucuzagb.com
          </a>{' '}
          üzerinden 5 dakikada bir güncellenir.
        </p>
      </div>
    </div>
  )
}
