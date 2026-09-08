import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { KO_ITEMS, getItemBySlug, getPublishedItemSlugs } from '@/lib/ko-data/items'
import {
  buildItemMetadata,
  buildItemBreadcrumbs,
  buildBreadcrumbSchema,
  buildArticleSchema,
  buildFAQSchema,
  buildItemFAQs,
  BASE_URL,
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
  if (!item) return {}
  return buildItemMetadata(item)
}

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = getItemBySlug(slug)
  if (!item) notFound()

  const breadcrumbs = buildItemBreadcrumbs(item)
  const faqs = buildItemFAQs(item)

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

  const STAT_LABELS: Record<string, string> = {
    ap: 'AP (Saldırı)', ac: 'AC (Savunma)', hp: 'HP', mp: 'MP',
    str: 'STR', dex: 'DEX', int: 'INT', ap_range: 'AP Menzil',
  }

  return (
    <>
      <Script
        id="item-detail-schema"
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
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase px-2 py-0.5 border border-white/10 text-white/40">
              {item.item_type}
            </span>
            <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase px-2 py-0.5"
              style={{
                color: item.item_grade === 'unique' ? '#f59e0b' : item.item_grade === 'legendary' ? '#8b5cf6' : 'rgba(255,255,255,0.4)',
                background: item.item_grade === 'unique' ? 'rgba(245,158,11,0.1)' : item.item_grade === 'legendary' ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.04)',
              }}>
              {item.item_grade}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-[0.04em] uppercase text-white mb-3"
            style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
            Knight Online {item.name}
          </h1>
          {item.description && (
            <p className="text-[0.88rem] leading-[1.8] text-white/50 max-w-2xl">{item.description}</p>
          )}
        </header>

        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">

            <div>
              {/* Özellikler */}
              <section className="mb-10" aria-labelledby="ozellikler">
                <h2 id="ozellikler" className="text-lg font-black tracking-[0.06em] uppercase text-white mb-4 pb-3 border-b border-white/[0.06]"
                  style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                  {item.name} Özellikleri
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(item.base_stats).map(([stat, val]) => (
                    <div key={stat} className="p-4 border border-white/[0.06]"
                      style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <p className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-1">
                        {STAT_LABELS[stat] ?? stat.toUpperCase()}
                      </p>
                      <p className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-rajdhani)' }}>
                        +{val}
                      </p>
                    </div>
                  ))}
                </div>

                {item.bonus_stats.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[0.72rem] font-bold tracking-[0.15em] uppercase text-white/40 mb-3">Bonus Statlar</p>
                    <div className="flex flex-wrap gap-2">
                      {item.bonus_stats.map((b, i) => (
                        <span key={i} className="text-[0.72rem] px-3 py-1.5"
                          style={{ background: 'rgba(245,158,11,0.08)', color: 'rgba(245,158,11,0.8)', border: '1px solid rgba(245,158,11,0.2)' }}>
                          +{b.value} {b.stat.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Drop Bilgisi */}
              {item.drop_info.length > 0 && (
                <section className="mb-10" aria-labelledby="drop-bilgisi">
                  <h2 id="drop-bilgisi" className="text-lg font-black tracking-[0.06em] uppercase text-white mb-4 pb-3 border-b border-white/[0.06]"
                    style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                    {item.name} Nereden Düşer?
                  </h2>
                  <div className="flex flex-col gap-3">
                    {item.drop_info.map((drop, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border border-white/[0.06]"
                        style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div>
                          <p className="text-[0.82rem] font-semibold text-white/70">
                            {drop.mob_slug ? (
                              <Link href={`/boss/${drop.mob_slug}`} className="hover:text-white transition-colors">
                                {drop.mob_name ?? drop.mob_slug}
                              </Link>
                            ) : (drop.mob_name ?? 'Bilinmiyor')}
                          </p>
                          {drop.map_slug && (
                            <p className="text-[0.68rem] text-white/30 mt-0.5">
                              <Link href={`/harita/${drop.map_slug}`} className="hover:text-white/50 transition-colors">
                                {drop.map_slug.replace(/-/g, ' ')}
                              </Link>
                            </p>
                          )}
                        </div>
                        {drop.drop_rate && (
                          <span className="text-[0.72rem] font-bold text-amber-400/70">{drop.drop_rate}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Upgrade Bilgisi */}
              {item.upgrade_max > 0 && (
                <section className="mb-10" aria-labelledby="upgrade-bilgisi">
                  <h2 id="upgrade-bilgisi" className="text-lg font-black tracking-[0.06em] uppercase text-white mb-4 pb-3 border-b border-white/[0.06]"
                    style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                    {item.name} Upgrade Rehberi
                  </h2>
                  <p className="text-[0.84rem] leading-[1.9] text-white/50 mb-4">
                    {item.name} maksimum <strong className="text-white/70">+{item.upgrade_max}</strong> seviyesine kadar upgrade edilebilir.
                    +7 ve üzerinde upgrade başarısızlık riski önemli ölçüde artar. Upgrade yapmadan önce
                    yeterli upgrade materyali hazırlamanız önerilir.
                  </p>
                </section>
              )}

              {/* İçerik */}
              {item.content && (
                <section className="mb-10" aria-labelledby="detayli-bilgi">
                  <h2 id="detayli-bilgi" className="text-lg font-black tracking-[0.06em] uppercase text-white mb-4 pb-3 border-b border-white/[0.06]"
                    style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                    Detaylı Bilgi
                  </h2>
                  <div className="text-[0.84rem] leading-[1.9] text-white/50 whitespace-pre-line">
                    {item.content}
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
                <div className="p-5 border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <h3 className="text-[0.72rem] font-bold tracking-[0.2em] uppercase text-white/60 mb-4">ITEM BİLGİSİ</h3>
                  <dl className="flex flex-col gap-3">
                    <div>
                      <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">Min Level</dt>
                      <dd className="text-[0.82rem] font-semibold text-white">{item.min_level}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">Nadirlik</dt>
                      <dd className="text-[0.82rem] font-semibold capitalize"
                        style={{ color: item.item_grade === 'unique' ? '#f59e0b' : item.item_grade === 'legendary' ? '#8b5cf6' : 'rgba(255,255,255,0.6)' }}>
                        {item.item_grade}
                      </dd>
                    </div>
                    {item.character_class.length > 0 && (
                      <div>
                        <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">Sınıf</dt>
                        <dd className="text-[0.82rem] font-semibold text-white">{item.character_class.join(', ')}</dd>
                      </div>
                    )}
                    {item.upgrade_max > 0 && (
                      <div>
                        <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">Max Upgrade</dt>
                        <dd className="text-[0.82rem] font-semibold text-white">+{item.upgrade_max}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">Irk</dt>
                      <dd className="text-[0.82rem] font-semibold text-white capitalize">{item.race}</dd>
                    </div>
                  </dl>
                </div>

                {relatedItems.length > 0 && (
                  <div className="p-5 border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <h3 className="text-[0.72rem] font-bold tracking-[0.2em] uppercase text-white/60 mb-4">BENZER İTEMLAR</h3>
                    <ul className="flex flex-col gap-2">
                      {relatedItems.map((rel) => (
                        <li key={rel.slug}>
                          <Link href={`/item/${rel.slug}`}
                            className="text-[0.78rem] text-white/40 hover:text-white/80 transition-colors flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-amber-500/50 flex-shrink-0" aria-hidden="true"/>
                            {rel.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link href="/item" className="text-[0.72rem] tracking-[0.1em] uppercase
                          text-purple-400/50 hover:text-purple-400 transition-colors mt-1 inline-block">
                          Tüm İtemler →
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
