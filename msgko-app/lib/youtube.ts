/**
 * YouTube video fetcher
 *
 * Strateji:
 * 1. RSS feed ile video listesi al (API key gerektirmez)
 * 2. Shorts tespiti için her video ID'si üzerinde YouTube oEmbed API çağır
 *    (ücretsiz, key gerektirmez) — thumbnail'in yüksekliği > genişliği ise Short
 * 3. Ek olarak başlıkta #shorts/#short tag'i ve thumbnail URL'ini kontrol et
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
  isShort?: boolean
}

function parseXmlText(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
  return xml.match(re)?.[1]?.trim() ?? ''
}

function decodeHtml(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

/**
 * RSS'deki bir entry'den raw video objesini parse eder.
 */
function parseEntry(entry: string): YTVideo | null {
  const videoId = parseXmlText(entry, 'yt:videoId')
  if (!videoId) return null

  const title = decodeHtml(parseXmlText(entry, 'title'))
  if (!title) return null

  // thumbnail — media:thumbnail width="" height="" url=""
  const thumbMatch = entry.match(/media:thumbnail[^>]+url="([^"]+)"/)
  const thumbnail = thumbMatch?.[1] ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

  const publishedAt = parseXmlText(entry, 'published')

  const viewsMatch = entry.match(/media:statistics[^>]+views="(\d+)"/)
  const views = parseInt(viewsMatch?.[1] ?? '0')

  // Thumbnail width/height — RSS'de bazen var
  const thumbWidthMatch  = entry.match(/media:thumbnail[^>]+width="(\d+)"/)
  const thumbHeightMatch = entry.match(/media:thumbnail[^>]+height="(\d+)"/)
  const thumbW = parseInt(thumbWidthMatch?.[1]  ?? '0')
  const thumbH = parseInt(thumbHeightMatch?.[1] ?? '0')

  // Shorts tespiti kriterleri:
  // 1. Başlıkta #shorts/#short tag'i
  // 2. Thumbnail dikey (height > width) — Shorts genellikle 9:16
  // 3. Thumbnail URL'inde "shorts" geçiyor
  const titleLower = title.toLowerCase()
  const hasShortTag = /#shorts?\b/.test(titleLower)
  const isVerticalThumb = thumbW > 0 && thumbH > 0 && thumbH > thumbW
  const thumbUrlHasShorts = thumbnail.toLowerCase().includes('shorts')

  const isShort = hasShortTag || isVerticalThumb || thumbUrlHasShorts

  return {
    id: videoId,
    title,
    thumbnail,
    duration: '',
    durationFormatted: '',
    publishedAt,
    views,
    youtubeUrl: isShort
      ? `https://www.youtube.com/shorts/${videoId}`
      : `https://www.youtube.com/watch?v=${videoId}`,
    isShort,
  }
}

/**
 * Her video için oEmbed çağrısıyla shorts tespiti yapar.
 * thumbnail_height > thumbnail_width ise Short.
 * Toplu istek için Promise.allSettled kullanır.
 */
async function detectShortsViaOembed(
  videos: YTVideo[],
  timeoutMs = 3000
): Promise<YTVideo[]> {
  const results = await Promise.allSettled(
    videos.map(async (v) => {
      try {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), timeoutMs)

        // shorts URL'iyle oEmbed'e sor — short ise başarıyla döner, değilse hata
        const res = await fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/shorts/${v.id}&format=json`,
          { signal: controller.signal, cache: 'no-store' }
        )
        clearTimeout(timer)

        if (res.ok) {
          const data = await res.json()
          // Shorts'un thumbnail'i dikey olur
          const isShort = (data.thumbnail_height ?? 0) > (data.thumbnail_width ?? 0)
          return { ...v, isShort, youtubeUrl: isShort ? `https://www.youtube.com/shorts/${v.id}` : `https://www.youtube.com/watch?v=${v.id}` }
        }
        return v
      } catch {
        return v
      }
    })
  )

  return results.map((r, i) => (r.status === 'fulfilled' ? r.value : videos[i]))
}

/**
 * RSS feed'inden video listesi çeker (ana sayfa için, sadece videolar).
 */
export async function getYoutubeVideos(limit = 4): Promise<YTVideo[]> {
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
    const res = await fetch(rssUrl, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) return []

    const xml = await res.text()
    const entries = xml.split('<entry>').slice(1)

    const parsed = entries
      .slice(0, 20)
      .map(parseEntry)
      .filter((v): v is YTVideo => v !== null)

    // oEmbed ile shorts tespiti yap
    const withShorts = await detectShortsViaOembed(parsed, 2000)

    // Sadece normal videolar döndür
    return withShorts.filter((v) => !v.isShort).slice(0, limit)
  } catch (err) {
    console.error('getYoutubeVideos error:', err)
    return []
  }
}

/**
 * API route için — hem videolar hem shorts döner.
 */
export async function getYoutubeVideosAndShorts(limit = 30): Promise<{
  videos: YTVideo[]
  shorts: YTVideo[]
}> {
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
    const res = await fetch(rssUrl, { cache: 'no-store' })

    if (!res.ok) {
      console.error('YouTube RSS error:', res.status)
      return { videos: [], shorts: [] }
    }

    const xml = await res.text()
    const entries = xml.split('<entry>').slice(1)

    const parsed = entries
      .slice(0, Math.min(limit, 50))
      .map(parseEntry)
      .filter((v): v is YTVideo => v !== null)

    // oEmbed ile shorts tespiti — timeout 3s
    const withShorts = await detectShortsViaOembed(parsed, 3000)

    const videos = withShorts.filter((v) => !v.isShort)
    const shorts = withShorts.filter((v) => v.isShort)

    return { videos, shorts }
  } catch (err) {
    console.error('getYoutubeVideosAndShorts error:', err)
    return { videos: [], shorts: [] }
  }
}
