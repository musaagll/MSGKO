'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, ChevronRight, Play, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatViews } from '@/lib/utils'
import type { Video } from '@/lib/types'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsOpen(false); setQuery(''); inputRef.current?.blur() }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); return }
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('videos')
      .select('*, category:categories(*)')
      .ilike('title', `%${q}%`)
      .order('views', { ascending: false })
      .limit(8)
    setResults((data as Video[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => search(query), 300)
    return () => clearTimeout(t)
  }, [query, search])

  const handleOpen = () => {
    setIsOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Input bar */}
      <div
        className="flex items-center gap-2 transition-all duration-300 overflow-hidden"
        style={{
          width: isOpen ? '240px' : '34px',
          height: '34px',
          background: isOpen ? 'rgba(255,255,255,0.04)' : 'transparent',
          border: isOpen ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
          padding: isOpen ? '0 12px' : '0 8px',
          boxShadow: isOpen ? '0 0 16px rgba(139,92,246,0.1)' : 'none',
        }}
      >
        <button
          onClick={handleOpen}
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
              placeholder="Ara..."
              className="flex-1 bg-transparent text-white text-[0.8rem] outline-none min-w-0"
              style={{ color: 'rgba(255,255,255,0.9)', caretColor: 'rgba(139,92,246,0.9)' }}
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setResults([]) }}
                className="flex-shrink-0 transition-colors duration-200 hover:text-white"
                style={{ color: 'rgba(200,200,216,0.3)' }}
              >
                <X size={12} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Results */}
      {isOpen && query.trim().length >= 2 && (
        <div
          className="absolute top-full right-0 mt-2 overflow-hidden z-50"
          style={{
            width: '320px',
            background: 'rgba(7,7,11,0.97)',
            border: '1px solid rgba(139,92,246,0.2)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 20px 48px rgba(0,0,0,0.7), 0 0 30px rgba(139,92,246,0.07)',
          }}
        >
          {/* Top border */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)' }}
          />

          {loading && (
            <div className="flex items-center gap-2 px-4 py-3.5">
              {[0,1,2].map(i => (
                <div key={i} className="w-1 h-3 rounded-full animate-pulse"
                  style={{ background: 'rgba(139,92,246,0.5)', animationDelay: `${i*0.15}s` }}
                />
              ))}
              <span className="text-[0.75rem] ml-1" style={{ color: 'rgba(200,200,216,0.4)' }}>Aranıyor...</span>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="px-5 py-6 text-center">
              <p className="text-[0.82rem]" style={{ color: 'rgba(255,255,255,0.3)' }}>Sonuç bulunamadı</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <div className="px-4 py-2 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-[0.65rem] tracking-[0.1em] uppercase"
                  style={{ color: 'rgba(139,92,246,0.6)' }}>
                  {results.length} sonuç
                </span>
                <span className="text-[0.62rem]" style={{ color: 'rgba(255,255,255,0.18)' }}>ESC kapat</span>
              </div>

              <ul>
                {results.map((video) => (
                  <li key={video.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <button
                      onClick={() => {
                        window.open(video.youtube_url, '_blank', 'noopener,noreferrer')
                        setIsOpen(false); setQuery('')
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left group transition-colors duration-150"
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(139,92,246,0.06)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <Play size={12} style={{ color: 'rgba(139,92,246,0.6)', flexShrink: 0 }} />

                      <span className={`text-[0.6rem] font-bold px-1.5 py-0.5 uppercase flex-shrink-0 ${
                        video.category?.slug === 'asas' ? 'bg-blue-500/15 text-blue-400' : 'bg-amber-500/15 text-amber-400'
                      }`}>
                        {video.category?.slug?.toUpperCase() ?? 'VİDEO'}
                      </span>

                      <div className="flex-1 min-w-0">
                        <p className="text-[0.8rem] font-medium leading-snug truncate text-white group-hover:text-purple-200 transition-colors">
                          {video.title}
                        </p>
                        <p className="text-[0.68rem] mt-0.5 truncate" style={{ color: 'rgba(180,180,200,0.4)' }}>
                          {formatViews(video.views)} görüntülenme{video.duration && ` · ${video.duration}`}
                        </p>
                      </div>

                      <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} className="group-hover:text-purple-400 transition-colors" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
