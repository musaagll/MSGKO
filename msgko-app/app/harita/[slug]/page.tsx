import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Castle, Skull, Swords, Users } from 'lucide-react'
import { JsonLd } from '@/components/seo/JsonLd'
import { MaybeLink } from '@/components/ui/MaybeLink'
import { PageHero } from '@/components/ui/PageHero'
import { FaqList } from '@/components/ui/FaqList'
import { FactList } from '@/components/ui/FactList'
import { RichText } from '@/components/ui/RichText'
import { ArticleLayout, ContentSection, RelatedLinks, SideCard } from '@/components/content/ArticleLayout'
import { MAP_TYPE, levelRange } from '@/components/cards/MapCard'
import { KO_MAPS, getMapBySlug, getPublishedMapSlugs } from '@/lib/ko-data/maps'
import { isPublishedBoss } from '@/lib/ko-data/bosses'
import { SECTION_ART } from '@/lib/class-meta'
import {
  buildMapMetadata,
  buildMapBreadcrumbs,
  buildBreadcrumbSchema,
  buildArticleSchema,
  buildFAQSchema,
  buildPlaceSchema,
} from '@/lib/seo'

export async function generateStaticParams() {
  return getPublishedMapSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const map = getMapBySlug(slug)
  if (!map || !map.is_published) return {}
  return buildMapMetadata(map)
}

