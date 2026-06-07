import { createClient } from './supabase/server'
import type { Video, Category } from './types'

/** Son eklenen videoları getirir (varsayılan: 4 adet) */
export async function getLatestVideos(limit = 4): Promise<Video[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('videos')
    .select('*, category:categories(*)')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getLatestVideos error:', error.message)
    return []
  }
  return (data as Video[]) ?? []
}

/** Tüm kategorileri getirir */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('getCategories error:', error.message)
    return []
  }
  return (data as Category[]) ?? []
}

/** Belirli bir kategoriye ait videoları getirir */
export async function getVideosByCategory(slug: string, limit = 20): Promise<Video[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('videos')
    .select('*, category:categories(*)')
    .eq('categories.slug', slug)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getVideosByCategory error:', error.message)
    return []
  }
  return (data as Video[]) ?? []
}

/** Öne çıkan videoları getirir */
export async function getFeaturedVideos(limit = 4): Promise<Video[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('videos')
    .select('*, category:categories(*)')
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getFeaturedVideos error:', error.message)
    return []
  }
  return (data as Video[]) ?? []
}
