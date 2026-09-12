'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { CHANNELS } from '@/lib/pazar-types'
import type { MarketListing, PazarResponse, ChannelKey } from '@/lib/pazar-types'

// ── Sabitler ───────────────────────────────────────────────────────────────────
const GROUPS = [
  { key: 'zero',    label: 'Zero',    color: '#60a5fa', bg: 'rgba(96,165,250,0.08)'   },
  { key: 'agartha', label: 'Agartha', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)'   },
  { key: 'pandora', label: 'Pandora', color: '#34d399', bg: 'rgba(52,211,153,0.08)'   },
  { key: 'destan',  label: 'Destan',  color: '#a78bfa', bg: 'rgba(167,139,250,0.08)'  },
  { key: 'oreads',  label: 'Oreads',  color: '#fb923c', bg: 'rgba(251,146,60,0.08)'   },
] as const

type GroupKey = (typeof GROUPS)[number]['key']

// server string — tek kanal ("zero3"), tüm grup ("all_zero"), tümü ("all")
type ServerParam = string

const SORT_OPTIONS = [
  { value: 'price_asc',    label: 'En Ucuz'    },
  { value: 'price_desc',   label: 'En Pahalı'  },
  { value: 'name_asc',     label: 'İsim A-Z'   },
  { value: 'upgrade_desc', label: '+Lvl ↓'     },
  { value: 'upgrade_asc',  label: '+Lvl ↑'     },
  { value: 'newest',       label: 'En Yeni'    },
]

// ── Yardımcılar ────────────────────────────────────────────────────────────────
function formatPrice(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)         return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString('tr-TR')
}

function timeAgo(iso: string): string {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (d < 60)    return `${d}sn önce`
  if (d < 3600)  return `${Math.floor(d / 60)}dk önce`
  if (d < 86400) return `${Math.floor(d / 3600)}sa önce`
  return `${Math.floor(d / 86400)}g önce`
}

function parseItemDetails(html: string | null | undefined) {
  if (!html) return { title: '', type: '', kind: '', props: [] as string[] }
  const get = (cls: string) => {
    const esc = cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const m   = html.match(new RegExp(`<div class='${esc}'[^>]*>([\\s\\S]*?)</div>`, 'i'))
    return m ? m[1].replace(/<[^>]+>/g, '').trim() : ''
  }
  const title = get('item_title white') || get('item_title')
  const type  = get('item_type white')  || get('item_type')
  const kind  = get('item_kind')
  const props: string[] = []
  const re = /<div class='item_property[^']*'>([\s\S]*?)<\/div>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    const t = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    if (t) props.push(t)
  }
  return { title, type, kind, props }
}

