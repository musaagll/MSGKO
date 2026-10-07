import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Gem, Map as MapIcon, Skull } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { KO_BOSSES } from '@/lib/ko-data/bosses'
import { KO_MAPS } from '@/lib/ko-data/maps'
import { KO_ITEMS } from '@/lib/ko-data/items'
import { SECTION_ART } from '@/lib/class-meta'

/** Ana sayfa: veritabanı vitrini — boss, harita ve item sayfalarına doğrudan iç linkler */
export function QuickAccessSection() {
  const bosses = KO_BOSSES.filter((b) => b.is_published)
  const maps = KO_MAPS.filter((m) => m.is_published)
  const items = KO_ITEMS.filter((i) => i.is_published)

  const tiles = [
    {
      title: 'Boss Rehberleri',
      href: '/boss',
      Icon: Skull,
      art: SECTION_ART.boss,
      count: `${bosses.length} boss`,
      text: 'Spawn yeri, çıkma zamanı, drop listesi ve öldürme taktikleri.',
      links: bosses.slice(0, 4).map((b) => ({ label: b.name, href: `/boss/${b.slug}` })),
    },
    {
      title: 'Haritalar',
      href: '/harita',
      Icon: MapIcon,
      art: SECTION_ART.harita,
      count: `${maps.length} harita`,
      text: 'Farm noktaları, boss konumları, NPC’ler ve level aralıkları.',
      links: maps.filter((m) => ['ronark-land', 'ardream', 'forgotten-temple', 'eslant'].includes(m.slug))
        .map((m) => ({ label: m.name, href: `/harita/${m.slug}` })),
    },
    {
      title: 'Item Veritabanı',
      href: '/item',
      Icon: Gem,
      art: SECTION_ART.item,
      count: `${items.length} item`,
      text: 'Özellikler, drop kaynakları ve upgrade bilgileri.',
      links: items.slice(0, 4).map((i) => ({ label: i.name, href: `/item/${i.slug}` })),
    },
  ]

  return (
    <section aria-labelledby="veritabani" className="section">
      <div className="container-site">
        <SectionHeading
          id="veritabani"
          eyebrow="Veritabanı"
          title="Boss, harita ve item rehberleri"
          description="Oyunun önemli içeriklerini tek tek ele alan, sürekli genişleyen bir başvuru kaynağı."
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {tiles.map(({ title, href, Icon, art, count, text, links }) => (
            <article key={href} className="card group flex flex-col overflow-hidden">
              <div className="relative h-36 overflow-hidden sm:h-44">
                <Image src={art} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="zoom-media object-cover" />
                <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-900 via-ink-900/40 to-transparent" />
                <span className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-ink-950/60 text-amethyst-200 backdrop-blur">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="chip absolute right-5 top-5 bg-ink-950/60 backdrop-blur">{count}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold">
                  <Link href={href} className="hover:text-amethyst-200">{title}</Link>
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg-3">{text}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="chip transition-colors hover:border-amethyst-400/40 hover:text-fg">{l.label}</Link>
                    </li>
                  ))}
                </ul>
                <Link href={href} className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-amethyst-300 hover:text-amethyst-200">
                  Tümünü gör
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
