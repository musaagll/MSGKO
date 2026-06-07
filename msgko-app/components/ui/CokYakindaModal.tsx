'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface CokYakindaModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  icon?: string
  img?: string | null
}

export function CokYakindaModal({ isOpen, onClose, title, icon = '⚔', img }: CokYakindaModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cy-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[500]"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
          />

          {/* Modal — tam orta */}
          <motion.div
            key="cy-modal"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="fixed z-[501] w-[90vw] max-w-[380px] overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              background: 'rgba(7,7,11,0.97)',
              border: '1px solid rgba(139,92,246,0.25)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.8), 0 0 60px rgba(139,92,246,0.1)',
            }}
            role="dialog"
            aria-modal="true"
          >
            {/* Top gradient border */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.8), rgba(236,72,153,0.6), transparent)' }}
            />

            {/* Ambient glow */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(20px)' }}
            />

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all duration-200 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
              aria-label="Kapat"
            >
              <X size={13} />
            </button>

            {/* Content */}
            <div className="px-10 py-12 flex flex-col items-center text-center relative">

              {/* Icon */}
              <div className="relative mb-6">
                <div
                  className="w-20 h-20 flex items-center justify-center overflow-hidden"
                  style={{
                    background: 'rgba(139,92,246,0.08)',
                    border: '1px solid rgba(139,92,246,0.25)',
                  }}
                >
                  {img ? (
                    <Image
                      src={img}
                      alt={title}
                      width={64}
                      height={64}
                      className="object-contain"
                      style={{ filter: 'brightness(1.15) contrast(1.1)' }}
                    />
                  ) : (
                    <span className="text-3xl">{icon}</span>
                  )}
                </div>
                {/* Icon glow */}
                <div className="absolute inset-0 blur-2xl opacity-40 pointer-events-none"
                  style={{ background: 'rgba(139,92,246,0.4)' }}
                />
              </div>

              {/* Title */}
              <h2 className="font-display text-white font-bold text-xl tracking-[0.12em] uppercase mb-2">
                {title}
              </h2>

              {/* Divider */}
              <div className="w-12 h-px my-4"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)' }}
              />

              {/* Coming soon badge */}
              <div className="flex items-center gap-2 px-5 py-2 mb-4"
                style={{
                  background: 'rgba(139,92,246,0.08)',
                  border: '1px solid rgba(139,92,246,0.2)',
                }}
              >
                {/* Animated dot */}
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: 'rgba(139,92,246,0.9)' }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
                <span className="text-[0.82rem] font-bold tracking-[0.2em] uppercase"
                  style={{ color: 'rgba(167,139,250,0.9)' }}>
                  Çok Yakında
                </span>
              </div>

              {/* Description */}
              <p className="text-[0.78rem] leading-relaxed mb-8"
                style={{ color: 'rgba(180,180,200,0.45)' }}>
                Bu bölüm için içerik hazırlanıyor.
                <br />Kısa sürede burada olacak.
              </p>

              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                className="text-[0.7rem] tracking-[0.12em] uppercase transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                style={{ color: 'rgba(255,255,255,0.2)' }}
              >
                Kapat
              </button>
            </div>

            {/* Bottom glow */}
            <div className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.3), transparent)' }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
