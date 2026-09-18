'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, Save, X, ExternalLink, Eye, EyeOff } from 'lucide-react'

interface Video { id: number; title: string; youtube_id: string; published_at: string; sort_order: number; is_visible: boolean }

const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
const ytId    = (url: string) => { const m = url.match(/(?:v=|youtu\.be\/|shorts\/)([A-Za-z0-9_-]{11})/); return m ? m[1] : url }

const INP: React.CSSProperties = {
  padding: '9px 11px',
  background: 'rgba(255,255,255,0.035)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  fontSize: 12,
  outline: 'none',
  transition: 'border-color 0.15s',
}
const LABEL: React.CSSProperties = {
  display: 'block', fontSize: 9, fontWeight: 700,
  letterSpacing: '0.22em', textTransform: 'uppercase',
  color: 'rgba(160,160,184,0.4)', marginBottom: 5,
}
const BTN_PRIMARY: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 5,
  padding: '8px 16px', fontSize: 10, fontWeight: 800,
  letterSpacing: '0.16em', textTransform: 'uppercase',
  cursor: 'pointer',
  color: 'rgba(6,6,8,0.95)',
  background: 'linear-gradient(120deg, #C9A84C 0%, #DFC06A 50%, #C9A84C 100%)',
  border: '1px solid rgba(201,168,76,0.45)',
  transition: 'opacity 0.15s',
}

export default function VideosClient() {
  const [items,    setItems]    = useState<Video[]>([])
  const [loading,  setLoading]  = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing,  setEditing]  = useState<Video | null>(null)
  const [form,     setForm]     = useState({ title: '', youtube_url: '', published_at: new Date().toISOString().slice(0, 10) })
  const [msg,      setMsg]      = useState('')
  const [saving,   setSaving]   = useState(false)

  const load = () => {
    setLoading(true)
    fetch('/api/videos').then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setMsg('')
    const res = await fetch('/api/videos', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: form.title, youtube_id: ytId(form.youtube_url), published_at: new Date(form.published_at).toISOString(), sort_order: items.length }),
    })
    if (res.ok) { setMsg('✓'); setShowForm(false); setForm({ title: '', youtube_url: '', published_at: new Date().toISOString().slice(0, 10) }); load() }
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

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 3 }}>
            Video Yönetimi
          </h1>
          <p style={{ fontSize: 11, color: 'rgba(160,160,184,0.38)' }}>{items.length} video</p>
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
          {showForm ? 'İptal' : 'Video Ekle'}
        </button>
      </div>

      {/* ── Gold divider ── */}
      <div className="gold-line" style={{ marginBottom: 20 }} />

      {/* ── Form ── */}
      {showForm && (
        <form onSubmit={handleAdd} style={{
          padding: 20, marginBottom: 20,
          background: 'var(--surface)', border: '1px solid var(--border)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />
          <h2 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)', marginBottom: 16 }}>
            Yeni Video
          </h2>

          <div style={{ marginBottom: 12 }}>
            <label style={LABEL}>YouTube URL veya Video ID</label>
            <input type="text" value={form.youtube_url}
              onChange={e => setForm(f => ({ ...f, youtube_url: e.target.value }))} required
              placeholder="https://www.youtube.com/watch?v=…"
              style={{ ...INP, width: '100%' }}
              onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(201,168,76,0.35)' }}
              onBlur={e  => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)' }}
            />
            {form.youtube_url && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={ytThumb(ytId(form.youtube_url))} alt="" style={{ width: 100, aspectRatio: '16/9', objectFit: 'cover', border: '1px solid var(--border)' }} />
                <a href={`https://youtube.com/watch?v=${ytId(form.youtube_url)}`} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 11, color: 'rgba(201,168,76,0.6)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ExternalLink size={10} /> YouTube'da aç
                </a>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={LABEL}>Başlık</label>
              <input type="text" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
                placeholder="Video başlığı" style={{ ...INP, width: '100%' }}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(201,168,76,0.35)' }}
                onBlur={e  => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)' }}
              />
            </div>
            <div>
              <label style={LABEL}>Tarih</label>
              <input type="date" value={form.published_at}
                onChange={e => setForm(f => ({ ...f, published_at: e.target.value }))}
                style={{ ...INP, width: 160 }}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(201,168,76,0.35)' }}
                onBlur={e  => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)' }}
              />
            </div>
          </div>

          {msg && <p style={{ fontSize: 12, marginBottom: 10, color: msg.startsWith('✓') ? 'var(--green)' : 'var(--red)' }}>{msg}</p>}

          <button type="submit" disabled={saving} style={{ ...BTN_PRIMARY, opacity: saving ? 0.5 : 1 }}>
            {saving ? 'Kaydediliyor…' : 'Kaydet'}
          </button>
        </form>
      )}

      {/* ── Liste ── */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: 68, background: 'var(--surface)', border: '1px solid var(--border)', opacity: 0.5 }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', fontSize: 12, color: 'rgba(160,160,184,0.25)' }}>
          Henüz video yok
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {items.map(v => (
            <div key={v.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: 10,
              background: 'var(--surface)', border: '1px solid var(--border)',
              opacity: v.is_visible ? 1 : 0.45, transition: 'opacity 0.2s',
            }}>
              <img src={ytThumb(v.youtube_id)} alt="" style={{ width: 84, aspectRatio: '16/9', objectFit: 'cover', flexShrink: 0 }} />

              <div style={{ flex: 1, minWidth: 0 }}>
                {editing?.id === v.id ? (
                  <form onSubmit={handleEdit} style={{ display: 'flex', gap: 6 }}>
                    <input type="text" value={editing.title}
                      onChange={e => setEditing({ ...editing, title: e.target.value })}
                      style={{ flex: 1, ...INP, padding: '5px 8px', fontSize: 12 }}
                      onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(201,168,76,0.4)' }}
                      onBlur={e  => { (e.target as HTMLInputElement).style.borderColor = 'var(--border)' }}
                      autoFocus
                    />
                    <button type="submit" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                      <Save size={13} color="var(--green)" />
                    </button>
                    <button type="button" onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                      <X size={13} color="rgba(160,160,184,0.4)" />
                    </button>
                  </form>
                ) : (
                  <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {v.title}
                  </p>
                )}
                <p style={{ fontSize: 10, color: 'rgba(160,160,184,0.3)', marginTop: 2 }}>
                  {v.youtube_id} · {new Date(v.published_at).toLocaleDateString('tr-TR')}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <button type="button" onClick={() => handleToggle(v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  {v.is_visible
                    ? <Eye size={14} color="rgba(201,168,76,0.5)" />
                    : <EyeOff size={14} color="rgba(160,160,184,0.25)" />
                  }
                </button>
                <button type="button" onClick={() => setEditing(v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  <Edit2 size={13} color="rgba(160,160,184,0.4)" />
                </button>
                <a href={`https://youtube.com/watch?v=${v.youtube_id}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex' }}>
                  <ExternalLink size={12} color="rgba(160,160,184,0.3)" />
                </a>
                <button type="button" onClick={() => handleDelete(v.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  <Trash2 size={12} color="rgba(239,68,68,0.45)" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
