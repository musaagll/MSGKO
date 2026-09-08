/**
 * Breadcrumb — site genelinde kullanılan gezinti izi bileşeni.
 * BreadcrumbList schema sayfa seviyesinde Script ile ekleniyor.
 */
import Link from 'next/link'
import type { BreadcrumbItem } from '@/lib/types'

interface Props {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = '' }: Props) {
  return (
    <nav aria-label="Sayfa konumu" className={className}>
      <ol
        className="flex flex-wrap items-center gap-1.5 text-[0.72rem] text-white/30"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li
              key={item.href}
              className="flex items-center gap-1.5"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {i > 0 && (
                <span aria-hidden="true" className="text-white/15 select-none">
                  /
                </span>
              )}
              {isLast ? (
                <span
                  className="text-white/60"
                  itemProp="name"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-white/60 transition-colors duration-200"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(i + 1)} />
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
