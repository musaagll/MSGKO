'use client'

import { useEffect, useState } from 'react'
import { Save, Shield, ShieldOff, QrCode, CheckCircle, AlertCircle, KeyRound, RefreshCw } from 'lucide-react'

interface Settings {
  id: number
  totp_enabled: boolean
  site_title: string
  site_description: string
  youtube_channel: string
  instagram_handle: string
  updated_at: string
}

type Tab = 'genel' | 'guvenlik' | 'sifre'

const inpStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: 13, outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600,
  letterSpacing: '0.12em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.4)', marginBottom: 8,
}

export default function AyarlarClient() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [tab, setTab] = useState<Tab>('genel')
  const [totpUri, setTotpUri] = useState('')
  const [totpSecret, setTotpSecret] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [qrStep, setQrStep] = useState<'idle' | 'scan' | 'done'>('idle')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [passMsg, setPassMsg] = useState('')

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => { setSettings(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return
    setSaving(true); setMsg('')
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        site_title: settings.site_title,
        site_description: settings.site_description,
        youtube_channel: settings.youtube_channel,
        instagram_handle: settings.instagram_handle,
      }),
    })
    setMsg(res.ok ? '✓ Kaydedildi' : '✗ Hata oluştu')
    setSaving(false)
  }

  const handle2faGenerate = async () => {
    const res = await fetch('/api/settings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate' }),
    })
    const d = await res.json()
    setTotpUri(d.uri); setTotpSecret(d.secret); setQrStep('scan')
  }

  const handle2faVerify = async () => {
    const res = await fetch('/api/settings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify_and_enable', code: totpCode }),
    })
    if (res.ok) { setQrStep('done'); setSettings(s => s ? { ...s, totp_enabled: true } : s); setMsg('✓ 2FA aktifleştirildi') }
    else setMsg('✗ Geçersiz kod')
  }

  const handle2faDisable = async () => {
    if (!confirm('2FA\'yı devre dışı bırakmak istediğine emin misin?')) return
    await fetch('/api/settings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'disable' }),
    })
    setSettings(s => s ? { ...s, totp_enabled: false } : s); setQrStep('idle'); setMsg('2FA devre dışı')
  }

  const handlePassChange = async (e: React.FormEvent) => {
    e.preventDefault(); setPassMsg('')
    if (newPass !== confirmPass) { setPassMsg('Şifreler eşleşmiyor'); return }
    if (newPass.length < 8) { setPassMsg('En az 8 karakter'); return }
    const res = await fetch('/api/auth/change-password', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword: newPass }),
    })
    const d = await res.json()
    setPassMsg(res.ok ? `✓ Yeni hash: ${d.hash}` : '✗ Hata')
    if (res.ok) { setNewPass(''); setConfirmPass('') }
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'genel', label: 'Genel' },
    { id: 'guvenlik', label: 'Güvenlik (2FA)' },
    { id: 'sifre', label: 'Şifre' },
  ]

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Ayarlar</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Site ve güvenlik ayarları</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {TABS.map(t => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)}
            style={{
              padding: '10px 16px', fontSize: 13, fontWeight: 500, background: 'none',
              border: 'none', cursor: 'pointer', position: 'relative',
              color: tab === t.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)',
              borderBottom: tab === t.id ? '2px solid rgba(124,58,237,0.7)' : '2px solid transparent',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...Array(4)].map((_, i) => <div key={i} style={{ height: 44, background: 'rgba(255,255,255,0.04)' }} />)}
        </div>
      ) : (
        <>
          {/* ── Genel ── */}
          {tab === 'genel' && settings && (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 520 }}>
              <div>
                <label style={labelStyle}>Site Başlığı</label>
                <input type="text" value={settings.site_title}
                  onChange={e => setSettings(s => s ? { ...s, site_title: e.target.value } : s)}
                  style={inpStyle} />
              </div>
              <div>
                <label style={labelStyle}>Site Açıklaması</label>
                <textarea rows={3} value={settings.site_description}
                  onChange={e => setSettings(s => s ? { ...s, site_description: e.target.value } : s)}
                  style={{ ...inpStyle, resize: 'none' }} />
              </div>
              <div>
                <label style={labelStyle}>YouTube Kanal URL</label>
                <input type="text" value={settings.youtube_channel}
                  onChange={e => setSettings(s => s ? { ...s, youtube_channel: e.target.value } : s)}
                  style={inpStyle} />
              </div>
              <div>
                <label style={labelStyle}>Instagram Handle</label>
                <input type="text" value={settings.instagram_handle}
                  onChange={e => setSettings(s => s ? { ...s, instagram_handle: e.target.value } : s)}
                  style={inpStyle} />
              </div>
              {msg && <p style={{ fontSize: 13, color: msg.startsWith('✓') ? '#4ade80' : '#f87171' }}>{msg}</p>}
              <button type="submit" disabled={saving}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'rgba(124,58,237,0.8)', border: '1px solid rgba(124,58,237,0.5)', color: '#fff', opacity: saving ? 0.5 : 1, width: 'fit-content' }}>
                <Save size={14} />{saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </form>
          )}

          {/* ── 2FA ── */}
          {tab === 'guvenlik' && (
            <div style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: settings?.totp_enabled ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)', border: `1px solid ${settings?.totp_enabled ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {settings?.totp_enabled ? <CheckCircle size={18} color="#4ade80" /> : <AlertCircle size={18} color="#f87171" />}
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: settings?.totp_enabled ? '#4ade80' : '#f87171' }}>
                      2FA {settings?.totp_enabled ? 'Aktif' : 'Devre Dışı'}
                    </p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Google Authenticator</p>
                  </div>
                </div>
                {settings?.totp_enabled ? (
                  <button type="button" onClick={handle2faDisable}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                    <ShieldOff size={12} /> Devre Dışı
                  </button>
                ) : (
                  <button type="button" onClick={handle2faGenerate}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}>
                    <Shield size={12} /> Etkinleştir
                  </button>
                )}
              </div>

              {qrStep === 'scan' && (
                <div style={{ padding: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <QrCode size={16} color="#a78bfa" />
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Google Authenticator ile Tara</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(totpUri)}`} alt="2FA QR" style={{ borderRadius: 4 }} />
                  </div>
                  <div style={{ padding: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>Manuel giriş için secret:</p>
                    <p style={{ fontSize: 12, fontFamily: 'monospace', letterSpacing: '0.2em', color: '#a78bfa' }}>{totpSecret}</p>
                  </div>
                  <div>
                    <label style={labelStyle}>Doğrulama Kodu</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input type="text" inputMode="numeric" maxLength={6} value={totpCode}
                        onChange={e => setTotpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        style={{ ...inpStyle, maxWidth: 140, textAlign: 'center', letterSpacing: '0.3em' }} />
                      <button type="button" onClick={handle2faVerify} disabled={totpCode.length !== 6}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'rgba(124,58,237,0.8)', border: '1px solid rgba(124,58,237,0.5)', color: '#fff', opacity: totpCode.length !== 6 ? 0.4 : 1 }}>
                        <KeyRound size={14} /> Doğrula
                      </button>
                    </div>
                  </div>
                  {msg && <p style={{ fontSize: 13, color: msg.startsWith('✓') ? '#4ade80' : '#f87171' }}>{msg}</p>}
                </div>
              )}

              {qrStep === 'done' && (
                <div style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
                  <CheckCircle size={18} color="#4ade80" />
                  <p style={{ fontSize: 13, color: '#4ade80' }}>2FA başarıyla aktifleştirildi!</p>
                </div>
              )}
            </div>
          )}

          {/* ── Şifre ── */}
          {tab === 'sifre' && (
            <form onSubmit={handlePassChange} style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: 12, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', fontSize: 12, color: 'rgba(251,191,36,0.8)', lineHeight: 1.6 }}>
                Şifre değiştirilince yeni hash değerini .env.local dosyasına eklemeniz gerekir.
              </div>
              <div>
                <label style={labelStyle}>Yeni Şifre</label>
                <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} required minLength={8} placeholder="En az 8 karakter" style={inpStyle} />
              </div>
              <div>
                <label style={labelStyle}>Şifreyi Onayla</label>
                <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} required placeholder="Tekrar girin" style={inpStyle} />
              </div>
              {passMsg && <p style={{ fontSize: 12, color: passMsg.startsWith('✓') ? '#4ade80' : '#f87171', wordBreak: 'break-all' }}>{passMsg}</p>}
              <button type="submit"
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'rgba(124,58,237,0.8)', border: '1px solid rgba(124,58,237,0.5)', color: '#fff', width: 'fit-content' }}>
                <RefreshCw size={14} /> Şifreyi Güncelle
              </button>
            </form>
          )}
        </>
      )}
    </div>
  )
}
