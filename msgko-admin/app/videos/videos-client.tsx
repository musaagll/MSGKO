'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, Save, X, ExternalLink, Eye, EyeOff } from 'lucide-react'

interface Video { id: number; title: string; youtube_id: string; published_at: string; sort_order: number; is_visible: boolean }

const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
const ytId = (url: string) => { const m = url.match(/(?:v=|youtu\.be\/|shorts\/)([A-Za-z0-9_-]{11})/); return m ? m[1] : url }

const inp: React.CSSProperties = {
  padding: '10px 12px', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, outline: 'none',
}

export default function VideosClient() {
  const [items, setItems] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Video | null>(null)
  const [form, setForm] = useState({ title: '', youtube_url: '', published_at: new Date().toISOString().slice(0, 10) })
  const [msg, setMsg] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => { setLoading(true); fetch('/api/videos').then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg('')
    const res = await fetch('/api/videos', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: form.title, youtube_id: ytId(form.youtube_url), published_at: new Date(form.published_at).toISOString(), sort_order: items.length }),
    })
    if (res.ok) { setMsg('✓ Eklendi'); setShowForm(false); setForm({ title: '', youtube_url: '', published_at: new Date().toISOString().slice(0, 10) }); load() }
    else { const d = await res.json(); setMsg(d.error ?? 'Hata') }
    setSaving(false)
  }

  const handleToggle = async (v: Video) => {
    await fetch('/api/videos', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: v.id, is_visible: !v.is_visible }) })
    load()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Silmek istiyor musun?')) return
    await fetch('/api/videos', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!editing) return; setSaving(true)
    await fetch('/api/videos', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing.id, title: editing.title }) })
    setEditing(null); setSaving(false); load()
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Video Yönetimi</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{items.length} video</p>
        </div>
        <button type="button" onClick={() => setShowForm(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'İptal' : 'Video Ekle'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleAdd} style={{ padding: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Yeni Video</h2>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>YouTube URL veya Video ID</label>
            <input type="text" value={form.youtube_url} onChange={e => setForm(f => ({ ...f, youtube_url: e.target.value }))} required
              placeholder="https://www.youtube.com/watch?v=..." style={{ ...inp, width: '100%' }} />
            {form.youtube_url && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={ytThumb(ytId(form.youtube_url))} alt="" style={{ width: 96, aspectRatio: '16/9', objectFit: 'cover' }} />
                <a href={`https://youtube.com/watch?v=${ytId(form.youtube_url)}`} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: 'rgba(167,139,250,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ExternalLink size={11} /> YouTube'da aç
                </a>
              </div>
            )}
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Başlık</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Video başlığı" style={{ ...inp, width: '100%' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Yayın Tarihi</label>
            <input type="date" value={form.published_at} onChange={e => setForm(f => ({ ...f, published_at: e.target.value }))} style={{ ...inp, width: 200 }} />
          </div>
          {msg && <p style={{ fontSize: 13, marginBottom: 12, color: msg.startsWith('✓') ? '#4ade80' : '#f87171' }}>{msg}</p>}
          <button type="submit" disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.75)', color: '#fff', opacity: saving ? 0.5 : 1 }}>
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
      )}

      {/* Liste */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...Array(3)].map((_, i) => <div key={i} style={{ height: 72, background: 'rgba(255,255,255,0.04)' }} />)}
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.25)' }}>Henüz video yok</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(v => (
            <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', opacity: v.is_visible ? 1 : 0.5 }}>
              <img src={ytThumb(v.youtube_id)} alt="" style={{ width: 80, aspectRatio: '16/9', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                {editing?.id === v.id ? (
                  <form onSubmit={handleEdit} style={{ display: 'flex', gap: 8 }}>
                    <input type="text" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })}
                      style={{ flex: 1, padding: '4px 8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(124,58,237,0.4)', color: '#fff', fontSize: 13, outline: 'none' }} />
                    <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Save size={14} color="#4ade80" /></button>
                    <button type="button" onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={14} color="rgba(255,255,255,0.4)" /></button>
                  </form>
                ) : (
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title}</p>
                )}
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                  ID: {v.youtube_id} · {new Date(v.published_at).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <button type="button" onClick={() => handleToggle(v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {v.is_visible ? <Eye size={15} color="rgba(255,255,255,0.4)" /> : <EyeOff size={15} color="rgba(255,255,255,0.2)" />}
                </button>
                <button type="button" onClick={() => setEditing(v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <Edit2 size={14} color="rgba(167,139,250,0.6)" />
                </button>
                <a href={`https://youtube.com/watch?v=${v.youtube_id}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={13} color="rgba(255,255,255,0.3)" />
                </a>
                <button type="button" onClick={() => handleDelete(v.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <Trash2 size={13} color="rgba(239,68,68,0.6)" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
