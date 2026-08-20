'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Server } from '@/lib/types/character'

export function CharacterSearchForm() {
  const router = useRouter()
  const [servers, setServers] = useState<Server[]>([])
  const [server, setServer] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/character/servers')
      .then(r => r.json())
      .then(d => {
        if (d.servers?.length) {
          setServers(d.servers)
          setServer(d.servers[0].server_code)
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!server || !name.trim()) { setError('Server ve oyuncu adı gerekli.'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/character?server=${encodeURIComponent(server)}&name=${encodeURIComponent(name.trim())}`)
      const data = await res.json()
      if (data.success) {
        router.push(`/karakter/${server}/${encodeURIComponent(name.trim())}`)
      } else {
        setError(data.error ?? 'Karakter bulunamadı.')
      }
    } catch {
      setError('Bağlantı hatası. Tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Server select */}
      <div>
        <label className="block text-[0.65rem] font-black tracking-[0.2em] uppercase text-white/40 mb-2">
          Server
        </label>
        <div className="relative">
          <select
            value={server}
            onChange={e => setServer(e.target.value)}
            disabled={loading}
            className="w-full appearance-none px-4 py-3 pr-10 rounded-lg text-sm font-medium text-white
                       focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-50
                       transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.2)' }}
          >
            {servers.map(s => (
              <option key={s.id} value={s.server_code} style={{ background: '#0a0714' }}>
                {s.server_name}
              </option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>

      {/* Name input */}
      <div>
        <label className="block text-[0.65rem] font-black tracking-[0.2em] uppercase text-white/40 mb-2">
          Oyuncu Adı
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Karakter adını girin..."
          disabled={loading}
          autoComplete="off"
          spellCheck={false}
          className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-white/25
                     focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-50
                     transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.2)' }}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-lg text-sm text-red-300"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !server || !name.trim()}
        className="w-full py-3.5 rounded-lg font-black tracking-[0.1em] uppercase text-sm text-white
                   disabled:opacity-40 disabled:cursor-not-allowed
                   transition-all duration-300 relative overflow-hidden group"
        style={{
          background: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #8b5cf6 100%)',
          boxShadow: loading ? 'none' : '0 4px 20px rgba(109,40,217,0.5)',
        }}
      >
        {/* Shimmer */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                         translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

        <span className="relative flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Aranıyor...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Karakteri Bul
            </>
          )}
        </span>
      </button>
    </form>
  )
}
