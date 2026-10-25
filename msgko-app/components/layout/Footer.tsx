import Link from 'next/link'
import { Mail } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { InstagramIcon, XIcon, YouTubeIcon } from '@/components/ui/BrandIcons'
import { KO_CLASSES } from '@/lib/ko-data/classes'
import { CONTACT_EMAIL, MEDIA_LINKS, SOCIAL } from '@/lib/site'

const PAGE_LINKS = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Rehberler', href: '/rehber' },
  ...MEDIA_LINKS.map(({ label, href }) => ({ label, href })),
  { label: 'Destek', href: '/destek' },
  { label: 'İletişim', href: '/iletisim' },
]

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <nav aria-label={title}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fg-3">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="link-underline text-[0.9375rem] text-fg-3 hover:text-fg">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** 3 kolon: marka (açıklama, sosyal, e-posta) · sayfalar · rehberler */
export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="pb-tabbar relative mt-10 border-t border-white/7 bg-ink-950">
      <div className="container-site grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr] lg:gap-16">
        <div className="max-w-sm sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-fg-3">
            Knight Online için Türkçe rehber ve eğitim platformu: sınıf rehberleri, eğitim videoları ve duvar kağıtları.
          </p>
          <div className="mt-6 flex gap-2">
            {[
              { href: SOCIAL.youtube, label: 'YouTube', Icon: YouTubeIcon },
              { href: SOCIAL.instagram, label: 'Instagram', Icon: InstagramIcon },
              { href: SOCIAL.x, label: 'X (Twitter)', Icon: XIcon },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/8 text-fg-3 transition-colors hover:border-amethyst-400/40 hover:text-fg"
              >
                <Icon size={19} />
              </a>
            ))}
          </div>
          <a href={`mailto:${CONTACT_EMAIL}`} className="mt-5 inline-flex items-center gap-2 break-all text-[0.9375rem] text-fg-3 hover:text-fg">
            <Mail size={16} aria-hidden="true" />
            {CONTACT_EMAIL}
          </a>
        </div>

        <FooterColumn title="Sayfalar" links={PAGE_LINKS} />
        <FooterColumn
          title="Rehberler"
          links={KO_CLASSES.map((c) => ({ label: `${c.name} Rehberi`, href: `/rehber/${c.guideSlug}` }))}
        />
      </div>

      <div className="hairline" />
      <div className="container-site flex flex-col gap-2 py-6 text-sm text-fg-4 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} MSGKO. Tüm hakları saklıdır.</p>
        <p className="max-w-xl sm:text-right">
          MSGKO bağımsız bir topluluk sitesidir. Knight Online ve ilgili markalar sahiplerine aittir.
        </p>
      </div>
    </footer>
  )
}
