import type { Metadata } from 'next'
import Link from 'next/link'
import { HeroSection } from '@/components/sections/HeroSection'
import { YoutubeVideoSection } from '@/components/sections/YoutubeVideoSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { ReklamSection } from '@/components/sections/ReklamSection'
import { AdSense } from '@/components/ui/AdSense'
import { getYoutubeVideos } from '@/lib/youtube'
import type { YTVideo } from '@/lib/youtube'
import { KO_CLASSES } from '@/lib/ko-data/classes'
import { KO_BOSSES } from '@/lib/ko-data/bosses'
import { KO_MAPS } from '@/lib/ko-data/maps'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'MSGKO.net — Knight Online Rehber ve Eğitim Sitesi',
  description:
    'MSGKO.net — Türkiye\'nin Knight Online rehber platformu. Asas, Okçu, Warrior, Mage, Priest build rehberleri, boss drop listesi, harita rehberleri, farm rotaları ve güncel içerikler.',
  alternates: {
    canonical: 'https://msgko.net',
  },
}

export default async function HomePage() {
  let videos: YTVideo[] = []
  try {
    videos = await getYoutubeVideos(4)
  } catch {
    videos = []
  }

  // Ana sayfada gösterilecek featured içerikler
  const featuredClasses = KO_CLASSES.slice(0, 3)
  const featuredBosses  = KO_BOSSES.filter((b) => b.is_published).slice(0, 3)
  const featuredMaps    = KO_MAPS.filter((m) => m.is_published && m.map_type === 'pvp').slice(0, 3)

  return (
    <main>
      <HeroSection />
      <YoutubeVideoSection videos={videos} />

      {/* Reklam — video ile content hub arası */}
      <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 py-4">
        <AdSense slot="8727584512" />
      </div>

      <FeaturesSection />
      <ReklamSection />

      {/* ── İçerik Hub — Topical Authority ana blok ── */}
      <section
        id="icerik-hub"
        className="relative py-16 px-6 sm:px-8"
        style={{ background: '#07070B', borderTop: '1px solid rgba(255,255,255,0.04)' }}
        aria-label="Knight Online içerik kategorileri"
      >
        <div className="relative max-w-[1280px] mx-auto">

          {/* ── Başlık ── */}
          <div className="text-center mb-12">
            <p className="text-[0.65rem] font-bold tracking-[0.3em] uppercase mb-2"
              style={{ color: 'rgba(139,92,246,0.7)' }}>
              MSGKO.NET
            </p>
            <h2 className="text-2xl md:text-3xl font-black tracking-[0.06em] uppercase text-white"
              style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
              Knight Online Bilgi Merkezi
            </h2>
            <p className="mt-4 text-[0.85rem] leading-[1.8] text-white/40 max-w-2xl mx-auto">
              Karakter rehberlerinden boss drop listelerine, harita rehberlerinden farm rotalarına —
              Knight Online hakkında aradığın her bilgi MSGKO&apos;da.
            </p>
          </div>

          {/* ── Karakter Rehberleri ── */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[0.8rem] font-black tracking-[0.2em] uppercase text-white/60">
                KARAKTERLERİ
              </h3>
              <Link href="/rehber"
                className="text-[0.72rem] tracking-[0.1em] uppercase text-purple-400/50
                  hover:text-purple-400 transition-colors duration-200">
                Tüm Rehberler →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featuredClasses.map((cls) => (
                <Link key={cls.slug} href={`/rehber/${cls.guideSlug}`}
                  className="group p-5 border border-white/[0.06] hover:border-white/15
                    transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.015)' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl" aria-hidden="true">{cls.icon}</span>
                    <h4 className="text-[0.9rem] font-black tracking-[0.06em] uppercase text-white"
                      style={{ fontFamily: 'var(--font-rajdhani)' }}>
                      {cls.name} Rehberi
                    </h4>
                  </div>
                  <p className="text-[0.74rem] leading-[1.7] text-white/35 line-clamp-2">
                    {cls.description.substring(0, 100)}...
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Boss & Harita — 2 sütun ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

            {/* Boss'lar */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[0.8rem] font-black tracking-[0.2em] uppercase text-white/60">
                  BOSS REHBERLERİ
                </h3>
                <Link href="/boss"
                  className="text-[0.72rem] tracking-[0.1em] uppercase text-red-400/50
                    hover:text-red-400 transition-colors duration-200">
                  Tüm Boss'lar →
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {featuredBosses.map((boss) => (
                  <Link key={boss.slug} href={`/boss/${boss.slug}`}
                    className="group flex items-center justify-between p-4
                      border border-white/[0.06] hover:border-white/15 transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.015)' }}>
                    <div>
                      <p className="text-[0.82rem] font-semibold text-white/80 group-hover:text-white transition-colors">
                        {boss.name}
                      </p>
                      <p className="text-[0.68rem] text-white/30 mt-0.5">
                        {boss.map_slug?.replace(/-/g, ' ') ?? ''} · {boss.spawn_interval ?? ''}
                      </p>
                    </div>
                    <span className="text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2 py-0.5"
                      style={{ background: 'rgba(239,68,68,0.1)', color: 'rgba(239,68,68,0.7)' }}>
                      {boss.boss_type === 'world' ? 'World' : 'Dungeon'}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Haritalar */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[0.8rem] font-black tracking-[0.2em] uppercase text-white/60">
                  HARİTA REHBERLERİ
                </h3>
                <Link href="/harita"
                  className="text-[0.72rem] tracking-[0.1em] uppercase text-green-400/50
                    hover:text-green-400 transition-colors duration-200">
                  Tüm Haritalar →
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {featuredMaps.map((map) => (
                  <Link key={map.slug} href={`/harita/${map.slug}`}
                    className="group flex items-center justify-between p-4
                      border border-white/[0.06] hover:border-white/15 transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.015)' }}>
                    <div>
                      <p className="text-[0.82rem] font-semibold text-white/80 group-hover:text-white transition-colors">
                        {map.name}
                      </p>
                      <p className="text-[0.68rem] text-white/30 mt-0.5">
                        {map.min_level ? `Lv. ${map.min_level}+` : ''}
                        {map.is_war_zone ? ' · Savaş Bölgesi' : ''}
                      </p>
                    </div>
                    <span className="text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2 py-0.5"
                      style={{ background: 'rgba(16,185,129,0.1)', color: 'rgba(16,185,129,0.7)' }}>
                      {map.map_type.toUpperCase()}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* ── Hızlı Erişim Butonları ── */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {[
              { label: 'Item Veritabanı',   href: '/item',   color: 'amber' },
              { label: 'Build Rehberleri',  href: '/build',  color: 'purple' },
              { label: 'Farm Rehberleri',   href: '/farm',   color: 'green' },
              { label: 'Haberler',          href: '/haber',  color: 'pink' },
            ].map(({ label, href, color }) => (
              <Link key={href} href={href}
                className="px-5 py-2.5 text-[0.76rem] font-semibold tracking-[0.08em] uppercase
                  border transition-all duration-200"
                style={{
                  borderColor: `rgba(var(--color-${color}-500), 0.25)`,
                  color: `rgba(var(--color-${color}-300), 0.7)`,
                  background: `rgba(var(--color-${color}-500), 0.04)`,
                }}>
                {label}
              </Link>
            ))}
          </div>

          {/* ── SEO İçerik Bloğu — Google için okunabilir konu kümesi ── */}
          <div
            id="rehber-kategorileri"
            className="border-t border-white/[0.04] pt-10 mt-2"
          >
            <h2 className="text-xl font-black tracking-[0.06em] uppercase text-white mb-6 text-center"
              style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
              Knight Online Rehber ve Eğitim Sitesi
            </h2>
            <p className="text-[0.82rem] leading-[1.85] text-white/35 max-w-3xl mx-auto text-center mb-8">
              MSGKO.net, musaagll tarafından hazırlanan Türkçe Knight Online rehber platformudur.{' '}
              <Link href="/rehber/asas" className="text-blue-400/60 hover:text-blue-400 transition-colors">
                Asas
              </Link>,{' '}
              <Link href="/rehber/okcu" className="text-amber-400/60 hover:text-amber-400 transition-colors">
                Okçu
              </Link>,{' '}
              <Link href="/rehber/warrior" className="text-red-400/60 hover:text-red-400 transition-colors">
                Warrior
              </Link>,{' '}
              <Link href="/rehber/mage" className="text-purple-400/60 hover:text-purple-400 transition-colors">
                Mage
              </Link> ve{' '}
              <Link href="/rehber/priest" className="text-green-400/60 hover:text-green-400 transition-colors">
                Priest
              </Link>{' '}
              için build rehberleri, farm rotaları ve PK taktikleri video formatında sunulmaktadır.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              <article className="p-5 border border-white/[0.06]"
                style={{ background: 'rgba(255,255,255,0.012)' }}>
                <h3 className="text-[0.88rem] font-black tracking-[0.06em] uppercase text-white mb-2"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}>
                  <Link href="/rehber/asas" className="hover:text-blue-400 transition-colors">
                    Knight Online Asas Rehberi
                  </Link>
                </h3>
                <p className="text-[0.75rem] leading-[1.75] text-white/40">
                  Knight Online asas nasıl oynanır? Güncel asas build, STR/DEX stat dağılımı,
                  skill dizilimi, combo sırası ve PK taktikleri.{' '}
                  <Link href="/rehber/asas" className="text-blue-400/60 hover:text-blue-400 transition-colors">
                    Asas rehberini oku →
                  </Link>
                </p>
              </article>

              <article className="p-5 border border-white/[0.06]"
                style={{ background: 'rgba(255,255,255,0.012)' }}>
                <h3 className="text-[0.88rem] font-black tracking-[0.06em] uppercase text-white mb-2"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}>
                  <Link href="/rehber/okcu" className="hover:text-amber-400 transition-colors">
                    Knight Online Okçu Rehberi
                  </Link>
                </h3>
                <p className="text-[0.75rem] leading-[1.75] text-white/40">
                  Knight Online okçu nasıl oynanır? Archer build, DEX stat dağılımı,
                  okçu skill dizilimi ve uzun menzilli PK taktikleri.{' '}
                  <Link href="/rehber/okcu" className="text-amber-400/60 hover:text-amber-400 transition-colors">
                    Okçu rehberini oku →
                  </Link>
                </p>
              </article>

              <article className="p-5 border border-white/[0.06]"
                style={{ background: 'rgba(255,255,255,0.012)' }}>
                <h3 className="text-[0.88rem] font-black tracking-[0.06em] uppercase text-white mb-2"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}>
                  <Link href="/boss/felankor" className="hover:text-red-400 transition-colors">
                    Knight Online Felankor
                  </Link>
                </h3>
                <p className="text-[0.75rem] leading-[1.75] text-white/40">
                  Knight Online&apos;ın en güçlü{' '}
                  <Link href="/harita/ronark-land" className="text-green-400/60 hover:text-green-400 transition-colors">
                    CZ
                  </Link>{' '}
                  world boss&apos;u. Spawn zamanı, drop listesi ve öldürme taktikleri.{' '}
                  <Link href="/boss/felankor" className="text-red-400/60 hover:text-red-400 transition-colors">
                    Felankor rehberini oku →
                  </Link>
                </p>
              </article>

              <article className="p-5 border border-white/[0.06]"
                style={{ background: 'rgba(255,255,255,0.012)' }}>
                <h3 className="text-[0.88rem] font-black tracking-[0.06em] uppercase text-white mb-2"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}>
                  <Link href="/farm" className="hover:text-green-400 transition-colors">
                    Knight Online Farm Rehberi
                  </Link>
                </h3>
                <p className="text-[0.75rem] leading-[1.75] text-white/40">
                  Knight Online&apos;da en verimli exp farm rotaları, item drop bölgeleri ve
                  noah kazanma yöntemleri.{' '}
                  <Link href="/farm" className="text-green-400/60 hover:text-green-400 transition-colors">
                    Farm rehberini oku →
                  </Link>
                </p>
              </article>

              <article className="p-5 border border-white/[0.06]"
                style={{ background: 'rgba(255,255,255,0.012)' }}>
                <h3 className="text-[0.88rem] font-black tracking-[0.06em] uppercase text-white mb-2"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}>
                  <Link href="/harita/ronark-land" className="hover:text-green-400 transition-colors">
                    Knight Online Ronark Land (CZ)
                  </Link>
                </h3>
                <p className="text-[0.75rem] leading-[1.75] text-white/40">
                  Knight Online ana PvP haritası. Boss konumları, farm rotaları ve
                  CZ&apos;de hayatta kalma taktikleri.{' '}
                  <Link href="/harita/ronark-land" className="text-green-400/60 hover:text-green-400 transition-colors">
                    CZ rehberini oku →
                  </Link>
                </p>
              </article>

              <article className="p-5 border border-white/[0.06]"
                style={{ background: 'rgba(255,255,255,0.012)' }}>
                <h3 className="text-[0.88rem] font-black tracking-[0.06em] uppercase text-white mb-2"
                  style={{ fontFamily: 'var(--font-rajdhani)' }}>
                  <Link href="/item" className="hover:text-amber-400 transition-colors">
                    Knight Online Item Veritabanı
                  </Link>
                </h3>
                <p className="text-[0.75rem] leading-[1.75] text-white/40">
                  Knight Online silah, zırh ve aksesuar rehberleri. Item özellikleri,
                  nereden düştüğü ve upgrade bilgisi.{' '}
                  <Link href="/item" className="text-amber-400/60 hover:text-amber-400 transition-colors">
                    Item veritabanına git →
                  </Link>
                </p>
              </article>

            </div>
          </div>

        </div>
      </section>
    </main>
  )
}
