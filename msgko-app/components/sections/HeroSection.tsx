'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { OkcuModal } from '@/components/ui/OkcuModal'
import { AsasModal } from '@/components/ui/AsasModal'

const STATS = [
  { value: '4',    label: 'Sınıf Rehberi',    sub: 'tam içerik' },
  { value: '120+', label: 'Eğitim Videosu',   sub: 'büyüyor' },
  { value: '9',    label: 'GB Sitesi',         sub: 'karşılaştırmalı' },
]

const TICKER_ITEMS = [
  { text: 'Asas Rehberi',   img: '/assassin-icon.png' },
  { text: 'Okçu Rehberi',   img: '/archer-icon.png'   },
  { text: 'Priest Rehberi', img: '/dreadshield.png'   },
  { text: 'Mage Rehberi',   img: '/staffwoe.png'      },
  { text: 'WS Taktikleri',  img: null },
  { text: 'Farm Rotaları',  img: null },
  { text: 'Boss Rehberleri',img: null },
  { text: 'USKO Pazar',     img: null },
  { text: 'Asas Rehberi',   img: '/assassin-icon.png' },
  { text: 'Okçu Rehberi',   img: '/archer-icon.png'   },
  { text: 'Priest Rehberi', img: '/dreadshield.png'   },
  { text: 'Mage Rehberi',   img: '/staffwoe.png'      },
  { text: 'WS Taktikleri',  img: null },
  { text: 'Farm Rotaları',  img: null },
  { text: 'Boss Rehberleri',img: null },
  { text: 'USKO Pazar',     img: null },
]

