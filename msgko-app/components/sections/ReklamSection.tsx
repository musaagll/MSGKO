'use client'

import { motion } from 'framer-motion'
import { Megaphone } from 'lucide-react'

const SPONSOR_CARDS = [
  {
    id: 1,
    line1: 'YOUR BRAND',
    line2: 'Sponsor',
    line3: 'Premium Placement',
    accent: 'rgba(139,92,246,0.5)',
    accentBg: 'rgba(139,92,246,0.06)',
    accentBorder: 'rgba(139,92,246,0.18)',
  },
  {
    id: 2,
    line1: 'YOUR BRAND',
    line2: 'Sponsor',
    line3: 'Premium Placement',
    accent: 'rgba(59,130,246,0.5)',
    accentBg: 'rgba(59,130,246,0.06)',
    accentBorder: 'rgba(59,130,246,0.18)',
  },
  {
    id: 3,
    line1: 'YOUR BRAND',
    line2: 'Sponsor',
    line3: 'Premium Placement',
    accent: 'rgba(236,72,153,0.5)',
    accentBg: 'rgba(236,72,153,0.06)',
    accentBorder: 'rgba(236,72,153,0.18)',
  },
]

export function ReklamSection() {
  return (
    <section
      className="relative py-20 px-6 sm:px-8 overflow-hidden"
      aria-label="Reklam alanı"
      style={{ background: '#07070B', borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 100%, rgba(139,92,246,0.04) 0%, transparent 60%)' }}
      />

      <div className="relative max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-8 md:p-10"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.01) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          }}
          whileHover={{
            borderColor: 'rgba(255,255,255,0.13)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.32)',
          }}
        >
          {/* ── Sol: İçerik ── */}
          <div className="flex flex-col gap-6">

            {/* Üst etiket */}
            <div className="flex items-center gap-2">
              <div className="w-px h-4" style={{ background: 'rgba(139,92,246,0.5)' }} />
              <span className="text-[0.65rem] font-bold tracking-[0.28em] uppercase"
                style={{ color: 'rgba(139,92,246,0.7)' }}>
                Reklam Alanı
              </span>
            </div>

            {/* İkon + Başlık */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center"
                style={{
                  background: 'rgba(139,92,246,0.08)',
                  border: '1px solid rgba(139,92,246,0.2)',
                  borderRadius: '12px',
                }}>
                <Megaphone size={20} style={{ color: 'rgba(167,139,250,0.8)' }} />
              </div>
              <div>
                <h2 className="text-[1.6rem] md:text-[1.9rem] font-black tracking-[-0.02em] text-white leading-tight mb-2"
                  style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                  Buraya Reklam<br />Verebilirsiniz
                </h2>
                <p className="text-[0.85rem] leading-[1.7]" style={{ color: 'rgba(200,200,216,0.45)' }}>
                  Markanızı binlerce Knight Online oyuncusuna ulaştırın.<br />
                  Premium reklam alanlarımız hakkında bilgi alın.
                </p>
              </div>
            </div>

            {/* Metrikler */}
            <div className="flex items-center gap-6 py-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {[
                { value: '15K+', label: 'Aylık Ziyaretçi' },
                { value: '120+', label: 'İçerik' },
                { value: '%100', label: 'Organik Trafik' },
              ].map(m => (
                <div key={m.label}>
                  <p className="text-[1.1rem] font-black text-white" style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>{m.value}</p>
                  <p className="text-[0.65rem] tracking-[0.08em]" style={{ color: 'rgba(255,255,255,0.3)' }}>{m.label}</p>
                </div>
              ))}
            </div>

            {/* Butonlar kaldırıldı */}
          </div>

          {/* ── Sağ: Sponsor Kartları ── */}
          <div className="flex flex-col gap-3">
            {SPONSOR_CARDS.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="relative flex items-center gap-4 px-5 py-4 cursor-default"
                style={{
                  background: card.accentBg,
                  border: `1px solid ${card.accentBorder}`,
                  borderRadius: '14px',
                  transition: 'all 250ms ease',
                }}
              >
                {/* Logo placeholder */}
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${card.accentBorder}`,
                    borderRadius: '10px',
                  }}>
                  <div className="w-5 h-5 rounded-sm" style={{ background: card.accent, opacity: 0.5 }} />
                </div>

                {/* Metin */}
                <div className="flex-1 min-w-0">
                  <p className="text-[0.82rem] font-bold tracking-[0.08em] text-white/70">{card.line1}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[0.62rem] font-bold tracking-[0.14em] uppercase px-1.5 py-0.5"
                      style={{ background: card.accentBg, color: card.accent, border: `1px solid ${card.accentBorder}`, borderRadius: '4px' }}>
                      {card.line2}
                    </span>
                    <span className="text-[0.65rem]" style={{ color: 'rgba(255,255,255,0.25)' }}>{card.line3}</span>
                  </div>
                </div>

                {/* Sağ ok */}
                <div className="flex-shrink-0 opacity-20">
                  <ExternalLink size={13} style={{ color: 'white' }} />
                </div>

                {/* Sol accent çizgi */}
                <div className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full"
                  style={{ background: card.accent, opacity: 0.6 }} />
              </motion.div>
            ))}

            {/* Alt not */}
            <p className="text-[0.62rem] text-center tracking-[0.06em] mt-1" style={{ color: 'rgba(255,255,255,0.15)' }}>
              Reklam alanları için iletişime geçin
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
