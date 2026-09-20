import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { KO_CLASSES } from '@/lib/ko-data/classes'
import { buildMetadata, buildBreadcrumbSchema, buildItemListSchema, BASE_URL } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Knight Online Karakter Rehberleri | Warrior, Rogue, Mage, Priest | MSGKO',
  description:
    'Knight Online tüm karakter sınıfları için kapsamlı rehberler. Warrior, Rogue (Assassin/Archer), Mage ve Priest — skill ağaçları, stat dağılımı ve Master açma rehberleri MSGKO\'da.',
  canonical: `${BASE_URL}/rehber`,
  keywords: [],
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

/* Sınıf ikonu görselleri */
const CLASS_ICON_MAP: Record<string, string> = {
  warrior:  '/dreadshield.png',
  assassin: '/assassin-icon.png',
  archer:   '/archer-icon.png',
  mage:     '/staffwoe.png',
  priest:   '/dreadshield.png',
}

/* Sınıf vurgu renkleri — Server Component'ta inline style kullanılıyor */
const CLASS_ACCENT: Record<string, { border: string; bg: string; label: string }> = {
  warrior:  { border: 'rgba(239,68,68,0.25)',   bg: 'rgba(239,68,68,0.06)',   label: 'DPS / Tank'     },
  assassin: { border: 'rgba(96,165,250,0.25)',  bg: 'rgba(96,165,250,0.06)',  label: 'DPS / Stealth'  },
  archer:   { border: 'rgba(6,182,212,0.25)',   bg: 'rgba(6,182,212,0.06)',   label: 'DPS / Menzil'   },
  mage:     { border: 'rgba(167,139,250,0.25)', bg: 'rgba(167,139,250,0.06)', label: 'Caster / AOE'   },
  priest:   { border: 'rgba(52,211,153,0.25)',  bg: 'rgba(52,211,153,0.06)',  label: 'Heal / Support' },
}

export default function RehberIndexPage() {
  return (
    <>
      <Script
        id="rehber-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <main style={{ minHeight: '100vh', background: 'var(--void)' }}>

        {/* ── Hero header ── */}
        <div className="page-header" style={{ paddingTop: 'clamp(5rem,8vw,6rem)' }}>
          <div style={{ position: 'relative', maxWidth: '1320px', margin: '0 auto', padding: '0 var(--page-px) 2rem' }}>

            {/* Breadcrumb */}
            <nav aria-label="Sayfa konumu" style={{ marginBottom: 20 }}>
              <ol className="breadcrumb">
                <li>
                  <Link href="/" style={{ color: 'var(--iron)', textDecoration: 'none' }}>
                    Ana Sayfa
                  </Link>
                </li>
                <li className="breadcrumb-sep">/</li>
                <li className="breadcrumb-current">Karakter Rehberleri</li>
              </ol>
            </nav>

            <p className="page-header-eyebrow">Rehber Merkezi</p>
            <h1 className="page-header-title">Karakter Rehberleri</h1>
            <p className="page-header-desc">
              Knight Online&apos;da 4 temel sınıf bulunur:{' '}
              <strong style={{ color: 'var(--steel)' }}>Warrior</strong>,{' '}
              <strong style={{ color: 'var(--steel)' }}>Rogue</strong> (Assassin ve Archer),{' '}
              <strong style={{ color: 'var(--steel)' }}>Mage</strong> ve{' '}
              <strong style={{ color: 'var(--steel)' }}>Priest</strong>.
              Her sınıf için skill ağaçları, stat dağılımı ve Master açma rehberleri burada.
            </p>
          </div>
        </div>

        {/* ── Sınıf kartları ── */}
        <section style={{ maxWidth: '1320px', margin: '0 auto', padding: 'clamp(2rem,4vw,3rem) var(--page-px) 5rem' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {KO_CLASSES.map(cls => {
              const acc = CLASS_ACCENT[cls.slug] ?? { border: 'rgba(212,168,50,0.2)', bg: 'rgba(212,168,50,0.05)', label: '' }
              return (
                <Link
                  key={cls.slug}
                  href={`/rehber/${cls.guideSlug}`}
                  className="group block"
                  style={{
                    textDecoration: 'none',
                    padding: '28px',
                    background: acc.bg,
                    border: `1px solid ${acc.border}`,
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {/* Üst accent çizgisi */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                    background: `linear-gradient(90deg, ${acc.border}, transparent)`,
                  }} />

                  {/* Büyük faint arka plan ikonu */}
                  <div style={{
                    position: 'absolute', right: 20, top: '50%',
                    transform: 'translateY(-50%)',
                    width: '5rem', height: '5rem', opacity: 0.05,
                    pointerEvents: 'none',
                  }} aria-hidden="true">
                    <Image
                      src={CLASS_ICON_MAP[cls.slug] ?? '/dreadshield.png'}
                      alt=""
                      width={80}
                      height={80}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'screen' }}
                    />
                  </div>

                  <div style={{ position: 'relative' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                      <div style={{ width: 40, height: 40, flexShrink: 0 }} aria-hidden="true">
                        <Image
                          src={CLASS_ICON_MAP[cls.slug] ?? '/dreadshield.png'}
                          alt={cls.name}
                          width={40}
                          height={40}
                          style={{ width: 40, height: 40, objectFit: 'contain', mixBlendMode: 'screen' }}
                        />
                      </div>
                      <div>
                        <h2 style={{
                          fontFamily: 'var(--font-rajdhani), sans-serif',
                          fontSize: '1.4rem', fontWeight: 900,
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                          color: '#E8ECF0', lineHeight: 1.1,
                        }}>
                          {cls.name}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '0.68rem', fontWeight: 700,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            color: cls.color,
                          }}>
                            {cls.nameEn}
                          </span>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '2px 8px',
                            fontSize: '0.58rem', fontWeight: 800,
                            letterSpacing: '0.16em', textTransform: 'uppercase',
                            color: 'rgba(138,155,176,0.6)',
                            background: 'rgba(160,174,192,0.06)',
                            border: '1px solid rgba(160,174,192,0.2)',
                          }}>
                            {acc.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ana Stat badge */}
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '4px 10px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      marginBottom: 12,
                    }}>
                      <span style={{ fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(100,100,120,0.8)' }}>
                        Ana Stat:
                      </span>
                      <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'rgba(138,155,176,0.7)' }}>
                        {cls.primaryStat}
                      </span>
                    </div>

                    {/* Açıklama */}
                    <p className="line-clamp-3" style={{
                      fontSize: '0.76rem', lineHeight: 1.75,
                      color: 'rgba(100,100,120,0.8)', marginBottom: 16,
                    }}>
                      {cls.description}
                    </p>

                    {/* Master unvanları */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                      {[
                        { label: 'Human', value: cls.masterTitle.human },
                        { label: 'Karus',  value: cls.masterTitle.karus },
                      ].map(m => (
                        <div key={m.label} style={{ display: 'flex', gap: 5, fontSize: '0.65rem' }}>
                          <span style={{ color: 'rgba(100,100,120,0.8)' }}>{m.label}:</span>
                          <span style={{ color: 'rgba(138,155,176,0.7)', fontWeight: 600 }}>{m.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 800,
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: cls.color, opacity: 0.85,
                      }}>
                        Rehberi Oku
                      </span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke={cls.color} strokeWidth="2.5" opacity="0.75">
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
