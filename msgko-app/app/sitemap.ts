import type { MetadataRoute } from 'next'

const BASE_URL = 'https://msgko.net'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date('2026-08-20'),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/wallpaper`,
      lastModified: new Date('2026-08-20'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/karakter-bul`,
      lastModified: new Date('2026-08-20'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/destek`,
      lastModified: new Date('2026-08-20'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
