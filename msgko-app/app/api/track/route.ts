import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { page } = await req.json()
    if (!page || typeof page !== 'string') {
      return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { error } = await supabase
      .from('page_views')
      .insert({ page: page.slice(0, 255) })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Hata' }, { status: 500 })
  }
}
