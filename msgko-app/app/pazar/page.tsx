import type { Metadata } from 'next'
import Script from 'next/script'
import { PazarClient } from './pazar-client'
import { buildMetadata, buildBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Knight Online USKO Pazar | Zero, Destan, Pandora, Agartha Item İlanları | MSGKO',
  description:
    'Knight Online USKO anlık pazar ilanları. Zero, Destan, Pandora ve Agartha sunucularında satılan item\'ların fiyatlarını karşılaştır, en ucuz ilanları bul.',
  canonical: `${BASE_URL}/pazar`,
  keywords: [
    'knight online pazar', 'usko pazar', 'knight online item fiyat',
    'knight online zero pazar', 'knight online destan pazar',
    'knight online pandora pazar', 'knight online agartha pazar',
    'knight online item satış', 'knight online item al', 'usko item fiyatları',
    'knight online market', 'knight online item ilanları',
  ],
  ogType: 'website',
})

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'USKO Pazar', href: '/pazar' },
]

const schemas = [buildBreadcrumbSchema(breadcrumbs)]

export default function PazarPage() {
  return (
    <>
      <Script
        id="pazar-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <PazarClient />
    </>
  )
}
