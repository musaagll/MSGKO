'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollDetect } from '@/hooks/useScrollDetect'
import { useMobileMenu } from '@/hooks/useMobileMenu'
import { MobileMenu } from './MobileMenu'
import { IletisimModal } from '@/components/ui/IletisimModal'
import { AsasModal } from '@/components/ui/AsasModal'
import { SearchBar } from '@/components/ui/SearchBar'
import { SidePanel } from '@/components/ui/SidePanel'
import { YoutubePanel } from '@/components/ui/YoutubePanel'
import { InstagramModal } from '@/components/ui/InstagramModal'
import { WallpaperModal } from '@/components/ui/WallpaperModal'
import { NAV_ITEMS } from '@/lib/data'

/* ── Rehber dropdown verisi ──────────────────────────────────────────── */
const REHBER_ITEMS = [
  { label: 'Asas Rehberi',        href: '/rehber/asas',          desc: 'STR/DEX, combo ve PK' },
  { label: 'Okçu Rehberi',        href: '/rehber/okcu',          desc: 'DEX build ve taktikler' },
  { label: 'Warrior Rehberi',     href: '/rehber/warrior',       desc: 'Tank ve DPS build' },
  { label: 'Mage Rehberi',        href: '/rehber/mage',          desc: 'INT ve AOE taktikler' },
  { label: 'Priest Rehberi',      href: '/rehber/priest',        desc: 'Heal ve buff stratejisi' },
  { label: 'Battle Priest',       href: '/rehber/battle-priest', desc: 'Hibrit STR/INT build' },
  { label: 'Tüm Rehberler',       href: '/rehber',               desc: '' },
]

