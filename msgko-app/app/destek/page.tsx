import type { Metadata } from 'next'
import Script from 'next/script'
import { DestekClient } from './destek-client'

const BASE_URL = 'https://msgko.net'

export const metadata: Metadata = {
  title: 'Destek — MSGKO Knight Online Rehber Sitesini Destekle',
  description:
    'MSGKO Knight Online rehber içeriklerini desteklemek için Kopazar, Bynogame ve Knightpin platformlarına ulaşabilirsiniz. Her destek yeni Knight Online rehber videoları için motivasyon kaynağıdır.',
  alternates: {
    canonical: `${BASE_URL}/destek`,
  },
  openGraph: {
    title: 'Destek — MSGKO Knight Online Rehber Sitesini Destekle',
    description: 'MSGKO Knight Online rehber içeriklerini desteklemek için Kopazar, Bynogame ve Knightpin platformlarına ulaşabilirsiniz.',
    url: `${BASE_URL}/destek`,
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'MSGKO — Knight Online Rehber ve Eğitim Sitesi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Destek — MSGKO Knight Online',
    description: 'MSGKO içeriklerini Kopazar, Bynogame veya Knightpin üzerinden destekle.',
    images: [`${BASE_URL}/opengraph-image`],
  },
  robots: {
    index: false,
    follow: true,
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
      name: 'Destek',
      item: `${BASE_URL}/destek`,
    },
  ],
}

export default function DestekPage() {
  return (
    <>
      <Script
        id="destek-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <DestekClient />
    </>
  )
}
