'use client'

import { useEffect, useRef, useState } from 'react'
import { Plus, Trash2, Upload, X, Loader } from 'lucide-react'

interface Wallpaper { id: number; label: string; src: string; category: string; created_at: string }

const btn = (color = '#7c3aed'): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
  fontSize: 13, fontWeight: 600, cursor: 'pointer', border: `1px solid ${color}55`,
  background: `${color}22`, color: color, transition: 'background 0.15s',
})

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: 13, outline: 'none',
}

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
    fetch('/api/wallpapers').then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleFile = (f: File) => {
    setFile(f); setLabel(f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')); setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    setUploading(true); setMsg('')
    const form = new FormData()
    form.append('file', file); form.append('bucket', 'wallpapers')
    const upRes = await fetch('/api/upload', { method: 'POST', body: form })
    const upData = await upRes.json()
    if (!upRes.ok) { setMsg(upData.error ?? 'Yükleme hatası'); setUploading(false); return }
    const res = await fetch('/api/wallpapers', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, src: upData.url, category }),
    })
    if (res.ok) { setMsg('✓ Eklendi'); setShowForm(false); setFile(null); setPreview(null); setLabel(''); setCategory('genel'); load() }
    else { const d = await res.json(); setMsg(d.error ?? 'Hata') }
    setUploading(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Silmek istiyor musun?')) return
    await fetch('/api/wallpapers', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Başlık */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Wallpaper Yönetimi</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{items.length} wallpaper</p>
        </div>
        <button type="button" onClick={() => setShowForm(v => !v)} style={btn()}>
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'İptal' : 'Yeni Ekle'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ padding: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Yeni Wallpaper</h2>

          {/* Dropzone */}
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: 32, cursor: 'pointer', marginBottom: 16,
              border: '2px dashed rgba(124,58,237,0.35)', background: 'rgba(124,58,237,0.04)',
              minHeight: 140,
            }}>
            {preview
              ? <img src={preview} alt="" style={{ maxHeight: 120, objectFit: 'contain' }} />
              : <>
                  <Upload size={24} color="rgba(124,58,237,0.6)" style={{ marginBottom: 8 }} />
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                    Dosya seç veya sürükle<br /><span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>PNG, JPG, WEBP</span>
                  </p>
                </>
            }
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Etiket</label>
              <input type="text" value={label} onChange={e => setLabel(e.target.value)} required style={inp} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Kategori</label>
              <input type="text" value={category} onChange={e => setCategory(e.target.value)} style={inp} />
            </div>
          </div>

          {msg && <p style={{ fontSize: 13, marginBottom: 12, color: msg.startsWith('✓') ? '#4ade80' : '#f87171' }}>{msg}</p>}

          <button type="submit" disabled={uploading || !file} style={{ ...btn(), opacity: (uploading || !file) ? 0.4 : 1 }}>
            {uploading ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Yükleniyor...</> : <><Upload size={14} /> Yükle</>}
          </button>
        </form>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {[...Array(6)].map((_, i) => <div key={i} style={{ aspectRatio: '16/9', background: 'rgba(255,255,255,0.05)' }} />)}
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.25)' }}>Henüz wallpaper yok</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {items.map(wp => (
            <div key={wp.id} style={{ position: 'relative', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}
              onMouseEnter={e => { const btn = (e.currentTarget as HTMLElement).querySelector('.del-btn') as HTMLElement; if (btn) btn.style.opacity = '1' }}
              onMouseLeave={e => { const btn = (e.currentTarget as HTMLElement).querySelector('.del-btn') as HTMLElement; if (btn) btn.style.opacity = '0' }}>
              <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                <img src={wp.src.startsWith('http') ? wp.src : `https://msgko.net${wp.src}`} alt={wp.label} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 10px' }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{wp.label}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{wp.category}</p>
              </div>
              <button type="button" className="del-btn" onClick={() => handleDelete(wp.id)}
                style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.85)', border: 'none', cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s' }}>
                <Trash2 size={12} color="#fff" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
