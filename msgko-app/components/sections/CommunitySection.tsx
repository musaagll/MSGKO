import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Coins, HandHeart, Mail } from 'lucide-react'
import { InstagramIcon, YouTubeIcon } from '@/components/ui/BrandIcons'
import { SOCIAL } from '@/lib/site'

// Eski ana sayfa kartlarının metinleri; mobil alt menüde olmayan iki sayfaya ana sayfadan giriş
const SHORTCUTS = [
  { title: 'GB Takip', text: 'Güncel GB fiyatlarını takip et, piyasayı kaçırma.', href: '/gb-fiyatlari', Icon: Coins },
  { title: 'İletişim', text: 'Soru, öneri ve iş birlikleri için bizimle iletişime geç.', href: '/iletisim', Icon: Mail },
]

/** Ana sayfa kapanışı: topluluk ve destek çağrısı */
export function CommunitySection() {
  return (
    <section aria-labelledby="topluluk" className="section pt-0">
      <div className="container-site">
        <div className="card relative isolate overflow-hidden px-6 py-12 text-center sm:px-12 sm:py-16">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_18rem_at_50%_0%,rgba(110,78,206,0.28),transparent_70%)]" />
          <Image src="/brand/emblem.png" alt="" width={110} height={100} className="mx-auto h-auto w-24 drop-shadow-[0_6px_30px_rgba(141,108,234,0.5)]" />
          <h2 id="topluluk" className="display-md mx-auto mt-6 max-w-2xl">Topluluğa katıl</h2>
          <p className="mx-auto mt-4 max-w-xl text-fg-3">
            Yeni rehberler ve videolardan ilk sen haberdar ol. İçerikleri beğendiysen bir abonelik ya da küçük bir destek büyük motivasyon.
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

        <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {SHORTCUTS.map(({ title, text, href, Icon }) => (
            <li key={href}>
              <Link href={href} className="card card-interactive group flex h-full items-center gap-4 p-5 sm:p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amethyst-400/25 bg-amethyst-500/10 text-amethyst-200">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-fg">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-fg-3">{text}</p>
                </div>
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="shrink-0 text-fg-4 transition-transform group-hover:translate-x-0.5 group-hover:text-amethyst-300"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
