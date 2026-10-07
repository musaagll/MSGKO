'use client'

import { useState } from 'react'
import { Play, X } from 'lucide-react'
import { useModal } from '@/hooks/useModal'

const PAGE = 12

/**
 * Reel ızgarası. Her Instagram gömmesi kendi script'lerini yüklediği için
 * önizlemeler 12'şerli sayfalarla açılır; oynatma büyük pencerede yapılır.
 */
export function InstagramPage({ reelIds }: { reelIds: string[] }) {
  const [visible, setVisible] = useState(PAGE)
  const [active, setActive] = useState<string | null>(null)

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {reelIds.slice(0, visible).map((id, i) => (
          <li key={id} className="group card card-interactive relative aspect-4/5 overflow-hidden bg-black">
            {/* Önizleme: Instagram gömmesinin üst ve alt çubukları kırpılır */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-14 -bottom-48">
              <iframe
                src={`https://www.instagram.com/reel/${id}/embed/`}
                title={`Instagram reel ${i + 1} önizleme`}
                loading="lazy"
                tabIndex={-1}
                className="h-full w-full border-0"
              />
            </div>
            {/* Tıklama katmanı önizlemenin üstünde */}
            <button
              type="button"
              onClick={() => setActive(id)}
              aria-label={`Reel ${i + 1} oynat`}
              className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 hover:bg-black/30"
            >
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-ink-950 opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100"
              >
                <Play size={20} className="ml-0.5 fill-current" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {visible < reelIds.length && (
        <div className="mt-8 flex justify-center">
          <button type="button" onClick={() => setVisible((v) => v + PAGE)} className="btn btn-secondary">
            Daha fazla göster ({reelIds.length - visible})
          </button>
        </div>
      )}

      {active && <ReelDialog id={active} onClose={() => setActive(null)} />}
    </>
  )
}

function ReelDialog({ id, onClose }: { id: string; onClose: () => void }) {
  useModal(true, onClose)
  return (
    <div role="dialog" aria-modal="true" aria-label="Reel oynatıcı" className="fixed inset-0 z-70 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 animate-[fade-in_.2s_ease-out] bg-black/80 backdrop-blur-sm" />
      <div className="relative w-full max-w-96 animate-[pop-in_.22s_var(--ease-soft)]">
        <button
          type="button"
          onClick={onClose}
          autoFocus
          aria-label="Kapat"
          className="btn btn-secondary absolute -top-14 right-0 h-11 min-h-11 w-11 px-0"
        >
          <X size={20} aria-hidden="true" />
        </button>
        <div className="card aspect-9/16 max-h-[80vh] overflow-hidden">
          <iframe
            src={`https://www.instagram.com/reel/${id}/embed/`}
            title="Instagram reel"
            allow="autoplay; encrypted-media"
            className="h-full w-full border-0 bg-white"
          />
        </div>
      </div>
    </div>
  )
}
