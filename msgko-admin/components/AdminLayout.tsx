'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Image, Video, BookOpen,
  Settings, LogOut, Menu, X, ExternalLink,
  Search, ChevronRight,
} from 'lucide-react'

const NAV = [
  { href: '/',           icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/wallpapers', icon: Image,            label: 'Wallpaper' },
  { href: '/videos',     icon: Video,            label: 'Videolar' },
  { href: '/rehberler',  icon: BookOpen,          label: 'Rehberler' },
  { href: '/seo',        icon: Search,            label: 'SEO' },
  { href: '/ayarlar',    icon: Settings,          label: 'Ayarlar' },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router   = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <div style={{
      width: 220,
      height: '100%',
      background: 'var(--void)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* ── Logo ── */}
      <div style={{
        padding: '18px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        {/* Gold square accent */}
        <div style={{
          width: 28, height: 28, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(201,168,76,0.08)',
          border: '1px solid rgba(201,168,76,0.22)',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.16em', color: 'var(--text)', textTransform: 'uppercase' }}>
            MSGKO
          </div>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginTop: 1 }}>
            Admin
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '9px 12px',
                fontSize: 12.5,
                fontWeight: active ? 600 : 400,
                color: active ? 'rgba(242,242,244,0.95)' : 'rgba(160,160,184,0.45)',
                background: active ? 'rgba(201,168,76,0.07)' : 'transparent',
                borderLeft: `2px solid ${active ? 'rgba(201,168,76,0.6)' : 'transparent'}`,
                transition: 'all 0.15s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'rgba(255,255,255,0.035)'
                  el.style.color = 'rgba(242,242,244,0.75)'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'transparent'
                  el.style.color = 'rgba(160,160,184,0.45)'
                }
              }}
            >
              <Icon size={15} style={{ flexShrink: 0, opacity: active ? 1 : 0.6 }} />
              <span style={{ flex: 1 }}>{label}</span>
              {active && <ChevronRight size={11} style={{ opacity: 0.35 }} />}
            </Link>
          )
        })}
      </nav>

      {/* ── Gold divider ── */}
      <div className="gold-line" style={{ margin: '0 8px' }} />

      {/* ── Footer nav ── */}
      <div style={{ padding: '10px 8px' }}>
        <a
          href="https://msgko.net"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '8px 12px', fontSize: 12, color: 'rgba(160,160,184,0.38)',
            transition: 'color 0.15s', textDecoration: 'none',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(201,168,76,0.65)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(160,160,184,0.38)' }}
        >
          <ExternalLink size={13} />
          <span>Siteyi Görüntüle</span>
        </a>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 9, width: '100%',
            padding: '8px 12px', fontSize: 12, background: 'none', border: 'none',
            color: 'rgba(239,68,68,0.45)', transition: 'color 0.15s', textAlign: 'left',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.85)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.45)' }}
        >
          <LogOut size={13} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      background: 'var(--bg)',
    }}>
      {/* ── Desktop sidebar ── */}
      <style>{`
        @media (min-width: 768px) {
          .admin-sidebar-desktop { display: flex !important; }
          .admin-topbar           { display: none !important; }
        }
        @media (max-width: 767px) {
          .admin-sidebar-desktop { display: none !important; }
        }
      `}</style>

      <div className="admin-sidebar-desktop" style={{ display: 'none', flexShrink: 0 }}>
        <SidebarContent />
      </div>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <SidebarContent onClose={() => setSidebarOpen(false)} />
          <div
            style={{ flex: 1, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Mobile topbar */}
        <div
          className="admin-topbar"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'var(--void)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen(v => !v)}
            style={{
              background: 'none', border: '1px solid var(--border)',
              padding: '6px 8px', color: 'rgba(242,242,244,0.6)',
              display: 'flex', alignItems: 'center',
            }}
            aria-label="Menüyü aç"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text)' }}>
            MSG<span style={{ color: 'rgba(201,168,76,0.7)' }}>KO</span>
          </span>
          <div style={{ width: 34 }} />
        </div>

        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
