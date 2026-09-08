import { SeoClient } from './seo-client'
import { createClient } from '@/lib/supabase'

// Supabase'den mevcut içerik sayılarını çek
async function getSeoStats() {
  const supabase = createClient()

  const tables = ['guides', 'bosses', 'maps', 'items', 'quests', 'news', 'farm_spots', 'builds'] as const

  const counts: Record<string, { total: number; published: number; missing_seo: number }> = {}

  for (const table of tables) {
    try {
      const { count: total } = await supabase.from(table).select('*', { count: 'exact', head: true })
      const { count: published } = await supabase.from(table).select('*', { count: 'exact', head: true }).eq('is_published', true)
      const { count: missingSeo } = await supabase.from(table).select('*', { count: 'exact', head: true }).is('seo_title', null)
      counts[table] = {
        total: total ?? 0,
        published: published ?? 0,
        missing_seo: missingSeo ?? 0,
      }
    } catch {
      counts[table] = { total: 0, published: 0, missing_seo: 0 }
    }
  }

  // Redirect sayısı
  let redirectCount = 0
  try {
    const { count } = await supabase.from('seo_redirects').select('*', { count: 'exact', head: true }).eq('is_active', true)
    redirectCount = count ?? 0
  } catch { /* tablo henüz yok */ }

  return { counts, redirectCount }
}

export default async function SeoPage() {
  const { counts, redirectCount } = await getSeoStats()
  return <SeoClient initialCounts={counts} redirectCount={redirectCount} />
}
