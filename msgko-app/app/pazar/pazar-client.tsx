'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowDownWideNarrow, ChevronLeft, ChevronRight, History, RefreshCw, Search, Store, TriangleAlert, X } from 'lucide-react'
import type { MarketDay, MarketListing, MarketPage, MarketSort, MarketType } from '@/lib/market'

interface Props {
  servers: { code: string; label: string }[]
  pageSize: number
}

const SORT_LABEL: Record<MarketSort, string> = {
  price_asc: 'En ucuz',
  price_desc: 'En pahalı',
  time_desc: 'En yeni',
}
const REFRESH_MS = 60_000

const fullPrice = (n: number) => n.toLocaleString('tr-TR')
function shortPrice(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('tr-TR', { maximumFractionDigits: 2 })} Milyar`
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString('tr-TR', { maximumFractionDigits: 1 })}M`
  if (n >= 1_000) return `${(n / 1_000).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}K`
  return String(n)
}
// API zamanları İstanbul saatiyle ve saat dilimi olmadan gelir ("2026-08-19 11:45:00")
const parseTime = (s: string) => new Date(s.replace(' ', 'T') + '+03:00')
function ago(s: string) {
  const sec = Math.max(0, Math.floor((Date.now() - parseTime(s).getTime()) / 1000))
  if (sec < 60) return 'az önce'
  if (sec < 3600) return `${Math.floor(sec / 60)} dk önce`
  if (sec < 86400) return `${Math.floor(sec / 3600)} saat önce`
  return `${Math.floor(sec / 86400)} gün önce`
}

function ItemIcon({ src }: { src: string | null }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return <span aria-hidden="true" className="h-9 w-9 shrink-0 rounded-lg border border-white/8 bg-ink-800" />
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- harici item ikonları (enucuzgb.com), optimize edilmeden gösterilir
    <img src={src} alt="" width={36} height={36} loading="lazy" onError={() => setFailed(true)} className="h-9 w-9 shrink-0 rounded-lg border border-white/8 bg-ink-800 object-cover" />
  )
}

