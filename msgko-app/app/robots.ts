import type { MetadataRoute } from 'next'

const BASE_URL = 'https://msgko.net'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/rehber/',
          '/rehber/*',
          '/boss/',
          '/boss/*',
          '/harita/',
          '/harita/*',
          '/item/',
          '/item/*',
          '/build/',
          '/build/*',
          '/farm/',
          '/farm/*',
          '/haber/',
          '/haber/*',
          '/wallpaper',
          '/youtube',
          '/instagram',
          '/pazar',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/destek',   // noindex — destek sayfası Google'a gösterilmesin
          '/iletisim', // noindex
          '/_next/',
          '/search?',  // arama sonuç sayfaları indexlenmesin
          '/*?*',      // parametreli URL'ler indexlenmesin
        ],
      },
      // AdsBot — AdSense için ayrı kural
      {
        userAgent: 'AdsBot-Google',
        allow: '/',
      },
      // Aggressive crawlers'ı sınırla
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
