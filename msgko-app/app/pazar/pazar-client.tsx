'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

/* ── Tipler ───────────────────────────────────────────────────────── */
interface Listing {
  item_id:       number
  item_name:     string
  item_type:     number
  item_base_id:  number
  item_icon_url: string | null
  username:      string
  server:        string
  price:         number
  merchant_type: number
  type:          'sell' | 'buy'
  pos_x:         number | null
  pos_z:         number | null
  created_at:    string
}

interface ApiResponse {
  success: boolean
  data:    Listing[]
  meta: {
    page:      number
    page_size: number
    total:     number
    type:      string
  }
  error?: string
}

/* ── Sunucu listesi ───────────────────────────────────────────────── */
const SERVERS = [
  { key: 'ZERO3',   label: 'Zero3'   },
  { key: 'ZERO4',   label: 'Zero4'   },
  { key: 'ZERO5',   label: 'Zero5'   },
  { key: 'DESTAN2', label: 'Destan2' },
  { key: 'OREADS2', label: 'Oreads2' },
]

/* ── Sabitler ─────────────────────────────────────────────────────── */
const ENUCUZGB_BASE = 'https://www.enucuzgb.com/api/v2'
const ENUCUZGB_KEY  = process.env.NEXT_PUBLIC_ENUCUZGB_API_KEY ?? ''
const LIMIT = 50

/* ── Yardımcılar ──────────────────────────────────────────────────── */
function formatPrice(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2).replace(/\.?0+$/, '') + 'B'
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000)         return n.toLocaleString('tr-TR')
  return String(n)
}

function timeAgo(iso: string): string {
  const sec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (sec < 60)    return `${sec}sn`
  if (sec < 3600)  return `${Math.floor(sec / 60)}dk`
  if (sec < 86400) return `${Math.floor(sec / 3600)}sa`
  return `${Math.floor(sec / 86400)}g`
}

// item adından upgrade seviyesini çıkar: "Iron Bow (+8)" → 8
function parseUpgrade(name: string): string {
  const m = name.match(/\(\+(\d+)\)/)
  return m ? `+${m[1]}` : '—'
}

// item adından upgrade'i temizle
function cleanName(name: string): string {
  return name.replace(/\s*\(\+\d+\)$/, '').trim()
}

// upgrade seviyesine göre renk
function upgradeColor(name: string): string {
  const m = name.match(/\(\+(\d+)\)/)
  if (!m) return 'rgba(255,255,255,0.2)'
  const n = parseInt(m[1])
  if (n >= 9) return '#e8c96a'
  if (n >= 7) return '#a78bfa'
  if (n >= 5) return '#60a5fa'
  return 'rgba(255,255,255,0.5)'
}

// konum: koordinat → harita adı tahmini
function mapName(x: number | null, z: number | null): string {
  if (x == null || z == null) return '—'
  // Knight Online'da Moradon ~800-840 x, 520-700 z aralığı
  if (x >= 790 && x <= 850 && z >= 500 && z <= 720) return `Moradon (${x}, ${z})`
  if (x >= 700 && x <= 790) return `El Morad (${x}, ${z})`
  return `(${x}, ${z})`
}

// sayfalama helper
function pageRange(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '...')[] = [1]
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
}

