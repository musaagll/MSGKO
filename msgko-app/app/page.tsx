import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { YoutubeVideoSection } from '@/components/sections/YoutubeVideoSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { getYoutubeVideos } from '@/lib/youtube'
import type { YTVideo } from '@/lib/youtube'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'MSGKO - Knight Online Gelişim & Strateji Rehberi',
  description:
    'Karakter gelişiminden farm, WS, PK stratejilerine; meta analizlerinden profesyonel eğitimlere kadar kapsamlı içerik deneyimi burada seni bekliyor. Knight Online\'a dair her şey burada.',
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
      <FeaturesSection />

      {/* ── SEO İçerik Bölümü ── */}
      <section
        className="relative py-16 px-6 sm:px-8 overflow-hidden"
        style={{ background: '#07070B', borderTop: '1px solid rgba(255,255,255,0.04)' }}
        aria-label="Knight Online rehber kategorileri"
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(109,40,217,0.05) 0%, transparent 60%)' }}
        />

        <div className="relative max-w-[1280px] mx-auto">

          {/* Başlık */}
          <div className="text-center mb-12">
            <p className="text-[0.68rem] font-bold tracking-[0.28em] uppercase mb-2"
              style={{ color: 'rgba(139,92,246,0.7)' }}>
              Rehber Kategorileri
            </p>
            <h2 className="text-2xl md:text-3xl font-black tracking-[0.06em] uppercase text-white"
              style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
              Knight Online Tüm Rehberler
            </h2>
          </div>

          {/* Kategori grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">

            {/* Asas Rehberi */}
            <article
              className="p-6 border border-white/[0.07] bg-white/[0.02]"
              aria-label="Asas rehberi"
            >
              <h3 className="text-[1rem] font-black tracking-[0.08em] uppercase text-white mb-3"
                style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                Knight Online Asas Rehberi
              </h3>
              <p className="text-[0.78rem] leading-[1.75] text-white/50 mb-4">
                Knight Online asas nasıl oynanır? Güncel asas build, asas stat dağılımı,
                asas skill dizilimi ve asas combo rehberleri burada. Asas PK taktikleri
                ve item önerileri ile rakiplerinizi geride bırakın.
              </p>
              <ul className="flex flex-wrap gap-2">
                {['Asas Build', 'Asas Combo', 'Asas Skill', 'Asas PK', 'Asas Farm'].map((tag) => (
                  <li key={tag}
                    className="text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2 py-1"
                    style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: 'rgba(167,139,250,0.8)' }}>
                    {tag}
                  </li>
                ))}
              </ul>
            </article>

            {/* Okçu Rehberi */}
            <article
              className="p-6 border border-white/[0.07] bg-white/[0.02]"
              aria-label="Okçu rehberi"
            >
              <h3 className="text-[1rem] font-black tracking-[0.08em] uppercase text-white mb-3"
                style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                Knight Online Okçu Rehberi
              </h3>
              <p className="text-[0.78rem] leading-[1.75] text-white/50 mb-4">
                Knight Online okçu eğitimi, okçu build ve okçu skill dizilimi rehberleri.
                Uzun menzilli PK taktikleri, okçu stat dağılımı ve okçu item önerileri
                ile arenada üstünlük kurun.
              </p>
              <ul className="flex flex-wrap gap-2">
                {['Okçu Build', 'Okçu Combo', 'Okçu Skill', 'Okçu PK', 'Okçu Farm'].map((tag) => (
                  <li key={tag}
                    className="text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2 py-1"
                    style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: 'rgba(147,197,253,0.8)' }}>
                    {tag}
                  </li>
                ))}
              </ul>
            </article>

            {/* Farm Rehberi */}
            <article
              className="p-6 border border-white/[0.07] bg-white/[0.02]"
              aria-label="Farm rehberi"
            >
              <h3 className="text-[1rem] font-black tracking-[0.08em] uppercase text-white mb-3"
                style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                Knight Online Farm Rehberi
              </h3>
              <p className="text-[0.78rem] leading-[1.75] text-white/50 mb-4">
                Knight Online exp farm rotaları, item farm bölgeleri ve noah kazanma
                yöntemleri. Guardian of 7 Keys anahtar görevi, WS taktikleri ve
                güncel farm meta rehberleri.
              </p>
              <ul className="flex flex-wrap gap-2">
                {['Exp Farm', 'Item Farm', 'WS Taktik', 'Anahtar Görevi'].map((tag) => (
                  <li key={tag}
                    className="text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2 py-1"
                    style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: 'rgba(252,211,77,0.8)' }}>
                    {tag}
                  </li>
                ))}
              </ul>
            </article>

            {/* Warrior Rehberi */}
            <article
              className="p-6 border border-white/[0.07] bg-white/[0.02]"
              aria-label="Warrior rehberi"
            >
              <h3 className="text-[1rem] font-black tracking-[0.08em] uppercase text-white mb-3"
                style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                Knight Online Warrior Rehberi
              </h3>
              <p className="text-[0.78rem] leading-[1.75] text-white/50 mb-4">
                Knight Online warrior build, stat dağılımı ve PK taktikleri.
                Tank ve DPS warrior oynanışları, skill dizilimi ve item rehberleri
                yakında yayında.
              </p>
              <ul className="flex flex-wrap gap-2">
                {['Warrior Build', 'Warrior Stat', 'Warrior PK', 'Tank Build'].map((tag) => (
                  <li key={tag}
                    className="text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2 py-1"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(252,165,165,0.8)' }}>
                    {tag}
                  </li>
                ))}
              </ul>
            </article>

            {/* Mage Rehberi */}
            <article
              className="p-6 border border-white/[0.07] bg-white/[0.02]"
              aria-label="Mage rehberi"
            >
              <h3 className="text-[1rem] font-black tracking-[0.08em] uppercase text-white mb-3"
                style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                Knight Online Mage Rehberi
              </h3>
              <p className="text-[0.78rem] leading-[1.75] text-white/50 mb-4">
                Knight Online mage build, INT stat dağılımı ve PK taktikleri.
                AOE ve single target mage oynanışları, skill dizilimi ve item
                rehberleri yakında yayında.
              </p>
              <ul className="flex flex-wrap gap-2">
                {['Mage Build', 'Mage Stat', 'Mage PK', 'AOE Mage'].map((tag) => (
                  <li key={tag}
                    className="text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2 py-1"
                    style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: 'rgba(165,180,252,0.8)' }}>
                    {tag}
                  </li>
                ))}
              </ul>
            </article>

            {/* Priest Rehberi */}
            <article
              className="p-6 border border-white/[0.07] bg-white/[0.02]"
              aria-label="Priest rehberi"
            >
              <h3 className="text-[1rem] font-black tracking-[0.08em] uppercase text-white mb-3"
                style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                Knight Online Priest Rehberi
              </h3>
              <p className="text-[0.78rem] leading-[1.75] text-white/50 mb-4">
                Knight Online priest build, HP ve MP yönetimi, heal build ve
                attack priest oynanışları. Skill dizilimi, stat dağılımı ve
                item rehberleri yakında yayında.
              </p>
              <ul className="flex flex-wrap gap-2">
                {['Priest Build', 'Heal Priest', 'Attack Priest', 'Priest Stat'].map((tag) => (
                  <li key={tag}
                    className="text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2 py-1"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: 'rgba(134,239,172,0.8)' }}>
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          </div>

          {/* Alt açıklama — Featured Snippet hedef */}
          <div className="max-w-3xl mx-auto">
            {/* Üst accent çizgisi */}
            <div className="w-16 h-px mx-auto mb-10"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(236,72,153,0.5), transparent)' }}
            />

            {/* Başlık */}
            <div className="text-center mb-8">
              <p className="text-[0.62rem] font-bold tracking-[0.32em] uppercase mb-3"
                style={{ color: 'rgba(139,92,246,0.65)' }}>
                MSGKO.NET
              </p>
              <h2 className="text-2xl md:text-3xl font-black tracking-[0.1em] uppercase text-white"
                style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}>
                Hedefimiz Nedir?
              </h2>
            </div>

            {/* İçerik kutusu */}
            <div className="relative p-8 md:p-10"
              style={{
                background: 'rgba(255,255,255,0.018)',
                border: '1px solid rgba(139,92,246,0.15)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
              }}>
              {/* Sol accent çizgisi */}
              <div className="absolute left-0 top-6 bottom-6 w-[2px]"
                style={{ background: 'linear-gradient(180deg, transparent, rgba(139,92,246,0.6), rgba(236,72,153,0.4), transparent)' }}
              />
              {/* Köşe detayı */}
              <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none"
                style={{ borderTop: '1px solid rgba(139,92,246,0.4)', borderLeft: '1px solid rgba(139,92,246,0.4)' }}
              />
              <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none"
                style={{ borderBottom: '1px solid rgba(236,72,153,0.3)', borderRight: '1px solid rgba(236,72,153,0.3)' }}
              />

              <p className="text-[0.88rem] md:text-[0.92rem] leading-[2] text-white/55 mb-6">
                MSGKO.NET&apos;in hedefi, Knight Online oyuncularına yalnızca bilgi sunmak değil,
                oyuna bakış açılarını geliştirmektir. Tecrübenin paylaşıldıkça değer kazandığına inanıyor;
                PvP&apos;den farm stratejilerine, karakter gelişiminden oyun metalarına kadar her konuda
                oyuncuların yanında yer alıyoruz.
              </p>

              <p className="text-[0.88rem] md:text-[0.92rem] leading-[2] text-white/55">
                Amacımız, Türk Knight Online topluluğunun en güvenilir bilgi merkezi olmak ve
                her oyuncunun oyun içerisinde bir adım daha ileriye ulaşmasına katkı sağlamaktır.
              </p>

              {/* Alt imza */}
              <div className="mt-8 pt-6 flex items-center gap-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-6 h-6 flex-shrink-0">
                  <img src="/logo.png" alt="MSGKO" className="w-full h-full object-contain"
                    style={{ mixBlendMode: 'screen', filter: 'brightness(1.4)' }} />
                </div>
                <div className="h-px flex-1"
                  style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.3), transparent)' }}
                />
                <span className="text-[0.62rem] font-bold tracking-[0.22em] uppercase"
                  style={{ color: 'rgba(139,92,246,0.5)' }}>
                  msgko.net — musaagll
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}
