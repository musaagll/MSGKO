/**
 * MSGKO — Ana Sitemap Index
 * Diğer sitemap dosyalarını referans eder (sitemap-*.ts)
 */
import type { MetadataRoute } from 'next'
import { getAllClassSlugs } from '@/lib/ko-data/classes'
import { getPublishedBossSlugs } from '@/lib/ko-data/bosses'
import { getPublishedMapSlugs } from '@/lib/ko-data/maps'
import { getPublishedItemSlugs } from '@/lib/ko-data/items'
import { getPublishedQuestSlugs } from '@/lib/ko-data/quests'

const BASE_URL = 'https://msgko.net'
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
  ]

  // ── Rehber sayfaları ──────────────────────────────────────────────────────
  const rehberPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/rehber`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...getAllClassSlugs().map((slug) => ({
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

  // ── Build sayfaları ───────────────────────────────────────────────────────
  const buildPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/build`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // ── Pazar sayfası — her zaman değişir ─────────────────────────────────────
  const pazarPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/pazar`,
      lastModified: now,
      changeFrequency: 'always',
      priority: 0.85,
    },
  ]

  // ── Farm sayfaları ────────────────────────────────────────────────────────
  const farmPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/farm`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
  ]

  // ── Haber sayfaları ───────────────────────────────────────────────────────
  const haberPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/haber`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    // Dinamik haberler Supabase'den geldiğinde buraya eklenecek
    // Şimdilik index sayfası yeterli
  ]

  // ── Quest sayfaları ───────────────────────────────────────────────────────
  // Quest route henüz yok ama veriler var — ileride eklenecek
  // const questPages = getPublishedQuestSlugs().map(...)

  return [
    ...corePages,
    ...rehberPages,
    ...bossPages,
    ...haritaPages,
    ...itemPages,
    ...buildPages,
    ...pazarPages,
    ...farmPages,
    ...haberPages,
  ]
}
