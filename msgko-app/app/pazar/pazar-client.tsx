'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { CHANNELS } from '@/lib/pazar-types'
import type { MarketListing, PazarResponse, ChannelKey } from '@/lib/pazar-types'

// ── Yardımcılar ────────────────────────────────────────────────────────────────
function formatPrice(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)         return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString('tr-TR')
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60)   return `${diff}sn önce`
  if (diff < 3600) return `${Math.floor(diff / 60)}dk önce`
  return `${Math.floor(diff / 3600)}sa önce`
}

const SORT_OPTIONS = [
  { value: 'price_asc',  label: 'Fiyat ↑' },
  { value: 'price_desc', label: 'Fiyat ↓' },
  { value: 'name_asc',   label: 'İsim A-Z' },
  { value: 'newest',     label: 'En Yeni' },
]

// Kanal grupları
const GROUPS = [
  { key: 'zero',    label: 'Zero',    color: '#3b82f6' },
  { key: 'agartha', label: 'Agartha', color: '#f59e0b' },
  { key: 'pandora', label: 'Pandora', color: '#10b981' },
  { key: 'destan',  label: 'Destan',  color: '#8b5cf6' },
]

// ── PazarClient ────────────────────────────────────────────────────────────────
export function PazarClient() {
  const [channel,  setChannel]  = useState<ChannelKey>('zero3')
  const [query,    setQuery]    = useState('')
  const [sort,     setSort]     = useState('price_asc')
  const [upgrade,  setUpgrade]  = useState('')   // '' = hepsi, '0' = +0 yok, '1'..'9'
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

  // Veri çek
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        server: channel,
        sort,
        page: String(page),
        ...(debouncedQ ? { q: debouncedQ } : {}),
        ...(upgrade !== '' ? { upgrade } : {}),
      })
      const res = await fetch(`/api/pazar?${params}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setData(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }, [channel, sort, page, debouncedQ, upgrade])

  useEffect(() => { fetchData() }, [fetchData])

  // 5 dk otomatik yenile
  useEffect(() => {
    const t = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(t)
  }, [fetchData])

  // Kanal ilan sayıları
  useEffect(() => {
    fetch('/api/pazar', { method: 'POST' })
      .then(r => r.json())
      .then(setCounts)
      .catch(() => {})
  }, [])

  const currentChannel = CHANNELS.find(c => c.key === channel)!
  const currentGroup   = GROUPS.find(g => g.key === currentChannel.group)!

  return (
    <div className="min-h-screen" style={{ background: '#07070B' }}>

      {/* ── Header ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        {/* Breadcrumb */}
        <nav aria-label="Sayfa konumu" className="mb-6">
          <ol className="flex items-center gap-1.5 text-[0.72rem] text-white/30">
            <li><Link href="/" className="hover:text-white/60 transition-colors">Ana Sayfa</Link></li>
            <li>/</li>
            <li className="text-white/60">USKO Pazar</li>
          </ol>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-purple-400/60 mb-1">CANLI PAZAR</p>
            <h1 className="text-2xl md:text-3xl font-black tracking-[0.04em] uppercase text-white"
              style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
              Knight Online USKO Pazar
            </h1>
            <p className="text-[0.78rem] text-white/35 mt-1">
              Her 5 dakikada güncellenir · Tüm pazardaki ilanlar · Fiyat -1 stratejisi
            </p>
          </div>
          {data?.last_scraped && (
            <div className="flex items-center gap-2 text-[0.72rem] text-white/30">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              {timeAgo(data.last_scraped)}
            </div>
          )}
        </div>

        {/* ── Sunucu Grupları ── */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-3 mb-3">
            {GROUPS.map(grp => {
              const grpChannels = CHANNELS.filter(c => c.group === grp.key)
              const grpTotal = grpChannels.reduce((s, c) => s + (counts[c.key] ?? 0), 0)
              const isActive  = currentChannel.group === grp.key
              return (
                <button key={grp.key} type="button"
                  onClick={() => {
                    // Grubun ilk kanalını seç
                    setChannel(grpChannels[0].key as ChannelKey)
                    setPage(1)
                  }}
                  className="px-4 py-1.5 text-[0.75rem] font-bold tracking-[0.1em] uppercase
                    transition-all duration-200 border"
                  style={{
                    background:  isActive ? `${grp.color}18` : 'rgba(255,255,255,0.02)',
                    borderColor: isActive ? `${grp.color}50` : 'rgba(255,255,255,0.08)',
                    color:       isActive ? grp.color : 'rgba(255,255,255,0.35)',
                  }}>
                  {grp.label}
                  {grpTotal > 0 && (
                    <span className="ml-2 text-[0.6rem] opacity-60">
                      {grpTotal.toLocaleString('tr-TR')}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Kanal sekmeleri (seçili grubun kanalları) */}
          <div className="flex flex-wrap gap-1.5">
            {CHANNELS.filter(c => c.group === currentChannel.group).map(ch => (
              <button key={ch.key} type="button"
                onClick={() => { setChannel(ch.key as ChannelKey); setPage(1) }}
                className="px-3 py-1 text-[0.72rem] font-semibold tracking-[0.06em] uppercase
                  transition-all duration-200 border"
                style={{
                  background:  channel === ch.key ? `${currentGroup.color}15` : 'rgba(255,255,255,0.02)',
                  borderColor: channel === ch.key ? `${currentGroup.color}40` : 'rgba(255,255,255,0.06)',
                  color:       channel === ch.key ? currentGroup.color : 'rgba(255,255,255,0.35)',
                }}>
                {ch.label}
                {(counts[ch.key] ?? 0) > 0 && (
                  <span className="ml-1.5 text-[0.58rem] opacity-60">
                    {counts[ch.key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Filtreler ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Arama */}
          <div className="relative flex-1 max-w-lg">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Item ara... (Shard, Raptor, Dual Blade...)"
              className="w-full pl-9 pr-4 py-2.5 text-[0.82rem] bg-white/[0.04] border
                border-white/[0.08] text-white/80 placeholder-white/20 outline-none
                focus:border-purple-500/40 focus:bg-white/[0.06] transition-all duration-200"
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

          {/* Upgrade seviyesi */}
          <select value={upgrade} onChange={e => { setUpgrade(e.target.value); setPage(1) }}
            className="px-3 py-2.5 text-[0.78rem] bg-white/[0.04] border border-white/[0.08]
              text-white/70 outline-none focus:border-purple-500/40 transition-all duration-200
              appearance-none cursor-pointer min-w-[110px]">
            <option value="" style={{ background: '#0e0e14' }}>Tüm +Lvl</option>
            <option value="0" style={{ background: '#0e0e14' }}>+0 (yok)</option>
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <option key={n} value={String(n)} style={{ background: '#0e0e14' }}>+{n}</option>
            ))}
          </select>

          {/* Sıralama */}
          <select value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}
            className="px-3 py-2.5 text-[0.78rem] bg-white/[0.04] border border-white/[0.08]
              text-white/70 outline-none focus:border-purple-500/40 transition-all duration-200
              appearance-none cursor-pointer min-w-[130px]">
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value} style={{ background: '#0e0e14' }}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Yenile */}
          <button type="button" onClick={fetchData} disabled={loading}
            className="px-4 py-2.5 text-[0.78rem] font-semibold tracking-[0.08em] uppercase
              border border-white/[0.08] text-white/50 hover:border-purple-500/40 hover:text-white/80
              transition-all duration-200 disabled:opacity-40 min-w-[90px]">
            <span className={loading ? 'inline-block animate-spin' : ''}>↻</span>
            <span className="ml-1.5">Yenile</span>
          </button>
        </div>
      </div>

      {/* ── İçerik ── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* Hata */}
        {error && (
          <div className="p-4 mb-4 border border-red-500/20 text-[0.82rem] text-red-400/80"
            style={{ background: 'rgba(239,68,68,0.05)' }}>
            {error} — <button onClick={fetchData} className="underline">Tekrar dene</button>
          </div>
        )}

        {/* Yükleniyor */}
        {loading && !data && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-1.5">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-8 rounded-full animate-pulse"
                    style={{ background: currentGroup.color, animationDelay: `${i*0.15}s` }} />
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
              ilan
              {debouncedQ && (
                <span className="ml-1">— <span className="text-white/50">&quot;{debouncedQ}&quot;</span></span>
              )}
              {upgrade !== '' && (
                <span className="ml-1 text-yellow-400/60">· +{upgrade === '0' ? '0 (seviyesiz)' : upgrade}</span>
              )}
              {' · '}
              <span style={{ color: currentGroup.color }}>{currentChannel.label}</span>
            </p>
            <div className="flex items-center gap-3">
              {(debouncedQ || upgrade !== '') && (
                <button
                  onClick={() => { setQuery(''); setUpgrade(''); setPage(1) }}
                  className="text-[0.72rem] tracking-[0.08em] uppercase text-white/30 hover:text-white/60 transition-colors">
                  Filtreleri Temizle ×
                </button>
              )}
              {data.total_pages > 1 && (
                <p className="text-[0.72rem] text-white/25">
                  Sayfa {data.page} / {data.total_pages}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tablo */}
        {data && data.listings.length > 0 ? (
          <div className={`transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
            {/* Masaüstü */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-[0.8rem]">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <th className="text-left py-3 px-4 text-[0.65rem] tracking-[0.15em] uppercase text-white/40 font-semibold">
                      Item
                    </th>
                    <th className="text-center py-3 px-3 text-[0.65rem] tracking-[0.15em] uppercase text-white/40 font-semibold w-16">
                      +Lvl
                    </th>
                    <th className="text-left py-3 px-4 text-[0.65rem] tracking-[0.15em] uppercase text-white/40 font-semibold w-36">
                      Satıcı
                    </th>
                    <th className="text-right py-3 px-4 text-[0.65rem] tracking-[0.15em] uppercase text-white/40 font-semibold w-40">
                      Ücret <span className="text-white/20 normal-case">(-1 Noah)</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.listings.map((item, i) => (
                    <ListingRow key={item.id} item={item} i={i} color={currentGroup.color} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobil */}
            <div className="md:hidden flex flex-col gap-2">
              {data.listings.map(item => (
                <ListingCard key={item.id} item={item} color={currentGroup.color} />
              ))}
            </div>

            {/* Pagination */}
            {data.total_pages > 1 && (
              <Pagination
                current={page}
                total={data.total_pages}
                onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                loading={loading}
              />
            )}
          </div>
        ) : data && !loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-14 h-14 flex items-center justify-center border border-white/[0.06]"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" className="text-white/20">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <div>
              <p className="text-[0.88rem] font-semibold text-white/40">
                {debouncedQ
                  ? `"${debouncedQ}"${upgrade !== '' ? ` (+${upgrade})` : ''} bulunamadı`
                  : upgrade !== ''
                    ? `+${upgrade} seviyesinde ilan yok`
                    : 'Bu kanalda şu an ilan yok'}
              </p>
              <p className="text-[0.74rem] text-white/20 mt-1">
                {debouncedQ || upgrade !== ''
                  ? 'Farklı filtreler deneyin veya başka kanal seçin'
                  : 'Veriler henüz çekilmemiş olabilir'}
              </p>
            </div>
            {(debouncedQ || upgrade !== '') && (
              <button onClick={() => { setQuery(''); setUpgrade(''); setPage(1) }}
                className="text-[0.75rem] tracking-[0.1em] uppercase text-purple-400/50 hover:text-purple-400">
                Filtreleri Temizle
              </button>
            )}
          </div>
        ) : null}

        {/* Bilgi */}
        <div className="mt-10 p-5 border border-white/[0.05]"
          style={{ background: 'rgba(255,255,255,0.015)' }}>
          <p className="text-[0.72rem] font-bold tracking-[0.2em] uppercase text-white/40 mb-2">
            USKO Pazar Hakkında
          </p>
          <p className="text-[0.75rem] leading-[1.8] text-white/25">
            Zero, Agartha, Pandora ve Destan sunucularındaki aktif pazar ilanları.
            Her kanal ayrı gösterilir. Fiyatlar birim Noah cinsindendir.
            Gösterilen fiyat, pazardaki fiyatın 1 altıdır (-1 stratejisi).
            Veriler 5 dakikada bir otomatik güncellenir.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Satır bileşeni ─────────────────────────────────────────────────────────────
