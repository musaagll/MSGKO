import { createClient } from '@supabase/supabase-js'

export interface Wallpaper {
  id: number
  src: string
  label: string
  category: 'pc' | 'phone'
  click_count: number
  download_count: number
}

/** Supabase'e ulaşılamazsa (ör. ücretsiz plan duraklatması) public/wallpaper'daki görseller gösterilir */
const LOCAL_FALLBACK: Wallpaper[] = [
  '12_29_13', '12_29_20', '12_29_23', '12_29_27', '12_29_30', '19_52_34', '19_54_36',
  '19_56_00', '19_57_36', '19_59_30', '20_00_52', '20_02_08', '20_06_28',
].map((t, i) => ({
  id: -(i + 1), // negatif id: sayaç takibi yapılmaz
  src: `/wallpaper/ChatGPT Image 9 Haz 2026 ${t}.png`,
  label: `Knight Online Wallpaper ${i + 1}`,
  category: 'pc',
  click_count: 0,
  download_count: 0,
}))

/**
 * Duvar kağıdı listesi — sunucuda çalışır (sayfa ISR ile önbelleklenir).
 * Cookie kullanmayan anon istemci: tablo herkese açık okuma politikasına sahip.
 */
export async function getWallpapers(): Promise<Wallpaper[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return LOCAL_FALLBACK

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } })
    const { data, error } = await supabase
      .from('wallpapers')
      .select('id, src, label, category, click_count, download_count')
      .order('id', { ascending: true })
    if (error || !data?.length) return LOCAL_FALLBACK
    return data.map((w) => ({
      id: Number(w.id),
      src: String(w.src),
      label: String(w.label ?? 'Knight Online Wallpaper'),
      category: w.category === 'phone' ? 'phone' : 'pc',
      click_count: Number(w.click_count ?? 0),
      download_count: Number(w.download_count ?? 0),
    }))
  } catch {
    return LOCAL_FALLBACK
  }
}
