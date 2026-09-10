'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import type { MarketListing, PazarResponse } from '@/app/api/pazar/route'

// ── Sabitler ───────────────────────────────────────────────────────────────────
const SERVERS = [
  { id: 'zero',    label: 'Zero',    color: '#3b82f6' },
  { id: 'destan',  label: 'Destan',  color: '#8b5cf6' },
  { id: 'pandora', label: 'Pandora', color: '#10b981' },
  { id: 'agartha', label: 'Agartha', color: '#f59e0b' },
] as const

type ServerId = 'zero' | 'destan' | 'pandora' | 'agartha'

const SORT_OPTIONS = [
  { value: 'price_asc',  label: 'Fiyat ↑' },
  { value: 'price_desc', label: 'Fiyat ↓' },
  { value: 'name_asc',   label: 'İsim A-Z' },
  { value: 'newest',     label: 'En Yeni' },
]

// ── Yardımcı fonksiyonlar ─────────────────────────────────────────────────────
function formatPrice(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)         return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString('tr-TR')
}

function formatPriceExact(n: number): string {
  return n.toLocaleString('tr-TR') + ' Noah'
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60)   return `${diff} sn önce`
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`
  return `${Math.floor(diff / 3600)} saat önce`
}

function upgradeLabel(level: number | null): string {
  if (level === null || level === 0) return ''
  return `+${level}`
}

// ── PazarClient bileşeni ───────────────────────────────────────────────────────
export function PazarClient() {
  const [server,   setServer]   = useState<ServerId>('zero')
  const [query,    setQuery]    = useState('')
  const [sort,     setSort]     = useState('price_asc')
  const [page,     setPage]     = useState(1)
  const [data,     setData]     = useState<PazarResponse | null>(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [counts,   setCounts]   = useState<Record<string, number>>({})

  // Debounce arama
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [debouncedQ, setDebouncedQ] = useState('')

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      setDebouncedQ(query)
      setPage(1)
    }, 400)
  }, [query])

  // Veri çekme
  const fetchListings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        server,
        sort,
        page: String(page),
        ...(debouncedQ ? { q: debouncedQ } : {}),
      })
      const res = await fetch(`/api/pazar?${params}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: PazarResponse = await res.json()
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }, [server, sort, page, debouncedQ])

  useEffect(() => { fetchListings() }, [fetchListings])

  // 5 dakikada bir otomatik yenile
  useEffect(() => {
    const timer = setInterval(fetchListings, 5 * 60 * 1000)
    return () => clearInterval(timer)
  }, [fetchListings])

  // Sunucu ilan sayılarını çek (stats)
  useEffect(() => {
    fetch('/api/pazar', { method: 'POST' })
      .then(r => r.json())
      .then(d => {
        const c: Record<string, number> = {}
        for (const [k, v] of Object.entries(d)) {
          c[k] = (v as { count: number }).count
        }
        setCounts(c)
      })
      .catch(() => {})
  }, [server])

  // Sunucu değişince sayfa sıfırla
  const handleServerChange = (s: ServerId) => {
    setServer(s)
    setPage(1)
  }

  const currentServer = SERVERS.find(s => s.id === server)!

  return (
    <div className="min-h-screen" style={{ background: '#07070B' }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        {/* Breadcrumb */}
        <nav aria-label="Sayfa konumu" className="mb-6">
          <ol className="flex items-center gap-1.5 text-[0.72rem] text-white/30">
            <li><Link href="/" className="hover:text-white/60 transition-colors">Ana Sayfa</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-white/60">USKO Pazar</li>
          </ol>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-purple-400/60 mb-1">
              CANLI PAZAR
            </p>
            <h1 className="text-2xl md:text-3xl font-black tracking-[0.04em] uppercase text-white"
              style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
              Knight Online USKO Pazar
            </h1>
            <p className="text-[0.8rem] text-white/40 mt-1">
              Her 5 dakikada güncellenir · Anlık item ilanları
            </p>
          </div>

          {/* Son güncelleme */}
          {data?.last_scraped && (
            <div className="flex items-center gap-2 text-[0.72rem] text-white/30">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              Son güncelleme: {timeAgo(data.last_scraped)}
            </div>
          )}
        </div>

        {/* ── Sunucu sekmeleri ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {SERVERS.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleServerChange(s.id as ServerId)}
              className="relative px-4 py-2 text-[0.78rem] font-bold tracking-[0.08em] uppercase
                transition-all duration-200 border"
              style={{
                background:  server === s.id ? `${s.color}18` : 'rgba(255,255,255,0.02)',
                borderColor: server === s.id ? `${s.color}50` : 'rgba(255,255,255,0.08)',
                color:       server === s.id ? s.color : 'rgba(255,255,255,0.4)',
              }}
            >
              {s.label}
              {counts[s.id] !== undefined && (
                <span className="ml-2 text-[0.6rem] opacity-60">
                  {counts[s.id].toLocaleString('tr-TR')}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Filtreler ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Arama */}
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Item ara... (örn: Raptor, Dual Blade)"
              className="w-full pl-9 pr-4 py-2.5 text-[0.82rem] bg-white/[0.04] border border-white/[0.08]
                text-white/80 placeholder-white/20 outline-none focus:border-purple-500/40
                focus:bg-white/[0.06] transition-all duration-200"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          {/* Sıralama */}
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1) }}
            className="px-3 py-2.5 text-[0.78rem] bg-white/[0.04] border border-white/[0.08]
              text-white/70 outline-none focus:border-purple-500/40 transition-all duration-200
              appearance-none cursor-pointer min-w-[130px]"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value} style={{ background: '#0e0e14', color: '#fff' }}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Yenile butonu */}
          <button
            type="button"
            onClick={() => fetchListings()}
            disabled={loading}
            className="px-4 py-2.5 text-[0.78rem] font-semibold tracking-[0.08em] uppercase
              border border-white/[0.08] text-white/50 hover:border-purple-500/40 hover:text-white/80
              transition-all duration-200 disabled:opacity-40"
          >
            <span className={loading ? 'animate-spin inline-block' : ''}>↻</span>
            <span className="ml-1.5">Yenile</span>
          </button>
        </div>
      </div>

      {/* ── İçerik ──────────────────────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* Hata durumu */}
        {error && (
          <div className="p-4 mb-4 border border-red-500/20 text-[0.82rem] text-red-400/80"
            style={{ background: 'rgba(239,68,68,0.05)' }}>
            ⚠ {error} —{' '}
            <button type="button" onClick={fetchListings}
              className="underline hover:text-red-300 transition-colors">
              Tekrar dene
            </button>
          </div>
        )}

        {/* Yükleniyor */}
        {loading && !data && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-1.5">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-8 rounded-full animate-pulse"
                    style={{
                      background: currentServer.color,
                      animationDelay: `${i * 0.15}s`,
                    }} />
                ))}
              </div>
              <p className="text-[0.78rem] text-white/30">Pazar yükleniyor...</p>
            </div>
          </div>
        )}

        {/* Sonuç istatistiği */}
        {data && !loading && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <p className="text-[0.75rem] text-white/35">
              <span className="text-white/60 font-semibold">
                {data.total.toLocaleString('tr-TR')}
              </span>{' '}
              ilan bulundu
              {debouncedQ && (
                <span className="ml-1">
                  — <span className="text-white/50">&quot;{debouncedQ}&quot;</span> için
                </span>
              )}
              {' · '}
              <span className="capitalize" style={{ color: currentServer.color }}>
                {currentServer.label}
              </span>
            </p>
            <p className="text-[0.72rem] text-white/25">
              Sayfa {data.page} / {data.total_pages}
            </p>
          </div>
        )}

        {/* ── İlan Tablosu ──────────────────────────────────────────────────── */}
        {data && data.listings.length > 0 ? (
          <>
            <div className={`transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
              {/* Masaüstü tablo */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-[0.8rem]" aria-label="Pazar ilanları">
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <th className="text-left py-3 px-4 text-[0.65rem] tracking-[0.15em] uppercase text-white/40 font-semibold">
                        İtem
                      </th>
                      <th className="text-center py-3 px-3 text-[0.65rem] tracking-[0.15em] uppercase text-white/40 font-semibold w-16">
                        +Lvl
                      </th>
                      <th className="text-right py-3 px-4 text-[0.65rem] tracking-[0.15em] uppercase text-white/40 font-semibold w-32">
                        Adet
                      </th>
                      <th className="text-right py-3 px-4 text-[0.65rem] tracking-[0.15em] uppercase text-white/40 font-semibold w-36">
                        Birim Fiyat
                      </th>
                      <th className="text-right py-3 px-4 text-[0.65rem] tracking-[0.15em] uppercase text-white/40 font-semibold w-36">
                        Toplam Fiyat
                      </th>
                      <th className="text-left py-3 px-4 text-[0.65rem] tracking-[0.15em] uppercase text-white/40 font-semibold w-32">
                        Satıcı
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.listings.map((item, i) => (
                      <ListingRow key={item.id} item={item} i={i} serverColor={currentServer.color} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobil kart görünümü */}
              <div className="md:hidden flex flex-col gap-2">
                {data.listings.map((item) => (
                  <ListingCard key={item.id} item={item} serverColor={currentServer.color} />
                ))}
              </div>
            </div>

            {/* ── Pagination ──────────────────────────────────────────────── */}
            {data.total_pages > 1 && (
              <Pagination
                current={page}
                total={data.total_pages}
                onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                loading={loading}
              />
            )}
          </>
        ) : data && !loading ? (
          /* Boş durum */
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-14 h-14 flex items-center justify-center border border-white/[0.06]"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" className="text-white/20">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
              </svg>
            </div>
            <div>
              <p className="text-[0.88rem] font-semibold text-white/40">
                {debouncedQ ? `"${debouncedQ}" için ilan bulunamadı` : 'Şu an ilan yok'}
              </p>
              <p className="text-[0.74rem] text-white/20 mt-1">
                {debouncedQ
                  ? 'Farklı bir arama terimi deneyin'
                  : 'Pazar verisi henüz çekilmemiş. Scraper\'ı çalıştırın veya birazdan tekrar deneyin.'}
              </p>
            </div>
            {debouncedQ && (
              <button type="button" onClick={() => setQuery('')}
                className="text-[0.75rem] tracking-[0.1em] uppercase text-purple-400/50
                  hover:text-purple-400 transition-colors">
                Aramayı Temizle
              </button>
            )}
          </div>
        ) : null}

        {/* ── Bilgi kutusu ─────────────────────────────────────────────────── */}
        <div className="mt-12 p-5 border border-white/[0.05]"
          style={{ background: 'rgba(255,255,255,0.015)' }}>
          <h2 className="text-[0.75rem] font-black tracking-[0.2em] uppercase text-white/50 mb-2">
            USKO Pazar Hakkında
          </h2>
          <p className="text-[0.76rem] leading-[1.8] text-white/30">
            Bu sayfada Knight Online USKO sunucularındaki (Zero, Destan, Pandora, Agartha)
            aktif pazar ilanları listelenmektedir. Veriler otomatik olarak her 5 dakikada bir güncellenir.
            Fiyatlar Noah (oyun içi para) cinsindendir.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Alt bileşenler ────────────────────────────────────────────────────────────

function ListingRow({ item, i, serverColor }: {
  item: MarketListing
  i: number
  serverColor: string
}) {
  const [tooltip, setTooltip] = useState(false)

  return (
    <tr
      className="border-b hover:bg-white/[0.025] transition-colors duration-100"
      style={{ borderColor: 'rgba(255,255,255,0.04)' }}
    >
      {/* İtem adı */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          {/* Renk çizgisi */}
          <span className="w-0.5 h-5 flex-shrink-0 rounded-full opacity-60"
            style={{ background: serverColor }} />
          <span className="font-semibold text-white/85 leading-tight">
            {item.item_name}
          </span>
        </div>
      </td>

      {/* Upgrade seviyesi */}
      <td className="py-3 px-3 text-center">
        {item.upgrade_level !== null && item.upgrade_level > 0 ? (
          <span className="text-[0.75rem] font-bold px-1.5 py-0.5"
            style={{
              background: item.upgrade_level >= 8
                ? 'rgba(245,158,11,0.15)'
                : 'rgba(255,255,255,0.06)',
              color: item.upgrade_level >= 8
                ? '#f59e0b'
                : 'rgba(255,255,255,0.5)',
            }}>
            +{item.upgrade_level}
          </span>
        ) : (
          <span className="text-white/15">—</span>
        )}
      </td>

      {/* Adet */}
      <td className="py-3 px-4 text-right text-white/50">
        {item.item_count > 1 ? item.item_count.toLocaleString('tr-TR') : '—'}
      </td>

      {/* Birim fiyat */}
      <td className="py-3 px-4 text-right">
        {item.item_count > 1 && item.price_per_unit ? (
          <span className="text-white/50 text-[0.76rem]">
            {formatPrice(item.price_per_unit)}
          </span>
        ) : (
          <span className="text-white/15">—</span>
        )}
      </td>

      {/* Toplam fiyat */}
      <td className="py-3 px-4 text-right">
        <div className="relative inline-block"
          onMouseEnter={() => setTooltip(true)}
          onMouseLeave={() => setTooltip(false)}>
          <span className="font-bold text-white/90 cursor-default">
            {formatPrice(item.price)}
          </span>
          {/* Tam fiyat tooltip */}
          {tooltip && (
            <div className="absolute bottom-full right-0 mb-1.5 px-2.5 py-1.5 text-[0.72rem]
              text-white/80 whitespace-nowrap z-10 pointer-events-none"
              style={{
                background: 'rgba(7,7,11,0.97)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              }}>
              {formatPriceExact(item.price)}
            </div>
          )}
        </div>
      </td>

      {/* Satıcı */}
      <td className="py-3 px-4 text-white/35 text-[0.76rem]">
        {item.seller_name ?? '—'}
      </td>
    </tr>
  )
}

function ListingCard({ item, serverColor }: {
  item: MarketListing
  serverColor: string
}) {
  return (
    <div className="p-4 border border-white/[0.06] flex items-start justify-between gap-3"
      style={{ background: 'rgba(255,255,255,0.015)' }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-0.5 h-4 rounded-full flex-shrink-0" style={{ background: serverColor }} />
          <span className="text-[0.85rem] font-semibold text-white/85 truncate">
            {item.item_name}
          </span>
          {item.upgrade_level !== null && item.upgrade_level > 0 && (
            <span className="text-[0.7rem] font-bold px-1.5 py-0.5 flex-shrink-0"
              style={{
                background: item.upgrade_level >= 8 ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.06)',
                color: item.upgrade_level >= 8 ? '#f59e0b' : 'rgba(255,255,255,0.5)',
              }}>
              +{item.upgrade_level}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[0.72rem] text-white/35">
          {item.item_count > 1 && <span>Adet: {item.item_count}</span>}
          {item.seller_name && <span>Satıcı: {item.seller_name}</span>}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[0.95rem] font-bold text-white/90">
          {formatPrice(item.price)}
        </p>
        {item.item_count > 1 && item.price_per_unit && (
          <p className="text-[0.68rem] text-white/30 mt-0.5">
            {formatPrice(item.price_per_unit)}/adet
          </p>
        )}
      </div>
    </div>
  )
}

function Pagination({
  current, total, onChange, loading,
}: {
  current: number
  total: number
  onChange: (p: number) => void
  loading: boolean
}) {
  // Gösterilecek sayfa numaraları
  const pages: (number | '...')[] = []
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      {/* Önceki */}
      <button
        type="button"
        onClick={() => onChange(current - 1)}
        disabled={current === 1 || loading}
        className="px-3 py-2 text-[0.75rem] border border-white/[0.07] text-white/40
          hover:border-white/20 hover:text-white/70 disabled:opacity-30
          disabled:cursor-not-allowed transition-all duration-150"
      >
        ‹
      </button>

      {/* Sayfa numaraları */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-white/20 text-[0.75rem]">…</span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            disabled={loading}
            className="min-w-[36px] px-2 py-2 text-[0.78rem] font-semibold border transition-all duration-150"
            style={{
              background:  p === current ? 'rgba(139,92,246,0.15)' : 'transparent',
              borderColor: p === current ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.07)',
              color:       p === current ? 'rgba(167,139,250,0.9)' : 'rgba(255,255,255,0.45)',
            }}
          >
            {p}
          </button>
        )
      )}

      {/* Sonraki */}
      <button
        type="button"
        onClick={() => onChange(current + 1)}
        disabled={current === total || loading}
        className="px-3 py-2 text-[0.75rem] border border-white/[0.07] text-white/40
          hover:border-white/20 hover:text-white/70 disabled:opacity-30
          disabled:cursor-not-allowed transition-all duration-150"
      >
        ›
      </button>
    </div>
  )
}
