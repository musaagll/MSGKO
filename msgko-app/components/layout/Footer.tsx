'use client'

import Link from 'next/link'
import Image from 'next/image'
import { SOCIAL_LINKS } from '@/lib/data'

function SocialIcon({ platform }: { platform: string }) {
  if (platform === 'youtube') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
  if (platform === 'instagram') return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
  return null
}

const REHBER_LINKS = [
  { label: 'Asas Rehberi',    href: '/rehber/asas' },
  { label: 'Okçu Rehberi',    href: '/rehber/okcu' },
  { label: 'Warrior Rehberi', href: '/rehber/warrior' },
  { label: 'Mage Rehberi',    href: '/rehber/mage' },
  { label: 'Priest Rehberi',  href: '/rehber/priest' },
]

const OYUN_LINKS = [
  { label: 'GB Fiyatları',      href: '/gb-fiyatlari' },
  { label: 'USKO Pazar',        href: '/pazar' },
  { label: 'Boss Rehberleri',   href: '/boss' },
  { label: 'Harita Rehberleri', href: '/harita' },
  { label: 'Item Veritabanı',   href: '/item' },
]

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: '0.73rem', color: 'var(--iron)',
        textDecoration: 'none', transition: 'color 0.2s, padding-left 0.2s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.color = 'var(--platinum)'
        el.style.paddingLeft = '6px'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.color = 'var(--iron)'
        el.style.paddingLeft = '0px'
      }}
    >
      <span style={{
        width: 3, height: 3, flexShrink: 0, borderRadius: '50%',
        background: 'var(--crimson)', opacity: 0.5,
      }} />
      {label}
    </Link>
  )
}

export function Footer() {
  return (
    <footer style={{ position: 'relative', background: 'var(--abyss)', overflow: 'hidden' }} aria-label="Site footer">

      {/* Arka plan efektleri */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 0% 100%, rgba(212,168,50,0.05) 0%, transparent 55%)',
      }} />
      <div className="grid-overlay" />

      {/* Üst çizgi */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--crimson), var(--ember), transparent)' }} />

      <div style={{ position: 'relative', maxWidth: 'var(--max-w)', margin: '0 auto', padding: 'clamp(3rem, 6vw, 5rem) var(--page-px) 0' }}>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '2.5rem 3rem' }}
          className="sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr]">

          {/* Marka */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <Image src="/logo.png" alt="MSGKO" width={48} height={48}
                style={{ mixBlendMode: 'screen', filter: 'brightness(1.3) drop-shadow(0 0 8px rgba(212,168,50,0.4))' }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--platinum)', fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                  MSG<span style={{ color: 'var(--crimson-bright)' }}>KO</span>
                </div>
                <div style={{ fontSize: '0.44rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--iron)', marginTop: 2 }}>
                  Knight Online Rehber Platformu
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.73rem', lineHeight: 1.85, color: 'var(--iron)', maxWidth: 220, marginBottom: 20 }}>
              Knight Online asas, okçu, warrior, mage ve priest sınıfları için kapsamlı rehberler,
              item veritabanı ve güncel içerikler.
            </p>

            {/* Sosyal */}
            <div style={{ display: 'flex', gap: 8 }}>
              {SOCIAL_LINKS.map(social => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank" rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{
                    width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--border-md)',
                    color: 'var(--iron)', background: 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.borderColor = 'var(--border-crimson)'
                    el.style.color       = 'var(--crimson-bright)'
                    el.style.background  = 'var(--crimson-subtle)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.borderColor = 'var(--border-md)'
                    el.style.color       = 'var(--iron)'
                    el.style.background  = 'transparent'
                  }}
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </div>
          </div>

          {/* Rehberler */}
          <div>
            <h3 style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--crimson-bright)', marginBottom: 20, opacity: 0.8 }}>
              Rehberler
            </h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {REHBER_LINKS.map(l => <FooterLink key={l.href} {...l} />)}
              <Link href="/rehber" style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--crimson-bright)', opacity: 0.7, textDecoration: 'none', marginTop: 4 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0.7' }}>
                Tüm Rehberler →
              </Link>
            </nav>
          </div>

          {/* Oyun */}
          <div>
            <h3 style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--crimson-bright)', marginBottom: 20, opacity: 0.8 }}>
              Oyun
            </h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {OYUN_LINKS.map(l => <FooterLink key={l.href} {...l} />)}
            </nav>
          </div>

          {/* İletişim */}
          <div>
            <h3 style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--crimson-bright)', marginBottom: 20, opacity: 0.8 }}>
              İletişim
            </h3>
            <p style={{ fontSize: '0.73rem', lineHeight: 1.8, color: 'var(--iron)', marginBottom: 16 }}>
              Sorular ve iş birlikleri için sosyal medyadan ulaşabilirsiniz.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Instagram', href: 'https://www.instagram.com/msgclip', accent: 'linear-gradient(180deg,#833ab4,#fd1d1d,#fcb045)' },
                { label: 'E-posta', href: 'mailto:imusaagll@gmail.com', accent: 'linear-gradient(180deg, var(--crimson), var(--ember))' },
              ].map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px',
                    border: '1px solid var(--border)',
                    textDecoration: 'none', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'var(--border-crimson)'
                    el.style.background  = 'var(--crimson-subtle)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'var(--border)'
                    el.style.background  = 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 2, height: 18, background: item.accent, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--steel)' }}>
                      {item.label}
                    </span>
                  </div>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--iron)" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Alt bar */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          padding: '20px 0 24px',
          borderTop: '1px solid var(--border)',
          marginTop: '3rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.1em', color: 'var(--iron)' }}>
              © {new Date().getFullYear()} MSG Knight Online
            </p>
            <span style={{ color: 'var(--border-md)' }}>·</span>
            <a href="https://msgko.net" style={{ fontSize: '0.62rem', color: 'var(--crimson-dim)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--crimson-bright)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--crimson-dim)' }}>
              msgko.net
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 4, height: 4, background: 'var(--crimson)', transform: 'rotate(45deg)', opacity: 0.5 }} />
            <span style={{ fontSize: '0.52rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--iron)', opacity: 0.5 }}>
              Knight Online Rehber Platformu
            </span>
            <div style={{ width: 4, height: 4, background: 'var(--crimson)', transform: 'rotate(45deg)', opacity: 0.5 }} />
          </div>
        </div>
      </div>
    </footer>
  )
}
