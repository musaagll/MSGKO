'use client'

import Link from 'next/link'
import Image from 'next/image'
import { SOCIAL_LINKS } from '@/lib/data'

function SocialIcon({ platform }: { platform: string }) {
  if (platform === 'youtube') return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
  if (platform === 'instagram') return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
  return null
}

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: '0.72rem', color: 'var(--iron)',
        textDecoration: 'none', transition: 'color 0.2s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--platinum)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--iron)' }}
    >
      <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--crimson)', opacity: 0.45, flexShrink: 0 }} />
      {label}
    </Link>
  )
}

const COL_REHBER = [
  { label: 'Asas Rehberi',    href: '/rehber/asas' },
  { label: 'Okçu Rehberi',    href: '/rehber/okcu' },
  { label: 'Warrior Rehberi', href: '/rehber/warrior' },
  { label: 'Mage Rehberi',    href: '/rehber/mage' },
  { label: 'Priest Rehberi',  href: '/rehber/priest' },
  { label: 'Tüm Rehberler',   href: '/rehber' },
]

const COL_OYUN = [
  { label: 'USKO Pazar',        href: '/pazar' },
  { label: 'GB Fiyatları',      href: '/gb-fiyatlari' },
  { label: 'Item Veritabanı',   href: '/item' },
  { label: 'Boss Rehberleri',   href: '/boss' },
  { label: 'Harita Rehberleri', href: '/harita' },
]

const COL_ICERIK = [
  { label: 'Videolar',   href: '/youtube' },
  { label: 'Wallpaper',  href: '/wallpaper' },
  { label: 'Destek',     href: '/destek' },
  { label: 'İletişim',   href: '/iletisim' },
]

