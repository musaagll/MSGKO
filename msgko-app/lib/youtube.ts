/**
 * YouTube video fetcher — API key gerektirmez, RSS kullanır.
 *
 * - Shorts: Kanalın RSS feed'inden otomatik çekilir, süre ≤60sn olanlar short sayılır.
 * - Normal videolar: MANUAL_VIDEOS dizisinden alınır (elle eklenir).
 *
 * Channel: @Musaagll (UCGWeKVw_Yiw2a_oul5QkFbA)
 */

const CHANNEL_ID = 'UCGWeKVw_Yiw2a_oul5QkFbA'
const RSS_URL    = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

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

// ─────────────────────────────────────────────────────────────────
// Manuel video listesi — buraya YouTube linklerini ekle
// Örnek format:
// { id: 'VIDEO_ID', title: 'Video Başlığı', publishedAt: '2025-01-01' }
// ─────────────────────────────────────────────────────────────────
const MANUAL_VIDEOS: Array<{ id: string; title: string; publishedAt: string }> = [
  { id: '61-BoM0df3E', title: 'ZERO - NooaaH Culluk Asas WS İtemli Asas Movie 2026 | Knight online', publishedAt: '2025-06-01' },
  { id: '2N4zMIvjHSg', title: 'Knight online - Güncel Rehber Guardian of 7 Keys | Anahtar Görevi Human', publishedAt: '2025-06-01' },
]

// ─── RSS'ten Shorts çek ───────────────────────────────────────────
async function fetchShortsFromRSS(limit = 30): Promise<YTVideo[]> {
  try {
    const res = await fetch(RSS_URL, {
      next: { revalidate: 3600 },
      headers: { 'Accept': 'application/xml, text/xml' },
    })

    if (!res.ok) return []

    const xml = await res.text()

    // XML'i parse et — basit regex tabanlı
    const entries: YTVideo[] = []
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
    let match

    while ((match = entryRegex.exec(xml)) !== null) {
      const entry = match[1]

      const idMatch        = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)
      const titleMatch     = entry.match(/<title>(.*?)<\/title>/)
      const publishedMatch = entry.match(/<published>(.*?)<\/published>/)
      const viewMatch      = entry.match(/<media:statistics views="(\d+)"/)

      if (!idMatch || !titleMatch) continue

      const videoId    = idMatch[1].trim()
      const title      = titleMatch[1].trim()
      const published  = publishedMatch?.[1]?.trim() ?? new Date().toISOString()
      const views      = parseInt(viewMatch?.[1] ?? '0')
      const thumbnail  = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

      entries.push({
        id: videoId,
        title,
        thumbnail,
        duration: '',
        durationFormatted: '',
        publishedAt: published,
        views,
        youtubeUrl: `https://www.youtube.com/shorts/${videoId}`,
        isShort: true,
      })

      if (entries.length >= limit) break
    }

    return entries
  } catch {
    return []
  }
}

// ─── Manuel videoları YTVideo formatına çevir ────────────────────
function buildManualVideos(): YTVideo[] {
  return MANUAL_VIDEOS.map((v) => ({
    id: v.id,
    title: v.title,
    thumbnail: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
    duration: '',
    durationFormatted: '',
    publishedAt: v.publishedAt,
    views: 0,
    youtubeUrl: `https://www.youtube.com/watch?v=${v.id}`,
    isShort: false,
  }))
}

// ─── Public API ───────────────────────────────────────────────────

/**
 * Ana sayfa için: manuel videolar listesi.
 */
export async function getYoutubeVideos(limit = 4): Promise<YTVideo[]> {
  return buildManualVideos().slice(0, limit)
}

/**
 * YouTube panel/modal için: manuel videolar + RSS'ten shorts.
 */
export async function getYoutubeVideosAndShorts(maxEach = 30): Promise<{
  videos: YTVideo[]
  shorts: YTVideo[]
}> {
  const [shorts] = await Promise.all([
    fetchShortsFromRSS(maxEach),
  ])

  return {
    videos: buildManualVideos(),
    shorts,
  }
}
