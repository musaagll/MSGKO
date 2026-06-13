'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, ChevronRight, Play, BookOpen, Layout, Tv, Bell, ExternalLink } from 'lucide-react'
import { searchItems } from '@/lib/search-index'
import type { SearchItem } from '@/lib/search-index'

// Navbar'daki modal açıcıları tetiklemek için custom event sistemi
export function triggerNavbarAction(modalId: string) {
  window.dispatchEvent(new CustomEvent('msgko:openModal', { detail: { modalId } }))
}

const BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  purple: { bg: 'rgba(139,92,246,0.15)', text: 'rgba(167,139,250,0.9)' },
  blue:   { bg: 'rgba(59,130,246,0.15)',  text: 'rgba(147,197,253,0.9)' },
  red:    { bg: 'rgba(239,68,68,0.15)',   text: 'rgba(252,165,165,0.9)' },
  amber:  { bg: 'rgba(245,158,11,0.15)',  text: 'rgba(252,211,77,0.9)' },
  green:  { bg: 'rgba(34,197,94,0.15)',   text: 'rgba(134,239,172,0.9)' },
  pink:   { bg: 'rgba(236,72,153,0.15)',  text: 'rgba(249,168,212,0.9)' },
}

function TypeIcon({ type }: { type: SearchItem['type'] }) {
  const style = { color: 'rgba(139,92,246,0.6)', flexShrink: 0 } as const
  switch (type) {
    case 'video':    return <Play size={12} style={style} />
    case 'rehber':   return <BookOpen size={12} style={style} />
    case 'sayfa':    return <Layout size={12} style={style} />
    case 'modal':    return <Tv size={12} style={style} />
    case 'kategori': return <Bell size={12} style={style} />
    default:         return <ChevronRight size={12} style={style} />
  }
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Dışarı tıklanınca kapat
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // ESC ile kapat
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        setIsOpen(false); setQuery(''); setActiveIndex(-1)
        inputRef.current?.blur()
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(i => Math.min(i + 1, results.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(i => Math.max(i - 1, -1))
      }
      if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault()
        handleSelect(results[activeIndex])
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, activeIndex, results])

  // Arama — anlık
  useEffect(() => {
    if (query.trim().length >= 1) {
      setResults(searchItems(query))
      setActiveIndex(-1)
    } else {
      setResults([])
    }
  }, [query])

  const handleOpen = () => {
    setIsOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleSelect = (item: SearchItem) => {
    setIsOpen(false)
    setQuery('')
    setResults([])
    setActiveIndex(-1)

    if (item.action === 'link' && item.href) {
      router.push(item.href)
    } else if (item.action === 'external' && item.externalUrl) {
      window.open(item.externalUrl, '_blank', 'noopener,noreferrer')
    } else if (item.action === 'modal' && item.modalId) {
      triggerNavbarAction(item.modalId)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Input bar */}
      <div
        className="flex items-center gap-2 transition-all duration-300 overflow-hidden"
        style={{
          width: isOpen ? '260px' : '34px',
          height: '34px',
          background: isOpen ? 'rgba(255,255,255,0.04)' : 'transparent',
          border: isOpen ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
          padding: isOpen ? '0 12px' : '0 8px',
          boxShadow: isOpen ? '0 0 16px rgba(139,92,246,0.1)' : 'none',
        }}
      >
        <button type="button" onClick={handleOpen}
          className="flex-shrink-0 transition-colors duration-200"
          style={{ color: isOpen ? 'rgba(139,92,246,0.8)' : 'rgba(200,200,216,0.45)' }}
          aria-label="Arama"
        >
          <Search size={16} />
        </button>

        {isOpen && (
          <>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="İçerik ara..."
              className="flex-1 bg-transparent text-white text-[0.8rem] outline-none min-w-0"
              style={{ color: 'rgba(255,255,255,0.9)', caretColor: 'rgba(139,92,246,0.9)' }}
              autoComplete="off"
              aria-label="Site içeriği ara"
              aria-expanded={results.length > 0}
              role="combobox"
            />
            {query && (
              <button type="button"
                onClick={() => { setQuery(''); setResults([]) }}
                className="flex-shrink-0 transition-colors duration-200 hover:text-white"
                style={{ color: 'rgba(200,200,216,0.3)' }}
                aria-label="Aramayı temizle"
              >
                <X size={12} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Sonuçlar */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 overflow-hidden z-50"
          style={{
            width: '340px',
            background: 'rgba(7,7,11,0.98)',
            border: '1px solid rgba(139,92,246,0.2)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 20px 48px rgba(0,0,0,0.75), 0 0 30px rgba(139,92,246,0.07)',
          }}
          role="listbox"
        >
          {/* Top border */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)' }}
          />

          {/* Boş durum — ipuçları göster */}
          {query.trim().length === 0 && (
            <div className="px-4 py-4">
              <p className="text-[0.62rem] font-bold tracking-[0.18em] uppercase mb-3"
                style={{ color: 'rgba(139,92,246,0.55)' }}>
                Hızlı Erişim
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['Asas', 'Okçu', 'Farm', 'PK', 'Duyurular', 'Wallpaper', 'YouTube', 'Destek'].map((hint) => (
                  <button key={hint} type="button"
                    onClick={() => setQuery(hint)}
                    className="px-2.5 py-1 text-[0.65rem] font-medium transition-all duration-150"
                    style={{
                      background: 'rgba(139,92,246,0.08)',
                      border: '1px solid rgba(139,92,246,0.18)',
                      color: 'rgba(200,190,255,0.6)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(139,92,246,0.18)'
                      e.currentTarget.style.color = 'rgba(200,190,255,0.9)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(139,92,246,0.08)'
                      e.currentTarget.style.color = 'rgba(200,190,255,0.6)'
                    }}
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sonuç yok */}
          {query.trim().length > 0 && results.length === 0 && (
            <div className="px-5 py-6 text-center">
              <p className="text-[0.78rem] mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                &quot;{query}&quot; için sonuç bulunamadı
              </p>
              <p className="text-[0.68rem]" style={{ color: 'rgba(255,255,255,0.15)' }}>
                Asas, Okçu, Farm, PK gibi kelimeler deneyin
              </p>
            </div>
          )}

          {/* Sonuçlar */}
          {results.length > 0 && (
            <>
              <div className="px-4 py-2 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-[0.62rem] tracking-[0.12em] uppercase"
                  style={{ color: 'rgba(139,92,246,0.55)' }}>
                  {results.length} sonuç
                </span>
                <span className="text-[0.58rem]" style={{ color: 'rgba(255,255,255,0.15)' }}>
                  ↑↓ seç · Enter aç · ESC kapat
                </span>
              </div>

              <ul>
                {results.map((item, i) => {
                  const badge = BADGE_STYLES[item.badgeColor ?? 'purple']
                  const isActive = i === activeIndex
                  return (
                    <li key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setActiveIndex(i)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-100"
                        style={{
                          background: isActive ? 'rgba(139,92,246,0.08)' : 'transparent',
                          borderLeft: isActive ? '2px solid rgba(139,92,246,0.5)' : '2px solid transparent',
                        }}
                      >
                        <TypeIcon type={item.type} />

                        {/* Badge */}
                        {item.badge && (
                          <span className="text-[0.58rem] font-bold px-1.5 py-0.5 uppercase flex-shrink-0"
                            style={{ background: badge.bg, color: badge.text }}>
                            {item.badge}
                          </span>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="text-[0.8rem] font-medium leading-snug truncate text-white/90">
                            {item.title}
                          </p>
                          <p className="text-[0.67rem] mt-0.5 truncate" style={{ color: 'rgba(180,180,200,0.38)' }}>
                            {item.description}
                          </p>
                        </div>

                        {item.action === 'external'
                          ? <ExternalLink size={11} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                          : <ChevronRight size={11} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                        }
                      </button>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
