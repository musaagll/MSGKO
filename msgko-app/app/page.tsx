import { HeroSection } from '@/components/sections/HeroSection'
import { YoutubeVideoSection } from '@/components/sections/YoutubeVideoSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { getYoutubeVideos } from '@/lib/youtube'
import type { YTVideo } from '@/lib/youtube'

export const revalidate = 3600 // Her 1 saatte bir yenile

export default async function HomePage() {
  let videos: YTVideo[] = []
  try {
    videos = await getYoutubeVideos(4)
  } catch {
    // YouTube API hatası durumunda boş liste ile devam et
    videos = []
  }

  return (
    <main>
      <HeroSection />
      <YoutubeVideoSection videos={videos} />
      <FeaturesSection />

      {/* SEO içerik bloğu — görsel olarak gizli, Google tarafından okunur */}
      <section aria-label="Site hakkında" className="sr-only">
        <h1>MSGKO — Knight Online Asas ve Okçu Eğitim Rehberi</h1>
        <p>
          MSGKO (msgko.net), Knight Online oyununda asas ve okçu karakterlerini geliştirmek
          isteyen oyuncular için Türkiye&apos;nin en kapsamlı eğitim platformudur.
          musaagll tarafından hazırlanan içerikler; asas build, asas combo, asas skill dizilimi,
          asas PK taktikleri, asas teknikleri, asas nasıl oynanır gibi konuları kapsamaktadır.
        </p>
        <p>
          Okçu eğitim videoları, okçu build rehberi, okçu skill dizilimi ve okçu PK taktikleri
          de sitede bulunmaktadır. Ayrıca Knight Online farm rehberi, exp farm rotaları,
          WS taktikleri ve Guardian of 7 Keys anahtar görevi gibi konularda da içerik mevcuttur.
        </p>
        <p>
          Arama terimleri: knight online eğitim, knight online asas, asas rehber, asas combo,
          asas build, asas skill dizilimi, asas taktikleri, asas teknikleri, knight online okçu,
          okçu eğitim, knight online farm, knight online msg, msgko, musaagll, knight online mmorpg,
          knight online rehber, knight online Türkçe eğitim.
        </p>
      </section>
    </main>
  )
}
