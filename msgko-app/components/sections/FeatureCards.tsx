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
    <section aria-label="Neden MSGKO" className="section">
      <div className="container-site">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ Icon, title, text }) => (
            <li key={title} className="reveal card p-7">
              <span className="icon-tile">
                <Icon size={20} aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-lg font-bold tracking-tight">{title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg-3">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
