import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const supabase = createServiceClient()

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  // Her sorguyu ayrı ayrı çalıştır — biri başarısız olsa diğerleri etkilenmesin
  const [
    wallpapersRes,
    videosRes,
    totalViewsRes,
    todayViewsRes,
    weekViewsRes,
    monthViewsRes,
    wallpaperStatsRes,
  ] = await Promise.allSettled([
    supabase.from('wallpapers').select('id', { count: 'exact', head: true }),
    supabase.from('videos').select('id', { count: 'exact', head: true }),
    supabase.from('page_views').select('id', { count: 'exact', head: true }),
    supabase.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
    supabase.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', weekStart),
    supabase.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', monthStart),
    supabase.from('wallpapers').select('id, label, click_count, download_count').order('download_count', { ascending: false }),
  ])

  const wallpaperCount = wallpapersRes.status === 'fulfilled' ? (wallpapersRes.value.count ?? 0) : 0
  const videoCount = videosRes.status === 'fulfilled' ? (videosRes.value.count ?? 0) : 0
  const totalViews = totalViewsRes.status === 'fulfilled' ? (totalViewsRes.value.count ?? 0) : 0
  const todayViews = todayViewsRes.status === 'fulfilled' ? (todayViewsRes.value.count ?? 0) : 0
  const weekViews = weekViewsRes.status === 'fulfilled' ? (weekViewsRes.value.count ?? 0) : 0
  const monthViews = monthViewsRes.status === 'fulfilled' ? (monthViewsRes.value.count ?? 0) : 0

  const wallpaperData = wallpaperStatsRes.status === 'fulfilled'
    ? (wallpaperStatsRes.value.data ?? [])
    : []

  const totalClicks = wallpaperData.reduce((s, w) => s + (w.click_count ?? 0), 0)
  const totalDownloads = wallpaperData.reduce((s, w) => s + (w.download_count ?? 0), 0)

  return NextResponse.json({
    wallpaperCount,
    videoCount,
    views: {
      total: totalViews,
      today: todayViews,
      week: weekViews,
      month: monthViews,
    },
    wallpaperStats: {
      totalClicks,
      totalDownloads,
      topWallpapers: wallpaperData.slice(0, 5),
    },
    lastUpdated: new Date().toISOString(),
  })
}
