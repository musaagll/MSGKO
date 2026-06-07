const API_KEY = process.env.YOUTUBE_API_KEY
const UPLOADS_PLAYLIST_ID = process.env.YOUTUBE_UPLOADS_PLAYLIST_ID

export interface YTVideo {
  id: string
  title: string
  thumbnail: string
  duration: string
  durationFormatted: string
  publishedAt: string
  views: number
  youtubeUrl: string
}

function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return ''
  const h = parseInt(match[1] || '0')
  const m = parseInt(match[2] || '0')
  const s = parseInt(match[3] || '0')
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function isShort(duration: string): boolean {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return false
  const h = parseInt(match[1] || '0')
  const m = parseInt(match[2] || '0')
  const s = parseInt(match[3] || '0')
  return h * 3600 + m * 60 + s <= 60
}

interface RawPlaylistItem {
  snippet: { resourceId: { videoId: string } }
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

export async function getYoutubeVideos(limit = 4): Promise<YTVideo[]> {
  if (!API_KEY || !UPLOADS_PLAYLIST_ID) return []

  try {
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=50&key=${API_KEY}`,
      { cache: 'no-store' }
    )

    if (!playlistRes.ok) {
      console.error('YouTube playlist API error:', playlistRes.status)
      return []
    }

    const playlistData = await playlistRes.json()
    if (!playlistData.items?.length) return []

    const videoIds = (playlistData.items as RawPlaylistItem[])
      .map((item) => item.snippet.resourceId.videoId)
      .join(',')

    const detailsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,status&id=${videoIds}&key=${API_KEY}`,
      { cache: 'no-store' }
    )

    if (!detailsRes.ok) {
      console.error('YouTube videos API error:', detailsRes.status)
      return []
    }

    const detailsData = await detailsRes.json()

    return ((detailsData.items ?? []) as RawVideo[])
      .filter(
        (v) =>
          v.status.privacyStatus === 'public' &&
          v.status.uploadStatus === 'processed' &&
          !isShort(v.contentDetails.duration)
      )
      .slice(0, limit)
      .map((v) => ({
        id: v.id,
        title: v.snippet.title,
        thumbnail:
          v.snippet.thumbnails.maxres?.url ||
          v.snippet.thumbnails.high?.url ||
          v.snippet.thumbnails.medium?.url ||
          '',
        duration: v.contentDetails.duration,
        durationFormatted: formatDuration(v.contentDetails.duration),
        publishedAt: v.snippet.publishedAt,
        views: parseInt(v.statistics.viewCount ?? '0'),
        youtubeUrl: `https://www.youtube.com/watch?v=${v.id}`,
      }))
  } catch (err) {
    console.error('getYoutubeVideos error:', err)
    return []
  }
}