/* ── Ana bileşen ──────────────────────────────────────────────────── */
export function PazarClient() {
  const [server,  setServer]  = useState('ZERO3')
  const [type,    setType]    = useState<'sell' | 'buy'>('sell')
  const [query,   setQuery]   = useState('')
  const [dq,      setDq]      = useState('')
  const [sort,    setSort]    = useState('price_asc')
  const [page,    setPage]    = useState(1)
  const [data,    setData]    = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [counts,  setCounts]  = useState<Record<string, number>>({})
  const debRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Arama debounce
  useEffect(() => {
    if (debRef.current) clearTimeout(debRef.current)
    debRef.current = setTimeout(() => { setDq(query); setPage(1) }, 400)
  }, [query])

  // Filtre değişince sayfa sıfırla
  useEffect(() => { setPage(1) }, [server, type, sort])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        server, type, sort,
        page:  String(page),
        limit: String(LIMIT),
      })
      if (dq) params.set('query', dq)

      const res = await fetch(
        `${ENUCUZGB_BASE}/market/live?${params}`,
        {
          headers: { 'X-API-Key': ENUCUZGB_KEY, Accept: 'application/json' },
          cache: 'no-store',
        }
      )
      const json = await res.json()
      setData(json)
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [server, type, sort, page, dq])

  useEffect(() => { fetchData() }, [fetchData])

  // 60 saniyede otomatik yenile
  useEffect(() => {
    const t = setInterval(fetchData, 60_000)
    return () => clearInterval(t)
  }, [fetchData])

  // Sunucu sayılarını yükle
  useEffect(() => {
    Promise.allSettled(
      SERVERS.map(async s => {
        const res = await fetch(
          `${ENUCUZGB_BASE}/market/live?server=${s.key}&type=sell&limit=1`,
          { headers: { 'X-API-Key': ENUCUZGB_KEY, Accept: 'application/json' } }
        )
        if (res.ok) {
          const j = await res.json()
          if (j.success) setCounts(prev => ({ ...prev, [s.key]: j.meta?.total ?? 0 }))
        }
      })
    )
  }, [])

  const listings   = data?.data ?? []
  const total      = data?.meta?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / LIMIT))
  const activeServer = SERVERS.find(s => s.key === server)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* ── Hero banner ────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          marginTop: '68px',
          height: '180px',
          background: 'linear-gradient(135deg, #0d0b08 0%, #1a1205 40%, #0a0c14 100%)',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
        }}
      >
        {/* Altın parıltı */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 100% at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)',
        }} />
        {/* Sağ dekoratif yazı */}
        <div style={{
          position: 'absolute', right: 48, bottom: 32,
          fontFamily: "'Cinzel', serif", fontSize: 18,
          color: 'rgba(201,168,76,0.18)', fontStyle: 'italic', letterSpacing: '0.08em',
          userSelect: 'none',
        }} aria-hidden="true">
          Good game!
        </div>

        <div className="section-container h-full flex flex-col justify-center">
          {/* Breadcrumb */}
          <nav className="mb-3">
            <ol className="flex items-center gap-2" style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)' }}>
              <li><Link href="/" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)' }}>Anasayfa</Link></li>
              <li style={{ opacity: 0.3 }}>›</li>
              <li style={{ color: 'rgba(255,255,255,0.45)' }}>Pazar</li>
            </ol>
          </nav>

          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(22px,4vw,36px)', fontWeight: 900, letterSpacing: '0.04em', lineHeight: 1.1 }}>
            OYUNCU{' '}
            <span style={{ background: 'linear-gradient(135deg, #e8c96a, #c9a84c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              PAZARLARI
            </span>
          </h1>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6, maxWidth: 380 }}>
            Tüm sunuculardaki oyuncu pazarlarını anlık olarak görüntüleyin. Fiyatları karşılaştırın, en iyi fırsatları yakalayın.
          </p>
        </div>
      </div>

      {/* ── Ana içerik ─────────────────────────────────────────────── */}
      <div className="section-container py-6">
        <div className="flex gap-5" style={{ alignItems: 'flex-start' }}>

          {/* ── SOL: Sunucu listesi ──────────────────────────────── */}
          <aside style={{ width: 180, flexShrink: 0 }} className="hidden lg:block">
            <p style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>
              Sunucu Seç
            </p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 2, listStyle: 'none', padding: 0, margin: 0 }}>
              {SERVERS.map(s => {
                const active  = server === s.key
                const cnt     = counts[s.key]
                return (
                  <li key={s.key}>
                    <button
                      type="button"
                      onClick={() => setServer(s.key)}
                      style={{
                        width: '100%', textAlign: 'left',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '9px 12px',
                        background: active ? 'rgba(201,168,76,0.10)' : 'transparent',
                        border: active ? '1px solid rgba(201,168,76,0.25)' : '1px solid transparent',
                        borderRadius: 6,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
                      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                          background: active ? '#c9a84c' : 'rgba(255,255,255,0.2)',
                          boxShadow: active ? '0 0 6px rgba(201,168,76,0.6)' : 'none',
                        }} />
                        <span style={{ fontSize: '0.82rem', fontWeight: active ? 700 : 500, color: active ? '#f0ead6' : 'var(--text-secondary)' }}>
                          {s.label}
                        </span>
                      </div>
                      {cnt != null && (
                        <span style={{ fontSize: '0.68rem', color: active ? 'var(--gold-mid)' : 'var(--text-muted)', fontWeight: 600 }}>
                          {cnt.toLocaleString('tr-TR')}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* Dekoratif kart */}
            <div style={{
              marginTop: 20,
              padding: '16px',
              background: 'linear-gradient(135deg, #0d0b08, #1a1205)',
              border: '1px solid rgba(201,168,76,0.1)',
              borderRadius: 8,
            }}>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: '13px', color: '#c9a84c', fontWeight: 700, marginBottom: 4 }}>
                KNIGHT ONLINE
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Efsane devam ediyor.
              </p>
            </div>
          </aside>

          {/* ── SAĞ: İçerik ─────────────────────────────────────── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Sunucu başlık + yenile */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#c9a84c', boxShadow: '0 0 8px rgba(201,168,76,0.6)', flexShrink: 0 }} />
                  <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 900, color: '#f0ead6', letterSpacing: '0.04em' }}>
                    {activeServer?.label}
                  </h2>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 3 }}>
                  Toplam <strong style={{ color: 'var(--text-secondary)' }}>{total.toLocaleString('tr-TR')}</strong> aktif pazar
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {data?.meta && (
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    Son güncelleme: {new Date().toLocaleString('tr-TR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                  </span>
                )}
                <button
                  type="button"
                  onClick={fetchData}
                  disabled={loading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 14px',
                    background: 'rgba(201,168,76,0.08)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: 6,
                    fontSize: '0.75rem', fontWeight: 600, color: '#c9a84c',
                    cursor: 'pointer', transition: 'all 0.15s',
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }}>
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Yenile
                </button>
              </div>
            </div>

            {/* Filtre çubuğu */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {/* Arama */}
              <div style={{ position: 'relative', flex: '1', minWidth: 180 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Item adı ara..."
                  style={{
                    width: '100%',
                    paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 6,
                    fontSize: '0.8rem', color: '#f0ead6',
                    outline: 'none',
                  }}
                  onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.35)' }}
                  onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)' }}
                />
              </div>

              {/* Kategori (type) */}
              <select
                value={type}
                onChange={e => setType(e.target.value as 'sell' | 'buy')}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  fontSize: '0.8rem', color: '#f0ead6',
                  cursor: 'pointer', outline: 'none',
                }}
              >
                <option value="sell" style={{ background: '#0e1018' }}>Satış İlanları</option>
                <option value="buy"  style={{ background: '#0e1018' }}>Alım İlanları</option>
              </select>

              {/* Sıralama */}
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  fontSize: '0.8rem', color: '#f0ead6',
                  cursor: 'pointer', outline: 'none',
                }}
              >
                <option value="price_asc"  style={{ background: '#0e1018' }}>En Ucuz</option>
                <option value="price_desc" style={{ background: '#0e1018' }}>En Pahalı</option>
                <option value="time_desc"  style={{ background: '#0e1018' }}>En Yeni</option>
              </select>

              {/* Filtrele butonu */}
              <button
                type="button"
                onClick={fetchData}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px',
                  background: '#c9a84c',
                  border: '1px solid #e8c96a',
                  borderRadius: 6,
                  fontSize: '0.8rem', fontWeight: 700, color: '#07080d',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#e8c96a' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#c9a84c' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                Filtrele
              </button>
            </div>

            {/* Mobil sunucu seçimi */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: 'none' }}>
              {SERVERS.map(s => {
                const active = server === s.key
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setServer(s.key)}
                    style={{
                      flexShrink: 0,
                      padding: '6px 12px',
                      background: active ? 'rgba(201,168,76,0.10)' : 'rgba(255,255,255,0.03)',
                      border: active ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 6,
                      fontSize: '0.75rem', fontWeight: active ? 700 : 400,
                      color: active ? '#c9a84c' : 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>

            {/* Tablo */}
            {loading && listings.length === 0 ? (
              <SkeletonTable />
            ) : listings.length === 0 && !loading ? (
              <EmptyState query={dq} onClear={() => setQuery('')} />
            ) : (
              <>
                <div
                  className={loading ? 'opacity-50 pointer-events-none' : ''}
                  style={{
                    background: 'rgba(10,11,16,0.8)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    transition: 'opacity 0.15s',
                  }}
                >
                  {/* Tablo header */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr 70px 140px 160px 90px 80px',
                    padding: '10px 16px',
                    background: 'rgba(255,255,255,0.03)',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.18em',
                    textTransform: 'uppercase', color: 'var(--text-muted)',
                  }}>
                    <span>#</span>
                    <span>İtem</span>
                    <span style={{ textAlign: 'center' }}>+</span>
                    <span style={{ textAlign: 'right' }}>Fiyat</span>
                    <span>Satıcı</span>
                    <span>Lokasyon</span>
                    <span style={{ textAlign: 'right' }}>Süre</span>
                  </div>

                  {/* Tablo satırları */}
                  {listings.map((item, idx) => (
                    <TableRow
                      key={`${item.item_id}-${idx}`}
                      item={item}
                      idx={(page - 1) * LIMIT + idx + 1}
                    />
                  ))}
                </div>

                {/* Alt özet + sayfalama */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, flexWrap: 'wrap', gap: 8 }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Toplam <strong style={{ color: 'var(--text-secondary)' }}>{total.toLocaleString('tr-TR')}</strong> pazardan{' '}
                    <strong style={{ color: 'var(--text-secondary)' }}>{LIMIT}</strong> tanesi gösteriliyor.
                  </p>

                  {totalPages > 1 && (
                    <Pagination
                      page={page}
                      total={totalPages}
                      onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      loading={loading}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

/* ── Tablo satırı ─────────────────────────────────────────────────── */
function TableRow({ item, idx }: { item: Listing; idx: number }) {
  const upgrade  = parseUpgrade(item.item_name)
  const upgColor = upgradeColor(item.item_name)
  const name     = cleanName(item.item_name)
  const loc      = mapName(item.pos_x, item.pos_z)
  const ago      = timeAgo(item.created_at)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr 70px 140px 160px 90px 80px',
        padding: '10px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        alignItems: 'center',
        background: hovered ? 'rgba(201,168,76,0.03)' : 'transparent',
        transition: 'background 0.1s',
      }}
    >
      {/* # */}
      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{idx}</span>

      {/* İtem */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        {item.item_icon_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.item_icon_url}
            alt=""
            width={32}
            height={32}
            style={{
              width: 32, height: 32, objectFit: 'contain',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 4, flexShrink: 0,
              imageRendering: 'pixelated',
            }}
            loading="lazy"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div style={{
            width: 32, height: 32, flexShrink: 0,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="m9 9 6 6m0-6-6 6"/>
            </svg>
          </div>
        )}
        <span style={{
          fontSize: '0.82rem', fontWeight: 600,
          color: hovered ? '#f0ead6' : 'var(--text-secondary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          transition: 'color 0.1s',
        }}>
          {name}
        </span>
      </div>

      {/* + */}
      <div style={{ textAlign: 'center' }}>
        {upgrade !== '—' ? (
          <span style={{
            fontSize: '0.72rem', fontWeight: 800,
            color: upgColor,
            background: `${upgColor}18`,
            border: `1px solid ${upgColor}30`,
            padding: '2px 7px',
            borderRadius: 4,
          }}>
            {upgrade}
          </span>
        ) : (
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.72rem' }}>—</span>
        )}
      </div>

      {/* Fiyat */}
      <div style={{ textAlign: 'right' }}>
        <span style={{
          fontSize: '0.88rem', fontWeight: 800,
          color: '#e8c96a',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {formatPrice(item.price)}
        </span>
      </div>

      {/* Satıcı */}
      <span style={{ fontSize: '0.77rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {item.username}
      </span>

      {/* Lokasyon */}
      <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {loc}
      </span>

      {/* Süre */}
      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'right' }}>
        {ago}
      </span>
    </div>
  )
}

/* ── Sayfalama ────────────────────────────────────────────────────── */
function Pagination({
  page, total, onChange, loading,
}: {
  page: number; total: number; onChange: (p: number) => void; loading: boolean
}) {
  const pages = pageRange(page, total)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
      {/* Önceki */}
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1 || loading}
        style={{
          width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 6, cursor: page === 1 ? 'not-allowed' : 'pointer',
          color: page === 1 ? 'rgba(255,255,255,0.2)' : 'var(--text-secondary)',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      {/* Sayfa numaraları */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', padding: '0 4px' }}>…</span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p as number)}
            disabled={loading}
            style={{
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: p === page ? '#c9a84c' : 'rgba(255,255,255,0.04)',
              border: p === page ? '1px solid #e8c96a' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6, cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: p === page ? 800 : 500,
              color: p === page ? '#07080d' : 'var(--text-secondary)',
              transition: 'all 0.1s',
            }}
          >
            {p}
          </button>
        )
      )}

      {/* Sonraki */}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === total || loading}
        style={{
          width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 6, cursor: page === total ? 'not-allowed' : 'pointer',
          color: page === total ? 'rgba(255,255,255,0.2)' : 'var(--text-secondary)',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  )
}

/* ── Skeleton ─────────────────────────────────────────────────────── */
function SkeletonTable() {
  return (
    <div style={{ background: 'rgba(10,11,16,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', height: 36 }} />
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="skeleton" style={{ width: 24, height: 14, borderRadius: 3 }} />
          <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 4, flexShrink: 0 }} />
          <div className="skeleton" style={{ flex: 1, height: 14, borderRadius: 3 }} />
          <div className="skeleton" style={{ width: 80, height: 14, borderRadius: 3 }} />
          <div className="skeleton" style={{ width: 100, height: 14, borderRadius: 3 }} />
        </div>
      ))}
    </div>
  )
}

/* ── Boş durum ────────────────────────────────────────────────────── */
function EmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', gap: 12, textAlign: 'center' }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.35)' }}>
        {query ? `"${query}" için ilan bulunamadı` : 'Bu sunucuda aktif ilan yok'}
      </p>
      {query && (
        <button onClick={onClear} style={{ fontSize: '0.75rem', color: '#c9a84c', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
          Aramayı temizle
        </button>
      )}
    </div>
  )
}
