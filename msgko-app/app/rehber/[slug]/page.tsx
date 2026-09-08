import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import {
  KO_CLASSES,
  getAllClassSlugs,
  getClassBySlug,
} from '@/lib/ko-data/classes'
import {
  buildGuideMetadata,
  buildGuideBreadcrumbs,
  buildBreadcrumbSchema,
  buildArticleSchema,
  buildFAQSchema,
  buildHowToSchema,
  buildClassFAQs,
  BASE_URL,
} from '@/lib/seo'

// ── SSG — tüm sınıf slug'larını build-time'da üret ────────────────────────────
export async function generateStaticParams() {
  return getAllClassSlugs().map((slug) => ({ slug }))
}

// ── Metadata ────────────────────────────────────────────────────────────────
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

// ── Sayfa ────────────────────────────────────────────────────────────────────
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
      publishedAt: '2025-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
      author: 'musaagll',
    }),
    buildFAQSchema(faqs),
    buildHowToSchema({
      name: `Knight Online ${cls.name} Nasıl Oynanır?`,
      description: cls.description,
      steps: [
        { name: 'Stat Dağılımı', text: `${cls.name} için ana stat ${cls.primaryStat}, ikincil stat ${cls.secondaryStat} olarak dağıtılmalıdır.` },
        { name: 'Skill Dizilimi', text: `${cls.name} sınıfı için uygun skillları doğru sırayla öğren ve seviyele.` },
        { name: 'Item Seçimi', text: `Level aralığına uygun item'ları edin. Rehberimizdeki önerilere göz at.` },
        { name: 'Combo Pratiği', text: `${cls.name} için combo sırasını pratik yaparak öğren.` },
        { name: 'PK Taktikleri', text: `PvP'de ${cls.name} ile etkili olmak için harita bilgisi ve rakip sınıf analizine odaklan.` },
      ],
    }),
  ]

  // İlgili diğer sınıf rehberleri (mevcut sınıf hariç)
  const relatedClasses = KO_CLASSES.filter((c) => c.slug !== cls.slug).slice(0, 3)

  return (
    <>
      <Script
        id="rehber-detail-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <main className="min-h-screen" style={{ background: '#07070B' }}>
        {/* ── Breadcrumb ── */}
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

        {/* ── Hero ── */}
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
                <span className="text-[0.6rem] font-bold tracking-[0.15em] uppercase px-2 py-0.5 border"
                  style={{
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: cls.difficulty === 'basit' ? '#10b981' : cls.difficulty === 'ileri' ? '#ef4444' : '#f59e0b',
                  }}>
                  {cls.difficulty === 'basit' ? 'BAŞLANGIÇ' : cls.difficulty === 'ileri' ? 'İLERİ' : 'ORTA'}
                </span>
                <span className="text-[0.6rem] font-bold tracking-[0.15em] uppercase px-2 py-0.5 border border-white/10 text-white/30">
                  USKO
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-[0.04em] uppercase text-white mb-3"
                style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                Knight Online {cls.name} Rehberi
              </h1>
              <p className="text-[0.88rem] leading-[1.8] text-white/50 max-w-2xl">
                {cls.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {cls.role.map((r) => (
                  <span key={r} className="text-[0.62rem] font-medium tracking-[0.08em] uppercase px-2.5 py-1"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">

            {/* ── Ana İçerik ── */}
            <div>

              {/* Genel Bilgi */}
              <section className="mb-10" aria-labelledby="genel-bilgi">
                <h2 id="genel-bilgi" className="text-lg font-black tracking-[0.06em] uppercase text-white mb-4 pb-3 border-b border-white/[0.06]"
                  style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                  {cls.name} Nasıl Oynanır?
                </h2>
                <p className="text-[0.84rem] leading-[1.9] text-white/55 mb-4">
                  {cls.description}
                </p>
                <p className="text-[0.84rem] leading-[1.9] text-white/55">
                  <strong className="text-white/80">Oynanış biçimi:</strong> {cls.playstyle}
                </p>
              </section>

              {/* Stat Dağılımı */}
              <section className="mb-10" aria-labelledby="stat-dagilimi">
                <h2 id="stat-dagilimi" className="text-lg font-black tracking-[0.06em] uppercase text-white mb-4 pb-3 border-b border-white/[0.06]"
                  style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                  {cls.name} Stat Dağılımı
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <p className="text-[0.65rem] tracking-[0.2em] uppercase text-white/30 mb-1">Ana Stat</p>
                    <p className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-rajdhani)' }}>{cls.primaryStat}</p>
                  </div>
                  <div className="p-4 border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <p className="text-[0.65rem] tracking-[0.2em] uppercase text-white/30 mb-1">İkincil Stat</p>
                    <p className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-rajdhani)' }}>{cls.secondaryStat}</p>
                  </div>
                </div>
                <p className="text-[0.78rem] leading-[1.75] text-white/40 mt-4">
                  {cls.name} için stat dağılımı oynanış stiline göre değişir. PvP odaklı build ile
                  farm/PvE build farklı stat önceliklerine sahiptir. Detaylı build rehberleri için{' '}
                  <Link href="/build" className="text-purple-400/70 hover:text-purple-400 transition-colors">
                    build sayfamızı
                  </Link>{' '}
                  ziyaret edebilirsin.
                </p>
              </section>

              {/* Roller */}
              <section className="mb-10" aria-labelledby="roller">
                <h2 id="roller" className="text-lg font-black tracking-[0.06em] uppercase text-white mb-4 pb-3 border-b border-white/[0.06]"
                  style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                  {cls.name} Oynanış Rolleri
                </h2>
                <ul className="flex flex-col gap-3">
                  {cls.role.map((r) => (
                    <li key={r} className="flex items-center gap-3 text-[0.82rem] text-white/60">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cls.color }} aria-hidden="true" />
                      {r}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Sık Sorulan Sorular */}
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
                      <p className="mt-3 text-[0.78rem] leading-[1.8] text-white/45">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>

            </div>

            {/* ── Sidebar ── */}
            <aside>
              {/* Hızlı Bilgi */}
              <div className="sticky top-24 flex flex-col gap-4">
                <div className="p-5 border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <h3 className="text-[0.72rem] font-bold tracking-[0.2em] uppercase text-white/60 mb-4">
                    HIZLI BİLGİ
                  </h3>
                  <dl className="flex flex-col gap-3">
                    <div>
                      <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">Sınıf</dt>
                      <dd className="text-[0.82rem] font-semibold text-white">{cls.nameEn}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">Irk</dt>
                      <dd className="text-[0.82rem] font-semibold text-white">
                        {cls.race === 'both' ? 'Human & Karus' : cls.race === 'human' ? 'Human' : 'Karus'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">Ana Stat</dt>
                      <dd className="text-[0.82rem] font-semibold text-white">{cls.primaryStat}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.62rem] tracking-[0.15em] uppercase text-white/30 mb-0.5">Zorluk</dt>
                      <dd className="text-[0.82rem] font-semibold"
                        style={{ color: cls.difficulty === 'basit' ? '#10b981' : cls.difficulty === 'ileri' ? '#ef4444' : '#f59e0b' }}>
                        {cls.difficulty === 'basit' ? 'Başlangıç' : cls.difficulty === 'ileri' ? 'İleri' : 'Orta'}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Tüm Sınıflar */}
                <div className="p-5 border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <h3 className="text-[0.72rem] font-bold tracking-[0.2em] uppercase text-white/60 mb-4">
                    DİĞER REHBERLER
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {relatedClasses.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/rehber/${c.guideSlug}`}
                          className="flex items-center gap-2.5 text-[0.78rem] text-white/40 hover:text-white/80 transition-colors duration-200 py-1">
                          <span aria-hidden="true">{c.icon}</span>
                          <span>{c.name} Rehberi</span>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link href="/rehber" className="text-[0.72rem] tracking-[0.1em] uppercase text-purple-400/50
                        hover:text-purple-400 transition-colors duration-200 mt-1 inline-block">
                        Tüm Rehberleri Gör →
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>
    </>
  )
}
