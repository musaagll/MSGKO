import { ArrowUpRight, Mail } from 'lucide-react'
import { InstagramIcon, YouTubeIcon } from '@/components/ui/BrandIcons'
import { CONTACT_EMAIL, SOCIAL } from '@/lib/site'

const CHANNELS = [
  { href: SOCIAL.instagramDm, label: 'Instagram', value: '@msgclip', Icon: InstagramIcon, accent: '#e1306c' },
  {
    href: `mailto:${CONTACT_EMAIL}`,
    label: 'E-Posta',
    value: CONTACT_EMAIL,
    Icon: ({ size }: { size?: number }) => <Mail size={size} aria-hidden="true" />,
    accent: '#9b84ff',
  },
  { href: SOCIAL.youtube, label: 'YouTube', value: '@musaagll', Icon: YouTubeIcon, accent: '#ff3d3d' },
]

/** İletişim kanalları (server component) */
export function IletisimPage() {
  return (
    <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
      {CHANNELS.map(({ href, label, value, Icon, accent }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="group card card-interactive flex h-full items-center gap-4 p-5 sm:flex-col sm:px-5 sm:py-8 sm:text-center"
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
              style={{ color: accent, background: `${accent}1a`, border: `1px solid ${accent}40` }}
            >
              <Icon size={22} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-fg-4">{label}</span>
              <span className="mt-1 block break-all font-semibold text-fg">{value}</span>
            </span>
            <ArrowUpRight size={16} aria-hidden="true" className="shrink-0 text-fg-4 transition-colors group-hover:text-fg" />
          </a>
        </li>
      ))}
    </ul>
  )
}
