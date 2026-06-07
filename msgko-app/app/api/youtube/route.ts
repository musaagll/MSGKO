import { NextRequest, NextResponse } from 'next/server'

const API_KEY = process.env.YOUTUBE_API_KEY
const UPLOADS_PLAYLIST_ID = process.env.YOUTUBE_UPLOADS_PLAYLIST_ID

function isShort(duration: string): boolean {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return false
  const h = parseInt(match[1] || '0')
  const m = parseInt(match[2] || '0')
  const s = parseInt(match[3] || '0')
  return h * 3600 + m * 60 + s <= 60
}

interface RawVideo {
  id: string
  status: { privacyStatus: string; uploadStatus: string }
  snippet: {
    title: string
    thumbnails: {
      maxres?: { url: string }
      high?: { url: string }
      medium?: { url: string }
    }
    publishedAt: string
  }
  contentDetails: { duration: string }
  statistics: { viewCount?: string }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const maxResults = parseInt(searchParams.get('maxResults') ?? '30')

  if (!API_KEY || !UPLOADS_PLAYLIST_ID) {
    return NextResponse.json({ error: 'API key veya playlist ID eksik' }, { status: 500 })
  }

  try {
    // 1. Uploads playlist'ten video ID'lerini al
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=50&key=${API_KEY}`,
      { cache: 'no-store' }
    )
    const playlistData = await playlistRes.json()

    if (!playlistData.items?.length) {
      return NextResponse.json({ videos: [], shorts: [] })
    }

    const videoIds = playlistData.items
      .map((item: { snippet: { resourceId: { videoId: string } } }) =>
        item.snippet.resourceId.videoId
      )
      .join(',')

    // 2. Detayları al — status dahil (public/private filtresi için)
    const detailsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,status&id=${videoIds}&key=${API_KEY}`,
      { cache: 'no-store' }
    )
    const detailsData = await detailsRes.json()

    const allVideos = (detailsData.items ?? [] as RawVideo[])
      // Sadece herkese açık ve işlenmiş videoları göster
      .filter((v: RawVideo) =>
        v.status.privacyStatus === 'public' &&
        v.status.uploadStatus === 'processed'
      )
      .map((v: RawVideo) => ({
        id: v.id,
        title: v.snippet.title,
        thumbnail:
          v.snippet.thumbnails.maxres?.url ||
          v.snippet.thumbnails.high?.url ||
          v.snippet.thumbnails.medium?.url || '',
        duration: v.contentDetails.duration,
        publishedAt: v.snippet.publishedAt,
        views: parseInt(v.statistics.viewCount ?? '0'),
        youtubeUrl: `https://www.youtube.com/watch?v=${v.id}`,
        isShort: isShort(v.contentDetails.duration),
      }))

    const videos = allVideos.filter((v: { isShort: boolean }) => !v.isShort).slice(0, maxResults)
    const shorts = allVideos.filter((v: { isShort: boolean }) => v.isShort).slice(0, maxResults)

    return NextResponse.json({ videos, shorts, total: allVideos.length })
  } catch (err) {
    console.error('YouTube API error:', err)
    return NextResponse.json({ error: 'API hatası' }, { status: 500 })
  }
}
