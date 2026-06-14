import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Public: wallpaper listesi
export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('wallpapers')
    .select('*')
    .order('id', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}

// Tıklama veya indirme sayacı artır
export async function POST(req: NextRequest) {
  const { id, type } = await req.json() // type: 'click' | 'download'
  if (!id || !['click', 'download'].includes(type)) {
    return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
  }

  const supabase = await createClient()
  const col = type === 'click' ? 'click_count' : 'download_count'

  const { error } = await supabase.rpc('increment_wallpaper_stat', {
    wallpaper_id: id,
    col_name: col,
  })

  if (error) {
    // RPC yoksa direkt güncelle
    const { data: current } = await supabase
      .from('wallpapers')
      .select(col)
      .eq('id', id)
      .single()

    await supabase
      .from('wallpapers')
      .update({ [col]: ((current as Record<string, number>)?.[col] ?? 0) + 1 })
      .eq('id', id)
  }

  return NextResponse.json({ success: true })
}
