'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, ChevronDown, Swords } from 'lucide-react'
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

/* ─── Rehber Dropdown Verisi ───────────────────────────────────────────── */
const REHBER_ITEMS = [
  { label: 'Asas Rehberi',    href: '/rehber/asas',          icon: '/assassian-icon.png', desc: 'STR/DEX build, combo, PK' },
  { label: 'Okçu Rehberi',    href: '/rehber/okcu',          icon: '/archer-icon.png',    desc: 'DEX yapı, taktikler' },
  { label: 'Warrior Rehberi', href: '/rehber/warrior',       icon: null,                  desc: 'Tank ve DPS build' },
  { label: 'Mage Rehberi',    href: '/rehber/mage',          icon: '/staffwoe.png',       desc: 'INT, AOE taktikler' },
  { label: 'Priest Rehberi',  href: '/rehber/priest',        icon: '/dreadshield.png',    desc: 'Heal ve buff stratejisi' },
  { label: 'Battle Priest',   href: '/rehber/battle-priest', icon: null,                  desc: 'Hibrit STR/INT build' },
]

/* ─── Rehber Mega Dropdown ─────────────────────────────────────────────── */
function RehberDropdown() {
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
        className="flex items-center gap-1.5 h-16 px-4 text-[0.75rem] font-semibold tracking-[0.08em] uppercase transition-colors duration-200"
        style={{ color: open ? 'var(--platinum)' : 'var(--steel)' }}
      >
        Rehber
        <ChevronDown size={11} style={{ transition: 'transform 0.25s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: 4, scaleY: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', top: '100%', left: '50%',
              transform: 'translateX(-50%)',
              width: 480,
              background: 'var(--abyss)',
              border: '1px solid var(--border-md)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,150,12,0.05) inset',
              transformOrigin: 'top center',
              zIndex: 100,
            }}
            role="menu"
          >
            {/* Üst kırmızı çizgi */}
            <div style={{ height: 2, background: 'linear-gradient(90deg, var(--crimson), var(--ember), transparent)' }} />

            <div style={{ padding: '12px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {REHBER_ITEMS.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 px-4 py-3 transition-all duration-150"
                  style={{ background: 'transparent' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(200,150,12,0.06)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <div style={{
                    width: 32, height: 32, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(200,150,12,0.08)',
                    border: '1px solid rgba(200,150,12,0.15)',
                  }}>
                    {item.icon
                      ? <img src={item.icon} alt="" style={{ width: 18, height: 18, objectFit: 'contain', mixBlendMode: 'screen', filter: 'brightness(1.3)' }} />
                      : <Swords size={14} style={{ color: 'var(--crimson-bright)', opacity: 0.7 }} />
                    }
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.77rem', fontWeight: 700, color: 'var(--platinum)', letterSpacing: '0.04em' }}>
                      {item.label}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--steel)', marginTop: 1 }}>
                      {item.desc}
                    </span>
                  </div>
                  <svg className="ml-auto opacity-0 group-hover:opacity-40 transition-opacity"
                    width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--crimson-bright)" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid var(--border)', padding: '10px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <Link href="/rehber" onClick={() => setOpen(false)}
                style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--crimson-bright)' }}>
                Tüm Rehberler →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Nav Link ──────────────────────────────────────────────────────────── */
function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className="relative flex items-center h-16 px-4 text-[0.75rem] font-semibold tracking-[0.08em] uppercase transition-colors duration-200"
      style={{ color: isActive ? 'var(--platinum)' : 'var(--steel)' }}
      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--platinum)' }}
      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--steel)' }}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          style={{
            position: 'absolute', bottom: 0, left: 8, right: 8, height: 2,
            background: 'linear-gradient(90deg, var(--crimson), var(--ember))',
          }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  )
}

