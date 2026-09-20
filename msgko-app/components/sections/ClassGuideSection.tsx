'use client'

import Link from 'next/link'
import Image from 'next/image'
import { KO_CLASSES } from '@/lib/ko-data/classes'

const CLASS_COLORS: Record<string, { primary: string; bg: string; border: string; role: string }> = {
  warrior:  { primary: '#F87171', bg: 'rgba(248,113,113,0.06)', border: 'rgba(248,113,113,0.2)', role: 'DPS / Tank' },
  assassin: { primary: '#60A5FA', bg: 'rgba(96,165,250,0.06)',  border: 'rgba(96,165,250,0.2)',  role: 'DPS / Stealth' },
  archer:   { primary: '#06B6D4', bg: 'rgba(6,182,212,0.06)',   border: 'rgba(6,182,212,0.2)',   role: 'DPS / Menzil' },
  mage:     { primary: '#A78BFA', bg: 'rgba(167,139,250,0.06)', border: 'rgba(167,139,250,0.2)', role: 'Caster / AOE' },
  priest:   { primary: '#34D399', bg: 'rgba(52,211,153,0.06)',  border: 'rgba(52,211,153,0.2)',  role: 'Heal / Support' },
}

/** Oyun içi ikonlar — emoji yerine gerçek görsel */
const CLASS_ICONS: Record<string, string> = {
  warrior:  '/dreadshield.png',
  assassin: '/assassin-icon.png',
  archer:   '/archer-icon.png',
  mage:     '/staffwoe.png',
  priest:   '/dreadshield.png',
}

export function ClassGuideSection() {
  return (
    <section
      aria-label="Karakter sınıfları"
      style={{
        background: 'var(--abyss)',
        padding: 'clamp(3rem, 6vw, 5rem) var(--page-px)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Arka plan */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 70% at 85% 50%, rgba(212,168,50,0.04) 0%, transparent 55%)',
      }} />
      <div className="grid-overlay" />

      <div style={{ position: 'relative', maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        {/* Başlık */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 8 }}>Karakter Rehberleri</p>
            <h2 style={{
              fontFamily: 'var(--font-rajdhani), sans-serif',
              fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
              fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase',
              color: 'var(--platinum)', margin: 0,
            }}>
              Sınıf Rehberleri
            </h2>
          </div>
          <Link href="/rehber" style={{
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--crimson-bright)', opacity: 0.8, textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.8' }}
          >
            Tüm Rehberler →
          </Link>
        </div>

        {/* Sınıf kartları */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {KO_CLASSES.map(cls => {
            const col = CLASS_COLORS[cls.slug] ?? CLASS_COLORS['warrior']
            return (
              <Link
                key={cls.slug}
                href={`/rehber/${cls.guideSlug}`}
                className="group"
                style={{
                  display: 'flex', flexDirection: 'column', gap: 14,
                  padding: '20px 22px',
                  background: col.bg,
                  border: `1px solid ${col.border}`,
                  textDecoration: 'none',
                  position: 'relative', overflow: 'hidden',
                  transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = col.primary + '50'
                  el.style.boxShadow = `0 12px 36px rgba(0,0,0,0.5), 0 0 0 1px ${col.primary}18`
                  el.style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = col.border
                  el.style.boxShadow = 'none'
                  el.style.transform = 'none'
                }}
              >
                {/* Üst accent */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${col.primary}, transparent)`,
                  opacity: 0.5,
                }} />

                {/* Büyük faint arka plan ikonu */}
                <div style={{
                  position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                  width: '4.5rem', height: '4.5rem', opacity: 0.06, pointerEvents: 'none',
                }} aria-hidden="true">
                  <Image
                    src={CLASS_ICONS[cls.slug] ?? '/dreadshield.png'}
                    alt=""
                    width={72}
                    height={72}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'screen' }}
                  />
                </div>

                <div style={{ position: 'relative' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
                      <Image
                        src={CLASS_ICONS[cls.slug] ?? '/dreadshield.png'}
                        alt={cls.name}
                        width={36}
                        height={36}
                        style={{ width: 36, height: 36, objectFit: 'contain', mixBlendMode: 'screen' }}
                      />
                    </div>
                    <div>
                      <h3 style={{
                        fontFamily: 'var(--font-rajdhani), sans-serif',
                        fontSize: '1.1rem', fontWeight: 900, letterSpacing: '0.06em',
                        textTransform: 'uppercase', color: 'var(--platinum)',
                        margin: 0, lineHeight: 1.1,
                      }}>
                        {cls.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', color: col.primary }}>
                          {cls.nameEn}
                        </span>
                        <span style={{
                          fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.12em',
                          padding: '1px 6px',
                          background: `${col.primary}12`,
                          border: `1px solid ${col.primary}28`,
                          color: col.primary, opacity: 0.85,
                        }}>
                          {col.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ana stat */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '3px 9px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    marginBottom: 10,
                  }}>
                    <span style={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--iron)' }}>
                      Ana Stat:
                    </span>
                    <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--steel)' }}>
                      {cls.primaryStat}
                    </span>
                  </div>

                  {/* Açıklama */}
                  <p className="line-clamp-2" style={{
                    fontSize: '0.72rem', lineHeight: 1.7,
                    color: 'var(--iron)', marginBottom: 14,
                  }}>
                    {cls.description}
                  </p>

                  {/* CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em',
                      textTransform: 'uppercase', color: col.primary, opacity: 0.8,
                    }}>
                      Rehberi Oku
                    </span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={col.primary} strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
