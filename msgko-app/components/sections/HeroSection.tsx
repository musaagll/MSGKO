'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { OkcuModal } from '@/components/ui/OkcuModal'
import { AsasModal } from '@/components/ui/AsasModal'

const STATS = [
  { value: '4',    label: 'Sınıf Rehberi',  sub: 'tam içerik' },
  { value: '120+', label: 'Eğitim Videosu', sub: 'büyüyor' },
  { value: '9',    label: 'GB Sitesi',       sub: 'karşılaştırmalı' },
]

const TICKER_ITEMS = [
  { text: 'Asas Rehberi',    img: '/assassin-icon.png' },
  { text: 'Okçu Rehberi',    img: '/archer-icon.png'   },
  { text: 'Priest Rehberi',  img: '/dreadshield.png'   },
  { text: 'Mage Rehberi',    img: '/staffwoe.png'      },
  { text: 'WS Taktikleri',   img: null },
  { text: 'Farm Rotaları',   img: null },
  { text: 'Boss Rehberleri', img: null },
  { text: 'USKO Pazar',      img: null },
  { text: 'Asas Rehberi',    img: '/assassin-icon.png' },
  { text: 'Okçu Rehberi',    img: '/archer-icon.png'   },
  { text: 'Priest Rehberi',  img: '/dreadshield.png'   },
  { text: 'Mage Rehberi',    img: '/staffwoe.png'      },
  { text: 'WS Taktikleri',   img: null },
  { text: 'Farm Rotaları',   img: null },
  { text: 'Boss Rehberleri', img: null },
  { text: 'USKO Pazar',      img: null },
]

