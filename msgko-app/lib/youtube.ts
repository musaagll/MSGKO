/**
 * YouTube video fetcher — RSS feed tabanlı (API key gerektirmez, quota yok)
 *
 * YouTube her kanal için ücretsiz RSS feed sağlar:
 * https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID
 *
 * Shorts tespiti: süre 60 saniye veya altı
 */

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID ?? 'UCGWeKVw_Yiw2a_oul5QkFbA'

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

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function parseXmlText(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
  return xml.match(re)?.[1]?.trim() ?? ''
}

function extractVideoId(url: string): string {
  return url.split('v=')[1]?.split('&')[0] ?? url.split('/').pop() ?? ''
}

/**
 * YouTube RSS feed'inden video listesi çeker.
 * Shorts (≤60s) ve uzun videolar ayrı döner.
 * RSS'de süre bilgisi olmadığından tüm videolar "video" olarak döner.
 */
export async function getYoutubeVideos(limit = 4): Promise<YTVideo[]> {
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

    const res = await fetch(rssUrl, {
      next: { revalidate: 3600 }, // 1 saatte bir yenile
      headers: { 'Accept': 'application/xml, text/xml, */*' },
    })

    if (!res.ok) {
      console.error('YouTube RSS error:', res.status, res.statusText)
      return []
    }

    const xml = await res.text()

    // <entry> bloklarını parse et
    const entries = xml.split('<entry>').slice(1)

    const videos: YTVideo[] = entries.slice(0, limit).map((entry) => {
      // video ID
      const videoIdRaw = parseXmlText(entry, 'yt:videoId')
      const linkMatch = entry.match(/href="([^"]+)"/)
      const videoId = videoIdRaw || extractVideoId(linkMatch?.[1] ?? '')

      // title
      const title = parseXmlText(entry, 'title')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")

      // thumbnail — media:thumbnail url=""
      const thumbMatch = entry.match(/media:thumbnail[^>]+url="([^"]+)"/)
      const thumbnail = thumbMatch?.[1] ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

      // published date
      const publishedAt = parseXmlText(entry, 'published')

      // views — media:statistics views=""
      const viewsMatch = entry.match(/media:statistics[^>]+views="(\d+)"/)
      const views = parseInt(viewsMatch?.[1] ?? '0')

      return {
        id: videoId,
        title,
        thumbnail,
        duration: '',
        durationFormatted: '',
        publishedAt,
        views,
        youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
      }
    })

    return videos.filter((v) => v.id && v.title)
  } catch (err) {
    console.error('getYoutubeVideos error:', err)
    return []
  }
}

/**
 * API route için — hem videolar hem shorts döner.
 * RSS'de süre olmadığından tüm içerikler video olarak işlenir.
 */
export async function getYoutubeVideosAndShorts(limit = 30): Promise<{
  videos: YTVideo[]
  shorts: YTVideo[]
}> {
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

    const res = await fetch(rssUrl, {
      cache: 'no-store',
      headers: { 'Accept': 'application/xml, text/xml, */*' },
    })

    if (!res.ok) {
      console.error('YouTube RSS error:', res.status)
      return { videos: [], shorts: [] }
    }

    const xml = await res.text()
    const entries = xml.split('<entry>').slice(1)

    const all: YTVideo[] = entries.slice(0, limit).map((entry) => {
      const videoId = parseXmlText(entry, 'yt:videoId')
      const title = parseXmlText(entry, 'title')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
      const thumbMatch = entry.match(/media:thumbnail[^>]+url="([^"]+)"/)
      const thumbnail = thumbMatch?.[1] ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      const publishedAt = parseXmlText(entry, 'published')
      const viewsMatch = entry.match(/media:statistics[^>]+views="(\d+)"/)
      const views = parseInt(viewsMatch?.[1] ?? '0')

      return {
        id: videoId,
        title,
        thumbnail,
        duration: '',
        durationFormatted: '',
        publishedAt,
        views,
        youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
      }
    }).filter((v) => v.id && v.title)

    // RSS'de süre yok → hepsini "video" olarak döndür, shorts boş
    return { videos: all, shorts: [] }
  } catch (err) {
    console.error('getYoutubeVideosAndShorts error:', err)
    return { videos: [], shorts: [] }
  }
}
