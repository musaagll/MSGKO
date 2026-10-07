import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export interface Crumb {
  label: string
  href: string
}

/** Görsel breadcrumb. Yapılandırılmış veri (BreadcrumbList) sayfada ayrıca JSON-LD olarak basılır. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Sayfa konumu">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-fg-4">
        {items.map((crumb, i) => {
          const last = i === items.length - 1
          return (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={14} aria-hidden="true" className="text-fg-4/70" />}
              {last ? (
                <span aria-current="page" className="text-fg-2">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="link-underline hover:text-fg-2">
                  {crumb.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