export function PazarClient({ servers, pageSize }: Props) {
  const [server, setServer] = useState(servers[0].code)
  const [type, setType] = useState<MarketType>('sell')
  const [sort, setSort] = useState<MarketSort>('price_asc')
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<MarketPage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchedAt, setFetchedAt] = useState<number | null>(null)
  const [selected, setSelected] = useState<MarketListing | null>(null)
  const reqId = useRef(0)

  // Aramada her tuşta istek atılmaz
  useEffect(() => {
    const t = setTimeout(() => setQuery(input.trim()), 400)
    return () => clearTimeout(t)
  }, [input])

  const load = useCallback(async () => {
    const id = ++reqId.current
    setLoading(true)
    try {
      const qs = new URLSearchParams({ server, type, sort, page: String(page) })
      if (query) qs.set('q', query)
      const res = await fetch(`/api/pazar?${qs}`)
      const body = await res.json()
      if (id !== reqId.current) return
      if (!res.ok) throw new Error(body?.error ?? 'Pazar verisi alınamadı')
      setResult(body)
      setError(null)
      setFetchedAt(Date.now())
    } catch (e) {
      if (id === reqId.current) setError(e instanceof Error ? e.message : 'Pazar verisi alınamadı')
    } finally {
      if (id === reqId.current) setLoading(false)
    }
  }, [server, type, sort, page, query])

  useEffect(() => {
    // Filtre değişince ilk istek; ardından sekme görünürken dakikada bir yenilenir
    const first = setTimeout(load, 0)
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') load()
    }, REFRESH_MS)
    return () => {
      clearTimeout(first)
      clearInterval(timer)
    }
  }, [load])

  const change = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v)
    setPage(1)
    setSelected(null)
  }

  const rows = result?.data ?? []
  const total = result?.meta.total ?? 0
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const serverLabel = servers.find((s) => s.code === server)?.label ?? server

  return (
    <div className="space-y-8">
      {/* Sunucu seçici */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-fg-4">Sunucu</p>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {servers.map((s) => (
            <li key={s.code}>
              <button
                type="button"
                aria-pressed={server === s.code}
                onClick={() => change(setServer)(s.code)}
                className={`w-full rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                  server === s.code
                    ? 'border-amethyst-500/60 bg-amethyst-600/15 text-fg'
                    : 'border-white/8 bg-ink-850 text-fg-3 hover:border-white/16 hover:text-fg'
                }`}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Filtreler */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div role="group" aria-label="İlan türü" className="inline-flex shrink-0 rounded-xl border border-white/8 bg-ink-850 p-1">
          {(['sell', 'buy'] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={type === t}
              onClick={() => change(setType)(t)}
              className={`min-h-10 flex-1 rounded-lg px-5 text-sm font-semibold transition-colors ${
                type === t ? 'bg-amethyst-600 text-white' : 'text-fg-3 hover:text-fg'
              }`}
            >
              {t === 'sell' ? 'Satış' : 'Alış'}
            </button>
          ))}
        </div>
        <label className="relative flex-1">
          <span className="sr-only">Item veya satıcı ara</span>
          <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-4" />
          <input
            type="search"
            value={input}
            onChange={(e) => { setInput(e.target.value); setPage(1); setSelected(null) }}
            placeholder="Item veya satıcı ara (ör. raptor)"
            maxLength={40}
            className="h-12 w-full rounded-xl border border-white/8 bg-ink-850 pl-11 pr-4 text-[0.9375rem] text-fg outline-none placeholder:text-fg-4 focus:border-amethyst-500/60"
          />
        </label>
        <label className="relative shrink-0">
          <span className="sr-only">Sıralama</span>
          <ArrowDownWideNarrow size={17} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-4" />
          <select
            value={sort}
            onChange={(e) => change(setSort)(e.target.value as MarketSort)}
            className="h-12 w-full appearance-none rounded-xl border border-white/8 bg-ink-850 pl-11 pr-10 text-[0.9375rem] font-semibold text-fg outline-none focus:border-amethyst-500/60 lg:w-48"
          >
            {(Object.keys(SORT_LABEL) as MarketSort[]).map((s) => (
              <option key={s} value={s}>{SORT_LABEL[s]}</option>
            ))}
          </select>
          <ChevronRight size={16} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-fg-4" />
        </label>
      </div>

      {/* Durum çubuğu */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm text-fg-3" role="status">
          {error ? (
            <>
              <TriangleAlert size={16} aria-hidden="true" className="text-ember-400" />
              {error}
            </>
          ) : (
            <>
              <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <span>
                <strong className="text-fg">{serverLabel}</strong> · {total.toLocaleString('tr-TR')} {type === 'sell' ? 'satış' : 'alış'} ilanı
                {fetchedAt && <span className="text-fg-4"> · dakikada bir yenilenir</span>}
              </span>
            </>
          )}
        </p>
        <button type="button" onClick={load} disabled={loading} className="btn btn-secondary btn-sm">
          <RefreshCw size={15} aria-hidden="true" className={loading ? 'animate-spin' : ''} />
          Yenile
        </button>
      </div>

      {selected && (
        <PriceHistory listing={selected} server={server} serverLabel={serverLabel} type={type} onClose={() => setSelected(null)} />
      )}

      {/* İlan tablosu */}
      {rows.length > 0 ? (
        <div className="card overflow-hidden">
          <table className="table-ko table-stack">
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">{type === 'sell' ? 'Satıcı' : 'Alıcı'}</th>
                <th scope="col" className="text-right!">Fiyat</th>
                <th scope="col" className="text-right!">Güncelleme</th>
              </tr>
            </thead>
            <tbody className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
              {rows.map((r, i) => (
                <tr key={`${r.item_id}-${r.username}-${r.price}-${i}`}>
                  <td data-primary data-full>
                    <button
                      type="button"
                      onClick={() => setSelected(r)}
                      className="group flex items-center gap-3 text-left"
                      aria-label={`${r.item_name} fiyat geçmişini göster`}
                    >
                      <ItemIcon src={r.item_icon_url} />
                      <span className="font-semibold text-fg group-hover:text-amethyst-300">{r.item_name}</span>
                      <History size={14} aria-hidden="true" className="shrink-0 text-fg-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  </td>
                  <td data-label={type === 'sell' ? 'Satıcı:' : 'Alıcı:'} className="text-fg-2">{r.username}</td>
                  <td data-label="Fiyat:" className="whitespace-nowrap sm:text-right">
                    <span className="font-bold tabular-nums text-fg">{fullPrice(r.price)}</span>
                    <span className="ml-2 text-xs text-fg-4">{shortPrice(r.price)}</span>
                  </td>
                  <td data-label="Güncelleme:" className="whitespace-nowrap text-fg-3 sm:text-right">{ago(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && (
          <div className="card flex flex-col items-center px-6 py-16 text-center">
            <span className="icon-tile">
              <Store size={20} aria-hidden="true" />
            </span>
            {error ? (
              <>
                <p className="mt-5 font-semibold text-fg">İlanlar şu an alınamıyor.</p>
                <p className="mt-2 max-w-md text-sm text-fg-3">Birkaç dakika sonra tekrar dene.</p>
              </>
            ) : query ? (
              <>
                <p className="mt-5 font-semibold text-fg">“{query}” için {serverLabel} sunucusunda ilan bulunamadı.</p>
                <p className="mt-2 max-w-md text-sm text-fg-3">Farklı bir yazım dene ya da başka bir sunucu seç.</p>
              </>
            ) : (
              <>
                <p className="mt-5 font-semibold text-fg">{serverLabel} sunucusunda şu an aktif {type === 'sell' ? 'satış' : 'alış'} ilanı yok.</p>
                <p className="mt-2 max-w-md text-sm text-fg-3">
                  Pazar verisi oyun içi merchant ilanlarından toplanır. Kaynak güncellendiğinde liste kendiliğinden dolar.
                </p>
              </>
            )}
          </div>
        )
      )}

      {/* Sayfalama */}
      {total > pageSize && (
        <nav aria-label="Sayfalar" className="flex items-center justify-center gap-3">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || loading} className="btn btn-secondary btn-sm disabled:opacity-40">
            <ChevronLeft size={16} aria-hidden="true" />
            Önceki
          </button>
          <span className="text-sm tabular-nums text-fg-3">{page} / {pages}</span>
          <button type="button" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages || loading} className="btn btn-secondary btn-sm disabled:opacity-40">
            Sonraki
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </nav>
      )}
    </div>
  )
}

/** Seçilen item'ın son 30 günlük fiyat özeti */
function PriceHistory({ listing, server, serverLabel, type, onClose }: {
  listing: MarketListing
  server: string
  serverLabel: string
  type: MarketType
  onClose: () => void
}) {
  const [days, setDays] = useState<MarketDay[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    const qs = new URLSearchParams({ item_id: listing.item_id, server, type })
    fetch(`/api/pazar/history?${qs}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((b) => { if (alive) { setDays(b.data); setFailed(false) } })
      .catch(() => { if (alive) setFailed(true) })
    return () => { alive = false }
  }, [listing.item_id, server, type])

  const latest = days?.[0]
  const oldest = days?.[days.length - 1]
  const change = latest && oldest && oldest.avg_price > 0 ? ((latest.avg_price - oldest.avg_price) / oldest.avg_price) * 100 : null

  return (
    <section aria-label={`${listing.item_name} fiyat geçmişi`} className="card p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <ItemIcon src={listing.item_icon_url} />
          <div>
            <h2 className="text-lg font-bold tracking-tight text-fg">{listing.item_name}</h2>
            <p className="text-sm text-fg-3">{serverLabel} · {type === 'sell' ? 'satış' : 'alış'} · son 30 gün</p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Fiyat geçmişini kapat" className="btn btn-ghost h-10 min-h-10 w-10 px-0">
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      {failed && <p className="mt-6 text-sm text-fg-3">Fiyat geçmişi şu an alınamıyor.</p>}
      {!failed && !days && <p className="mt-6 text-sm text-fg-4">Yükleniyor…</p>}
      {days && days.length === 0 && <p className="mt-6 text-sm text-fg-3">Bu item için son 30 günde kayıt yok.</p>}

      {latest && (
        <>
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { k: 'Son ortalama', v: fullPrice(latest.avg_price) },
              { k: 'Son en düşük', v: fullPrice(latest.min_price) },
              { k: 'İlan sayısı', v: latest.listings_count.toLocaleString('tr-TR') },
              { k: '30 günlük değişim', v: change === null ? '—' : `${change > 0 ? '+' : ''}${change.toLocaleString('tr-TR', { maximumFractionDigits: 1 })}%` },
            ].map(({ k, v }) => (
              <div key={k} className="rounded-xl border border-white/8 bg-ink-900 px-4 py-3">
                <dt className="text-xs uppercase tracking-[0.12em] text-fg-4">{k}</dt>
                <dd className="mt-1 font-bold tabular-nums text-fg">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 max-h-80 overflow-y-auto rounded-xl border border-white/8">
            <table className="table-ko table-stack">
              <thead>
                <tr>
                  <th scope="col">Tarih</th>
                  <th scope="col">Ortalama</th>
                  <th scope="col">En düşük</th>
                  <th scope="col">En yüksek</th>
                  <th scope="col">İlan</th>
                </tr>
              </thead>
              <tbody>
                {days!.map((d) => (
                  <tr key={d.date}>
                    <td data-primary className="whitespace-nowrap">{new Date(d.date + 'T12:00:00+03:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</td>
                    <td data-label="Ort.:" className="tabular-nums">{fullPrice(d.avg_price)}</td>
                    <td data-label="Min:" className="tabular-nums">{fullPrice(d.min_price)}</td>
                    <td data-label="Maks:" className="tabular-nums">{fullPrice(d.max_price)}</td>
                    <td data-label="İlan:" className="tabular-nums">{d.listings_count.toLocaleString('tr-TR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}
