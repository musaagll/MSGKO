'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowUpRight } from 'lucide-react'
import { useModal } from '@/hooks/useModal'

interface SidePanelProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  icon: React.ReactNode
  accentColor: string
  children: React.ReactNode
  externalUrl?: string
  externalLabel?: string
}

export function SidePanel({
  isOpen, onClose, title, subtitle, icon,
  accentColor, children, externalUrl, externalLabel
}: SidePanelProps) {

  useModal(isOpen, onClose)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="sp-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[300]"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Panel — sağdan kayar */}
          <motion.div
            key="sp-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 h-full z-[301] flex flex-col w-full max-w-xl"
            style={{
              background: 'rgba(7,7,11,0.98)',
              borderLeft: `1px solid ${accentColor}30`,
              boxShadow: `-20px 0 80px rgba(0,0,0,0.7), -1px 0 0 ${accentColor}20`,
            }}
            role="dialog"
            aria-modal="true"
          >
            {/* Left accent line */}
            <div className="absolute top-0 left-0 bottom-0 w-[2px]"
              style={{ background: `linear-gradient(180deg, transparent 0%, ${accentColor} 30%, ${accentColor} 70%, transparent 100%)`, opacity: 0.6 }}
            />

            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 flex-shrink-0"
              style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                  style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}35` }}>
                  {icon}
                </div>
                <div>
                  <p className="text-white font-bold text-[0.95rem] tracking-[0.05em]">{title}</p>
                  {subtitle && (
                    <p className="text-[0.7rem] mt-0.5" style={{ color: 'rgba(180,180,200,0.4)' }}>{subtitle}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[0.65rem] tracking-[0.1em] hidden sm:block" style={{ color: 'rgba(255,255,255,0.18)' }}>
                  ESC kapat
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all duration-200"
                  aria-label="Kapat"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>

            {/* Footer */}
            {externalUrl && (
              <div className="px-7 py-5 flex-shrink-0"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 text-[0.78rem] font-bold tracking-[0.08em] uppercase text-white transition-all duration-200 hover:opacity-90 group"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}cc, ${accentColor}88)`,
                    boxShadow: `0 4px 20px ${accentColor}30`,
                  }}
                >
                  {externalLabel ?? 'Tümünü Gör'}
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
