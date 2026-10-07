import type { Metadata } from 'next'
import { Info } from 'lucide-react'
import { JsonLd } from '@/components/seo/JsonLd'
import { ItemCard, ITEM_GRADE } from '@/components/cards/ItemCard'
import { PageHero } from '@/components/ui/PageHero'
import { KO_ITEMS } from '@/lib/ko-data/items'
import { SECTION_ART } from '@/lib/class-meta'
import { buildMetadata, buildBreadcrumbSchema, buildItemListSchema, BASE_URL } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Knight Online Item Veritabanı | Silah, Zırh ve Aksesuar | MSGKO',
  description: 'Knight Online tüm itemlar için özellik, drop bilgisi ve upgrade rehberi. Raptor, Dual Blade, Chitin ve daha fazlası.',
  canonical: `${BASE_URL}/item`,
  keywords: [],
  ogType: 'website',
})

export default function ItemIndexPage() {
  const items = KO_ITEMS.filter(i => i.is_published)

  const schemas = [
    buildBreadcrumbSchema([{ label: 'Ana Sayfa', href: '/' }, { label: 'Item Veritabanı', href: '/item' }]),
    buildItemListSchema({
      name: 'Knight Online Item Veritabanı',
      description: 'Özellik, drop ve upgrade bilgileri.',
      url: '/item',
      items: items.map(i => ({ name: `Knight Online ${i.name}`, url: `/item/${i.slug}`, description: i.description ?? '' })),
    }),
  ]

  const gradeCounts = Object.keys(ITEM_GRADE)
    .map((g) => ({ grade: g, count: items.filter((i) => i.item_grade === g).length }))
    .filter((c) => c.count > 0)

  return (
    <>
      <JsonLd data={schemas} />

      <PageHero
        breadcrumbs={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Item Veritabanı', href: '/item' }]}
        eyebrow="Item Veritabanı"
        art={{ src: SECTION_ART.item, position: '60% 35%' }}
        title={<><span lang="en">Knight Online</span> Item Veritabanı</>}
        description={<p>Silah, zırh, aksesuar ve tüm itemların özellikleri, drop kaynakları ve upgrade bilgileri.</p>}
      >
        <ul className="flex flex-wrap gap-2">
          {gradeCounts.map((c) => (
            <li key={c.grade} className={`chip border ${ITEM_GRADE[c.grade].className}`}>
              <span className="font-bold tabular-nums">{c.count}</span> {ITEM_GRADE[c.grade].label}
            </li>
          ))}
        </ul>
      </PageHero>

      <section aria-label="Item listesi" className="container-site py-10 sm:py-14">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.slug}>
              <ItemCard item={item} />
            </li>
          ))}
        </ul>

        <aside className="card mt-10 flex gap-4 p-6 sm:p-7">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amethyst-500/10 text-amethyst-200">
            <Info size={20} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-bold">Knight Online Item Sistemi</h2>
            <p className="mt-2 leading-relaxed text-fg-3">
              Itemlar normal, unique ve legendary olmak üzere nadirlik seviyelerine sahiptir. Unique itemlar bosslardan,
              dungeon&apos;lardan ve özel görevlerden elde edilir. +1&apos;den +9&apos;a kadar upgrade mümkündür.
            </p>
          </div>
        </aside>
      </section>
    </>
  )
}
