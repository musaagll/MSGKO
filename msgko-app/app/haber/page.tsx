import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { buildMetadata, buildBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Knight Online Haberler | Güncel Güncelleme ve Duyurular | MSGKO',
  description:
    'Knight Online güncel haberler, patch notları, etkinlikler ve bakım duyuruları. En güncel Knight Online içerikleri MSGKO\'da.',
  canonical: `${BASE_URL}/haber`,
  keywords: [
    'knight online haber', 'knight online güncelleme', 'knight online patch',
    'knight online etkinlik', 'knight online duyuru', 'knight online bakım',
    'knight online son dakika', 'knight online yeni içerik',
  ],
  ogType: 'website',
})

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Haberler', href: '/haber' },
]

const schemas = [buildBreadcrumbSchema(breadcrumbs)]

export default function HaberIndexPage() {
  return (
    <>
      <Script
        id="haber-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <main className="min-h-screen" style={{ background: '#07070B' }}>
        <nav aria-label="Sayfa konumu" className="max-w-[1280px] mx-auto px-6 sm:px-8 pt-24 pb-2">
          <ol className="flex flex-wrap items-center gap-1.5 text-[0.72rem] text-white/30">
            <li><Link href="/" className="hover:text-white/60 transition-colors">Ana Sayfa</Link></li>
            <li aria-hidden="true"><span>/</span></li>
            <li className="text-white/60">Haberler</li>
          </ol>
        </nav>

        <header className="max-w-[1280px] mx-auto px-6 sm:px-8 py-10">
          <p className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-purple-400/60 mb-3">HABER MERKEZİ</p>
          <h1 className="text-3xl md:text-4xl font-black tracking-[0.04em] uppercase text-white mb-4"
            style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
            Knight Online Haberler
          </h1>
          <p className="text-[0.9rem] leading-[1.8] text-white/50 max-w-2xl">
            Knight Online&#39;daki en güncel güncellemeler, patch notları, etkinlikler ve
            önemli duyurular burada yayınlanır.
          </p>
        </header>

        <section className="max-w-[1280px] mx-auto px-6 sm:px-8 pb-20">
          {/* Haberler Supabase'den gelecek — şimdilik placeholder */}
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 flex items-center justify-center mb-6 border border-white/[0.06]"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" className="text-white/20" aria-hidden="true">
                <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
              </svg>
            </div>
            <h2 className="text-[0.9rem] font-semibold text-white/40 mb-2">
              Haberler yakında yayınlanacak
            </h2>
            <p className="text-[0.78rem] text-white/25 max-w-sm leading-relaxed">
              Knight Online güncellemeleri ve duyuruları için bu sayfayı takip edin.
              Admin panelinden haber eklendikçe burada görünecek.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link href="/rehber" className="px-5 py-2.5 text-[0.76rem] font-semibold tracking-[0.08em] uppercase
                border border-purple-500/30 text-purple-400/70 hover:border-purple-500/60 hover:text-purple-400
                transition-all duration-200">
                Rehberlere Bak
              </Link>
              <Link href="/" className="px-5 py-2.5 text-[0.76rem] font-semibold tracking-[0.08em] uppercase
                border border-white/10 text-white/40 hover:border-white/20 hover:text-white/70
                transition-all duration-200">
                Ana Sayfa
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
