/**
 * EntityCard — Boss, Item, Harita gibi entity'ler için özet kart.
 * Listing sayfalarında ve related content bölümlerinde kullanılır.
 */
import Link from 'next/link'

interface Props {
  href: string
  title: string
  subtitle?: string
  excerpt?: string
  badge?: string
  badgeColor?: 'red' | 'blue' | 'amber' | 'green' | 'purple' | 'pink'
  stats?: { label: string; value: string | number }[]
  tags?: string[]
  className?: string
}

const BADGE_STYLES = {
  red:    { border: 'rgba(239,68,68,0.3)',   text: 'rgba(239,68,68,0.8)' },
  blue:   { border: 'rgba(59,130,246,0.3)',  text: 'rgba(59,130,246,0.8)' },
  amber:  { border: 'rgba(245,158,11,0.3)',  text: 'rgba(245,158,11,0.8)' },
  green:  { border: 'rgba(16,185,129,0.3)',  text: 'rgba(16,185,129,0.8)' },
  purple: { border: 'rgba(139,92,246,0.3)',  text: 'rgba(139,92,246,0.8)' },
  pink:   { border: 'rgba(236,72,153,0.3)',  text: 'rgba(236,72,153,0.8)' },
}

export function EntityCard({
  href,
  title,
  subtitle,
  excerpt,
  badge,
  badgeColor = 'purple',
  stats,
  tags,
  className = '',
}: Props) {
  const badgeStyle = BADGE_STYLES[badgeColor]

  return (
    <Link
      href={href}
      className={`group p-5 border border-white/[0.07] hover:border-white/20
        transition-all duration-300 block ${className}`}
      style={{ background: 'rgba(255,255,255,0.015)' }}
    >
      {badge && (
        <span
          className="inline-block text-[0.6rem] font-bold tracking-[0.15em] uppercase px-2 py-0.5 border mb-3"
          style={{ borderColor: badgeStyle.border, color: badgeStyle.text }}
        >
          {badge}
        </span>
      )}

      <h3
        className="text-[0.95rem] font-black tracking-[0.04em] uppercase text-white mb-1"
        style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}
      >
        {title}
      </h3>

      {subtitle && (
        <p className="text-[0.68rem] tracking-[0.08em] uppercase text-white/30 mb-2">
          {subtitle}
        </p>
      )}

      {excerpt && (
        <p className="text-[0.76rem] leading-[1.75] text-white/40 line-clamp-2 mb-3">
          {excerpt}
        </p>
      )}

      {stats && stats.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {stats.map((stat) => (
            <div key={stat.label}>
              <span className="text-[0.6rem] tracking-[0.12em] uppercase text-white/25">
                {stat.label}:{' '}
              </span>
              <span className="text-[0.72rem] font-semibold text-white/60">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[0.6rem] px-2 py-0.5 uppercase tracking-[0.06em]"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div
        className="mt-3 flex items-center gap-1.5 text-[0.7rem] font-semibold tracking-[0.08em]
          uppercase text-white/25 group-hover:text-white/60 transition-colors duration-200"
      >
        <span>Detay</span>
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}
