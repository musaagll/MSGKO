'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { OkcuModal } from '@/components/ui/OkcuModal'
import { AsasModal } from '@/components/ui/AsasModal'

const STATS = [
  { value: '120+', label: 'Eğitim Videosu' },
  { value: '15K+', label: 'İzlenme' },
  { value: '2026', label: 'Meta Güncel' },
]

const TICKER_ITEMS = [
  { text: 'Asas Rehberi',    img: '/assassian-icon.png' },
  { text: 'Okçu Rehberi',    img: '/archer-icon.png' },
  { text: 'Priest Rehberi',  img: '/dreadshield.png' },
  { text: 'Mage Rehberi',    img: '/staffwoe.png' },
  { text: 'WS Taktikleri',   img: null },
  { text: 'Knight Online\'a Dair Her Şey', img: null },
  { text: 'Asas Rehberi',    img: '/assassian-icon.png' },
  { text: 'Okçu Rehberi',    img: '/archer-icon.png' },
  { text: 'Priest Rehberi',  img: '/dreadshield.png' },
  { text: 'Mage Rehberi',    img: '/staffwoe.png' },
  { text: 'WS Taktikleri',   img: null },
  { text: 'Knight Online\'a Dair Her Şey', img: null },
  { text: 'Asas Rehberi',    img: '/assassian-icon.png' },
  { text: 'Okçu Rehberi',    img: '/archer-icon.png' },
  { text: 'Priest Rehberi',  img: '/dreadshield.png' },
  { text: 'Mage Rehberi',    img: '/staffwoe.png' },
  { text: 'WS Taktikleri',   img: null },
  { text: 'Knight Online\'a Dair Her Şey', img: null },
]

