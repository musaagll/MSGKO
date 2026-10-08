import { ClassCard } from '@/components/cards/ClassCard'
import { SectionAction, SectionHeading } from '@/components/ui/SectionHeading'
import { KO_CLASSES } from '@/lib/ko-data/classes'

/** Ana sayfa: sınıf rehberleri — masaüstünde 3'lü ızgara, son satır ortalanır */
export function ClassGuideSection() {
  return (
    <section aria-labelledby="sinif-rehberleri" className="section band-raised">
      <div className="container-site">
        <SectionHeading
          id="sinif-rehberleri"
          eyebrow="Sınıf Rehberleri"
          title="Sınıfını seç"
          description="Skill ağaçları, stat dağılımı, Master açma ve ipuçları — beş sınıfın tamamı için tek yerde."
        />
        <ul className="flex flex-wrap justify-center gap-6">
          {KO_CLASSES.map((cls) => (
            <li key={cls.slug} className="reveal w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc((100%-3rem)/3)]">
              <ClassCard cls={cls} />
            </li>
          ))}
        </ul>
        <SectionAction label="Tüm Rehberler" href="/rehber" />
      </div>
    </section>
  )
}
