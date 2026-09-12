import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CHANNELS, type ChannelKey, type MarketListing, type PazarResponse } from '@/lib/pazar-types'

export { CHANNELS, type ChannelKey, type MarketListing, type PazarResponse }

export const dynamic = 'force-dynamic'

const VALID_KEYS = new Set(CHANNELS.map(c => c.key))
const PAGE_SIZE  = 50

// ── raw_data parse ─────────────────────────────────────────────────────────────
function parseRaw(item: MarketListing & { raw_data?: string | null }): MarketListing {
  let img_url: string | null        = null
  let loc_x: number | null          = null
  let loc_z: number | null          = null
  let item_details: string | null   = null
  let listed_date: string | null    = null
  let original_price: number | null = null
  try {
    if (item.raw_data) {
      const r       = JSON.parse(item.raw_data)
      img_url       = r.img_url        ?? null
      loc_x         = r.loc_x          ?? null
      loc_z         = r.loc_z          ?? null
      item_details  = r.item_details   ?? null
      listed_date   = r.listed_date    ?? null
      original_price = r.original_price ?? null
    }
  } catch { /* ignore */ }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { raw_data: _, ...rest } = item as MarketListing & { raw_data?: string | null }
  return { ...rest, img_url, loc_x, loc_z, item_details, listed_date, original_price }
}

// ── GET /api/pazar ─────────────────────────────────────────────────────────────
// Parametreler:
//   server   = "zero3" | "zero3,zero4" | "all_zero" | "all" (zorunlu)
//   q        = arama (ilike)
//   page     = sayfa no, 1-based
//   sort     = price_asc | price_desc | name_asc | newest | upgrade_asc | upgrade_desc
//   upgrade  = "" | "0" | "1".."11"
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams

  // ── Server listesi çözümle ──────────────────────────────────────────────────
  const rawServer = (sp.get('server') ?? 'zero3').toLowerCase().trim()
  let serverKeys: string[]

  if (rawServer === 'all') {
    serverKeys = CHANNELS.map(c => c.key)
  } else if (rawServer.startsWith('all_')) {
    const grp = rawServer.slice(4) // "all_zero" → "zero"
    serverKeys = CHANNELS.filter(c => c.group === grp).map(c => c.key)
    if (serverKeys.length === 0) serverKeys = ['zero3']
  } else {
    // "zero3" veya "zero3,zero4,zero5"
    serverKeys = rawServer
      .split(',')
      .map(s => s.trim())
      .filter(s => VALID_KEYS.has(s as ChannelKey))
    if (serverKeys.length === 0) serverKeys = ['zero3']
  }

  // ── Diğer parametreler ──────────────────────────────────────────────────────
  const q         = (sp.get('q') ?? '').trim().slice(0, 100)
  const pageRaw   = parseInt(sp.get('page') ?? '1', 10)
  const page      = isNaN(pageRaw) || pageRaw < 1 ? 1 : pageRaw
  const offset    = (page - 1) * PAGE_SIZE

  const sortRaw   = sp.get('sort') ?? 'price_asc'
  const sort      = ['price_asc','price_desc','name_asc','newest','upgrade_asc','upgrade_desc']
    .includes(sortRaw) ? sortRaw : 'price_asc'

  const upgradeRaw   = sp.get('upgrade') ?? ''
  const upgradeLevel = upgradeRaw === ''
    ? null
    : (isNaN(parseInt(upgradeRaw, 10)) ? null : parseInt(upgradeRaw, 10))

  const supabase = await createClient()

  // ── Supabase sorgusu ────────────────────────────────────────────────────────
  let query = supabase
    .from('market_listings')
    .select('*', { count: 'exact' })

  if (serverKeys.length === 1) {
    query = query.eq('server', serverKeys[0])
  } else {
    query = query.in('server', serverKeys)
  }

  if (q) {
    query = query.ilike('item_name', `%${q}%`)
  }

  if (upgradeLevel !== null) {
    if (upgradeLevel === 0) {
      query = query.is('upgrade_level', null)
    } else {
      query = query.eq('upgrade_level', upgradeLevel)
    }
  }

  switch (sort) {
    case 'price_asc':    query = query.order('price',         { ascending: true  }); break
    case 'price_desc':   query = query.order('price',         { ascending: false }); break
    case 'name_asc':     query = query.order('item_name',     { ascending: true  }); break
    case 'newest':       query = query.order('scraped_at',    { ascending: false }); break
    case 'upgrade_asc':  query = query.order('upgrade_level', { ascending: true,  nullsFirst: false }); break
    case 'upgrade_desc': query = query.order('upgrade_level', { ascending: false, nullsFirst: false }); break
  }

  // price_asc ile sıralıyorken ikincil sıra: item_name → tutarlı sayfalama
  if (sort === 'price_asc' || sort === 'price_desc') {
    query = query.order('item_name', { ascending: true })
  }

  query = query.range(offset, offset + PAGE_SIZE - 1)

  const { data, count, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // ── Son scrape zamanı ───────────────────────────────────────────────────────
  // Birden fazla server varsa en son çekilen zamanı döndür
  const { data: logData } = await supabase
    .from('market_scrape_log')
    .select('scraped_at')
    .in('server', serverKeys)
    .order('scraped_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const total      = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const listings = ((data ?? []) as (MarketListing & { raw_data?: string | null })[])
    .map(parseRaw)

  const response: PazarResponse = {
    listings,
    total,
    page,
    page_size:      PAGE_SIZE,
    total_pages:    totalPages,
    server:         serverKeys.join(','),
    last_scraped:   logData?.scraped_at ?? null,
    upgrade_filter: upgradeLevel,
  }

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=15' },
  })
}

// ── POST /api/pazar — tüm kanalların ilan sayılarını döndürür ─────────────────
export async function POST() {
  const supabase = await createClient()
  const result: Record<string, number> = {}

  await Promise.all(
    CHANNELS.map(async ch => {
      const { count } = await supabase
        .from('market_listings')
        .select('*', { count: 'exact', head: true })
        .eq('server', ch.key)
      result[ch.key] = count ?? 0
    })
  )

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=60' },
  })
}
