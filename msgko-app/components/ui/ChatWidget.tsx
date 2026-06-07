'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, ArrowUpRight, Sparkles } from 'lucide-react'

const INSTAGRAM_DM_URL = 'https://ig.me/m/msgclip'

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <div className="fixed bottom-6 left-6 z-[400] flex flex-col items-start gap-3">

      {/* ── Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.88, y: 16, filter: 'blur(8px)' }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ transformOrigin: 'bottom left' }}
            className="w-80 overflow-hidden relative"
          >
            {/* Glass card */}
            <div
              className="relative overflow-hidden"
              style={{
                background: 'rgba(10, 10, 18, 0.92)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(139,92,246,0.2)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.7), 0 0 40px rgba(139,92,246,0.08)',
              }}
            >
              {/* Animated top glow */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.8) 30%, rgba(236,72,153,0.8) 70%, transparent 100%)',
                }}
              />

              {/* Ambient glow blob */}
              <div
                className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
              />

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 relative">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.2))',
                        border: '1px solid rgba(139,92,246,0.3)',
                      }}
                    >
                      <Image
                        src="/logo.png"
                        alt="MSG"
                        width={36}
                        height={36}
                        className="object-contain"
                        style={{ mixBlendMode: 'screen' }}
                      />
                    </div>
                    {/* Online dot */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0a12]" />
                  </div>

                  <div>
                    <p className="text-white font-bold text-[0.88rem] tracking-[0.05em]">MSG</p>
                    <div className="flex items-center gap-1.5">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                      <p className="text-emerald-400 text-[0.65rem] font-medium tracking-wide">Çevrimiçi</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                  aria-label="Kapat"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Divider */}
              <div className="mx-5" style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

              {/* Body */}
              <div className="px-5 py-5 space-y-4">

                {/* Message bubble */}
                <div className="flex items-start gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(236,72,153,0.3))', border: '1px solid rgba(139,92,246,0.25)' }}
                  >
                    <Sparkles size={12} className="text-purple-300" />
                  </div>
                  <div
                    className="flex-1 px-4 py-3 text-[0.82rem] text-[#C8C8D8] leading-relaxed"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '0 12px 12px 12px',
                    }}
                  >
                    Merhaba! 👋 Soru ve görüşleriniz için Instagram üzerinden bana ulaşabilirsiniz.
                  </div>
                </div>

                {/* CTA Button */}
                <motion.a
                  href={INSTAGRAM_DM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 w-full px-4 py-3.5 relative overflow-hidden group"
                  style={{
                    background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
                    boxShadow: '0 8px 24px rgba(131,58,180,0.35), 0 0 0 1px rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                  }}
                >
                  {/* Shine effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)',
                    }}
                  />

                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="flex-shrink-0 relative z-10">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>

                  <span className="flex-1 text-white font-bold text-[0.82rem] tracking-[0.04em] relative z-10">
                    Instagram&apos;dan Mesaj Gönder
                  </span>

                  <ArrowUpRight size={16} className="text-white/70 flex-shrink-0 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </motion.a>

              </div>

              {/* Footer */}
              <div className="px-5 pb-4">
                <p className="text-center text-[0.62rem] tracking-[0.08em]" style={{ color: 'rgba(255,255,255,0.18)' }}>
                  @msgclip · Instagram DM
                </p>
              </div>

              {/* Bottom glow */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.3), transparent)' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Bubble ── */}
      <div className="relative">
        {/* Tooltip */}
        <AnimatePresence>
          {hovered && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute left-[68px] top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none"
              style={{
                background: 'rgba(10,10,18,0.95)',
                border: '1px solid rgba(139,92,246,0.25)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                padding: '6px 14px',
              }}
            >
              <p className="text-white text-[0.75rem] font-medium">Soru ve görüşleriniz için</p>
              <div
                className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent"
                style={{ borderRightColor: 'rgba(139,92,246,0.25)' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outer pulse */}
        {!isOpen && (
          <>
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{
                background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
                animationDuration: '3s',
              }}
            />
            <div
              className="absolute -inset-1 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
                filter: 'blur(8px)',
              }}
            />
          </>
        )}

        {/* Main button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen((p) => !p)}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          className="relative w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: isOpen
              ? 'linear-gradient(135deg, #2a2a3e, #1a1a2e)'
              : 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)',
            boxShadow: isOpen
              ? '0 8px 32px rgba(0,0,0,0.5)'
              : '0 8px 32px rgba(139,92,246,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
          aria-label="Sohbet panelini aç"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={20} className="text-white/80" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle size={22} className="text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  )
}
