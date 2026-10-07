'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowDownWideNarrow, ArrowUpRight, ArrowUpWideNarrow, RefreshCw, TriangleAlert } from 'lucide-react'

// ── Tipler ───────────────────────────────────────────────────────────────────
interface SitePrice  { server: string; sell: number | null; buy: number | null }
interface SiteData   { name: string; url: string; prices: SitePrice[] }
interface PricesData { [key: string]: SiteData }

// ── Site metadata (logo URL + renk) ─────────────────────────────────────────
const SITE_META: Record<string, { color: string; logo: string }> = {
  knightpin: { color: '#6366f1', logo: 'https://cdn.oyunextechnologies.com/images/logo_1778519291_8f7105a4.png' },
  bynogame:  { color: '#f59e0b', logo: 'https://www.google.com/s2/favicons?domain=bynogame.com&sz=128' },
  kopazar:   { color: '#10b981', logo: 'https://kopazar.com/assetss/images/apple-touch-icon.png' },
  kabasakal: { color: '#3b82f6', logo: 'https://cdn.kabasakalonline.net/uploads/2026/07/favicon-b-y-k-2-2c47fd2e5a.png' },
  oyuneks:   { color: '#ec4899', logo: 'https://www.google.com/s2/favicons?domain=oyuneks.com&sz=128' },
  sonteklif: { color: '#f97316', logo: 'https://www.sonteklif.com/favicon.png' },
  gamesatis: { color: '#8b5cf6', logo: 'https://images.gamesatis.com/assets/logo-light.svg' },
  oyunfor:   { color: '#14b8a6', logo: 'https://www.google.com/s2/favicons?domain=oyunfor.com&sz=128' },
  bursagb:   { color: '#ef4444', logo: 'https://assets.hyperteknoloji.com/cdn/bursagb/setting/dbursagb%286%29_cf2b6ffa603cceb5af92add3b03f55' },
}

// ── Sunucu sırası ve renkleri ────────────────────────────────────────────────
const SERVER_ORDER = ['Zero', 'Pandora', 'Agartha', 'Destan', 'Oreads', 'Dryads', 'Minark', 'Felis']
const SERVER_COLOR: Record<string, string> = {
  Zero: '#60a5fa', Pandora: '#34d399', Agartha: '#fbbf24', Destan: '#a78bfa',
  Oreads: '#fb923c', Dryads: '#f472b6', Minark: '#94a3b8', Felis: '#86efac',
}

const tl = (n: number) => `${n.toLocaleString('tr-TR')} ₺`

function timeAgo(iso: string) {
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (s < 60) return `${s} sn önce`
  if (s < 3600) return `${Math.floor(s / 60)} dk önce`
  return `${Math.floor(s / 3600)} sa önce`
}

// Upstream (ucuzagb.com) şeması belgelenmemiş — beklenmeyen kayıtları ele, sayfayı çökertme
function normalizeSites(raw: unknown): PricesData {
  if (!raw || typeof raw !== 'object') return {}
  const out: PricesData = {}
  for (const [key, v] of Object.entries(raw as Record<string, Partial<SiteData> | null>)) {
    if (!v || typeof v.url !== 'string' || !Array.isArray(v.prices)) continue
    try { new URL(v.url) } catch { continue }
    out[key] = { name: String(v.name ?? key), url: v.url, prices: v.prices }
  }
  return out
}

/** Site logosu: özel logo → Google favicon → baş harf (innerHTML kullanılmaz) */
function SiteLogo({ siteKey, name, domain }: { siteKey: string; name: string; domain: string }) {
  const sources = [SITE_META[siteKey]?.logo, `https://www.google.com/s2/favicons?domain=${domain}&sz=128`].filter(Boolean) as string[]
  const [stage, setStage] = useState(0)
  const color = SITE_META[siteKey]?.color ?? '#a2a1b2'
  return (
    <span
      className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border"
      style={{ borderColor: `${color}40`, background: `${color}1a` }}
    >
      {stage < sources.length ? (
        // eslint-disable-next-line @next/next/no-img-element -- dış site logoları, optimize edilmeden
        <img
          src={sources[stage]}
          alt=""
          width={32}
          height={32}
          loading="lazy"
          className="h-8 w-8 object-contain"
          onError={() => setStage((s) => s + 1)}
        />
      ) : (
        <span className="text-lg font-black" style={{ color }}>{name.charAt(0)}</span>
      )}
    </span>
  )
}

