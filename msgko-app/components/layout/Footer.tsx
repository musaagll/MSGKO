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

/* küçük link satırı */
function FooterLink({ label, href, gold }: { label: string; href: string; gold?: boolean }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 text-[0.74rem] transition-all duration-200"
      style={{ color: 'rgba(160,160,184,0.38)' }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.color = gold
          ? 'rgba(212,168,83,0.85)'
          : 'rgba(242,242,244,0.82)'
        ;(e.currentTarget as HTMLElement).style.paddingLeft = '6px'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.color = 'rgba(160,160,184,0.38)'
        ;(e.currentTarget as HTMLElement).style.paddingLeft = '0px'
      }}
    >
      {label}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden" aria-label="Site footer">

      {/* ── Arka plan ── */}
      <div className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 55% 70% at 5% 100%, rgba(212,168,83,0.04) 0%, transparent 50%),
            radial-gradient(ellipse 40% 55% at 95% 0%,  rgba(212,168,83,0.025) 0%, transparent 50%),
            linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-void) 100%)
          `
        }}
      />

      {/* ── Üst altın çizgi ── */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.45), rgba(212,168,83,0.3), transparent)' }}
      />

      <div className="relative max-w-[1280px] mx-auto"
        style={{ padding: 'clamp(3.5rem, 6vw, 5.5rem) clamp(1.25rem, 4vw, 2.5rem) 0' }}>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[2.2fr_1fr_1fr_1.4fr] gap-12 pb-14"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.045)' }}>

          {/* ── Col 1 — Marka ── */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/logo.png" alt="MSGKO" width={52} height={52}
                className="h-12 w-auto flex-shrink-0"
                style={{ mixBlendMode: 'screen', filter: 'brightness(1.3) contrast(1.05)' }}
              />
              <div className="flex flex-col leading-none">
                <span className="text-[0.82rem] font-black tracking-[0.18em] uppercase"
                  style={{ color: 'rgba(242,242,244,0.92)' }}>
                  MSG<span style={{ color: 'rgba(212,168,83,0.75)' }}>KO</span>
                </span>
                <span className="text-[0.44rem] tracking-[0.28em] uppercase mt-1"
                  style={{ color: 'rgba(160,160,184,0.28)' }}>
                  Knight Online
                </span>
              </div>
            </div>

            <p className="text-[0.76rem] leading-[1.85] mb-6 max-w-[210px]"
              style={{ color: 'rgba(160,160,184,0.38)' }}>
              Asas, okçu, warrior, mage ve priest sınıfları için kapsamlı rehberler,
              item veritabanı ve güncel oyun içerikleri.
            </p>

            {/* Sosyal ikonlar */}
            <div className="flex gap-2">
              {SOCIAL_LINKS.map(social => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank" rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 flex items-center justify-center transition-all duration-250"
                  style={{
                    border: '1px solid rgba(255,255,255,0.07)',
                    background: 'transparent',
                    color: 'rgba(160,160,184,0.38)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.borderColor = 'rgba(212,168,83,0.4)'
                    el.style.color       = 'rgba(212,168,83,0.85)'
                    el.style.background  = 'rgba(212,168,83,0.06)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.borderColor = 'rgba(255,255,255,0.07)'
                    el.style.color       = 'rgba(160,160,184,0.38)'
                    el.style.background  = 'transparent'
                  }}
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Col 2 — Rehberler ── */}
          <div>
            <h3 className="text-[0.62rem] font-bold tracking-[0.28em] uppercase mb-6"
              style={{ color: 'rgba(212,168,83,0.55)' }}>
              Rehberler
            </h3>
            <nav className="flex flex-col gap-3.5">
              {REHBER_LINKS.map(({ label, href }) => (
                <FooterLink key={href} label={label} href={href} />
              ))}
              <FooterLink label="Tüm Rehberler →" href="/rehber" gold />
            </nav>
          </div>

          {/* ── Col 3 — Oyun ── */}
          <div>
            <h3 className="text-[0.62rem] font-bold tracking-[0.28em] uppercase mb-6"
              style={{ color: 'rgba(212,168,83,0.55)' }}>
              Oyun
            </h3>
            <nav className="flex flex-col gap-3.5">
              {OYUN_LINKS.map(({ label, href }) => (
                <FooterLink key={href} label={label} href={href} />
              ))}
            </nav>
          </div>

          {/* ── Col 4 — İletişim ── */}
          <div>
            <h3 className="text-[0.62rem] font-bold tracking-[0.28em] uppercase mb-6"
              style={{ color: 'rgba(212,168,83,0.55)' }}>
              İletişim
            </h3>

            <p className="text-[0.74rem] leading-[1.85] mb-5"
              style={{ color: 'rgba(160,160,184,0.38)' }}>
              Sorularınız ve işbirlikleri için sosyal medya kanallarımızdan ulaşabilirsiniz.
            </p>

            <div className="flex flex-col gap-2">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/msgclip"
                target="_blank" rel="noopener noreferrer"
                aria-label="Instagram"
                className="group flex items-center justify-between px-4 py-3 transition-all duration-250"
                style={{
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'transparent',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'rgba(212,168,83,0.28)'
                  el.style.background  = 'rgba(212,168,83,0.04)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'rgba(255,255,255,0.06)'
                  el.style.background  = 'transparent'
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-px h-5 flex-shrink-0"
                    style={{ background: 'linear-gradient(180deg, #833ab4, #fd1d1d, #fcb045)' }} />
                  <span className="text-[0.7rem] font-bold tracking-[0.14em] uppercase"
                    style={{ color: 'rgba(242,242,244,0.72)' }}>
                    Instagram
                  </span>
                </div>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="opacity-25 group-hover:opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                  style={{ color: 'var(--gold-bright)' }} aria-hidden="true">
                  <path d="M7 17L17 7M17 7H7M17 7v10"/>
                </svg>
              </a>

              {/* Gmail */}
              <a
                href="mailto:imusaagll@gmail.com"
                aria-label="Gmail"
                className="group flex items-center justify-between px-4 py-3 transition-all duration-250"
                style={{
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'transparent',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'rgba(212,168,83,0.28)'
                  el.style.background  = 'rgba(212,168,83,0.04)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'rgba(255,255,255,0.06)'
                  el.style.background  = 'transparent'
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-px h-5 flex-shrink-0"
                    style={{ background: 'linear-gradient(180deg, rgba(212,168,83,0.9), rgba(184,144,58,0.6))' }} />
                  <span className="text-[0.7rem] font-bold tracking-[0.14em] uppercase"
                    style={{ color: 'rgba(242,242,244,0.72)' }}>
                    E-posta
                  </span>
                </div>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="opacity-25 group-hover:opacity-60 transition-opacity duration-200"
                  style={{ color: 'var(--gold-bright)' }} aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ── Alt bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5">
          <p className="text-[0.66rem] tracking-[0.1em]" style={{ color: 'rgba(160,160,184,0.2)' }}>
            © {new Date().getFullYear()} MSG Knight Online
            <span className="mx-2" style={{ color: 'rgba(255,255,255,0.08)' }}>·</span>
            <a href="https://msgko.net" className="transition-colors duration-200"
              style={{ color: 'rgba(212,168,83,0.28)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(212,168,83,0.65)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(212,168,83,0.28)' }}>
              msgko.net
            </a>
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(212,168,83,0.35)' }} />
            <span className="text-[0.6rem] tracking-[0.18em] uppercase" style={{ color: 'rgba(160,160,184,0.18)' }}>
              Knight Online Rehber Platformu
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