export default async function HaritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const map = getMapBySlug(slug)
  if (!map || !map.is_published) notFound()

  const breadcrumbs = buildMapBreadcrumbs(map)

  const mapFAQs = [
    {
      question: `Knight Online ${map.name} nedir?`,
      answer: map.description ?? `${map.name}, Knight Online'ın önemli haritalarından biridir.`,
    },
    {
      question: `Knight Online ${map.name}'de hangi boss'lar var?`,
      answer: map.bosses_here.length
        ? `${map.name} haritasındaki boss'lar: ${map.bosses_here.map((b) => b.boss_name).join(', ')}.`
        : `${map.name} haritasında boss bulunmuyor veya bilgi henüz eklenmedi.`,
    },
    {
      question: `${map.name} farm için uygun mu?`,
      answer: map.farm_spots.length
        ? `Evet, ${map.name}'de ${map.farm_spots.length} adet farm noktası mevcuttur.`
        : `${map.name} farm bilgisi için MSGKO harita sayfasını takip edin.`,
    },
    ...(map.min_level ? [{
      question: `${map.name} için kaç level gerekiyor?`,
      answer: `${map.name} için minimum ${map.min_level} level önerilir${map.max_level ? `, ideal aralık ${map.min_level}—${map.max_level}` : ''}.`,
    }] : []),
  ]

  const schemas = [
    buildBreadcrumbSchema(breadcrumbs),
    buildArticleSchema({
      title: `Knight Online ${map.name} Harita Rehberi`,
      description: map.description ?? '',
      url: `/harita/${map.slug}`,
      updatedAt: new Date().toISOString(),
    }),
    buildFAQSchema(mapFAQs),
    buildPlaceSchema(map),
  ]

  const relatedMaps = KO_MAPS.filter(
    (m) => m.slug !== map.slug && m.is_published && m.map_type === map.map_type
  ).slice(0, 4)

  const type = MAP_TYPE[map.map_type] ?? MAP_TYPE.pve
  const range = levelRange(map.min_level, map.max_level)

  return (
    <>
      <JsonLd data={schemas} />

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow="Harita Rehberi"
        art={{ src: SECTION_ART.harita, position: '60% 40%' }}
        title={<span lang="en">Knight Online {map.name}</span>}
        description={map.description ? <p>{map.description}</p> : undefined}
      >
        <ul className="flex flex-wrap gap-2">
          <li className={`chip border ${type.className}`}>{type.label}</li>
          {map.is_war_zone && (
            <li className="chip border border-red-400/35 bg-red-500/10 text-red-200">
              <Swords size={13} aria-hidden="true" /> Savaş Bölgesi
            </li>
          )}
          {map.has_dungeon && (
            <li className="chip border border-amethyst-400/35 bg-amethyst-500/10 text-amethyst-200">
              <Castle size={13} aria-hidden="true" /> Dungeon
            </li>
          )}
          {range && <li className="chip">Level {range}</li>}
        </ul>
      </PageHero>

      <ArticleLayout
        aside={
          <>
            <SideCard title="Harita Bilgisi">
              <FactList
                columns={2}
                facts={[
                  { label: 'Tür', value: type.label },
                  ...(range ? [{ label: 'Level Aralığı', value: range }] : []),
                  {
                    label: 'PK Bölgesi',
                    value: <span className={map.is_pk_zone ? 'text-red-300' : 'text-emerald-300'}>{map.is_pk_zone ? 'Evet' : 'Hayır'}</span>,
                  },
                  {
                    label: 'Dungeon',
                    value: <span className={map.has_dungeon ? 'text-amethyst-200' : 'text-fg-3'}>{map.has_dungeon ? 'Var' : 'Yok'}</span>,
                  },
                ]}
              />
            </SideCard>
            {relatedMaps.length > 0 && (
              <SideCard title="Diğer Haritalar">
                <RelatedLinks
                  links={relatedMaps.map((m) => ({ label: m.name, href: `/harita/${m.slug}` }))}
                  all={{ label: 'Tüm Haritalar', href: '/harita' }}
                />
              </SideCard>
            )}
          </>
        }
      >
        {/* Temel Bilgiler */}
        <ContentSection id="temel-bilgi" title="Harita Özellikleri">
          {map.key_features.length > 0 && (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {map.key_features.map((f, i) => (
                <li key={i} className="card flex gap-3 p-4 text-fg-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amethyst-400" />
                  {f.text}
                </li>
              ))}
            </ul>
          )}
        </ContentSection>

        {/* Farm Noktaları */}
        {map.farm_spots.length > 0 && (
          <ContentSection id="farm-noktalari" title={`${map.name} Farm Noktaları`}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {map.farm_spots.map((spot, i) => (
                <div key={i} className="card p-5">
                  <h3 className="font-bold">{spot.name}</h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-fg-3">
                    {spot.level_range && <li><span className="text-fg-4">Level:</span> {spot.level_range}</li>}
                    {spot.mob_types && spot.mob_types.length > 0 && (
                      <li><span className="text-fg-4">Moblar:</span> {spot.mob_types.join(', ')}</li>
                    )}
                    {spot.notes && <li>{spot.notes}</li>}
                  </ul>
                </div>
              ))}
            </div>
          </ContentSection>
        )}

        {/* Boss'lar */}
        {map.bosses_here.length > 0 && (
          <ContentSection id="harita-bosslar" title={`${map.name}'deki Boss'lar`}>
            <ul className="flex flex-wrap gap-2">
              {map.bosses_here.map((b) => (
                <li key={b.boss_slug}>
                  <MaybeLink
                    href={isPublishedBoss(b.boss_slug) ? `/boss/${b.boss_slug}` : null}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-ember-400/25 bg-ember-500/7 px-4 font-semibold text-ember-300 transition-colors hover:border-ember-400/50"
                  >
                    <Skull size={16} aria-hidden="true" />
                    {b.boss_name}
                  </MaybeLink>
                </li>
              ))}
            </ul>
          </ContentSection>
        )}

        {/* NPC'ler */}
        {map.npcs_here.length > 0 && (
          <ContentSection id="npcler" title="NPC'ler">
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {map.npcs_here.map((npc, i) => (
                <li key={i} className="card flex items-start gap-3 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-fg-3">
                    <Users size={16} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold text-fg">{npc.name}</span>
                    <span className="block text-sm text-fg-3">{npc.function}</span>
                  </span>
                </li>
              ))}
            </ul>
          </ContentSection>
        )}

        {map.content && (
          <ContentSection id="detayli-bilgi" title="Detaylı Bilgi">
            <RichText text={map.content} />
          </ContentSection>
        )}

        {/* SSS */}
        <ContentSection id="sss" title="Sık Sorulan Sorular">
          <FaqList faqs={mapFAQs} />
        </ContentSection>
      </ArticleLayout>
    </>
  )
}
