'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, ChevronDown, Swords, ShoppingBag, Map, Zap, BookOpen } from 'lucide-react'
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

/* ─── Nav Yapısı ──────────────────────────────────────────────────────────── */

const REHBER_ITEMS = [
  { label: 'Asas Rehberi',    href: '/rehber/asas',          icon: '/assassin-icon.png', desc: 'STR/DEX build, combo, PK taktikleri' },
  { label: 'Okçu Rehberi',    href: '/rehber/okcu',          icon: '/archer-icon.png',    desc: 'DEX build, uzun menzil taktikleri' },
  { label: 'Warrior Rehberi', href: '/rehber/warrior',       icon: null,                  desc: 'Tank ve DPS build rehberleri' },
  { label: 'Mage Rehberi',    href: '/rehber/mage',          icon: '/staffwoe.png',       desc: 'INT build, AOE taktikleri' },
  { label: 'Priest Rehberi',  href: '/rehber/priest',        icon: '/dreadshield.png',    desc: 'Heal, buff ve Battle Priest' },
  { label: 'Battle Priest',   href: '/rehber/battle-priest', icon: null,                  desc: 'Hibrit STR/INT agresif build' },
]

const OYUN_ITEMS = [
  { label: 'USKO Pazar',      href: '/pazar',       icon: ShoppingBag, desc: 'Canlı market ilanları',    badge: 'Canlı' },
  { label: 'GB Fiyatları',    href: '/gb-fiyatlari', icon: Zap,         desc: '9 site GB karşılaştırma',  badge: null },
  { label: 'Boss Rehberleri', href: '/boss',         icon: Swords,      desc: 'Spawn, drop ve taktikler', badge: null },
  { label: 'Harita Rehberi',  href: '/harita',       icon: Map,         desc: 'Farm bölgeleri ve rotalar', badge: null },
  { label: 'Videolar',        href: '/youtube',      icon: BookOpen,    desc: 'Eğitim ve PK videoları',   badge: null },
]

/* ─── Rehber Dropdown ─────────────────────────────────────────────────────── */
function RehberDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-1.5 h-16 px-3 text-[0.72rem] font-semibold tracking-[0.08em] uppercase transition-colors duration-200"
        style={{ color: open ? 'var(--platinum)' : 'var(--steel)' }}
      >
        Rehber
        <ChevronDown size={10} style={{ transition: 'transform 0.22s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: 4, scaleY: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', top: '100%', left: '50%',
              transform: 'translateX(-50%)',
              width: 500,
              background: 'var(--abyss)',
              border: '1px solid var(--border-md)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.85)',
              transformOrigin: 'top center',
              zIndex: 100,
            }}
            role="menu"
          >
            <div style={{ height: 2, background: 'linear-gradient(90deg, var(--crimson), var(--crimson-bright), transparent)' }} />

            <div style={{ padding: '8px 6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              {REHBER_ITEMS.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 px-4 py-3 transition-all duration-150"
                  style={{ background: 'transparent', textDecoration: 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,168,50,0.05)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <div style={{
                    width: 30, height: 30, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(212,168,50,0.07)',
                    border: '1px solid rgba(212,168,50,0.14)',
                  }}>
                    {item.icon
                      ? <img src={item.icon} alt="" style={{ width: 16, height: 16, objectFit: 'contain', mixBlendMode: 'screen' }} />
                      : <Swords size={12} style={{ color: 'var(--crimson-bright)', opacity: 0.7 }} />
                    }
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--platinum)', letterSpacing: '0.03em' }}>
                      {item.label}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--iron)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.desc}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', padding: '8px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <Link href="/rehber" onClick={() => setOpen(false)}
                style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--crimson-bright)', textDecoration: 'none' }}>
                Tüm Rehberler →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Oyun Mega Dropdown ──────────────────────────────────────────────────── */
function OyunDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-1.5 h-16 px-3 text-[0.72rem] font-semibold tracking-[0.08em] uppercase transition-colors duration-200"
        style={{ color: open ? 'var(--platinum)' : 'var(--steel)' }}
      >
        Oyun
        <ChevronDown size={10} style={{ transition: 'transform 0.22s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: 4, scaleY: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', top: '100%', left: '50%',
              transform: 'translateX(-50%)',
              width: 480,
              background: 'var(--abyss)',
              border: '1px solid var(--border-md)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.85)',
              transformOrigin: 'top center',
              zIndex: 100,
            }}
            role="menu"
          >
            <div style={{ height: 2, background: 'linear-gradient(90deg, rgba(16,185,129,0.8), rgba(16,185,129,0.3), transparent)' }} />

            <div style={{ padding: '8px 6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              {OYUN_ITEMS.map(item => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-3 px-4 py-3 transition-all duration-150"
                    style={{ background: 'transparent', textDecoration: 'none' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.04)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                  >
                    <div style={{
                      width: 30, height: 30, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(16,185,129,0.07)',
                      border: '1px solid rgba(16,185,129,0.14)',
                    }}>
                      <Icon size={13} style={{ color: 'rgba(16,185,129,0.8)' }} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--platinum)', letterSpacing: '0.03em' }}>
                          {item.label}
                        </span>
                        {item.badge && (
                          <span style={{
                            fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.1em',
                            padding: '1px 5px',
                            background: 'rgba(16,185,129,0.12)',
                            border: '1px solid rgba(16,185,129,0.25)',
                            color: 'rgba(16,185,129,0.9)',
                          }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--iron)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.desc}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.6rem', color: 'var(--iron)', letterSpacing: '0.08em' }}>
                Knight Online Araçları
              </span>
              <Link href="/pazar" onClick={() => setOpen(false)}
                style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(16,185,129,0.8)', textDecoration: 'none' }}>
                Pazara Git →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Nav Link ────────────────────────────────────────────────────────────── */
function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className="relative flex items-center h-16 px-3 text-[0.72rem] font-semibold tracking-[0.08em] uppercase transition-colors duration-200"
      style={{ color: isActive ? 'var(--platinum)' : 'var(--steel)', textDecoration: 'none' }}
      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--platinum)' }}
      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--steel)' }}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          style={{
            position: 'absolute', bottom: 0, left: 4, right: 4, height: 2,
            background: 'linear-gradient(90deg, var(--crimson), var(--crimson-bright))',
          }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  )
}