// ── Ana bileşen ───────────────────────────────────────────────────────────────
export function GbFiyatlariClient() {
  const [sites, setSites]         = useState<PricesData>({})
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [loading, setLoading]     = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeServer, setActive] = useState('Zero')
  const [mode, setMode]           = useState<'sell' | 'buy'>('sell')
  const [failed, setFailed]       = useState(false)

  const fetchPrices = useCallback(() =>
    fetch('/api/gb-fiyatlari', { cache: 'no-store' })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<{ sites?: unknown; updatedAt?: string | null }>
      })
      .then(d => {
        setSites(normalizeSites(d.sites))
        setUpdatedAt(d.updatedAt ?? null)
        setFailed(false)
      })
      .catch(() => setFailed(true))
      .finally(() => { setLoading(false); setRefreshing(false) }),
  [])

  useEffect(() => {
    fetchPrices()
    const t = setInterval(fetchPrices, 5 * 60 * 1000)
    return () => clearInterval(t)
  }, [fetchPrices])

  const refresh = () => {
    setRefreshing(true)
    fetchPrices()
  }

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

  // Sunucu özetleri
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

  const siteCount = Object.keys(sites).length
  const color = SERVER_COLOR[activeServer] ?? '#94a3b8'

  return (
    <div className="space-y-8">
      {/* Durum çubuğu */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm text-fg-3" role="status">
          {failed ? (
            <>
              <TriangleAlert size={16} aria-hidden="true" className="text-ember-400" />
              Fiyat kaynağına şu an ulaşılamıyor
            </>
          ) : (
            <>
              <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              {siteCount > 0 ? `${siteCount} site karşılaştırılıyor` : 'Fiyatlar yükleniyor'}
              {updatedAt && <span className="text-fg-4">· Güncelleme: {timeAgo(updatedAt)}</span>}
            </>
          )}
        </p>
        <button type="button" onClick={refresh} disabled={refreshing} className="btn btn-secondary btn-sm">
          <RefreshCw size={15} aria-hidden="true" className={refreshing ? 'animate-spin' : ''} />
          Yenile
        </button>
      </div>

      {/* Sunucu seçici */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-fg-4">Sunucu</p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {summary.map(({ server, minSell, maxBuy }) => {
            const active = activeServer === server
            const c = SERVER_COLOR[server] ?? '#94a3b8'
            return (
              <li key={server}>
                <button
                  type="button"
                  onClick={() => setActive(server)}
                  aria-pressed={active}
                  className="card flex min-h-19 w-full flex-col items-start justify-center px-3.5 py-3 text-left transition-colors hover:border-white/20"
                  style={active ? { borderColor: `${c}80`, background: `${c}14`, boxShadow: `0 8px 28px -12px ${c}66` } : undefined}
                >
                  <span className="text-sm font-bold" style={{ color: active ? c : undefined }}>
                    {server}
                  </span>
                  <span className="mt-1 font-bold tabular-nums text-fg">{minSell ? tl(minSell) : '—'}</span>
                  {maxBuy && <span className="text-xs tabular-nums text-fg-4">alış {tl(maxBuy)}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Özet */}
      {!loading && serverPrices.length > 0 && (
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="card p-5">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-4">En ucuz satış</dt>
            <dd className="mt-1.5 font-display text-2xl font-bold tabular-nums text-emerald-300">{bestSell !== Infinity ? tl(bestSell) : '—'}</dd>
          </div>
          <div className="card p-5">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-4">En yüksek alış</dt>
            <dd className="mt-1.5 font-display text-2xl font-bold tabular-nums text-sky-300">{bestBuy !== -Infinity ? tl(bestBuy) : '—'}</dd>
          </div>
          <div className="card p-5">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-4">Listeleyen site</dt>
            <dd className="mt-1.5 font-display text-2xl font-bold tabular-nums text-fg">{serverPrices.length}</dd>
          </div>
          <div className="card p-5">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-4">Son güncelleme</dt>
            <dd className="mt-1.5 text-lg font-semibold text-fg-2">{updatedAt ? timeAgo(updatedAt) : '—'}</dd>
          </div>
        </dl>
      )}

      {/* Liste başlığı + sıralama */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
          <h2 className="text-xl font-bold">{activeServer} Sunucusu</h2>
          <span className="text-sm text-fg-4">{serverPrices.length} site listelendi</span>
        </div>
        <div className="inline-flex rounded-xl border border-white/10 bg-white/3 p-1" role="group" aria-label="Sıralama">
          {(['sell', 'buy'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3.5 text-sm font-semibold transition-colors ${
                mode === m ? 'bg-white/10 text-fg' : 'text-fg-3 hover:text-fg'
              }`}
            >
              {m === 'sell' ? <ArrowDownWideNarrow size={16} aria-hidden="true" /> : <ArrowUpWideNarrow size={16} aria-hidden="true" />}
              {m === 'sell' ? 'En ucuz satış' : 'En yüksek alış'}
            </button>
          ))}
        </div>
      </div>

      {/* Fiyat listesi */}
      {loading ? (
        <div className="space-y-3" aria-busy="true" aria-label="Fiyatlar yükleniyor">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="card h-20 animate-pulse" />
          ))}
        </div>
      ) : serverPrices.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center" role="status">
          {failed && <TriangleAlert size={28} aria-hidden="true" className="text-ember-400" />}
          <p className="font-semibold text-fg-2">
            {failed ? 'Fiyatlar şu an alınamıyor. Birkaç dakika sonra tekrar dene.' : 'Bu sunucu için fiyat bulunamadı'}
          </p>
          {failed && <p className="max-w-md text-sm text-fg-4">Veriler üçüncü taraf bir kaynaktan geliyor; kaynak yanıt vermediğinde liste boş görünür.</p>}
        </div>
      ) : (
        <ol className="space-y-3">
          {serverPrices.map((s, idx) => {
            const isBestSell = s.sell !== null && s.sell === bestSell
            const isBestBuy  = s.buy  !== null && s.buy  === bestBuy
            const domain = new URL(s.url).hostname
            const highlight = (mode === 'sell' && isBestSell) || (mode === 'buy' && isBestBuy)

            return (
              <li key={s.key}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className={`group card card-interactive flex items-center gap-4 px-4 py-3.5 sm:px-5 ${highlight ? 'border-emerald-400/30 bg-emerald-500/5' : ''}`}
                >
                  <span className="hidden w-5 shrink-0 text-center text-sm font-bold tabular-nums text-fg-4 sm:block">{idx + 1}</span>
                  <SiteLogo siteKey={s.key} name={s.name} domain={domain} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-semibold text-fg">{s.name}</span>
                      {mode === 'sell' && isBestSell && <span className="chip hidden border-emerald-400/35 bg-emerald-500/10 text-emerald-200 sm:inline-flex">En ucuz</span>}
                      {mode === 'buy' && isBestBuy && <span className="chip hidden border-sky-400/35 bg-sky-500/10 text-sky-200 sm:inline-flex">En yüksek</span>}
                    </span>
                    <span className="block truncate text-sm text-fg-4">{domain}</span>
                  </span>
                  <span className="text-right">
                    <span className="block text-xs text-fg-4">Satış</span>
                    <span className={`block font-bold tabular-nums ${isBestSell ? 'text-emerald-300' : 'text-fg'}`}>{s.sell !== null ? tl(s.sell) : '—'}</span>
                  </span>
                  <span className="hidden text-right sm:block">
                    <span className="block text-xs text-fg-4">Alış</span>
                    <span className={`block font-semibold tabular-nums ${isBestBuy ? 'text-sky-300' : 'text-fg-3'}`}>{s.buy !== null ? tl(s.buy) : '—'}</span>
                  </span>
                  <ArrowUpRight size={16} aria-hidden="true" className="hidden shrink-0 text-fg-4 transition-colors group-hover:text-fg sm:block" />
                </a>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
