import type { MetadataRoute } from 'next'

const BASE_URL = 'https://msgko.net'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/wallpaper`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/destek`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
}
