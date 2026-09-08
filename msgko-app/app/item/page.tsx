import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { KO_ITEMS } from '@/lib/ko-data/items'
import { buildMetadata, buildBreadcrumbSchema, buildItemListSchema, BASE_URL } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Knight Online Item Veritabanı | Silah, Zırh ve Aksesuar Rehberi | MSGKO',
  description:
    'Knight Online tüm item\'lar için özellik, drop bilgisi ve upgrade rehberi. Raptor, Dual Blade, Chitin ve daha fazlası MSGKO item veritabanında.',
  canonical: `${BASE_URL}/item`,
  keywords: [
    'knight online item', 'knight online item listesi', 'knight online silah',
    'knight online zırh', 'knight online aksesuar', 'knight online item veritabanı',
    'knight online item drop', 'knight online raptor', 'knight online upgrade',
  ],
  ogType: 'website',
})

const breadcrumbs = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Item Veritabanı', href: '/item' },
]

const ITEM_TYPE_LABELS: Record<string, string> = {
  weapon: 'Silah',
  armor: 'Zırh',
  accessory: 'Aksesuar',
  ring: 'Yüzük',
  necklace: 'Kolye',
  shield: 'Kalkan',
  helmet: 'Kask',
  gloves: 'Eldiven',
  boots: 'Bot',
  cape: 'Pelerin',
}

const GRADE_COLORS: Record<string, string> = {
  normal: 'rgba(255,255,255,0.4)',
  unique: 'rgba(245,158,11,0.8)',
  legendary: 'rgba(139,92,246,0.9)',
}

export default function ItemIndexPage() {
  const published = KO_ITEMS.filter((i) => i.is_published)

  const schemas = [
    buildBreadcrumbSchema(breadcrumbs),
    buildItemListSchema({
      name: 'Knight Online Item Veritabanı',
      description: 'Tüm Knight Online item\'ları için özellik, drop ve upgrade bilgileri.',
      url: '/item',
      items: published.map((item) => ({
        name: `Knight Online ${item.name}`,
        url: `/item/${item.slug}`,
        description: item.description ?? '',
      })),
    }),
  ]

  return (
    <>
      <Script
        id="item-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <main className="min-h-screen" style={{ background: '#07070B' }}>
        <nav aria-label="Sayfa konumu" className="max-w-[1280px] mx-auto px-6 sm:px-8 pt-24 pb-2">
          <ol className="flex flex-wrap items-center gap-1.5 text-[0.72rem] text-white/30">
            <li><Link href="/" className="hover:text-white/60 transition-colors">Ana Sayfa</Link></li>
            <li aria-hidden="true"><span>/</span></li>
            <li className="text-white/60">Item Veritabanı</li>
          </ol>
        </nav>

        <header className="max-w-[1280px] mx-auto px-6 sm:px-8 py-10">
          <p className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-purple-400/60 mb-3">ITEM VERİTABANI</p>
          <h1 className="text-3xl md:text-4xl font-black tracking-[0.04em] uppercase text-white mb-4"
            style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
            Knight Online Item Veritabanı
          </h1>
          <p className="text-[0.9rem] leading-[1.8] text-white/50 max-w-2xl">
            Knight Online&#39;daki silah, zırh, aksesuar ve diğer item&#39;ların özellikleri,
            nereden düştüğü ve nasıl upgrade edileceği hakkında kapsamlı bilgi.
          </p>
        </header>

        <section className="max-w-[1280px] mx-auto px-6 sm:px-8 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {published.map((item) => (
              <Link
                key={item.slug}
                href={`/item/${item.slug}`}
                className="group p-6 border border-white/[0.07] hover:border-white/20 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.015)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[0.6rem] font-bold tracking-[0.15em] uppercase px-2 py-0.5 border"
                    style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                    {ITEM_TYPE_LABELS[item.item_type] ?? item.item_type}
                  </span>
                  <span className="text-[0.6rem] font-bold tracking-[0.1em] uppercase"
                    style={{ color: GRADE_COLORS[item.item_grade] ?? 'rgba(255,255,255,0.4)' }}>
                    {item.item_grade === 'unique' ? 'Unique' : item.item_grade === 'legendary' ? 'Legendary' : 'Normal'}
                  </span>
                </div>

                <h2 className="text-[1rem] font-black tracking-[0.05em] uppercase text-white mb-1"
                  style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                  {item.name}
                </h2>

                <p className="text-[0.68rem] tracking-[0.08em] uppercase text-white/30 mb-3">
                  Min Lv. {item.min_level}
                  {item.character_class.length > 0 && ` · ${item.character_class.join('/')}`}
                </p>

                {/* Base stats */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {Object.entries(item.base_stats).slice(0, 3).map(([stat, val]) => (
                    <span key={stat} className="text-[0.65rem] px-2 py-0.5"
                      style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)' }}>
                      {stat.toUpperCase()}: +{val}
                    </span>
                  ))}
                </div>

                <p className="text-[0.75rem] leading-[1.7] text-white/35 line-clamp-2 mb-3">
                  {item.description ?? ''}
                </p>

                <div className="flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.1em]
                  uppercase text-white/30 group-hover:text-white/70 transition-colors duration-200">
                  <span>Item Detayı</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 p-6 border border-white/[0.06]" style={{ background: 'rgba(245,158,11,0.03)' }}>
            <h2 className="text-[0.8rem] font-black tracking-[0.15em] uppercase text-white/80 mb-3">
              Knight Online Item Sistemi
            </h2>
            <p className="text-[0.78rem] leading-[1.8] text-white/40">
              Knight Online&#39;daki item&#39;lar normal, unique ve legendary olmak üzere farklı nadirlik
              seviyelerine sahiptir. Unique item&#39;lar boss&#39;lardan, dungeon&#39;lardan ve özel görevlerden
              elde edilir. Item&#39;ları +1&#39;den +9&#39;a kadar upgrade etmek mümkündür, ancak yüksek
              seviyelerde başarısızlık riski artar. Tam item rehberleri için her item&#39;ın sayfasını ziyaret edebilirsin.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
