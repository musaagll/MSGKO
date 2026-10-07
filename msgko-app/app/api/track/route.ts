import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, createClient } from '@/lib/supabase/server'

// Yalnızca sitenin kendi sayfa yolları kaydedilir: "/", "/boss/felankor" gibi.
const PATH_RE = /^\/[a-z0-9\-/]{0,120}$/

// Instance başına basit hız sınırı — kötüye kullanımı yavaşlatır, gerçek ziyaretçiyi etkilemez.
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 30
const hits = new Map<string, { count: number; reset: number }>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || entry.reset < now) {
    if (hits.size > 5_000) hits.clear()
    hits.set(ip, { count: 1, reset: now + WINDOW_MS })
    return false
  }
  entry.count++
  return entry.count > MAX_PER_WINDOW
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) return new NextResponse(null, { status: 429 })

  let page: unknown
  try {
    ;({ page } = await req.json())
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
  }
  if (typeof page !== 'string' || !PATH_RE.test(page) || page.startsWith('/api/')) {
    return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
  }

  try {
    // Service key varsa onu kullan; yoksa page_views'ın public insert politikasıyla anon client
    let supabase
    try {
      supabase = createServiceClient()
    } catch {
      supabase = await createClient()
    }
    const { error } = await supabase.from('page_views').insert({ page })
    if (error) {
      console.error('track insert error:', error.message)
      return NextResponse.json({ error: 'Kaydedilemedi' }, { status: 500 })
    }
    return new NextResponse(null, { status: 204 })
  } catch (e) {
    console.error('track error:', e)
    return NextResponse.json({ error: 'Hata' }, { status: 500 })
  }
}
