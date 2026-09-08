/**
 * RelatedContent — İlgili içerik kartları.
 * Her içerik sayfasının altında entity ilişkilerine göre otomatik öneriler.
 */
import Link from 'next/link'
import type { RelatedContentItem } from '@/lib/types'

interface Props {
  title?: string
  items: RelatedContentItem[]
  className?: string
}

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  guide:  { bg: 'rgba(59,130,246,0.1)',  text: 'rgba(147,197,253,0.9)' },
  boss:   { bg: 'rgba(239,68,68,0.1)',   text: 'rgba(252,165,165,0.9)' },
  item:   { bg: 'rgba(245,158,11,0.1)',  text: 'rgba(252,211,77,0.9)' },
  map:    { bg: 'rgba(16,185,129,0.1)',  text: 'rgba(110,231,183,0.9)' },
  quest:  { bg: 'rgba(139,92,246,0.1)',  text: 'rgba(196,181,253,0.9)' },
  build:  { bg: 'rgba(139,92,246,0.1)',  text: 'rgba(196,181,253,0.9)' },
  farm:   { bg: 'rgba(34,197,94,0.1)',   text: 'rgba(134,239,172,0.9)' },
  news:   { bg: 'rgba(236,72,153,0.1)',  text: 'rgba(249,168,212,0.9)' },
  skill:  { bg: 'rgba(59,130,246,0.1)',  text: 'rgba(147,197,253,0.9)' },
  error:  { bg: 'rgba(239,68,68,0.1)',   text: 'rgba(252,165,165,0.9)' },
  mob:    { bg: 'rgba(107,114,128,0.1)', text: 'rgba(209,213,219,0.7)' },
}

const TYPE_LABELS: Record<string, string> = {
  guide: 'Rehber', boss: 'Boss', item: 'Item', map: 'Harita',
  quest: 'Quest', build: 'Build', farm: 'Farm', news: 'Haber',
  skill: 'Skill', error: 'Sorun', mob: 'Mob',
}

export function RelatedContent({ title = 'İlgili İçerikler', items, className = '' }: Props) {
  if (!items.length) return null

  return (
    <section className={className} aria-labelledby="related-baslik">
      <h2
        id="related-baslik"
        className="text-lg font-black tracking-[0.06em] uppercase text-white mb-4 pb-3 border-b border-white/[0.06]"
        style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}
      >
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => {
          const colors = BADGE_COLORS[item.type] ?? BADGE_COLORS.guide
          return (
            <Link
              key={`${item.type}-${item.slug}`}
              href={item.href}
              className="group flex items-start gap-3 p-4 border border-white/[0.06]
                hover:border-white/15 transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.015)' }}
            >
              {/* Type badge */}
              <span
                className="mt-0.5 text-[0.58rem] font-bold tracking-[0.1em] uppercase px-1.5 py-0.5 flex-shrink-0"
                style={{ background: colors.bg, color: colors.text }}
              >
                {TYPE_LABELS[item.type] ?? item.type}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-[0.8rem] font-semibold text-white/75 group-hover:text-white/90
                  transition-colors duration-200 line-clamp-1">
                  {item.title}
                </p>
                {item.excerpt && (
                  <p className="text-[0.72rem] text-white/35 mt-0.5 line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                )}
              </div>

              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="flex-shrink-0 mt-1 text-white/20 group-hover:text-white/50 transition-colors duration-200"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
