import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { KO_CLASSES } from '@/lib/ko-data/classes'
import { buildMetadata, buildBreadcrumbSchema, buildItemListSchema, BASE_URL } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Knight Online Karakter Rehberleri | Warrior, Rogue, Mage, Priest | MSGKO',
  description:
    'Knight Online tüm karakter sınıfları için kapsamlı rehberler. Warrior, Rogue (Assassin/Archer), Mage ve Priest — skill ağaçları, stat dağılımı ve Master açma rehberleri MSGKO\'da.',
  canonical: `${BASE_URL}/rehber`,
  keywords: [
    'knight online rehber', 'knight online karakter rehberi',
    'knight online warrior rehberi', 'knight online rogue rehberi',
    'knight online asas rehberi', 'knight online okçu rehberi',
    'knight online mage rehberi', 'knight online priest rehberi',
    'knight online skill', 'knight online master açma', 'knight online stat',
  ],
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
    items: KO_CLASSES.map((c) => ({
      name: `Knight Online ${c.name} Rehberi`,
      url: `/rehber/${c.guideSlug}`,
      description: c.description.substring(0, 150),
    })),
  }),
]

const CLASS_BG: Record<string, string> = {
  warrior: 'rgba(239,68,68,0.06)',
  rogue:   'rgba(59,130,246,0.06)',
  mage:    'rgba(139,92,246,0.06)',
  priest:  'rgba(16,185,129,0.06)',
}

export default function RehberIndexPage() {
  return (
    <>
      <Script
        id="rehber-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <main className="min-h-screen" style={{ background: '#07070B' }}>
        {/* Breadcrumb */}
        <nav aria-label="Sayfa konumu" className="max-w-[1280px] mx-auto px-6 sm:px-8 pt-24 pb-2">
          <ol className="flex flex-wrap items-center gap-1.5 text-[0.72rem] text-white/30">
            <li><Link href="/" className="hover:text-white/60 transition-colors">Ana Sayfa</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-white/60">Karakter Rehberleri</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="max-w-[1280px] mx-auto px-6 sm:px-8 py-10">
          <p className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-purple-400/60 mb-3">
            REHBER MERKEZİ
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-[0.04em] uppercase text-white mb-4"
            style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
            Knight Online Karakter Rehberleri
          </h1>
          <p className="text-[0.9rem] leading-[1.8] text-white/50 max-w-2xl">
            Knight Online&#39;da 4 temel sınıf bulunur:{' '}
            <strong className="text-white/70">Warrior</strong>,{' '}
            <strong className="text-white/70">Rogue</strong> (Assassin ve Archer),{' '}
            <strong className="text-white/70">Mage</strong> ve{' '}
            <strong className="text-white/70">Priest</strong>.
            Her sınıf için skill ağaçları, stat dağılımı ve Master açma rehberleri burada.
          </p>
        </header>

        {/* Karakter Kartları */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-8 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {KO_CLASSES.map((cls) => (
              <Link
                key={cls.slug}
                href={`/rehber/${cls.guideSlug}`}
                className="group p-6 border border-white/[0.07] hover:border-white/20 transition-all duration-300"
                style={{ background: CLASS_BG[cls.slug] ?? 'rgba(255,255,255,0.015)' }}
              >
                {/* İkon */}
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-3xl flex-shrink-0" aria-hidden="true">{cls.icon}</span>
                  <div>
                    <h2 className="text-xl font-black tracking-[0.06em] uppercase text-white"
                      style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                      {cls.name}
                    </h2>
                    <p className="text-[0.7rem] tracking-[0.08em] uppercase mt-0.5" style={{ color: cls.color }}>
                      {cls.nameEn}
                    </p>
                  </div>
                </div>

                {/* Birincil stat */}
                <div className="mb-3">
                  <span className="text-[0.68rem] px-2.5 py-1"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
                    Ana Stat: {cls.primaryStat}
                  </span>
                </div>

                {/* Açıklama */}
                <p className="text-[0.76rem] leading-[1.75] text-white/40 line-clamp-3 mb-4">
                  {cls.description}
                </p>

                {/* Master bilgisi */}
                <div className="flex flex-wrap gap-3 text-[0.68rem] text-white/30 mb-4">
                  <span>Human: {cls.masterTitle.human}</span>
                  <span>·</span>
                  <span>Karus: {cls.masterTitle.karus}</span>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.1em]
                  uppercase text-white/30 group-hover:text-white/70 transition-colors duration-200">
                  <span>Rehberi Oku</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.5" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
