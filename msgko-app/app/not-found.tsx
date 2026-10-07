import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sayfa Bulunamadı',
  robots: { index: false, follow: true },
}

const LINKS = [
  { href: '/rehber', label: 'Karakter Rehberleri' },
  { href: '/boss', label: 'Boss Rehberleri' },
  { href: '/harita', label: 'Haritalar' },
  { href: '/item', label: 'Item Veritabanı' },
  { href: '/gb-fiyatlari', label: 'GB Fiyatları' },
]

export default function NotFound() {
  return (
    <section className="section-container flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <p className="page-header-eyebrow">Hata 404</p>
      <h1 className="page-header-title">Sayfa Bulunamadı</h1>
      <p className="page-header-desc mx-auto mb-10">
        Aradığın sayfa taşınmış ya da hiç var olmamış olabilir. Aşağıdaki bölümlerden devam edebilirsin.
      </p>
      <nav aria-label="Popüler bölümler" className="flex flex-wrap justify-center gap-3">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="card-gaming px-5 py-2.5 text-sm font-semibold"
            style={{ color: 'var(--text-primary)', borderRadius: 8 }}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <Link href="/" className="mt-10 text-sm font-semibold" style={{ color: 'var(--gold-mid)' }}>
        ← Ana sayfaya dön
      </Link>
    </section>
  )
}
