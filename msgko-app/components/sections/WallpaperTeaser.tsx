import Image from 'next/image'
import Link from 'next/link'
import { SectionHeading } from '@/components/ui/SectionHeading'

const wp = (name: string) => `/wallpaper/ChatGPT Image 9 Haz 2026 ${name}.png`
const PICKS = [wp('20_00_52'), wp('12_29_30'), wp('20_06_28'), wp('12_29_13')]

/** Ana sayfa: duvar kağıdı galerisine geçiş */
export function WallpaperTeaser() {
  return (
    <section aria-labelledby="duvar-kagitlari" className="section pt-0">
      <div className="container-site">
        <SectionHeading
          id="duvar-kagitlari"
          eyebrow="Wallpaper"
          title="Duvar Kağıtları"
          description="Knight Online temalı yüksek kaliteli duvar kağıtları. PC ve telefon için ücretsiz indir."
          action={{ label: 'Galeriye git', href: '/wallpaper' }}
        />
        <Link href="/wallpaper" aria-label="Duvar kağıdı galerisine git" className="group grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PICKS.map((src, i) => (
            <span key={src} className={`card relative block aspect-video overflow-hidden ${i > 1 ? 'hidden sm:block' : ''}`}>
              <Image src={src} alt="" fill sizes="(min-width: 640px) 25vw, 50vw" className="zoom-media object-cover" />
            </span>
          ))}
        </Link>
      </div>
    </section>
  )
}
