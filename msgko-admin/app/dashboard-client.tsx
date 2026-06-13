'use client'

import { useEffect, useState } from 'react'
import { Image, Video, Activity, ExternalLink, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface Stats { wallpaperCount: number; videoCount: number; lastUpdated: string }

const QUICK_LINKS = [
  { href: '/wallpapers', label: 'Wallpaper Ekle', icon: Image, color: 'rgba(139,92,246,0.8)' },
  { href: '/videos',     label: 'Video Ekle',     icon: Video, color: 'rgba(239,68,68,0.8)' },
  { href: '/ayarlar',    label: 'Ayarlar',         icon: Activity, color: 'rgba(34,197,94,0.8)' },
]

export default function DashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-wide">Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
          MSGKO yönetim paneline hoş geldin
        </p>
      </div>

      {/* Stat kartları */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Wallpaper', value: stats?.wallpaperCount ?? '—', icon: Image, color: '#a78bfa', href: '/wallpapers' },
          { label: 'Video', value: stats?.videoCount ?? '—', icon: Video, color: '#f87171', href: '/videos' },
        ].map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href}
            className="p-5 transition-all duration-200 group"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>
            <div className="flex items-start justify-between mb-3">
              <Icon size={18} style={{ color }} />
              <TrendingUp size={12} style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
          </Link>
        ))}
      </div>

      {/* Site durumu */}
      <div className="p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Site Durumu</h2>
          <a href="https://msgko.net" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: 'rgba(167,139,250,0.7)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(167,139,250,1)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(167,139,250,0.7)')}>
            <ExternalLink size={11} />
            msgko.net
          </a>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.8)' }} />
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Site canlı — Vercel üzerinde çalışıyor</span>
        </div>
        {stats?.lastUpdated && (
          <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Son kontrol: {new Date(stats.lastUpdated).toLocaleTimeString('tr-TR')}
          </p>
        )}
      </div>

      {/* Hızlı erişim */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Hızlı Erişim</h2>
        <div className="grid grid-cols-1 gap-2">
          {QUICK_LINKS.map(({ href, label, icon: Icon, color }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 p-4 text-sm transition-all duration-150"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.9)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}>
              <Icon size={15} style={{ color }} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
