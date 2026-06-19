'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Heart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const PLATFORMS = [
  {
    id: 'kopazar',
    name: 'KOPAZAR',
    url: 'https://www.kopazar.com/streamer/musaagll',
    accent: '#f59e0b',
    accentDim: 'rgba(245,158,11,0.10)',
    accentBorder: 'rgba(245,158,11,0.22)',
    accentGlow: 'rgba(245,158,11,0.12)',
  },
  {
    id: 'bynogame',
    name: 'BYNOGAME',
    url: 'https://donate.bynogame.com/musaagll',
    accent: '#8b5cf6',
    accentDim: 'rgba(139,92,246,0.10)',
    accentBorder: 'rgba(139,92,246,0.22)',
    accentGlow: 'rgba(139,92,246,0.12)',
  },
  {
    id: 'knightpin',
    name: 'KNİGHTPİN',
    url: 'https://www.knightpin.com/tr/donate/musaagll',
    accent: '#ec4899',
    accentDim: 'rgba(236,72,153,0.10)',
    accentBorder: 'rgba(236,72,153,0.22)',
    accentGlow: 'rgba(236,72,153,0.12)',
  },
]

export function DestekClient() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#07070B' }}>

      {/* Mesh arka plan */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 55% 45% at 15% 25%, rgba(139,92,246,0.08) 0%, transparent 65%),
          radial-gradient(ellipse 45% 55% at 85% 75%, rgba(236,72,153,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 70% 35% at 50% 100%, rgba(245,158,11,0.04) 0%, transparent 50%)
        `
      }} />

      {/* Büyük logo arka plan */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <img
          src="/logo.png"
          alt=""
          aria-hidden="true"
          className="w-[520px] md:w-[700px] opacity-[0.04] select-none"
          style={{ mixBlendMode: 'screen', filter: 'grayscale(1) brightness(2)' }}
        />
      </div>

      {/* Top accent line */}
      <div className="fixed top-0 left-0 right-0 h-px pointer-events-none z-10"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.7), rgba(236,72,153,0.5), transparent)' }}
      />

      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 flex-shrink-0 mt-16"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-200 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span className="text-[0.78rem] font-medium tracking-[0.06em]">Geri Dön</span>
        </Link>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <p className="text-[0.62rem] font-bold tracking-[0.3em] uppercase mb-0.5"
            style={{ color: 'rgba(139,92,246,0.7)' }}>
            MSGKO.NET
          </p>
          <h1 className="text-[1.1rem] font-black tracking-[0.12em] uppercase text-white"
            style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
            Destek
          </h1>
        </div>

        {/* Sağ taraf boş — simetri için */}
        <div className="w-9" />
      </motion.header>

      {/* ── İçerik ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-10">

          {/* Üst yazı */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center gap-4"
          >
            <div className="relative">
              <div className="absolute inset-0 blur-2xl opacity-40 scale-150"
                style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.6), rgba(139,92,246,0.4))' }}
              />
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                className="relative w-14 h-14 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.15))',
                  border: '1px solid rgba(139,92,246,0.25)',
                }}
              >
                <Heart size={24} className="text-pink-400" fill="rgba(236,72,153,0.4)" />
              </motion.div>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-[0.06em] uppercase text-white mb-2"
                style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                Desteklemek İçin
              </h2>
              <p className="text-[0.82rem] text-white/35 leading-relaxed max-w-md tracking-[0.02em]">
                İçeriklerimizi beğendiysen aşağıdaki platformlardan destek olabilirsin.<br />
                Her destek yeni videolar için büyük motivasyon.
              </p>
            </div>

            <div className="w-16 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)' }} />
          </motion.div>

          {/* Platform kartları */}
          <div className="w-full flex flex-col gap-4">
            {PLATFORMS.map((p, i) => (
              <motion.a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex items-center px-6 py-6 transition-all duration-300 cursor-pointer"
                style={{
                  background: p.accentDim,
                  border: `1px solid ${p.accentBorder}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = p.accent
                  e.currentTarget.style.boxShadow = `0 8px 40px ${p.accentGlow}, 0 0 0 1px ${p.accentBorder}`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = p.accentBorder
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Sol accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{ background: `linear-gradient(180deg, ${p.accent}, transparent)`, opacity: 0.5 }}
                />
                <div className="absolute left-0 top-0 bottom-0 w-[3px] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"
                  style={{ background: p.accent }}
                />

                {/* İsim — tam orta */}
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-[1.5rem] font-black tracking-[0.15em] uppercase text-white"
                    style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                    {p.name}
                  </span>
                </div>

                {/* Ok */}
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center opacity-25 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300"
                  style={{ color: p.accent }}
                >
                  <ExternalLink size={16} />
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `linear-gradient(90deg, ${p.accentGlow}, transparent 60%)` }}
                />
              </motion.a>
            ))}
          </div>

          {/* Alt not */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[0.68rem] text-white/20 text-center tracking-[0.06em]"
          >
            Tüm platformlar güvenli ödeme altyapısı kullanmaktadır.
          </motion.p>
        </div>
      </div>
    </div>
  )
}