export function HeroSection() {
  const [okcuOpen, setOkcuOpen] = useState(false)
  const [asasOpen, setAsasOpen] = useState(false)
  const [mounted,  setMounted]  = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const sectionRef  = useRef<HTMLElement>(null)
  const mousePosRef = useRef({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    setMounted(true)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mousePosRef.current = {
      x: (e.clientX - rect.left) / rect.width  - 0.5,
      y: (e.clientY - rect.top)  / rect.height - 0.5,
    }
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      setMousePos({ ...mousePosRef.current })
      rafRef.current = null
    })
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const videoY   = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const logoY    = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  return (
    <>
      <section
        ref={sectionRef}
        className="relative overflow-hidden"
        style={{
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: 64,   /* navbar yüksekliği */
          background: 'var(--void)',
        }}
        aria-label="Hero bölümü"
        onMouseMove={handleMouseMove}
      >
        {/* ── Arka plan videosu — sadece mount sonrası desktop'ta ── */}
        {mounted && !isMobile && (
          <motion.div
            style={{ position: 'absolute', inset: 0, y: videoY, zIndex: 0 }}
          >
            <video
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.16 }}
              src="/bg-video.mp4"
              poster="/logo.png"
              autoPlay loop muted playsInline preload="metadata"
              aria-hidden="true"
            />
          </motion.div>
        )}

        {/* ── Arka plan degrade (her zaman görünür) ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: isMobile
            ? 'radial-gradient(ellipse 120% 80% at 50% 30%, rgba(30,58,138,0.18) 0%, transparent 65%)'
            : 'radial-gradient(ellipse 60% 70% at 75% 50%, rgba(59,130,246,0.10) 0%, transparent 55%)',
        }} />

        {/* ── Grid overlay ── */}
        <div className="grid-overlay" style={{ zIndex: 1 }} />

        {/* ── Okunabilirlik katmanı ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: isMobile
            ? 'rgba(6,9,18,0.70)'
            : 'linear-gradient(105deg, rgba(6,9,18,0.96) 30%, rgba(6,9,18,0.65) 60%, rgba(6,9,18,0.05) 100%)',
        }} />

        {/* ── Alt fade ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 160,
          zIndex: 2, pointerEvents: 'none',
          background: 'linear-gradient(to top, var(--void) 0%, transparent 100%)',
        }} />

        {/* ── Dikey aksan çizgisi — sadece desktop ── */}
        {!isMobile && (
          <div style={{
            position: 'absolute',
            left: 'clamp(1.25rem, 4vw, 2.5rem)',
            top: 0, bottom: 0, width: 1, zIndex: 3,
            background: 'linear-gradient(180deg, transparent, rgba(59,130,246,0.3) 25%, rgba(59,130,246,0.12) 75%, transparent)',
            pointerEvents: 'none',
          }} />
        )}

        {/* ── Logo (sağ, parallax) — sadece desktop ── */}
        {mounted && !isMobile && (
          <motion.div
            style={{
              position: 'absolute',
              right: 'clamp(2%, 5%, 7%)',
              top: '50%',
              width: 'clamp(38%, 44%, 52%)',
              maxWidth: 580,
              y: logoY,
              translateY: '-50%',
              x: mousePos.x * -16,
              zIndex: 3,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
            aria-hidden="true"
          >
            <div style={{
              position: 'absolute', inset: '-20%',
              background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(59,130,246,0.14) 0%, rgba(30,64,175,0.06) 45%, transparent 65%)',
              filter: 'blur(40px)',
            }} />
            <Image
              src="/logo.png"
              alt=""
              width={580}
              height={580}
              priority
              style={{
                width: '100%', height: 'auto', position: 'relative',
                mixBlendMode: 'screen',
                filter: 'brightness(1.15) drop-shadow(0 0 50px rgba(59,130,246,0.45))',
                opacity: 0.4,
              }}
            />
          </motion.div>
        )}

        {/* ═══════════════════════════════════
            İÇERİK — her zaman görünür, z-index yüksek
        ═══════════════════════════════════ */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: 'var(--max-w)',
            margin: '0 auto',
            padding: isMobile
              ? 'clamp(2.5rem, 8vw, 4rem) var(--page-px) clamp(3rem, 10vw, 5rem)'
              : 'clamp(4rem, 8vw, 6rem) var(--page-px)',
          }}
        >
          <div style={{ maxWidth: isMobile ? '100%' : 560 }}>

            {/* ── Overline badge ── */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 12px',
              border: '1px solid var(--border-crimson)',
              background: 'var(--crimson-subtle)',
              marginBottom: 24,
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--crimson-bright)',
                boxShadow: '0 0 6px var(--crimson-bright)',
                display: 'inline-block',
                flexShrink: 0,
              }} />
              <span style={{
                fontSize: '0.58rem', fontWeight: 800,
                letterSpacing: '0.28em', textTransform: 'uppercase',
                color: 'var(--crimson-bright)',
              }}>
                Knight Online
              </span>
            </div>

            {/* ── H1 (SEO, gizli) ── */}
            <h1 className="sr-only">Knight Online Gelişim Platformu — MSGKO</h1>

            {/* ── Görsel başlık ── */}
            <div aria-hidden="true" style={{ marginBottom: 20 }}>
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-rajdhani), sans-serif',
                fontSize: isMobile ? 'clamp(3rem, 14vw, 4.5rem)' : 'clamp(3rem, 6vw, 6rem)',
                fontWeight: 900,
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
                lineHeight: 0.9,
                color: 'var(--platinum)',
              }}>
                Knight
              </span>
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-rajdhani), sans-serif',
                fontSize: isMobile ? 'clamp(3rem, 14vw, 4.5rem)' : 'clamp(3rem, 6vw, 6rem)',
                fontWeight: 900,
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
                lineHeight: 0.9,
                background: 'linear-gradient(115deg, #DBEAFE 0%, #60A5FA 35%, #3B82F6 65%, #1E3A8A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Online
              </span>
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-rajdhani), sans-serif',
                fontSize: isMobile ? 'clamp(1.1rem, 5vw, 1.6rem)' : 'clamp(1.2rem, 2.5vw, 2rem)',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                lineHeight: 1.3,
                color: 'var(--steel)',
                marginTop: 10,
              }}>
                Gelişim Platformu
              </span>
              {/* Accent çizgi */}
              <div style={{
                marginTop: 14, height: 2, width: 200,
                background: 'linear-gradient(90deg, var(--crimson), var(--ember), transparent)',
              }} />
            </div>

            {/* ── Açıklama ── */}
            <p style={{
              fontSize: isMobile ? '0.88rem' : 'clamp(0.88rem, 1.4vw, 1rem)',
              lineHeight: 1.85,
              color: 'var(--steel)',
              maxWidth: 440,
              marginBottom: 32,
            }}>
              Türkiye'nin en kapsamlı Knight Online rehber platformu.
              Asas, okçu, warrior, mage ve priest için{' '}
              <span style={{ color: 'var(--platinum)', fontWeight: 600 }}>
                profesyonel build rehberleri
              </span>,
              farm rotaları ve güncel meta analizleri.
            </p>

            {/* ── CTA Butonlar ── */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              marginBottom: 40,
            }}>
              <button
                onClick={() => setAsasOpen(true)}
                className="btn-primary"
              >
                <Image src="/assassin-icon.png" alt="" width={18} height={18}
                  style={{ objectFit: 'contain', mixBlendMode: 'screen', filter: 'brightness(2)' }} />
                Asas Eğitimleri
              </button>

              <button
                onClick={() => setOkcuOpen(true)}
                className="btn-secondary"
              >
                <Image src="/archer-icon.png" alt="" width={18} height={18}
                  style={{ objectFit: 'contain' }} />
                Okçu Eğitimleri
              </button>

              <Link
                href="/rehber"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '0.72rem 1.2rem',
                  fontSize: '0.74rem', fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--iron)',
                  textDecoration: 'none',
                }}
              >
                Tüm Rehberler →
              </Link>
            </div>

            {/* ── Stats ── */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: isMobile ? '20px 28px' : 'clamp(20px, 3vw, 36px)',
            }}>
              {STATS.map((stat, i) => (
                <div key={i}>
                  <div style={{
                    fontFamily: 'var(--font-rajdhani), sans-serif',
                    fontSize: isMobile ? '1.8rem' : 'clamp(1.6rem, 3vw, 2.2rem)',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    color: 'var(--platinum)',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '0.62rem', fontWeight: 600,
                    letterSpacing: '0.07em', color: 'var(--steel)', marginTop: 3,
                  }}>
                    {stat.label}
                  </div>
                  <div style={{
                    fontSize: '0.52rem', letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: 'var(--crimson-dim)', marginTop: 2,
                  }}>
                    {stat.sub}
                  </div>
                </div>
              ))}

              <div style={{ width: 1, height: 44, background: 'var(--border)' }} />

              {/* Live badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 11px',
                border: '1px solid rgba(16,185,129,0.22)',
                background: 'rgba(16,185,129,0.05)',
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: '#10B981',
                  boxShadow: '0 0 6px rgba(16,185,129,0.8)',
                  display: 'inline-block', flexShrink: 0,
                }} />
                <span style={{
                  fontSize: '0.58rem', fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: '#10B981',
                }}>
                  Aktif Platform
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'var(--abyss)',
          borderTop: '1px solid var(--border-crimson)',
          borderBottom: '1px solid var(--border)',
        }}
        aria-hidden="true"
      >
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 60,
          background: 'linear-gradient(90deg, var(--abyss), transparent)',
          zIndex: 10, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 60,
          background: 'linear-gradient(270deg, var(--abyss), transparent)',
          zIndex: 10, pointerEvents: 'none',
        }} />

        <div style={{ overflow: 'hidden' }}>
          <div className="ticker-track" style={{ display: 'flex', alignItems: 'center', willChange: 'transform' }}>
            {TICKER_ITEMS.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 24px' }}>
                  {item.img
                    ? <Image src={item.img} alt="" width={13} height={13}
                        style={{ objectFit: 'contain', mixBlendMode: 'screen', opacity: 0.7 }} />
                    : <div style={{ width: 3, height: 3, background: 'var(--crimson)', transform: 'rotate(45deg)', opacity: 0.5 }} />
                  }
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--iron)', whiteSpace: 'nowrap',
                  }}>
                    {item.text}
                  </span>
                </div>
                <div style={{
                  width: 3, height: 3, background: 'var(--crimson-dim)',
                  transform: 'rotate(45deg)', margin: '0 4px', flexShrink: 0,
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <OkcuModal isOpen={okcuOpen} onClose={() => setOkcuOpen(false)} />
      <AsasModal isOpen={asasOpen} onClose={() => setAsasOpen(false)} />
    </>
  )
}
