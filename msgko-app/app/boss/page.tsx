import type { Metadata } from 'next'
import Link from 'next/link'
import { Info } from 'lucide-react'
import { JsonLd } from '@/components/seo/JsonLd'
import { BossCard, BOSS_TYPE } from '@/components/cards/BossCard'
import { PageHero } from '@/components/ui/PageHero'
import { KO_BOSSES } from '@/lib/ko-data/bosses'
import { SECTION_ART } from '@/lib/class-meta'
import { buildMetadata, buildBreadcrumbSchema, buildItemListSchema, BASE_URL } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Knight Online Boss Rehberleri | Felankor, Isiloon ve Tüm Bosslar | MSGKO',
  description:
    'Knight Online tüm bossları için spawn yeri, drop listesi ve öldürme taktikleri. Felankor, Isiloon, Kundun ve daha fazlası MSGKO\'da.',
  canonical: `${BASE_URL}/boss`,
  keywords: [],
  ogType: 'website',
})

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Boss Rehberleri', href: '/boss' },
]

export default function BossIndexPage() {
  const bosses = KO_BOSSES.filter(b => b.is_published)

  const schemas = [
    buildBreadcrumbSchema(breadcrumbs),
    buildItemListSchema({
      name: 'Knight Online Boss Rehberleri',
      description: 'Spawn, drop ve taktik bilgileri.',
      url: '/boss',
      items: bosses.map(b => ({ name: `Knight Online ${b.name}`, url: `/boss/${b.slug}`, description: b.description ?? '' })),
    }),
  ]

  const counts = (['world', 'dungeon', 'event'] as const)
    .map((t) => ({ type: t, count: bosses.filter((b) => b.boss_type === t).length }))
    .filter((c) => c.count > 0)

  return (
    <>
      <JsonLd data={schemas} />

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow="Boss Merkezi"
        art={{ src: SECTION_ART.boss, position: '70% 40%' }}
        title={<><span lang="en">Knight Online</span> Boss Rehberleri</>}
        description={<p>Tüm boss&apos;ların spawn yeri, çıkma zamanı, drop listesi ve öldürme taktiklerini burada bulabilirsin.</p>}
      >
        <ul className="flex flex-wrap gap-2">
          {counts.map((c) => (
            <li key={c.type} className={`chip border ${BOSS_TYPE[c.type].className}`}>
              <span className="font-bold tabular-nums">{c.count}</span> {BOSS_TYPE[c.type].label}
            </li>
          ))}
        </ul>
      </PageHero>

      <section aria-label="Boss listesi" className="container-site py-10 sm:py-14">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bosses.map((boss) => (
            <li key={boss.slug}>
              <BossCard boss={boss} />
            </li>
          ))}
        </ul>

        <aside className="card mt-10 flex gap-4 p-6 sm:p-7">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ember-500/10 text-ember-300">
            <Info size={20} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-bold">Boss Sistemi Hakkında</h2>
            <p className="mt-2 leading-relaxed text-fg-3">
              Knight Online&apos;daki boss&apos;lar belirli aralıklarla spawn olur ve sunucu genelinde duyuru yapılır.
              En değerli itemlar bu boss&apos;lardan düşer. CZ&apos;nin en güçlü boss&apos;u olan{' '}
              <Link href="/boss/felankor" className="font-semibold text-amethyst-300 hover:text-amethyst-200">Felankor</Link>&apos;u öldürmek
              için güçlü ve organize bir grup gerekmektedir.
            </p>
          </div>
        </aside>
      </section>
    </>
  )
}
