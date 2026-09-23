import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CHANNELS, type ChannelKey, type MarketListing, type PazarResponse } from '@/lib/pazar-types'

export { CHANNELS, type ChannelKey, type MarketListing, type PazarResponse }

export const dynamic = 'force-dynamic'

const VALID_KEYS = new Set(CHANNELS.map(c => c.key))
const PAGE_SIZE  = 50

// ÔöÇÔöÇ raw_data parse ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
function parseRaw(item: MarketListing & { raw_data?: string | null }): MarketListing {
  let img_url: string | null        = null
  let loc_x: number | null          = null
  let loc_z: number | null          = null
  let item_details: string | null   = null
  let listed_date: string | null    = null
  let original_price: number | null = null
  try {
    if (item.raw_data) {
      const r        = JSON.parse(item.raw_data)
      img_url        = r.img_url         ?? null
      loc_x          = r.loc_x           ?? null
      loc_z          = r.loc_z           ?? null
      item_details   = r.item_details    ?? null
      listed_date    = r.listed_date     ?? null
      original_price = r.original_price  ?? null
    }
  } catch { /* ignore */ }
  const { raw_data: _, ...rest } = item as MarketListing & { raw_data?: string | null }
  return { ...rest, img_url, loc_x, loc_z, item_details, listed_date, original_price }
}

// ÔöÇÔöÇ GET /api/pazar ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams

  // ÔöÇÔöÇ Server ├ğ├Âz├╝mle ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  const rawServer = (sp.get('server') ?? 'zero3').toLowerCase().trim()
  let serverParam: string

  if (rawServer === 'all') {
    serverParam = 'all'
  } else if (rawServer.startsWith('all_')) {
    serverParam = rawServer  // e.g. "all_zero"
  } else {
    // tekil veya virg├╝ll├╝ ÔÇö tekil ise do─şrula
    const keys = rawServer.split(',').map(s => s.trim()).filter(s => VALID_KEYS.has(s as ChannelKey))
    serverParam = keys.length ? keys[0] : 'zero3'  // RPC tek server al─▒yor
  }

  const q         = (sp.get('q') ?? '').trim().slice(0, 100)
  const pageRaw   = parseInt(sp.get('page') ?? '1', 10)
  const page      = isNaN(pageRaw) || pageRaw < 1 ? 1 : pageRaw
  const offset    = (page - 1) * PAGE_SIZE

  const sortRaw = sp.get('sort') ?? 'price_asc'
  const sort    = ['price_asc','price_desc','name_asc','newest','upgrade_asc','upgrade_desc']
    .includes(sortRaw) ? sortRaw : 'price_asc'

  const upgradeRaw   = sp.get('upgrade') ?? ''
  const upgradeLevel = upgradeRaw === '' ? -1
    : (isNaN(parseInt(upgradeRaw, 10)) ? -1 : parseInt(upgradeRaw, 10))

  const supabase = await createClient()

  // ÔöÇÔöÇ RPC ├ğa─şr─▒s─▒ ÔÇö limit yok, gruplama DB taraf─▒nda ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc('get_market_listings', {
    p_server:  serverParam,
    p_q:       q || null,
    p_sort:    sort,
    p_upgrade: upgradeLevel,
    p_limit:   PAGE_SIZE,
    p_offset:  offset,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // ÔöÇÔöÇ Toplam say─▒ (count RPC) ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: countData } = await (supabase as any).rpc('get_market_listings_count', {
    p_server:  serverParam,
    p_q:       q || null,
    p_upgrade: upgradeLevel,
  })

  // ÔöÇÔöÇ Son scrape zaman─▒ ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  const serverKeys = serverParam === 'all'
    ? CHANNELS.map(c => c.key)
    : serverParam.startsWith('all_')
      ? CHANNELS.filter(c => c.group === serverParam.slice(4)).map(c => c.key)
      : [serverParam]

  const { data: logData } = await supabase
    .from('market_scrape_log')
    .select('scraped_at')
    .in('server', serverKeys)
    .order('scraped_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const total      = (countData as number) ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const listings = ((data ?? []) as (MarketListing & { raw_data?: string | null })[])
    .map(parseRaw)

  const response: PazarResponse = {
    listings,
    total,
    page,
    page_size:      PAGE_SIZE,
    total_pages:    totalPages,
    server:         serverParam,
    last_scraped:   logData?.scraped_at ?? null,
    upgrade_filter: upgradeLevel === -1 ? null : upgradeLevel,
  }

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=15' },
  })
}

// ÔöÇÔöÇ POST ÔÇö t├╝m kanallar─▒n ilan say─▒lar─▒ ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
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
