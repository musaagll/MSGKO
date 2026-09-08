import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { KO_BOSSES } from '@/lib/ko-data/bosses'
import { buildMetadata, buildBreadcrumbSchema, buildItemListSchema, BASE_URL } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Knight Online Boss Rehberleri | Felankor, Isiloon ve Tüm Boss\'lar | MSGKO',
  description:
    'Knight Online tüm boss\'ları için spawn yeri, drop listesi ve öldürme taktikleri. Felankor, Isiloon, Kundun ve daha fazlası MSGKO\'da.',
  canonical: `${BASE_URL}/boss`,
  keywords: [
    'knight online boss', 'knight online boss listesi', 'felankor', 'isiloon',
    'knight online boss drop', 'knight online boss spawn', 'knight online boss rehberi',
    'cz boss', 'world boss knight online',
  ],
  ogType: 'website',
})

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Boss Rehberleri', href: '/boss' },
]

const schemas = [
  buildBreadcrumbSchema(breadcrumbs),
  buildItemListSchema({
    name: 'Knight Online Boss Rehberleri',
    description: 'Tüm Knight Online boss\'ları için spawn, drop ve taktik bilgileri.',
    url: '/boss',
    items: KO_BOSSES.filter((b) => b.is_published).map((b) => ({
      name: `Knight Online ${b.name}`,
      url: `/boss/${b.slug}`,
      description: b.description ?? '',
    })),
  }),
]

const BOSS_TYPE_LABELS: Record<string, string> = {
  world: 'World Boss',
  dungeon: 'Dungeon Boss',
  event: 'Event Boss',
  mini: 'Mini Boss',
}

export default function BossIndexPage() {
  const publishedBosses = KO_BOSSES.filter((b) => b.is_published)

  return (
    <>
      <Script
        id="boss-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <main className="min-h-screen" style={{ background: '#07070B' }}>
        {/* Breadcrumb */}
        <nav aria-label="Sayfa konumu" className="max-w-[1280px] mx-auto px-6 sm:px-8 pt-24 pb-2">
          <ol className="flex flex-wrap items-center gap-1.5 text-[0.72rem] text-white/30">
            <li><Link href="/" className="hover:text-white/60 transition-colors">Ana Sayfa</Link></li>
            <li aria-hidden="true"><span>/</span></li>
            <li className="text-white/60">Boss Rehberleri</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="max-w-[1280px] mx-auto px-6 sm:px-8 py-10">
          <p className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-purple-400/60 mb-3">
            BOSS MERKEZİ
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-[0.04em] uppercase text-white mb-4"
            style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
            Knight Online Boss Rehberleri
          </h1>
          <p className="text-[0.9rem] leading-[1.8] text-white/50 max-w-2xl">
            Knight Online dünyasındaki tüm boss&#39;ların spawn yeri, çıkma zamanı, drop listesi ve
            öldürme taktiklerini burada bulabilirsin. Felankor&#39;dan Kundun&#39;a kadar her boss için rehber.
          </p>
        </header>

        {/* Boss Listesi */}
        <section className="max-w-[1280px] mx-auto px-6 sm:px-8 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {publishedBosses.map((boss) => (
              <Link
                key={boss.slug}
                href={`/boss/${boss.slug}`}
                className="group p-6 border border-white/[0.07] hover:border-white/20
                  transition-all duration-300 relative overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.015)' }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'rgba(239,68,68,0.06)' }} />
                <div className="relative">
                  {/* Tip badge */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[0.6rem] font-bold tracking-[0.15em] uppercase px-2 py-0.5 border"
                      style={{ borderColor: 'rgba(239,68,68,0.3)', color: 'rgba(239,68,68,0.8)' }}>
                      {BOSS_TYPE_LABELS[boss.boss_type] ?? boss.boss_type}
                    </span>
                    {boss.level && (
                      <span className="text-[0.6rem] tracking-[0.1em] text-white/30">
                        Lv. {boss.level}
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-black tracking-[0.06em] uppercase text-white mb-1"
                    style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                    {boss.name}
                  </h2>

                  {/* Konum */}
                  {boss.map_slug && (
                    <p className="text-[0.68rem] tracking-[0.08em] uppercase text-white/30 mb-3">
                      📍 {boss.map_slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                  )}

                  {/* Drop önizleme */}
                  {boss.drop_list.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[0.62rem] tracking-[0.15em] uppercase text-white/25 mb-2">Drop</p>
                      <div className="flex flex-wrap gap-1.5">
                        {boss.drop_list.slice(0, 3).map((drop, i) => (
                          <span key={i} className="text-[0.62rem] px-2 py-0.5"
                            style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)' }}>
                            {drop.item_name}
                          </span>
                        ))}
                        {boss.drop_list.length > 3 && (
                          <span className="text-[0.62rem] px-2 py-0.5 text-white/25">
                            +{boss.drop_list.length - 3} daha
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.1em]
                    uppercase text-white/30 group-hover:text-white/70 transition-colors duration-200 mt-2">
                    <span>Boss Rehberini Oku</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bilgi */}
          <div className="mt-12 p-6 border border-white/[0.06]" style={{ background: 'rgba(239,68,68,0.03)' }}>
            <h2 className="text-[0.8rem] font-black tracking-[0.15em] uppercase text-white/80 mb-3">
              Knight Online Boss Sistemi Hakkında
            </h2>
            <p className="text-[0.78rem] leading-[1.8] text-white/40">
              Knight Online&#39;daki boss&#39;lar belirli aralıklarla spawn olur ve sunucu genelinde
              duyuru yapılır. En değerli item&#39;lar bu boss&#39;lardan düşer. CZ&#39;nin en güçlü boss&#39;u olan{' '}
              <Link href="/boss/felankor" className="text-red-400/70 hover:text-red-400 transition-colors">
                Felankor
              </Link>&#39;u öldürmek için güçlü ve organize bir grup gerekmektedir.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
