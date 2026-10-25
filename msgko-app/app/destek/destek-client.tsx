import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { SUPPORT_PLATFORMS } from '@/lib/site'

/** Destek platformu bağlantıları — platform logolarıyla (server component, istemci JS'i yok) */
export function DestekClient() {
  return (
    <ul className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
      {SUPPORT_PLATFORMS.map((p) => (
        <li key={p.id}>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${p.name} üzerinden destek ol`}
            className="group card card-interactive flex h-full flex-col items-center gap-6 px-6 pb-6 pt-9"
          >
            <span className="flex h-12 w-full items-center justify-center">
              <Image
                src={p.logo.src}
                alt={p.name}
                width={p.logo.width}
                height={p.logo.height}
                unoptimized={p.logo.src.endsWith('.svg')}
                sizes="180px"
                className="h-auto max-h-12 w-auto max-w-[11rem] object-contain"
              />
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-fg-3 transition-colors group-hover:text-fg">
              Destek ol
              <ArrowUpRight size={15} aria-hidden="true" />
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
