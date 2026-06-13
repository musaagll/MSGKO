'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Image, Video, BookOpen, Settings,
  LogOut, Menu, X, ExternalLink, Shield
} from 'lucide-react'

const NAV = [
  { href: '/',           icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/wallpapers', icon: Image,            label: 'Wallpaper' },
  { href: '/videos',     icon: Video,            label: 'Videolar' },
  { href: '/rehberler',  icon: BookOpen,          label: 'Rehberler' },
  { href: '/ayarlar',    icon: Settings,          label: 'Ayarlar' },
]

const S = {
  sidebar: {
    width: 220,
    background: '#111118',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    height: '100%',
  },
  logoArea: {
    padding: '20px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 32, height: 32,
    background: 'rgba(124,58,237,0.2)',
    border: '1px solid rgba(124,58,237,0.35)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  nav: { flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column' as const, gap: 2 },
  navItem: (active: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    color: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.45)',
    background: active ? 'rgba(124,58,237,0.15)' : 'transparent',
    borderLeft: active ? '2px solid rgba(124,58,237,0.7)' : '2px solid transparent',
    transition: 'all 0.15s',
    textDecoration: 'none',
  }),
  footerNav: {
    padding: '12px 10px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
  },
  footerItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 12px', fontSize: 13,
    color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
    transition: 'color 0.15s', background: 'none', border: 'none', width: '100%', textAlign: 'left' as const,
  },
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <div style={S.sidebar}>
      <div style={S.logoArea}>
        <div style={S.logoIcon}><Shield size={14} color="#a78bfa" /></div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: '#fff', textTransform: 'uppercase' }}>MSGKO</div>
          <div style={{ fontSize: 10, color: 'rgba(124,58,237,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Admin</div>
        </div>
      </div>

      <nav style={S.nav}>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} onClick={onClose}
              style={S.navItem(active)}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)' } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)' } }}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div style={S.footerNav}>
        <a href="https://msgko.net" target="_blank" rel="noopener noreferrer" style={S.footerItem}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
          <ExternalLink size={14} /><span>Siteyi Görüntüle</span>
        </a>
        <button type="button" onClick={handleLogout} style={{ ...S.footerItem, color: 'rgba(239,68,68,0.6)', cursor: 'pointer' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.9)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.6)')}>
          <LogOut size={14} /><span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#09090f' }}>
      {/* Desktop sidebar */}
      <div style={{ width: 220, flexShrink: 0, display: 'none' }} className="md-sidebar">
        <SidebarContent />
      </div>

      {/* Always visible sidebar for larger screens — inline media query workaround */}
      <style>{`
        @media (min-width: 768px) {
          .md-sidebar { display: block !important; }
          .mobile-topbar { display: none !important; }
        }
        @media (max-width: 767px) {
          .md-sidebar { display: none !important; }
        }
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div style={{ width: 220, height: '100%' }}>
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </div>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.65)' }} onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Mobile topbar */}
        <div className="mobile-topbar" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <button type="button" onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', padding: 0 }}>
            <Menu size={20} color="rgba(255,255,255,0.6)" />
          </button>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: '#fff', textTransform: 'uppercase' }}>MSGKO Admin</span>
          <div style={{ width: 20 }} />
        </div>

        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
