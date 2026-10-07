import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { ClassCard } from '@/components/cards/ClassCard'
import { PageHero } from '@/components/ui/PageHero'
import { KO_CLASSES } from '@/lib/ko-data/classes'
import { CLASS_META } from '@/lib/class-meta'
import { buildMetadata, buildBreadcrumbSchema, buildItemListSchema, BASE_URL } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Knight Online Karakter Rehberleri | Warrior, Rogue, Mage, Priest | MSGKO',
  description:
    'Knight Online tüm karakter sınıfları için kapsamlı rehberler. Warrior, Rogue (Assassin/Archer), Mage ve Priest — skill ağaçları, stat dağılımı ve Master açma rehberleri MSGKO\'da.',
  canonical: `${BASE_URL}/rehber`,
  keywords: [],
  ogType: 'website',
})

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Karakter Rehberleri', href: '/rehber' },
]

const schemas = [
  buildBreadcrumbSchema(breadcrumbs),
  buildItemListSchema({
    name: 'Knight Online Karakter Rehberleri',
    description: 'Tüm Knight Online karakter sınıfları için skill, stat ve Master açma rehberleri.',
    url: '/rehber',
    items: KO_CLASSES.map(c => ({
      name: `Knight Online ${c.name} Rehberi`,
      url: `/rehber/${c.guideSlug}`,
      description: c.description.substring(0, 150),
    })),
  }),
]

export default function RehberIndexPage() {
  return (
    <>
      <JsonLd data={schemas} />

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow="Rehber Merkezi"
        title="Karakter Rehberleri"
        description={
          <p>
            Knight Online&apos;da 4 temel sınıf bulunur: <strong className="text-fg-2">Warrior</strong>,{' '}
            <strong className="text-fg-2">Rogue</strong> (Assassin ve Archer), <strong className="text-fg-2">Mage</strong> ve{' '}
            <strong className="text-fg-2">Priest</strong>. Her sınıf için skill ağaçları, stat dağılımı ve Master açma rehberleri burada.
          </p>
        }
      />

      <section aria-label="Sınıflar" className="container-site py-10 sm:py-14">
        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2 [&>li:last-child]:lg:col-span-2">
          {KO_CLASSES.map((cls) => (
            <li key={cls.slug}>
              <ClassCard cls={cls} as="h2" variant="feature" />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sinif-karsilastirma" className="container-site pb-16 sm:pb-20">
        <h2 id="sinif-karsilastirma" className="display-md">Sınıf Karşılaştırması</h2>
        <p className="mt-3 max-w-2xl text-fg-3">Rol, ana stat ve Master unvanlarına tek tabloda göz at.</p>
        <div className="card mt-6 overflow-x-auto">
          <table className="table-ko min-w-160">
            <thead>
              <tr>
                <th scope="col">Sınıf</th>
                <th scope="col">Rol</th>
                <th scope="col">Ana Stat</th>
                <th scope="col">Master (Human)</th>
                <th scope="col">Master (Karus)</th>
              </tr>
            </thead>
            <tbody>
              {KO_CLASSES.map((cls) => (
                <tr key={cls.slug}>
                  <th scope="row" className="text-left font-semibold">
                    <Link href={`/rehber/${cls.guideSlug}`} className="inline-flex items-center gap-2 text-fg hover:text-amethyst-200">
                      <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: cls.color }} />
                      {cls.name}
                    </Link>
                  </th>
                  <td>{CLASS_META[cls.slug].role}</td>
                  <td>{cls.primaryStat}</td>
                  <td>{cls.masterTitle.human}</td>
                  <td>{cls.masterTitle.karus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
