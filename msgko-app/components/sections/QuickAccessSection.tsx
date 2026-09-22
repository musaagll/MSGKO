import Link from 'next/link'

const QUICK_ITEMS = [
  {
    href: '/rehber',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    title: 'Rehberler',
    desc: 'Build, skill, stat ve PK taktikleri',
    accent: 'var(--crimson)',
    accentRgb: '201,168,76',
  },
  {
    href: '/pazar',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
    title: 'USKO Pazar',
    desc: 'Canlı market ilanları ve fiyatlar',
    accent: '#10B981',
    accentRgb: '16,185,129',
    live: true,
  },
  {
    href: '/gb-fiyatlari',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    title: 'GB Fiyatları',
    desc: '9 site karşılaştırmalı GB kuru',
    accent: '#e8c96a',
    accentRgb: '232,201,106',
  },
  {
    href: '/boss',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/>
      </svg>
    ),
    title: 'Boss Rehberleri',
    desc: 'Spawn, drop listesi ve taktikler',
    accent: '#F87171',
    accentRgb: '248,113,113',
  },
  {
    href: '/harita',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
      </svg>
    ),
    title: 'Harita Rehberi',
    desc: 'Farm rotaları ve bölge bilgileri',
    accent: '#60A5FA',
    accentRgb: '96,165,250',
  },
]

export function QuickAccessSection() {
  return (
    <section
      aria-label="Hızlı erişim"
      style={{
        background: 'var(--void)',
        padding: 'clamp(2.5rem, 5vw, 4rem) var(--page-px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        {/* Başlık */}
        <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 8 }}>Platform</p>
            <h2 style={{
              fontFamily: "'Cinzel', var(--font-rajdhani), sans-serif",
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
              fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'var(--platinum)', margin: 0,
            }}>
              Oyun Merkezi
            </h2>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--iron)', maxWidth: 380, lineHeight: 1.7 }}>
            Knight Online&apos;da ihtiyacın olan her şey — rehber, pazar, item ve boss bilgileri tek yerde.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {QUICK_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="quick-card"
              style={{ textDecoration: 'none', '--accent-rgb': item.accentRgb } as React.CSSProperties}
            >
              {/* Üst accent çizgisi */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, ${item.accent}, transparent)`,
                opacity: 0.4,
              }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <div style={{
                  width: 40, height: 40, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `rgba(${item.accentRgb}, 0.08)`,
                  border: `1px solid rgba(${item.accentRgb}, 0.2)`,
                  color: item.accent,
                }}>
                  {item.icon}
                </div>
                {item.live && (
                  <span style={{
                    fontSize: '0.48rem', fontWeight: 800, letterSpacing: '0.1em',
                    padding: '2px 6px',
                    background: 'rgba(16,185,129,0.10)',
                    border: '1px solid rgba(16,185,129,0.25)',
                    color: '#10B981',
                    display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
                  }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#10B981', animation: 'dotPulse 2s infinite', display: 'inline-block' }} />
                    Canlı
                  </span>
                )}
              </div>

              <div>
                <p style={{
                  fontFamily: "'Cinzel', var(--font-rajdhani), sans-serif",
                  fontSize: '0.82rem', fontWeight: 800,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: 'var(--platinum)', marginBottom: 4,
                }}>
                  {item.title}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--iron)', lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 'auto' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: item.accent, opacity: 0.8 }}>
                  Keşfet
                </span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={item.accent} strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
