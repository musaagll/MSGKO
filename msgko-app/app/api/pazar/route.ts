import { NextRequest, NextResponse } from 'next/server'
import { getLiveListings, isMarketServer, MARKET_SORTS, MarketError, type MarketSort } from '@/lib/market'

/**
 * GET /api/pazar?server=ZERO3&type=sell&sort=price_asc&page=1&q=raptor
 * EnUcuzGB canlı pazar ilanları — anahtar sunucuda kalır, yanıt CDN'de 45 sn önbelleklenir.
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const server = sp.get('server')
  if (!isMarketServer(server)) {
    return NextResponse.json({ error: 'Geçersiz sunucu' }, { status: 400 })
  }
  const type = sp.get('type') === 'buy' ? 'buy' : 'sell'
  const sortParam = sp.get('sort') as MarketSort | null
  const sort = sortParam && MARKET_SORTS.includes(sortParam) ? sortParam : 'price_asc'
  const page = Math.min(Math.max(parseInt(sp.get('page') ?? '1', 10) || 1, 1), 200)
  const query = (sp.get('q') ?? '').trim().slice(0, 40) || undefined

  try {
    const result = await getLiveListings({ server, type, sort, page, query })
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, s-maxage=45, stale-while-revalidate=30' },
    })
  } catch (e) {
    const status = e instanceof MarketError ? e.status : 500
    const message = e instanceof MarketError ? e.message : 'Pazar verisi alınamadı'
    if (!(e instanceof MarketError)) console.error('pazar error:', e)
    return NextResponse.json({ error: message }, { status })
  }
}
