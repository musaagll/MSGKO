/**
 * YouTube Data API v3 — gerçek izlenme, tarih, süre
 * Channel: @musaagll (UCGWeKVw_Yiw2a_oul5QkFbA)
 */

const API_KEY          = process.env.YOUTUBE_API_KEY!
const CHANNEL_ID       = process.env.YOUTUBE_CHANNEL_ID ?? 'UCGWeKVw_Yiw2a_oul5QkFbA'
const UPLOADS_PLAYLIST = process.env.YOUTUBE_UPLOADS_PLAYLIST_ID ?? 'UUGWeKVw_Yiw2a_oul5QkFbA'

export interface YTVideo {
  id: string
  title: string
  thumbnail: string
  duration: string
  durationFormatted: string
  publishedAt: string
  views: number
  youtubeUrl: string
  isShort?: boolean
}

// ISO 8601 süreyi "3:45" formatına çevir
function parseDuration(iso: string): { raw: string; formatted: string } {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return { raw: iso, formatted: '' }
  const h = parseInt(match[1] ?? '0')
  const m = parseInt(match[2] ?? '0')
  const s = parseInt(match[3] ?? '0')
  if (h > 0) {
    return { raw: iso, formatted: `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` }
  }
  return { raw: iso, formatted: `${m}:${String(s).padStart(2, '0')}` }
}

// Playlist'ten video ID'lerini çek
async function fetchVideoIds(limit: number): Promise<string[]> {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=${limit}&playlistId=${UPLOADS_PLAYLIST}&key=${API_KEY}`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) return []
  const data = await res.json() as {
    items?: Array<{ contentDetails: { videoId: string } }>
  }
  return (data.items ?? []).map(item => item.contentDetails.videoId)
}

// Video detaylarını çek (izlenme, süre, tarih)
async function fetchVideoDetails(ids: string[]): Promise<YTVideo[]> {
  if (!ids.length) return []
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${ids.join(',')}&key=${API_KEY}`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) return []
  const data = await res.json() as {
    items?: Array<{
      id: string
      snippet: { title: string; publishedAt: string; thumbnails: { maxres?: { url: string }; high?: { url: string }; medium?: { url: string } } }
      statistics: { viewCount?: string }
      contentDetails: { duration: string }
    }>
  }

  return (data.items ?? []).map(item => {
    const { raw, formatted } = parseDuration(item.contentDetails.duration)
    const totalSeconds = (() => {
      const m = raw.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
      if (!m) return 999
      return (parseInt(m[1] ?? '0') * 3600) + (parseInt(m[2] ?? '0') * 60) + parseInt(m[3] ?? '0')
    })()
    const isShort = totalSeconds <= 60

    const thumbnail =
      item.snippet.thumbnails.maxres?.url ??
      item.snippet.thumbnails.high?.url ??
      item.snippet.thumbnails.medium?.url ??
      `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`

    return {
      id: item.id,
      title: item.snippet.title,
      thumbnail,
      duration: raw,
      durationFormatted: formatted,
      publishedAt: item.snippet.publishedAt,
      views: parseInt(item.statistics.viewCount ?? '0'),
      youtubeUrl: isShort
        ? `https://www.youtube.com/shorts/${item.id}`
        : `https://www.youtube.com/watch?v=${item.id}`,
      isShort,
    }
  })
}

// ─── Public API ───────────────────────────────────────────────────

/**
 * Ana sayfa: son N video (short olmayanlar önce)
 */
export async function getYoutubeVideos(limit = 4): Promise<YTVideo[]> {
  try {
    const ids = await fetchVideoIds(20)
    if (!ids.length) return []
    const videos = await fetchVideoDetails(ids)
    // Short olmayanları öne al
    const sorted = [
      ...videos.filter(v => !v.isShort),
      ...videos.filter(v => v.isShort),
    ]
    return sorted.slice(0, limit)
  } catch {
    return []
  }
}

/**
 * YouTube panel/modal: videolar ve shorts ayrı
 */
export async function getYoutubeVideosAndShorts(maxEach = 30): Promise<{
  videos: YTVideo[]
  shorts: YTVideo[]
}> {
  try {
    const ids = await fetchVideoIds(50)
    if (!ids.length) return { videos: [], shorts: [] }
    const all = await fetchVideoDetails(ids)
    return {
      videos: all.filter(v => !v.isShort).slice(0, maxEach),
      shorts: all.filter(v => v.isShort).slice(0, maxEach),
    }
  } catch {
    return { videos: [], shorts: [] }
  }
}
