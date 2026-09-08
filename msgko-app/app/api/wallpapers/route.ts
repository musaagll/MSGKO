import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

// Public: wallpaper listesi
export async function GET() {
  // Wallpaper bucket public olduğu için anon client yeterli
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('wallpapers')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Wallpaper fetch error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data ?? [], {
    headers: {
      // Supabase pause/resume sonrası stale cache sorunu yaşamamak için
      // kısa TTL kullan
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}

// Tıklama veya indirme sayacı artır
export async function POST(req: NextRequest) {
  try {
    const { id, type } = await req.json()
    if (!id || !['click', 'download'].includes(type)) {
      return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
    }

    // Service key varsa kullan, yoksa anon client ile dene
    let supabase
    try {
      supabase = createServiceClient()
    } catch {
      supabase = await createClient()
    }

    const col = type === 'click' ? 'click_count' : 'download_count'

    // RPC dene
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
