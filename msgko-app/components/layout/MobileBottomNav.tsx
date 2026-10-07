'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Coins, Home, Menu, PlaySquare } from 'lucide-react'

const ITEMS = [
  { label: 'Ana Sayfa', href: '/', Icon: Home },
  { label: 'Rehberler', href: '/rehber', Icon: BookOpen },
  { label: 'GB Fiyat', href: '/gb-fiyatlari', Icon: Coins },
  { label: 'Videolar', href: '/youtube', Icon: PlaySquare },
] as const

/** Mobil alt navigasyon — başparmak bölgesinde en sık kullanılan 4 hedef + menü */
export function MobileBottomNav({ onMenu, menuOpen }: { onMenu: () => void; menuOpen: boolean }) {
  const pathname = usePathname()
  const active = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/'))

  return (
    <nav
      aria-label="Mobil navigasyon"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/7 bg-ink-950/90 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto grid h-(--tabbar-h) max-w-lg grid-cols-5">
        {ITEMS.map(({ label, href, Icon }) => {
          const on = active(href)
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={on ? 'page' : undefined}
                className={`relative flex h-full flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium transition-colors ${
                  on ? 'text-fg' : 'text-fg-4 active:text-fg-2'
                }`}
              >
                {on && <span aria-hidden="true" className="absolute top-0 h-0.5 w-8 rounded-full bg-amethyst-400" />}
                <Icon size={21} aria-hidden="true" strokeWidth={on ? 2.2 : 1.8} />
                {label}
              </Link>
            </li>
          )
        })}
        <li>
          <button
            type="button"
            onClick={onMenu}
            aria-expanded={menuOpen}
            aria-controls="mobil-menu"
            className={`flex h-full w-full flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium transition-colors ${
              menuOpen ? 'text-fg' : 'text-fg-4 active:text-fg-2'
            }`}
          >
            <Menu size={21} aria-hidden="true" />
            Menü
          </button>
        </li>
      </ul>
    </nav>
  )
}
