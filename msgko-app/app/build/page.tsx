import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { KO_CLASSES } from '@/lib/ko-data/classes'
import { buildMetadata, buildBreadcrumbSchema, buildItemListSchema, BASE_URL } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Knight Online Build Rehberleri | Asas, Warrior, Mage ve Tüm Build\'ler | MSGKO',
  description:
    'Knight Online tüm karakterler için PvP, PvE ve Farm build rehberleri. Stat dağılımı, skill tree ve item önerileri MSGKO\'da.',
  canonical: `${BASE_URL}/build`,
  keywords: [
    'knight online build', 'knight online build rehberi', 'knight online asas build',
    'knight online warrior build', 'knight online mage build', 'knight online priest build',
    'knight online okçu build', 'knight online pvp build', 'knight online stat dağılımı',
  ],
  ogType: 'website',
})

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Build Rehberleri', href: '/build' },
]

const BUILD_TYPES = [
  { type: 'pvp', label: 'PvP Build', desc: 'Oyuncu vs Oyuncu için optimize edilmiş build\'ler', color: 'rgba(239,68,68,0.8)' },
  { type: 'pve', label: 'PvE Build', desc: 'Mob ve boss için verimli build\'ler', color: 'rgba(16,185,129,0.8)' },
  { type: 'farm', label: 'Farm Build', desc: 'Exp ve item farm için optimize edilmiş build\'ler', color: 'rgba(245,158,11,0.8)' },
  { type: 'hybrid', label: 'Hybrid Build', desc: 'Çok yönlü kullanım için dengeli build\'ler', color: 'rgba(139,92,246,0.8)' },
]

const schemas = [
  buildBreadcrumbSchema(breadcrumbs),
  buildItemListSchema({
    name: 'Knight Online Build Rehberleri',
    description: 'Tüm Knight Online sınıfları için PvP, PvE ve farm build rehberleri.',
    url: '/build',
    items: KO_CLASSES.map((c) => ({
      name: `Knight Online ${c.name} Build Rehberi`,
      url: `/rehber/${c.guideSlug}`,
      description: `${c.name} sınıfı için build rehberleri.`,
    })),
  }),
]

export default function BuildIndexPage() {
  return (
    <>
      <Script
        id="build-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <main className="min-h-screen" style={{ background: '#07070B' }}>
        <nav aria-label="Sayfa konumu" className="max-w-[1280px] mx-auto px-6 sm:px-8 pt-24 pb-2">
          <ol className="flex flex-wrap items-center gap-1.5 text-[0.72rem] text-white/30">
            <li><Link href="/" className="hover:text-white/60 transition-colors">Ana Sayfa</Link></li>
            <li aria-hidden="true"><span>/</span></li>
            <li className="text-white/60">Build Rehberleri</li>
          </ol>
        </nav>

        <header className="max-w-[1280px] mx-auto px-6 sm:px-8 py-10">
          <p className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-purple-400/60 mb-3">BUILD MERKEZİ</p>
          <h1 className="text-3xl md:text-4xl font-black tracking-[0.04em] uppercase text-white mb-4"
            style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
            Knight Online Build Rehberleri
          </h1>
          <p className="text-[0.9rem] leading-[1.8] text-white/50 max-w-2xl">
            Tüm Knight Online karakter sınıfları için PvP, PvE ve farm build rehberleri.
            Stat dağılımı, skill tree ve item önerilerini burada bulabilirsin.
          </p>
        </header>

        <section className="max-w-[1280px] mx-auto px-6 sm:px-8 pb-16">
          {/* Build tipleri */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {BUILD_TYPES.map((bt) => (
              <div key={bt.type} className="p-4 border border-white/[0.06]"
                style={{ background: 'rgba(255,255,255,0.015)' }}>
                <span className="text-[0.65rem] font-bold tracking-[0.15em] uppercase"
                  style={{ color: bt.color }}>{bt.label}</span>
                <p className="text-[0.72rem] text-white/35 mt-1.5 leading-relaxed">{bt.desc}</p>
              </div>
            ))}
          </div>

          {/* Sınıf bazlı build linkleri */}
          <h2 className="text-[0.8rem] font-black tracking-[0.2em] uppercase text-white/50 mb-6">
            SINIFA GÖRE BUILD
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {KO_CLASSES.map((cls) => (
              <Link key={cls.slug} href={`/rehber/${cls.guideSlug}`}
                className="group p-6 border border-white/[0.07] hover:border-white/20 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.015)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl" aria-hidden="true">{cls.icon}</span>
                  <div>
                    <h3 className="text-[0.88rem] font-black tracking-[0.06em] uppercase text-white"
                      style={{ fontFamily: 'var(--font-rajdhani)' }}>
                      {cls.name} Build
                    </h3>
                    <p className="text-[0.62rem] tracking-[0.1em] uppercase" style={{ color: cls.color }}>
                      {cls.nameEn}
                    </p>
                  </div>
                </div>
                <p className="text-[0.74rem] leading-[1.7] text-white/35 line-clamp-2 mb-3">
                  {cls.description.substring(0, 100)}...
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
