/**
 * YouTube video fetcher
 *
 * YouTube Data API v3 kullanır.
 * Sadece herkese açık (public) videolar döner — silinmiş/gizlenmiş videolar filtrelenir.
 *
 * Channel ID: UCGWeKVw_Yiw2a_oul5QkFbA  (@musaagll)
 *   Uploads playlist: UUGWeKVw_Yiw2a_oul5QkFbA
 */

const CHANNEL_ID         = process.env.YOUTUBE_CHANNEL_ID          ?? 'UCGWeKVw_Yiw2a_oul5QkFbA'
const UPLOADS_PLAYLIST   = process.env.YOUTUBE_UPLOADS_PLAYLIST_ID ?? CHANNEL_ID.replace(/^UC/, 'UU')
const API_KEY            = process.env.YOUTUBE_API_KEY              ?? ''

const YT_API = 'https://www.googleapis.com/youtube/v3'

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

// ─── ISO 8601 duration → "MM:SS" ─────────────────────────────────────────────
function formatDuration(iso: string): string {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return ''
  const h  = parseInt(m[1] ?? '0')
  const mn = parseInt(m[2] ?? '0')
  const s  = parseInt(m[3] ?? '0')

  if (h > 0) {
    return `${h}:${String(mn).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${mn}:${String(s).padStart(2, '0')}`
}

// Shorts tespiti: 60 saniye veya altı dikey video → short sayılır
function isShortDuration(iso: string): boolean {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return false
  const h  = parseInt(m[1] ?? '0')
  const mn = parseInt(m[2] ?? '0')
  const s  = parseInt(m[3] ?? '0')
  const total = h * 3600 + mn * 60 + s
  return total <= 60
}

// ─── PlaylistItems → video ID listesi ────────────────────────────────────────
async function fetchPlaylistVideoIds(
  playlistId: string,
  maxResults = 50
): Promise<string[]> {
  const ids: string[] = []
  let pageToken: string | undefined

  do {
    const params = new URLSearchParams({
      part: 'contentDetails',
      playlistId,
      maxResults: String(Math.min(maxResults - ids.length, 50)),
      key: API_KEY,
      ...(pageToken ? { pageToken } : {}),
    })

    const res = await fetch(`${YT_API}/playlistItems?${params}`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.error('playlistItems error', res.status, await res.text())
      break
    }

    const data = await res.json() as {
      nextPageToken?: string
      items?: Array<{ contentDetails: { videoId: string } }>
    }

    for (const item of data.items ?? []) {
      ids.push(item.contentDetails.videoId)
    }

    pageToken = data.nextPageToken
  } while (pageToken && ids.length < maxResults)

  return ids
}

// ─── Video ID listesi → YTVideo listesi (sadece public) ───────────────────────
async function fetchVideoDetails(ids: string[]): Promise<YTVideo[]> {
  if (!ids.length) return []

  // API 50'lik batch alır
  const batches: string[][] = []
  for (let i = 0; i < ids.length; i += 50) {
    batches.push(ids.slice(i, i + 50))
  }

  const results: YTVideo[] = []

  for (const batch of batches) {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails,statistics,status',
      id: batch.join(','),
      key: API_KEY,
    })

    const res = await fetch(`${YT_API}/videos?${params}`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.error('videos error', res.status, await res.text())
      continue
    }

    const data = await res.json() as {
      items?: Array<{
        id: string
        status:         { privacyStatus: string; uploadStatus: string }
        snippet:        { title: string; publishedAt: string; thumbnails: Record<string, { url: string }> }
        contentDetails: { duration: string }
        statistics:     { viewCount?: string }
      }>
    }

    for (const item of data.items ?? []) {
      // Sadece herkese açık ve tamamlanmış videoları al
      if (
        item.status.privacyStatus !== 'public' ||
        item.status.uploadStatus  !== 'processed'
      ) continue

      const duration  = item.contentDetails.duration
      const isShort   = isShortDuration(duration)
      const thumbnail =
        item.snippet.thumbnails?.maxres?.url  ??
        item.snippet.thumbnails?.high?.url    ??
        item.snippet.thumbnails?.medium?.url  ??
        item.snippet.thumbnails?.default?.url ??
        `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`

      results.push({
        id:                item.id,
        title:             item.snippet.title,
        thumbnail,
        duration,
        durationFormatted: formatDuration(duration),
        publishedAt:       item.snippet.publishedAt,
        views:             parseInt(item.statistics.viewCount ?? '0'),
        youtubeUrl:        isShort
          ? `https://www.youtube.com/shorts/${item.id}`
          : `https://www.youtube.com/watch?v=${item.id}`,
        isShort,
      })
    }
  }

  return results
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Ana sayfa için: sadece normal videolar (shorts hariç), herkese açık.
 */
export async function getYoutubeVideos(limit = 4): Promise<YTVideo[]> {
  try {
    // Fazladan çek; shorts ve gizliler çıkarılacak
    const ids    = await fetchPlaylistVideoIds(UPLOADS_PLAYLIST, 50)
    const all    = await fetchVideoDetails(ids)
    const videos = all.filter((v) => !v.isShort)
    return videos.slice(0, limit)
  } catch (err) {
    console.error('getYoutubeVideos error:', err)
    return []
  }
}

/**
 * YouTube panel için: videolar ve shorts ayrı ayrı, herkese açık.
 */
export async function getYoutubeVideosAndShorts(maxEach = 30): Promise<{
  videos: YTVideo[]
  shorts: YTVideo[]
}> {
  try {
    const ids = await fetchPlaylistVideoIds(UPLOADS_PLAYLIST, 50)
    const all = await fetchVideoDetails(ids)

    return {
      videos: all.filter((v) => !v.isShort).slice(0, maxEach),
      shorts: all.filter((v) =>  v.isShort).slice(0, maxEach),
    }
  } catch (err) {
    console.error('getYoutubeVideosAndShorts error:', err)
    return { videos: [], shorts: [] }
  }
}
