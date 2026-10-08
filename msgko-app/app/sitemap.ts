/**
 * MSGKO — Sitemap
 * Yalnızca var olan ve kendi canonical'ı olan URL'leri listeler.
 * Yeni bir bölüm (build, farm, haber…) eklenince route'u yayına girdikten sonra buraya eklenmeli.
 */
import type { MetadataRoute } from 'next'
import { KO_CLASSES } from '@/lib/ko-data/classes'
import { getPublishedBossSlugs } from '@/lib/ko-data/bosses'
import { getPublishedMapSlugs } from '@/lib/ko-data/maps'
import { getPublishedItemSlugs } from '@/lib/ko-data/items'
import { SITE_URL as BASE_URL } from '@/lib/site'

const now = new Date()

export default function sitemap(): MetadataRoute.Sitemap {
  // ── Statik çekirdek sayfalar ──────────────────────────────────────────────
  const corePages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/youtube`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/instagram`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/wallpaper`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pazar`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.7,
    },
  ]

  // ── Rehber sayfaları ──────────────────────────────────────────────────────
  const rehberPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/rehber`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Yalnızca canonical guideSlug'lar; alias'lar (battle-priest) canonical olarak /rehber/priest'i gösteriyor
    ...KO_CLASSES.map(({ guideSlug: slug }) => ({
      url: `${BASE_URL}/rehber/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
  ]

  // ── Boss sayfaları ────────────────────────────────────────────────────────
  const bossPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/boss`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...getPublishedBossSlugs().map((slug) => ({
      url: `${BASE_URL}/boss/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    })),
  ]

  // ── Harita sayfaları ──────────────────────────────────────────────────────
  const haritaPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/harita`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...getPublishedMapSlugs().map((slug) => ({
      url: `${BASE_URL}/harita/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.72,
    })),
  ]

  // ── Item sayfaları ────────────────────────────────────────────────────────
  const itemPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/item`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...getPublishedItemSlugs().map((slug) => ({
      url: `${BASE_URL}/item/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  return [
    ...corePages,
    ...rehberPages,
    ...bossPages,
    ...haritaPages,
    ...itemPages,
  ]
}
