import Image from 'next/image'
import Link from 'next/link'

/**
 * MSGKO logosu — logo.png'den kırpılmış amblem + Barlow Condensed kelime işareti.
 * Amblem dosyası: public/brand/emblem.png (282×256)
 */
export function Logo({ size = 'md', className = '', priority = false }: { size?: 'md' | 'lg'; className?: string; priority?: boolean }) {
  const emblem = size === 'lg' ? 52 : 38
  return (
    <Link
      href="/"
      aria-label="MSGKO ana sayfa"
      className={`group inline-flex items-center gap-2.5 rounded-lg ${className}`}
    >
      <Image
        src="/brand/emblem.png"
        alt=""
        width={Math.round(emblem * 1.1)}
        height={emblem}
        priority={priority}
        className="h-auto shrink-0 drop-shadow-[0_2px_10px_rgba(141,108,234,0.35)] transition-transform duration-500 group-hover:scale-105"
        style={{ width: Math.round(emblem * 1.1) }}
      />
      <span className="flex flex-col whitespace-nowrap leading-none">
        <span
          className={`text-silver font-display font-bold tracking-[0.08em] ${size === 'lg' ? 'text-[2rem]' : 'text-[1.55rem]'}`}
        >
          MSGKO
        </span>
        <span lang="en" className="mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.28em] text-fg-4">
          Knight Online
        </span>
      </span>
    </Link>
  )
}
