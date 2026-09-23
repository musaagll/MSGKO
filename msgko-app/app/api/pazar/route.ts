import { NextRequest, NextResponse } from 'next/server'

const BASE    = 'https://www.enucuzgb.com/api/v2'
const API_KEY = process.env.ENUCUZGB_API_KEY ?? ''

export const SERVERS = [
  { key: 'ZERO3',   label: 'Zero3'   },
  { key: 'ZERO4',   label: 'Zero4'   },
  { key: 'ZERO5',   label: 'Zero5'   },
  { key: 'DESTAN2', label: 'Destan2' },
  { key: 'OREADS2', label: 'Oreads2' },
]

export async function GET(req: NextRequest) {
  // API key kontrolü — eksikse hata döndür
  if (!API_KEY) {
    return NextResponse.json(
      { success: false, error: 'API_KEY_MISSING', debug: 'ENUCUZGB_API_KEY env variable is not set' },
      { status: 500 }
    )
  }

  const sp     = req.nextUrl.searchParams
  const server = (sp.get('server') ?? 'ZERO3').toUpperCase()
  const type   = sp.get('type')  ?? 'sell'
  const query  = sp.get('query') ?? ''
  const page   = Math.max(1, parseInt(sp.get('page') ?? '1', 10))
  const limit  = Math.min(50, Math.max(10, parseInt(sp.get('limit') ?? '50', 10)))
  const sort   = sp.get('sort')  ?? 'price_asc'

  const sortMap: Record<string, string> = {
    price_asc:  'price_asc',
    price_desc: 'price_desc',
    time_desc:  'time_desc',
  }
  const apiSort = sortMap[sort] ?? 'price_asc'

  const params = new URLSearchParams({
    server, type,
    page:  String(page),
    limit: String(limit),
    sort:  apiSort,
  })
  if (query.trim()) params.set('query', query.trim())

  try {
    const res = await fetch(`${BASE}/market/live?${params}`, {
      headers: { 'X-API-Key': API_KEY, Accept: 'application/json' },
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return NextResponse.json(
        { success: false, error: body?.error?.message ?? `HTTP ${res.status}`, status: res.status },
        { status: res.status }
      )
    }

    const json = await res.json()
    return NextResponse.json(json, {
      headers: { 'Cache-Control': 'no-store, no-cache' },
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    )
  }
}

export async function POST() {
  if (!API_KEY) {
    return NextResponse.json({}, { status: 200 })
  }

  const counts: Record<string, number> = {}
  await Promise.allSettled(
    SERVERS.map(async s => {
      const res = await fetch(
        `${BASE}/market/live?server=${s.key}&type=sell&limit=1`,
        { headers: { 'X-API-Key': API_KEY, Accept: 'application/json' }, cache: 'no-store' }
      )
      if (res.ok) {
        const j = await res.json()
        if (j.success) counts[s.key] = j.meta?.total ?? 0
      }
    })
  )

  return NextResponse.json(counts)
}
