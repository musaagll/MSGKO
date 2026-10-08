/**
 * Canlı Pazar — EnUcuzGB Market API v2 istemcisi (yalnızca sunucu).
 * Doküman: https://www.enucuzgb.com/api/docs/market
 *
 * API anahtarı ENUCUZGB_API_KEY ortam değişkeninden okunur ve tarayıcıya gönderilmez;
 * istemci her zaman /api/pazar üzerinden gelir. Bu dosyayı istemci bileşenlerinden import etme.
 */
const BASE = 'https://www.enucuzgb.com/api/v2'

/** API'nin geçmiş verisinde görülen sunucu kodları */
export const MARKET_SERVERS = [
  { code: 'ZERO3', label: 'Zero 3' },
  { code: 'ZERO4', label: 'Zero 4' },
  { code: 'ZERO5', label: 'Zero 5' },
  { code: 'PANDORA3', label: 'Pandora 3' },
  { code: 'PANDORA4', label: 'Pandora 4' },
  { code: 'AGARTHA3', label: 'Agartha 3' },
  { code: 'AGARTHA4', label: 'Agartha 4' },
  { code: 'DESTAN2', label: 'Destan 2' },
  { code: 'OREADS2', label: 'Oreads 2' },
  { code: 'DRYADS2', label: 'Dryads 2' },
  { code: 'MINARK2', label: 'Minark 2' },
  { code: 'FELIS2', label: 'Felis 2' },
] as const

export type MarketServer = (typeof MARKET_SERVERS)[number]['code']
export type MarketType = 'sell' | 'buy'
export type MarketSort = 'price_asc' | 'price_desc' | 'time_desc'

export const MARKET_SORTS: MarketSort[] = ['price_asc', 'price_desc', 'time_desc']
/** Planın izin verdiği en büyük sayfa boyutu */
export const MARKET_PAGE_SIZE = 50

export interface MarketListing {
  item_id: string
  item_name: string
  item_icon_url: string | null
  username: string
  server: string
  price: number
  type: MarketType
  created_at: string
}

export interface MarketPage {
  data: MarketListing[]
  meta: { page: number; page_size: number; total: number; type: MarketType }
}

export interface MarketDay {
  date: string
  avg_price: number
  min_price: number
  max_price: number
  listings_count: number
}

export class MarketError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export const isMarketServer = (v: string | null): v is MarketServer =>
  !!v && MARKET_SERVERS.some((s) => s.code === v)

async function call<T>(path: string, params: Record<string, string | number | undefined>, revalidate: number): Promise<T> {
  const key = process.env.ENUCUZGB_API_KEY
  if (!key) throw new MarketError(503, 'Pazar verisi yapılandırılmadı')

  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') qs.set(k, String(v))

  const res = await fetch(`${BASE}${path}?${qs}`, {
    headers: { 'X-API-Key': key, Accept: 'application/json', 'User-Agent': 'MSGKO/1.0 (+https://msgko.net)' },
    next: { revalidate },
    signal: AbortSignal.timeout(10_000),
  })
  const body = await res.json().catch(() => null)
  if (!res.ok || !body?.success) {
    const code = body?.error?.code ?? res.status
    console.error(`enucuzgb ${path} ${res.status} ${code}`)
    throw new MarketError(res.status === 429 ? 429 : 502, 'Pazar kaynağına şu an ulaşılamıyor')
  }
  return body as T
}

/** Aktif pazar ilanları (EnUcuzGB önerisi: 30–60 sn aralıkla yenile) */
export async function getLiveListings(opts: {
  server: MarketServer
  type: MarketType
  sort: MarketSort
  page: number
  query?: string
}): Promise<MarketPage> {
  const body = await call<MarketPage>(
    '/market/live',
    { server: opts.server, type: opts.type, sort: opts.sort, page: opts.page, limit: MARKET_PAGE_SIZE, query: opts.query },
    45,
  )
  return {
    meta: body.meta,
    data: body.data.map((r) => ({
      item_id: String(r.item_id),
      item_name: r.item_name,
      item_icon_url: r.item_icon_url ?? null,
      username: r.username,
      server: r.server,
      price: Number(r.price),
      type: r.type,
      created_at: r.created_at,
    })),
  }
}

/** Günlük fiyat özeti (günde bir güncellenir) */
export async function getPriceHistory(itemId: string, server: MarketServer, type: MarketType): Promise<MarketDay[]> {
  const body = await call<{ data: MarketDay[] }>('/market/history', { item_id: itemId, server, type }, 3600)
  return body.data
    .map((d) => ({
      date: d.date,
      avg_price: Math.round(Number(d.avg_price)),
      min_price: Number(d.min_price),
      max_price: Number(d.max_price),
      listings_count: Number(d.listings_count),
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
}
