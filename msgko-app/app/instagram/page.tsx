import type { Metadata } from 'next'
import { ArrowUpRight } from 'lucide-react'
import { InstagramPage } from './instagram-page'
import { PageHero } from '@/components/ui/PageHero'
import { InstagramIcon } from '@/components/ui/BrandIcons'
import { REEL_IDS } from '@/lib/instagram'
import { SITE_URL, SOCIAL } from '@/lib/site'
import { BASE_OPEN_GRAPH } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Instagram — MSGKO Knight Online',
  description: 'MSGKO Instagram reels. Knight Online asas ve okçu kısa videoları. @msgclip hesabını takip et.',
  alternates: { canonical: `${SITE_URL}/instagram` },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    title: 'Instagram — MSGKO Knight Online',
    description: 'Knight Online kısa videoları ve reels. @msgclip',
    url: `${SITE_URL}/instagram`,
  },
}

export default function Page() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Instagram', href: '/instagram' }]}
        eyebrow={<span lang="en">@msgclip</span>}
        title="Instagram"
        description={
          <p>
            Knight Online asas ve okçu kısa videoları, PK anları ve oyun içi klipler. {REEL_IDS.length} reel burada;
            yenileri için @msgclip hesabını takip et.
          </p>
        }
      >
        <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          <InstagramIcon size={18} />
          Instagram&apos;da Takip Et
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </PageHero>

      <section aria-label="Reels" className="container-site py-10 sm:py-14">
        <InstagramPage reelIds={REEL_IDS} />
      </section>
    </>
  )
}
