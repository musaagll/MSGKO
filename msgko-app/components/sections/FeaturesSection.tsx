'use client'

import { motion } from 'framer-motion'
import { FEATURES } from '@/lib/data'

const ICONS = [
  <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>,
  <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>,
  <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>,
  <svg key="4" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>,
]

export function FeaturesSection() {
  return (
    <section
      style={{
        position: 'relative',
        padding: 'var(--section-pt) 0 var(--section-pb)',
        background: 'var(--void)',
        overflow: 'hidden',
      }}
      aria-label="Özellikler"
    >
      {/* Arka plan */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(201,168,76,0.04) 0%, transparent 55%)',
      }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />

      <div style={{ position: 'relative', maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0 var(--page-px)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <motion.p
            className="section-label"
            style={{ marginBottom: 12, justifyContent: 'center' }}
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
            Neden MSGKO?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            style={{
              fontFamily: "'Cinzel', var(--font-rajdhani), sans-serif",
              fontSize: 'clamp(1.7rem, 3.5vw, 2.6rem)',
              fontWeight: 900,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--platinum)',
              marginBottom: 12,
            }}
          >
            Platform İçeriği
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            style={{ height: 2, maxWidth: 80, margin: '0 auto', background: 'linear-gradient(90deg, transparent, var(--crimson), var(--crimson-bright), transparent)' }}
          />
        </div>

        {/* Kartlar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              className="card-gaming group"
              style={{ padding: '28px 24px', cursor: 'default', position: 'relative', overflow: 'hidden' }}
            >
              {/* Köşe aksan */}
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: 40, height: 40,
                background: 'linear-gradient(225deg, rgba(201,168,76,0.07) 0%, transparent 70%)',
                opacity: 0, transition: 'opacity 0.35s',
              }} className="group-hover:opacity-100" />

              {/* Numara filigranı */}
              <div style={{
                position: 'absolute', bottom: -8, right: 10,
                fontFamily: "'Cinzel', var(--font-rajdhani), sans-serif",
                fontSize: '3.5rem', fontWeight: 900,
                color: 'rgba(255,255,255,0.03)',
                lineHeight: 1,
                pointerEvents: 'none', userSelect: 'none',
              }} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* İkon */}
              <div style={{
                width: 48, height: 48,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(201,168,76,0.07)',
                border: '1px solid rgba(201,168,76,0.16)',
                color: 'var(--crimson-bright)',
                marginBottom: 20,
                transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
              }} className="group-hover:glow-crimson">
                {ICONS[i]}
              </div>

              <h3 style={{
                fontFamily: "'Cinzel', var(--font-rajdhani), sans-serif",
                fontSize: '0.85rem', fontWeight: 800,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--platinum)', marginBottom: 10,
              }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '0.74rem', lineHeight: 1.7, color: 'var(--iron)' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
