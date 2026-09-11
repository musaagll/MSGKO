import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CHANNELS, type ChannelKey, type MarketListing, type PazarResponse } from '@/lib/pazar-types'

export { CHANNELS, type ChannelKey, type MarketListing, type PazarResponse }

export const dynamic = 'force-dynamic'

const VALID_CHANNELS = CHANNELS.map(c => c.key)

// ── GET /api/pazar ─────────────────────────────────────────────────────────────
// Parametreler:
//   server = zero3 | zero4 | ... (zorunlu)
//   q      = item arama (opsiyonel, min 1 karakter)
//   page   = sayfa no (default: 1)
//   sort   = price_asc | price_desc | name_asc | newest (default: price_asc)
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const rawServer = (searchParams.get('server') ?? 'zero3').toLowerCase()
  const server    = VALID_CHANNELS.includes(rawServer as ChannelKey)
    ? rawServer : 'zero3'

  const q        = (searchParams.get('q') ?? '').trim().slice(0, 100)
  const pageRaw  = parseInt(searchParams.get('page') ?? '1', 10)
  const page     = isNaN(pageRaw) || pageRaw < 1 ? 1 : pageRaw
  const PAGE_SIZE = 50

  const sortRaw = searchParams.get('sort') ?? 'price_asc'
  const sort    = ['price_asc', 'price_desc', 'name_asc', 'newest'].includes(sortRaw)
    ? sortRaw : 'price_asc'

  const supabase = await createClient()
  const offset   = (page - 1) * PAGE_SIZE

  let query = supabase
    .from('market_listings')
    .select('*', { count: 'exact' })
    .eq('server', server)

  if (q) {
    query = query.ilike('item_name', `%${q}%`)
  }

  switch (sort) {
    case 'price_asc':  query = query.order('price', { ascending: true });  break
    case 'price_desc': query = query.order('price', { ascending: false }); break
    case 'name_asc':   query = query.order('item_name', { ascending: true }); break
    case 'newest':     query = query.order('scraped_at', { ascending: false }); break
  }

  query = query.range(offset, offset + PAGE_SIZE - 1)

  const { data, count, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Son scrape zamanini al
  const { data: logData } = await supabase
    .from('market_scrape_log')
    .select('scraped_at')
    .eq('server', server)
    .order('scraped_at', { ascending: false })
    .limit(1)
    .single()

  const total      = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  // raw_data'dan img_url parse et
  const listings = ((data ?? []) as (MarketListing & { raw_data: string | null })[])
    .map((item) => {
      let img_url: string | null = null
      try {
        if (item.raw_data) {
          const raw = JSON.parse(item.raw_data)
          img_url = raw.img_url ?? null
        }
      } catch { /* ignore */ }
      return { ...item, img_url } as MarketListing
    })

  const response: PazarResponse = {
    listings,
    total,
    page,
    page_size:   PAGE_SIZE,
    total_pages: totalPages,
    server,
    last_scraped: logData?.scraped_at ?? null,
  }

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
  })
}

// ── POST /api/pazar — tüm kanalların ilan sayılarını döndürür ─────────────────
export async function POST() {
  const supabase = await createClient()
  const result: Record<string, number> = {}

  for (const ch of CHANNELS) {
    const { count } = await supabase
      .from('market_listings')
      .select('*', { count: 'exact', head: true })
      .eq('server', ch.key)
    result[ch.key] = count ?? 0
  }

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=60' },
  })
}
