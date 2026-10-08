import Image from 'next/image'
import Link from 'next/link'
import { SectionAction, SectionHeading } from '@/components/ui/SectionHeading'

const wp = (name: string) => `/wallpaper/ChatGPT Image 9 Haz 2026 ${name}.png`
const PICKS = [wp('20_00_52'), wp('12_29_30'), wp('20_06_28'), wp('12_29_13')]

/** Ana sayfa: duvar kağıdı galerisine geçiş — tarayıcı penceresi çerçevesinde önizleme */
export function WallpaperTeaser() {
  return (
    <section aria-labelledby="duvar-kagitlari" className="section band-raised">
      <div className="container-site">
        <SectionHeading
          id="duvar-kagitlari"
          eyebrow="Wallpaper"
          title="Duvar Kağıtları"
          description="Knight Online temalı yüksek kaliteli duvar kağıtları. PC ve telefon için ücretsiz indir."
        />
        <Link
          href="/wallpaper"
          aria-label="Duvar kağıdı galerisine git"
          className="reveal group card card-interactive block overflow-hidden"
        >
          <div className="browser-bar">
            <span>msgko.net/wallpaper</span>
          </div>
          <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-4 sm:gap-3 sm:p-3">
            {PICKS.map((src, i) => (
              <span key={src} className={`relative block aspect-video overflow-hidden rounded-xl ${i > 1 ? 'hidden sm:block' : ''}`}>
                <Image src={src} alt="" fill sizes="(min-width: 640px) 25vw, 50vw" className="zoom-media object-cover" />
              </span>
            ))}
          </div>
        </Link>
        <SectionAction label="Galeriye Git" href="/wallpaper" />
      </div>
    </section>
  )
}
