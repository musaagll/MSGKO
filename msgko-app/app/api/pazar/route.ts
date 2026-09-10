import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// ── Sunucu listesi ─────────────────────────────────────────────────────────────
const VALID_SERVERS = ['zero', 'destan', 'pandora', 'agartha'] as const
type Server = (typeof VALID_SERVERS)[number]

export interface MarketListing {
  id: number
  server: Server
  item_name: string
  item_count: number
  upgrade_level: number | null
  price: number
  price_per_unit: number | null
  seller_name: string | null
  scraped_at: string
  // raw_data'dan parse edilen item görseli
  img_url?: string | null
}

export interface ScrapeStatus {
  server: string
  status: string
  items_count: number
  scraped_at: string
}

export interface PazarResponse {
  listings: MarketListing[]
  total: number
  page: number
  page_size: number
  total_pages: number
  server: string
  last_scraped: string | null
  scrape_status: ScrapeStatus | null
}

// ── GET /api/pazar ─────────────────────────────────────────────────────────────
// Parametreler:
//   server  = zero | destan | pandora | agartha  (zorunlu)
//   q       = item arama (opsiyonel)
//   page    = sayfa no, 1'den başlar (opsiyonel, default: 1)
//   sort    = price_asc | price_desc | name_asc | newest (default: price_asc)
//   upgrade = 0-9 | null filtresi (opsiyonel)
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  // ── Parametre validasyonu ──────────────────────────────────────────────────
  const rawServer = (searchParams.get('server') ?? 'zero').toLowerCase()
  const server = VALID_SERVERS.includes(rawServer as Server) ? (rawServer as Server) : 'zero'

  const q         = (searchParams.get('q') ?? '').trim().slice(0, 100)
  const pageRaw   = parseInt(searchParams.get('page') ?? '1', 10)
  const page      = isNaN(pageRaw) || pageRaw < 1 ? 1 : pageRaw
  const PAGE_SIZE = 50

  const sortRaw = searchParams.get('sort') ?? 'price_asc'
  const sort    = ['price_asc', 'price_desc', 'name_asc', 'newest'].includes(sortRaw)
    ? sortRaw
    : 'price_asc'

  const upgradeRaw = searchParams.get('upgrade')
  const upgradeFilter = upgradeRaw === '' || upgradeRaw === null
    ? null
    : parseInt(upgradeRaw, 10)

  // ── Supabase sorgusu ───────────────────────────────────────────────────────
  const supabase = await createClient()
  const offset   = (page - 1) * PAGE_SIZE

  let query = supabase
    .from('market_listings')
    .select('*', { count: 'exact' })
    .eq('server', server)

  // Arama filtresi
  if (q) {
    query = query.ilike('item_name', `%${q}%`)
  }

  // Upgrade level filtresi
  if (upgradeFilter !== null && !isNaN(upgradeFilter)) {
    query = query.eq('upgrade_level', upgradeFilter)
  }

  // Sıralama
  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'name_asc':
      query = query.order('item_name', { ascending: true })
      break
    case 'newest':
      query = query.order('scraped_at', { ascending: false })
      break
  }

  // Sayfalama
  query = query.range(offset, offset + PAGE_SIZE - 1)

  const { data, count, error } = await query

  if (error) {
    console.error('Pazar API hatası:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // ── Son scrape durumunu çek ────────────────────────────────────────────────
  const { data: logData } = await supabase
    .from('market_scrape_log')
    .select('server, status, items_count, scraped_at')
    .eq('server', server)
    .order('scraped_at', { ascending: false })
    .limit(1)
    .single()

  const total      = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const response: PazarResponse = {
    listings: ((data ?? []) as (MarketListing & { raw_data: string | null })[]).map((item) => {
      let img_url: string | null = null
      try {
        if (item.raw_data) {
          const raw = JSON.parse(item.raw_data)
          img_url = raw.img_url ?? null
        }
      } catch { /* raw_data parse hatası — önemli değil */ }
      return { ...item, img_url } as MarketListing
    }),
    total,
    page,
    page_size:     PAGE_SIZE,
    total_pages:   totalPages,
    server,
    last_scraped:  logData?.scraped_at ?? null,
    scrape_status: logData ?? null,
  }

  return NextResponse.json(response, {
    headers: {
      // 5 dakika CDN/browser cache, arka planda yenileme
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
    },
  })
}

// ── GET /api/pazar/stats ───────────────────────────────────────────────────────
// Tüm sunuculardaki ilan sayısı ve son güncelleme
export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const results: Record<string, { count: number; last_scraped: string | null }> = {}

  for (const server of VALID_SERVERS) {
    const { count } = await supabase
      .from('market_listings')
      .select('*', { count: 'exact', head: true })
      .eq('server', server)

    const { data: log } = await supabase
      .from('market_scrape_log')
      .select('scraped_at')
      .eq('server', server)
      .order('scraped_at', { ascending: false })
      .limit(1)
      .single()

    results[server] = {
      count:        count ?? 0,
      last_scraped: log?.scraped_at ?? null,
    }
  }

  return NextResponse.json(results, {
    headers: { 'Cache-Control': 'public, s-maxage=60' },
  })
}
