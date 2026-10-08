import { NextRequest, NextResponse } from 'next/server'
import { getPriceHistory, isMarketServer, MarketError } from '@/lib/market'

/**
 * GET /api/pazar/history?item_id=379021000&server=ZERO3&type=sell
 * Son 30 günün günlük fiyat özeti — veri günde bir güncellendiği için 1 saat önbelleklenir.
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const itemId = sp.get('item_id') ?? ''
  const server = sp.get('server')
  if (!/^\d{1,12}$/.test(itemId) || !isMarketServer(server)) {
    return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
  }
  const type = sp.get('type') === 'buy' ? 'buy' : 'sell'

  try {
    const data = await getPriceHistory(itemId, server, type)
    return NextResponse.json({ data }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600' },
    })
  } catch (e) {
    const status = e instanceof MarketError ? e.status : 500
    if (!(e instanceof MarketError)) console.error('pazar history error:', e)
    return NextResponse.json({ error: 'Fiyat geçmişi alınamadı' }, { status })
  }
}
