import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/** Detay sayfası iskeleti: içerik + yapışkan yan panel (mobilde altta) */
export function ArticleLayout({ children, aside }: { children: React.ReactNode; aside: React.ReactNode }) {
  return (
    <div className="container-site grid grid-cols-1 gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
      <div className="min-w-0 space-y-14">{children}</div>
      <aside className="min-w-0">
        <div className="space-y-5 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">{aside}</div>
      </aside>
    </div>
  )
}

/** İçerik bölümü — H2 metinleri SEO için sayfalar arasında sabit tutulur */
export function ContentSection({ id, title, children }: { id: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="scroll-mt-28">
      <h2 id={id} className="mb-5 flex items-center gap-3 text-xl font-bold tracking-tight text-fg sm:text-2xl">
        <span aria-hidden="true" className="h-5 w-1 shrink-0 rounded-full bg-linear-to-b from-amethyst-300 to-amethyst-600" />
        <span>{title}</span>
      </h2>
      {children}
    </section>
  )
}

/** Yan panel kartı */
export function SideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-fg-3">{title}</h3>
      {children}
    </div>
  )
}

/** Yan panel: ilgili sayfa linkleri */
export function RelatedLinks({ links, all }: { links: { label: string; href: string; hint?: string }[]; all: { label: string; href: string } }) {
  return (
    <ul className="space-y-1">
      {links.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            className="group flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 -mx-2.5 text-fg-2 transition-colors hover:bg-white/5 hover:text-fg"
          >
            <span className="min-w-0 truncate">{l.label}</span>
            {l.hint && <span className="shrink-0 text-xs text-fg-4">{l.hint}</span>}
          </Link>
        </li>
      ))}
      <li className="pt-2">
        <Link href={all.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-amethyst-300 hover:text-amethyst-200">
          {all.label}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </li>
    </ul>
  )
}

/** Sayfa içi içindekiler (masaüstü yan panel) */
export function TableOfContents({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="Bu sayfada">
      <ol className="space-y-0.5 border-l border-white/8">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-fg-3 transition-colors hover:border-amethyst-400 hover:text-fg"
            >
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
