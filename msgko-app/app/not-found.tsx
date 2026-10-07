import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SearchBar } from '@/components/ui/SearchBar'

export const metadata: Metadata = {
  title: 'Sayfa Bulunamadı',
  robots: { index: false, follow: true },
}

const LINKS = [
  { href: '/rehber', label: 'Karakter Rehberleri' },
  { href: '/boss', label: 'Boss Rehberleri' },
  { href: '/harita', label: 'Haritalar' },
  { href: '/item', label: 'Item Veritabanı' },
  { href: '/youtube', label: 'Videolar' },
]

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-7xl font-bold text-silver sm:text-8xl">404</p>
      <h1 className="display-md mt-4">Sayfa Bulunamadı</h1>
      <p className="mx-auto mt-4 max-w-md text-fg-3">
        Aradığın sayfa taşınmış ya da hiç var olmamış olabilir. Aradığını bulmak için siteyi tarayabilir ya da aşağıdaki bölümlerden devam edebilirsin.
      </p>
      <div className="mt-8 w-full max-w-lg">
        <SearchBar />
      </div>
      <nav aria-label="Popüler bölümler" className="mt-8 flex flex-wrap justify-center gap-2">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="chip min-h-10 px-4 text-sm transition-colors hover:border-amethyst-400/40 hover:text-fg">
            {l.label}
          </Link>
        ))}
      </nav>
      <Link href="/" className="btn btn-ghost mt-8">
        <ArrowLeft size={17} aria-hidden="true" />
        Ana sayfaya dön
      </Link>
    </section>
  )
}
