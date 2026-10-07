'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { InstagramIcon, XIcon, YouTubeIcon } from '@/components/ui/BrandIcons'
import { useModal } from '@/hooks/useModal'
import { KO_CLASSES } from '@/lib/ko-data/classes'
import { CLASS_META } from '@/lib/class-meta'
import { MEDIA_LINKS, SECONDARY_LINKS, SOCIAL } from '@/lib/site'

interface Props {
  open: boolean
  onClose: () => void
  onSearch: () => void
}

/** Mobil kaydırmalı menü (doküman: slide panel + body lock) */
export function MobileDrawer({ open, onClose, onSearch }: Props) {
  const pathname = usePathname()
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  useModal(open, onClose) // ESC + kaydırma kilidi

  // Açılınca odağı panele al, kapanınca tetikleyiciye geri ver
  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement as HTMLElement | null
      closeRef.current?.focus()
    } else {
      returnFocus.current?.focus?.()
    }
  }, [open])

  const linkCls = (href: string) =>
    `flex min-h-12 items-center justify-between rounded-xl px-3 text-[0.9375rem] font-medium transition-colors ${
      pathname === href || pathname.startsWith(href + '/') ? 'bg-white/6 text-fg' : 'text-fg-2 hover:bg-white/4'
    }`

  return (
    <div className={`fixed inset-0 z-60 xl:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      {/* Karartma */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      <div
        id="mobil-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menü"
        inert={!open}
        className={`absolute inset-y-0 right-0 flex w-[min(24rem,calc(100vw-2.5rem))] flex-col border-l border-white/8 bg-ink-900 shadow-2xl shadow-black transition-transform duration-300 ease-soft ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex h-(--header-h) shrink-0 items-center justify-between border-b border-white/6 px-4">
          <Logo />
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Menüyü kapat" className="btn btn-ghost h-11 min-h-11 w-11 px-0">
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
          <button
            type="button"
            onClick={onSearch}
            className="mb-5 flex min-h-12 w-full items-center gap-3 rounded-xl border border-white/8 bg-white/3 px-4 text-left text-fg-3"
          >
            <Search size={18} aria-hidden="true" />
            Rehber, boss, harita ara…
          </button>

          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-fg-4">Sınıf Rehberleri</p>
          <ul className="mb-5 grid grid-cols-2 gap-1.5">
            {KO_CLASSES.map((cls) => (
              <li key={cls.slug}>
                <Link href={`/rehber/${cls.guideSlug}`} onClick={onClose} className={`${linkCls(`/rehber/${cls.guideSlug}`)} justify-start gap-2.5`}>
                  <Image src={CLASS_META[cls.slug].weapon} alt="" width={24} height={24} className="h-6 w-6 object-contain" />
                  {cls.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/rehber" onClick={onClose} className={`${linkCls('/rehber-tum')} text-amethyst-300`}>
                Tümü
              </Link>
            </li>
          </ul>

          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-fg-4">Medya & Araçlar</p>
          <ul className="mb-5 space-y-0.5">
            {MEDIA_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={onClose} className={linkCls(l.href)}>{l.label}</Link>
              </li>
            ))}
          </ul>

          <ul className="space-y-0.5 border-t border-white/6 pt-4">
            {SECONDARY_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={onClose} className={linkCls(l.href)}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="shrink-0 border-t border-white/6 p-4">
          <a href={SOCIAL.youtubeSubscribe} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
            <YouTubeIcon size={18} />
            YouTube&apos;da Abone Ol
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <div className="mt-3 flex justify-center gap-2">
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="btn btn-ghost h-11 min-h-11 w-11 px-0">
              <InstagramIcon size={20} />
            </a>
            <a href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="btn btn-ghost h-11 min-h-11 w-11 px-0">
              <YouTubeIcon size={20} />
            </a>
            <a href={SOCIAL.x} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="btn btn-ghost h-11 min-h-11 w-11 px-0">
              <XIcon size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