/* ─── Navbar ──────────────────────────────────────────────────────────────── */
export function Navbar() {
  const pathname   = usePathname()
  const isScrolled = useScrollDetect(20)
  const { isOpen, openMenu, closeMenu } = useMobileMenu()

  const [instagramOpen, setInstagramOpen] = useState(false)
  const [iletisimOpen,  setIletisimOpen]  = useState(false)
  const [youtubeOpen,   setYoutubeOpen]   = useState(false)
  const [asasModalOpen, setAsasModalOpen] = useState(false)
  const [wallpaperOpen, setWallpaperOpen] = useState(false)

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

  /* Aktif ana bölüm tespiti */
  const isHome    = pathname === '/'
  const isRehber  = pathname.startsWith('/rehber')
  const isOyun    = ['/pazar', '/gb-fiyatlari', '/boss', '/harita', '/youtube'].some(p => pathname.startsWith(p))

  return (
    <>
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}
      >
        {/* Üst gold çizgi — scroll'da görünür */}
        <div style={{
          height: 2,
          background: isScrolled
            ? 'linear-gradient(90deg, transparent, var(--crimson), var(--crimson-bright), transparent)'
            : 'transparent',
          transition: 'all 0.4s ease',
        }} />

        {/* Ana bar */}
        <div
          className={isScrolled ? 'glass' : ''}
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 'clamp(0.75rem, 2.5vw, 1.5rem)',
            paddingRight: 'clamp(0.75rem, 2.5vw, 1.5rem)',
            background: isScrolled ? undefined : 'rgba(6,8,15,0.75)',
            borderBottom: isScrolled ? '1px solid var(--border)' : 'none',
            backdropFilter: isScrolled ? undefined : 'blur(12px)',
            transition: 'all 0.4s ease',
          }}
        >
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group" aria-label="MSGKO Ana Sayfa">
            <div style={{ position: 'relative', width: 38, height: 38 }}>
              <div style={{
                position: 'absolute', inset: -4,
                background: 'radial-gradient(circle, rgba(212,168,50,0.4) 0%, transparent 70%)',
                filter: 'blur(8px)', opacity: 0,
                transition: 'opacity 0.4s',
              }} className="group-hover:opacity-100" />
              <Image
                src="/logo.png" alt="MSGKO" width={38} height={38}
                className="relative object-contain"
                style={{
                  mixBlendMode: 'screen',
                  filter: 'brightness(1.5) contrast(1.1) drop-shadow(0 0 10px rgba(212,168,50,0.5))',
                }}
                priority
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{
                fontSize: '0.83rem', fontWeight: 900, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: 'var(--platinum)',
                fontFamily: 'var(--font-rajdhani), sans-serif',
              }}>
                MSG<span style={{ color: 'var(--crimson-bright)' }}>KO</span>
              </span>
              <span style={{ fontSize: '0.4rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--iron)', marginTop: 2 }}>
                Knight Online
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center" aria-label="Ana navigasyon">
            {/* Ana Sayfa */}
            <NavLink href="/" label="Ana Sayfa" isActive={isHome} />

            <div style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 2px' }} />

            {/* Rehber dropdown */}
            <div style={{ position: 'relative' }}>
              <RehberDropdown />
              {isRehber && (
                <motion.div
                  layoutId="nav-indicator"
                  style={{ position: 'absolute', bottom: 0, left: 4, right: 4, height: 2, background: 'linear-gradient(90deg, var(--crimson), var(--crimson-bright))' }}
                />
              )}
            </div>

            {/* Oyun dropdown */}
            <div style={{ position: 'relative' }}>
              <OyunDropdown />
              {isOyun && (
                <motion.div
                  layoutId="nav-indicator"
                  style={{ position: 'absolute', bottom: 0, left: 4, right: 4, height: 2, background: 'linear-gradient(90deg, rgba(16,185,129,0.8), rgba(16,185,129,0.4))' }}
                />
              )}
            </div>

            <div style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 2px' }} />

            {/* Pazar — öne çıkar */}
            <Link
              href="/pazar"
              className="flex items-center h-8 gap-1.5 px-3 text-[0.68rem] font-bold tracking-[0.1em] uppercase transition-all"
              style={{ border: '1px solid rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.05)', color: 'rgba(16,185,129,0.8)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(16,185,129,0.55)'; el.style.background = 'rgba(16,185,129,0.1)'; el.style.color = 'rgb(16,185,129)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(16,185,129,0.25)'; el.style.background = 'rgba(16,185,129,0.05)'; el.style.color = 'rgba(16,185,129,0.8)' }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 5px rgba(16,185,129,0.8)', animation: 'dotPulse 2s infinite', display: 'inline-block' }} />
              Pazar
            </Link>

            {/* GB Fiyatları */}
            <Link
              href="/gb-fiyatlari"
              className="flex items-center h-8 gap-1.5 px-3 ml-1 text-[0.68rem] font-bold tracking-[0.1em] uppercase transition-all"
              style={{ border: '1px solid var(--border-crimson)', background: 'var(--crimson-subtle)', color: 'var(--crimson-bright)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(212,168,50,0.14)'; el.style.borderColor = 'var(--border-crimson-bright)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--crimson-subtle)'; el.style.borderColor = 'var(--border-crimson)' }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              GB
            </Link>

            <div style={{ width: 1, height: 16, background: 'var(--border)', margin: '0 2px' }} />

            {/* Wallpaper */}
            <Link href="/wallpaper" className="flex items-center h-16 px-2.5 text-[0.68rem] font-semibold tracking-[0.07em] uppercase transition-colors"
              style={{ color: 'var(--iron)', textDecoration: 'none' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--steel)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--iron)' }}>
              Wallpaper
            </Link>

            {/* İletişim */}
            <Link href="/iletisim" className="flex items-center h-7 px-2.5 text-[0.65rem] font-bold tracking-[0.1em] uppercase btn-ghost"
              style={{ textDecoration: 'none' }}>
              İletişim
            </Link>
          </nav>

          {/* ── Sağ ── */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:block"><SearchBar /></div>
            <button
              type="button"
              onClick={openMenu}
              className="lg:hidden flex items-center justify-center w-9 h-9 transition-all"
              style={{ border: '1px solid var(--border-md)', color: 'var(--steel)', background: 'transparent' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'var(--border-crimson)'; el.style.color = 'var(--crimson-bright)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'var(--border-md)'; el.style.color = 'var(--steel)' }}
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
