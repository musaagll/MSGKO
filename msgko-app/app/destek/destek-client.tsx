import { ArrowUpRight, HandHeart, ShieldCheck } from 'lucide-react'
import { SUPPORT_PLATFORMS } from '@/lib/site'

const ACCENT: Record<string, string> = {
  kopazar: '#f59e0b',
  bynogame: '#8b5cf6',
  knightpin: '#ec4899',
}

/** Destek platformları (server component — istemci JS'i yok) */
export function DestekClient() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-pink-400/25 bg-pink-500/10 text-pink-300">
          <HandHeart size={26} aria-hidden="true" />
        </span>
        <h2 className="display-md mt-5">Desteklemek İçin</h2>
        <p className="mx-auto mt-3 max-w-md text-fg-3">
          İçeriklerimizi beğendiysen aşağıdaki platformlardan destek olabilirsin. Her destek yeni videolar için büyük motivasyon.
        </p>
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {SUPPORT_PLATFORMS.map((p) => {
          const accent = ACCENT[p.id] ?? '#ab91f7'
          return (
            <li key={p.id}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group card card-interactive flex h-full flex-col items-center gap-4 px-6 py-8 text-center"
              >
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 items-center justify-center rounded-2xl font-display text-2xl font-bold"
                  style={{ color: accent, background: `${accent}1a`, border: `1px solid ${accent}40` }}
                >
                  {p.name.charAt(0)}
                </span>
                <span className="text-lg font-bold text-fg">{p.name}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold transition-colors" style={{ color: accent }}>
                  Destek ol
                  <ArrowUpRight size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </a>
            </li>
          )
        })}
      </ul>

      <p className="mt-8 flex items-center justify-center gap-2 text-sm text-fg-4">
        <ShieldCheck size={16} aria-hidden="true" />
        Tüm platformlar güvenli ödeme altyapısı kullanmaktadır.
      </p>
    </div>
  )
}
