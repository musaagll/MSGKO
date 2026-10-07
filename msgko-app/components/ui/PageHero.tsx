import Image from 'next/image'
import { Breadcrumbs, type Crumb } from './Breadcrumbs'

interface PageHeroProps {
  breadcrumbs: Crumb[]
  eyebrow?: React.ReactNode
  /** H1 içeriği — SEO açısından sayfanın birincil başlığı */
  title: React.ReactNode
  description?: React.ReactNode
  /** Başlığın altında: rozetler, istatistikler, butonlar */
  children?: React.ReactNode
  /** Sağ tarafta karakter çizimi (dekoratif) */
  art?: { src: string; position?: string }
  /** İnce vurgu çizgisinin rengi (ör. sınıf rengi) */
  accent?: string
}

/** Tüm iç sayfaların başlık alanı. Header sabit olduğu için üst boşluk burada verilir. */
export function PageHero({ breadcrumbs, eyebrow, title, description, children, art, accent }: PageHeroProps) {
  return (
    <header className="relative isolate overflow-hidden border-b border-white/6">
      {art && (
        // Mobilde metnin arkasında silik; masaüstünde sağ tarafta net karakter çizimi
        <div aria-hidden="true" className="absolute inset-0 -z-10 lg:left-auto lg:w-[62%]">
          <Image
            src={art.src}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="object-cover opacity-40 lg:opacity-90"
            style={{ objectPosition: art.position ?? '70% 30%' }}
          />
          {/* Okunabilirlik için karartma: mobilde tüm alan, masaüstünde soldan geçiş */}
          <div className="absolute inset-0 bg-linear-to-r from-ink-950 via-ink-950/70 to-ink-950/30 lg:via-ink-950/25 lg:to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-ink-950 via-transparent to-ink-950/50" />
        </div>
      )}
      {!art && (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(48rem_22rem_at_15%_0%,rgba(110,78,206,0.16),transparent_70%)]"
        />
      )}

      <div className="container-site pb-10 pt-8 sm:pb-14 sm:pt-12">
        <Breadcrumbs items={breadcrumbs} />
        <div className={`mt-6 max-w-3xl ${art ? 'sm:mt-10' : ''}`}>
          {eyebrow && (
            <p className="eyebrow" style={accent ? { color: accent } : undefined}>
              {eyebrow}
            </p>
          )}
          <h1 className="display-lg mt-3">{title}</h1>
          {description && (
            <div className="mt-5 max-w-2xl text-base leading-relaxed text-fg-3 sm:text-lg">{description}</div>
          )}
          {children && <div className="mt-7">{children}</div>}
        </div>
      </div>
      {accent && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px"
          style={{ background: `linear-gradient(90deg, ${accent}, transparent 60%)` }}
        />
      )}
    </header>
  )
}