export function Footer() {
  return (
    <footer style={{ position: 'relative', background: 'var(--abyss)', overflow: 'hidden' }} aria-label="Site footer">

      {/* Arka plan */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 55% 50% at 5% 100%, rgba(212,168,50,0.04) 0%, transparent 55%)',
      }} />
      <div className="grid-overlay" />

      {/* Üst altın çizgi */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--crimson), var(--crimson-bright), transparent)' }} />

      <div style={{ position: 'relative', maxWidth: 'var(--max-w)', margin: '0 auto', padding: 'clamp(3rem, 6vw, 5rem) var(--page-px) 0' }}>

        {/* ── Grid — 5 kolon ── */}
        <div style={{ display: 'grid', gap: '2.5rem 2rem' }}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1.2fr]">

          {/* ── Marka kolonu ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Image src="/logo.png" alt="MSGKO" width={44} height={44}
                style={{ mixBlendMode: 'screen', filter: 'brightness(1.3) drop-shadow(0 0 8px rgba(212,168,50,0.4))' }} />
              <div>
                <div style={{ fontSize: '0.83rem', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--platinum)', fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                  MSG<span style={{ color: 'var(--crimson-bright)' }}>KO</span>
                </div>
                <div style={{ fontSize: '0.42rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--iron)', marginTop: 2 }}>
                  Knight Online Platform
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.72rem', lineHeight: 1.85, color: 'var(--iron)', maxWidth: 230, marginBottom: 18 }}>
              Knight Online oyuncuları için rehber, pazar, item veritabanı ve içerik platformu. Bağımsız bir oyuncu platformudur.
            </p>

            {/* Sosyal */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 0 }}>
              {SOCIAL_LINKS.map(s => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank" rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--border-md)', color: 'var(--iron)', background: 'transparent',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = 'var(--border-crimson)'; el.style.color = 'var(--crimson-bright)'; el.style.background = 'var(--crimson-subtle)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = 'var(--border-md)'; el.style.color = 'var(--iron)'; el.style.background = 'transparent' }}
                >
                  <SocialIcon platform={s.platform} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Rehberler ── */}
          <div>
            <h3 style={{ fontSize: '0.57rem', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--crimson-bright)', marginBottom: 18, opacity: 0.8 }}>
              Rehberler
            </h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {COL_REHBER.map(l => <FooterLink key={l.href} {...l} />)}
            </nav>
          </div>

          {/* ── Oyun ── */}
          <div>
            <h3 style={{ fontSize: '0.57rem', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--crimson-bright)', marginBottom: 18, opacity: 0.8 }}>
              Oyun
            </h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {COL_OYUN.map(l => <FooterLink key={l.href} {...l} />)}
            </nav>
          </div>

          {/* ── İçerik ── */}
          <div>
            <h3 style={{ fontSize: '0.57rem', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--crimson-bright)', marginBottom: 18, opacity: 0.8 }}>
              İçerik
            </h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {COL_ICERIK.map(l => <FooterLink key={l.href} {...l} />)}
            </nav>
          </div>

          {/* ── İletişim ── */}
          <div>
            <h3 style={{ fontSize: '0.57rem', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--crimson-bright)', marginBottom: 18, opacity: 0.8 }}>
              Sosyal
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Instagram',  href: 'https://www.instagram.com/msgclip', accent: 'linear-gradient(180deg,#833ab4,#fd1d1d,#fcb045)' },
                { label: 'YouTube',    href: 'https://www.youtube.com/@musaagll', accent: 'linear-gradient(180deg,#ff0000,#cc0000)' },
                { label: 'E-posta',    href: 'mailto:imusaagll@gmail.com', accent: 'linear-gradient(180deg, var(--crimson), var(--crimson-bright))' },
              ].map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 12px',
                    border: '1px solid var(--border)',
                    textDecoration: 'none', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-crimson)'; el.style.background = 'var(--crimson-subtle)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.background = 'transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{ width: 2, height: 16, background: item.accent, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--steel)' }}>
                      {item.label}
                    </span>
                  </div>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--iron)" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Disclaimer + Alt bar ── */}
        <div style={{
          marginTop: '3rem',
          padding: '20px 0 24px',
          borderTop: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center',
        }}>
          {/* Disclaimer */}
          <p style={{
            fontSize: '0.58rem', letterSpacing: '0.06em', lineHeight: 1.7,
            color: 'var(--iron)', opacity: 0.5, textAlign: 'center', maxWidth: 560,
          }}>
            MSGKO, Knight Online'ın resmi bir sitesi değildir ve KnightOnline.com ile herhangi bir bağlantısı bulunmamaktadır.
            Knight Online, K2 Network ve Mgame'in tescilli markasıdır. Bu site, oyuncu topluluğu tarafından eğitim ve bilgi paylaşımı amacıyla yönetilmektedir.
          </p>

          {/* Alt bilgi */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '6px 16px' }}>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: 'var(--iron)' }}>
              © {new Date().getFullYear()} MSGKO
            </p>
            <span style={{ color: 'var(--border-md)', fontSize: '0.6rem' }}>·</span>
            <a href="https://msgko.net" style={{ fontSize: '0.6rem', color: 'var(--crimson-dim)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--crimson-bright)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--crimson-dim)' }}>
              msgko.net
            </a>
            <span style={{ color: 'var(--border-md)', fontSize: '0.6rem' }}>·</span>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: 'var(--iron)' }}>
              Knight Online Oyuncu Platformu
            </p>
          </div>

          {/* Dekor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.35 }}>
            <div style={{ width: 4, height: 4, background: 'var(--crimson)', transform: 'rotate(45deg)' }} />
            <div style={{ width: 20, height: 1, background: 'linear-gradient(90deg, transparent, var(--crimson))' }} />
            <div style={{ width: 4, height: 4, background: 'var(--crimson-bright)', transform: 'rotate(45deg)' }} />
            <div style={{ width: 20, height: 1, background: 'linear-gradient(90deg, var(--crimson), transparent)' }} />
            <div style={{ width: 4, height: 4, background: 'var(--crimson)', transform: 'rotate(45deg)' }} />
          </div>
        </div>
      </div>
    </footer>
  )
}
