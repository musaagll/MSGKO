/**
 * Görüntülenme sayısını okunabilir kısa forma dönüştürür.
 * Örnek: 1200 → "1.2K", 1500000 → "1.5M"
 */
export function formatViews(views: number): string {
  if (typeof views !== 'number' || isNaN(views)) return '0'
  if (views < 1000) return String(views)
  if (views < 1_000_000) return `${(views / 1000).toFixed(1).replace(/\.0$/, '')}B`
  return `${(views / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
}

/**
 * ISO 8601 tarih stringini Türkçe göreli formata dönüştürür.
 * Örnek: "2024-01-15" → "2 gün önce"
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffMinutes < 60) return `${diffMinutes} dakika önce`
    if (diffHours < 24) return `${diffHours} saat önce`
    if (diffDays === 1) return '1 gün önce'
    if (diffDays < 7) return `${diffDays} gün önce`
    if (diffDays < 14) return '1 hafta önce'
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`
    if (diffDays < 60) return '1 ay önce'
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay önce`
    return `${Math.floor(diffDays / 365)} yıl önce`
  } catch {
    return '—'
  }
}

/**
 * Kategori slug'ına göre badge renk sınıfını döndürür.
 */
export function getCategoryBadgeClass(slug: string): string {
  switch (slug) {
    case 'asas':
      return 'bg-blue-500/90 text-white'
    case 'okcu':
      return 'bg-amber-500/90 text-white'
    default:
      return 'bg-white/20 text-white'
  }
}

/**
 * cn — className birleştirici
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
