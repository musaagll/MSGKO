import { NextRequest, NextResponse } from 'next/server'
import { getYoutubeVideosAndShorts } from '@/lib/youtube'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const maxResults = parseInt(searchParams.get('maxResults') ?? '30')

  try {
    const { videos, shorts } = await getYoutubeVideosAndShorts(maxResults)
    return NextResponse.json({ videos, shorts, total: videos.length + shorts.length })
  } catch (err) {
    console.error('YouTube API route error:', err)
    return NextResponse.json({ error: 'RSS fetch hatası' }, { status: 500 })
  }
}
