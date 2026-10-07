import Link from 'next/link'
import { ArrowUpRight, Mail } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { InstagramIcon, XIcon, YouTubeIcon } from '@/components/ui/BrandIcons'
import { KO_CLASSES } from '@/lib/ko-data/classes'
import { CONTACT_EMAIL, DATABASE_LINKS, MEDIA_LINKS, SOCIAL } from '@/lib/site'

const QUICK_LINKS = [
  { label: 'Ana Sayfa', href: '/' },
  ...MEDIA_LINKS.map(({ label, href }) => ({ label, href })),
  { label: 'Destek Ol', href: '/destek' },
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

/** Doküman: 4 kolon — logo/açıklama/sosyal · hızlı erişim · kategoriler · iletişim */
export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="pb-tabbar relative mt-10 border-t border-white/7 bg-linear-to-b from-ink-900/60 to-ink-950">
      <div className="container-site grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-12">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-fg-3">
            Knight Online için Türkçe rehber ve eğitim platformu: sınıf rehberleri, boss ve harita veritabanı,
            eğitim videoları.
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
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-fg-3 transition-colors hover:border-amethyst-400/40 hover:text-fg"
              >
                <Icon size={19} />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title="Hızlı Erişim" links={QUICK_LINKS} />

        <FooterColumn
          title="Rehberler"
          links={[
            ...KO_CLASSES.map((c) => ({ label: `${c.name} Rehberi`, href: `/rehber/${c.guideSlug}` })),
            ...DATABASE_LINKS.map(({ label, href }) => ({ label, href })),
          ]}
        />

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fg-3">İletişim</p>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-fg-3">
            Soru, öneri ve iş birlikleri için Instagram&apos;dan yazabilir ya da e-posta gönderebilirsin.
          </p>
          <ul className="mt-5 space-y-2.5">
            <li>
              <a href={SOCIAL.instagramDm} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-fg-2 hover:text-fg">
                <InstagramIcon size={17} />
                @msgclip
                <ArrowUpRight size={14} aria-hidden="true" className="text-fg-4" />
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 break-all text-[0.9375rem] font-medium text-fg-2 hover:text-fg">
                <Mail size={17} aria-hidden="true" />
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
          <Link href="/iletisim" className="btn btn-secondary btn-sm mt-6">İletişim sayfası</Link>
        </div>
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
