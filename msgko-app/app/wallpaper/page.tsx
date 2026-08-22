import type { Metadata } from 'next'
import Script from 'next/script'
import { WallpaperClient } from './wallpaper-client'

const BASE_URL = 'https://msgko.net'

export const metadata: Metadata = {
  title: 'Knight Online Wallpaper — Ücretsiz HD Duvar Kağıtları | MSGKO',
  description:
    'Knight Online duvar kağıtları — ücretsiz indir. PC ve telefon için HD Knight Online wallpaper. Asas, okçu ve tüm karakterler için özel tasarım MSGKO duvar kağıtları.',
  keywords: [
    'knight online wallpaper', 'knight online duvar kağıdı', 'knight online arka plan',
    'knight online masaüstü wallpaper', 'knight online hd wallpaper', 'knight online 4k wallpaper',
    'knight online background', 'msgko wallpaper', 'ücretsiz knight online wallpaper',
    'knight online telefon wallpaper', 'knight online asas wallpaper', 'knight online okçu wallpaper',
  ],
  alternates: {
    canonical: `${BASE_URL}/wallpaper`,
  },
  openGraph: {
    title: 'Knight Online Wallpaper — Ücretsiz HD Duvar Kağıtları | MSGKO',
    description: 'Ücretsiz Knight Online duvar kağıtları. PC ve telefon için HD wallpaper. MSGKO özel tasarım.',
    url: `${BASE_URL}/wallpaper`,
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Knight Online Wallpaper — MSGKO',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Knight Online Wallpaper — Ücretsiz HD Duvar Kağıtları | MSGKO',
    description: 'Ücretsiz Knight Online HD duvar kağıtları. PC ve telefon için. msgko.net',
    images: [`${BASE_URL}/opengraph-image`],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Ana Sayfa',
      item: BASE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Knight Online Wallpaper',
      item: `${BASE_URL}/wallpaper`,
    },
  ],
}

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Knight Online Wallpaper — MSGKO',
  description: 'Ücretsiz Knight Online duvar kağıtları. PC ve telefon için HD wallpaper.',
  url: `${BASE_URL}/wallpaper`,
  isPartOf: { '@type': 'WebSite', url: BASE_URL, name: 'MSGKO — Knight Online Rehber ve Eğitim Sitesi' },
  breadcrumb: breadcrumbSchema,
  inLanguage: 'tr',
}

export default function WallpaperPage() {
  return (
    <>
      <Script
        id="wallpaper-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <WallpaperClient />
    </>
  )
}
