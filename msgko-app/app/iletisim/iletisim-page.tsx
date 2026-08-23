'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function IletisimPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#07070B' }}>
      <div className="fixed inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 55% 45% at 15% 25%, rgba(139,92,246,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 45% 55% at 85% 75%, rgba(236,72,153,0.06) 0%, transparent 55%)
        `
      }} />
      <div className="fixed top-0 left-0 right-0 h-px pointer-events-none z-10"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.7), rgba(236,72,153,0.5), transparent)' }}
      />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 flex-shrink-0 mt-16"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-200 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span className="text-[0.78rem] font-medium tracking-[0.06em]">Geri Dön</span>
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <p className="text-[0.62rem] font-bold tracking-[0.3em] uppercase mb-0.5"
            style={{ color: 'rgba(139,92,246,0.7)' }}>MSGKO.NET</p>
          <h1 className="text-[1.1rem] font-black tracking-[0.12em] uppercase text-white"
            style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>İletişim</h1>
        </div>
        <div className="w-24" />
      </motion.header>

      {/* İçerik */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[400px] flex flex-col gap-4">

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-center mb-4">
            <p className="text-[0.72rem] text-white/35 leading-relaxed">
              Sosyal medya veya e-posta ile ulaşabilirsin.
            </p>
          </motion.div>

          {/* Instagram */}
          <motion.a
            href="https://www.instagram.com/msgclip"
            target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4 px-5 py-5 group"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px',
              transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(236,72,153,0.4)'
              e.currentTarget.style.background = 'rgba(236,72,153,0.06)'
              e.currentTarget.style.boxShadow = '0 0 24px rgba(236,72,153,0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div className="w-11 h-11 flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(131,58,180,0.2), rgba(253,29,29,0.15))', border: '1px solid rgba(236,72,153,0.25)', borderRadius: '10px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(240,130,180,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[0.62rem] font-semibold tracking-[0.16em] uppercase mb-0.5" style={{ color: 'rgba(180,180,200,0.4)' }}>Instagram</p>
              <p className="text-[0.92rem] font-semibold text-white/85 group-hover:text-white transition-colors">@msgclip</p>
            </div>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="text-white/20 group-hover:text-pink-400/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 flex-shrink-0">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </motion.a>

          {/* Gmail */}
          <motion.a
            href="mailto:imusaagll@gmail.com"
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4 px-5 py-5 group"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px',
              transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'
              e.currentTarget.style.background = 'rgba(139,92,246,0.06)'
              e.currentTarget.style.boxShadow = '0 0 24px rgba(139,92,246,0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div className="w-11 h-11 flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '10px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[0.62rem] font-semibold tracking-[0.16em] uppercase mb-0.5" style={{ color: 'rgba(180,180,200,0.4)' }}>E-Posta</p>
              <p className="text-[0.92rem] font-semibold text-white/85 group-hover:text-white transition-colors truncate">imusaagll@gmail.com</p>
            </div>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="text-white/20 group-hover:text-purple-400/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 flex-shrink-0">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </motion.a>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            className="flex items-center justify-center gap-1.5 mt-2 pt-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(139,92,246,0.4)' }} />
            <p className="text-[0.6rem] tracking-[0.1em] uppercase" style={{ color: 'rgba(139,92,246,0.4)' }}>MSGKO.NET</p>
            <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(139,92,246,0.4)' }} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
