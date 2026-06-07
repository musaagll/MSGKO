'use client'

import { motion } from 'framer-motion'
import { FEATURES } from '@/lib/data'

const ICONS = [
  // Güncel İçerik — zap
  <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  // Detaylı Anlatım — layers
  <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  // Profesyonel Taktikler — target
  <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  // Kaliteli İçerik — shield
  <svg key="4" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
]

const ACCENT_COLORS = [
  { glow: 'rgba(139,92,246,0.55)', border: 'rgba(139,92,246,0.22)', gradient: 'rgba(109,40,217,0.18)', text: '#a78bfa' },
  { glow: 'rgba(59,130,246,0.55)', border: 'rgba(59,130,246,0.22)', gradient: 'rgba(37,99,235,0.18)', text: '#93c5fd' },
  { glow: 'rgba(236,72,153,0.55)', border: 'rgba(236,72,153,0.22)', gradient: 'rgba(219,39,119,0.18)', text: '#f9a8d4' },
  { glow: 'rgba(245,158,11,0.55)', border: 'rgba(245,158,11,0.22)', gradient: 'rgba(217,119,6,0.18)', text: '#fcd34d' },
]

export function FeaturesSection() {
  return (
    <section className="relative py-24 px-6 sm:px-8 overflow-hidden" aria-label="Özellikler">
      {/* Background */}
      <div className="absolute inset-0 bg-[#07070B]" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(109,40,217,0.07) 0%, transparent 55%)' }}
      />
      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' }}
      />

      <div className="relative max-w-[1280px] mx-auto">
        {/* Section heading */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[0.68rem] font-bold tracking-[0.28em] uppercase mb-3"
            style={{ color: 'rgba(139,92,246,0.8)' }}
          >
            Neden MSG?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-3xl md:text-4xl font-black tracking-[0.06em] uppercase text-white mb-4"
            style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}
          >
            Premium İçerik
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="mx-auto h-px w-24"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(236,72,153,0.5), transparent)' }}
          />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="relative group overflow-hidden p-6 cursor-default"
              style={{
                background: 'rgba(255,255,255,0.018)',
                border: `1px solid ${ACCENT_COLORS[i].border}`,
                boxShadow: '0 4px 24px rgba(0,0,0,0.28)',
                transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.4), 0 0 32px ${ACCENT_COLORS[i].border}`
                e.currentTarget.style.borderColor = ACCENT_COLORS[i].glow.replace('0.55', '0.4')
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.28)'
                e.currentTarget.style.borderColor = ACCENT_COLORS[i].border
              }}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse 80% 80% at 50% 0%, ${ACCENT_COLORS[i].gradient} 0%, transparent 70%)` }}
              />

              {/* Top glow line */}
              <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `linear-gradient(90deg, transparent, ${ACCENT_COLORS[i].glow}, transparent)` }}
              />

              {/* Icon */}
              <div className="relative mb-5 inline-flex">
                <div
                  className="w-12 h-12 flex items-center justify-center transition-all duration-400"
                  style={{
                    background: `${ACCENT_COLORS[i].gradient}`,
                    border: `1px solid ${ACCENT_COLORS[i].border}`,
                    color: ACCENT_COLORS[i].text,
                    boxShadow: `0 0 0 0 ${ACCENT_COLORS[i].glow}`,
                    transition: 'box-shadow 0.4s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${ACCENT_COLORS[i].glow.replace('0.55', '0.35')}`
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 0 ${ACCENT_COLORS[i].glow}`
                  }}
                >
                  {ICONS[i]}
                </div>
                {/* Icon glow */}
                <div className="absolute inset-0 w-12 h-12 blur-xl opacity-0 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none"
                  style={{ background: ACCENT_COLORS[i].glow }}
                />
              </div>

              {/* Text */}
              <div className="relative">
                <h3 className="text-[0.85rem] font-bold tracking-[0.1em] uppercase text-white mb-2.5 transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-[0.75rem] leading-[1.65]" style={{ color: 'rgba(180,180,200,0.52)' }}>
                  {feature.description}
                </p>
              </div>

              {/* Number watermark */}
              <div className="absolute bottom-3 right-4 font-black opacity-[0.035] group-hover:opacity-[0.065] transition-opacity duration-500 leading-none select-none pointer-events-none text-white"
                style={{ fontFamily: 'var(--font-rajdhani), sans-serif', fontSize: '3rem' }}>
                0{i + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
