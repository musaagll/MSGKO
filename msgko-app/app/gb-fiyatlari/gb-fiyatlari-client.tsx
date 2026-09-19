'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// ── Tipler ───────────────────────────────────────────────────────────────────
interface SitePrice  { server: string; sell: number | null; buy: number | null }
interface SiteData   { name: string; url: string; prices: SitePrice[] }
interface PricesData { [key: string]: SiteData }

// ── Site metadata (logo URL + renk) ─────────────────────────────────────────
const SITE_META: Record<string, { color: string; bg: string; logo: string }> = {
  knightpin:  {
    color: '#6366f1', bg: 'rgba(99,102,241,0.12)',
    logo: 'https://cdn.oyunextechnologies.com/images/logo_1778519291_8f7105a4.png',
  },
  bynogame:   {
    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',
    logo: 'https://www.google.com/s2/favicons?domain=bynogame.com&sz=128',
  },
  kopazar:    {
    color: '#10b981', bg: 'rgba(16,185,129,0.12)',
    logo: 'https://kopazar.com/assetss/images/apple-touch-icon.png',
  },
  kabasakal:  {
    color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',
    logo: 'https://cdn.kabasakalonline.net/uploads/2026/07/favicon-b-y-k-2-2c47fd2e5a.png',
  },
  oyuneks:    {
    color: '#ec4899', bg: 'rgba(236,72,153,0.12)',
    logo: 'https://www.google.com/s2/favicons?domain=oyuneks.com&sz=128',
  },
  sonteklif:  {
    color: '#f97316', bg: 'rgba(249,115,22,0.12)',
    logo: 'https://www.sonteklif.com/favicon.png',
  },
  gamesatis:  {
    color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)',
    logo: 'https://images.gamesatis.com/assets/logo-light.svg',
  },
  oyunfor:    {
    color: '#14b8a6', bg: 'rgba(20,184,166,0.12)',
    logo: 'https://www.google.com/s2/favicons?domain=oyunfor.com&sz=128',
  },
  bursagb:    {
    color: '#ef4444', bg: 'rgba(239,68,68,0.12)',
    logo: 'https://assets.hyperteknoloji.com/cdn/bursagb/setting/dbursagb%286%29_cf2b6ffa603cceb5af92add3b03f55',
  },
}

function logoUrl(key: string, domain: string) {
  const logo = SITE_META[key]?.logo
  if (logo) return logo
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
}

// ── Sunucu sırası ve renkleri ────────────────────────────────────────────────
const SERVER_ORDER = ['Zero','Pandora','Agartha','Destan','Oreads','Dryads','Minark','Felis']
const SERVER_COLOR: Record<string, { text: string; bg: string; glow: string }> = {
  Zero:    { text: '#60a5fa', bg: 'rgba(96,165,250,0.1)',   glow: 'rgba(96,165,250,0.25)'   },
  Pandora: { text: '#34d399', bg: 'rgba(52,211,153,0.1)',   glow: 'rgba(52,211,153,0.25)'   },
  Agartha: { text: '#fbbf24', bg: 'rgba(251,191,36,0.1)',   glow: 'rgba(251,191,36,0.25)'   },
  Destan:  { text: '#a78bfa', bg: 'rgba(167,139,250,0.1)',  glow: 'rgba(167,139,250,0.25)'  },
  Oreads:  { text: '#fb923c', bg: 'rgba(251,146,60,0.1)',   glow: 'rgba(251,146,60,0.25)'   },
  Dryads:  { text: '#f472b6', bg: 'rgba(244,114,182,0.1)',  glow: 'rgba(244,114,182,0.25)'  },
  Minark:  { text: '#94a3b8', bg: 'rgba(148,163,184,0.1)',  glow: 'rgba(148,163,184,0.2)'   },
  Felis:   { text: '#86efac', bg: 'rgba(134,239,172,0.1)',  glow: 'rgba(134,239,172,0.2)'   },
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60)   return `${s}sn önce`
  if (s < 3600) return `${Math.floor(s/60)}dk önce`
  return `${Math.floor(s/3600)}sa önce`
}

