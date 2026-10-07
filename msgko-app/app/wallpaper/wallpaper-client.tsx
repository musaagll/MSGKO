'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Download, Maximize2, Monitor, Smartphone, X } from 'lucide-react'
import { useModal } from '@/hooks/useModal'
import { wallpaperDownload } from '@/lib/utils'
import type { Wallpaper } from '@/lib/wallpapers'

type Tab = 'pc' | 'phone'

const TABS: { id: Tab; label: string; Icon: typeof Monitor }[] = [
  { id: 'pc', label: 'PC / Masaüstü', Icon: Monitor },
  { id: 'phone', label: 'Telefon', Icon: Smartphone },
]

function track(id: number, type: 'click' | 'download') {
  if (id <= 0) return // yerel yedek görseller sayılmaz
  fetch('/api/wallpapers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, type }),
  }).catch(() => {})
}

/** Duvar kağıdı galerisi — liste sunucudan gelir, yalnızca sekme ve büyük görünüm istemcide */
export function WallpaperClient({ wallpapers }: { wallpapers: Wallpaper[] }) {
  const counts = { pc: wallpapers.filter((w) => w.category === 'pc').length, phone: wallpapers.filter((w) => w.category === 'phone').length }
  const [tab, setTab] = useState<Tab>(counts.pc > 0 || counts.phone === 0 ? 'pc' : 'phone')
  const [index, setIndex] = useState<number | null>(null)

  const list = wallpapers.filter((w) => w.category === tab)
  const open = (i: number) => {
    setIndex(i)
    track(list[i].id, 'click')
  }

  return (
    <>
      <div role="tablist" aria-label="Cihaz türü" className="inline-flex rounded-xl border border-white/10 bg-white/3 p-1">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            aria-controls="wallpaper-grid"
            onClick={() => { setTab(id); setIndex(null) }}
            className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors ${
              tab === id ? 'bg-white/10 text-fg' : 'text-fg-3 hover:text-fg'
            }`}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
            <span className="tabular-nums text-fg-4">{counts[id]}</span>
          </button>
        ))}
      </div>

      <div id="wallpaper-grid" role="tabpanel" className="mt-8">
        {list.length === 0 ? (
          <p className="card p-10 text-center text-fg-3">Bu kategoride henüz duvar kağıdı yok.</p>
        ) : (
          <ul className={`grid gap-4 ${tab === 'pc' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'}`}>
            {list.map((wp, i) => (
              <li key={wp.id} className="group card card-interactive relative overflow-hidden">
                <button
                  type="button"
                  onClick={() => open(i)}
                  aria-label={`${wp.label} — büyük görüntüle`}
                  className={`relative block w-full ${tab === 'pc' ? 'aspect-video' : 'aspect-9/16'}`}
                >
                  <Image
                    src={wp.src}
                    alt={`Knight Online Wallpaper — ${wp.label}`}
                    fill
                    sizes={tab === 'pc' ? '(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw' : '(min-width: 1024px) 220px, 50vw'}
                    className="zoom-media object-cover"
                  />
                  <span aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-80" />
                  <span aria-hidden="true" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-black/50 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                    <Maximize2 size={16} />
                  </span>
                </button>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-3">
                  <p className="truncate text-sm font-semibold text-white">{wp.label}</p>
                  <a
                    {...wallpaperDownload(wp.src, wp.label)}
                    onClick={() => track(wp.id, 'download')}
                    aria-label={`${wp.label} indir`}
                    className="pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/90 text-ink-950 transition-transform hover:scale-105"
                  >
                    <Download size={17} aria-hidden="true" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {index !== null && list[index] && (
        <Lightbox
          wp={list[index]}
          position={`${index + 1} / ${list.length}`}
          onClose={() => setIndex(null)}
          onPrev={index > 0 ? () => setIndex(index - 1) : undefined}
          onNext={index < list.length - 1 ? () => setIndex(index + 1) : undefined}
        />
      )}
    </>
  )
}

function Lightbox({ wp, position, onClose, onPrev, onNext }: {
  wp: Wallpaper
  position: string
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}) {
  useModal(true, onClose)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && onPrev) onPrev()
    if (e.key === 'ArrowRight' && onNext) onNext()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={wp.label}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-70 flex flex-col bg-black/95 animate-[fade-in_.2s_ease-out]"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3">
        <p className="min-w-0 truncate text-sm font-semibold text-fg">
          {wp.label} <span className="ml-2 font-normal tabular-nums text-fg-4">{position}</span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <a {...wallpaperDownload(wp.src, wp.label)} onClick={() => track(wp.id, 'download')} className="btn btn-primary btn-sm">
            <Download size={16} aria-hidden="true" />
            İndir
          </a>
          <button type="button" onClick={onClose} autoFocus aria-label="Kapat" className="btn btn-secondary btn-sm w-10 px-0">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="relative min-h-0 flex-1">
        <Image src={wp.src} alt={`Knight Online Wallpaper — ${wp.label}`} fill sizes="100vw" className="object-contain" />
        {onPrev && (
          <button type="button" onClick={onPrev} aria-label="Önceki" className="btn btn-secondary absolute left-3 top-1/2 h-12 min-h-12 w-12 -translate-y-1/2 px-0">
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
        )}
        {onNext && (
          <button type="button" onClick={onNext} aria-label="Sonraki" className="btn btn-secondary absolute right-3 top-1/2 h-12 min-h-12 w-12 -translate-y-1/2 px-0">
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}
