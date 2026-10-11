import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, Crosshair } from 'lucide-react'

/**
 * Ana sayfa hero'su — ortalanmış başlık, MSG amblemi ve aksiyonlar.
 * Arkada silik karakter görseli; okunabilirlik için tek, düz karartma katmanı.
 */
export function HeroSection() {
  return (
    <section aria-labelledby="hero-baslik" className="relative isolate -mt-(--header-h) overflow-hidden text-center">
      <Image
        src="/Gorsel/arkaplan.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[30%_30%] opacity-40"
      />
      {/* Okunabilirlik karartması + görselin alt kenarını zemine eriten geçiş */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink-950/70" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-t from-ink-950 to-transparent" />

      <div className="container-site flex flex-col items-center pb-20 pt-[calc(var(--header-h)+4.5rem)] sm:pb-28 sm:pt-[calc(var(--header-h)+6rem)]">
        <div className="intro-hold animate-[rise-in_.8s_var(--ease-soft)_both]">
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

        {/* Amblem (dekoratif) */}
        <div aria-hidden="true" className="intro-hold mt-10 animate-[rise-in_.9s_var(--ease-soft)_both] sm:mt-12">
          <div className="w-36 sm:w-44">
            <Image
              src="/brand/emblem-hd.png"
              alt=""
              width={961}
              height={873}
              sizes="(min-width: 640px) 176px, 144px"
              priority
              className="h-auto w-full"
            />
          </div>
        </div>

        <div className="intro-hold mt-10 flex w-full animate-[rise-in_1s_var(--ease-soft)_both] flex-col items-center justify-center gap-3 sm:mt-12 sm:w-auto sm:flex-row sm:flex-wrap">
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
      </div>
    </section>
  )
}
