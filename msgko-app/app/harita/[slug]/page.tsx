import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { KO_MAPS, getMapBySlug, getPublishedMapSlugs } from '@/lib/ko-data/maps'
import {
  buildMapMetadata,
  buildMapBreadcrumbs,
  buildBreadcrumbSchema,
  buildArticleSchema,
  buildFAQSchema,
  buildPlaceSchema,
  BASE_URL,
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
  if (!map) return {}
  return buildMapMetadata(map)
}

export default async function HaritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const map = getMapBySlug(slug)
  if (!map) notFound()

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

  return (
    <>
      <Script
        id="harita-detail-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <main className="min-h-screen" style={{ background: '#07070B' }}>
        {/* Breadcrumb */}
        <nav aria-label="Sayfa konumu" className="max-w-[1280px] mx-auto px-6 sm:px-8 pt-24 pb-2">
          <ol className="flex flex-wrap items-center gap-1.5 text-[0.72rem] text-white/30">
            {breadcrumbs.map((crumb, i) => (
              <li key={crumb.href} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden="true">/</span>}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-white/60">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-white/60 transition-colors">{crumb.label}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Header */}
        <header className="max-w-[1280px] mx-auto px-6 sm:px-8 py-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {map.is_war_zone && (
              <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase px-2 py-0.5 border"
                style={{ borderColor: 'rgba(239,68,68,0.3)', color: 'rgba(239,68,68,0.8)' }}>
                SAVAŞ BÖLGESİ
              </span>
            )}
            {map.has_dungeon && (
              <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase px-2 py-0.5 border"
                style={{ borderColor: 'rgba(139,92,246,0.3)', color: 'rgba(139,92,246,0.8)' }}>
                DUNGEON
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-[0.04em] uppercase text-white mb-3"
            style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
            Knight Online {map.name}
          </h1>
          {map.description && (
            <p className="text-[0.88rem] leading-[1.8] text-white/50 max-w-2xl">{map.description}</p>
          )}
        </header>

        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">

            <div>
              {/* Temel Bilgiler */}
              <section className="mb-10" aria-labelledby="temel-bilgi">
                <h2 id="temel-bilgi" className="text-lg font-black tracking-[0.06em] uppercase text-white mb-4 pb-3 border-b border-white/[0.06]"
                  style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                  Harita Özellikleri
                </h2>
                {map.key_features.length > 0 && (
                  <ul className="flex flex-col gap-2.5">
                    {map.key_features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-[0.82rem] text-white/55">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-purple-500/50" aria-hidden="true"/>
                        {f.text}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Farm Noktaları */}
              {map.farm_spots.length > 0 && (
                <section className="mb-10" aria-labelledby="farm-noktalari">
                  <h2 id="farm-noktalari" className="text-lg font-black tracking-[0.06em] uppercase text-white mb-4 pb-3 border-b border-white/[0.06]"
                    style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                    {map.name} Farm Noktaları
                  </h2>
                  <div className="flex flex-col gap-4">
                    {map.farm_spots.map((spot, i) => (
                      <div key={i} className="p-4 border border-white/[0.06]"
                        style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <h3 className="text-[0.84rem] font-semibold text-white/80 mb-2">{spot.name}</h3>
                        <div className="flex flex-wrap gap-3 text-[0.72rem] text-white/40">
                          {spot.level_range && <span>Level: {spot.level_range}</span>}
                          {spot.notes && <span>{spot.notes}</span>}
                          {spot.mob_types && spot.mob_types.length > 0 && (
                            <span>Moblar: {spot.mob_types.join(', ')}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Boss'lar */}
              {map.bosses_here.length > 0 && (
                <section className="mb-10" aria-labelledby="harita-bosslar">
                  <h2 id="harita-bosslar" className="text-lg font-black tracking-[0.06em] uppercase text-white mb-4 pb-3 border-b border-white/[0.06]"
                    style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                    {map.name}&#39;deki Boss&#39;lar
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {map.bosses_here.map((b) => (
                      <Link key={b.boss_slug} href={`/boss/${b.boss_slug}`}
                        className="px-4 py-2 border border-red-500/20 text-[0.78rem] font-semibold
                          text-red-400/70 hover:text-red-400 hover:border-red-500/40
                          transition-all duration-200">
                        {b.boss_name}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* NPC'ler */}
              {map.npcs_here.length > 0 && (
                <section className="mb-10" aria-labelledby="npcler">
                  <h2 id="npcler" className="text-lg font-black tracking-[0.06em] uppercase text-white mb-4 pb-3 border-b border-white/[0.06]"
                    style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                    NPC&#39;ler
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {map.npcs_here.map((npc, i) => (
                      <div key={i} className="p-3 border border-white/[0.06]"
                        style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <p className="text-[0.82rem] font-semibold text-white/70">{npc.name}</p>
                        <p className="text-[0.72rem] text-white/35 mt-0.5">{npc.function}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* SSS */}
              <section className="mb-10" aria-labelledby="sss">
                <h2 id="sss" className="text-lg font-black tracking-[0.06em] uppercase text-white mb-4 pb-3 border-b border-white/[0.06]"
                  style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                  Sık Sorulan Sorular
                </h2>
                <div className="flex flex-col gap-4">
                  {mapFAQs.map((faq, i) => (
                    <details key={i} className="group border border-white/[0.06] p-4"
                      style={{ background: 'rgba(255,255,255,0.015)' }}>
                      <summary className="text-[0.82rem] font-semibold text-white/80 cursor-pointer list-none
                        flex items-center justify-between gap-3 group-open:text-white">
                        <span>{faq.question}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2" className="flex-shrink-0 transition-transform group-open:rotate-180" aria-hidden="true">
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </summary>
                      <p className="mt-3 text-[0.78rem] leading-[1.8] text-white/45">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside>
              <div className="sticky top-24 flex flex-col gap-4">
                <div className="p-5 border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <h3 className="text-[0.72rem] font-bold tracking-[0.2em] uppercase text-white/60 mb-4">HARİTA BİLGİSİ</h3>
                  <dl className="flex flex-col gap-3">
                    <div>
                      <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">Tür</dt>
                      <dd className="text-[0.82rem] font-semibold text-white capitalize">
                        {{ pve: 'PvE', pvp: 'PvP', dungeon: 'Dungeon', town: 'Kasaba', event: 'Etkinlik' }[map.map_type]}
                      </dd>
                    </div>
                    {(map.min_level || map.max_level) && (
                      <div>
                        <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">Level Aralığı</dt>
                        <dd className="text-[0.82rem] font-semibold text-white">
                          {map.min_level ?? '?'}{map.max_level ? ` — ${map.max_level}` : '+'}
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">PK Bölgesi</dt>
                      <dd className="text-[0.82rem] font-semibold" style={{ color: map.is_pk_zone ? '#ef4444' : '#10b981' }}>
                        {map.is_pk_zone ? 'Evet' : 'Hayır'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">Dungeon</dt>
                      <dd className="text-[0.82rem] font-semibold" style={{ color: map.has_dungeon ? '#8b5cf6' : 'rgba(255,255,255,0.4)' }}>
                        {map.has_dungeon ? 'Var' : 'Yok'}
                      </dd>
                    </div>
                  </dl>
                </div>

                {relatedMaps.length > 0 && (
                  <div className="p-5 border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <h3 className="text-[0.72rem] font-bold tracking-[0.2em] uppercase text-white/60 mb-4">DİĞER HARİTALAR</h3>
                    <ul className="flex flex-col gap-2">
                      {relatedMaps.map((m) => (
                        <li key={m.slug}>
                          <Link href={`/harita/${m.slug}`}
                            className="text-[0.78rem] text-white/40 hover:text-white/80 transition-colors flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-blue-500/50 flex-shrink-0" aria-hidden="true"/>
                            {m.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link href="/harita" className="text-[0.72rem] tracking-[0.1em] uppercase
                          text-purple-400/50 hover:text-purple-400 transition-colors mt-1 inline-block">
                          Tüm Haritalar →
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </aside>

          </div>
        </div>
      </main>
    </>
  )
}
