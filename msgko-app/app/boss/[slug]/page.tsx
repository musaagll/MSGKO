import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { KO_BOSSES, getBossBySlug, getPublishedBossSlugs } from '@/lib/ko-data/bosses'
import {
  buildBossMetadata,
  buildBossBreadcrumbs,
  buildBreadcrumbSchema,
  buildArticleSchema,
  buildFAQSchema,
  buildBossFAQs,
  BASE_URL,
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
  if (!boss) return {}
  return buildBossMetadata(boss)
}

export default async function BossDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const boss = getBossBySlug(slug)
  if (!boss) notFound()

  const breadcrumbs = buildBossBreadcrumbs(boss)
  const faqs = buildBossFAQs(boss)

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

  return (
    <>
      <Script
        id="boss-detail-schema"
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
            <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase px-2 py-0.5 border"
              style={{ borderColor: 'rgba(239,68,68,0.3)', color: 'rgba(239,68,68,0.8)' }}>
              {boss.boss_type === 'world' ? 'WORLD BOSS' : boss.boss_type === 'dungeon' ? 'DUNGEON BOSS' : 'BOSS'}
            </span>
            {boss.level && (
              <span className="text-[0.6rem] tracking-[0.1em] uppercase text-white/30">
                Lv. {boss.level}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-[0.04em] uppercase text-white mb-3"
            style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
            Knight Online {boss.name}
          </h1>
          {boss.description && (
            <p className="text-[0.88rem] leading-[1.8] text-white/50 max-w-2xl">
              {boss.description}
            </p>
          )}
        </header>

        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">

            {/* Ana İçerik */}
            <div>

              {/* Spawn Bilgisi */}
              <section className="mb-10" aria-labelledby="spawn-bilgisi">
                <h2 id="spawn-bilgisi" className="text-lg font-black tracking-[0.06em] uppercase text-white mb-4 pb-3 border-b border-white/[0.06]"
                  style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                  {boss.name} Nerede ve Ne Zaman Çıkar?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {boss.map_slug && (
                    <div className="p-4 border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <p className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-1">Harita</p>
                      <Link href={`/harita/${boss.map_slug}`}
                        className="text-[0.82rem] font-semibold text-purple-400/80 hover:text-purple-400 transition-colors">
                        {boss.map_slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Link>
                    </div>
                  )}
                  {boss.spawn_interval && (
                    <div className="p-4 border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <p className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-1">Spawn Aralığı</p>
                      <p className="text-[0.82rem] font-semibold text-white">{boss.spawn_interval}</p>
                    </div>
                  )}
                  {boss.spawn_coords && (
                    <div className="p-4 border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <p className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-1">Konum</p>
                      <p className="text-[0.82rem] font-semibold text-white">{boss.spawn_coords}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Drop Listesi */}
              {boss.drop_list.length > 0 && (
                <section className="mb-10" aria-labelledby="drop-listesi">
                  <h2 id="drop-listesi" className="text-lg font-black tracking-[0.06em] uppercase text-white mb-4 pb-3 border-b border-white/[0.06]"
                    style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                    {boss.name} Drop Listesi
                  </h2>
                  <p className="text-[0.78rem] text-white/40 mb-4">
                    {boss.name}&#39;u öldürdüğünüzde aşağıdaki item&#39;lar düşebilir:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[0.78rem]">
                      <thead>
                        <tr className="border-b border-white/[0.06]">
                          <th className="text-left py-2.5 px-3 text-[0.65rem] tracking-[0.15em] uppercase text-white/40 font-semibold">Item</th>
                          <th className="text-left py-2.5 px-3 text-[0.65rem] tracking-[0.15em] uppercase text-white/40 font-semibold">Drop Oranı</th>
                          <th className="text-left py-2.5 px-3 text-[0.65rem] tracking-[0.15em] uppercase text-white/40 font-semibold">Upgrade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {boss.drop_list.map((drop, i) => (
                          <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                            <td className="py-2.5 px-3">
                              {drop.item_slug ? (
                                <Link href={`/item/${drop.item_slug}`}
                                  className="text-white/70 hover:text-white transition-colors">
                                  {drop.item_name}
                                </Link>
                              ) : (
                                <span className="text-white/70">{drop.item_name}</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-white/40">{drop.drop_rate ?? '—'}</td>
                            <td className="py-2.5 px-3 text-white/40">{drop.upgrade_range ?? '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Content */}
              {boss.content && (
                <section className="mb-10 prose-ko" aria-labelledby="rehber-icerik">
                  <h2 id="rehber-icerik" className="text-lg font-black tracking-[0.06em] uppercase text-white mb-4 pb-3 border-b border-white/[0.06]"
                    style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                    {boss.name} Rehberi
                  </h2>
                  <div className="text-[0.84rem] leading-[1.9] text-white/50 whitespace-pre-line">
                    {boss.content}
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
                  {faqs.map((faq, i) => (
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
                {/* İstatistikler */}
                <div className="p-5 border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <h3 className="text-[0.72rem] font-bold tracking-[0.2em] uppercase text-white/60 mb-4">İSTATİSTİKLER</h3>
                  <dl className="flex flex-col gap-3">
                    {boss.level && (
                      <div>
                        <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">Level</dt>
                        <dd className="text-[0.82rem] font-semibold text-white">{boss.level}</dd>
                      </div>
                    )}
                    {boss.hp && (
                      <div>
                        <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">HP</dt>
                        <dd className="text-[0.82rem] font-semibold text-white">{boss.hp.toLocaleString('tr-TR')}</dd>
                      </div>
                    )}
                    {boss.element && boss.element !== 'none' && (
                      <div>
                        <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">Element</dt>
                        <dd className="text-[0.82rem] font-semibold text-white capitalize">{boss.element}</dd>
                      </div>
                    )}
                    {boss.spawn_interval && (
                      <div>
                        <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">Spawn</dt>
                        <dd className="text-[0.82rem] font-semibold text-white">{boss.spawn_interval}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* İlgili Boss'lar */}
                {relatedBosses.length > 0 && (
                  <div className="p-5 border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <h3 className="text-[0.72rem] font-bold tracking-[0.2em] uppercase text-white/60 mb-4">DİĞER BOSS&#39;LAR</h3>
                    <ul className="flex flex-col gap-2">
                      {relatedBosses.map((b) => (
                        <li key={b.slug}>
                          <Link href={`/boss/${b.slug}`}
                            className="text-[0.78rem] text-white/40 hover:text-white/80 transition-colors flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-red-500/50 flex-shrink-0" aria-hidden="true"/>
                            {b.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link href="/boss" className="text-[0.72rem] tracking-[0.1em] uppercase
                          text-purple-400/50 hover:text-purple-400 transition-colors mt-1 inline-block">
                          Tüm Boss&#39;ları Gör →
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
