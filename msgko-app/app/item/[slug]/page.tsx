import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { JsonLd } from '@/components/seo/JsonLd'
import { MaybeLink } from '@/components/ui/MaybeLink'
import { PageHero } from '@/components/ui/PageHero'
import { FaqList } from '@/components/ui/FaqList'
import { FactList } from '@/components/ui/FactList'
import { RichText } from '@/components/ui/RichText'
import { ArticleLayout, ContentSection, RelatedLinks, SideCard } from '@/components/content/ArticleLayout'
import { ITEM_GRADE, ITEM_TYPE, STAT_LABELS } from '@/components/cards/ItemCard'
import { KO_ITEMS, getItemBySlug, getPublishedItemSlugs } from '@/lib/ko-data/items'
import { isPublishedBoss } from '@/lib/ko-data/bosses'
import { isPublishedMap } from '@/lib/ko-data/maps'
import { SECTION_ART } from '@/lib/class-meta'
import {
  buildItemMetadata,
  buildItemBreadcrumbs,
  buildBreadcrumbSchema,
  buildArticleSchema,
  buildFAQSchema,
  buildItemFAQs,
} from '@/lib/seo'

export async function generateStaticParams() {
  return getPublishedItemSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = getItemBySlug(slug)
  if (!item || !item.is_published) return {}
  return buildItemMetadata(item)
}

const RACE_LABEL: Record<string, string> = { human: 'Human', karus: 'Karus', all: 'Tümü' }

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = getItemBySlug(slug)
  if (!item || !item.is_published) notFound()

  const breadcrumbs = buildItemBreadcrumbs(item)
  const faqs = buildItemFAQs(item)
  const grade = ITEM_GRADE[item.item_grade] ?? ITEM_GRADE.normal

  const schemas = [
    buildBreadcrumbSchema(breadcrumbs),
    buildArticleSchema({
      title: `Knight Online ${item.name}`,
      description: item.description ?? '',
      url: `/item/${item.slug}`,
      updatedAt: new Date().toISOString(),
    }),
    buildFAQSchema(faqs),
  ]

  // İlgili itemler (aynı tip)
  const relatedItems = KO_ITEMS.filter(
    (i) => i.slug !== item.slug && i.is_published && i.item_type === item.item_type
  ).slice(0, 4)

  return (
    <>
      <JsonLd data={schemas} />

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow={ITEM_TYPE[item.item_type] ?? item.item_type}
        art={{ src: SECTION_ART.item, position: '60% 35%' }}
        title={<span lang="en">Knight Online {item.name}</span>}
        description={item.description ? <p>{item.description}</p> : undefined}
      >
        <ul className="flex flex-wrap gap-2">
          <li className="chip">{ITEM_TYPE[item.item_type] ?? item.item_type}</li>
          <li className={`chip border ${grade.className}`}>{grade.label}</li>
          <li className="chip">Min Lv. {item.min_level}</li>
          {item.upgrade_max > 0 && <li className="chip">Max +{item.upgrade_max}</li>}
        </ul>
      </PageHero>

      <ArticleLayout
        aside={
          <>
            <SideCard title="Item Bilgisi">
              <FactList
                columns={2}
                facts={[
                  { label: 'Min Level', value: item.min_level },
                  { label: 'Nadirlik', value: grade.label },
                  ...(item.character_class.length > 0 ? [{ label: 'Sınıf', value: item.character_class.join(', ') }] : []),
                  ...(item.upgrade_max > 0 ? [{ label: 'Max Upgrade', value: `+${item.upgrade_max}` }] : []),
                  { label: 'Irk', value: RACE_LABEL[item.race] ?? item.race },
                ]}
              />
            </SideCard>
            {relatedItems.length > 0 && (
              <SideCard title="Benzer İtemlar">
                <RelatedLinks
                  links={relatedItems.map((rel) => ({ label: rel.name, href: `/item/${rel.slug}` }))}
                  all={{ label: 'Tüm İtemler', href: '/item' }}
                />
              </SideCard>
            )}
          </>
        }
      >
        {/* Özellikler */}
        <ContentSection id="ozellikler" title={`${item.name} Özellikleri`}>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.entries(item.base_stats).map(([stat, val]) => (
              <div key={stat} className="card p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-4">{STAT_LABELS[stat] ?? stat.toUpperCase()}</dt>
                <dd className="mt-1 font-display text-2xl font-bold tabular-nums text-fg">+{val}</dd>
              </div>
            ))}
          </dl>

          {item.bonus_stats.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-4">Bonus Statlar</p>
              <ul className="mt-2.5 flex flex-wrap gap-2">
                {item.bonus_stats.map((b, i) => (
                  <li key={i} className="chip border border-amber-400/30 bg-amber-500/10 text-amber-200">
                    +{b.value} {b.stat.toUpperCase()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ContentSection>

        {/* Drop Bilgisi */}
        {item.drop_info.length > 0 && (
          <ContentSection id="drop-bilgisi" title={`${item.name} Nereden Düşer?`}>
            <ul className="space-y-3">
              {item.drop_info.map((drop, i) => (
                <li key={i} className="card flex items-center justify-between gap-4 p-4 sm:p-5">
                  <div className="min-w-0">
                    <p className="font-semibold text-fg">
                      {isPublishedBoss(drop.mob_slug) ? (
                        <Link href={`/boss/${drop.mob_slug}`} className="text-amethyst-300 hover:text-amethyst-200">
                          {drop.mob_name ?? drop.mob_slug}
                        </Link>
                      ) : (drop.mob_name ?? 'Bilinmiyor')}
                    </p>
                    {drop.map_slug && (
                      <p className="mt-1 flex items-center gap-1.5 text-sm capitalize text-fg-3">
                        <MapPin size={14} aria-hidden="true" className="text-fg-4" />
                        <MaybeLink href={isPublishedMap(drop.map_slug) ? `/harita/${drop.map_slug}` : null} className="hover:text-fg">
                          {drop.map_slug.replace(/-/g, ' ')}
                        </MaybeLink>
                      </p>
                    )}
                  </div>
                  {drop.drop_rate && (
                    <span className="chip shrink-0 border border-ember-400/30 bg-ember-500/10 font-bold text-ember-300">{drop.drop_rate}</span>
                  )}
                </li>
              ))}
            </ul>
          </ContentSection>
        )}

        {/* Upgrade Bilgisi */}
        {item.upgrade_max > 0 && (
          <ContentSection id="upgrade-bilgisi" title={`${item.name} Upgrade Rehberi`}>
            <div className="card p-5 sm:p-6">
              <p className="leading-relaxed text-fg-2">
                {item.name} maksimum <strong className="text-fg">+{item.upgrade_max}</strong> seviyesine kadar upgrade edilebilir.
                +7 ve üzerinde upgrade başarısızlık riski önemli ölçüde artar. Upgrade yapmadan önce
                yeterli upgrade materyali hazırlamanız önerilir.
              </p>
              <div aria-hidden="true" className="mt-5 flex gap-1">
                {Array.from({ length: item.upgrade_max }, (_, i) => (
                  <span
                    key={i}
                    className={`h-2 flex-1 rounded-full ${i < 6 ? 'bg-emerald-400/70' : 'bg-ember-500/80'}`}
                  />
                ))}
              </div>
              <div aria-hidden="true" className="mt-2 flex justify-between text-xs text-fg-4">
                <span>+1</span>
                <span>+{item.upgrade_max}</span>
              </div>
            </div>
          </ContentSection>
        )}

        {/* İçerik */}
        {item.content && (
          <ContentSection id="detayli-bilgi" title="Detaylı Bilgi">
            <RichText text={item.content} />
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
