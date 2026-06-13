'use client'

import { useEffect, useState } from 'react'
import { Image, Video, Activity, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface Stats { wallpaperCount: number; videoCount: number; lastUpdated: string }

export default function DashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  const card = {
    padding: 20,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    textDecoration: 'none',
    display: 'block',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>MSGKO yönetim paneline hoş geldin</p>
      </div>

      {/* Stat kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Wallpaper', value: stats?.wallpaperCount ?? '—', icon: Image, color: '#a78bfa', href: '/wallpapers' },
          { label: 'Video',     value: stats?.videoCount ?? '—',     icon: Video, color: '#f87171', href: '/videos' },
        ].map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} style={card}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)')}>
            <Icon size={18} color={color} style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{label}</div>
          </Link>
        ))}
      </div>

      {/* Site durumu */}
      <div style={{ ...card, marginBottom: 24 } as React.CSSProperties}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Site Durumu</span>
          <a href="https://msgko.net" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, color: 'rgba(167,139,250,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ExternalLink size={11} /> msgko.net
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.8)' }} />
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Site canlı — Vercel üzerinde çalışıyor</span>
        </div>
      </div>

      {/* Hızlı erişim */}
      <div>
        <h2 style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 12 }}>Hızlı Erişim</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { href: '/wallpapers', label: 'Wallpaper Ekle', color: '#a78bfa' },
            { href: '/videos',     label: 'Video Ekle',     color: '#f87171' },
            { href: '/ayarlar',    label: 'Ayarlar',         color: '#4ade80' },
          ].map(({ href, label, color }) => (
            <Link key={href} href={href}
              style={{ ...card, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.6)' } as React.CSSProperties}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}>
              <Activity size={14} color={color} />{label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
