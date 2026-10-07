import { NextRequest, NextResponse } from 'next/server'
import { getYoutubeVideosAndShorts } from '@/lib/youtube'

export async function GET(req: NextRequest) {
  const raw = Number.parseInt(req.nextUrl.searchParams.get('maxResults') ?? '30', 10)
  const maxResults = Number.isFinite(raw) ? Math.min(Math.max(raw, 1), 50) : 30

  try {
    const { videos, shorts } = await getYoutubeVideosAndShorts(maxResults)
    return NextResponse.json(
      { videos, shorts, total: videos.length + shorts.length },
      { headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600' } },
    )
  } catch (err) {
    console.error('YouTube API route error:', err)
    return NextResponse.json({ error: 'Videolar alınamadı' }, { status: 500 })
  }
}
