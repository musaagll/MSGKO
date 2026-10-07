import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, MapPin, Navigation } from 'lucide-react'
import { JsonLd } from '@/components/seo/JsonLd'
import { MaybeLink } from '@/components/ui/MaybeLink'
import { PageHero } from '@/components/ui/PageHero'
import { FaqList } from '@/components/ui/FaqList'
import { FactList } from '@/components/ui/FactList'
import { RichText } from '@/components/ui/RichText'
import { ArticleLayout, ContentSection, RelatedLinks, SideCard } from '@/components/content/ArticleLayout'
import { BOSS_TYPE, mapLabel } from '@/components/cards/BossCard'
import { KO_BOSSES, getBossBySlug, getPublishedBossSlugs } from '@/lib/ko-data/bosses'
import { isPublishedItem } from '@/lib/ko-data/items'
import { isPublishedMap } from '@/lib/ko-data/maps'
import { SECTION_ART } from '@/lib/class-meta'
import {
  buildBossMetadata,
  buildBossBreadcrumbs,
  buildBreadcrumbSchema,
  buildArticleSchema,
  buildFAQSchema,
  buildBossFAQs,
} from '@/lib/seo'

export async function generateStaticParams() {
  return getPublishedBossSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const boss = getBossBySlug(slug)
  if (!boss || !boss.is_published) return {}
  return buildBossMetadata(boss)
}

export default async function BossDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const boss = getBossBySlug(slug)
  if (!boss || !boss.is_published) notFound()

  const breadcrumbs = buildBossBreadcrumbs(boss)
  const faqs = buildBossFAQs(boss)
  const type = BOSS_TYPE[boss.boss_type] ?? BOSS_TYPE.mini

  const schemas = [
    buildBreadcrumbSchema(breadcrumbs),
    buildArticleSchema({
      title: `Knight Online ${boss.name} Boss Rehberi`,
      description: boss.description ?? '',
      url: `/boss/${boss.slug}`,
      updatedAt: new Date().toISOString(),
    }),
    buildFAQSchema(faqs),
  ]

  // İlgili boss'lar (mevcut hariç, aynı haritada olanlar önce)
  const relatedBosses = KO_BOSSES.filter(
    (b) => b.slug !== boss.slug && b.is_published
  ).sort((a, b) =>
    a.map_slug === boss.map_slug ? -1 : b.map_slug === boss.map_slug ? 1 : 0
  ).slice(0, 4)

  const spawnFacts = [
    boss.map_slug && {
      label: 'Harita',
      Icon: MapPin,
      value: (
        <MaybeLink
          href={isPublishedMap(boss.map_slug) ? `/harita/${boss.map_slug}` : null}
          className="text-amethyst-300 hover:text-amethyst-200"
        >
          {mapLabel(boss.map_slug)}
        </MaybeLink>
      ),
    },
    boss.spawn_interval && { label: 'Spawn Aralığı', Icon: Clock, value: boss.spawn_interval },
    boss.spawn_coords && { label: 'Konum', Icon: Navigation, value: boss.spawn_coords },
  ].filter(Boolean) as { label: string; Icon: typeof MapPin; value: React.ReactNode }[]

  return (
    <>
      <JsonLd data={schemas} />

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow={type.label}
        art={{ src: SECTION_ART.boss, position: '70% 40%' }}
        title={<span lang="en">Knight Online {boss.name}</span>}
        description={boss.description ? <p>{boss.description}</p> : undefined}
      >
        <ul className="flex flex-wrap gap-2">
          <li className={`chip border ${type.className}`}>{type.label}</li>
          {boss.level && <li className="chip">Lv. {boss.level}</li>}
          {boss.spawn_interval && <li className="chip">Spawn: {boss.spawn_interval}</li>}
        </ul>
      </PageHero>

      <ArticleLayout
        aside={
          <>
            <SideCard title="İstatistikler">
              <FactList
                columns={2}
                facts={[
                  ...(boss.level ? [{ label: 'Level', value: boss.level }] : []),
                  ...(boss.hp ? [{ label: 'HP', value: boss.hp.toLocaleString('tr-TR') }] : []),
                  ...(boss.element && boss.element !== 'none' ? [{ label: 'Element', value: <span className="capitalize">{boss.element}</span> }] : []),
                  ...(boss.spawn_interval ? [{ label: 'Spawn', value: boss.spawn_interval }] : []),
                ]}
              />
            </SideCard>
            {relatedBosses.length > 0 && (
              <SideCard title="Diğer Boss'lar">
                <RelatedLinks
                  links={relatedBosses.map((b) => ({ label: b.name, href: `/boss/${b.slug}`, hint: b.level ? `Lv. ${b.level}` : undefined }))}
                  all={{ label: "Tüm Boss'ları Gör", href: '/boss' }}
                />
              </SideCard>
            )}
          </>
        }
      >
        {/* Spawn Bilgisi */}
        <ContentSection id="spawn-bilgisi" title={`${boss.name} Nerede ve Ne Zaman Çıkar?`}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {spawnFacts.map(({ label, Icon, value }) => (
              <div key={label} className="card p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-fg-4">
                  <Icon size={14} aria-hidden="true" />
                  {label}
                </p>
                <p className="mt-1.5 font-semibold text-fg">{value}</p>
              </div>
            ))}
          </div>
        </ContentSection>

        {/* Drop Listesi */}
        {boss.drop_list.length > 0 && (
          <ContentSection id="drop-listesi" title={`${boss.name} Drop Listesi`}>
            <p className="mb-4 text-fg-3">
              {boss.name}&#39;u öldürdüğünüzde aşağıdaki item&#39;lar düşebilir:
            </p>
            <div className="card overflow-x-auto">
              <table className="table-ko table-stack min-w-120">
                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Drop Oranı</th>
                    <th scope="col">Upgrade</th>
                  </tr>
                </thead>
                <tbody>
                  {boss.drop_list.map((drop, i) => (
                    <tr key={i}>
                      <td data-primary className="font-semibold text-fg">
                        {isPublishedItem(drop.item_slug) ? (
                          <Link href={`/item/${drop.item_slug}`} className="text-amethyst-300 hover:text-amethyst-200">
                            {drop.item_name}
                          </Link>
                        ) : (
                          drop.item_name
                        )}
                      </td>
                      <td data-label="Drop:" className="tabular-nums">{drop.drop_rate ?? "—"}</td>
                      <td data-label="Upgrade:" className="tabular-nums">{drop.upgrade_range ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ContentSection>
        )}

        {/* Rehber içeriği */}
        {boss.content && (
          <ContentSection id="rehber-icerik" title={`${boss.name} Rehberi`}>
            <RichText text={boss.content} />
          </ContentSection>
        )}

        {/* SSS */}
        <ContentSection id="sss" title="Sık Sorulan Sorular">
          <FaqList faqs={faqs} />
        </ContentSection>
      </ArticleLayout>
    </>
  )
}
