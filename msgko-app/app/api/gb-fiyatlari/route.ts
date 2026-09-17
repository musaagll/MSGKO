import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Proxy — ucuzagb.com API'lerine CORS sorunu olmadan erişim
 *
 * GET /api/gb-fiyatlari          → tüm site fiyatları (detay sayfası)
 * GET /api/gb-fiyatlari?kuru=1   → özet kur (navbar widget)
 * GET /api/gb-fiyatlari?etkinlik=1 → etkinlik takvimi
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams

  try {
    let upstream: string
    let transform: (d: unknown) => unknown

    if (sp.has('kuru')) {
      upstream  = 'https://ucuzagb.com/api/gb-kuru?game=ko'
      transform = d => d
    } else if (sp.has('etkinlik')) {
      upstream  = 'https://ucuzagb.com/api/etkinlikler'
      transform = d => d
    } else {
      upstream  = 'https://ucuzagb.com/api/prices'
      transform = (d: unknown) => {
        const data = d as Record<string, { sites?: unknown; updatedAt?: string }>
        return { sites: data?.ko?.sites ?? {}, updatedAt: data?.ko?.updatedAt ?? null }
      }
    }

    const r = await fetch(upstream, {
      next: { revalidate: 300 },
      headers: { 'Accept': 'application/json', 'User-Agent': 'MSGKO/1.0' },
    })

    if (!r.ok) {
      return NextResponse.json({ error: `upstream ${r.status}` }, { status: 502 })
    }

    const data = await r.json()
    return NextResponse.json(transform(data), {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
