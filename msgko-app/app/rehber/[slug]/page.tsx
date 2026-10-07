import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHero } from '@/components/ui/PageHero'
import { FaqList } from '@/components/ui/FaqList'
import { FactList } from '@/components/ui/FactList'
import { ArticleLayout, ContentSection, RelatedLinks, SideCard, TableOfContents } from '@/components/content/ArticleLayout'
import { KO_CLASSES, getAllClassSlugs, getClassBySlug } from '@/lib/ko-data/classes'
import { CLASS_META } from '@/lib/class-meta'
import {
  buildGuideMetadata,
  buildGuideBreadcrumbs,
  buildBreadcrumbSchema,
  buildArticleSchema,
  buildFAQSchema,
  buildClassFAQs,
} from '@/lib/seo'

export async function generateStaticParams() {
  return getAllClassSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cls = getClassBySlug(slug)
  if (!cls) return {}
  return buildGuideMetadata(cls)
}

const HIGH_SKILL_LEVELS = ['70', '72', '74', '75', '76', '78', '80'] as const

export default async function RehberDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cls = getClassBySlug(slug)
  if (!cls) notFound()

  const meta = CLASS_META[cls.slug]
  const breadcrumbs = buildGuideBreadcrumbs(cls)
  const faqs = buildClassFAQs(cls)
  const nameLang = cls.name === cls.nameEn ? 'en' : undefined

  const schemas = [
    buildBreadcrumbSchema(breadcrumbs),
    buildArticleSchema({
      title: `Knight Online ${cls.name} Rehberi`,
      description: cls.description,
      url: `/rehber/${cls.guideSlug}`,
      updatedAt: new Date().toISOString(),
    }),
    buildFAQSchema(faqs),
  ]

  const relatedClasses = KO_CLASSES.filter((c) => c.slug !== cls.slug)
  const high = cls.highSkillRequirements
  const highValues = [high.level70, high.level72, high.level74, high.level75, high.level76, high.level78, high.level80]

  const toc = [
    { id: 'genel-bilgi', label: `${cls.name} Hakkında` },
    ...(cls.statBuilds.length > 0 ? [{ id: 'stat-dagilimi', label: 'Stat ve Build Dağılımı' }] : []),
    ...(cls.skillTrees.length > 0 ? [{ id: 'skill-agaclari', label: 'Skill Ağaçları' }] : []),
    { id: 'master-acma', label: 'Master Açma' },
    { id: 'ileri-skill', label: 'İleri Seviye Skill' },
    ...(cls.tips.length > 0 ? [{ id: 'ipuclari', label: 'İpuçları' }] : []),
    { id: 'sss', label: 'Sık Sorulan Sorular' },
  ]

  return (
    <>
      <JsonLd data={schemas} />

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow="Karakter Rehberi"
        accent={cls.color}
        art={{ src: meta.art, position: meta.focus }}
        title={
          <>
            <span lang="en">Knight Online</span> <span lang={nameLang}>{cls.name}</span> Rehberi
          </>
        }
        description={<p>{cls.description}</p>}
      >
        <ul className="flex flex-wrap gap-2">
          <li className="chip border" style={{ color: cls.color, borderColor: `${cls.color}55`, background: `${cls.color}14` }}>{meta.role}</li>
          <li className="chip">Ana stat: {cls.primaryStat}</li>
          <li className="chip">Human: {cls.masterTitle.human}</li>
          <li className="chip">Karus: {cls.masterTitle.karus}</li>
        </ul>
      </PageHero>

      <ArticleLayout
        aside={
          <>
            <SideCard title="Bu sayfada">
              <TableOfContents items={toc} />
            </SideCard>
            <SideCard title="Hızlı Bilgi">
              <FactList
                facts={[
                  { label: 'Birincil Stat', value: cls.primaryStat },
                  { label: 'Master (Human)', value: cls.masterTitle.human },
                  { label: 'Master (Karus)', value: cls.masterTitle.karus },
                  { label: 'Master NPC', value: <span className="font-normal text-fg-2">{cls.masterNPC}</span> },
                ]}
              />
            </SideCard>
            <SideCard title="Irklar">
              <ul className="flex flex-wrap gap-1.5">
                {cls.races.map((r) => <li key={r} className="chip">{r}</li>)}
              </ul>
            </SideCard>
            <SideCard title="Diğer Rehberler">
              <RelatedLinks
                links={relatedClasses.map((c) => ({ label: `${c.name} Rehberi`, href: `/rehber/${c.guideSlug}` }))}
                all={{ label: 'Tüm Rehberler', href: '/rehber' }}
              />
            </SideCard>
          </>
        }
      >
        {/* Genel Bilgi */}
        <ContentSection id="genel-bilgi" title={`${cls.name} Hakkında`}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Birincil Stat', value: cls.primaryStat },
              { label: 'Master NPC', value: cls.masterNPC.split(' — ')[0] },
              { label: 'Human Unvanı', value: cls.masterTitle.human },
              { label: 'Karus Unvanı', value: cls.masterTitle.karus },
            ].map((f) => (
              <div key={f.label} className="card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-4">{f.label}</p>
                <p className="mt-1.5 font-semibold text-fg">{f.value}</p>
              </div>
            ))}
          </div>
          <div className="card mt-3 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-fg-4">Irk Seçenekleri</p>
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {cls.races.map((r) => <li key={r} className="chip">{r}</li>)}
            </ul>
          </div>
        </ContentSection>

        {/* Stat Dağılımı — sadece korehberi.com'dan gelen verisi olan sınıflar */}
        {cls.statBuilds.length > 0 && (
          <ContentSection id="stat-dagilimi" title={`${cls.name} Stat ve Build Dağılımı`}>
            <p className="mb-4 text-fg-3">
              Aşağıdaki dağılımlar yalnızca öneri niteliği taşımaktadır. Farklı build&#39;lere göre farklı dağılımlar gerçekleştirilebilir.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {cls.statBuilds.map((build) => (
                <div key={build.name} className="card relative overflow-hidden p-5">
                  <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1" style={{ background: cls.color }} />
                  <h3 className="text-lg font-bold">{build.name}</h3>
                  <p className="mt-2 font-semibold" style={{ color: cls.color }}>{build.distribution}</p>
                </div>
              ))}
            </div>
          </ContentSection>
        )}

        {/* Skill Ağaçları */}
        {cls.skillTrees.length > 0 && (
          <ContentSection id="skill-agaclari" title={`${cls.name} Skill'leri`}>
            <div className="space-y-3">
              {cls.skillTrees.map((tree, ti) => (
                <details key={tree.name} open={ti === 0} className="card group overflow-hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-white/3 [&::-webkit-details-marker]:hidden">
                    <h3 className="text-base font-bold">
                      {tree.name} <span className="ml-1 text-sm font-medium text-fg-4">({tree.skills.length} skill)</span>
                    </h3>
                    <span aria-hidden="true" className="text-xl leading-none text-amethyst-300 transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <div className="overflow-x-auto border-t border-white/6">
                    <table className="table-ko table-stack min-w-136">
                      <thead>
                        <tr>
                          <th scope="col" className="w-20">Seviye</th>
                          <th scope="col" className="w-48">Skill Adı</th>
                          <th scope="col">Açıklama</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tree.skills.map((skill, i) => (
                          <tr key={i}>
                            <td data-label="Lv." className="tabular-nums text-fg-3">{skill.level === 0 ? "—" : `${skill.level}`}</td>
                            <td data-primary className="font-semibold text-fg">{skill.name}</td>
                            <td data-full>{skill.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              ))}
            </div>
          </ContentSection>
        )}

        {/* Master Açma */}
        <ContentSection id="master-acma" title={`${cls.name} Master Nasıl Açılır?`}>
          <div className="card p-5 sm:p-6">
            <p className="font-semibold text-fg">Gerekli eşyalar (3 adet):</p>
            <ol className="mt-4 space-y-3">
              {cls.masterRequirements.items.map((item, i) => (
                <li key={i} className="flex gap-3 text-fg-2">
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={{ color: cls.color, background: `${cls.color}1f` }}
                  >
                    {i + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
            <div className="mt-5 space-y-1.5 border-t border-white/7 pt-5">
              <p className="text-fg-2"><span className="font-semibold text-fg">NPC:</span> {cls.masterRequirements.npcLocation}</p>
              <p className="text-sm text-fg-3">{cls.masterRequirements.notes}</p>
            </div>
          </div>
        </ContentSection>

        {/* Spell Stone Powder Tablosu */}
        <ContentSection id="ileri-skill" title={`${cls.name} İleri Seviye Skill'lerini Açma`}>
          <p className="mb-4 text-fg-3">
            21 Şubat 2019 güncellemesiyle birlikte tüm sınıflar için skill açma gereksinimleri basitleştirildi.
            Yüksek seviye skill&#39;ler için <strong className="text-fg-2">Spell Stone Powder</strong> gerekmektedir.
          </p>
          <div className="card overflow-x-auto">
            <table className="table-ko min-w-136 text-center">
              <thead>
                <tr>
                  {HIGH_SKILL_LEVELS.map((lvl) => (
                    <th key={lvl} scope="col" className="text-center">Lv. {lvl}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {highValues.map((val, i) => (
                    <td key={i} className="text-center font-semibold tabular-nums text-fg">{val ? `${val}x` : '—'}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-sm text-fg-4">Spell Stone Powder miktarları</p>
        </ContentSection>

        {/* İpuçları */}
        {cls.tips.length > 0 && (
          <ContentSection id="ipuclari" title={`${cls.name} İpuçları`}>
            <ol className="space-y-3">
              {cls.tips.map((tip, i) => (
                <li key={i} className="card flex gap-4 p-4 sm:p-5">
                  <span aria-hidden="true" className="font-display text-lg font-bold leading-6 text-amethyst-300">{i + 1}</span>
                  <p className="leading-relaxed text-fg-2">{tip}</p>
                </li>
              ))}
            </ol>
          </ContentSection>
        )}

        {/* SSS */}
        <ContentSection id="sss" title="Sık Sorulan Sorular">
          <FaqList faqs={faqs} />
        </ContentSection>

        <div className="card flex items-center gap-4 p-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-ink-800">
            <Image src={meta.weapon} alt="" width={40} height={40} className="h-10 w-10 object-contain" />
          </span>
          <p className="text-sm text-fg-3">
            Oyun güncellemeleriyle değerler değişebilir. Hatalı ya da eskimiş bir bilgi gördüysen{' '}
            <Link href="/iletisim" className="font-semibold text-amethyst-300 hover:text-amethyst-200">bize bildir</Link>.
          </p>
        </div>
      </ArticleLayout>
    </>
  )
}
