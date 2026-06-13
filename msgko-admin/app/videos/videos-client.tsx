'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, Save, X, ExternalLink, Eye, EyeOff } from 'lucide-react'

interface Video { id: number; title: string; youtube_id: string; published_at: string; sort_order: number; is_visible: boolean }

function ytThumb(id: string) { return `https://i.ytimg.com/vi/${id}/hqdefault.jpg` }
function ytIdFromUrl(url: string): string {
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : url
}

export default function VideosClient() {
  const [items, setItems] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Video | null>(null)
  const [form, setForm] = useState({ title: '', youtube_url: '', published_at: new Date().toISOString().slice(0, 10) })
  const [msg, setMsg] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    fetch('/api/videos').then(r => r.json()).then(d => { setItems(d); setLoading(false) }).catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setMsg('')
    const res = await fetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        youtube_id: ytIdFromUrl(form.youtube_url),
        published_at: new Date(form.published_at).toISOString(),
        sort_order: items.length,
      }),
    })
    if (res.ok) { setMsg('✓ Eklendi'); setShowForm(false); setForm({ title: '', youtube_url: '', published_at: new Date().toISOString().slice(0, 10) }); load() }
    else { const d = await res.json(); setMsg(d.error ?? 'Hata') }
    setSaving(false)
  }

  const handleToggleVisible = async (v: Video) => {
    await fetch('/api/videos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: v.id, is_visible: !v.is_visible }),
    })
    load()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bu videoyu silmek istediğine emin misin?')) return
    await fetch('/api/videos', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setSaving(true)
    await fetch('/api/videos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editing.id, title: editing.title }),
    })
    setEditing(null); setSaving(false); load()
  }

  const inp = "w-full px-3 py-2.5 text-sm text-white outline-none"
  const inpStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Video Yönetimi</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{items.length} video</p>
        </div>
        <button type="button" onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all"
          style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.22)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.12)')}>
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? 'İptal' : 'Video Ekle'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="p-5 mb-6 space-y-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="text-sm font-semibold text-white">Yeni Video</h2>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>YouTube URL veya Video ID</label>
            <input type="text" value={form.youtube_url} onChange={e => setForm(f => ({ ...f, youtube_url: e.target.value }))} required
              placeholder="https://www.youtube.com/watch?v=..." className={inp} style={inpStyle} />
            {form.youtube_url && (
              <div className="mt-2 flex items-center gap-3">
                <img src={ytThumb(ytIdFromUrl(form.youtube_url))} alt="" className="w-24 aspect-video object-cover" />
                <a href={`https://youtube.com/watch?v=${ytIdFromUrl(form.youtube_url)}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs flex items-center gap-1" style={{ color: 'rgba(167,139,250,0.7)' }}>
                  <ExternalLink size={11} /> YouTube'da aç
                </a>
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Video Başlığı</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
              placeholder="Video başlığını girin" className={inp} style={inpStyle} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Yayın Tarihi</label>
            <input type="date" value={form.published_at} onChange={e => setForm(f => ({ ...f, published_at: e.target.value }))}
              className={inp} style={inpStyle} />
          </div>
          {msg && <p className="text-sm" style={{ color: msg.startsWith('✓') ? '#4ade80' : '#f87171' }}>{msg}</p>}
          <button type="submit" disabled={saving}
            className="px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-40 text-white"
            style={{ background: 'rgba(239,68,68,0.8)', border: '1px solid rgba(239,68,68,0.5)' }}>
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
      )}

      {/* Liste */}
      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-20 animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.25)' }}><p>Henüz video yok</p></div>
      ) : (
        <div className="space-y-2">
          {items.map(v => (
            <div key={v.id} className="flex items-center gap-4 p-3 transition-all"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', opacity: v.is_visible ? 1 : 0.5 }}>
              <img src={ytThumb(v.youtube_id)} alt="" className="w-20 aspect-video object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                {editing?.id === v.id ? (
                  <form onSubmit={handleEdit} className="flex gap-2">
                    <input type="text" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })}
                      className="flex-1 px-2 py-1 text-sm text-white outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(124,58,237,0.4)' }} />
                    <button type="submit" disabled={saving}><Save size={14} style={{ color: '#4ade80' }} /></button>
                    <button type="button" onClick={() => setEditing(null)}><X size={14} style={{ color: 'rgba(255,255,255,0.4)' }} /></button>
                  </form>
                ) : (
                  <p className="text-sm font-medium text-white truncate">{v.title}</p>
                )}
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  ID: {v.youtube_id} · {new Date(v.published_at).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button type="button" onClick={() => handleToggleVisible(v)} title={v.is_visible ? 'Gizle' : 'Göster'}>
                  {v.is_visible ? <Eye size={15} style={{ color: 'rgba(255,255,255,0.4)' }} /> : <EyeOff size={15} style={{ color: 'rgba(255,255,255,0.2)' }} />}
                </button>
                <button type="button" onClick={() => setEditing(v)}>
                  <Edit2 size={15} style={{ color: 'rgba(167,139,250,0.6)' }} />
                </button>
                <a href={`https://youtube.com/watch?v=${v.youtube_id}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
                </a>
                <button type="button" onClick={() => handleDelete(v.id)}>
                  <Trash2 size={14} style={{ color: 'rgba(239,68,68,0.6)' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
