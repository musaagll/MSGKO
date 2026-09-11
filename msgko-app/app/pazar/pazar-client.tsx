'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { CHANNELS } from '@/lib/pazar-types'
import type { MarketListing, PazarResponse, ChannelKey } from '@/lib/pazar-types'

// ── Yardımcılar ────────────────────────────────────────────────────────────────
function formatPrice(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)         return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString('tr-TR')
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60)    return `${diff}sn önce`
  if (diff < 3600)  return `${Math.floor(diff / 60)}dk önce`
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`
  return `${Math.floor(diff / 86400)}g önce`
}

function parseItemDetails(html: string | null | undefined) {
  if (!html) return { title: '', type: '', kind: '', props: [] as string[] }
  const get = (cls: string) => {
    const escaped = cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const m = html.match(new RegExp(`<div class='${escaped}'[^>]*>([\\s\\S]*?)</div>`, 'i'))
    return m ? m[1].replace(/<[^>]+>/g, '').trim() : ''
  }
  const title = get('item_title white') || get('item_title')
  const type  = get('item_type white')  || get('item_type')
  const kind  = get('item_kind')
  const props: string[] = []
  const re = /<div class='item_property[^']*'>([\s\S]*?)<\/div>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    const text = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    if (text) props.push(text)
  }
  return { title, type, kind, props }
}

const SORT_OPTIONS = [
  { value: 'price_asc',    label: 'En Ucuz' },
  { value: 'price_desc',   label: 'En Pahalı' },
  { value: 'name_asc',     label: 'İsim A-Z' },
  { value: 'upgrade_desc', label: '+Lvl ↓' },
  { value: 'upgrade_asc',  label: '+Lvl ↑' },
  { value: 'newest',       label: 'En Yeni' },
]

const GROUPS = [
  { key: 'zero',    label: 'Zero',    color: '#60a5fa', bg: 'rgba(96,165,250,0.08)'  },
  { key: 'agartha', label: 'Agartha', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)'  },
  { key: 'pandora', label: 'Pandora', color: '#34d399', bg: 'rgba(52,211,153,0.08)'  },
  { key: 'destan',  label: 'Destan',  color: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
]

// ── Ana bileşen ────────────────────────────────────────────────────────────────
export function PazarClient() {
  const [channel,  setChannel]  = useState<ChannelKey>('zero3')
  const [query,    setQuery]    = useState('')
  const [sort,     setSort]     = useState('price_asc')
  const [upgrade,  setUpgrade]  = useState('')
  const [data,     setData]     = useState<PazarResponse | null>(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [counts,   setCounts]   = useState<Record<string, number>>({})

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [debouncedQ, setDebouncedQ] = useState('')

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setDebouncedQ(query), 350)
  }, [query])

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const p = new URLSearchParams({ server: channel, sort })
      if (debouncedQ) p.set('q', debouncedQ)
      if (upgrade)    p.set('upgrade', upgrade)
      const res = await fetch(`/api/pazar?${p}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setData(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }, [channel, sort, debouncedQ, upgrade])

  useEffect(() => { fetchData() }, [fetchData])

  // 3 dk otomatik yenile
  useEffect(() => {
    const t = setInterval(fetchData, 3 * 60 * 1000)
    return () => clearInterval(t)
  }, [fetchData])

  // Kanal sayıları
  useEffect(() => {
    fetch('/api/pazar', { method: 'POST' })
      .then(r => r.json()).then(setCounts).catch(() => {})
  }, [])

  const curCh = CHANNELS.find(c => c.key === channel)!
  const curGrp = GROUPS.find(g => g.key === curCh.group)!

  return (
    <div className="min-h-screen" style={{ background: '#07070f' }}>

      {/* ── Header ── */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-24 pb-6">
        <nav className="mb-4">
          <ol className="flex items-center gap-2 text-[0.68rem] text-white/20">
            <li><Link href="/" className="hover:text-white/50 transition-colors">Ana Sayfa</Link></li>
            <li>/</li>
            <li className="text-white/40">Pazar</li>
          </ol>
        </nav>

        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: curGrp.color, boxShadow: `0 0 6px ${curGrp.color}` }} />
              <span className="text-[0.62rem] tracking-[0.25em] uppercase font-bold" style={{ color: curGrp.color }}>
                Canlı Pazar
              </span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              USKO <span style={{ color: curGrp.color }}>Pazar</span>
            </h1>
          </div>
          {data?.last_scraped && (
            <span className="text-[0.7rem] text-white/25">{timeAgo(data.last_scraped)}</span>
          )}
        </div>

        {/* Grup seçimi */}
        <div className="flex flex-wrap gap-2 mb-2">
          {GROUPS.map(g => {
            const gChs = CHANNELS.filter(c => c.group === g.key)
            const total = gChs.reduce((s, c) => s + (counts[c.key] ?? 0), 0)
            const active = curCh.group === g.key
            return (
              <button key={g.key} type="button"
                onClick={() => { setChannel(gChs[0].key as ChannelKey) }}
                className="px-4 py-1.5 text-[0.72rem] font-bold tracking-[0.1em] uppercase
                  border transition-all duration-150 rounded-sm"
                style={{
                  background:  active ? g.bg : 'rgba(255,255,255,0.02)',
                  borderColor: active ? g.color + '45' : 'rgba(255,255,255,0.07)',
                  color:       active ? g.color : 'rgba(255,255,255,0.3)',
                }}>
                {g.label}
                {total > 0 && <span className="ml-1.5 opacity-50 font-normal">{total.toLocaleString('tr-TR')}</span>}
              </button>
            )
          })}
        </div>

        {/* Kanal sekmeleri */}
        <div className="flex flex-wrap gap-1 mb-5">
          {CHANNELS.filter(c => c.group === curCh.group).map(ch => {
            const active = channel === ch.key
            return (
              <button key={ch.key} type="button"
                onClick={() => setChannel(ch.key as ChannelKey)}
                className="px-3 py-1 text-[0.68rem] font-semibold tracking-[0.06em] uppercase
                  border transition-all duration-100 rounded-sm"
                style={{
                  background:  active ? curGrp.bg : 'transparent',
                  borderColor: active ? curGrp.color + '40' : 'rgba(255,255,255,0.05)',
                  color:       active ? curGrp.color : 'rgba(255,255,255,0.28)',
                }}>
                {ch.label}
                {(counts[ch.key] ?? 0) > 0 && (
                  <span className="ml-1 opacity-50 font-normal">
                    {counts[ch.key].toLocaleString('tr-TR')}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Filtreler */}
        <div className="flex flex-wrap gap-2">
          {/* Arama */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
              width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Item ara... (Raptor, Shard, Glave...)"
              className="w-full pl-9 pr-8 py-2 text-[0.8rem] rounded-sm bg-white/[0.04]
                border border-white/[0.07] text-white/80 placeholder-white/20 outline-none
                focus:border-white/20 focus:bg-white/[0.05] transition-all"
            />
            {query && (
              <button onClick={() => setQuery('')} type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60">
                ×
              </button>
            )}
          </div>

          {/* +Lvl */}
          <select value={upgrade} onChange={e => setUpgrade(e.target.value)}
            className="appearance-none px-3 py-2 text-[0.76rem] rounded-sm bg-white/[0.04]
              border border-white/[0.07] text-white/55 outline-none focus:border-white/20
              transition-all cursor-pointer min-w-[100px]">
            <option value=""  style={{ background: '#0d0d1a' }}>Tüm +Lvl</option>
            <option value="0" style={{ background: '#0d0d1a' }}>Seviyesiz</option>
            {[1,2,3,4,5,6,7,8,9,10,11].map(n => (
              <option key={n} value={String(n)} style={{ background: '#0d0d1a' }}>+{n}</option>
            ))}
          </select>

          {/* Sıralama */}
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="appearance-none px-3 py-2 text-[0.76rem] rounded-sm bg-white/[0.04]
              border border-white/[0.07] text-white/55 outline-none focus:border-white/20
              transition-all cursor-pointer min-w-[110px]">
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value} style={{ background: '#0d0d1a' }}>{o.label}</option>
            ))}
          </select>

          {/* Yenile */}
          <button onClick={fetchData} disabled={loading} type="button"
            className="px-3 py-2 text-[0.76rem] rounded-sm border border-white/[0.07]
              text-white/40 hover:border-white/20 hover:text-white/70 transition-all
              disabled:opacity-30 flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" className={loading ? 'animate-spin' : ''}>
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            Yenile
          </button>
        </div>
      </div>

      {/* ── İçerik ── */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pb-20">

        {/* Sonuç satırı */}
        {data && !loading && (
          <div className="flex items-center gap-3 mb-3 text-[0.72rem] text-white/30">
            <span className="font-bold text-white/60">{data.total.toLocaleString('tr-TR')}</span>
            <span>ilan içinden en iyi 30</span>
            {debouncedQ && <span className="text-white/50">&ldquo;{debouncedQ}&rdquo;</span>}
            {upgrade && <span style={{ color: curGrp.color }}>+{upgrade === '0' ? '0' : upgrade}</span>}
            <span className="text-white/15">·</span>
            <span style={{ color: curGrp.color }}>{curCh.label}</span>
          </div>
        )}

        {/* Hata */}
        {error && (
          <div className="p-4 mb-4 rounded border border-red-500/20 text-[0.8rem] text-red-400/70 bg-red-500/5">
            {error} — <button onClick={fetchData} className="underline">Tekrar dene</button>
          </div>
        )}

        {/* Yükleniyor */}
        {loading && !data && (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-white/5 border-t-transparent animate-spin"
                style={{ borderTopColor: curGrp.color }} />
              <p className="text-[0.75rem] text-white/25">Yükleniyor...</p>
            </div>
          </div>
        )}

        {/* Tablo - masaüstü */}
        {data && data.listings.length > 0 && (
          <div className={`transition-opacity duration-150 ${loading ? 'opacity-40' : 'opacity-100'}`}>
            <div className="hidden md:block rounded overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <table className="w-full text-[0.8rem] border-collapse">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Item', '+Lvl', 'Satıcı', 'Konum', 'Fiyat'].map((h, i) => (
                      <th key={h} className={`py-2.5 px-4 text-[0.6rem] tracking-[0.2em] uppercase
                        text-white/30 font-semibold ${i === 4 ? 'text-right' : i === 1 ? 'text-center' : 'text-left'}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.listings.map((item, idx) => (
                    <Row key={item.id} item={item} idx={idx} color={curGrp.color} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobil kartlar */}
            <div className="md:hidden space-y-2">
              {data.listings.map(item => (
                <Card key={item.id} item={item} color={curGrp.color} />
              ))}
            </div>
          </div>
        )}

        {/* Boş */}
        {data && data.listings.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-28 gap-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.2" className="text-white/15">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <p className="text-[0.85rem] text-white/30">
              {debouncedQ ? `"${debouncedQ}" bulunamadı` : 'Bu kanalda ilan yok'}
            </p>
            <p className="text-[0.72rem] text-white/18">
              {debouncedQ ? 'Farklı kanal veya isim deneyin' : 'Veriler yükleniyor olabilir'}
            </p>
            {(debouncedQ || upgrade) && (
              <button onClick={() => { setQuery(''); setUpgrade('') }}
                className="text-[0.7rem] text-white/30 hover:text-white/60 transition-colors mt-1">
                Filtreleri temizle
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Tooltip ────────────────────────────────────────────────────────────────────
function ItemTooltip({ item, color }: { item: MarketListing; color: string }) {
  const d = parseItemDetails(item.item_details)
  if (!d.title && !d.type && d.props.length === 0) return null

  return (
    <div className="absolute left-0 top-full mt-1.5 z-50 w-[240px] pointer-events-none"
      style={{
        background: 'rgba(8,8,18,0.97)',
        border: `1px solid ${color}30`,
        boxShadow: `0 16px 48px rgba(0,0,0,0.85)`,
        borderRadius: '4px',
      }}>
      {d.title && (
        <div className="px-3 pt-2.5 pb-2 border-b border-white/[0.06]">
          <p className="text-[0.8rem] font-bold leading-tight" style={{ color }}>
            {d.title}{item.upgrade_level != null ? (
              <span className="ml-1.5" style={{
                color: item.upgrade_level >= 9 ? '#fbbf24' : item.upgrade_level >= 7 ? '#a78bfa' : 'rgba(255,255,255,0.5)'
              }}>+{item.upgrade_level}</span>
            ) : null}
          </p>
          {d.kind && <p className="text-[0.62rem] text-white/30 mt-0.5">{d.kind}</p>}
        </div>
      )}
      {d.type && (
        <div className="px-3 py-1.5 border-b border-white/[0.04]">
          <span className="text-[0.66rem] text-yellow-400/65">{d.type}</span>
        </div>
      )}
      {d.props.filter(Boolean).length > 0 && (
        <div className="px-3 py-2 space-y-0.5">
          {d.props.filter(Boolean).map((p, i) => (
            <p key={i} className="text-[0.68rem] text-white/50 leading-relaxed">{p}</p>
          ))}
        </div>
      )}
      <div className="px-3 py-2 border-t border-white/[0.05]" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="flex justify-between items-center">
          <span className="text-[0.62rem] text-white/25">Pazar</span>
          <span className="text-[0.73rem] font-bold text-red-400/80">
            {(item.original_price ?? item.price + 1).toLocaleString('tr-TR')} ₦
          </span>
        </div>
        <div className="flex justify-between items-center mt-0.5">
          <span className="text-[0.62rem] text-white/25">Öneri (-1)</span>
          <span className="text-[0.73rem] font-bold text-emerald-400/75">
            {item.price.toLocaleString('tr-TR')} ₦
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Masaüstü satır ─────────────────────────────────────────────────────────────
function Row({ item, idx, color }: { item: MarketListing; idx: number; color: string }) {
  const [tip, setTip] = useState(false)

  return (
    <tr className="border-b transition-colors hover:bg-white/[0.02] cursor-default"
      style={{ borderColor: 'rgba(255,255,255,0.04)' }}>

      {/* Item */}
      <td className="py-2.5 px-4">
        <div className="relative flex items-center gap-3"
          onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
          {/* İkon */}
          <div className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {item.img_url ? (
              <img src={item.img_url} alt="" width={28} height={28}
                className="w-7 h-7 object-contain" style={{ imageRendering: 'pixelated' }}
                loading="lazy" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" className="text-white/15"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>
            )}
          </div>
          {/* İsim */}
          <div className="min-w-0">
            <p className="font-semibold text-white/85 truncate max-w-[260px] leading-snug">
              {item.item_name}
            </p>
            {item.item_details && (
              <p className="text-[0.6rem] text-white/28 mt-0.5 truncate max-w-[260px]">
                {parseItemDetails(item.item_details).type}
              </p>
            )}
          </div>
          {tip && <ItemTooltip item={item} color={color} />}
        </div>
      </td>

      {/* +Lvl */}
      <td className="py-2.5 px-3 text-center w-16">
        {item.upgrade_level != null ? (
          <span className="inline-block text-[0.7rem] font-black px-2 py-0.5 rounded-sm tabular-nums"
            style={{
              background: item.upgrade_level >= 9 ? 'rgba(251,191,36,0.12)'
                        : item.upgrade_level >= 7 ? 'rgba(167,139,250,0.1)'
                        : 'rgba(255,255,255,0.05)',
              color:      item.upgrade_level >= 9 ? '#fbbf24'
                        : item.upgrade_level >= 7 ? '#a78bfa'
                        : 'rgba(255,255,255,0.45)',
              border: `1px solid ${
                item.upgrade_level >= 9 ? 'rgba(251,191,36,0.2)'
                : item.upgrade_level >= 7 ? 'rgba(167,139,250,0.15)'
                : 'rgba(255,255,255,0.07)'}`,
            }}>
            +{item.upgrade_level}
          </span>
        ) : <span className="text-white/15 text-xs">—</span>}
      </td>

      {/* Satıcı */}
      <td className="py-2.5 px-4 w-32">
        <span className="text-[0.77rem] text-white/38 truncate block max-w-[120px]">
          {item.seller_name ?? '—'}
        </span>
      </td>

      {/* Konum */}
      <td className="py-2.5 px-4 w-28">
        {item.loc_x != null && item.loc_z != null ? (
          <span className="inline-flex items-center gap-1 text-[0.68rem] font-mono text-white/40
            bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-sm">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" className="text-white/30 flex-shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {item.loc_x},{item.loc_z}
          </span>
        ) : <span className="text-white/15 text-xs">—</span>}
      </td>

      {/* Fiyat */}
      <td className="py-2.5 px-4 text-right w-36">
        <p className="font-black text-[0.92rem] tabular-nums" style={{ color: '#f87171' }}>
          {formatPrice(item.price)}
        </p>
        <p className="text-[0.6rem] text-white/20 tabular-nums mt-0.5">
          {item.price.toLocaleString('tr-TR')} ₦
        </p>
      </td>
    </tr>
  )
}

// ── Mobil kart ─────────────────────────────────────────────────────────────────
function Card({ item, color }: { item: MarketListing; color: string }) {
  const [expanded, setExpanded] = useState(false)
  const d = parseItemDetails(item.item_details)

  return (
    <div className="rounded overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-center gap-3 p-3">
        <div className="flex-shrink-0 w-10 h-10 rounded flex items-center justify-center overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {item.img_url ? (
            <img src={item.img_url} alt="" width={32} height={32}
              className="w-8 h-8 object-contain" style={{ imageRendering: 'pixelated' }} loading="lazy" />
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.5" className="text-white/15"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[0.83rem] font-semibold text-white/85 truncate">{item.item_name}</span>
            {item.upgrade_level != null && (
              <span className="text-[0.68rem] font-black px-1.5 py-0.5 rounded-sm flex-shrink-0"
                style={{
                  background: item.upgrade_level >= 7 ? 'rgba(167,139,250,0.1)' : 'rgba(255,255,255,0.05)',
                  color: item.upgrade_level >= 7 ? '#a78bfa' : 'rgba(255,255,255,0.45)',
                }}>
                +{item.upgrade_level}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-[0.67rem] text-white/30">
            <span className="truncate max-w-[120px]">{item.seller_name ?? '—'}</span>
            {item.loc_x != null && (
              <span className="font-mono flex items-center gap-0.5">
                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {item.loc_x},{item.loc_z}
              </span>
            )}
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="font-black text-[0.9rem] tabular-nums" style={{ color: '#f87171' }}>
            {formatPrice(item.price)}
          </p>
          {(d.type || d.props.length > 0) && (
            <button onClick={() => setExpanded(!expanded)} type="button"
              className="text-[0.58rem] text-white/22 hover:text-white/50 mt-0.5 transition-colors">
              {expanded ? 'gizle ▲' : 'detay ▼'}
            </button>
          )}
        </div>
      </div>

      {expanded && (d.type || d.props.length > 0) && (
        <div className="px-3 pb-3 border-t border-white/[0.04] pt-2">
          {d.type && <p className="text-[0.66rem] text-yellow-400/60 mb-1">{d.type}</p>}
          {d.props.filter(Boolean).map((p, i) => (
            <p key={i} className="text-[0.68rem] text-white/42 leading-relaxed">{p}</p>
          ))}
        </div>
      )}
    </div>
  )
}
