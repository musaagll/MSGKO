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
  if (diff < 60)   return `${diff}sn önce`
  if (diff < 3600) return `${Math.floor(diff / 60)}dk önce`
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`
  return `${Math.floor(diff / 86400)}g önce`
}

// Tippy HTML'ini parse et — item özellikleri
function parseItemDetails(html: string | null | undefined): {
  title: string; type: string; kind: string; props: string[]
} {
  if (!html) return { title: '', type: '', kind: '', props: [] }
  const get = (cls: string) => {
    const escaped = cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const m = html.match(new RegExp(`<div class='${escaped}'[^>]*>([\\s\\S]*?)</div>`, 'i'))
    return m ? m[1].replace(/<[^>]+>/g, '').trim() : ''
  }
  const title = get('item_title white') || get('item_title')
  const type  = get('item_type white')  || get('item_type')
  const kind  = get('item_kind')
  // item_property tüm occurrences
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
  { value: 'price_asc',    label: 'Fiyat ↑' },
  { value: 'price_desc',   label: 'Fiyat ↓' },
  { value: 'name_asc',     label: 'İsim A-Z' },
  { value: 'upgrade_desc', label: '+Lvl ↓' },
  { value: 'upgrade_asc',  label: '+Lvl ↑' },
  { value: 'newest',       label: 'En Yeni' },
]

const GROUPS = [
  { key: 'zero',    label: 'Zero',    color: '#60a5fa', glow: 'rgba(96,165,250,0.15)' },
  { key: 'agartha', label: 'Agartha', color: '#fbbf24', glow: 'rgba(251,191,36,0.15)' },
  { key: 'pandora', label: 'Pandora', color: '#34d399', glow: 'rgba(52,211,153,0.15)' },
  { key: 'destan',  label: 'Destan',  color: '#a78bfa', glow: 'rgba(167,139,250,0.15)' },
]

// ── Ana Bileşen ────────────────────────────────────────────────────────────────
export function PazarClient() {
  const [channel,    setChannel]    = useState<ChannelKey>('zero3')
  const [query,      setQuery]      = useState('')
  const [sort,       setSort]       = useState('price_asc')
  const [upgrade,    setUpgrade]    = useState('')
  const [page,       setPage]       = useState(1)
  const [data,       setData]       = useState<PazarResponse | null>(null)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [counts,     setCounts]     = useState<Record<string, number>>({})
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [debouncedQ, setDebouncedQ] = useState('')

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => { setDebouncedQ(query); setPage(1) }, 350)
  }, [query])

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const params = new URLSearchParams({
        server: channel, sort, page: String(page),
        ...(debouncedQ ? { q: debouncedQ } : {}),
        ...(upgrade !== '' ? { upgrade } : {}),
      })
      const res = await fetch(`/api/pazar?${params}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setData(await res.json())
      setLastUpdate(new Date())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }, [channel, sort, page, debouncedQ, upgrade])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => {
    const t = setInterval(fetchData, 3 * 60 * 1000)
    return () => clearInterval(t)
  }, [fetchData])
  useEffect(() => {
    fetch('/api/pazar', { method: 'POST' }).then(r => r.json()).then(setCounts).catch(() => {})
  }, [])

  const currentChannel = CHANNELS.find(c => c.key === channel)!
  const currentGroup   = GROUPS.find(g => g.key === currentChannel.group)!
  const hasFilter      = debouncedQ !== '' || upgrade !== ''

  return (
    <div className="min-h-screen" style={{ background: '#080810' }}>

      {/* ── Hero Header ─────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(15,15,30,0.95) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-6">
          <nav className="mb-5">
            <ol className="flex items-center gap-2 text-[0.7rem] text-white/25">
              <li><Link href="/" className="hover:text-white/50 transition-colors">Ana Sayfa</Link></li>
              <li className="text-white/15">/</li>
              <li className="text-white/40">Pazar</li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: currentGroup.color, boxShadow: `0 0 8px ${currentGroup.color}` }} />
                <span className="text-[0.65rem] tracking-[0.3em] uppercase font-bold"
                  style={{ color: currentGroup.color }}>Canlı Pazar Verileri</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-1"
                style={{ fontFamily: 'var(--font-rajdhani, sans-serif)', letterSpacing: '-0.01em' }}>
                USKO <span style={{ color: currentGroup.color }}>Pazar</span>
              </h1>
              <p className="text-[0.78rem] text-white/30">
                Tüm ilanlar · Gerçek zamanlı veriler · Fiyat karşılaştırması
              </p>
            </div>

            <div className="flex items-center gap-4 text-[0.72rem] text-white/30">
              {lastUpdate && (
                <span>Son güncelleme: <span className="text-white/50">{timeAgo(lastUpdate.toISOString())}</span></span>
              )}
              <button onClick={fetchData} disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/[0.08]
                  hover:border-white/20 transition-all disabled:opacity-40 text-white/50 hover:text-white/80">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" className={loading ? 'animate-spin' : ''}>
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                Yenile
              </button>
            </div>
          </div>

          {/* ── Sunucu seçimi ── */}
          <div className="space-y-2">
            {/* Grup butonları */}
            <div className="flex flex-wrap gap-2">
              {GROUPS.map(grp => {
                const grpChannels = CHANNELS.filter(c => c.group === grp.key)
                const total = grpChannels.reduce((s, c) => s + (counts[c.key] ?? 0), 0)
                const active = currentChannel.group === grp.key
                return (
                  <button key={grp.key} type="button"
                    onClick={() => { setChannel(grpChannels[0].key as ChannelKey); setPage(1) }}
                    className="relative px-5 py-2 text-[0.72rem] font-bold tracking-[0.12em] uppercase
                      transition-all duration-200 rounded-sm overflow-hidden"
                    style={{
                      background:  active ? grp.glow : 'rgba(255,255,255,0.03)',
                      border:      `1px solid ${active ? grp.color + '50' : 'rgba(255,255,255,0.07)'}`,
                      color:       active ? grp.color : 'rgba(255,255,255,0.35)',
                      boxShadow:   active ? `0 0 20px ${grp.glow}` : 'none',
                    }}>
                    {grp.label}
                    {total > 0 && (
                      <span className="ml-2 text-[0.6rem] opacity-60 font-normal">
                        {total.toLocaleString('tr-TR')}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Kanal sekmeleri */}
            <div className="flex flex-wrap gap-1">
              {CHANNELS.filter(c => c.group === currentChannel.group).map(ch => {
                const active = channel === ch.key
                return (
                  <button key={ch.key} type="button"
                    onClick={() => { setChannel(ch.key as ChannelKey); setPage(1) }}
                    className="px-3 py-1 text-[0.7rem] font-semibold tracking-[0.06em] uppercase
                      transition-all duration-150 rounded-sm"
                    style={{
                      background:  active ? `${currentGroup.color}18` : 'transparent',
                      border:      `1px solid ${active ? currentGroup.color + '45' : 'rgba(255,255,255,0.05)'}`,
                      color:       active ? currentGroup.color : 'rgba(255,255,255,0.3)',
                    }}>
                    {ch.label}
                    {(counts[ch.key] ?? 0) > 0 && (
                      <span className="ml-1.5 text-[0.58rem] opacity-55">
                        {counts[ch.key].toLocaleString('tr-TR')}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Filtre Çubuğu ───────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 border-b border-white/[0.05]"
        style={{ background: 'rgba(8,8,16,0.92)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-2">

            {/* Arama */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Item ara... (Raptor, Shard, Glave, Mirage...)"
                className="w-full pl-9 pr-8 py-2.5 text-[0.82rem] rounded-sm bg-white/[0.04]
                  border border-white/[0.08] text-white/80 placeholder-white/20 outline-none
                  focus:border-white/20 focus:bg-white/[0.06] transition-all"
              />
              {query && (
                <button onClick={() => setQuery('')} type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>

            {/* +Lvl filtresi */}
            <div className="relative">
              <select value={upgrade} onChange={e => { setUpgrade(e.target.value); setPage(1) }}
                className="appearance-none pl-3 pr-8 py-2.5 text-[0.78rem] rounded-sm bg-white/[0.04]
                  border border-white/[0.08] text-white/60 outline-none focus:border-white/20
                  transition-all cursor-pointer min-w-[105px]">
                <option value=""   style={{ background: '#0d0d1a' }}>Tüm +Lvl</option>
                <option value="0"  style={{ background: '#0d0d1a' }}>+0 (seviyesiz)</option>
                {[1,2,3,4,5,6,7,8,9,10,11].map(n => (
                  <option key={n} value={String(n)} style={{ background: '#0d0d1a' }}>+{n}</option>
                ))}
              </select>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>

            {/* Sıralama */}
            <div className="relative">
              <select value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}
                className="appearance-none pl-3 pr-8 py-2.5 text-[0.78rem] rounded-sm bg-white/[0.04]
                  border border-white/[0.08] text-white/60 outline-none focus:border-white/20
                  transition-all cursor-pointer min-w-[120px]">
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value} style={{ background: '#0d0d1a' }}>{o.label}</option>
                ))}
              </select>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── İçerik ──────────────────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Hata */}
        {error && (
          <div className="p-4 mb-5 rounded border border-red-500/20 text-[0.82rem] text-red-400/80 bg-red-500/5">
            {error} — <button onClick={fetchData} className="underline underline-offset-2">Tekrar dene</button>
          </div>
        )}

        {/* Yükleniyor */}
        {loading && !data && (
          <div className="flex flex-col items-center justify-center py-32 gap-5">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-white/5" />
              <div className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: `${currentGroup.color}60`, borderTopColor: 'transparent' }} />
              <div className="absolute inset-2 rounded-full border border-white/5" />
            </div>
            <p className="text-[0.78rem] text-white/30 tracking-wider">Pazar verisi yükleniyor...</p>
          </div>
        )}

        {/* Sonuç bilgisi */}
        {data && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 text-[0.74rem]">
              <span className="text-white/60 font-semibold tabular-nums">
                {data.total.toLocaleString('tr-TR')}
              </span>
              <span className="text-white/25">ilan</span>
              {debouncedQ && (
                <>
                  <span className="text-white/15">·</span>
                  <span className="text-white/40">&ldquo;{debouncedQ}&rdquo;</span>
                </>
              )}
              {upgrade !== '' && (
                <>
                  <span className="text-white/15">·</span>
                  <span style={{ color: currentGroup.color }}>
                    +{upgrade === '0' ? '0' : upgrade}
                  </span>
                </>
              )}
              <span className="text-white/15">·</span>
              <span className="font-semibold" style={{ color: currentGroup.color }}>
                {currentChannel.label}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {hasFilter && (
                <button onClick={() => { setQuery(''); setUpgrade(''); setPage(1) }}
                  className="text-[0.7rem] text-white/30 hover:text-white/60 transition-colors
                    flex items-center gap-1 border border-white/[0.06] px-2.5 py-1 rounded-sm hover:border-white/15">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Filtrele
                </button>
              )}
              {data.total_pages > 1 && (
                <span className="text-[0.7rem] text-white/25">
                  {data.page} / {data.total_pages}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tablo */}
        {data && data.listings.length > 0 && (
          <div className={`transition-opacity duration-150 ${loading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>

            {/* Desktop tablo */}
            <div className="hidden lg:block rounded overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              <table className="w-full text-[0.8rem]">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <th className="text-left py-3 px-4 text-[0.62rem] tracking-[0.18em] uppercase text-white/35 font-semibold w-[40%]">
                      Item
                    </th>
                    <th className="text-center py-3 px-3 text-[0.62rem] tracking-[0.18em] uppercase text-white/35 font-semibold w-16">
                      +Lvl
                    </th>
                    <th className="text-left py-3 px-4 text-[0.62rem] tracking-[0.18em] uppercase text-white/35 font-semibold w-32">
                      Satıcı
                    </th>
                    <th className="text-left py-3 px-4 text-[0.62rem] tracking-[0.18em] uppercase text-white/35 font-semibold w-28">
                      Konum
                    </th>
                    <th className="text-right py-3 px-4 text-[0.62rem] tracking-[0.18em] uppercase text-white/35 font-semibold w-36">
                      Fiyat
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.listings.map((item, idx) => (
                    <DesktopRow key={item.id} item={item} idx={idx} color={currentGroup.color} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tablet (md) */}
            <div className="hidden md:block lg:hidden space-y-px rounded overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              {data.listings.map((item, idx) => (
                <TabletRow key={item.id} item={item} idx={idx} color={currentGroup.color} />
              ))}
            </div>

            {/* Mobil */}
            <div className="md:hidden space-y-2">
              {data.listings.map(item => (
                <MobileCard key={item.id} item={item} color={currentGroup.color} />
              ))}
            </div>

            {/* Sayfalama */}
            {data.total_pages > 1 && (
              <Pagination
                current={page} total={data.total_pages}
                onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                loading={loading} color={currentGroup.color}
              />
            )}
          </div>
        )}

        {/* Boş sonuç */}
        {data && data.listings.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div className="w-16 h-16 rounded flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" className="text-white/20">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <div>
              <p className="text-[0.9rem] font-semibold text-white/40 mb-1">
                {debouncedQ ? `"${debouncedQ}" bulunamadı` : 'Bu kanalda ilan yok'}
              </p>
              <p className="text-[0.75rem] text-white/20">
                {debouncedQ ? 'Farklı bir item adı veya kanal deneyin' : 'Veriler henüz yükleniyor olabilir'}
              </p>
            </div>
            {hasFilter && (
              <button onClick={() => { setQuery(''); setUpgrade(''); setPage(1) }}
                className="text-[0.74rem] tracking-wider uppercase text-white/30 hover:text-white/60 transition-colors mt-1">
                Filtreleri temizle
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Item Tooltip ───────────────────────────────────────────────────────────────
function ItemTooltip({ item, color }: { item: MarketListing; color: string }) {
  const details = parseItemDetails(item.item_details)
  const hasDetails = details.title || details.type || details.props.length > 0

  if (!hasDetails) return null

  return (
    <div className="absolute left-0 top-full mt-2 z-50 min-w-[220px] max-w-[280px] pointer-events-none"
      style={{
        background: 'rgba(10,10,20,0.98)',
        border: `1px solid ${color}30`,
        boxShadow: `0 12px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)`,
        borderRadius: '4px',
      }}>
      {/* Başlık */}
      {details.title && (
        <div className="px-3 py-2 border-b" style={{ borderColor: `${color}20` }}>
          <p className="text-[0.82rem] font-bold" style={{ color }}>
            {details.title}
            {item.upgrade_level ? (
              <span className="ml-1.5 text-[0.72rem]" style={{ color: item.upgrade_level >= 8 ? '#fbbf24' : 'rgba(255,255,255,0.5)' }}>
                +{item.upgrade_level}
              </span>
            ) : null}
          </p>
          {details.kind && (
            <p className="text-[0.65rem] text-white/35 mt-0.5">{details.kind}</p>
          )}
        </div>
      )}

      {/* Tip */}
      {details.type && (
        <div className="px-3 py-1.5 border-b border-white/[0.04]">
          <span className="text-[0.68rem] text-yellow-400/70">{details.type}</span>
        </div>
      )}

      {/* Özellikler */}
      {details.props.length > 0 && (
        <div className="px-3 py-2 space-y-0.5">
          {details.props.filter(p => p.length > 0).map((prop, i) => (
            <p key={i} className="text-[0.7rem] text-white/55 leading-relaxed">{prop}</p>
          ))}
        </div>
      )}

      {/* Fiyat bilgisi */}
      <div className="px-3 py-2 border-t border-white/[0.04]"
        style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex items-center justify-between">
          <span className="text-[0.65rem] text-white/30">Pazar fiyatı</span>
          <span className="text-[0.75rem] font-bold" style={{ color: '#f87171' }}>
            {item.original_price ? item.original_price.toLocaleString('tr-TR') : (item.price + 1).toLocaleString('tr-TR')} ₦
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-[0.65rem] text-white/30">Önerilen</span>
          <span className="text-[0.75rem] font-bold text-emerald-400/80">
            {item.price.toLocaleString('tr-TR')} ₦ <span className="text-[0.6rem] text-white/20">(-1)</span>
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Desktop Satır ──────────────────────────────────────────────────────────────
function DesktopRow({ item, idx, color }: { item: MarketListing; idx: number; color: string }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const img = item.img_url

  return (
    <tr className="group border-b transition-colors duration-100 cursor-default"
      style={{
        borderColor: 'rgba(255,255,255,0.035)',
        background: showTooltip ? 'rgba(255,255,255,0.025)' : idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
      }}>

      {/* Item adı + tooltip */}
      <td className="py-2.5 px-4">
        <div className="relative flex items-center gap-3"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}>
          {/* İkon */}
          <div className="relative flex-shrink-0 w-9 h-9 rounded flex items-center justify-center overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {img ? (
              <img src={img} alt={item.item_name} width={32} height={32}
                className="w-7 h-7 object-contain"
                style={{ imageRendering: 'pixelated' }}
                loading="lazy"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" className="text-white/15">
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
              </svg>
            )}
          </div>
          {/* Metin */}
          <div className="min-w-0">
            <p className="font-semibold text-white/85 truncate leading-snug group-hover:text-white transition-colors">
              {item.item_name}
            </p>
            {item.item_details && (
              <p className="text-[0.63rem] text-white/30 mt-0.5">
                {parseItemDetails(item.item_details).type || 'Item'}
              </p>
            )}
          </div>
          {/* Tooltip */}
          {showTooltip && <ItemTooltip item={item} color={color} />}
        </div>
      </td>

      {/* +Lvl */}
      <td className="py-2.5 px-3 text-center">
        {item.upgrade_level != null ? (
          <span className="inline-block text-[0.72rem] font-black px-2 py-0.5 rounded-sm tabular-nums"
            style={{
              background: item.upgrade_level >= 9 ? 'rgba(251,191,36,0.15)'
                        : item.upgrade_level >= 7 ? 'rgba(167,139,250,0.12)'
                        : 'rgba(255,255,255,0.06)',
              color:      item.upgrade_level >= 9 ? '#fbbf24'
                        : item.upgrade_level >= 7 ? '#a78bfa'
                        : 'rgba(255,255,255,0.5)',
              border: `1px solid ${
                item.upgrade_level >= 9 ? 'rgba(251,191,36,0.25)'
                : item.upgrade_level >= 7 ? 'rgba(167,139,250,0.2)'
                : 'rgba(255,255,255,0.08)'}`,
            }}>
            +{item.upgrade_level}
          </span>
        ) : <span className="text-white/12">—</span>}
      </td>

      {/* Satıcı */}
      <td className="py-2.5 px-4">
        <span className="text-[0.78rem] text-white/40 truncate block">{item.seller_name ?? '—'}</span>
      </td>

      {/* Konum */}
      <td className="py-2.5 px-4">
        {item.loc_x != null && item.loc_z != null ? (
          <span className="text-[0.72rem] font-mono text-white/35 bg-white/[0.04] px-2 py-0.5 rounded-sm">
            {item.loc_x},{item.loc_z}
          </span>
        ) : <span className="text-white/12">—</span>}
      </td>

      {/* Fiyat */}
      <td className="py-2.5 px-4 text-right">
        <div>
          <p className="font-black text-[0.92rem] tabular-nums" style={{ color: '#f87171' }}>
            {formatPrice(item.price)}
          </p>
          <p className="text-[0.6rem] text-white/20 tabular-nums mt-0.5">
            {item.price.toLocaleString('tr-TR')} ₦
          </p>
        </div>
      </td>
    </tr>
  )
}

// ── Tablet Satır ───────────────────────────────────────────────────────────────
function TabletRow({ item, idx, color }: { item: MarketListing; idx: number; color: string }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const img = item.img_url
  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.025]"
      style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="relative flex-shrink-0 w-9 h-9 rounded flex items-center justify-center overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
        {img
          ? <img src={img} alt={item.item_name} width={28} height={28} className="w-7 h-7 object-contain" style={{ imageRendering: 'pixelated' }} loading="lazy" />
          : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/15"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>}
        {showTooltip && <ItemTooltip item={item} color={color} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[0.82rem] font-semibold text-white/85 truncate">{item.item_name}</span>
          {item.upgrade_level != null && (
            <span className="text-[0.68rem] font-black px-1.5 py-0.5 rounded-sm flex-shrink-0"
              style={{ background: item.upgrade_level >= 7 ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.06)', color: item.upgrade_level >= 7 ? '#a78bfa' : 'rgba(255,255,255,0.5)' }}>
              +{item.upgrade_level}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-[0.68rem] text-white/30 truncate">{item.seller_name ?? '—'}</span>
          {item.loc_x != null && (
            <span className="text-[0.65rem] font-mono text-white/20">{item.loc_x},{item.loc_z}</span>
          )}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-black text-[0.88rem] tabular-nums" style={{ color: '#f87171' }}>{formatPrice(item.price)}</p>
        <p className="text-[0.6rem] text-white/20">{item.price.toLocaleString('tr-TR')} ₦</p>
      </div>
    </div>
  )
}

// ── Mobil Kart ─────────────────────────────────────────────────────────────────
function MobileCard({ item, color }: { item: MarketListing; color: string }) {
  const [expanded, setExpanded] = useState(false)
  const img = item.img_url
  const details = parseItemDetails(item.item_details)
  return (
    <div className="rounded overflow-hidden transition-all"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-center gap-3 p-3">
        <div className="flex-shrink-0 w-10 h-10 rounded flex items-center justify-center overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {img
            ? <img src={img} alt={item.item_name} width={32} height={32} className="w-8 h-8 object-contain" style={{ imageRendering: 'pixelated' }} loading="lazy" />
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/15"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[0.85rem] font-semibold text-white/85 truncate">{item.item_name}</span>
            {item.upgrade_level != null && (
              <span className="text-[0.7rem] font-black px-1.5 py-0.5 rounded-sm flex-shrink-0"
                style={{ background: item.upgrade_level >= 7 ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.06)', color: item.upgrade_level >= 7 ? '#a78bfa' : 'rgba(255,255,255,0.5)' }}>
                +{item.upgrade_level}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[0.7rem] text-white/30">{item.seller_name ?? '—'}</span>
            {item.loc_x != null && <span className="text-[0.65rem] font-mono text-white/20">{item.loc_x},{item.loc_z}</span>}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-black text-[0.92rem] tabular-nums" style={{ color: '#f87171' }}>{formatPrice(item.price)}</p>
          {(details.title || details.props.length > 0) && (
            <button onClick={() => setExpanded(!expanded)}
              className="text-[0.6rem] text-white/25 hover:text-white/50 mt-0.5 transition-colors">
              {expanded ? 'gizle ▲' : 'detay ▼'}
            </button>
          )}
        </div>
      </div>
      {expanded && (details.type || details.props.length > 0) && (
        <div className="px-3 pb-3 border-t border-white/[0.04]">
          {details.type && <p className="text-[0.68rem] text-yellow-400/60 mt-2 mb-1">{details.type}</p>}
          {details.props.filter(p => p).map((p, i) => (
            <p key={i} className="text-[0.7rem] text-white/45 leading-relaxed">{p}</p>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Sayfalama ──────────────────────────────────────────────────────────────────
function Pagination({ current, total, onChange, loading, color }: {
  current: number; total: number
  onChange: (p: number) => void; loading: boolean; color: string
}) {
  const pages: (number | '…')[] = []
  if (total <= 9) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 4) pages.push('…')
    for (let i = Math.max(2, current - 2); i <= Math.min(total - 1, current + 2); i++) pages.push(i)
    if (current < total - 3) pages.push('…')
    pages.push(total)
  }

  const btnBase = `min-w-[36px] h-9 px-2 text-[0.75rem] font-semibold rounded-sm
    transition-all duration-150 border disabled:opacity-30 disabled:cursor-not-allowed`

  return (
    <div className="flex items-center justify-center gap-1 mt-8 flex-wrap">
      <button onClick={() => onChange(1)} disabled={current === 1 || loading}
        className={`${btnBase} border-white/[0.07] text-white/35 hover:border-white/20 hover:text-white/60`}>
        «
      </button>
      <button onClick={() => onChange(current - 1)} disabled={current === 1 || loading}
        className={`${btnBase} border-white/[0.07] text-white/35 hover:border-white/20 hover:text-white/60`}>
        ‹
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`d${i}`} className="w-8 text-center text-white/20 text-[0.75rem]">…</span>
        ) : (
          <button key={p} onClick={() => onChange(p)} disabled={loading}
            className={`${btnBase}`}
            style={{
              background:  p === current ? `${color}18` : 'transparent',
              borderColor: p === current ? `${color}45` : 'rgba(255,255,255,0.07)',
              color:       p === current ? color : 'rgba(255,255,255,0.4)',
            }}>
            {p}
          </button>
        )
      )}

      <button onClick={() => onChange(current + 1)} disabled={current === total || loading}
        className={`${btnBase} border-white/[0.07] text-white/35 hover:border-white/20 hover:text-white/60`}>
        ›
      </button>
      <button onClick={() => onChange(total)} disabled={current === total || loading}
        className={`${btnBase} border-white/[0.07] text-white/35 hover:border-white/20 hover:text-white/60`}>
        »
      </button>
    </div>
  )
}
