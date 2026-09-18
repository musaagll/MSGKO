'use client'

import { useEffect, useRef, useState } from 'react'
import { Plus, Trash2, Upload, X, Loader } from 'lucide-react'

interface Wallpaper { id: number; label: string; src: string; category: string; click_count: number; download_count: number; created_at: string }

const INP: React.CSSProperties = {
  width: '100%', padding: '9px 11px',
  background: 'rgba(255,255,255,0.035)',
  border: '1px solid var(--border)',
  color: 'var(--text)', fontSize: 12, outline: 'none',
  transition: 'border-color 0.15s',
}
const LABEL: React.CSSProperties = {
  display: 'block', fontSize: 9, fontWeight: 700,
  letterSpacing: '0.22em', textTransform: 'uppercase',
  color: 'rgba(160,160,184,0.4)', marginBottom: 5,
}

export default function WallpapersClient() {
  const [items,    setItems]    = useState<Wallpaper[]>([])
  const [loading,  setLoading]  = useState(true)
  const [uploading,setUploading]= useState(false)
  const [showForm, setShowForm] = useState(false)
  const [label,    setLabel]    = useState('')
  const [category, setCategory] = useState<'pc' | 'phone'>('pc')
  const [preview,  setPreview]  = useState<string | null>(null)
  const [file,     setFile]     = useState<File | null>(null)
  const [msg,      setMsg]      = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => {
    setLoading(true)
    fetch('/api/wallpapers').then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleFile = (f: File) => {
    setFile(f)
    setLabel(f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '))
    setPreview(URL.createObjectURL(f))
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
    if (res.ok) { setMsg('✓'); setShowForm(false); setFile(null); setPreview(null); setLabel(''); setCategory('pc'); load() }
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

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 3 }}>
            Wallpaper Yönetimi
          </h1>
          <p style={{ fontSize: 11, color: 'rgba(160,160,184,0.38)' }}>{items.length} wallpaper</p>
        </div>
        <button type="button" onClick={() => setShowForm(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer',
            border: `1px solid ${showForm ? 'var(--border-md)' : 'rgba(201,168,76,0.3)'}`,
            background: showForm ? 'rgba(255,255,255,0.04)' : 'rgba(201,168,76,0.07)',
            color: showForm ? 'rgba(160,160,184,0.6)' : 'rgba(201,168,76,0.8)',
            transition: 'all 0.15s',
          }}>
          {showForm ? <X size={12} /> : <Plus size={12} />}
          {showForm ? 'İptal' : 'Yeni Ekle'}
        </button>
      </div>

      <div className="gold-line" style={{ marginBottom: 20 }} />

      {/* ── Upload form ── */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{
          padding: 20, marginBottom: 20,
          background: 'var(--surface)', border: '1px solid var(--border)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />
          <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)', marginBottom: 16 }}>
            Yeni Wallpaper
          </h2>

          {/* Dropzone */}
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: 28, cursor: 'pointer', marginBottom: 14, minHeight: 130,
              border: '1px dashed rgba(201,168,76,0.25)',
              background: 'rgba(201,168,76,0.03)',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.45)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.25)' }}
          >
            {preview
              ? <img src={preview} alt="" style={{ maxHeight: 110, objectFit: 'contain' }} />
              : <>
                  <Upload size={20} color="rgba(201,168,76,0.45)" style={{ marginBottom: 8 }} />
                  <p style={{ fontSize: 12, color: 'rgba(160,160,184,0.4)', textAlign: 'center' }}>
                    Dosya seç veya sürükle
                  </p>
                  <p style={{ fontSize: 10, color: 'rgba(160,160,184,0.22)', marginTop: 3 }}>PNG, JPG, WEBP</p>
                </>
            }
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={LABEL}>Etiket</label>
              <input type="text" value={label} onChange={e => setLabel(e.target.value)} required style={INP}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(201,168,76,0.35)' }}
                onBlur={e  => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)' }}
              />
            </div>
            <div>
              <label style={LABEL}>Kategori</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['pc', 'phone'] as const).map(cat => (
                  <button key={cat} type="button" onClick={() => setCategory(cat)}
                    style={{
                      flex: 1, padding: '9px 0', fontSize: 10, fontWeight: 800,
                      letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer',
                      border: `1px solid ${category === cat ? 'rgba(201,168,76,0.45)' : 'var(--border)'}`,
                      background: category === cat ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.02)',
                      color: category === cat ? 'rgba(201,168,76,0.9)' : 'rgba(160,160,184,0.38)',
                      transition: 'all 0.15s',
                    }}>
                    {cat === 'pc' ? 'PC' : 'Phone'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {msg && <p style={{ fontSize: 12, marginBottom: 10, color: msg.startsWith('✓') ? 'var(--green)' : 'var(--red)' }}>{msg}</p>}

          <button type="submit" disabled={uploading || !file}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '8px 16px', fontSize: 10, fontWeight: 800,
              letterSpacing: '0.16em', textTransform: 'uppercase', cursor: (uploading || !file) ? 'not-allowed' : 'pointer',
              color: 'rgba(6,6,8,0.95)',
              background: 'linear-gradient(120deg, #C9A84C 0%, #DFC06A 50%, #C9A84C 100%)',
              border: '1px solid rgba(201,168,76,0.45)',
              opacity: (uploading || !file) ? 0.4 : 1, transition: 'opacity 0.15s',
            }}>
            {uploading
              ? <><Loader size={11} className="spin" /> Yükleniyor…</>
              : <><Upload size={11} /> Yükle</>
            }
          </button>
        </form>
      )}

      {/* ── Grid ── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ aspectRatio: '16/9', background: 'var(--surface)', border: '1px solid var(--border)', opacity: 0.5 }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', fontSize: 12, color: 'rgba(160,160,184,0.25)' }}>
          Henüz wallpaper yok
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
          {items.map(wp => (
            <div
              key={wp.id}
              style={{ position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden', transition: 'border-color 0.2s' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.25)'
                const btn = (e.currentTarget as HTMLDivElement).querySelector('.del-btn') as HTMLElement
                if (btn) btn.style.opacity = '1'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
                const btn = (e.currentTarget as HTMLDivElement).querySelector('.del-btn') as HTMLElement
                if (btn) btn.style.opacity = '0'
              }}
            >
              <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                <img
                  src={wp.src.startsWith('http') ? wp.src : `https://msgko.net${wp.src}`}
                  alt={wp.label} loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                />
              </div>
              <div style={{ padding: '7px 9px' }}>
                <p style={{ fontSize: 11, fontWeight: 500, color: 'rgba(242,242,244,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {wp.label}
                </p>
                <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                  <span style={{ fontSize: 10, color: 'rgba(201,168,76,0.55)' }}>👁 {wp.click_count ?? 0}</span>
                  <span style={{ fontSize: 10, color: 'rgba(52,211,153,0.55)' }}>⬇ {wp.download_count ?? 0}</span>
                  <span style={{ fontSize: 10, color: 'rgba(160,160,184,0.25)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{wp.category}</span>
                </div>
              </div>
              <button type="button" className="del-btn" onClick={() => handleDelete(wp.id)}
                style={{
                  position: 'absolute', top: 6, right: 6,
                  width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(239,68,68,0.88)', border: 'none', cursor: 'pointer',
                  opacity: 0, transition: 'opacity 0.2s',
                }}>
                <Trash2 size={11} color="#fff" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
