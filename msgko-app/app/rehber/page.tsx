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
    items: KO_CLASSES.map(c => ({
      name: `Knight Online ${c.name} Rehberi`,
      url: `/rehber/${c.guideSlug}`,
      description: c.description.substring(0, 150),
    })),
  }),
]

/* Sınıf vurgu renkleri */
const CLASS_ACCENT: Record<string, { glow: string; border: string; bg: string; label: string }> = {
  warrior: { glow: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.25)',   bg: 'rgba(239,68,68,0.06)',   label: 'DPS / Tank' },
  rogue:   { glow: 'rgba(96,165,250,0.15)',  border: 'rgba(96,165,250,0.25)',  bg: 'rgba(96,165,250,0.06)',  label: 'DPS / Stealth' },
  mage:    { glow: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.25)', bg: 'rgba(167,139,250,0.06)', label: 'Caster / AOE' },
  priest:  { glow: 'rgba(52,211,153,0.15)',  border: 'rgba(52,211,153,0.25)',  bg: 'rgba(52,211,153,0.06)',  label: 'Heal / Support' },
}

export default function RehberIndexPage() {
  return (
    <>
      <Script id="rehber-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />

      <main style={{ minHeight: '100vh', background: 'var(--void)' }}>

        {/* Hero header */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          background: 'var(--abyss)',
          borderBottom: '1px solid var(--border)',
          paddingTop: 96,
        }}>
          <div className="grid-overlay" />
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(200,16,46,0.08) 0%, transparent 55%)',
          }} />

          <div style={{ position: 'relative', maxWidth: 'var(--max-w)', margin: '0 auto', padding: '2rem var(--page-px) 3rem' }}>
            {/* Breadcrumb */}
            <nav aria-label="Sayfa konumu" style={{ marginBottom: 20 }}>
              <ol style={{ display: 'flex', flexWrap: 'wrap', gap: 6, fontSize: '0.68rem', color: 'var(--iron)', listStyle: 'none' }}>
                <li><Link href="/" style={{ color: 'var(--iron)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--steel)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--iron)' }}>
                  Ana Sayfa</Link></li>
                <li style={{ opacity: 0.4 }}>/</li>
                <li style={{ color: 'var(--steel)' }}>Karakter Rehberleri</li>
              </ol>
            </nav>

            <p className="section-label" style={{ marginBottom: 12 }}>Rehber Merkezi</p>
            <h1 style={{
              fontFamily: 'var(--font-rajdhani), sans-serif',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase',
              color: 'var(--platinum)', marginBottom: 12,
            }}>
              Karakter Rehberleri
            </h1>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.8, color: 'var(--iron)', maxWidth: 600 }}>
              Knight Online'da 4 temel sınıf bulunur:{' '}
              <strong style={{ color: 'var(--steel)' }}>Warrior</strong>,{' '}
              <strong style={{ color: 'var(--steel)' }}>Rogue</strong> (Assassin ve Archer),{' '}
              <strong style={{ color: 'var(--steel)' }}>Mage</strong> ve{' '}
              <strong style={{ color: 'var(--steel)' }}>Priest</strong>.
              Her sınıf için skill ağaçları, stat dağılımı ve Master açma rehberleri burada.
            </p>
          </div>

          {/* Alt kırmızı çizgi */}
          <div style={{ height: 1, background: 'linear-gradient(90deg, var(--crimson), var(--ember), transparent)' }} />
        </div>

        {/* Sınıf kartları */}
        <section style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '3rem var(--page-px) 5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: 16 }}
            className="sm:grid-cols-2">
            {KO_CLASSES.map(cls => {
              const acc = CLASS_ACCENT[cls.slug] ?? { glow: 'rgba(200,16,46,0.1)', border: 'var(--border-crimson)', bg: 'var(--crimson-subtle)', label: '' }
              return (
                <Link
                  key={cls.slug}
                  href={`/rehber/${cls.guideSlug}`}
                  style={{
                    display: 'block', textDecoration: 'none',
                    padding: '28px 28px',
                    background: acc.bg,
                    border: `1px solid ${acc.border}`,
                    position: 'relative', overflow: 'hidden',
                    transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.boxShadow = `0 16px 48px ${acc.glow}`
                    el.style.transform = 'translateY(-4px)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.boxShadow = 'none'
                    el.style.transform = 'translateY(0)'
                  }}
                >
                  {/* Üst aksan çizgi */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${acc.border}, transparent)` }} />

                  {/* Büyük arka plan ikonu */}
                  <div style={{
                    position: 'absolute', right: 20, top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '5rem', opacity: 0.06,
                    pointerEvents: 'none', lineHeight: 1,
                  }} aria-hidden="true">
                    {cls.icon}
                  </div>

                  <div style={{ position: 'relative' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                      <div style={{ fontSize: '2.2rem', lineHeight: 1, flexShrink: 0 }} aria-hidden="true">{cls.icon}</div>
                      <div>
                        <h2 style={{
                          fontFamily: 'var(--font-rajdhani), sans-serif',
                          fontSize: '1.4rem', fontWeight: 900, letterSpacing: '0.06em',
                          textTransform: 'uppercase', color: 'var(--platinum)', lineHeight: 1.1,
                        }}>
                          {cls.name}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: cls.color }}>
                            {cls.nameEn}
                          </span>
                          <span className="badge badge-steel" style={{ fontSize: '0.55rem' }}>{acc.label}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ana Stat badge */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', marginBottom: 12 }}>
                      <span style={{ fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--iron)' }}>Ana Stat:</span>
                      <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--steel)' }}>{cls.primaryStat}</span>
                    </div>

                    {/* Açıklama */}
                    <p className="line-clamp-3" style={{ fontSize: '0.76rem', lineHeight: 1.75, color: 'var(--iron)', marginBottom: 16 }}>
                      {cls.description}
                    </p>

                    {/* Master unvanları */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                      {[
                        { label: 'Human', value: cls.masterTitle.human },
                        { label: 'Karus',  value: cls.masterTitle.karus },
                      ].map(m => (
                        <div key={m.label} style={{ display: 'flex', gap: 5, fontSize: '0.65rem' }}>
                          <span style={{ color: 'var(--iron)' }}>{m.label}:</span>
                          <span style={{ color: 'var(--steel)', fontWeight: 600 }}>{m.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: cls.color, opacity: 0.8 }}>
                        Rehberi Oku
                      </span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={cls.color} strokeWidth="2.5" opacity="0.7">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
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
