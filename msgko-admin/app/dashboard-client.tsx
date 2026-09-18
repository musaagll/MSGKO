'use client'

import { useEffect, useState } from 'react'
import { Image, Video, MousePointer, Download, Users, Eye, TrendingUp, Calendar, ExternalLink, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface WallpaperStat { id: number; label: string; click_count: number; download_count: number }
interface Stats {
  wallpaperCount: number; videoCount: number
  views: { total: number; today: number; week: number; month: number }
  wallpaperStats: { totalClicks: number; totalDownloads: number; topWallpapers: WallpaperStat[] }
  lastUpdated: string
}

/* ── Shared styles ── */
const CARD: React.CSSProperties = {
  padding: '18px 20px',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
}

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 9, fontWeight: 700, letterSpacing: '0.24em',
  textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)',
  marginBottom: 12, display: 'block',
}

/* ── StatCard ── */
function StatCard({ label, value, icon: Icon, color, badge }: {
  label: string; value: string | number; icon: React.ElementType; color: string; badge?: string
}) {
  return (
    <div style={{ ...CARD, position: 'relative', overflow: 'hidden' }}>
      {/* Faint icon watermark */}
      <div style={{
        position: 'absolute', right: 12, bottom: 10,
        opacity: 0.05, color,
      }}>
        <Icon size={36} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <Icon size={14} color={color} style={{ opacity: 0.8 }} />
        {badge && (
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(160,160,184,0.35)' }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', lineHeight: 1, marginBottom: 5 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'rgba(160,160,184,0.45)' }}>{label}</div>
    </div>
  )
}

export default function DashboardClient() {
  const [stats,   setStats]   = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)

  return (
    <div style={{ padding: '24px', maxWidth: 920 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 3 }}>
            Dashboard
          </h1>
          <p style={{ fontSize: 11, color: 'rgba(160,160,184,0.38)' }}>MSGKO yönetim paneli</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {stats?.lastUpdated && (
            <span style={{ fontSize: 10, color: 'rgba(160,160,184,0.22)' }}>
              {new Date(stats.lastUpdated).toLocaleTimeString('tr-TR')}
            </span>
          )}
          <button
            onClick={load}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 12px', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
              background: 'none', border: '1px solid var(--border-md)',
              color: 'rgba(160,160,184,0.45)', cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.3)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(201,168,76,0.7)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-md)'
              ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(160,160,184,0.45)'
            }}
          >
            <RefreshCw size={10} />
            Yenile
          </button>
          <a
            href="https://msgko.net"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 12px', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
              border: '1px solid rgba(201,168,76,0.22)',
              background: 'rgba(201,168,76,0.05)',
              color: 'rgba(201,168,76,0.6)',
              textDecoration: 'none', transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,168,76,0.5)'
              ;(e.currentTarget as HTMLAnchorElement).style.color = 'rgba(201,168,76,1)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,168,76,0.22)'
              ;(e.currentTarget as HTMLAnchorElement).style.color = 'rgba(201,168,76,0.6)'
            }}
          >
            <ExternalLink size={10} />
            msgko.net
          </a>
        </div>
      </div>

      {/* ── Gold divider ── */}
      <div className="gold-line" style={{ marginBottom: 24 }} />

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ ...CARD, opacity: 0.4, animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : (
        <>
          {/* ── Ziyaret istatistikleri ── */}
          <div style={{ marginBottom: 24 }}>
            <span style={SECTION_LABEL}>Site Ziyaretleri</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              <StatCard label="Toplam Ziyaret"  value={fmt(stats?.views.total  ?? 0)} icon={Users}      color="rgba(201,168,76,0.8)"  />
              <StatCard label="Bugün"           value={fmt(stats?.views.today  ?? 0)} icon={Eye}        color="rgba(52,211,153,0.7)"  badge="bugün" />
              <StatCard label="Bu Hafta"        value={fmt(stats?.views.week   ?? 0)} icon={TrendingUp} color="rgba(96,165,250,0.7)"  badge="7 gün" />
              <StatCard label="Bu Ay"           value={fmt(stats?.views.month  ?? 0)} icon={Calendar}   color="rgba(167,139,250,0.7)" badge="ay" />
            </div>
          </div>

          {/* ── Wallpaper istatistikleri ── */}
          <div style={{ marginBottom: 24 }}>
            <span style={SECTION_LABEL}>Wallpaper & İçerik</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 12 }}>
              <StatCard label="Toplam Wallpaper"   value={stats?.wallpaperCount ?? 0}                      icon={Image}        color="rgba(201,168,76,0.8)"  />
              <StatCard label="Görüntüleme"        value={fmt(stats?.wallpaperStats.totalClicks ?? 0)}     icon={MousePointer} color="rgba(251,191,36,0.7)"  />
              <StatCard label="İndirme"            value={fmt(stats?.wallpaperStats.totalDownloads ?? 0)}  icon={Download}     color="rgba(52,211,153,0.7)"  />
              <StatCard label="Video"              value={stats?.videoCount ?? 0}                          icon={Video}        color="rgba(239,68,68,0.6)"   />
            </div>

            {/* Top wallpapers */}
            {(stats?.wallpaperStats.topWallpapers?.length ?? 0) > 0 && (
              <div style={CARD}>
                <p style={{ ...SECTION_LABEL, marginBottom: 14 }}>En Çok İndirilen</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {stats!.wallpaperStats.topWallpapers.map((wp, i) => (
                    <div key={wp.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 10, color: 'rgba(160,160,184,0.22)', width: 14, textAlign: 'right', flexShrink: 0 }}>
                        {i + 1}
                      </span>
                      <div style={{ flex: 1, fontSize: 12, color: 'rgba(242,242,244,0.65)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {wp.label}
                      </div>
                      <div style={{ display: 'flex', gap: 14, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, color: 'rgba(251,191,36,0.6)', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <MousePointer size={9} /> {wp.click_count ?? 0}
                        </span>
                        <span style={{ fontSize: 11, color: 'rgba(52,211,153,0.6)', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Download size={9} /> {wp.download_count ?? 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Hızlı erişim ── */}
          <div>
            <span style={SECTION_LABEL}>Hızlı Erişim</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { href: '/wallpapers', label: 'Wallpaper Yönet', color: 'rgba(201,168,76,0.6)' },
                { href: '/videos',     label: 'Video Yönet',     color: 'rgba(239,68,68,0.55)' },
                { href: '/ayarlar',    label: 'Ayarlar',         color: 'rgba(52,211,153,0.55)' },
              ].map(({ href, label, color }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    ...CARD,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontSize: 12, color: 'rgba(160,160,184,0.5)',
                    textDecoration: 'none', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,255,255,0.035)'
                    el.style.borderColor = 'var(--border-md)'
                    el.style.color = 'rgba(242,242,244,0.8)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'var(--surface)'
                    el.style.borderColor = 'var(--border)'
                    el.style.color = 'rgba(160,160,184,0.5)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 2, height: 14, background: color, borderRadius: 1 }} />
                    {label}
                  </div>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.3 }}>
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