export function HeroSection() {
  const [okcuOpen, setOkcuOpen]   = useState(false)
  const [asasOpen, setAsasOpen]   = useState(false)
  const sectionRef                = useRef<HTMLElement>(null)
  const mousePosRef               = useRef({ x: 0, y: 0 })
  const [mousePos, setMousePos]   = useState({ x: 0, y: 0 })
  const rafRef                    = useRef<number | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mousePosRef.current = {
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    }
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      setMousePos({ ...mousePosRef.current })
      rafRef.current = null
    })
  }, [])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const videoY   = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const logoY    = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '6%'])

  return (
    <>
      <section
        ref={sectionRef}
        className="relative min-h-[96svh] md:min-h-[96vh] flex items-center overflow-hidden mt-[60px]"
        aria-label="Hero bölümü"
        onMouseMove={handleMouseMove}
      >
        {/* ── Zemin ── */}
        <div className="absolute inset-0" style={{ background: 'var(--bg-void)' }} />

        {/* ── Arka plan videosu ── */}
        <motion.div className="absolute inset-0" style={{ y: videoY }}>
          <video
            className="w-full h-full object-cover"
            style={{ opacity: 0.15, mixBlendMode: 'luminosity' }}
            src="/bg-video.mp4"
            autoPlay loop muted playsInline preload="metadata"
            aria-hidden="true"
          />
        </motion.div>

        {/* ── Atmosferik gradyanlar ── */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(ellipse 55% 65% at 80% 50%, rgba(184,144,58,0.07) 0%, transparent 55%),
            radial-gradient(ellipse 40% 50% at 20% 85%, rgba(212,168,83,0.04) 0%, transparent 50%),
            radial-gradient(ellipse 80% 45% at 50% 0%,  rgba(6,6,8,0.9) 0%, transparent 50%)
          `
        }} />

        {/* ── Noise texture ── */}
        <div className="absolute inset-0 pointer-events-none" style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }} />

        {/* ── Logo — sağda, parallax ── */}
        <motion.div
          className="absolute right-[5%] md:right-[4%] top-1/2 w-[50%] md:w-[44%] max-w-[580px] pointer-events-none select-none"
          style={{ y: logoY, translateY: '-50%', x: mousePos.x * -18 }}
          aria-hidden="true"
        >
          {/* Glow halo */}
          <div className="absolute inset-0 scale-90 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(184,144,58,0.14) 0%, rgba(212,168,83,0.06) 40%, transparent 65%)',
              filter: 'blur(50px)',
            }}
          />
          <motion.img
            src="/logo.png" alt=""
            className="relative w-full h-auto"
            style={{
              mixBlendMode: 'screen',
              filter: 'brightness(1.25) contrast(1.05) drop-shadow(0 0 50px rgba(212,168,83,0.3)) drop-shadow(0 0 100px rgba(184,144,58,0.15))',
              opacity: 0.45,
              x: mousePos.x * -6,
              y: mousePos.y * -6,
            }}
          />
        </motion.div>

        {/* ── Sol gradient — okunabilirlik ── */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(105deg, rgba(6,6,8,0.98) 26%, rgba(6,6,8,0.82) 50%, rgba(6,6,8,0.1) 100%)' }}
        />
        {/* Alt fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--bg-void) 0%, rgba(6,6,8,0.5) 60%, transparent 100%)' }}
        />

        {/* ── Üst çizgi aksan ── */}
        <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(184,144,58,0.35) 35%, rgba(212,168,83,0.55) 50%, rgba(184,144,58,0.3) 65%, transparent 100%)' }}
        />

        {/* ══════════════════════════════════════════════════
            İÇERİK
        ══════════════════════════════════════════════════ */}
        <motion.div
          className="relative z-10 w-full"
          style={{
            y: contentY,
            maxWidth: '1280px',
            margin: '0 auto',
            padding: 'clamp(5rem, 10vw, 7rem) clamp(1.25rem, 4vw, 2.5rem)',
          }}
        >
          <div style={{ maxWidth: 580 }}>

            {/* ── Overline tag ── */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="flex items-center gap-2 px-3 py-1.5"
                style={{
                  border: '1px solid rgba(212,168,83,0.22)',
                  background: 'rgba(212,168,83,0.06)',
                }}>
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--gold-bright)' }}
                  animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0.3, 0.8] }}
                  transition={{ repeat: Infinity, duration: 2.8 }}
                />
                <span className="text-[0.6rem] font-bold tracking-[0.3em] uppercase"
                  style={{ color: 'rgba(212,168,83,0.8)' }}>
                  Knight Online
                </span>
              </div>
              <div className="h-px flex-1 max-w-[48px]"
                style={{ background: 'linear-gradient(90deg, rgba(212,168,83,0.35), transparent)' }}
              />
            </motion.div>

            {/* ── H1 (ekran okuyucu) ── */}
            <h1 className="sr-only">
              Knight Online Rehber ve Eğitim Sitesi — MSGKO.net | Asas, Okçu, Warrior Build, Farm ve PK Taktikleri
            </h1>

            {/* ── Görsel başlık ── */}
            <div className="mb-7" aria-hidden="true">
              {/* KNIGHT ONLINE */}
              <motion.div
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                <span
                  className="block uppercase leading-[0.88] tracking-[-0.01em]"
                  style={{
                    fontFamily: 'var(--font-rajdhani), sans-serif',
                    fontSize: 'clamp(2.4rem, 5.5vw, 5.5rem)',
                    fontWeight: 900,
                    color: 'rgba(242,242,244,0.92)',
                  }}
                >
                  Knight Online
                </span>
              </motion.div>

              {/* GELİŞİM REHBERİ — gold */}
              <motion.div
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <span
                  className="block uppercase leading-[0.88] tracking-[-0.01em]"
                  style={{
                    fontFamily: 'var(--font-rajdhani), sans-serif',
                    fontSize: 'clamp(2.4rem, 5.5vw, 5.5rem)',
                    fontWeight: 900,
                    background: 'linear-gradient(115deg, #E8C96A 0%, #D4A853 35%, #B8903A 60%, #D4A853 80%, #E8C96A 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Gelişim Rehberi
                </span>
              </motion.div>

              {/* Accent çizgi */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 h-px origin-left"
                style={{
                  maxWidth: 320,
                  background: 'linear-gradient(90deg, rgba(212,168,83,0.7), rgba(212,168,83,0.2), transparent)',
                }}
              />
            </div>

            {/* ── Açıklama ── */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10 max-w-[460px]"
              style={{
                fontSize: 'clamp(0.9rem, 1.5vw, 1.02rem)',
                lineHeight: 1.82,
                color: 'rgba(160,160,184,0.62)',
              }}
            >
              Her savaş yeni bir deneyim, her eğitim daha büyük bir{' '}
              <span style={{ color: 'rgba(212,168,83,0.85)', fontWeight: 600 }}>
                gelişim fırsatıdır.
              </span>{' '}
              Ustalığa giden yolda ihtiyacın olan tüm bilgiler ve profesyonel
              eğitim içerikleri burada seni bekliyor.
            </motion.p>

            {/* ── CTA Butonlar ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-3 mb-14"
            >
              {/* Asas — primary gold */}
              <motion.button
                onClick={() => setAsasOpen(true)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                className="group relative inline-flex items-center gap-3 sm:w-auto w-full justify-center overflow-hidden"
                style={{
                  padding: '0.875rem 1.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(6,6,8,0.95)',
                  background: 'linear-gradient(120deg, #D4A853 0%, #E8C96A 45%, #D4A853 100%)',
                  border: '1px solid rgba(212,168,83,0.5)',
                  boxShadow: '0 4px 24px rgba(212,168,83,0.2), inset 0 1px 0 rgba(255,255,255,0.25)',
                  transition: 'box-shadow 0.35s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 40px rgba(212,168,83,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(212,168,83,0.2), inset 0 1px 0 rgba(255,255,255,0.25)'
                }}
              >
                {/* Shimmer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)' }} />
                <img src="/assassian-icon.png" alt="" className="relative w-6 h-6 object-contain flex-shrink-0"
                  style={{ filter: 'brightness(0.2) contrast(2)' }} />
                <span className="relative z-10">Asas Eğitimleri</span>
                <svg className="relative z-10 w-3 h-3 opacity-50 group-hover:opacity-80 group-hover:translate-x-0.5 transition-all duration-200"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </motion.button>

              {/* Okçu — secondary outline */}
              <motion.button
                onClick={() => setOkcuOpen(true)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                className="group relative inline-flex items-center gap-3 sm:w-auto w-full justify-center overflow-hidden"
                style={{
                  padding: '0.875rem 1.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(212,168,83,0.8)',
                  background: 'rgba(212,168,83,0.05)',
                  border: '1px solid rgba(212,168,83,0.28)',
                  transition: 'border-color 0.3s ease, background 0.3s ease, color 0.3s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(212,168,83,0.65)'
                  el.style.background  = 'rgba(212,168,83,0.1)'
                  el.style.color       = 'rgba(240,208,128,1)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'rgba(212,168,83,0.28)'
                  el.style.background  = 'rgba(212,168,83,0.05)'
                  el.style.color       = 'rgba(212,168,83,0.8)'
                }}
              >
                <img src="/archer-icon.png" alt="" className="relative w-6 h-6 object-contain flex-shrink-0"
                  style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.6)) sepia(0.4) hue-rotate(15deg) brightness(1.2)' }} />
                <span className="relative z-10">Okçu Eğitimleri</span>
                <svg className="relative z-10 w-3 h-3 opacity-40 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all duration-200"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </motion.button>
            </motion.div>

            {/* ── Stats ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center flex-wrap"
              style={{ gap: 'clamp(1.5rem, 3vw, 2.5rem)' }}
            >
              {STATS.map((stat, i) => (
                <div key={i} className="cursor-default">
                  <div
                    className="font-black leading-none tracking-tight"
                    style={{
                      fontFamily: 'var(--font-rajdhani), sans-serif',
                      fontSize: 'clamp(1.65rem, 3vw, 2.1rem)',
                      background: 'linear-gradient(135deg, rgba(242,242,244,0.95) 0%, rgba(212,168,83,0.7) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {stat.value}
                  </div>
                  <p className="text-[0.66rem] font-semibold tracking-[0.1em] mt-0.5 leading-none"
                    style={{ color: 'rgba(160,160,184,0.45)' }}>
                    {stat.label}
                  </p>
                </div>
              ))}

              <div className="hidden sm:block w-px h-10" style={{ background: 'rgba(255,255,255,0.06)' }} />

              {/* Canlı göstergesi */}
              <div className="flex items-center gap-2 px-2.5 py-1.5"
                style={{
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.025)',
                }}>
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: 'rgba(212,168,83,0.9)', boxShadow: '0 0 6px rgba(212,168,83,0.6)' }}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                />
                <span className="text-[0.6rem] font-bold tracking-[0.15em] uppercase"
                  style={{ color: 'rgba(212,168,83,0.7)' }}>
                  Aktif
                </span>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-0 hidden md:flex flex-col items-center gap-2"
            style={{ paddingLeft: 'clamp(1.25rem, 4vw, 2.5rem)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <div className="w-px h-10"
                style={{ background: 'linear-gradient(to bottom, transparent, rgba(212,168,83,0.3), transparent)' }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          TICKER BANDI
      ══════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="relative overflow-hidden"
        style={{
          background: 'rgba(6,6,8,0.98)',
          borderTop: '1px solid rgba(212,168,83,0.1)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
        aria-label="İçerik kategorileri"
        aria-hidden="true"
      >
        {/* Fade kenarlar */}
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, rgba(6,6,8,1), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(270deg, rgba(6,6,8,1), transparent)' }} />

        <div className="flex overflow-hidden">
          <div
            className="flex items-center shrink-0 ticker-track"
            style={{ willChange: 'transform' }}
          >
            {TICKER_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center shrink-0">
                <div className="flex items-center gap-2.5 px-7 py-3.5">
                  {item.img ? (
                    <img
                      src={item.img} alt=""
                      className="w-3.5 h-3.5 object-contain shrink-0"
                      style={{
                        mixBlendMode: 'screen',
                        filter: 'brightness(1.1) sepia(0.5) hue-rotate(15deg)',
                      }}
                    />
                  ) : (
                    <div className="w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: 'rgba(212,168,83,0.4)' }} />
                  )}
                  <span
                    className="text-[0.72rem] font-semibold tracking-[0.1em] uppercase whitespace-nowrap"
                    style={{ color: 'rgba(160,160,184,0.4)' }}
                  >
                    {item.text}
                  </span>
                </div>
                {/* Ayırıcı */}
                <div className="w-px h-3" style={{ background: 'rgba(212,168,83,0.15)' }} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <OkcuModal isOpen={okcuOpen} onClose={() => setOkcuOpen(false)} />
      <AsasModal isOpen={asasOpen} onClose={() => setAsasOpen(false)} />
    </>
  )
}
