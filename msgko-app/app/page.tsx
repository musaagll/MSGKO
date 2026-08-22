import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { YoutubeVideoSection } from '@/components/sections/YoutubeVideoSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { ReklamSection } from '@/components/sections/ReklamSection'
import { AdSense } from '@/components/ui/AdSense'
import { getYoutubeVideos } from '@/lib/youtube'
import type { YTVideo } from '@/lib/youtube'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'MSGKO.net — Knight Online Rehber ve Eğitim Sitesi',
  description:
    'MSGKO.net — Knight Online rehber ve eğitim sitesi. Asas build, okçu combo, farm rotaları, PK taktikleri, warrior, mage ve priest rehberleri. musaagll tarafından hazırlanmış güncel içerikler.',
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

  return (
    <main>
      <HeroSection />
      <YoutubeVideoSection videos={videos} />
      {/* Video bölümü ile features arasında reklam */}
      <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 py-4">
        <AdSense slot="8727584512" />
      </div>
      <FeaturesSection />
      <ReklamSection />

      {/* ── SEO İçerik Bölümü — Google için okunabilir konu kümesi ── */}
      <section
        className="relative py-16 px-6 sm:px-8"
        style={{ background: '#07070B', borderTop: '1px solid rgba(255,255,255,0.04)' }}
        aria-label="Knight Online rehber kategorileri"
      >
        <div className="relative max-w-[1280px] mx-auto">
          <div className="text-center mb-10">
            <p className="text-[0.68rem] font-bold tracking-[0.28em] uppercase mb-2"
              style={{ color: 'rgba(139,92,246,0.7)' }}>
              MSGKO.NET
            </p>
            <h2 className="text-2xl md:text-3xl font-black tracking-[0.06em] uppercase text-white"
              style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
              Knight Online Rehber ve Eğitim Sitesi
            </h2>
            <p className="mt-4 text-[0.85rem] leading-[1.8] text-white/40 max-w-2xl mx-auto">
              MSGKO.net, musaagll tarafından hazırlanan Türkçe Knight Online rehber sitesidir.
              Asas, okçu, warrior, mage ve priest için build rehberleri, farm rotaları,
              PK taktikleri ve güncel meta analizleri video formatında paylaşılmaktadır.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <article className="p-6 border border-white/[0.06] bg-white/[0.015]">
              <h3 className="text-[0.9rem] font-black tracking-[0.06em] uppercase text-white mb-3"
                style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                Knight Online Asas Rehberi
              </h3>
              <p className="text-[0.77rem] leading-[1.75] text-white/45">
                Knight Online asas nasıl oynanır? Güncel asas build, STR/DEX stat dağılımı,
                skill dizilimi, combo sırası ve asas PK taktikleri. Rogue sınıfı için
                item önerileri ve farm rotaları MSGKO&apos;da video olarak mevcut.
              </p>
            </article>

            <article className="p-6 border border-white/[0.06] bg-white/[0.015]">
              <h3 className="text-[0.9rem] font-black tracking-[0.06em] uppercase text-white mb-3"
                style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                Knight Online Okçu Rehberi
              </h3>
              <p className="text-[0.77rem] leading-[1.75] text-white/45">
                Knight Online okçu nasıl oynanır? Archer build, DEX stat dağılımı,
                okçu skill dizilimi ve uzun menzilli PK taktikleri. Okçu farm rotaları
                ve item rehberleri güncel meta ile MSGKO&apos;da paylaşılmaktadır.
              </p>
            </article>

            <article className="p-6 border border-white/[0.06] bg-white/[0.015]">
              <h3 className="text-[0.9rem] font-black tracking-[0.06em] uppercase text-white mb-3"
                style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                Knight Online Farm Rehberi
              </h3>
              <p className="text-[0.77rem] leading-[1.75] text-white/45">
                Knight Online&apos;da nasıl para kasılır ve level nasıl alınır?
                En verimli exp farm rotaları, item drop bölgeleri, noah kazanma yöntemleri
                ve WS taktikleri MSGKO video rehberlerinde detaylı anlatılmaktadır.
              </p>
            </article>

            <article className="p-6 border border-white/[0.06] bg-white/[0.015]">
              <h3 className="text-[0.9rem] font-black tracking-[0.06em] uppercase text-white mb-3"
                style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                Knight Online PK Taktikleri
              </h3>
              <p className="text-[0.77rem] leading-[1.75] text-white/45">
                Knight Online PvP nasıl yapılır? Sınıfa özel combo sırası, map bilgisi,
                item kullanımı ve PK psikolojisi. Asas ve okçu için ayrı PK rehberleri
                MSGKO&apos;da video formatında sunulmaktadır.
              </p>
            </article>

            <article className="p-6 border border-white/[0.06] bg-white/[0.015]">
              <h3 className="text-[0.9rem] font-black tracking-[0.06em] uppercase text-white mb-3"
                style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                Knight Online Warrior &amp; Mage Rehberi
              </h3>
              <p className="text-[0.77rem] leading-[1.75] text-white/45">
                Knight Online warrior build, tank ve DPS oynanışı. Mage için INT build,
                AOE ve single target taktikleri. Her iki sınıf için stat dağılımı
                ve skill rehberleri MSGKO&apos;da yakında yayınlanacak.
              </p>
            </article>

            <article className="p-6 border border-white/[0.06] bg-white/[0.015]">
              <h3 className="text-[0.9rem] font-black tracking-[0.06em] uppercase text-white mb-3"
                style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                Knight Online Priest Rehberi
              </h3>
              <p className="text-[0.77rem] leading-[1.75] text-white/45">
                Knight Online priest nasıl oynanır? Heal priest ve attack priest
                build seçenekleri, HP yönetimi, skill dizilimi ve destek taktikleri.
                Güncel priest rehberleri MSGKO&apos;da yakında yayınlanacak.
              </p>
            </article>

          </div>
        </div>
      </section>
    </main>
  )
}
