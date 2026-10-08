'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, Search } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { YouTubeIcon } from '@/components/ui/BrandIcons'
import { KO_CLASSES } from '@/lib/ko-data/classes'
import { CLASS_META } from '@/lib/class-meta'
import { SOCIAL } from '@/lib/site'
import { MobileDrawer } from './MobileDrawer'
import { MobileBottomNav } from './MobileBottomNav'

// Arama yalnızca açıldığında yüklenir (indeks ~25 KB) — ilk yüklemeye eklenmez
const SearchOverlay = dynamic(() => import('./SearchOverlay').then((m) => m.SearchOverlay), { ssr: false })

type MenuId = 'rehber' | null

const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState<MenuId>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  // Doküman: "Blur effect on scroll"
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    const raf = requestAnimationFrame(onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const openSearch = useCallback(() => {
    setDrawerOpen(false)
    setMenu(null)
    setSearchOpen(true)
  }, [])

  // Ctrl/⌘ + K veya "/" ile arama
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing = !!target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
      if ((e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        openSearch()
      }
      if (e.key === 'Escape') setMenu(null)
    }
    // Sayfa içi arama kutuları (ör. 404) aramayı bu olayla açar
    const onSearchEvent = () => openSearch()
    window.addEventListener('keydown', onKey)
    window.addEventListener('msgko:search', onSearchEvent)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('msgko:search', onSearchEvent)
    }
  }, [openSearch])

  // Açılır menü dışına tıklayınca kapat
  useEffect(() => {
    if (!menu) return
    const onDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setMenu(null)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [menu])

  const solid = scrolled || drawerOpen || menu !== null
  const closeMenu = () => setMenu(null)
  // Hover yalnızca fare için; dokunmatikte açma/kapama tıklamayla yapılır
  const hoverOpen = (id: Exclude<MenuId, null>) => (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') setMenu(id)
  }
  const hoverClose = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') setMenu(null)
  }

  const linkClass = (active: boolean) =>
    `relative inline-flex h-10 items-center gap-1 rounded-lg px-3 text-[0.9375rem] font-medium transition-colors ${
      active ? 'text-fg' : 'text-fg-3 hover:text-fg'
    }`
  const underline = (active: boolean) => (
    <span
      aria-hidden="true"
      className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-linear-to-r from-amethyst-300 to-amethyst-500 transition-transform duration-300 ${
        active ? 'scale-x-100' : 'scale-x-0'
      }`}
    />
  )

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-(--header-h) border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
          solid ? 'border-white/7 bg-ink-950/80 backdrop-blur-xl' : 'border-transparent bg-transparent'
        }`}
      >
        <div className="container-site flex h-full items-center justify-between gap-4">
          <Logo priority />

          {/* ── Masaüstü navigasyon ── */}
          <nav aria-label="Ana menü" className="hidden xl:block">
            <div ref={navRef} className="flex items-center gap-0.5">
              {/* Rehberler */}
              <div className="relative" onPointerEnter={hoverOpen('rehber')} onPointerLeave={hoverClose}>
                <button
                  type="button"
                  aria-expanded={menu === 'rehber'}
                  aria-controls="menu-rehber"
                  onClick={() => setMenu(menu === 'rehber' ? null : 'rehber')}
                  className={linkClass(isActive(pathname, '/rehber'))}
                >
                  Rehberler
                  <ChevronDown size={15} aria-hidden="true" className={`transition-transform duration-200 ${menu === 'rehber' ? 'rotate-180' : ''}`} />
                  {underline(isActive(pathname, '/rehber'))}
                </button>
                <div
                  id="menu-rehber"
                  hidden={menu !== 'rehber'}
                  className="absolute left-1/2 top-full w-136 -translate-x-1/2 pt-3"
                >
                  <div className="card overflow-hidden bg-ink-900/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl">
                    <ul className="grid grid-cols-2 gap-1">
                      {KO_CLASSES.map((cls) => (
                        <li key={cls.slug}>
                          <Link
                            href={`/rehber/${cls.guideSlug}`}
                            onClick={closeMenu}
                            className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/5"
                          >
                            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-ink-800">
                              <Image src={CLASS_META[cls.slug].weapon} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
                            </span>
                            <span className="min-w-0">
                              <span className="block font-semibold text-fg">{cls.name} Rehberi</span>
                              <span className="block truncate text-xs" style={{ color: cls.color }}>{CLASS_META[cls.slug].role}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href="/rehber"
                          onClick={closeMenu}
                          className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/10 p-3 text-sm font-semibold text-amethyst-300 transition-colors hover:border-amethyst-400/50 hover:text-amethyst-200"
                        >
                          Tüm sınıf rehberleri →
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {[
                { label: 'Videolar', href: '/youtube' },
                { label: 'Wallpaper', href: '/wallpaper' },
                { label: 'GB Fiyatları', href: '/gb-fiyatlari' },
                { label: 'Destek', href: '/destek' },
                { label: 'İletişim', href: '/iletisim' },
              ].map((l) => (
                <Link key={l.href} href={l.href} className={linkClass(isActive(pathname, l.href))}>
                  {l.label}
                  {underline(isActive(pathname, l.href))}
                </Link>
              ))}
            </div>
          </nav>

          {/* ── Sağ aksiyonlar ── */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={openSearch}
              aria-label="Sitede ara"
              className="btn btn-ghost h-10 min-h-10 w-10 px-0 xl:w-auto xl:px-3"
            >
              <Search size={18} aria-hidden="true" />
              <span className="hidden text-sm text-fg-3 xl:inline">Ara</span>
              <span className="kbd hidden xl:inline-flex">Ctrl K</span>
            </button>
            <a
              href={SOCIAL.youtubeSubscribe}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm hidden sm:inline-flex"
            >
              <YouTubeIcon size={18} />
              Abone Ol
            </a>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Menüyü aç"
              aria-expanded={drawerOpen}
              aria-controls="mobil-menu"
              className="btn btn-ghost h-10 min-h-10 w-10 px-0 xl:hidden"
            >
              <Menu size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSearch={openSearch} />
      <MobileBottomNav onMenu={() => setDrawerOpen(true)} menuOpen={drawerOpen} />
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  )
}
