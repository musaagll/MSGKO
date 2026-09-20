import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { KO_ITEMS } from '@/lib/ko-data/items'
import { buildMetadata, buildBreadcrumbSchema, buildItemListSchema, BASE_URL } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Knight Online Item Veritabanı | Silah, Zırh ve Aksesuar | MSGKO',
  description: 'Knight Online tüm itemlar için özellik, drop bilgisi ve upgrade rehberi. Raptor, Dual Blade, Chitin ve daha fazlası.',
  canonical: `${BASE_URL}/item`,
  keywords: [],
  ogType: 'website',
})

const ITEM_TYPE: Record<string, string> = {
  weapon: 'Silah', armor: 'Zırh', accessory: 'Aksesuar',
  ring: 'Yüzük', necklace: 'Kolye', shield: 'Kalkan',
  helmet: 'Kask', gloves: 'Eldiven', boots: 'Bot', cape: 'Pelerin',
}

const GRADE: Record<string, { label: string; color: string; bg: string }> = {
  normal:    { label: 'Normal',    color: 'rgba(148,163,184,0.8)', bg: 'rgba(148,163,184,0.06)' },
  unique:    { label: 'Unique',    color: 'rgba(240,192,80,0.9)',  bg: 'rgba(240,192,80,0.06)'  },
  legendary: { label: 'Legendary', color: 'rgba(212,168,50,1)',    bg: 'rgba(212,168,50,0.08)'  },
}

export default function ItemIndexPage() {
  const items = KO_ITEMS.filter(i => i.is_published)

  const schemas = [
    buildBreadcrumbSchema([{ label: 'Ana Sayfa', href: '/' }, { label: 'Item Veritabanı', href: '/item' }]),
    buildItemListSchema({
      name: 'Knight Online Item Veritabanı',
      description: 'Özellik, drop ve upgrade bilgileri.',
      url: '/item',
      items: items.map(i => ({ name: `Knight Online ${i.name}`, url: `/item/${i.slug}`, description: i.description ?? '' })),
    }),
  ]

  return (
    <>
      <Script id="item-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />

      <main style={{ minHeight: '100vh', background: 'var(--void)' }}>

        {/* ── Page Header ── */}
        <div className="page-header" style={{ paddingTop: 'clamp(5rem,8vw,6rem)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <nav aria-label="Konum" style={{ marginBottom: 20 }}>
              <ol className="breadcrumb">
                <li><Link href="/" style={{ color: 'var(--iron)', textDecoration: 'none' }}>Ana Sayfa</Link></li>
                <li style={{ color: 'var(--iron)', opacity: 0.3 }}>/</li>
                <li style={{ color: 'var(--steel)' }}>Item Veritabanı</li>
              </ol>
            </nav>

            <p className="page-header-eyebrow">Item Veritabanı</p>
            <h1 className="page-header-title">Knight Online<br/>Item Veritabanı</h1>
            <p className="page-header-desc">
              Silah, zırh, aksesuar ve tüm itemların özellikleri, drop kaynakları ve upgrade bilgileri.
            </p>

            {/* Rarity özeti */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
              {Object.entries(GRADE).map(([key, g]) => {
                const count = items.filter(i => i.item_grade === key).length
                if (!count) return null
                return (
                  <div key={key} style={{
                    display: 'flex', alignItems: 'center', gap: 7, padding: '4px 12px',
                    background: g.bg, border: `1px solid ${g.color}40`,
                  }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 900, color: g.color, fontFamily: 'var(--font-rajdhani)' }}>{count}</span>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: g.color, opacity: 0.8 }}>{g.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Item Listesi ── */}
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(2rem,4vw,3rem) clamp(1.5rem,4vw,2.5rem) 5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {items.map(item => {
              const grade = GRADE[item.item_grade] ?? GRADE['normal']
              return (
                <Link
                  key={item.slug}
                  href={`/item/${item.slug}`}
                  className="card-gaming group"
                  style={{
                    display: 'flex', flexDirection: 'column', gap: 10,
                    padding: '18px 20px',
                    textDecoration: 'none', position: 'relative', overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${grade.color}, transparent)`, opacity: 0.5 }} />

                  {/* Tip + Grade */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: '0.57rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                      padding: '2px 7px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--iron)',
                    }}>
                      {ITEM_TYPE[item.item_type] ?? item.item_type}
                    </span>
                    <span style={{
                      fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
                      padding: '2px 7px', background: grade.bg, border: `1px solid ${grade.color}35`, color: grade.color,
                    }}>
                      {grade.label}
                    </span>
                  </div>

                  {/* İsim */}
                  <div>
                    <h2 style={{
                      fontFamily: 'var(--font-rajdhani), sans-serif',
                      fontSize: '1rem', fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase',
                      color: 'var(--platinum)', marginBottom: 3, lineHeight: 1.2,
                    }}>
                      {item.name}
                    </h2>
                    <p style={{ fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--iron)' }}>
                      Min Lv. {item.min_level}{item.character_class.length > 0 ? ` · ${item.character_class.join('/')}` : ''}
                    </p>
                  </div>

                  {/* Stats */}
                  {Object.keys(item.base_stats).length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {Object.entries(item.base_stats).slice(0, 4).map(([stat, val]) => (
                        <span key={stat} style={{
                          fontSize: '0.62rem', padding: '2px 7px',
                          background: `${grade.color}0A`,
                          border: `1px solid ${grade.color}20`,
                          color: grade.color, opacity: 0.9,
                        }}>
                          {stat.toUpperCase()}: +{val}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Açıklama */}
                  <p className="line-clamp-2" style={{ fontSize: '0.72rem', lineHeight: 1.65, color: 'var(--iron)' }}>
                    {item.description ?? ''}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--crimson-bright)', opacity: 0.8 }}>
                      Item Detayı
                    </span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--crimson-bright)" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Sistem bilgisi */}
          <div style={{
            marginTop: 40, padding: '18px 22px',
            background: 'rgba(212,168,50,0.03)',
            border: '1px solid rgba(212,168,50,0.1)',
            borderLeft: '3px solid rgba(212,168,50,0.4)',
          }}>
            <h2 style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--steel)', marginBottom: 10 }}>
              Knight Online Item Sistemi
            </h2>
            <p style={{ fontSize: '0.77rem', lineHeight: 1.8, color: 'var(--iron)' }}>
              Itemlar normal, unique ve legendary olmak üzere nadirlik seviyelerine sahiptir. Unique itemlar bosslardan,
              dungeon&apos;lardan ve özel görevlerden elde edilir. +1&apos;den +9&apos;a kadar upgrade mümkündür.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
