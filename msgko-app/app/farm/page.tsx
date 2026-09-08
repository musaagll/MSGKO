import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { KO_MAPS, getMapsByType } from '@/lib/ko-data/maps'
import { buildMetadata, buildBreadcrumbSchema, buildItemListSchema, BASE_URL } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Knight Online Farm Rehberleri | Exp, Item ve Noah Farm Rotaları | MSGKO',
  description:
    'Knight Online en verimli farm rotaları, exp kazanma yöntemleri ve item farm noktaları. Tüm seviyeler için farm rehberleri MSGKO\'da.',
  canonical: `${BASE_URL}/farm`,
  keywords: [
    'knight online farm', 'knight online farm rotası', 'knight online exp farm',
    'knight online noah farm', 'knight online item farm', 'knight online leveling',
    'knight online en iyi farm yeri', 'knight online hızlı level kasma',
  ],
  ogType: 'website',
})

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Farm Rehberleri', href: '/farm' },
]

const schemas = [
  buildBreadcrumbSchema(breadcrumbs),
  buildItemListSchema({
    name: 'Knight Online Farm Rehberleri',
    description: 'Knight Online exp, item ve noah farm rotaları.',
    url: '/farm',
    items: KO_MAPS.filter((m) => m.farm_spots.length > 0 && m.is_published).map((m) => ({
      name: `Knight Online ${m.name} Farm Rehberi`,
      url: `/harita/${m.slug}`,
      description: `${m.name} farm noktaları ve rotaları.`,
    })),
  }),
]

const FARM_TIPS = [
  {
    title: 'Exp Farm',
    desc: 'Level kasımı için en verimli haritaları ve mob\'ları seç. Level aralığına uygun bölgelerde farm yap.',
    color: 'rgba(16,185,129,0.8)',
    icon: '⬆',
  },
  {
    title: 'Item Farm',
    desc: 'Değerli item\'lar için boss\'ları ve nadir drop bölgelerini hedefle.',
    color: 'rgba(245,158,11,0.8)',
    icon: '⚔',
  },
  {
    title: 'Noah Farm',
    desc: 'Para kazanmak için drop oranı yüksek ve satış değeri iyi olan item\'lara odaklan.',
    color: 'rgba(59,130,246,0.8)',
    icon: '💎',
  },
]

// Haritadan farm rehberi linkleri oluştur
const farmMaps = KO_MAPS.filter((m) => m.farm_spots.length > 0 && m.is_published)

export default function FarmIndexPage() {
  return (
    <>
      <Script
        id="farm-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <main className="min-h-screen" style={{ background: '#07070B' }}>
        <nav aria-label="Sayfa konumu" className="max-w-[1280px] mx-auto px-6 sm:px-8 pt-24 pb-2">
          <ol className="flex flex-wrap items-center gap-1.5 text-[0.72rem] text-white/30">
            <li><Link href="/" className="hover:text-white/60 transition-colors">Ana Sayfa</Link></li>
            <li aria-hidden="true"><span>/</span></li>
            <li className="text-white/60">Farm Rehberleri</li>
          </ol>
        </nav>

        <header className="max-w-[1280px] mx-auto px-6 sm:px-8 py-10">
          <p className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-purple-400/60 mb-3">FARM MERKEZİ</p>
          <h1 className="text-3xl md:text-4xl font-black tracking-[0.04em] uppercase text-white mb-4"
            style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
            Knight Online Farm Rehberleri
          </h1>
          <p className="text-[0.9rem] leading-[1.8] text-white/50 max-w-2xl">
            Knight Online&#39;da en hızlı level kasmanın ve en değerli item&#39;ları elde etmenin yollarını
            burada öğrenebilirsin. Tüm seviyeler için farm rotaları.
          </p>
        </header>

        <section className="max-w-[1280px] mx-auto px-6 sm:px-8 pb-20">
          {/* Farm tipleri */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {FARM_TIPS.map((tip) => (
              <div key={tip.title} className="p-5 border border-white/[0.06]"
                style={{ background: 'rgba(255,255,255,0.015)' }}>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-lg" aria-hidden="true">{tip.icon}</span>
                  <span className="text-[0.75rem] font-black tracking-[0.15em] uppercase"
                    style={{ color: tip.color, fontFamily: 'var(--font-rajdhani)' }}>
                    {tip.title}
                  </span>
                </div>
                <p className="text-[0.75rem] leading-[1.75] text-white/40">{tip.desc}</p>
              </div>
            ))}
          </div>

          {/* Harita bazlı farm noktaları */}
          <h2 className="text-[0.8rem] font-black tracking-[0.2em] uppercase text-white/50 mb-6">
            HARİTAYA GÖRE FARM
          </h2>

          {farmMaps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {farmMaps.map((map) => (
                <Link key={map.slug} href={`/harita/${map.slug}`}
                  className="group p-6 border border-white/[0.07] hover:border-white/20 transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.015)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-[0.9rem] font-black tracking-[0.05em] uppercase text-white"
                      style={{ fontFamily: 'var(--font-rajdhani)' }}>
                      {map.name}
                    </h3>
                    <span className="text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2 py-0.5"
                      style={{ background: 'rgba(16,185,129,0.1)', color: 'rgba(16,185,129,0.8)' }}>
                      {map.farm_spots.length} Nokta
                    </span>
                  </div>
                  {(map.min_level || map.max_level) && (
                    <p className="text-[0.68rem] uppercase tracking-[0.08em] text-white/30 mb-3">
                      Level: {map.min_level ?? '?'}{map.max_level ? ` — ${map.max_level}` : '+'}
                    </p>
                  )}
                  <ul className="flex flex-col gap-1.5 mb-4">
                    {map.farm_spots.slice(0, 2).map((spot, i) => (
                      <li key={i} className="text-[0.74rem] text-white/40 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-green-500/40 flex-shrink-0" aria-hidden="true"/>
                        {spot.name}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.1em]
                    uppercase text-white/30 group-hover:text-white/70 transition-colors duration-200">
                    <span>Farm Rehberi</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-[0.82rem] text-white/30">Farm rehberleri yakında eklenecek.</p>
          )}

          {/* Genel Farm Bilgisi */}
          <div className="mt-12 p-6 border border-white/[0.06]" style={{ background: 'rgba(16,185,129,0.03)' }}>
            <h2 className="text-[0.8rem] font-black tracking-[0.15em] uppercase text-white/80 mb-3">
              Knight Online&#39;da Nasıl Farm Yapılır?
            </h2>
            <p className="text-[0.78rem] leading-[1.8] text-white/40">
              Knight Online&#39;da verimli farm için birkaç temel prensip var: Level aralığına uygun bölge
              seçimi, doğru karakter build&#39;i ve farmın türüne göre (exp, item, noah) strateji belirleme.{' '}
              <Link href="/rehber" className="text-green-400/60 hover:text-green-400 transition-colors">
                Karakter rehberleri
              </Link>{' '}
              sayfamızda her sınıf için farm build önerileri ve{' '}
              <Link href="/harita" className="text-green-400/60 hover:text-green-400 transition-colors">
                harita rehberleri
              </Link>{' '}
              sayfamızda tüm farm noktaları detaylı şekilde anlatılmaktadır.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
