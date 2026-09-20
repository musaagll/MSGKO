import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { KO_MAPS } from '@/lib/ko-data/maps'
import { buildMetadata, buildBreadcrumbSchema, buildItemListSchema, BASE_URL } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Knight Online Haritalar | CZ, FT, Ardream ve Tüm Haritalar | MSGKO',
  description: 'Knight Online tüm haritaları için farm rotaları, boss konumları ve rehberler. MSGKO\'da.',
  canonical: `${BASE_URL}/harita`,
  keywords: [],
  ogType: 'website',
})

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Haritalar', href: '/harita' },
]

const MAP_TYPE: Record<string, { label: string; color: string; bg: string }> = {
  pvp:     { label: 'PvP',      color: 'rgba(248,113,113,0.85)', bg: 'rgba(248,113,113,0.06)' },
  pve:     { label: 'PvE',      color: 'rgba(52,211,153,0.85)',  bg: 'rgba(52,211,153,0.06)'  },
  dungeon: { label: 'Dungeon',  color: 'rgba(212,168,50,0.85)',  bg: 'rgba(212,168,50,0.06)'  },
  town:    { label: 'Kasaba',   color: 'rgba(96,165,250,0.85)',  bg: 'rgba(96,165,250,0.06)'  },
  event:   { label: 'Etkinlik', color: 'rgba(251,191,36,0.85)',  bg: 'rgba(251,191,36,0.06)'  },
}

export default function HaritaIndexPage() {
  const maps = KO_MAPS.filter(m => m.is_published)

  const schemas = [
    buildBreadcrumbSchema(breadcrumbs),
    buildItemListSchema({
      name: 'Knight Online Harita Rehberleri',
      description: 'Farm, boss ve rehber bilgileri.',
      url: '/harita',
      items: maps.map(m => ({ name: `Knight Online ${m.name}`, url: `/harita/${m.slug}`, description: m.description ?? '' })),
    }),
  ]

  return (
    <>
      <Script id="harita-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />

      <main style={{ minHeight: '100vh', background: 'var(--void)' }}>

        {/* ── Page Header ── */}
        <div className="page-header" style={{ paddingTop: 'clamp(5rem,8vw,6rem)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <nav aria-label="Konum" style={{ marginBottom: 20 }}>
              <ol className="breadcrumb">
                <li><Link href="/" style={{ color: 'var(--iron)', textDecoration: 'none' }}>Ana Sayfa</Link></li>
                <li style={{ color: 'var(--iron)', opacity: 0.3 }}>/</li>
                <li style={{ color: 'var(--steel)' }}>Haritalar</li>
              </ol>
            </nav>

            <p className="page-header-eyebrow">Harita Merkezi</p>
            <h1 className="page-header-title">Knight Online<br/>Haritalar</h1>
            <p className="page-header-desc">
              Farm rotaları, boss konumları, level aralıkları ve önemli bilgiler — tüm haritalar için.
            </p>

            {/* Harita tipi özeti */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
              {Object.entries(MAP_TYPE).map(([key, t]) => {
                const count = maps.filter(m => m.map_type === key).length
                if (!count) return null
                return (
                  <div key={key} style={{
                    display: 'flex', alignItems: 'center', gap: 7, padding: '4px 12px',
                    background: t.bg, border: `1px solid ${t.color}35`,
                  }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 900, color: t.color, fontFamily: 'var(--font-rajdhani)' }}>{count}</span>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.color, opacity: 0.8 }}>{t.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Harita Listesi ── */}
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(2rem,4vw,3rem) clamp(1.5rem,4vw,2.5rem) 5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {maps.map(map => {
              const type = MAP_TYPE[map.map_type] ?? MAP_TYPE['pve']
              return (
                <Link
                  key={map.slug}
                  href={`/harita/${map.slug}`}
                  style={{
                    display: 'flex', flexDirection: 'column', gap: 12,
                    padding: '20px 22px',
                    background: 'var(--abyss)',
                    border: '1px solid var(--border)',
                    textDecoration: 'none', position: 'relative', overflow: 'hidden',
                  }}
                  className="group card-gaming"
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${type.color}, transparent)`, opacity: 0.5 }} />

                  {/* Tip + özellikler */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 5 }}>
                    <span style={{
                      fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase',
                      padding: '2px 8px', background: type.bg, border: `1px solid ${type.color}35`, color: type.color,
                    }}>
                      {type.label}
                    </span>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {map.is_war_zone && (
                        <span title="Savaş Bölgesi" style={{ fontSize: '0.6rem', color: 'rgba(248,113,113,0.6)' }}>⚔</span>
                      )}
                      {map.has_dungeon && (
                        <span title="Dungeon" style={{ fontSize: '0.6rem', color: 'var(--crimson-bright)', opacity: 0.7 }}>🏰</span>
                      )}
                    </div>
                  </div>

                  {/* İsim */}
                  <div>
                    <h2 style={{
                      fontFamily: 'var(--font-rajdhani), sans-serif',
                      fontSize: '1.05rem', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase',
                      color: 'var(--platinum)', marginBottom: 4, lineHeight: 1.15,
                    }}>
                      {map.name}
                    </h2>
                    {(map.min_level || map.max_level) && (
                      <p style={{ fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--iron)' }}>
                        Level: {map.min_level ?? '?'}{map.max_level ? ` — ${map.max_level}` : '+'}
                      </p>
                    )}
                  </div>

                  {/* Açıklama */}
                  <p className="line-clamp-2" style={{ fontSize: '0.73rem', lineHeight: 1.7, color: 'var(--iron)' }}>
                    {map.description ?? ''}
                  </p>

                  {/* Bosslar */}
                  {map.bosses_here.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {map.bosses_here.slice(0, 2).map(b => (
                        <span key={b.boss_slug} style={{
                          fontSize: '0.6rem', padding: '2px 7px',
                          background: 'rgba(248,113,113,0.07)',
                          border: '1px solid rgba(248,113,113,0.18)',
                          color: 'rgba(248,113,113,0.75)',
                        }}>
                          {b.boss_name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--crimson-bright)', opacity: 0.8 }}>
                      Harita Rehberi
                    </span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--crimson-bright)" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </main>
    </>
  )
}