// Aktif server için grup rengini bul
function colorFor(serverParam: ServerParam): { color: string; bg: string; label: string } {
  if (serverParam === 'all') return { color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', label: 'Tüm Serverler' }
  const grpKey = serverParam.startsWith('all_') ? serverParam.slice(4) : null
  if (grpKey) {
    const g = GROUPS.find(x => x.key === grpKey)
    return g ? { color: g.color, bg: g.bg, label: `Tüm ${g.label}` } : { color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', label: '' }
  }
  const firstKey = serverParam.split(',')[0] as ChannelKey
  const ch  = CHANNELS.find(c => c.key === firstKey)
  const grp = GROUPS.find(g => g.key === ch?.group)
  return grp ? { color: grp.color, bg: grp.bg, label: ch?.label ?? '' } : { color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', label: '' }
}

// Aktif grup key'ini bul
function activeGroupKey(serverParam: ServerParam): GroupKey | null {
  if (serverParam === 'all') return null
  if (serverParam.startsWith('all_')) return serverParam.slice(4) as GroupKey
  const firstKey = serverParam.split(',')[0] as ChannelKey
  const ch = CHANNELS.find(c => c.key === firstKey)
  return (ch?.group as GroupKey) ?? null
}

// ── Ana Bileşen ────────────────────────────────────────────────────────────────
export function PazarClient() {
  const [server,  setServer]  = useState<ServerParam>('zero3')
  const [query,   setQuery]   = useState('')
  const [sort,    setSort]    = useState('price_asc')
  const [upgrade, setUpgrade] = useState('')
  const [page,    setPage]    = useState(1)
  const [data,    setData]    = useState<PazarResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [counts,  setCounts]  = useState<Record<string, number>>({})

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [dq, setDq] = useState('')

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => { setDq(query); setPage(1) }, 350)
  }, [query])

  // filtre değişince page reset
  useEffect(() => { setPage(1) }, [server, sort, upgrade])

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const p = new URLSearchParams({ server, sort, page: String(page) })
      if (dq)      p.set('q', dq)
      if (upgrade) p.set('upgrade', upgrade)
      const res = await fetch(`/api/pazar?${p}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setData(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }, [server, sort, page, dq, upgrade])

  useEffect(() => { fetchData() }, [fetchData])

  // 3 dk otomatik yenile
  useEffect(() => {
    const t = setInterval(fetchData, 3 * 60 * 1000)
    return () => clearInterval(t)
  }, [fetchData])

  useEffect(() => {
    fetch('/api/pazar', { method: 'POST' })
      .then(r => r.json()).then(setCounts).catch(() => {})
  }, [])

  const { color, bg, label: activeLabel } = colorFor(server)
  const activeGrp = activeGroupKey(server)

  function changeServer(s: ServerParam) {
    setServer(s)
    setPage(1)
  }

  function groupTotal(gKey: string) {
    return CHANNELS
      .filter(c => c.group === gKey)
      .reduce((s, c) => s + (counts[c.key] ?? 0), 0)
  }

  const allTotal = CHANNELS.reduce((s, c) => s + (counts[c.key] ?? 0), 0)

  return (
    <div className="min-h-screen" style={{ background: '#07070f' }}>

      {/* ══ HEADER ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-24 pb-5">
        <nav className="mb-4">
          <ol className="flex items-center gap-2 text-[0.68rem] text-white/20">
            <li><Link href="/" className="hover:text-white/50 transition-colors">Ana Sayfa</Link></li>
            <li className="text-white/10">/</li>
            <li className="text-white/40">Pazar</li>
          </ol>
        </nav>

        {/* Başlık + son güncelleme */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
              <span className="text-[0.6rem] tracking-[0.25em] uppercase font-bold opacity-70"
                style={{ color }}>Canlı Pazar</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              USKO <span style={{ color }}>{activeLabel}</span>
            </h1>
          </div>
          {data?.last_scraped && (
            <div className="flex items-center gap-2 text-[0.7rem] text-white/30 mt-1">
              <span className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#22c55e', boxShadow: '0 0 4px #22c55e' }} />
              <span>Güncellendi: <span className="text-white/50">{timeAgo(data.last_scraped)}</span></span>
            </div>
          )}
        </div>

        {/* ── Sunucu Seçimi ──────────────────────────────────────────────────── */}
        <div className="space-y-2 mb-5">

          {/* Satır 1: Tüm serverler + Grup butonları */}
          <div className="flex flex-wrap gap-1.5">
            {/* Tüm Serverler */}
            <button type="button" onClick={() => changeServer('all')}
              className="px-3 py-1.5 text-[0.7rem] font-bold tracking-[0.08em] uppercase border
                transition-all duration-150 rounded-sm"
              style={{
                background:  server === 'all' ? 'rgba(148,163,184,0.08)' : 'rgba(255,255,255,0.02)',
                borderColor: server === 'all' ? 'rgba(148,163,184,0.4)' : 'rgba(255,255,255,0.07)',
                color:       server === 'all' ? '#94a3b8' : 'rgba(255,255,255,0.3)',
              }}>
              Tüm Serverler
              {allTotal > 0 && (
                <span className="ml-1.5 text-[0.6rem] opacity-50 font-normal">
                  {allTotal.toLocaleString('tr-TR')}
                </span>
              )}
            </button>

            {GROUPS.map(g => {
              const isAllGrp  = server === `all_${g.key}`
              const isSomeGrp = !isAllGrp && activeGrp === g.key
              const total     = groupTotal(g.key)
              return (
                <button key={g.key} type="button" onClick={() => changeServer(`all_${g.key}`)}
                  className="px-3 py-1.5 text-[0.7rem] font-bold tracking-[0.08em] uppercase border
                    transition-all duration-150 rounded-sm"
                  style={{
                    background:  isAllGrp ? g.bg : isSomeGrp ? `${g.color}08` : 'rgba(255,255,255,0.02)',
                    borderColor: (isAllGrp || isSomeGrp) ? `${g.color}45` : 'rgba(255,255,255,0.07)',
                    color:       (isAllGrp || isSomeGrp) ? g.color : 'rgba(255,255,255,0.3)',
                  }}>
                  Tüm {g.label}
                  {total > 0 && (
                    <span className="ml-1.5 text-[0.6rem] opacity-50 font-normal">
                      {total.toLocaleString('tr-TR')}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Satır 2: Tekil kanal sekmeleri (aktif gruba göre) */}
          {activeGrp && (
            <div className="flex flex-wrap gap-1">
              {CHANNELS.filter(c => c.group === activeGrp).map(ch => {
                const active = server === ch.key
                const cnt    = counts[ch.key] ?? 0
                return (
                  <button key={ch.key} type="button" onClick={() => changeServer(ch.key)}
                    className="px-3 py-1 text-[0.67rem] font-semibold tracking-[0.05em] uppercase border
                      transition-all duration-100 rounded-sm"
                    style={{
                      background:  active ? bg : 'transparent',
                      borderColor: active ? `${color}40` : 'rgba(255,255,255,0.05)',
                      color:       active ? color : 'rgba(255,255,255,0.28)',
                    }}>
                    {ch.label}
                    {cnt > 0 && (
                      <span className="ml-1 opacity-45 font-normal text-[0.58rem]">
                        {cnt.toLocaleString('tr-TR')}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Filtre Çubuğu ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Arama — esnek genişlik */}
          <div className="relative flex-1 min-w-0">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
              width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Item ara... (Raptor, Shard, Glave, Mirage...)"
              className="w-full pl-9 pr-8 py-2 text-[0.8rem] rounded-sm bg-white/[0.04]
                border border-white/[0.07] text-white/80 placeholder-white/20 outline-none
                focus:border-white/20 focus:bg-white/[0.05] transition-all"
            />
            {query && (
              <button onClick={() => setQuery('')} type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30
                  hover:text-white/70 transition-colors text-base leading-none">
                ×
              </button>
            )}
          </div>

          {/* +Lvl */}
          <select value={upgrade} onChange={e => setUpgrade(e.target.value)}
            className="appearance-none px-3 py-2 text-[0.76rem] rounded-sm bg-white/[0.04]
              border border-white/[0.07] text-white/55 outline-none focus:border-white/20
              transition-all cursor-pointer sm:min-w-[105px]">
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
              transition-all cursor-pointer sm:min-w-[110px]">
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value} style={{ background: '#0d0d1a' }}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Yenile */}
          <button onClick={fetchData} disabled={loading} type="button"
            className="px-3 py-2 text-[0.76rem] rounded-sm border border-white/[0.07]
              text-white/40 hover:border-white/20 hover:text-white/70 transition-all
              disabled:opacity-30 flex items-center justify-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" className={loading ? 'animate-spin' : ''}>
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            Yenile
          </button>
        </div>
      </div>

      {/* ══ İÇERİK ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-24">

        {/* Sonuç özeti */}
        {data && !loading && (
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-[0.72rem] text-white/30 flex-wrap">
              <span className="font-bold text-white/60 tabular-nums">
                {data.total.toLocaleString('tr-TR')}
              </span>
              <span>ilan</span>
              {dq && (
                <>
                  <span className="text-white/15">·</span>
                  <span className="text-white/50">&ldquo;{dq}&rdquo;</span>
                </>
              )}
              {upgrade && (
                <>
                  <span className="text-white/15">·</span>
                  <span style={{ color }}>+{upgrade === '0' ? '0 (seviyesiz)' : upgrade}</span>
                </>
              )}
              <span className="text-white/15">·</span>
              <span style={{ color }}>{activeLabel}</span>
            </div>
            {(dq || upgrade) && (
              <button onClick={() => { setQuery(''); setUpgrade('') }}
                className="text-[0.68rem] text-white/25 hover:text-white/60 transition-colors
                  border border-white/[0.06] hover:border-white/15 px-2 py-0.5 rounded-sm">
                Temizle ×
              </button>
            )}
          </div>
        )}

        {/* Hata */}
        {error && (
          <div className="p-4 mb-4 rounded border border-red-500/20 text-[0.8rem]
            text-red-400/70 bg-red-500/[0.05]">
            {error} —{' '}
            <button onClick={fetchData} className="underline underline-offset-2">
              Tekrar dene
            </button>
          </div>
        )}

        {/* Skeleton yükleniyor */}
        {loading && !data && <SkeletonTable color={color} />}

        {/* Tablo */}
        {data && data.listings.length > 0 && (
          <div className={`transition-opacity duration-150 ${loading ? 'opacity-40 pointer-events-none' : ''}`}>

            {/* ── Desktop ── */}
            <div className="hidden md:block rounded overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <table className="w-full text-[0.8rem] border-collapse">
                <thead>
                  <tr style={{
                    background:   'rgba(255,255,255,0.03)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    {/* Item */}
                    <th className="text-left py-2.5 px-4 text-[0.6rem] tracking-[0.18em]
                      uppercase text-white/30 font-semibold">
                      Item
                    </th>
                    {/* +Lvl */}
                    <th className="text-center py-2.5 px-3 text-[0.6rem] tracking-[0.18em]
                      uppercase text-white/30 font-semibold w-16">
                      +Lvl
                    </th>
                    {/* Adet */}
                    <th className="text-center py-2.5 px-3 text-[0.6rem] tracking-[0.18em]
                      uppercase text-white/30 font-semibold w-16">
                      Adet
                    </th>
                    {/* Satıcı */}
                    <th className="text-left py-2.5 px-4 text-[0.6rem] tracking-[0.18em]
                      uppercase text-white/30 font-semibold w-32">
                      Satıcı
                    </th>
                    {/* Konum */}
                    <th className="text-left py-2.5 px-4 text-[0.6rem] tracking-[0.18em]
                      uppercase text-white/30 font-semibold w-28">
                      Konum
                    </th>
                    {/* Server — sadece multi-server modda */}
                    {data.server.includes(',') && (
                      <th className="text-left py-2.5 px-4 text-[0.6rem] tracking-[0.18em]
                        uppercase text-white/30 font-semibold w-24">
                        Server
                      </th>
                    )}
                    {/* Fiyat */}
                    <th className="text-right py-2.5 px-4 text-[0.6rem] tracking-[0.18em]
                      uppercase text-white/30 font-semibold w-36">
                      Fiyat
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.listings.map((item, idx) => (
                    <DesktopRow
                      key={item.id}
                      item={item}
                      idx={idx}
                      color={color}
                      showServer={data.server.includes(',')}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobil ── */}
            <div className="md:hidden space-y-2">
              {data.listings.map(item => (
                <MobileCard key={item.id} item={item} color={color}
                  showServer={data.server.includes(',')} />
              ))}
            </div>

            {/* ── Sayfalama ── */}
            {data.total_pages > 1 && (
              <Pagination
                page={page}
                total={data.total_pages}
                onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                loading={loading}
                color={color}
              />
            )}
          </div>
        )}

        {/* Boş durum */}
        {data && data.listings.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-28 gap-3 text-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.2" className="text-white/15">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <p className="text-[0.9rem] text-white/35">
              {dq ? `"${dq}" bulunamadı` : 'Bu kanalda ilan yok'}
            </p>
            <p className="text-[0.74rem] text-white/18">
              {dq ? 'Farklı kanal veya isim deneyin' : 'Veriler henüz yüklenmiş olmayabilir'}
            </p>
            {(dq || upgrade) && (
              <button onClick={() => { setQuery(''); setUpgrade('') }}
                className="text-[0.72rem] text-white/30 hover:text-white/60 transition-colors mt-1">
                Filtreleri temizle
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Skeleton ───────────────────────────────────────────────────────────────────
function SkeletonTable({ color }: { color: string }) {
  return (
    <div className="rounded overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* thead placeholder */}
      <div className="py-2.5 px-4 border-b border-white/[0.06]"
        style={{ background: 'rgba(255,255,255,0.03)' }}>
        <div className="h-3 w-48 rounded-sm bg-white/[0.07]" />
      </div>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i}
          className="flex items-center gap-4 px-4 py-3 border-b border-white/[0.04] animate-pulse"
          style={{ animationDelay: `${i * 0.05}s` }}>
          {/* icon placeholder */}
          <div className="w-8 h-8 rounded flex-shrink-0 bg-white/[0.05]" />
          {/* name */}
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 rounded-sm bg-white/[0.07]"
              style={{ width: `${45 + (i % 5) * 10}%` }} />
            <div className="h-2 rounded-sm bg-white/[0.04]" style={{ width: '30%' }} />
          </div>
          {/* price */}
          <div className="h-4 w-16 rounded-sm flex-shrink-0"
            style={{ background: `${color}15` }} />
        </div>
      ))}
    </div>
  )
}

// ── Item Tooltip ───────────────────────────────────────────────────────────────
function ItemTooltip({ item, color }: { item: MarketListing; color: string }) {
  const d = parseItemDetails(item.item_details)
  if (!d.title && !d.type && d.props.length === 0) return null
  return (
    <div className="absolute left-0 top-full mt-1.5 z-50 w-[250px] pointer-events-none"
      style={{
        background:   'rgba(7,7,18,0.98)',
        border:       `1px solid ${color}28`,
        boxShadow:    '0 16px 48px rgba(0,0,0,0.85)',
        borderRadius: '4px',
      }}>
      {d.title && (
        <div className="px-3 pt-2.5 pb-2 border-b border-white/[0.06]">
          <p className="text-[0.8rem] font-bold leading-tight" style={{ color }}>
            {d.title}
            {item.upgrade_level != null && (
              <span className="ml-1.5" style={{
                color: item.upgrade_level >= 9 ? '#fbbf24'
                     : item.upgrade_level >= 7 ? '#a78bfa'
                     : 'rgba(255,255,255,0.5)',
              }}>+{item.upgrade_level}</span>
            )}
          </p>
          {d.kind && <p className="text-[0.62rem] text-white/30 mt-0.5">{d.kind}</p>}
        </div>
      )}
      {d.type && (
        <div className="px-3 py-1.5 border-b border-white/[0.04]">
          <span className="text-[0.65rem] text-yellow-400/65">{d.type}</span>
        </div>
      )}
      {d.props.filter(Boolean).length > 0 && (
        <div className="px-3 py-2 space-y-0.5">
          {d.props.filter(Boolean).map((p, i) => (
            <p key={i} className="text-[0.68rem] text-white/50 leading-relaxed">{p}</p>
          ))}
        </div>
      )}
      <div className="px-3 py-2 border-t border-white/[0.04]"
        style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="flex justify-between items-center">
          <span className="text-[0.62rem] text-white/25">Fiyat</span>
          <span className="text-[0.73rem] font-bold text-red-400/80">
            {(item.original_price ?? item.price).toLocaleString('tr-TR')} ₦
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Upgrade badge ──────────────────────────────────────────────────────────────
function UpgradeBadge({ level }: { level: number | null }) {
  if (level == null) return <span className="text-white/15 text-xs">—</span>
  const gold  = level >= 9
  const purp  = level >= 7 && level < 9
  return (
    <span className="inline-block text-[0.7rem] font-black px-1.5 py-0.5 rounded-sm tabular-nums"
      style={{
        background: gold ? 'rgba(251,191,36,0.12)' : purp ? 'rgba(167,139,250,0.10)' : 'rgba(255,255,255,0.05)',
        color:      gold ? '#fbbf24'                : purp ? '#a78bfa'                : 'rgba(255,255,255,0.45)',
        border:    `1px solid ${gold ? 'rgba(251,191,36,0.22)' : purp ? 'rgba(167,139,250,0.18)' : 'rgba(255,255,255,0.07)'}`,
      }}>
      +{level}
    </span>
  )
}

// Kanal adını kısa göster ("zero3" → "Z3")
function shortServer(key: string): string {
  const ch = CHANNELS.find(c => c.key === key)
  if (!ch) return key
  const g = GROUPS.find(x => x.key === ch.group)
  return g ? `${g.label[0]}${key.replace(/[^0-9]/g, '')}` : key
}

function serverColor(key: string): string {
  const ch  = CHANNELS.find(c => c.key === key)
  const grp = GROUPS.find(g => g.key === ch?.group)
  return grp?.color ?? '#94a3b8'
}

// ── Desktop Satır ──────────────────────────────────────────────────────────────
function DesktopRow({
  item, idx, color, showServer,
}: {
  item: MarketListing; idx: number; color: string; showServer: boolean
}) {
  const [tip, setTip] = useState(false)
  const ppu = item.price_per_unit ?? (item.item_count > 1 ? Math.round(item.price / item.item_count) : null)

  return (
    <tr className="border-b transition-colors duration-75 hover:bg-white/[0.025] cursor-default"
      style={{ borderColor: 'rgba(255,255,255,0.04)' }}>

      {/* Item adı + tooltip */}
      <td className="py-2.5 px-4">
        <div className="relative flex items-center gap-3"
          onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
          <div className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {item.img_url ? (
              <img src={item.img_url} alt="" width={28} height={28}
                className="w-7 h-7 object-contain" style={{ imageRendering: 'pixelated' }}
                loading="lazy"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" className="text-white/15">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
              </svg>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white/85 truncate max-w-[280px] leading-snug
              group-hover:text-white transition-colors">
              {item.item_name}
            </p>
            {item.item_details && (
              <p className="text-[0.6rem] text-white/28 mt-0.5 truncate max-w-[280px]">
                {parseItemDetails(item.item_details).type}
              </p>
            )}
          </div>
          {tip && <ItemTooltip item={item} color={color} />}
        </div>
      </td>

      {/* +Lvl */}
      <td className="py-2.5 px-3 text-center w-16">
        <UpgradeBadge level={item.upgrade_level} />
      </td>

      {/* Adet */}
      <td className="py-2.5 px-3 text-center w-16">
        {item.item_count > 1 ? (
          <span className="text-[0.72rem] font-semibold text-white/55
            bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.5 rounded-sm tabular-nums">
            ×{item.item_count}
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
          <span className="inline-flex items-center gap-1 text-[0.67rem] font-mono
            text-white/40 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-sm">
            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" className="text-white/30 flex-shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {item.loc_x},{item.loc_z}
          </span>
        ) : <span className="text-white/15 text-xs">—</span>}
      </td>

      {/* Server (multi-server modu) */}
      {showServer && (
        <td className="py-2.5 px-4 w-24">
          <span className="text-[0.68rem] font-semibold px-1.5 py-0.5 rounded-sm"
            style={{
              color:       serverColor(item.server),
              background:  `${serverColor(item.server)}12`,
              border:      `1px solid ${serverColor(item.server)}25`,
            }}>
            {shortServer(item.server)}
          </span>
        </td>
      )}

      {/* Fiyat */}
      <td className="py-2.5 px-4 text-right w-36">
        <p className="font-black text-[0.92rem] tabular-nums leading-tight"
          style={{ color: '#f87171' }}>
          {formatPrice(item.price)}
        </p>
        <p className="text-[0.6rem] text-white/20 tabular-nums mt-0.5">
          {item.price.toLocaleString('tr-TR')} ₦
        </p>
        {ppu && item.item_count > 1 && (
          <p className="text-[0.58rem] text-white/25 tabular-nums">
            birim: {formatPrice(ppu)}
          </p>
        )}
      </td>
    </tr>
  )
}

// ── Mobil Kart ─────────────────────────────────────────────────────────────────
function MobileCard({
  item, color, showServer,
}: {
  item: MarketListing; color: string; showServer: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const d   = parseItemDetails(item.item_details)
  const ppu = item.price_per_unit ?? (item.item_count > 1 ? Math.round(item.price / item.item_count) : null)

  return (
    <div className="rounded overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-center gap-3 p-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded flex items-center justify-center overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {item.img_url ? (
            <img src={item.img_url} alt="" width={32} height={32}
              className="w-8 h-8 object-contain" style={{ imageRendering: 'pixelated' }}
              loading="lazy" />
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.5" className="text-white/15">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
            </svg>
          )}
        </div>

        {/* Meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[0.83rem] font-semibold text-white/85 truncate">
              {item.item_name}
            </span>
            <UpgradeBadge level={item.upgrade_level} />
            {item.item_count > 1 && (
              <span className="text-[0.65rem] font-semibold text-white/45
                bg-white/[0.05] border border-white/[0.07] px-1 py-0.5 rounded-sm flex-shrink-0">
                ×{item.item_count}
              </span>
            )}
            {showServer && (
              <span className="text-[0.62rem] font-semibold px-1.5 py-0.5 rounded-sm flex-shrink-0"
                style={{ color: serverColor(item.server), background: `${serverColor(item.server)}12` }}>
                {shortServer(item.server)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-[0.67rem] text-white/30">
            <span className="truncate max-w-[130px]">{item.seller_name ?? '—'}</span>
            {item.loc_x != null && (
              <span className="font-mono flex items-center gap-0.5 flex-shrink-0">
                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {item.loc_x},{item.loc_z}
              </span>
            )}
          </div>
        </div>

        {/* Fiyat */}
        <div className="text-right flex-shrink-0">
          <p className="font-black text-[0.9rem] tabular-nums" style={{ color: '#f87171' }}>
            {formatPrice(item.price)}
          </p>
          {ppu && item.item_count > 1 && (
            <p className="text-[0.58rem] text-white/28 mt-0.5">
              birim: {formatPrice(ppu)}
            </p>
          )}
          {(d.type || d.props.length > 0) && (
            <button onClick={() => setExpanded(!expanded)} type="button"
              className="text-[0.58rem] text-white/22 hover:text-white/55 mt-0.5 transition-colors">
              {expanded ? 'gizle ▲' : 'detay ▼'}
            </button>
          )}
        </div>
      </div>

      {expanded && (d.type || d.props.length > 0) && (
        <div className="px-3 pb-3 pt-2 border-t border-white/[0.04]">
          {d.type && <p className="text-[0.66rem] text-yellow-400/60 mb-1">{d.type}</p>}
          {d.props.filter(Boolean).map((p, i) => (
            <p key={i} className="text-[0.68rem] text-white/42 leading-relaxed">{p}</p>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Sayfalama ──────────────────────────────────────────────────────────────────
function Pagination({
  page, total, onChange, loading, color,
}: {
  page: number; total: number
  onChange: (p: number) => void; loading: boolean; color: string
}) {
  // Görüntülenecek sayfa numaraları
  const pages: (number | '…')[] = []
  if (total <= 9) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 4)          pages.push('…')
    for (let i = Math.max(2, page - 2); i <= Math.min(total - 1, page + 2); i++) pages.push(i)
    if (page < total - 3)  pages.push('…')
    pages.push(total)
  }

  const btn = `min-w-[34px] h-8 px-1.5 text-[0.74rem] font-semibold rounded-sm
    border transition-all duration-100 disabled:opacity-25 disabled:cursor-not-allowed`

  return (
    <div className="flex items-center justify-center gap-1 mt-7 flex-wrap">
      {/* İlk sayfa */}
      <button onClick={() => onChange(1)} disabled={page === 1 || loading}
        className={`${btn} border-white/[0.07] text-white/35 hover:border-white/20 hover:text-white/65`}>
        «
      </button>
      {/* Önceki */}
      <button onClick={() => onChange(page - 1)} disabled={page === 1 || loading}
        className={`${btn} border-white/[0.07] text-white/35 hover:border-white/20 hover:text-white/65`}>
        ‹
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="w-7 text-center text-white/20 text-[0.74rem]">…</span>
        ) : (
          <button key={p} onClick={() => onChange(p)} disabled={loading}
            className={`${btn}`}
            style={{
              background:  p === page ? `${color}15` : 'transparent',
              borderColor: p === page ? `${color}40` : 'rgba(255,255,255,0.07)',
              color:       p === page ? color         : 'rgba(255,255,255,0.4)',
            }}>
            {p}
          </button>
        )
      )}

      {/* Sonraki */}
      <button onClick={() => onChange(page + 1)} disabled={page === total || loading}
        className={`${btn} border-white/[0.07] text-white/35 hover:border-white/20 hover:text-white/65`}>
        ›
      </button>
      {/* Son sayfa */}
      <button onClick={() => onChange(total)} disabled={page === total || loading}
        className={`${btn} border-white/[0.07] text-white/35 hover:border-white/20 hover:text-white/65`}>
        »
      </button>
    </div>
  )
}
