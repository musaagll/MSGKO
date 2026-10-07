import { ClassCard } from '@/components/cards/ClassCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { KO_CLASSES } from '@/lib/ko-data/classes'

/** Ana sayfa: karakter seçme ekranı tarzı sınıf vitrini (mobilde kaydırmalı şerit) */
export function ClassGuideSection() {
  return (
    <section aria-labelledby="sinif-rehberleri" className="section">
      <div className="container-site">
        <SectionHeading
          id="sinif-rehberleri"
          eyebrow="Sınıf Rehberleri"
          title="Sınıfını seç"
          description="Skill ağaçları, stat dağılımı, Master açma ve ipuçları — beş sınıfın tamamı için tek yerde."
          action={{ label: 'Tüm rehberler', href: '/rehber' }}
        />
        <ul className="scroller -mx-5 scroll-px-5 px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0">
          {KO_CLASSES.map((cls) => (
            <li key={cls.slug} className="w-[72vw] max-w-68 sm:w-[42vw] lg:w-auto lg:max-w-none">
              <ClassCard cls={cls} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