/* ── Dropdown bileşeni ───────────────────────────────────────────────── */
function NavDropdown({ label, items }: {
  label: string
  items: { label: string; href: string; desc: string }[]
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center h-[60px] gap-1.5 px-3.5 text-[0.78rem] font-medium tracking-[0.06em] uppercase transition-colors duration-200"
        style={{ color: open ? 'rgba(242,242,244,0.95)' : 'rgba(160,160,184,0.65)' }}
      >
        {label}
        <svg
          width="9" height="9" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 mt-1 min-w-[230px] z-50 overflow-hidden"
            style={{
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-default)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.75), 0 1px 0 rgba(212,168,83,0.08) inset',
            }}
            role="menu"
          >
            {/* Gold top line */}
            <div className="h-px w-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.5), transparent)' }}
            />
            {items.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between px-5 py-3.5 transition-colors duration-150"
                style={{
                  borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.035)' : 'none',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,168,83,0.05)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <div>
                  <span className="block text-[0.78rem] font-semibold tracking-[0.04em] transition-colors duration-150"
                    style={{ color: item.href === '/rehber' ? 'rgba(212,168,83,0.8)' : 'rgba(242,242,244,0.85)' }}>
                    {item.label}
                  </span>
                  {item.desc && (
                    <span className="block text-[0.65rem] mt-0.5" style={{ color: 'rgba(160,160,184,0.45)' }}>
                      {item.desc}
                    </span>
                  )}
                </div>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="opacity-0 group-hover:opacity-40 transition-opacity duration-150 flex-shrink-0"
                  style={{ color: 'var(--gold-bright)' }} aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Navbar ──────────────────────────────────────────────────────────── */
export function Navbar() {
  const pathname    = usePathname()
  const isScrolled  = useScrollDetect(20)
  const { isOpen, openMenu, closeMenu } = useMobileMenu()

  const [instagramOpen,  setInstagramOpen]  = useState(false)
  const [iletisimOpen,   setIletisimOpen]   = useState(false)
  const [youtubeOpen,    setYoutubeOpen]    = useState(false)
  const [asasModalOpen,  setAsasModalOpen]  = useState(false)
  const [wallpaperOpen,  setWallpaperOpen]  = useState(false)

  useEffect(() => {
    const handler = (e: CustomEvent<{ modalId: string }>) => {
      switch (e.detail.modalId) {
        case 'youtube':    setYoutubeOpen(true);   break
        case 'instagram':  setInstagramOpen(true);  break
        case 'wallpaper':  setWallpaperOpen(true);  break
        case 'iletisim':   setIletisimOpen(true);   break
        case 'asas':       setAsasModalOpen(true);  break
      }
    }
    window.addEventListener('msgko:openModal', handler as EventListener)
    return () => window.removeEventListener('msgko:openModal', handler as EventListener)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ isolation: 'isolate' }}
      >
        {/* ── Top accent line ── */}
        <div className="h-px w-full transition-all duration-700"
          style={{
            background: isScrolled
              ? 'linear-gradient(90deg, transparent 0%, rgba(212,168,83,0.6) 35%, rgba(212,168,83,0.4) 65%, transparent 100%)'
              : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
          }}
        />

        {/* ── Main bar ── */}
        <div
          className="h-[60px] flex items-center justify-between transition-all duration-500"
          style={{
            paddingLeft:  'clamp(1.25rem, 3vw, 2.5rem)',
            paddingRight: 'clamp(1.25rem, 3vw, 2.5rem)',
            background: isScrolled
              ? 'rgba(6,6,8,0.96)'
              : 'rgba(9,9,14,0.55)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            boxShadow: isScrolled
              ? '0 1px 0 rgba(255,255,255,0.045), 0 8px 48px rgba(0,0,0,0.55)'
              : 'none',
          }}
        >
          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-3 flex-shrink-0 group"
            aria-label="Ana Sayfa — MSGKO"
          >
            <div className="relative w-9 h-9 flex-shrink-0">
              {/* Glow behind logo */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(212,168,83,0.35) 0%, transparent 70%)',
                  filter: 'blur(8px)',
                  transform: 'scale(1.8)',
                }}
              />
              <Image
                src="/logo.png"
                alt="MSG Knight Online"
                width={36} height={36}
                className="relative w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
                style={{ mixBlendMode: 'screen', filter: 'brightness(1.4) contrast(1.05)' }}
                priority
              />
            </div>

            <div className="flex flex-col leading-none">
              <span
                className="text-[0.8rem] font-black tracking-[0.18em] uppercase transition-colors duration-200"
                style={{ color: 'rgba(242,242,244,0.95)', letterSpacing: '0.18em' }}
              >
                MSG<span style={{ color: 'rgba(212,168,83,0.8)' }}>KO</span>
              </span>
              <span
                className="text-[0.45rem] tracking-[0.3em] uppercase mt-0.5"
                style={{ color: 'rgba(160,160,184,0.35)' }}
              >
                Knight Online
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center" aria-label="Ana navigasyon">
            {/* Regular nav items */}
            {NAV_ITEMS.map(item => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className="relative flex items-center h-[60px] px-3.5 text-[0.78rem] font-medium tracking-[0.06em] uppercase transition-colors duration-200 group"
                  style={{ color: isActive ? 'rgba(242,242,244,0.95)' : 'rgba(160,160,184,0.55)' }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(242,242,244,0.9)' }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(160,160,184,0.55)' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-px"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.8), transparent)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.label}
                </Link>
              )
            })}

            {/* Divider */}
            <div className="w-px h-4 mx-1" style={{ background: 'rgba(255,255,255,0.07)' }} />

            {/* Rehber dropdown */}
            <NavDropdown label="Rehber" items={REHBER_ITEMS} />

            <div className="w-px h-4 mx-1" style={{ background: 'rgba(255,255,255,0.07)' }} />

            {/* GB Fiyatları — Gold badge */}
            <Link
              href="/gb-fiyatlari"
              className="relative flex items-center h-8 px-3.5 ml-1 gap-1.5 text-[0.72rem] font-bold tracking-[0.1em] uppercase transition-all duration-300 group"
              style={{
                border: '1px solid rgba(212,168,83,0.3)',
                background: 'rgba(212,168,83,0.06)',
                color: 'rgba(212,168,83,0.8)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(212,168,83,0.65)'
                el.style.background  = 'rgba(212,168,83,0.12)'
                el.style.color       = 'rgba(240,208,128,1)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(212,168,83,0.3)'
                el.style.background  = 'rgba(212,168,83,0.06)'
                el.style.color       = 'rgba(212,168,83,0.8)'
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              GB Fiyatları
            </Link>

            {/* Pazar */}
            <Link
              href="/pazar"
              className="flex items-center h-[60px] px-3.5 ml-0.5 text-[0.78rem] font-medium tracking-[0.06em] uppercase transition-colors duration-200"
              style={{ color: 'rgba(160,160,184,0.55)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(212,168,83,0.75)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(160,160,184,0.55)' }}
            >
              Pazar
            </Link>

            <div className="w-px h-4 mx-1" style={{ background: 'rgba(255,255,255,0.07)' }} />

            {/* Wallpaper */}
            <Link
              href="/wallpaper"
              className="flex items-center h-8 px-3.5 text-[0.72rem] font-semibold tracking-[0.1em] uppercase transition-all duration-300"
              style={{
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'transparent',
                color: 'rgba(160,160,184,0.5)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(255,255,255,0.12)'
                el.style.color       = 'rgba(242,242,244,0.8)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(255,255,255,0.06)'
                el.style.color       = 'rgba(160,160,184,0.5)'
              }}
            >
              Wallpaper
            </Link>

            {/* İletişim */}
            <Link
              href="/iletisim"
              className="flex items-center h-8 px-3.5 ml-1 text-[0.72rem] font-semibold tracking-[0.1em] uppercase transition-all duration-300"
              style={{
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'transparent',
                color: 'rgba(160,160,184,0.5)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(212,168,83,0.3)'
                el.style.color       = 'rgba(212,168,83,0.75)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(255,255,255,0.06)'
                el.style.color       = 'rgba(160,160,184,0.5)'
              }}
            >
              İletişim
            </Link>
          </nav>

          {/* ── Right side ── */}
          <div className="flex items-center gap-2.5">
            <div className="hidden md:block">
              <SearchBar />
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={isOpen ? closeMenu : openMenu}
              className="md:hidden flex items-center justify-center w-8 h-8 transition-all duration-200"
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(160,160,184,0.7)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,83,0.35)'
                ;(e.currentTarget as HTMLElement).style.color       = 'rgba(212,168,83,0.8)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'
                ;(e.currentTarget as HTMLElement).style.color       = 'rgba(160,160,184,0.7)'
              }}
              aria-label={isOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* ── Bottom separator (when scrolled) ── */}
        <div className="h-px transition-all duration-700"
          style={{
            background: isScrolled
              ? 'rgba(255,255,255,0.04)'
              : 'transparent',
          }}
        />
      </motion.header>

      {/* ── Modals & Panels ── */}
      <MobileMenu
        isOpen={isOpen}
        onClose={closeMenu}
        onYoutubeOpen={() => setYoutubeOpen(true)}
        onInstagramOpen={() => setInstagramOpen(true)}
        onIletisimOpen={() => setIletisimOpen(true)}
        onAsasOpen={() => setAsasModalOpen(true)}
        onWallpaperOpen={() => setWallpaperOpen(true)}
      />
      <IletisimModal  isOpen={iletisimOpen}   onClose={() => setIletisimOpen(false)} />
      <AsasModal      isOpen={asasModalOpen}  onClose={() => setAsasModalOpen(false)} />
      <WallpaperModal isOpen={wallpaperOpen}  onClose={() => setWallpaperOpen(false)} />

      <SidePanel
        isOpen={youtubeOpen}
        onClose={() => setYoutubeOpen(false)}
        title="YouTube"
        subtitle="@musaagll"
        accentColor="#D4A853"
        externalUrl="https://www.youtube.com/@musaagll/videos"
        externalLabel="YouTube Kanalına Git"
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(212,168,83,0.9)">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        }
      >
        <YoutubePanel />
      </SidePanel>

      <InstagramModal isOpen={instagramOpen} onClose={() => setInstagramOpen(false)} />
    </>
  )
}
