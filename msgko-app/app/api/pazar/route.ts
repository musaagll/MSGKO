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

// Tarayıcı gibi görünen ortak header'lar
const COMMON_HEADERS = {
  'X-API-Key':      API_KEY,
  'Accept':         'application/json',
  'User-Agent':     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language':'tr-TR,tr;q=0.9,en;q=0.8',
  'Referer':        'https://www.enucuzgb.com/',
  'Origin':         'https://www.enucuzgb.com',
}

export async function GET(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ success: false, error: 'API_KEY_MISSING' }, { status: 500 })
  }

  // Geçici debug — key'in ilk 8 karakterini göster
  if (req.nextUrl.searchParams.get('debug') === '1') {
    return NextResponse.json({
      key_length: API_KEY.length,
      key_prefix: API_KEY.substring(0, 8),
      key_suffix: API_KEY.substring(API_KEY.length - 4),
    })
  }

  const sp     = req.nextUrl.searchParams
  const server = (sp.get('server') ?? 'ZERO3').toUpperCase()
  const type   = sp.get('type')   ?? 'sell'
  const query  = sp.get('query')  ?? ''
  const page   = Math.max(1, parseInt(sp.get('page')  ?? '1',  10))
  const limit  = Math.min(50, Math.max(10, parseInt(sp.get('limit') ?? '50', 10)))
  const sort   = sp.get('sort')   ?? 'price_asc'

  const sortMap: Record<string, string> = {
    price_asc: 'price_asc', price_desc: 'price_desc', time_desc: 'time_desc',
  }

  const params = new URLSearchParams({
    server, type,
    page:  String(page),
    limit: String(limit),
    sort:  sortMap[sort] ?? 'price_asc',
  })
  if (query.trim()) params.set('query', query.trim())

  try {
    const res = await fetch(`${BASE}/market/live?${params}`, {
      headers: COMMON_HEADERS,
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
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function POST() {
  if (!API_KEY) return NextResponse.json({})

  const counts: Record<string, number> = {}
  await Promise.allSettled(
    SERVERS.map(async s => {
      try {
        const res = await fetch(
          `${BASE}/market/live?server=${s.key}&type=sell&limit=1`,
          { headers: COMMON_HEADERS, cache: 'no-store' }
        )
        if (res.ok) {
          const j = await res.json()
          if (j.success) counts[s.key] = j.meta?.total ?? 0
        }
      } catch { /* ignore */ }
    })
  )

  return NextResponse.json(counts)
}