export function HeroSection() {
  const [okcuOpen, setOkcuOpen]   = useState(false)
  const [asasOpen, setAsasOpen]   = useState(false)
  const [isMobile, setIsMobile]   = useState<boolean | null>(null)
  const sectionRef                = useRef<HTMLElement>(null)
  const mousePosRef               = useRef({ x: 0, y: 0 })
  const [mousePos, setMousePos]   = useState({ x: 0, y: 0 })
  const rafRef                    = useRef<number | null>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
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

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const videoY   = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const logoY    = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '5%'])

  return (
    <>
      <section
        ref={sectionRef}
        className="relative overflow-hidden"
        style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', marginTop: 64 }}
        aria-label="Hero bölümü"
        onMouseMove={handleMouseMove}
      >
        {/* ── Zemin ── */}
        <div style={{ position: 'absolute', inset: 0, background: 'var(--void)' }} />

        {/* ── Arka plan videosu — mobilde devre dışı, null guard ile hydration-safe ── */}
        <motion.div style={{ position: 'absolute', inset: 0, y: videoY }}>
          {isMobile === null ? null : isMobile ? (
            <div style={{
              width: '100%', height: '100%',
              background: 'radial-gradient(ellipse 80% 60% at 60% 50%, rgba(59,130,246,0.06) 0%, transparent 60%)',
            }} />
          ) : (
            <video
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18 }}
              src="/bg-video.mp4"
              poster="/logo.png"
              autoPlay loop muted playsInline preload="metadata"
              aria-hidden="true"
            />
          )}
        </motion.div>

        {/* ── Grid overlay ── */}
        <div className="grid-overlay" />

        {/* ── Scanlines ── */}
        <div className="scanlines" />

        {/* ── Kırmızı atmosfer ── */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 60% 70% at 80% 50%, rgba(59,130,246,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 40% 60% at 20% 90%, rgba(30,64,175,0.07) 0%, transparent 50%),
            radial-gradient(ellipse 80% 40% at 50% 0%, rgba(6,9,18,0.9) 0%, transparent 50%)
          `,
        }} />

        {/* ── Dikey çizgi aksan ── */}
        <div style={{
          position: 'absolute', left: 'clamp(1.25rem, 4vw, 2.5rem)', top: 0, bottom: 0, width: 1,
          background: 'linear-gradient(180deg, transparent, rgba(59,130,246,0.35) 20%, rgba(59,130,246,0.15) 80%, transparent)',
          pointerEvents: 'none',
        }} />

        {/* ── Sol gradient (okunabilirlik) ── */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: isMobile
            ? 'rgba(6,9,18,0.82)'
            : 'linear-gradient(105deg, rgba(8,10,15,0.98) 25%, rgba(8,10,15,0.75) 55%, rgba(8,10,15,0.05) 100%)',
        }} />

        {/* ── Alt fade ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, pointerEvents: 'none',
          background: 'linear-gradient(to top, var(--void) 0%, rgba(8,10,15,0.6) 60%, transparent 100%)',
        }} />

        {/* ── Logo (sağ, parallax + mouse) — tabletüstü görünür ── */}
        <motion.div
          style={{
            position: 'absolute',
            right: 'clamp(2%, 6%, 8%)',
            top: '50%',
            width: 'clamp(40%, 46%, 54%)',
            maxWidth: 620,
            y: logoY,
            translateY: '-50%',
            x: mousePos.x * -20,
            pointerEvents: 'none',
            userSelect: 'none',
            display: isMobile ? 'none' : undefined,
          }}
          aria-hidden="true"
        >
          {/* Glow halo */}
          <div style={{
            position: 'absolute', inset: '-20%',
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(59,130,246,0.18) 0%, rgba(30,64,175,0.08) 40%, transparent 65%)',
            filter: 'blur(40px)',
          }} />

          <motion.div
            style={{
              width: '100%', position: 'relative',
              x: mousePos.x * -8,
              y: mousePos.y * -8,
            }}
          >
            <Image
              src="/logo.png"
              alt=""
              width={620}
              height={620}
              priority
              style={{
                width: '100%', height: 'auto',
                mixBlendMode: 'screen',
                filter: 'brightness(1.2) contrast(1.0) drop-shadow(0 0 60px rgba(59,130,246,0.5)) drop-shadow(0 0 120px rgba(59,130,246,0.2))',
                opacity: 0.45,
              }}
            />
          </motion.div>
        </motion.div>

        {/* ══════════════════════════════════════════════════
            CONTENT
        ══════════════════════════════════════════════════ */}
        <motion.div
          style={{
            position: 'relative', zIndex: 10, width: '100%', y: contentY,
            maxWidth: 'var(--max-w)', margin: '0 auto',
            padding: 'clamp(4rem, 8vw, 6rem) var(--page-px)',
          }}
        >
          <div style={{ maxWidth: 600 }}>

            {/* Overline */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 14px',
                border: '1px solid var(--border-crimson)',
                background: 'var(--crimson-subtle)',
              }}>
                <motion.div
                  style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--crimson-bright)',
                    boxShadow: '0 0 8px var(--crimson-bright)',
                  }}
                  className="dot-pulse"
                />
                <span style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--crimson-bright)' }}>
                  Knight Online
                </span>
              </div>
              {/* Kırmızı çizgi */}
              <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg, var(--crimson), transparent)' }} />
            </motion.div>

            {/* H1 (SEO) */}
            <h1 className="sr-only">Knight Online Gelişim Platformu — MSGKO</h1>

            {/* Görsel başlık */}
            <div aria-hidden="true">
              <motion.div
                initial={{ opacity: 0, y: 44 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-rajdhani), sans-serif',
                  fontSize: 'clamp(2.6rem, 6vw, 6rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.01em',
                  textTransform: 'uppercase',
                  lineHeight: 0.9,
                  color: 'var(--platinum)',
                }}>
                  Knight
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 44 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-rajdhani), sans-serif',
                  fontSize: 'clamp(2.6rem, 6vw, 6rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.01em',
                  textTransform: 'uppercase',
                  lineHeight: 0.9,
                  background: 'linear-gradient(115deg, #DBEAFE 0%, var(--crimson-bright) 30%, #3B82F6 60%, #1E3A8A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Online
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 44 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.33, ease: [0.22, 1, 0.36, 1] }}
              >
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-rajdhani), sans-serif',
                  fontSize: 'clamp(1.4rem, 3vw, 2.8rem)',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  lineHeight: 1.2,
                  color: 'var(--steel)',
                  marginTop: 8,
                }}>
                  Gelişim Platformu
                </span>
              </motion.div>

              {/* Accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  marginTop: 16, height: 2, maxWidth: 280,
                  background: 'linear-gradient(90deg, var(--crimson), var(--ember), transparent)',
                  transformOrigin: 'left',
                }}
              />
            </div>

            {/* Açıklama */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
                lineHeight: 1.85,
                color: 'var(--steel)',
                maxWidth: 460,
                marginTop: 24,
                marginBottom: 36,
              }}
            >
              Türkiye'nin en kapsamlı Knight Online rehber platformu.
              Asas, okçu, warrior, mage ve priest için{' '}
              <span style={{ color: 'var(--platinum)', fontWeight: 600 }}>profesyonel build rehberleri</span>,
              farm rotaları ve güncel meta analizleri.
            </motion.p>

            {/* CTA Butonlar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 48 }}
            >
              <motion.button
                onClick={() => setAsasOpen(true)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary"
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <Image src="/assassin-icon.png" alt="" width={20} height={20} style={{ objectFit: 'contain', mixBlendMode: 'screen', filter: 'brightness(2) contrast(1.2)' }} />
                Asas Eğitimleri
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </motion.button>

              <motion.button
                onClick={() => setOkcuOpen(true)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="btn-secondary"
              >
                <Image src="/archer-icon.png" alt="" width={20} height={20} style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 4px rgba(59,130,246,0.4))' }} />
                Okçu Eğitimleri
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </motion.button>

              <motion.a
                href="/rehber"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--iron)',
                  border: 'none', background: 'none',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--steel)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--iron)' }}
              >
                Tüm Rehberler
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'clamp(20px, 3vw, 36px)' }}
            >
              {STATS.map((stat, i) => (
                <div key={i} style={{ cursor: 'default' }}>
                  <div style={{
                    fontFamily: 'var(--font-rajdhani), sans-serif',
                    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(135deg, var(--platinum) 0%, rgba(96,165,250,0.8) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: 1,
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.07em', color: 'var(--steel)', marginTop: 3 }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: '0.55rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--crimson-dim)', marginTop: 1 }}>
                    {stat.sub}
                  </div>
                </div>
              ))}

              {/* Divider */}
              <div style={{ width: 1, height: 48, background: 'var(--border)' }} className="hidden sm:block" />

              {/* Live badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '6px 12px',
                border: '1px solid rgba(16,185,129,0.2)',
                background: 'rgba(16,185,129,0.05)',
              }}>
                <motion.div
                  style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px rgba(16,185,129,0.8)' }}
                  className="dot-pulse"
                />
                <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#10B981' }}>
                  Aktif Platform
                </span>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            style={{
              position: 'absolute', bottom: 32,
              left: 'var(--page-px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="hidden md:flex"
          >
            <span style={{ fontSize: '0.5rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--iron)', writingMode: 'vertical-rl' }}>
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--crimson), transparent)' }}
            />
          </motion.div>
        </motion.div>
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
        {/* Fade kenarlar */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(90deg, var(--abyss), transparent)', zIndex: 10, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(270deg, var(--abyss), transparent)', zIndex: 10, pointerEvents: 'none' }} />

        <div style={{ overflow: 'hidden' }}>
          <div className="ticker-track" style={{ display: 'flex', alignItems: 'center', willChange: 'transform' }}>
            {TICKER_ITEMS.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 28px' }}>
                  {item.img
                    ? <Image src={item.img} alt="" width={14} height={14} style={{ objectFit: 'contain', mixBlendMode: 'screen', filter: 'brightness(1.2) sepia(0.3)' }} />
                    : <div style={{ width: 4, height: 4, background: 'var(--crimson)', transform: 'rotate(45deg)', opacity: 0.6 }} />
                  }
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--iron)', whiteSpace: 'nowrap' }}>
                    {item.text}
                  </span>
                </div>
                {/* Ayırıcı */}
                <div style={{ width: 4, height: 4, background: 'var(--crimson-dim)', transform: 'rotate(45deg)', margin: '0 4px', flexShrink: 0 }} />
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
