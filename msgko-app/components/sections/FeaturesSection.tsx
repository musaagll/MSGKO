'use client'

import { motion } from 'framer-motion'
import { FEATURES } from '@/lib/data'

/* ── İkonlar — minimal outline, altın tona oturur ─────────────────────── */
const ICONS = [
  <svg key="1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>,
  <svg key="2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>,
  <svg key="3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>,
  <svg key="4" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>,
]

export function FeaturesSection() {
  return (
    <section
      className="relative overflow-hidden"
      aria-label="Özellikler"
      style={{ padding: 'var(--section-py) 0', background: 'var(--bg-primary)' }}
    >
      {/* ── Arka plan ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 50% 100%, rgba(184,144,58,0.05) 0%, transparent 55%),
            radial-gradient(ellipse 40% 35% at 0% 0%,    rgba(212,168,83,0.03) 0%, transparent 50%)
          `,
        }}
      />
      {/* Üst çizgi */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)' }}
      />

      <div className="relative max-w-[1280px] mx-auto"
        style={{ padding: '0 clamp(1.25rem, 4vw, 2.5rem)' }}>

        {/* ── Section başlık ── */}
        <div className="text-center mb-16">
          <motion.p
            className="section-label mb-3"
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            Neden MSG?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            style={{
              fontFamily: 'var(--font-rajdhani), sans-serif',
              fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)',
              fontWeight: 900,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'rgba(242,242,244,0.9)',
            }}
          >
            Premium İçerik
          </motion.h2>

          {/* Gold accent line */}
          <motion.div
            className="mx-auto mt-4 h-px"
            style={{
              maxWidth: 80,
              background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.55), transparent)',
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          />
        </div>

        {/* ── Kartlar ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden cursor-default"
              style={{
                padding: '1.75rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                transition: 'border-color 0.35s ease, box-shadow 0.35s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'rgba(212,168,83,0.22)'
                el.style.boxShadow   = '0 12px 40px rgba(0,0,0,0.45), 0 0 28px rgba(212,168,83,0.06)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'var(--border-subtle)'
                el.style.boxShadow   = 'none'
              }}
            >
              {/* Hover background glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 0%, rgba(212,168,83,0.05) 0%, transparent 65%)' }}
              />

              {/* Üst gold line — hover'da görünür */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.5), transparent)' }}
              />

              {/* İkon kutusu */}
              <div className="relative mb-6 inline-flex items-center justify-center w-11 h-11"
                style={{
                  border: '1px solid rgba(212,168,83,0.16)',
                  background: 'rgba(212,168,83,0.05)',
                  color: 'rgba(212,168,83,0.75)',
                  transition: 'border-color 0.3s, color 0.3s, background 0.3s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = 'rgba(212,168,83,0.4)'
                  el.style.color       = 'rgba(212,168,83,1)'
                  el.style.background  = 'rgba(212,168,83,0.1)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = 'rgba(212,168,83,0.16)'
                  el.style.color       = 'rgba(212,168,83,0.75)'
                  el.style.background  = 'rgba(212,168,83,0.05)'
                }}
              >
                {ICONS[i]}
                {/* İkon glow */}
                <div className="absolute inset-0 blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'rgba(212,168,83,0.6)' }} />
              </div>

              {/* Metin */}
              <div className="relative">
                <h3
                  className="mb-2.5"
                  style={{
                    fontFamily: 'var(--font-rajdhani), sans-serif',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(242,242,244,0.85)',
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.74rem', lineHeight: 1.72, color: 'rgba(160,160,184,0.5)' }}>
                  {feature.description}
                </p>
              </div>

              {/* Numara filigranı */}
              <div
                className="absolute bottom-2 right-3.5 font-black leading-none select-none pointer-events-none opacity-[0.03] group-hover:opacity-[0.055] transition-opacity duration-500"
                style={{
                  fontFamily: 'var(--font-rajdhani), sans-serif',
                  fontSize: '3.5rem',
                  color: 'var(--gold-bright)',
                }}
                aria-hidden="true"
              >
                0{i + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