/* ─── Navbar ────────────────────────────────────────────────────────────── */
export function Navbar() {
  const pathname   = usePathname()
  const isScrolled = useScrollDetect(20)
  const { isOpen, openMenu, closeMenu } = useMobileMenu()

  const [instagramOpen,  setInstagramOpen]  = useState(false)
  const [iletisimOpen,   setIletisimOpen]   = useState(false)
  const [youtubeOpen,    setYoutubeOpen]    = useState(false)
  const [asasModalOpen,  setAsasModalOpen]  = useState(false)
  const [wallpaperOpen,  setWallpaperOpen]  = useState(false)

  useEffect(() => {
    const handler = (e: CustomEvent<{ modalId: string }>) => {
      switch (e.detail.modalId) {
        case 'youtube':   setYoutubeOpen(true);   break
        case 'instagram': setInstagramOpen(true);  break
        case 'wallpaper': setWallpaperOpen(true);  break
        case 'iletisim':  setIletisimOpen(true);   break
        case 'asas':      setAsasModalOpen(true);  break
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
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}
      >
        {/* Üst ince çizgi */}
        <div style={{
          height: 2,
          background: isScrolled
            ? 'linear-gradient(90deg, transparent 0%, var(--crimson) 30%, var(--ember) 60%, transparent 100%)'
            : 'transparent',
          transition: 'all 0.5s ease',
        }} />

        {/* Ana bar */}
        <div
          className={isScrolled ? 'glass' : ''}
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 'clamp(1rem, 3vw, 2rem)',
            paddingRight: 'clamp(1rem, 3vw, 2rem)',
            background: isScrolled ? undefined : 'rgba(8,10,15,0.6)',
            borderBottom: isScrolled ? '1px solid var(--border)' : 'none',
            backdropFilter: isScrolled ? undefined : 'blur(12px)',
            transition: 'all 0.4s ease',
          }}
        >
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group" aria-label="MSGKO Ana Sayfa">
            <div style={{ position: 'relative', width: 40, height: 40 }}>
              {/* Glow halo */}
              <div style={{
                position: 'absolute', inset: -4,
                background: 'radial-gradient(circle, rgba(200,150,12,0.4) 0%, transparent 70%)',
                filter: 'blur(8px)',
                opacity: 0,
                transition: 'opacity 0.4s ease',
              }} className="group-hover:opacity-100" />
              <Image
                src="/logo.png" alt="MSG" width={40} height={40}
                className="relative w-full h-full object-contain"
                style={{
                  mixBlendMode: 'screen',
                  filter: 'brightness(1.5) contrast(1.1) drop-shadow(0 0 12px rgba(200,150,12,0.5))',
                  transition: 'filter 0.3s ease, transform 0.3s ease',
                }}
                priority
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{
                fontSize: '0.85rem', fontWeight: 900, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: 'var(--platinum)',
                fontFamily: 'var(--font-rajdhani), sans-serif',
              }}>
                MSG<span style={{ color: 'var(--crimson-bright)' }}>KO</span>
              </span>
              <span style={{ fontSize: '0.42rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--iron)', marginTop: 2 }}>
                Knight Online
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center" aria-label="Ana navigasyon">
            {NAV_ITEMS.map(item => (
              <NavLink key={item.href} href={item.href} label={item.label} isActive={pathname === item.href} />
            ))}

            {/* Ayırıcı */}
            <div style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 4px' }} />

            {/* Rehber dropdown */}
            <RehberDropdown />

            <div style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 4px' }} />

            {/* GB Fiyatları */}
            <Link
              href="/gb-fiyatlari"
              className="flex items-center h-9 gap-1.5 px-3.5 ml-1 text-[0.7rem] font-bold tracking-[0.12em] uppercase transition-all duration-250"
              style={{
                border: '1px solid rgba(16,185,129,0.3)',
                background: 'rgba(16,185,129,0.06)',
                color: 'rgba(16,185,129,0.85)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(16,185,129,0.6)'
                el.style.background  = 'rgba(16,185,129,0.12)'
                el.style.color       = 'rgb(16,185,129)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(16,185,129,0.3)'
                el.style.background  = 'rgba(16,185,129,0.06)'
                el.style.color       = 'rgba(16,185,129,0.85)'
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
              className="flex items-center h-16 px-3.5 text-[0.75rem] font-semibold tracking-[0.08em] uppercase transition-colors duration-200"
              style={{ color: 'var(--steel)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--platinum)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--steel)' }}
            >
              Pazar
            </Link>

            <div style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 4px' }} />

            {/* Wallpaper */}
            <Link
              href="/wallpaper"
              className="flex items-center h-8 px-3.5 text-[0.7rem] font-bold tracking-[0.12em] uppercase transition-all duration-250"
              style={{
                border: '1px solid var(--border)',
                color: 'var(--iron)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border-crimson)'
                el.style.color       = 'var(--crimson-bright)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border)'
                el.style.color       = 'var(--iron)'
              }}
            >
              Wallpaper
            </Link>

            {/* İletişim */}
            <Link
              href="/iletisim"
              className="flex items-center h-8 px-3.5 ml-1.5 text-[0.7rem] font-bold tracking-[0.12em] uppercase transition-all duration-250 btn-ghost"
            >
              İletişim
            </Link>
          </nav>

          {/* ── Sağ ── */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block"><SearchBar /></div>
            <button
              type="button"
              onClick={openMenu}
              className="md:hidden flex items-center justify-center w-9 h-9 transition-all duration-200"
              style={{ border: '1px solid var(--border-md)', color: 'var(--steel)', background: 'transparent' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.borderColor = 'var(--border-crimson)'
                el.style.color       = 'var(--crimson-bright)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.borderColor = 'var(--border-md)'
                el.style.color       = 'var(--steel)'
              }}
              aria-label="Menüyü aç"
              aria-expanded={isOpen}
            >
              <Menu size={17} />
            </button>
          </div>
        </div>
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
      <IletisimModal  isOpen={iletisimOpen}  onClose={() => setIletisimOpen(false)} />
      <AsasModal      isOpen={asasModalOpen} onClose={() => setAsasModalOpen(false)} />
      <WallpaperModal isOpen={wallpaperOpen} onClose={() => setWallpaperOpen(false)} />

      <SidePanel
        isOpen={youtubeOpen}
        onClose={() => setYoutubeOpen(false)}
        title="YouTube"
        subtitle="@musaagll"
        accentColor="var(--crimson)"
        externalUrl="https://www.youtube.com/@musaagll/videos"
        externalLabel="YouTube Kanalına Git"
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--crimson-bright)">
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
