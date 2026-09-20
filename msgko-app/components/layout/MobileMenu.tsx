'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { X, ChevronRight, Swords } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/data'

interface Props {
  isOpen: boolean
  onClose: () => void
  onYoutubeOpen:   () => void
  onInstagramOpen: () => void
  onIletisimOpen:  () => void
  onAsasOpen:      () => void
  onWallpaperOpen: () => void
}

const CLASS_ITEMS = [
  { label: 'Asas Eğitimleri',  href: null,          img: '/assassin-icon.png', onClick: 'asas' as const },
  { label: 'Okçu Rehberi',     href: '/rehber/okcu', img: '/archer-icon.png',   onClick: null },
  { label: 'Warrior Rehberi',  href: '/rehber/warrior', img: null,              onClick: null },
  { label: 'Mage Rehberi',     href: '/rehber/mage', img: '/staffwoe.png',      onClick: null },
  { label: 'Priest Rehberi',   href: '/rehber/priest', img: '/dreadshield.png', onClick: null },
]

export function MobileMenu({ isOpen, onClose, onYoutubeOpen, onInstagramOpen, onIletisimOpen, onAsasOpen, onWallpaperOpen }: Props) {
  const pathname = usePathname()

  const handleAction = (item: typeof CLASS_ITEMS[number]) => {
    if (item.onClick === 'asas') { onAsasOpen(); onClose(); return }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 198,
              background: 'rgba(8,10,15,0.85)',
              backdropFilter: 'blur(8px)',
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: 'min(320px, 88vw)',
              zIndex: 200,
              background: 'var(--abyss)',
              borderLeft: '1px solid var(--border-md)',
              display: 'flex', flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* Kırmızı sol şerit */}
            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0, width: 2,
              background: 'linear-gradient(180deg, var(--crimson), var(--ember), transparent)',
            }} />

            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 20px',
              borderBottom: '1px solid var(--border)',
            }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--platinum)', fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                  MSG<span style={{ color: 'var(--crimson-bright)' }}>KO</span>
                </span>
                <p style={{ fontSize: '0.48rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--iron)', marginTop: 2 }}>
                  Knight Online Platform
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{ background: 'none', border: '1px solid var(--border)', padding: '6px', color: 'var(--iron)', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--crimson-bright)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-crimson)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--iron)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)' }}
                aria-label="Menüyü kapat"
              >
                <X size={16} />
              </button>
            </div>

            {/* İçerik */}
            <div style={{ flex: 1, padding: '16px 0' }}>

              {/* Sayfalar */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--iron)', padding: '0 20px 8px' }}>
                  Sayfalar
                </p>
                {[...NAV_ITEMS,
                  { label: 'GB Fiyatları', href: '/gb-fiyatlari' },
                  { label: 'Pazar', href: '/pazar' },
                  { label: 'Wallpaper', href: '/wallpaper' },
                ].map((item, i) => {
                  const active = pathname === item.href
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '11px 20px',
                          fontSize: '0.82rem', fontWeight: active ? 700 : 500,
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                          color: active ? 'var(--platinum)' : 'var(--steel)',
                          background: active ? 'var(--crimson-subtle)' : 'transparent',
                          borderLeft: active ? '2px solid var(--crimson)' : '2px solid transparent',
                          textDecoration: 'none',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = 'var(--platinum)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)' } }}
                        onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = 'var(--steel)'; (e.currentTarget as HTMLElement).style.background = 'transparent' } }}
                      >
                        {item.label}
                        {active && <ChevronRight size={12} style={{ color: 'var(--crimson-bright)' }} />}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Rehber — Sınıf divider */}
              <div style={{ height: 1, background: 'var(--border)', margin: '0 20px 20px' }} />

              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--iron)', padding: '0 20px 8px' }}>
                  Karakterler
                </p>
                {CLASS_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.25 }}
                  >
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '9px 20px',
                          fontSize: '0.8rem', fontWeight: 500, color: 'var(--steel)',
                          textDecoration: 'none', transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--platinum)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--steel)' }}
                      >
                        <div style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--crimson-subtle)', border: '1px solid var(--border-crimson)', flexShrink: 0 }}>
                          {item.img ? <Image src={item.img} alt="" width={14} height={14} style={{ objectFit: 'contain', mixBlendMode: 'screen' }} /> : <Swords size={12} style={{ color: 'var(--crimson-bright)' }} />}
                        </div>
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAction(item)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                          padding: '9px 20px',
                          fontSize: '0.8rem', fontWeight: 500, color: 'var(--steel)',
                          background: 'none', border: 'none', cursor: 'pointer',
                          textAlign: 'left', transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--platinum)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--steel)' }}
                      >
                        <div style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--crimson-subtle)', border: '1px solid var(--border-crimson)', flexShrink: 0 }}>
                          {item.img ? <Image src={item.img} alt="" width={14} height={14} style={{ objectFit: 'contain', mixBlendMode: 'screen' }} /> : <Swords size={12} style={{ color: 'var(--crimson-bright)' }} />}
                        </div>
                        {item.label}
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Sosyal */}
              <div style={{ height: 1, background: 'var(--border)', margin: '0 20px 20px' }} />
              <div>
                <p style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--iron)', padding: '0 20px 8px' }}>
                  Daha Fazla
                </p>
                {[
                  { label: 'YouTube Kanalı', href: null,       color: 'var(--crimson-bright)', action: () => { onYoutubeOpen(); onClose() } },
                  { label: 'Instagram',      href: null,       color: '#E1306C',               action: () => { onInstagramOpen(); onClose() } },
                  { label: 'İletişim',       href: null,       color: 'var(--steel)',           action: () => { onIletisimOpen(); onClose() } },
                  { label: 'Destek',         href: '/destek',  color: 'var(--crimson-bright)', action: null },
                ].map((item, i) => (
                  item.href ? (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.4 }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                          padding: '9px 20px',
                          fontSize: '0.8rem', fontWeight: 500, color: 'var(--steel)',
                          textDecoration: 'none', transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--platinum)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--steel)' }}
                      >
                        <div style={{ width: 4, height: 4, background: item.color, transform: 'rotate(45deg)', flexShrink: 0, opacity: 0.6 }} />
                        {item.label}
                      </Link>
                    </motion.div>
                  ) : (
                  <motion.button
                    key={item.label}
                    type="button"
                    onClick={item.action!}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.4 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                      padding: '9px 20px',
                      fontSize: '0.8rem', fontWeight: 500, color: 'var(--steel)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left', transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--platinum)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--steel)' }}
                  >
                    <div style={{ width: 4, height: 4, background: item.color, transform: 'rotate(45deg)', flexShrink: 0, opacity: 0.6 }} />
                    {item.label}
                  </motion.button>
                  )
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px' }}>
              <p style={{ fontSize: '0.58rem', letterSpacing: '0.1em', color: 'var(--iron)', textAlign: 'center' }}>
                © {new Date().getFullYear()} MSGKO · Knight Online Rehber Platformu
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
