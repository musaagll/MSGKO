import type { MetadataRoute } from 'next'

const BASE_URL = 'https://msgko.net'
const WWW_URL = 'https://www.msgko.net'
const NOW = new Date()

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: WWW_URL,
      lastModified: NOW,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: BASE_URL,
      lastModified: NOW,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${WWW_URL}/destek`,
      lastModified: NOW,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/destek`,
      lastModified: NOW,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
