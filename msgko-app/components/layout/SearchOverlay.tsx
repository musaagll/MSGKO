'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, CornerDownLeft, Search, X } from 'lucide-react'
import { useModal } from '@/hooks/useModal'
import type { SearchItem } from '@/lib/search-index'

type SearchModule = typeof import('@/lib/search-index')

// İndeks modülü bir kez yüklenir ve oturum boyunca tekrar kullanılır
let indexPromise: Promise<SearchModule> | null = null
const loadIndex = () => (indexPromise ??= import('@/lib/search-index'))

const POPULAR_IDS = ['rehber-asas', 'rehber-okcu', 'boss-felankor', 'harita-cz', 'item-raptor', 'gb-fiyatlari']

const TYPE_LABEL: Record<string, string> = {
  rehber: 'Rehber', boss: 'Boss', harita: 'Harita', item: 'Item', video: 'Video',
  sayfa: 'Sayfa', kategori: 'Kategori', build: 'Build', farm: 'Farm', haber: 'Haber', quest: 'Görev', modal: 'Sayfa',
}

/** Site içi arama (Ctrl/⌘ + K). lib/search-index.ts'teki Türkçe toleranslı motoru kullanır. */
export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [mod, setMod] = useState<SearchModule | null>(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  useModal(true, onClose)

  useEffect(() => {
    inputRef.current?.focus()
    let alive = true
    loadIndex().then((m) => { if (alive) setMod(m) })
    return () => { alive = false }
  }, [])

  const results: SearchItem[] = useMemo(() => {
    if (!mod) return []
    const q = query.trim()
    if (!q) {
      return POPULAR_IDS.map((id) => mod.SEARCH_INDEX.find((i) => i.id === id)).filter((i): i is SearchItem => !!i)
    }
    return mod.searchItems(q, 12)
  }, [mod, query])

  const go = (item: SearchItem) => {
    onClose()
    if (item.action === 'external' && item.externalUrl) {
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer')
    } else if (item.href) {
      router.push(item.href)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault()
      go(results[active])
    }
  }

  const activeId = results[active] ? `${listId}-${active}` : undefined
  const showEmpty = !!mod && query.trim().length > 0 && results.length === 0

  return (
    <div className="fixed inset-0 z-70 flex items-start justify-center sm:px-4 sm:pt-[12vh]">
      <div onClick={onClose} className="absolute inset-0 animate-[fade-in_.2s_ease-out] bg-black/70 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sitede ara"
        className="relative flex h-full w-full animate-[pop-in_.22s_var(--ease-soft)] flex-col overflow-hidden border-white/10 bg-ink-900 shadow-2xl shadow-black sm:h-auto sm:max-h-[70vh] sm:max-w-2xl sm:rounded-2xl sm:border"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-white/7 px-4 sm:px-5">
          <Search size={20} aria-hidden="true" className="shrink-0 text-amethyst-300" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0) }}
            onKeyDown={onKeyDown}
            placeholder="Rehber, boss, harita, item ara…"
            aria-label="Arama"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            autoComplete="off"
            enterKeyHint="search"
            className="h-16 min-w-0 flex-1 bg-transparent text-base text-fg outline-none focus-visible:outline-none placeholder:text-fg-4 [&::-webkit-search-cancel-button]:hidden"
          />
          <button type="button" onClick={onClose} aria-label="Aramayı kapat" className="btn btn-ghost h-10 min-h-10 w-10 shrink-0 px-0">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 sm:p-3">
          {!mod && <p className="px-3 py-8 text-center text-sm text-fg-4">Yükleniyor…</p>}

          {mod && !query.trim() && (
            <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.16em] text-fg-4">Popüler</p>
          )}

          {results.length > 0 && (
            <ul id={listId} role="listbox" aria-label="Arama sonuçları" className="space-y-0.5">
              {results.map((item, i) => (
                <li
                  key={item.id}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={() => go(item)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-colors ${
                    i === active ? 'bg-white/7' : ''
                  }`}
                >
                  <span className="chip shrink-0 justify-center sm:min-w-19">{TYPE_LABEL[item.type] ?? item.badge ?? 'Sayfa'}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-fg">{item.title}</span>
                    <span className="block truncate text-sm text-fg-3">{item.description}</span>
                  </span>
                  {item.action === 'external' ? (
                    <ArrowUpRight size={16} aria-hidden="true" className="shrink-0 text-fg-4" />
                  ) : (
                    i === active && <CornerDownLeft size={16} aria-hidden="true" className="hidden shrink-0 text-fg-4 sm:block" />
                  )}
                </li>
              ))}
            </ul>
          )}

          {showEmpty && (
            <div className="px-3 py-10 text-center">
              <p className="font-semibold text-fg-2">“{query}” için sonuç bulunamadı</p>
              <p className="mt-1 text-sm text-fg-4">Sınıf adı (asas, okçu), boss (felankor) ya da harita (cz) deneyebilirsin.</p>
            </div>
          )}
        </div>

        <div className="hidden shrink-0 items-center gap-4 border-t border-white/7 px-5 py-3 text-xs text-fg-4 sm:flex">
          <span className="flex items-center gap-1.5"><span className="kbd">↑</span><span className="kbd">↓</span> gezin</span>
          <span className="flex items-center gap-1.5"><span className="kbd">Enter</span> aç</span>
          <span className="flex items-center gap-1.5"><span className="kbd">Esc</span> kapat</span>
        </div>
      </div>
    </div>
  )
}
