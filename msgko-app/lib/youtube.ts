/**
 * YouTube video fetcher
 *
 * İki ayrı RSS feed kullanır — API key gerektirmez, quota yok:
 *
 *  Videolar : channel uploads → UC{channelId_suffix}  →  UU{suffix}  playlist
 *  Shorts   : shorts playlist → UC{suffix}            →  UUSH{suffix} playlist
 *
 * Channel ID: UCGWeKVw_Yiw2a_oul5QkFbA
 *   Videos  playlist: UUGWeKVw_Yiw2a_oul5QkFbA   (UC→UU)
 *   Shorts  playlist: UUSHGWeKVw_Yiw2a_oul5QkFbA  (UC→UUSH)
 */

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID ?? 'UCGWeKVw_Yiw2a_oul5QkFbA'

// UC → UU  (tüm uploads, shorts dahil — ana sayfa kartları için)
const UPLOADS_PLAYLIST = CHANNEL_ID.replace(/^UC/, 'UU')
// UC → UUSH  (sadece shorts)
const SHORTS_PLAYLIST  = CHANNEL_ID.replace(/^UC/, 'UUSH')

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

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

function parseXmlField(entry: string, tag: string): string {
  return entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))?.[1]?.trim() ?? ''
}

/** RSS feed'inden entry listesini parse eder */
function parseRss(xml: string, isShort: boolean): YTVideo[] {
  return xml
    .split('<entry>')
    .slice(1)
    .map((entry): YTVideo | null => {
      const id = parseXmlField(entry, 'yt:videoId')
      if (!id) return null

      const title = decodeHtml(parseXmlField(entry, 'title'))
      if (!title) return null

      const thumbMatch = entry.match(/media:thumbnail[^>]+url="([^"]+)"/)
      const thumbnail  = thumbMatch?.[1] ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

      const publishedAt = parseXmlField(entry, 'published')

      const viewsMatch = entry.match(/media:statistics[^>]+views="(\d+)"/)
      const views = parseInt(viewsMatch?.[1] ?? '0')

      return {
        id,
        title,
        thumbnail,
        duration: '',
        durationFormatted: '',
        publishedAt,
        views,
        youtubeUrl: isShort
          ? `https://www.youtube.com/shorts/${id}`
          : `https://www.youtube.com/watch?v=${id}`,
        isShort,
      }
    })
    .filter((v): v is YTVideo => v !== null)
}

async function fetchRss(playlistId: string, revalidate?: number): Promise<string> {
  const url = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`
  const opts: RequestInit = revalidate != null
    ? { next: { revalidate } }
    : { cache: 'no-store' }

  const res = await fetch(url, opts)
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status} for ${playlistId}`)
  return res.text()
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Ana sayfa için: sadece normal videolar (shorts hariç).
 * Uploads playlist'ten çeker, UUSH filtrelemesi ile shorts çıkarır.
 */
export async function getYoutubeVideos(limit = 4): Promise<YTVideo[]> {
  try {
    // Uploads playlist shorts içerir — bu nedenle ayrıca shorts'ları al ve çıkar
    const [uploadsXml, shortsXml] = await Promise.allSettled([
      fetchRss(UPLOADS_PLAYLIST, 3600),
      fetchRss(SHORTS_PLAYLIST,  3600),
    ])

    if (uploadsXml.status === 'rejected') return []

    const uploads = parseRss(uploadsXml.value, false)

    // Shorts ID'lerini bir set'e al
    const shortIds = new Set(
      shortsXml.status === 'fulfilled'
        ? parseRss(shortsXml.value, true).map((v) => v.id)
        : []
    )

    // Shorts'ları filtrele, sadece normal videolar al
    return uploads
      .filter((v) => !shortIds.has(v.id))
      .slice(0, limit)
  } catch (err) {
    console.error('getYoutubeVideos error:', err)
    return []
  }
}

/**
 * YouTube panel için: videolar ve shorts ayrı ayrı.
 */
export async function getYoutubeVideosAndShorts(maxEach = 30): Promise<{
  videos: YTVideo[]
  shorts: YTVideo[]
}> {
  try {
    const [uploadsXml, shortsXml] = await Promise.allSettled([
      fetchRss(UPLOADS_PLAYLIST),
      fetchRss(SHORTS_PLAYLIST),
    ])

    // Shorts ID set'i
    const shortsRaw = shortsXml.status === 'fulfilled'
      ? parseRss(shortsXml.value, true)
      : []
    const shortIds = new Set(shortsRaw.map((v) => v.id))

    // Uploads'dan shorts'ları çıkar
    const uploadsRaw = uploadsXml.status === 'fulfilled'
      ? parseRss(uploadsXml.value, false)
      : []
    const videosOnly = uploadsRaw.filter((v) => !shortIds.has(v.id))

    return {
      videos: videosOnly.slice(0, maxEach),
      shorts: shortsRaw.slice(0, maxEach),
    }
  } catch (err) {
    console.error('getYoutubeVideosAndShorts error:', err)
    return { videos: [], shorts: [] }
  }
}
