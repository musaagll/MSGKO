import Image from 'next/image'
import Link from 'next/link'
import { HandHeart } from 'lucide-react'
import { InstagramIcon, YouTubeIcon } from '@/components/ui/BrandIcons'
import { SOCIAL } from '@/lib/site'

/** Ana sayfa kapanışı: topluluk ve destek çağrısı */
export function CommunitySection() {
  return (
    <section aria-labelledby="topluluk" className="section">
      <div className="container-site">
        <div className="reveal card px-6 py-14 text-center sm:px-12 sm:py-16">
          <div aria-hidden="true" className="mx-auto w-20">
            <Image src="/brand/emblem-hd.png" alt="" width={961} height={873} sizes="96px" className="h-auto w-full" />
          </div>
          <h2 id="topluluk" className="display-md mx-auto mt-8 max-w-2xl">Topluluğa katıl</h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-fg-3 sm:text-lg">
            Yeni rehber ve videolardan ilk sen haberdar ol.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={SOCIAL.youtubeSubscribe} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
              <YouTubeIcon size={20} />
              YouTube&apos;da Abone Ol
            </a>
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-lg">
              <InstagramIcon size={19} />
              Instagram&apos;da Takip Et
            </a>
            <Link href="/destek" className="btn btn-ghost btn-lg">
              <HandHeart size={19} aria-hidden="true" />
              Destek Ol
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
