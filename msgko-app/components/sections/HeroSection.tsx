import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, Crosshair } from 'lucide-react'
import { KO_CLASSES } from '@/lib/ko-data/classes'
import { getPublishedBossSlugs } from '@/lib/ko-data/bosses'
import { getPublishedMapSlugs } from '@/lib/ko-data/maps'
import { getPublishedItemSlugs } from '@/lib/ko-data/items'

/**
 * Ana sayfa hero'su — ortalanmış başlık, süzülen MSG amblemi ve iki aksiyon.
 * Arkada silik karakter görseli ve üstten mor ışık (oyun sitesi hissi korunur).
 */
export function HeroSection() {
  const stats = [
    { value: KO_CLASSES.length, label: 'Sınıf rehberi', href: '/rehber' },
    { value: getPublishedBossSlugs().length, label: 'Boss', href: '/boss' },
    { value: getPublishedMapSlugs().length, label: 'Harita', href: '/harita' },
    { value: getPublishedItemSlugs().length, label: 'Item', href: '/item' },
  ]

  return (
    <section aria-labelledby="hero-baslik" className="relative isolate -mt-(--header-h) overflow-hidden text-center">
      <Image
        src="/Gorsel/arkaplan.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[30%_30%] opacity-30"
      />
      {/* Görseli zemine eriten katmanlar + üstten mor ışık */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,rgba(11,11,13,0.55),var(--color-ink-950)_75%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-152 bg-[radial-gradient(44rem_26rem_at_50%_0%,rgba(102,51,238,0.28),transparent_70%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-t from-ink-950 to-transparent" />

      <div className="container-site flex flex-col items-center pb-20 pt-[calc(var(--header-h)+4.5rem)] sm:pb-28 sm:pt-[calc(var(--header-h)+6rem)]">
        <div className="animate-[rise-in_.8s_var(--ease-soft)_both]">
          <p className="eyebrow justify-center max-[359px]:tracking-[0.14em]">
            <span lang="en">Knight Online</span>
            <span aria-hidden="true">·</span>
            <span>Türkçe Rehber</span>
          </p>

          <h1 id="hero-baslik" className="mx-auto mt-6 max-w-4xl">
            <span className="display-xl text-silver block">MSGKO</span>
            <span className="sr-only"> — </span>
            <span className="display-lg mt-2 block text-fg">
              <span lang="en">Knight Online</span> <span className="text-amethyst-400">Rehber</span> Platformu
            </span>
          </h1>

          <h2 className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-fg-2">Oyuncular İçin Daha Fazlası</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-fg-3 sm:text-lg">
            Knight Online dünyasına dair rehberler, içerikler, araçlar ve daha fazlası. Tek bir yerde, oyuncular için.
          </p>
        </div>

        {/* Süzülen amblem (dekoratif) */}
        <div aria-hidden="true" className="emblem-float mt-10 sm:mt-12">
          <div className="emblem-sway relative w-36 sm:w-44">
            <Image
              src="/brand/emblem-hd.png"
              alt=""
              width={961}
              height={873}
              sizes="(min-width: 640px) 176px, 144px"
              priority
              className="h-auto w-full drop-shadow-[0_18px_50px_rgba(102,51,238,0.55)]"
            />
            <span className="emblem-sheen" />
          </div>
        </div>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:mt-12 sm:w-auto sm:flex-row sm:flex-wrap">
          <Link href="/rehber/asas" className="btn btn-primary btn-lg w-full sm:w-auto">
            <Crosshair size={18} aria-hidden="true" />
            Asas Rehberi
          </Link>
          <Link href="/rehber/okcu" className="btn btn-secondary btn-lg w-full sm:w-auto">
            <BookOpen size={18} aria-hidden="true" />
            Okçu Rehberi
          </Link>
          <Link href="/rehber" className="btn btn-ghost btn-lg w-full sm:w-auto">
            Tüm rehberler
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <ul aria-label="İçerik sayıları" className="mt-14 grid w-full max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 sm:grid-cols-4">
          {stats.map((s) => (
            <li key={s.href} className="bg-ink-950/85 backdrop-blur-md">
              <Link href={s.href} className="flex flex-col items-center px-2 py-5 transition-colors hover:bg-white/4">
                <span className="text-3xl font-bold tracking-tight tabular-nums text-fg">{s.value}</span>
                <span className="mt-1 text-sm text-fg-3">{s.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
