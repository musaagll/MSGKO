import Link from 'next/link'
import { ArrowUpRight, Mail, MessageCircle } from 'lucide-react'
import { InstagramIcon, YouTubeIcon } from '@/components/ui/BrandIcons'
import { CONTACT_EMAIL, SOCIAL } from '@/lib/site'

const CHANNELS = [
  {
    href: SOCIAL.instagramDm,
    label: 'Instagram',
    value: '@msgclip',
    note: 'En hızlı yanıt — DM gönder',
    Icon: InstagramIcon,
    accent: '#e1306c',
  },
  {
    href: `mailto:${CONTACT_EMAIL}`,
    label: 'E-Posta',
    value: CONTACT_EMAIL,
    note: 'İş birlikleri ve detaylı talepler',
    Icon: ({ size }: { size?: number }) => <Mail size={size} aria-hidden="true" />,
    accent: '#ab91f7',
  },
  {
    href: SOCIAL.youtube,
    label: 'YouTube',
    value: '@musaagll',
    note: 'Video altına yorum bırak',
    Icon: YouTubeIcon,
    accent: '#ff3d3d',
  },
]

/** İletişim kanalları (server component) */
export function IletisimPage() {
  return (
    <div className="mx-auto grid grid-cols-1 max-w-4xl gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amethyst-400/25 bg-amethyst-500/10 text-amethyst-200">
          <MessageCircle size={22} aria-hidden="true" />
        </span>
        <h2 className="display-md mt-5">Sosyal medya veya e-posta ile ulaşabilirsin.</h2>
        <p className="mt-4 leading-relaxed text-fg-3">
          Rehberlerle ilgili soru, içerik önerisi ya da iş birliği teklifleri için yazabilirsin. Bir rehberde hata ya da
          güncel olmayan bir bilgi fark ettiysen haber vermen çok yardımcı olur.
        </p>
        <p className="mt-6 text-sm text-fg-4">
          İçerikleri desteklemek istersen <Link href="/destek" className="font-semibold text-amethyst-300 hover:text-amethyst-200">destek sayfasına</Link> göz atabilirsin.
        </p>
      </div>

      <ul className="space-y-3">
        {CHANNELS.map(({ href, label, value, note, Icon, accent }) => (
          <li key={label}>
            <a
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group card card-interactive flex items-center gap-4 p-5"
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ color: accent, background: `${accent}1a`, border: `1px solid ${accent}40` }}
              >
                <Icon size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-fg-4">{label}</span>
                <span className="block truncate font-semibold text-fg">{value}</span>
                <span className="block text-sm text-fg-3">{note}</span>
              </span>
              <ArrowUpRight size={18} aria-hidden="true" className="shrink-0 text-fg-4 transition-colors group-hover:text-fg" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
