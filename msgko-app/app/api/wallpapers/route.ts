import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// Public: wallpaper listesi
export async function GET() {
  const supabase = createServiceClient()
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
  try {
    const { id, type } = await req.json()
    if (!id || !['click', 'download'].includes(type)) {
      return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const col = type === 'click' ? 'click_count' : 'download_count'

    // Önce RPC dene
    const { error: rpcError } = await supabase.rpc('increment_wallpaper_stat', {
      wallpaper_id: id,
      col_name: col,
    })

    if (rpcError) {
      // RPC başarısız olursa direkt güncelle
      const { data: current } = await supabase
        .from('wallpapers')
        .select(col)
        .eq('id', id)
        .single()

      const currentVal = (current as Record<string, number> | null)?.[col] ?? 0
      await supabase
        .from('wallpapers')
        .update({ [col]: currentVal + 1 })
        .eq('id', id)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Hata' }, { status: 500 })
  }
}
