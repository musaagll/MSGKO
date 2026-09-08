import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { KO_MAPS } from '@/lib/ko-data/maps'
import { buildMetadata, buildBreadcrumbSchema, buildItemListSchema, BASE_URL } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Knight Online Haritalar | CZ, FT, Ardream ve Tüm Haritalar | MSGKO',
  description:
    'Knight Online tüm haritaları için farm rotaları, boss konumları ve rehberler. Ronark Land (CZ), Forgotten Temple, Ardream ve daha fazlası MSGKO\'da.',
  canonical: `${BASE_URL}/harita`,
  keywords: [
    'knight online harita', 'knight online harita listesi', 'knight online cz',
    'ronark land', 'forgotten temple', 'ardream', 'knight online farm haritası',
    'knight online pvp haritası', 'knight online dungeon',
  ],
  ogType: 'website',
})

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Haritalar', href: '/harita' },
]

const MAP_TYPE_LABELS: Record<string, string> = {
  pvp: 'PvP',
  pve: 'PvE',
  dungeon: 'Dungeon',
  town: 'Kasaba',
  event: 'Etkinlik',
}

const MAP_TYPE_COLORS: Record<string, string> = {
  pvp: 'rgba(239,68,68,0.8)',
  pve: 'rgba(16,185,129,0.8)',
  dungeon: 'rgba(139,92,246,0.8)',
  town: 'rgba(59,130,246,0.8)',
  event: 'rgba(245,158,11,0.8)',
}

export default function HaritaIndexPage() {
  const published = KO_MAPS.filter((m) => m.is_published)

  const schemas = [
    buildBreadcrumbSchema(breadcrumbs),
    buildItemListSchema({
      name: 'Knight Online Harita Rehberleri',
      description: 'Tüm Knight Online haritaları için farm, boss ve rehber bilgileri.',
      url: '/harita',
      items: published.map((m) => ({
        name: `Knight Online ${m.name}`,
        url: `/harita/${m.slug}`,
        description: m.description ?? '',
      })),
    }),
  ]

  return (
    <>
      <Script
        id="harita-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <main className="min-h-screen" style={{ background: '#07070B' }}>
        <nav aria-label="Sayfa konumu" className="max-w-[1280px] mx-auto px-6 sm:px-8 pt-24 pb-2">
          <ol className="flex flex-wrap items-center gap-1.5 text-[0.72rem] text-white/30">
            <li><Link href="/" className="hover:text-white/60 transition-colors">Ana Sayfa</Link></li>
            <li aria-hidden="true"><span>/</span></li>
            <li className="text-white/60">Haritalar</li>
          </ol>
        </nav>

        <header className="max-w-[1280px] mx-auto px-6 sm:px-8 py-10">
          <p className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-purple-400/60 mb-3">HARİTA MERKEZİ</p>
          <h1 className="text-3xl md:text-4xl font-black tracking-[0.04em] uppercase text-white mb-4"
            style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
            Knight Online Haritalar
          </h1>
          <p className="text-[0.9rem] leading-[1.8] text-white/50 max-w-2xl">
            Knight Online&#39;daki tüm haritalar için farm rotaları, boss konumları, level aralıkları
            ve önemli bilgileri burada bulabilirsin.
          </p>
        </header>

        <section className="max-w-[1280px] mx-auto px-6 sm:px-8 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {published.map((map) => (
              <Link
                key={map.slug}
                href={`/harita/${map.slug}`}
                className="group p-6 border border-white/[0.07] hover:border-white/20
                  transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.015)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[0.6rem] font-bold tracking-[0.15em] uppercase px-2 py-0.5 border"
                    style={{
                      borderColor: `${MAP_TYPE_COLORS[map.map_type]}30`,
                      color: MAP_TYPE_COLORS[map.map_type] ?? 'rgba(255,255,255,0.5)',
                    }}>
                    {MAP_TYPE_LABELS[map.map_type] ?? map.map_type}
                  </span>
                  <div className="flex gap-1.5">
                    {map.is_war_zone && (
                      <span className="text-[0.6rem] px-1.5 py-0.5 text-red-400/60" title="Savaş Bölgesi">⚔</span>
                    )}
                    {map.has_dungeon && (
                      <span className="text-[0.6rem] px-1.5 py-0.5 text-purple-400/60" title="Dungeon">🏰</span>
                    )}
                  </div>
                </div>

                <h2 className="text-lg font-black tracking-[0.06em] uppercase text-white mb-2"
                  style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                  {map.name}
                </h2>

                {(map.min_level || map.max_level) && (
                  <p className="text-[0.68rem] tracking-[0.08em] uppercase text-white/30 mb-3">
                    Level: {map.min_level ?? '?'}{map.max_level ? ` — ${map.max_level}` : '+'}
                  </p>
                )}

                <p className="text-[0.76rem] leading-[1.75] text-white/40 line-clamp-2 mb-4">
                  {map.description ?? ''}
                </p>

                {map.bosses_here.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {map.bosses_here.slice(0, 2).map((b) => (
                      <span key={b.boss_slug} className="text-[0.6rem] px-2 py-0.5"
                        style={{ background: 'rgba(239,68,68,0.08)', color: 'rgba(239,68,68,0.7)' }}>
                        {b.boss_name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.1em]
                  uppercase text-white/30 group-hover:text-white/70 transition-colors duration-200">
                  <span>Harita Rehberi</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
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