// ── Ana bileşen ───────────────────────────────────────────────────────────────
export function GbFiyatlariClient() {
  const [sites, setSites]         = useState<PricesData>({})
  const [updatedAt, setUpdatedAt] = useState<string|null>(null)
  const [loading, setLoading]     = useState(true)
  const [activeServer, setActive] = useState('Zero')
  const [mode, setMode]           = useState<'sell'|'buy'>('sell')

  const fetchPrices = useCallback(async () => {
    try {
      const r = await fetch('/api/gb-fiyatlari', { cache: 'no-store' })
      if (!r.ok) throw new Error()
      const d = await r.json()
      setSites(d.sites ?? {})
      setUpdatedAt(d.updatedAt ?? null)
    } catch { /* ignore */ } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPrices() }, [fetchPrices])
  useEffect(() => {
    const t = setInterval(fetchPrices, 5 * 60 * 1000)
    return () => clearInterval(t)
  }, [fetchPrices])

  // Seçili sunucu + mod için sıralı liste
  const serverPrices = Object.entries(sites)
    .map(([key, site]) => {
      const sp = site.prices.find(p => p.server === activeServer)
      return { key, name: site.name, url: site.url, sell: sp?.sell ?? null, buy: sp?.buy ?? null }
    })
    .filter(s => s.sell !== null || s.buy !== null)
    .sort((a, b) =>
      mode === 'sell'
        ? (a.sell ?? Infinity) - (b.sell ?? Infinity)
        : (b.buy ?? -Infinity) - (a.buy ?? -Infinity)
    )

  const bestSell = Math.min(...serverPrices.map(s => s.sell ?? Infinity))
  const bestBuy  = Math.max(...serverPrices.map(s => s.buy  ?? -Infinity))

  // Özet kartlar
  const summary = SERVER_ORDER.map(srv => {
    const prices = Object.values(sites).flatMap(site =>
      site.prices.filter(p => p.server === srv).map(p => p.sell).filter((v): v is number => v !== null)
    )
    const buys = Object.values(sites).flatMap(site =>
      site.prices.filter(p => p.server === srv).map(p => p.buy).filter((v): v is number => v !== null)
    )
    return {
      server:  srv,
      minSell: prices.length ? Math.min(...prices) : null,
      maxBuy:  buys.length   ? Math.max(...buys)   : null,
    }
  })

  const sc = SERVER_COLOR[activeServer] ?? SERVER_COLOR['Minark']

  return (
    <div style={{ minHeight: '100vh', background: 'var(--void)' }}>

      {/* Arka plan */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 55% 45% at 10% 20%, rgba(200,150,12,0.06) 0%, transparent 55%)' }} />
      <div className="grid-overlay" style={{ position: 'fixed' }} />
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 10, background: 'linear-gradient(90deg, transparent, var(--crimson), var(--ember), transparent)' }} />

      {/* ── Canlı şerit ── */}
      <div style={{ background: 'rgba(16,185,129,0.04)', borderBottom: '1px solid rgba(16,185,129,0.12)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '8px clamp(1rem, 3vw, 1.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.65rem', color: 'rgba(16,185,129,0.7)', fontWeight: 600, letterSpacing: '0.06em' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.8)', display: 'inline-block', animation: 'dotPulse 2s infinite' }} />
            Canlı · Her 5 dakikada güncellenir
          </div>
          {updatedAt && (
            <span style={{ fontSize: '0.6rem', color: 'var(--iron)' }}>
              Son güncelleme: <span style={{ color: 'var(--steel)' }}>{timeAgo(updatedAt)}</span>
            </span>
          )}
        </div>
      </div>

      {/* ── Header ── */}
      <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: 'clamp(4rem, 6vw, 6rem) clamp(1rem, 3vw, 1.5rem) 2rem' }}>
        <nav style={{ marginBottom: 20 }}>
          <ol style={{ display: 'flex', gap: 8, fontSize: '0.65rem', color: 'var(--iron)', listStyle: 'none' }}>
            <li><Link href="/" style={{ color: 'var(--iron)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--steel)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--iron)' }}>
              Ana Sayfa</Link></li>
            <li style={{ opacity: 0.4 }}>/</li>
            <li style={{ color: 'var(--steel)' }}>GB Fiyatları</li>
          </ol>
        </nav>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 10 }}>Anlık Fiyatlar</p>
            <h1 style={{ fontFamily: 'var(--font-rajdhani), sans-serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, letterSpacing: '0.02em', color: 'var(--platinum)', lineHeight: 1 }}>
              GB <span style={{ color: '#10B981' }}>Fiyatları</span>
            </h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--iron)', marginTop: 8 }}>
              Knight Online Gold Bar — 9 site karşılaştırması · Anlık veriler
            </p>
          </div>
          <button onClick={fetchPrices}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: '1px solid var(--border-md)', color: 'var(--iron)', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(16,185,129,0.4)'; (e.currentTarget as HTMLButtonElement).style.color = '#10B981' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-md)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--iron)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            Yenile
          </button>
        </div>

        {/* ── Sunucu kartları ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 28 }}
          className="sm:grid-cols-4 lg:grid-cols-8">
          {summary.map(({ server, minSell, maxBuy }) => {
            const active = activeServer === server
            const c = SERVER_COLOR[server] ?? SERVER_COLOR['Minark']
            return (
              <button key={server} onClick={() => setActive(server)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: 12, cursor: 'pointer', textAlign: 'left', position: 'relative', overflow: 'hidden', transition: 'all 0.15s',
                  background:  active ? c.bg   : 'rgba(255,255,255,0.02)',
                  border:      `1px solid ${active ? c.text + '50' : 'rgba(255,255,255,0.06)'}`,
                  boxShadow:   active ? `0 4px 24px ${c.glow}` : 'none',
                }}>
                {active && (
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 50% 100%, ${c.glow} 0%, transparent 70%)` }} />
                )}
                <span className="text-[0.65rem] font-bold tracking-wider mb-1.5 relative z-10"
                  style={{ color: active ? c.text : 'rgba(255,255,255,0.3)' }}>
                  {server}
                </span>
                {minSell ? (
                  <span className="text-[0.95rem] font-black tabular-nums text-white/90 relative z-10">
                    {minSell}₺
                  </span>
                ) : (
                  <span className="text-[0.72rem] text-white/15">—</span>
                )}
                {maxBuy && (
                  <span className="text-[0.58rem] text-white/30 mt-0.5 relative z-10">
                    alış {maxBuy}₺
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Mod seçici ── */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 full"
              style={{ background: sc.text, boxShadow: `0 0 8px ${sc.glow}` }} />
            <h2 className="text-[1rem] font-bold" style={{ color: sc.text }}>
              {activeServer} Sunucusu
            </h2>
            <span className="text-[0.72rem] text-white/25">
              {serverPrices.length} site listelendi
            </span>
          </div>
          <div className="flex  overflow-hidden border border-white/[0.07]">
            {(['sell', 'buy'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="px-5 py-2 text-[0.72rem] font-bold tracking-wider uppercase transition-all"
                style={{
                  background: mode === m ? 'rgba(255,255,255,0.07)' : 'transparent',
                  color:      mode === m ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                  borderRight: m === 'sell' ? '1px solid rgba(255,255,255,0.07)' : 'none',
                }}>
                {m === 'sell' ? '↓ En Ucuz Satış' : '↑ En Yüksek Alış'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Fiyat listesi ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-20  animate-pulse"
                style={{ background: 'rgba(255,255,255,0.03)', animationDelay: `${i*0.07}s` }} />
            ))}
          </div>
        ) : serverPrices.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-white/25">Bu sunucu için fiyat bulunamadı</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {serverPrices.map((s, idx) => {
              const isBestSell = s.sell !== null && s.sell === bestSell
              const isBestBuy  = s.buy  !== null && s.buy  === bestBuy
              const meta = SITE_META[s.key] ?? { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', logo: '' }
              const domain = new URL(s.url).hostname

              return (
                <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="group flex items-center gap-4 px-5 py-4 
                    transition-all duration-200 cursor-pointer"
                  style={{
                    background: idx === 0 && isBestSell
                      ? 'rgba(74,222,128,0.05)'
                      : 'rgba(255,255,255,0.025)',
                    border: `1px solid ${
                      idx === 0 && isBestSell
                        ? 'rgba(74,222,128,0.2)'
                        : 'rgba(255,255,255,0.06)'
                    }`,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = meta.bg
                    ;(e.currentTarget as HTMLElement).style.borderColor = meta.color + '40'
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLElement).style.background = idx === 0 && isBestSell
                      ? 'rgba(74,222,128,0.05)' : 'rgba(255,255,255,0.025)'
                    ;(e.currentTarget as HTMLElement).style.borderColor = idx === 0 && isBestSell
                      ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)'
                  }}
                >
                  {/* Sıra numarası */}
                  <span className="text-[0.65rem] font-bold text-white/20 w-5 text-center flex-shrink-0">
                    {idx + 1}
                  </span>

                  {/* Logo */}
                  <div className="flex-shrink-0 w-12 h-12  flex items-center justify-center overflow-hidden"
                    style={{ background: meta.bg, border: `1px solid ${meta.color}30` }}>
                    <Image
                      src={logoUrl(s.key, domain)}
                      alt={s.name}
                      width={40}
                      height={40}
                      className="w-8 h-8 object-contain"
                      unoptimized
                      onError={(e) => {
                        const el = e.target as HTMLImageElement
                        // Fallback: Google favicon
                        if (!el.src.includes('google.com')) {
                          el.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
                        } else {
                          el.style.display = 'none'
                          if (el.parentElement) {
                            el.parentElement.innerHTML =
                              `<span style="font-size:1.3rem;font-weight:900;color:${meta.color}">${s.name[0]}</span>`
                          }
                        }
                      }}
                    />
                  </div>

                  {/* Site adı + domain */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.88rem] font-bold text-white/80
                      group-hover:text-white transition-colors truncate">
                      {s.name}
                    </p>
                    <p className="text-[0.65rem] text-white/25 mt-0.5">{domain}</p>
                  </div>

                  {/* En ucuz / en yüksek badge */}
                  <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    {isBestSell && mode === 'sell' && (
                      <span className="text-[0.62rem] font-black px-2 py-1 
                        bg-green-500/15 text-green-400 border border-green-500/30 tracking-wider">
                        ★ EN UCUZ
                      </span>
                    )}
                    {isBestBuy && mode === 'buy' && (
                      <span className="text-[0.62rem] font-black px-2 py-1 
                        bg-blue-500/15 text-blue-400 border border-blue-500/30 tracking-wider">
                        ★ EN YÜKSEK
                      </span>
                    )}
                  </div>

                  {/* Fiyatlar */}
                  <div className="flex items-center gap-6 flex-shrink-0">
                    {/* Satış */}
                    <div className="text-right">
                      <p className="text-[0.6rem] text-white/25 mb-0.5">Satış</p>
                      {s.sell !== null ? (
                        <p className={`text-[1rem] font-black tabular-nums leading-tight ${
                          isBestSell ? 'text-green-400' : 'text-white/85'
                        }`}>
                          {s.sell.toLocaleString('tr-TR')}₺
                        </p>
                      ) : (
                        <p className="text-[0.8rem] text-white/20">—</p>
                      )}
                    </div>

                    {/* Alış */}
                    <div className="text-right hidden sm:block">
                      <p className="text-[0.6rem] text-white/25 mb-0.5">Alış</p>
                      {s.buy !== null ? (
                        <p className={`text-[0.85rem] font-semibold tabular-nums leading-tight ${
                          isBestBuy ? 'text-blue-400' : 'text-white/40'
                        }`}>
                          {s.buy.toLocaleString('tr-TR')}₺
                        </p>
                      ) : (
                        <p className="text-[0.8rem] text-white/20">—</p>
                      )}
                    </div>

                    {/* Ok */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2"
                      className="text-white/15 group-hover:text-white/50 transition-colors flex-shrink-0">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </div>
                </a>
              )
            })}
          </div>
        )}


      </div>
    </div>
  )
}
