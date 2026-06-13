import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const supabase = createServiceClient()

  const [wallpapers, videos] = await Promise.all([
    supabase.from('wallpapers').select('id', { count: 'exact', head: true }),
    supabase.from('videos').select('id', { count: 'exact', head: true }),
  ])

  return NextResponse.json({
    wallpaperCount: wallpapers.count ?? 0,
    videoCount: videos.count ?? 0,
    lastUpdated: new Date().toISOString(),
  })
}
