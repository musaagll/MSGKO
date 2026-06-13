/**
 * Merkezi yardımcı fonksiyonlar — tüm bileşenler buradan import eder.
 */

/** ISO 8601 süre string'ini "dk:sn" veya "ss:dk:sn" formatına çevirir */
export function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return ''
  const h = parseInt(match[1] || '0')
  const m = parseInt(match[2] || '0')
  const s = parseInt(match[3] || '0')
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Görüntülenme sayısını kısa gösterim formatına çevirir */
export function formatViews(n: number): string {
  if (n < 1000) return String(n)
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}B`
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
}

/** Geçen süreyi Türkçe göreceli zaman formatına çevirir */
export function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`
  if (diff < 604800) return `${Math.floor(diff / 86400)} gün önce`
  if (diff < 2592000) return `${Math.floor(diff / 604800)} hafta önce`
  return `${Math.floor(diff / 2592000)} ay önce`
}
