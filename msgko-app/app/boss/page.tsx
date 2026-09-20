import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { KO_BOSSES } from '@/lib/ko-data/bosses'
import { buildMetadata, buildBreadcrumbSchema, buildItemListSchema, BASE_URL } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Knight Online Boss Rehberleri | Felankor, Isiloon ve Tüm Bosslar | MSGKO',
  description:
    'Knight Online tüm bossları için spawn yeri, drop listesi ve öldürme taktikleri. Felankor, Isiloon, Kundun ve daha fazlası MSGKO\'da.',
  canonical: `${BASE_URL}/boss`,
  keywords: ['knight online boss', 'felankor', 'isiloon', 'knight online boss drop', 'boss rehberi'],
  ogType: 'website',
})

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Boss Rehberleri', href: '/boss' },
]

const BOSS_TYPE: Record<string, { label: string; color: string; bg: string }> = {
  world:   { label: 'World Boss',   color: 'rgba(248,113,113,0.9)', bg: 'rgba(248,113,113,0.08)' },
  dungeon: { label: 'Dungeon Boss', color: 'rgba(212,168,50,0.9)',  bg: 'rgba(212,168,50,0.06)'  },
  event:   { label: 'Event Boss',   color: 'rgba(251,191,36,0.9)',  bg: 'rgba(251,191,36,0.06)'  },
  mini:    { label: 'Mini Boss',    color: 'rgba(148,163,184,0.8)', bg: 'rgba(148,163,184,0.06)' },
}

export default function BossIndexPage() {
  const bosses = KO_BOSSES.filter(b => b.is_published)

  const schemas = [
    buildBreadcrumbSchema(breadcrumbs),
    buildItemListSchema({
      name: 'Knight Online Boss Rehberleri',
      description: 'Spawn, drop ve taktik bilgileri.',
      url: '/boss',
      items: bosses.map(b => ({ name: `Knight Online ${b.name}`, url: `/boss/${b.slug}`, description: b.description ?? '' })),
    }),
  ]

  return (
    <>
      <Script id="boss-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />

      <main style={{ minHeight: '100vh', background: 'var(--void)' }}>

        {/* ── Page Header ── */}
        <div className="page-header" style={{ paddingTop: 'clamp(5rem,8vw,6rem)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            {/* Breadcrumb */}
            <nav aria-label="Konum" style={{ marginBottom: 20 }}>
              <ol className="breadcrumb">
                <li><Link href="/" className="breadcrumb-link">Ana Sayfa</Link></li>
                <li className="breadcrumb-sep">/</li>
                <li className="breadcrumb-current">Boss Rehberleri</li>
              </ol>
            </nav>

            <p className="page-header-eyebrow">Boss Merkezi</p>
            <h1 className="page-header-title">Knight Online<br/>Boss Rehberleri</h1>
            <p className="page-header-desc">
              Tüm boss&apos;ların spawn yeri, çıkma zamanı, drop listesi ve öldürme taktiklerini burada bulabilirsin.
            </p>

            {/* İstatistik özeti */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 24 }}>
              {[
                { label: 'World Boss', count: bosses.filter(b => b.boss_type === 'world').length, color: 'rgba(248,113,113,0.8)' },
                { label: 'Dungeon Boss', count: bosses.filter(b => b.boss_type === 'dungeon').length, color: 'rgba(212,168,50,0.8)' },
                { label: 'Event Boss', count: bosses.filter(b => b.boss_type === 'event').length, color: 'rgba(251,191,36,0.8)' },
              ].map(s => (
                <div key={s.label} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '5px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 900, color: s.color, fontFamily: 'var(--font-rajdhani)' }}>{s.count}</span>
                  <span style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--iron)' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Boss Listesi ── */}
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(2rem,4vw,3rem) clamp(1.5rem,4vw,2.5rem) 5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 12 }}>
            {bosses.map(boss => {
              const type = BOSS_TYPE[boss.boss_type] ?? BOSS_TYPE['mini']
              return (
                <Link
                  key={boss.slug}
                  href={`/boss/${boss.slug}`}
                  className="card-gaming group"
                  style={{
                    display: 'block', padding: '20px 22px',
                    textDecoration: 'none', position: 'relative', overflow: 'hidden',
                  }}
                >
                  {/* Üst çizgi */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${type.color}, transparent)`, opacity: 0.6 }} />

                  {/* Tip + Level */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{
                      fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase',
                      padding: '2px 8px',
                      background: type.bg,
                      border: `1px solid ${type.color}40`,
                      color: type.color,
                    }}>
                      {type.label}
                    </span>
                    {boss.level && (
                      <span style={{ fontSize: '0.6rem', color: 'var(--iron)', letterSpacing: '0.08em' }}>
                        Lv. {boss.level}
                      </span>
                    )}
                  </div>

                  {/* İsim */}
                  <h2 style={{
                    fontFamily: 'var(--font-rajdhani), sans-serif',
                    fontSize: '1.1rem', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase',
                    color: 'var(--platinum)', marginBottom: 6, lineHeight: 1.15,
                  }}>
                    {boss.name}
                  </h2>

                  {/* Konum */}
                  {boss.map_slug && (
                    <p style={{ fontSize: '0.65rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--iron)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {boss.map_slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  )}

                  {/* Drop listesi */}
                  {boss.drop_list.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <p style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--iron)', marginBottom: 7, opacity: 0.6 }}>Drop</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {boss.drop_list.slice(0, 3).map((drop, i) => (
                          <span key={i} style={{
                            fontSize: '0.62rem', padding: '2px 7px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            color: 'var(--steel)',
                          }}>
                            {drop.item_name}
                          </span>
                        ))}
                        {boss.drop_list.length > 3 && (
                          <span style={{ fontSize: '0.62rem', color: 'var(--iron)' }}>+{boss.drop_list.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--crimson-bright)', opacity: 0.8 }}>
                      Rehberi Oku
                    </span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--crimson-bright)" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Bilgi kutusu */}
          <div style={{
            marginTop: 40, padding: '20px 24px',
            background: 'rgba(248,113,113,0.03)',
            border: '1px solid rgba(248,113,113,0.1)',
            borderLeft: '3px solid rgba(248,113,113,0.4)',
          }}>
            <h2 style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--steel)', marginBottom: 10 }}>
              Boss Sistemi Hakkında
            </h2>
            <p style={{ fontSize: '0.77rem', lineHeight: 1.8, color: 'var(--iron)' }}>
              Knight Online&apos;daki boss&apos;lar belirli aralıklarla spawn olur ve sunucu genelinde duyuru yapılır.
              En değerli itemlar bu boss&apos;lardan düşer. CZ&apos;nin en güçlü boss&apos;u olan{' '}
              <Link href="/boss/felankor" style={{ color: 'rgba(248,113,113,0.8)', textDecoration: 'none' }}>Felankor</Link>&apos;u öldürmek
              için güçlü ve organize bir grup gerekmektedir.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
