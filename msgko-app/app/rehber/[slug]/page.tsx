import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { KO_CLASSES, getAllClassSlugs, getClassBySlug } from '@/lib/ko-data/classes'
import {
  buildGuideMetadata,
  buildGuideBreadcrumbs,
  buildBreadcrumbSchema,
  buildArticleSchema,
  buildFAQSchema,
  buildClassFAQs,
  BASE_URL,
} from '@/lib/seo'

export async function generateStaticParams() {
  return getAllClassSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cls = getClassBySlug(slug)
  if (!cls) return {}
  return buildGuideMetadata(cls)
}

export default async function RehberDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cls = getClassBySlug(slug)
  if (!cls) notFound()

  const breadcrumbs = buildGuideBreadcrumbs(cls)
  const faqs = buildClassFAQs(cls)

  const schemas = [
    buildBreadcrumbSchema(breadcrumbs),
    buildArticleSchema({
      title: `Knight Online ${cls.name} Rehberi`,
      description: cls.excerpt,
      url: `/rehber/${cls.guideSlug}`,
      updatedAt: new Date().toISOString(),
    }),
    buildFAQSchema(faqs),
  ]

  const relatedClasses = KO_CLASSES.filter((c) => c.slug !== cls.slug)

  const DIFF_LABEL: Record<string, { label: string; color: string }> = {
    basit: { label: 'Başlangıç',  color: '#10b981' },
    orta:  { label: 'Orta',       color: '#f59e0b' },
    ileri: { label: 'İleri',      color: '#ef4444' },
  }
  const diff = DIFF_LABEL[cls.difficulty]

  return (
    <>
      <Script
        id="rehber-detail-schema"
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
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center text-4xl
              border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <span aria-hidden="true">{cls.icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <p className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-purple-400/60">
                  KARAKTERİ REHBERİ
                </p>
                <span className="text-[0.6rem] font-bold tracking-[0.15em] uppercase px-2 py-0.5 border border-white/10"
                  style={{ color: diff.color }}>
                  {diff.label}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-[0.04em] uppercase text-white mb-3"
                style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                Knight Online {cls.name} Rehberi
              </h1>
              <p className="text-[0.88rem] leading-[1.85] text-white/55 max-w-2xl">
                {cls.description}
              </p>
            </div>
          </div>
        </header>

        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">

            {/* Ana İçerik */}
            <div className="flex flex-col gap-10">

              {/* Genel Bilgi */}
              <section aria-labelledby="genel-bilgi">
                <h2 id="genel-bilgi" className="section-title">
                  {cls.name} Hakkında
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Ana Stat',    value: cls.primaryStat },
                    { label: 'İkincil Stat',value: cls.secondaryStat },
                    { label: 'Master NPC',  value: cls.masterNPC.split(' — ')[0] },
                    { label: 'Human Unvanı',value: cls.masterTitle.human },
                    { label: 'Karus Unvanı',value: cls.masterTitle.karus },
                  ].map((item) => (
                    <div key={item.label} className="p-3 border border-white/[0.06]"
                      style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <p className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-1">{item.label}</p>
                      <p className="text-[0.8rem] font-semibold text-white/80">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 border border-white/[0.06]"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <p className="text-[0.65rem] tracking-[0.2em] uppercase text-white/30 mb-2">Irk Seçenekleri</p>
                  <div className="flex flex-wrap gap-2">
                    {cls.races.map((r) => (
                      <span key={r} className="text-[0.72rem] px-2.5 py-1"
                        style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)' }}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Oynanış Stili */}
              <section aria-labelledby="oynanis">
                <h2 id="oynanis" className="section-title">
                  {cls.name} Nasıl Oynanır?
                </h2>
                <p className="text-[0.84rem] leading-[1.9] text-white/55 whitespace-pre-line">
                  {cls.playstyle}
                </p>
              </section>

              {/* Stat / Build Dağılımları */}
              {cls.statBuilds.length > 0 && (
                <section aria-labelledby="stat-dagilimi">
                  <h2 id="stat-dagilimi" className="section-title">
                    {cls.name} Stat ve Build Dağılımı
                  </h2>
                  <p className="text-[0.78rem] text-white/35 mb-4">
                    Aşağıdaki dağılımlar öneri niteliği taşımaktadır — farklı build&#39;lere göre farklı dağılımlar tercih edilebilir.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cls.statBuilds.map((build) => (
                      <div key={build.name} className="p-5 border border-white/[0.07]"
                        style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <h3 className="text-[0.88rem] font-black tracking-[0.05em] uppercase text-white mb-2"
                          style={{ fontFamily: 'var(--font-rajdhani)' }}>
                          {build.name}
                        </h3>
                        <p className="text-[0.8rem] font-semibold mb-2" style={{ color: cls.color }}>
                          {build.distribution}
                        </p>
                        <p className="text-[0.74rem] leading-[1.7] text-white/40">{build.notes}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skill Ağaçları */}
              {cls.skillTrees.length > 0 && (
                <section aria-labelledby="skill-agaclari">
                  <h2 id="skill-agaclari" className="section-title">
                    {cls.name} Skill&#39;leri
                  </h2>
                  <div className="flex flex-col gap-5">
                    {cls.skillTrees.map((tree) => (
                      <details key={tree.name} className="group border border-white/[0.06]"
                        style={{ background: 'rgba(255,255,255,0.015)' }}>
                        <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none">
                          <h3 className="text-[0.84rem] font-black tracking-[0.1em] uppercase text-white/80"
                            style={{ fontFamily: 'var(--font-rajdhani)' }}>
                            {tree.name} <span className="text-white/30 font-normal text-[0.72rem] ml-2">({tree.skills.length} skill)</span>
                          </h3>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" className="flex-shrink-0 transition-transform duration-200 group-open:rotate-180 text-white/30" aria-hidden="true">
                            <path d="M6 9l6 6 6-6"/>
                          </svg>
                        </summary>
                        <div className="overflow-x-auto">
                          <table className="w-full text-[0.76rem]">
                            <thead>
                              <tr className="border-t border-white/[0.05]">
                                <th className="text-left py-2 px-4 text-[0.62rem] tracking-[0.15em] uppercase text-white/30 font-semibold w-20">Seviye</th>
                                <th className="text-left py-2 px-4 text-[0.62rem] tracking-[0.15em] uppercase text-white/30 font-semibold w-40">Skill Adı</th>
                                <th className="text-left py-2 px-4 text-[0.62rem] tracking-[0.15em] uppercase text-white/30 font-semibold">Açıklama</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tree.skills.map((skill, i) => (
                                <tr key={i} className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                  <td className="py-2 px-4 text-white/40 font-mono">
                                    {skill.level === 0 ? '—' : `${skill.level}`}
                                  </td>
                                  <td className="py-2 px-4 font-semibold text-white/75">{skill.name}</td>
                                  <td className="py-2 px-4 text-white/45 leading-relaxed">{skill.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* Master Açma */}
              <section aria-labelledby="master-acma">
                <h2 id="master-acma" className="section-title">
                  {cls.name} Master Nasıl Açılır?
                </h2>
                <div className="p-5 border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <p className="text-[0.8rem] font-semibold text-white/70 mb-4">
                    Gerekli eşyalar (3 adet):
                  </p>
                  <ul className="flex flex-col gap-2.5 mb-5">
                    {cls.masterRequirements.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[0.78rem] text-white/55">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cls.color }} aria-hidden="true"/>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t border-white/[0.06]">
                    <p className="text-[0.78rem] text-white/55">
                      <span className="text-white/70 font-semibold">NPC:</span> {cls.masterRequirements.npcLocation}
                    </p>
                    {cls.masterRequirements.notes && (
                      <p className="text-[0.74rem] text-white/35 mt-2">{cls.masterRequirements.notes}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* İleri Seviye Skill Açma */}
              <section aria-labelledby="ileri-skill">
                <h2 id="ileri-skill" className="section-title">
                  {cls.name} 70–80 Skill&#39;lerini Açma
                </h2>
                <p className="text-[0.78rem] text-white/40 mb-4">
                  21 Şubat 2019 güncellemesiyle birlikte tüm sınıflar için skill açma gereksinimleri basitleştirildi.
                  Yüksek seviye skill&#39;ler için <strong className="text-white/60">Spell Stone Powder</strong> kullanılır.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-[0.78rem] border border-white/[0.06]">
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                        {['70', '72', '74', '75', '76', '78', '80'].map((lvl) => (
                          <th key={lvl} className="px-4 py-2.5 text-[0.65rem] tracking-[0.1em] uppercase text-white/40 font-semibold">
                            Lv. {lvl}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-white/[0.05]">
                        {[
                          cls.highSkillRequirements.level70,
                          cls.highSkillRequirements.level72,
                          cls.highSkillRequirements.level74,
                          cls.highSkillRequirements.level75,
                          cls.highSkillRequirements.level76,
                          cls.highSkillRequirements.level78,
                          cls.highSkillRequirements.level80,
                        ].map((val, i) => (
                          <td key={i} className="px-4 py-2.5 text-center text-white/60">
                            {val ? `${val}x` : '—'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[0.7rem] text-white/25 mt-2">Spell Stone Powder miktarları</p>
              </section>

              {/* İpuçları */}
              {cls.tips.length > 0 && (
                <section aria-labelledby="ipuclari">
                  <h2 id="ipuclari" className="section-title">
                    {cls.name} İpuçları ve Taktikler
                  </h2>
                  <ul className="flex flex-col gap-3">
                    {cls.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 p-4 border border-white/[0.05]"
                        style={{ background: 'rgba(255,255,255,0.01)' }}>
                        <span className="mt-0.5 text-[0.72rem] font-bold text-white/20 flex-shrink-0 w-5">{i + 1}.</span>
                        <p className="text-[0.8rem] leading-[1.8] text-white/55">{tip}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* SSS */}
              <section aria-labelledby="sss">
                <h2 id="sss" className="section-title">
                  Sık Sorulan Sorular
                </h2>
                <div className="flex flex-col gap-3">
                  {faqs.map((faq, i) => (
                    <details key={i} className="group border border-white/[0.06] p-4"
                      style={{ background: 'rgba(255,255,255,0.015)' }}>
                      <summary className="text-[0.82rem] font-semibold text-white/80 cursor-pointer list-none
                        flex items-center justify-between gap-3 group-open:text-white">
                        <span>{faq.question}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2" className="flex-shrink-0 transition-transform group-open:rotate-180 text-white/30" aria-hidden="true">
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
                {/* Hızlı Bilgi */}
                <div className="p-5 border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <h3 className="text-[0.72rem] font-bold tracking-[0.2em] uppercase text-white/60 mb-4">
                    HIZLI BİLGİ
                  </h3>
                  <dl className="flex flex-col gap-3">
                    <div>
                      <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">Birincil Stat</dt>
                      <dd className="text-[0.82rem] font-semibold text-white">{cls.primaryStat}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">Zorluk</dt>
                      <dd className="text-[0.82rem] font-semibold" style={{ color: diff.color }}>{diff.label}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">Master (Human)</dt>
                      <dd className="text-[0.82rem] font-semibold text-white">{cls.masterTitle.human}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">Master (Karus)</dt>
                      <dd className="text-[0.82rem] font-semibold text-white">{cls.masterTitle.karus}</dd>
                    </div>
                  </dl>
                </div>

                {/* Roller */}
                <div className="p-5 border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <h3 className="text-[0.72rem] font-bold tracking-[0.2em] uppercase text-white/60 mb-4">ROLLER</h3>
                  <div className="flex flex-wrap gap-2">
                    {cls.role.map((r) => (
                      <span key={r} className="text-[0.68rem] font-medium px-2.5 py-1"
                        style={{ background: `${cls.color}18`, color: cls.color, border: `1px solid ${cls.color}30` }}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Diğer Rehberler */}
                <div className="p-5 border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <h3 className="text-[0.72rem] font-bold tracking-[0.2em] uppercase text-white/60 mb-4">
                    DİĞER REHBERLER
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {relatedClasses.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/rehber/${c.guideSlug}`}
                          className="flex items-center gap-2.5 text-[0.78rem] text-white/40
                            hover:text-white/80 transition-colors duration-200 py-1">
                          <span aria-hidden="true">{c.icon}</span>
                          <span>{c.name} Rehberi</span>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link href="/rehber" className="text-[0.72rem] tracking-[0.1em] uppercase text-purple-400/50
                        hover:text-purple-400 transition-colors duration-200 mt-1 inline-block">
                        Tüm Rehberler →
                      </Link>
                    </li>
                  </ul>
                </div>

              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Inline styles (section-title yardımcı sınıfı) */}
      <style>{`
        .section-title {
          font-family: var(--font-rajdhani), sans-serif;
          font-size: 1.1rem;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: white;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
      `}</style>
    </>
  )
}
