import type { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import { MapCard, MAP_TYPE } from '@/components/cards/MapCard'
import { PageHero } from '@/components/ui/PageHero'
import { KO_MAPS } from '@/lib/ko-data/maps'
import { SECTION_ART } from '@/lib/class-meta'
import { buildMetadata, buildBreadcrumbSchema, buildItemListSchema, BASE_URL } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Knight Online Haritalar | CZ, FT, Ardream ve Tüm Haritalar | MSGKO',
  description: 'Knight Online tüm haritaları için farm rotaları, boss konumları ve rehberler. MSGKO\'da.',
  canonical: `${BASE_URL}/harita`,
  keywords: [],
  ogType: 'website',
})

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Haritalar', href: '/harita' },
]

export default function HaritaIndexPage() {
  const maps = KO_MAPS.filter(m => m.is_published)

  const schemas = [
    buildBreadcrumbSchema(breadcrumbs),
    buildItemListSchema({
      name: 'Knight Online Harita Rehberleri',
      description: 'Farm, boss ve rehber bilgileri.',
      url: '/harita',
      items: maps.map(m => ({ name: `Knight Online ${m.name}`, url: `/harita/${m.slug}`, description: m.description ?? '' })),
    }),
  ]

  const typeCounts = Object.keys(MAP_TYPE)
    .map((t) => ({ type: t, count: maps.filter((m) => m.map_type === t).length }))
    .filter((c) => c.count > 0)

  return (
    <>
      <JsonLd data={schemas} />

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow="Harita Merkezi"
        art={{ src: SECTION_ART.harita, position: '60% 40%' }}
        title={<><span lang="en">Knight Online</span> Haritalar</>}
        description={<p>Farm rotaları, boss konumları, level aralıkları ve önemli bilgiler — tüm haritalar için.</p>}
      >
        <ul className="flex flex-wrap gap-2">
          {typeCounts.map((c) => (
            <li key={c.type} className={`chip border ${MAP_TYPE[c.type].className}`}>
              <span className="font-bold tabular-nums">{c.count}</span> {MAP_TYPE[c.type].label}
            </li>
          ))}
        </ul>
      </PageHero>

      <section aria-label="Harita listesi" className="container-site py-10 sm:py-14">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {maps.map((map) => (
            <li key={map.slug}>
              <MapCard map={map} />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
