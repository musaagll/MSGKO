'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Image, Video, BookOpen, Settings,
  LogOut, Menu, X, ExternalLink, ChevronRight, Shield
} from 'lucide-react'

const NAV = [
  { href: '/',           icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/wallpapers', icon: Image,            label: 'Wallpaper' },
  { href: '/videos',     icon: Video,            label: 'Videolar' },
  { href: '/rehberler',  icon: BookOpen,          label: 'Rehberler' },
  { href: '/ayarlar',    icon: Settings,          label: 'Ayarlar' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const Sidebar = () => (
    <aside className="flex flex-col h-full"
      style={{ background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)' }}>
          <Shield size={14} style={{ color: '#a78bfa' }} />
        </div>
        <div>
          <p className="text-sm font-bold tracking-widest uppercase text-white">MSGKO</p>
          <p className="text-[0.6rem] tracking-[0.15em] uppercase" style={{ color: 'rgba(124,58,237,0.7)' }}>Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link key={href} href={href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150"
              style={{
                background: active ? 'rgba(124,58,237,0.15)' : 'transparent',
                borderLeft: active ? '2px solid rgba(124,58,237,0.7)' : '2px solid transparent',
                color: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' } }}
            >
              <Icon size={16} />
              <span>{label}</span>
              {active && <ChevronRight size={12} className="ml-auto opacity-50" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
        <a href="https://msgko.net" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-150"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
          <ExternalLink size={15} />
          <span>Siteyi Görüntüle</span>
        </a>
        <button type="button" onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-150"
          style={{ color: 'rgba(239,68,68,0.6)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(239,68,68,0.9)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(239,68,68,0.6)')}>
          <LogOut size={15} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#09090f' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-56 flex-shrink-0 h-full flex-col">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="w-56 h-full flex flex-col"><Sidebar /></div>
          <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <button type="button" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} style={{ color: 'rgba(255,255,255,0.6)' }} />
          </button>
          <span className="text-sm font-bold tracking-widest uppercase text-white">MSGKO Admin</span>
          <div className="w-5" />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
