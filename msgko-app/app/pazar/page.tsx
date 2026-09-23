import type { Metadata } from 'next'
import Script from 'next/script'
import { PazarClient } from './pazar-client'
import { buildMetadata, buildBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Knight Online USKO Canlı Pazar | Zero, Destan, Oreads İlanları | MSGKO',
  description:
    'Knight Online USKO anlık pazar ilanları. Zero3, Zero4, Zero5, Destan2 ve Oreads2 sunucularında satılan itemların fiyatlarını karşılaştır, en ucuz ilanları bul.',
  canonical: `${BASE_URL}/pazar`,
  keywords: ['knight online pazar', 'usko pazar', 'knight online market', 'ko item fiyatları'],
  ogType: 'website',
})

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'USKO Pazar', href: '/pazar' },
]

const schema = buildBreadcrumbSchema(breadcrumbs)

export default function PazarPage() {
  return (
    <>
      <Script
        id="pazar-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PazarClient />
    </>
  )
}
