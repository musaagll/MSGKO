import { ArrowUpRight } from 'lucide-react'
import { SUPPORT_PLATFORMS } from '@/lib/site'

/** Destek platformu bağlantıları (server component — istemci JS'i yok) */
export function DestekClient() {
  return (
    <ul className="mx-auto grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
      {SUPPORT_PLATFORMS.map((p) => (
        <li key={p.id}>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group card card-interactive flex items-center justify-between gap-3 px-5 py-4 font-semibold text-fg"
          >
            {p.name}
            <ArrowUpRight size={17} aria-hidden="true" className="shrink-0 text-fg-4 transition-colors group-hover:text-amethyst-300" />
          </a>
        </li>
      ))}
    </ul>
  )
}
