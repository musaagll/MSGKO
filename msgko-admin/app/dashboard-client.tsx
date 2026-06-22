'use client'

import { useEffect, useState } from 'react'
import { Image, Video, Activity, ExternalLink, Users, Eye, Download, MousePointer, TrendingUp, Calendar } from 'lucide-react'
import Link from 'next/link'

interface WallpaperStat { id: number; label: string; click_count: number; download_count: number }

interface Stats {
  wallpaperCount: number
  videoCount: number
  views: {
    total: number
    today: number
    week: number
    month: number
  }
  wallpaperStats: {
    totalClicks: number
    totalDownloads: number
    topWallpapers: WallpaperStat[]
  }
  lastUpdated: string
}

const card: React.CSSProperties = {
  padding: 20,
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 2,
}

function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: string | number; icon: React.ElementType; color: string; sub?: string
}) {
  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Icon size={16} color={color} />
        {sub && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>{sub}</span>}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{label}</div>
    </div>
  )
}

export default function DashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetch('/api/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>

      {/* Başlık */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>MSGKO yönetim paneli</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {stats?.lastUpdated && (
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
              {new Date(stats.lastUpdated).toLocaleTimeString('tr-TR')}
            </span>
          )}
          <button
            onClick={load}
            style={{ fontSize: 12, color: 'rgba(167,139,250,0.7)', background: 'none', border: '1px solid rgba(139,92,246,0.2)', padding: '6px 12px', cursor: 'pointer' }}
          >
            Yenile
          </button>
          <a href="https://msgko.net" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, color: 'rgba(167,139,250,0.7)', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', border: '1px solid rgba(139,92,246,0.2)', padding: '6px 12px' }}>
            <ExternalLink size={11} /> msgko.net
          </a>
        </div>
      </div>

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, padding: '40px 0', textAlign: 'center' }}>
          Yükleniyor...
        </div>
      ) : (
        <>
          {/* ── Ziyaretçi İstatistikleri ── */}
          <div style={{ marginBottom: 10 }}>
            <h2 style={{ fontSize: 12, fontWeight: 600, color: 'rgba(139,92,246,0.8)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
              Site Ziyaretleri
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
              <StatCard label="Toplam Ziyaret"  value={fmt(stats?.views.total ?? 0)}  icon={Users}      color="#a78bfa" />
              <StatCard label="Bugün"           value={fmt(stats?.views.today ?? 0)}  icon={Eye}        color="#34d399" sub="bugün" />
              <StatCard label="Bu Hafta"        value={fmt(stats?.views.week ?? 0)}   icon={TrendingUp} color="#60a5fa" sub="7 gün" />
              <StatCard label="Bu Ay"           value={fmt(stats?.views.month ?? 0)}  icon={Calendar}   color="#f472b6" sub="ay" />
            </div>
          </div>

          {/* ── Wallpaper İstatistikleri ── */}
          <div style={{ marginBottom: 10 }}>
            <h2 style={{ fontSize: 12, fontWeight: 600, color: 'rgba(139,92,246,0.8)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
              Wallpaper
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
              <StatCard label="Toplam Wallpaper"   value={stats?.wallpaperCount ?? 0}              icon={Image}        color="#a78bfa" />
              <StatCard label="Toplam Görüntüleme" value={fmt(stats?.wallpaperStats.totalClicks ?? 0)}    icon={MousePointer} color="#fbbf24" />
              <StatCard label="Toplam İndirme"     value={fmt(stats?.wallpaperStats.totalDownloads ?? 0)} icon={Download}     color="#34d399" />
              <StatCard label="Video"              value={stats?.videoCount ?? 0}                  icon={Video}        color="#f87171" />
            </div>

            {/* En çok indirilen wallpaperlar */}
            {(stats?.wallpaperStats.topWallpapers?.length ?? 0) > 0 && (
              <div style={{ ...card, marginBottom: 24 }}>
                <h3 style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
                  En Çok İndirilen Wallpaperlar
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {stats!.wallpaperStats.topWallpapers.map((wp, i) => (
                    <div key={wp.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', width: 16, textAlign: 'right' }}>{i + 1}</span>
                      <div style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{wp.label}</div>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <span style={{ fontSize: 12, color: 'rgba(251,191,36,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MousePointer size={10} /> {wp.click_count ?? 0}
                        </span>
                        <span style={{ fontSize: 12, color: 'rgba(52,211,153,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Download size={10} /> {wp.download_count ?? 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Hızlı Erişim ── */}
          <div>
            <h2 style={{ fontSize: 12, fontWeight: 600, color: 'rgba(139,92,246,0.8)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
              Hızlı Erişim
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { href: '/wallpapers', label: 'Wallpaper Yönet', color: '#a78bfa' },
                { href: '/videos',     label: 'Video Yönet',     color: '#f87171' },
                { href: '/ayarlar',    label: 'Ayarlar',          color: '#4ade80' },
              ].map(({ href, label, color }) => (
                <Link key={href} href={href}
                  style={{ ...card, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' } as React.CSSProperties}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}
                >
                  <Activity size={14} color={color} />{label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
