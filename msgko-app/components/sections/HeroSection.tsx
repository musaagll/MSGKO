import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, Crosshair } from 'lucide-react'
import { KO_CLASSES } from '@/lib/ko-data/classes'
import { getPublishedBossSlugs } from '@/lib/ko-data/bosses'
import { getPublishedMapSlugs } from '@/lib/ko-data/maps'
import { getPublishedItemSlugs } from '@/lib/ko-data/items'

/**
 * Ana sayfa hero'su — sinematik, tam genişlik, bölünmüş düzen (doküman).
 * Sol: pelerininde MSG amblemi taşıyan şövalye · Sağ: başlık ve aksiyonlar.
 */
export function HeroSection() {
  const stats = [
    { value: KO_CLASSES.length, label: 'Sınıf rehberi', href: '/rehber' },
    { value: getPublishedBossSlugs().length, label: 'Boss', href: '/boss' },
    { value: getPublishedMapSlugs().length, label: 'Harita', href: '/harita' },
    { value: getPublishedItemSlugs().length, label: 'Item', href: '/item' },
  ]

  return (
    <section
      aria-labelledby="hero-baslik"
      className="relative isolate -mt-(--header-h) flex min-h-[min(100svh,60rem)] items-end overflow-hidden lg:min-h-[min(100svh,52rem)] lg:items-center"
    >
      <Image
        src="/Gorsel/arkaplan.png"
        alt=""
        fill
        priority
        // Dikey ekranda object-cover görseli ~yükseklik×1.78 genişliğe büyütür
        sizes="(max-width: 1024px) 1400px, 100vw"
        className="-z-20 object-cover object-[30%_center] lg:object-[20%_center]"
      />
      {/* Okunabilirlik katmanları */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-ink-950 via-ink-950/70 to-ink-950/10 lg:bg-linear-to-l lg:from-ink-950 lg:via-ink-950/80 lg:to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b from-ink-950/80 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-ink-950 to-transparent" />

      {/* Marka sözü (dekoratif) */}
      <p
        aria-hidden="true"
        className="absolute bottom-10 left-[max(2rem,calc((100vw-75rem)/2+2rem))] hidden max-w-64 font-display text-base font-semibold uppercase tracking-[0.06em] leading-snug text-fg-3/70 xl:block"
      >
        “Bazı oyunlar geçici, bazıları ise bir yaşam tarzıdır.”
      </p>

      <div className="container-site grid grid-cols-1 pb-14 pt-[calc(var(--header-h)+18rem)] sm:pt-[calc(var(--header-h)+22rem)] lg:grid-cols-2 lg:py-[calc(var(--header-h)+4rem)]">
        <div className="animate-[rise-in_.8s_var(--ease-soft)_both] lg:col-start-2">
          {/* 360px altında tek satıra sığması için çizgi gizlenir ve harf aralığı daraltılır */}
          <p className="eyebrow max-[359px]:tracking-[0.14em] max-[359px]:before:hidden">
            <span lang="en">Knight Online</span>
            <span aria-hidden="true">·</span>
            <span>Türkçe Rehber</span>
          </p>

          <h1 id="hero-baslik" className="mt-5">
            <span className="display-xl text-silver block drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">MSGKO</span>
            <span className="sr-only"> — </span>
            <span className="mt-4 block text-2xl font-semibold leading-tight text-fg sm:text-3xl">
              <span lang="en">Knight Online</span> Rehber Platformu
            </span>
          </h1>

          <h2 className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-amethyst-300">
            Oyuncular İçin Daha Fazlası
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-3 sm:text-lg">
            Knight Online dünyasına dair rehberler, içerikler, araçlar ve daha fazlası. Tek bir yerde, oyuncular için.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/rehber/asas" className="btn btn-primary btn-lg">
              <Crosshair size={18} aria-hidden="true" />
              Asas Rehberi
            </Link>
            <Link href="/rehber/okcu" className="btn btn-secondary btn-lg">
              <BookOpen size={18} aria-hidden="true" />
              Okçu Rehberi
            </Link>
            <Link href="/rehber" className="btn btn-ghost btn-lg">
              Tüm rehberler
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>

          <ul aria-label="İçerik sayıları" className="mt-10 grid max-w-xl grid-cols-4 overflow-hidden rounded-2xl border border-white/10 bg-ink-950/50 backdrop-blur-md">
            {stats.map((s, i) => (
              <li key={s.href} className={i > 0 ? 'border-l border-white/10' : ''}>
                <Link href={s.href} className="flex flex-col items-center px-2 py-4 transition-colors hover:bg-white/5 sm:py-5">
                  <span className="font-display text-2xl font-bold tabular-nums text-fg sm:text-3xl">{s.value}</span>
                  <span className="mt-1 text-center text-xs text-fg-3">{s.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
