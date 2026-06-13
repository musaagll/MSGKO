'use client'

import { useEffect, useRef, useState } from 'react'
import { Plus, Trash2, Upload, X, Loader } from 'lucide-react'

interface Wallpaper { id: number; label: string; src: string; category: string; created_at: string }

export default function WallpapersClient() {
  const [items, setItems] = useState<Wallpaper[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [label, setLabel] = useState('')
  const [category, setCategory] = useState('genel')
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [msg, setMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => {
    setLoading(true)
    fetch('/api/wallpapers').then(r => r.json()).then(d => { setItems(d); setLoading(false) }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setLabel(f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '))
    setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    setMsg('')

    // 1. Storage'a yükle
    const form = new FormData()
    form.append('file', file)
    form.append('bucket', 'wallpapers')
    const upRes = await fetch('/api/upload', { method: 'POST', body: form })
    const upData = await upRes.json()
    if (!upRes.ok) { setMsg(upData.error ?? 'Yükleme hatası'); setUploading(false); return }

    // 2. DB'ye kaydet
    const res = await fetch('/api/wallpapers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, src: upData.url, category }),
    })
    if (res.ok) {
      setMsg('✓ Eklendi')
      setShowForm(false); setFile(null); setPreview(null); setLabel(''); setCategory('genel')
      load()
    } else {
      const d = await res.json()
      setMsg(d.error ?? 'Hata')
    }
    setUploading(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu wallpaper\'ı silmek istediğine emin misin?')) return
    await fetch('/api/wallpapers', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Wallpaper Yönetimi</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{items.length} wallpaper</p>
        </div>
        <button type="button" onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all"
          style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)', color: '#a78bfa' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.25)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.15)')}>
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? 'İptal' : 'Yeni Ekle'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-5 mb-6 space-y-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="text-sm font-semibold text-white">Yeni Wallpaper</h2>

          {/* File drop zone */}
          <div
            className="relative flex flex-col items-center justify-center p-8 cursor-pointer transition-all"
            style={{ border: '2px dashed rgba(124,58,237,0.3)', background: preview ? 'rgba(0,0,0,0.2)' : 'rgba(124,58,237,0.04)' }}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'rgba(124,58,237,0.6)' }}
            onDragLeave={e => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)')}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)) } }}>
            {preview ? (
              <img src={preview} alt="" className="max-h-40 object-contain" />
            ) : (
              <>
                <Upload size={24} style={{ color: 'rgba(124,58,237,0.6)' }} className="mb-2" />
                <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Dosya seç veya sürükle<br /><span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>PNG, JPG, WEBP</span>
                </p>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Etiket</label>
              <input type="text" value={label} onChange={e => setLabel(e.target.value)} required
                className="w-full px-3 py-2.5 text-sm text-white outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Kategori</label>
              <input type="text" value={category} onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 text-sm text-white outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
          </div>

          {msg && <p className="text-sm" style={{ color: msg.startsWith('✓') ? '#4ade80' : '#f87171' }}>{msg}</p>}

          <button type="submit" disabled={uploading || !file}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-40"
            style={{ background: 'rgba(124,58,237,0.8)', color: '#fff', border: '1px solid rgba(124,58,237,0.5)' }}>
            {uploading ? <><Loader size={14} className="animate-spin" /> Yükleniyor...</> : <><Upload size={14} /> Yükle</>}
          </button>
        </form>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-video animate-pulse"
              style={{ background: 'rgba(255,255,255,0.05)' }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.25)' }}>
          <p>Henüz wallpaper yok</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map(wp => (
            <div key={wp.id} className="group relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="aspect-video overflow-hidden">
                <img src={wp.src} alt={wp.label} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-white truncate">{wp.label}</p>
                <p className="text-[0.62rem] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{wp.category}</p>
              </div>
              <button type="button" onClick={() => handleDelete(wp.id)}
                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(239,68,68,0.85)' }}>
                <Trash2 size={12} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
