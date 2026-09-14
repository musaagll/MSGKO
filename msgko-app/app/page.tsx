import type { Metadata } from 'next'
import Link from 'next/link'
import { HeroSection } from '@/components/sections/HeroSection'
import { YoutubeVideoSection } from '@/components/sections/YoutubeVideoSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { ReklamSection } from '@/components/sections/ReklamSection'
import { GbKuruSection } from '@/components/sections/GbKuruSection'
import { EtkinlikSection } from '@/components/sections/EtkinlikSection'
import { AdSense } from '@/components/ui/AdSense'
import { getYoutubeVideos } from '@/lib/youtube'
import type { YTVideo } from '@/lib/youtube'

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

  return (
    <main>
      <GbKuruSection />
      <HeroSection />
      <YoutubeVideoSection videos={videos} />

      {/* Reklam */}
      <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 py-4">
        <AdSense slot="8727584512" />
      </div>

      <FeaturesSection />
      <EtkinlikSection />
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

        </div>
      </section>
    </main>
  )
}