function ListingRow({ item, i, color }: { item: MarketListing; i: number; color: string }) {
  const [tip, setTip] = useState(false)
  const img = item.img_url ?? null

  return (
    <tr className="border-b hover:bg-white/[0.02] transition-colors"
      style={{ borderColor: 'rgba(255,255,255,0.04)' }}>

      {/* Item */}
      <td className="py-2.5 px-4">
        <div className="flex items-center gap-3">
          {img ? (
            <img src={img} alt={item.item_name} width={32} height={32}
              className="w-8 h-8 object-contain flex-shrink-0"
              style={{ imageRendering: 'pixelated' }}
              loading="lazy"
              onError={e => { (e.target as HTMLImageElement).style.display='none' }}
            />
          ) : (
            <div className="w-8 h-8 flex-shrink-0 border border-white/[0.06]"
              style={{ background: 'rgba(255,255,255,0.02)' }} />
          )}
          <span className="font-semibold text-white/85">{item.item_name}</span>
        </div>
      </td>

      {/* Upgrade */}
      <td className="py-2.5 px-3 text-center">
        {item.upgrade_level ? (
          <span className="text-[0.75rem] font-bold px-1.5 py-0.5"
            style={{
              background: item.upgrade_level >= 8 ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.06)',
              color:      item.upgrade_level >= 8 ? '#f59e0b' : 'rgba(255,255,255,0.5)',
            }}>
            +{item.upgrade_level}
          </span>
        ) : <span className="text-white/15">—</span>}
      </td>

      {/* Satıcı */}
      <td className="py-2.5 px-4 text-white/45 text-[0.8rem]">
        {item.seller_name ?? '—'}
      </td>

      {/* Fiyat */}
      <td className="py-2.5 px-4 text-right">
        <div className="relative inline-block"
          onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
          <div className="flex flex-col items-end gap-0.5">
            <span className="font-bold text-[0.95rem]" style={{ color: '#ef4444' }}>
              {formatPrice(item.price)}
            </span>
            <span className="text-[0.62rem] text-white/20">
              {item.price.toLocaleString('tr-TR')} Noah
            </span>
          </div>
          {tip && (
            <div className="absolute bottom-full right-0 mb-2 px-2.5 py-1.5 z-10 pointer-events-none"
              style={{
                background: 'rgba(7,7,11,0.97)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
                whiteSpace: 'nowrap',
              }}>
              <p className="text-[0.72rem] text-white/70">Pazar fiyatı: {(item.price + 1).toLocaleString('tr-TR')}</p>
              <p className="text-[0.68rem] text-green-400/70">Senin fiyatın: {item.price.toLocaleString('tr-TR')} (-1)</p>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}

// ── Kart bileşeni (mobil) ──────────────────────────────────────────────────────
function ListingCard({ item, color }: { item: MarketListing; color: string }) {
  const img = item.img_url ?? null
  return (
    <div className="p-4 border border-white/[0.06] flex items-start gap-3"
      style={{ background: 'rgba(255,255,255,0.015)' }}>
      {img ? (
        <img src={img} alt={item.item_name} width={40} height={40}
          className="w-10 h-10 object-contain flex-shrink-0 mt-0.5"
          style={{ imageRendering: 'pixelated' }}
          loading="lazy"
          onError={e => { (e.target as HTMLImageElement).style.display='none' }}
        />
      ) : (
        <div className="w-10 h-10 flex-shrink-0 border border-white/[0.06]"
          style={{ background: 'rgba(255,255,255,0.02)' }} />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[0.85rem] font-semibold text-white/85 truncate">{item.item_name}</span>
          {item.upgrade_level ? (
            <span className="text-[0.7rem] font-bold px-1.5 py-0.5 flex-shrink-0"
              style={{
                background: item.upgrade_level >= 8 ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.06)',
                color:      item.upgrade_level >= 8 ? '#f59e0b' : 'rgba(255,255,255,0.5)',
              }}>
              +{item.upgrade_level}
            </span>
          ) : null}
        </div>
        {item.seller_name && (
          <p className="text-[0.72rem] text-white/35">{item.seller_name}</p>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[0.95rem] font-bold" style={{ color: '#ef4444' }}>
          {formatPrice(item.price)}
        </p>
        <p className="text-[0.62rem] text-white/20">{item.price.toLocaleString('tr-TR')}</p>
      </div>
    </div>
  )
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ current, total, onChange, loading }: {
  current: number; total: number
  onChange: (p: number) => void; loading: boolean
}) {
  const pages: (number | '...')[] = []
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current-1); i <= Math.min(total-1, current+1); i++) pages.push(i)
    if (current < total-2) pages.push('...')
    pages.push(total)
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button onClick={() => onChange(current-1)} disabled={current===1||loading}
        className="px-3 py-2 text-[0.75rem] border border-white/[0.07] text-white/40
          hover:border-white/20 hover:text-white/70 disabled:opacity-30 disabled:cursor-not-allowed">
        ‹
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`d-${i}`} className="px-2 text-white/20 text-[0.75rem]">…</span>
        ) : (
          <button key={p} onClick={() => onChange(p)} disabled={loading}
            className="min-w-[36px] px-2 py-2 text-[0.78rem] font-semibold border transition-all"
            style={{
              background:  p===current ? 'rgba(139,92,246,0.15)' : 'transparent',
              borderColor: p===current ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.07)',
              color:       p===current ? 'rgba(167,139,250,0.9)' : 'rgba(255,255,255,0.45)',
            }}>
            {p}
          </button>
        )
      )}
      <button onClick={() => onChange(current+1)} disabled={current===total||loading}
        className="px-3 py-2 text-[0.75rem] border border-white/[0.07] text-white/40
          hover:border-white/20 hover:text-white/70 disabled:opacity-30 disabled:cursor-not-allowed">
        ›
      </button>
    </div>
  )
}
