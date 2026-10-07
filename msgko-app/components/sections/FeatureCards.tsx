import { BookOpenText, Flame, Gem, Swords } from 'lucide-react'

const FEATURES = [
  { Icon: Flame, title: 'Güncel İçerik', text: 'Güncel meta, sunucu dengeleri ve oyun içi değişikliklere göre hazırlanan rehberler ve videolar.' },
  { Icon: BookOpenText, title: 'Detaylı Anlatım', text: 'Skill ağaçları, stat dağılımları ve Master gereksinimleri tablolarla, adım adım.' },
  { Icon: Swords, title: 'Profesyonel Taktikler', text: 'PK, boss ve farm taktikleri; gerçek oyun deneyimine dayanan ipuçları.' },
  { Icon: Gem, title: 'Kaliteli İçerik', text: 'Hızlı, okunaklı ve derli toplu; aradığın bilgiye birkaç saniyede ulaş.' },
]

/** Doküman: 4 bilgi bloğu — ikon + metin, eşit aralık */
export function FeatureCards() {
  return (
    <section aria-label="Neden MSGKO" className="section pt-0">
      <div className="container-site">
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/7 bg-white/7 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ Icon, title, text }) => (
            <li key={title} className="bg-ink-950 p-6 sm:p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-amethyst-400/25 bg-amethyst-500/10 text-amethyst-200">
                <Icon size={20} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg-3">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
