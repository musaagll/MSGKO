'use client'

import { useEffect, useState } from 'react'
import { Save, Shield, ShieldOff, QrCode, CheckCircle, AlertCircle, KeyRound } from 'lucide-react'

interface Settings {
  id: number; totp_enabled: boolean; site_title: string;
  site_description: string; youtube_channel: string; instagram_handle: string; updated_at: string
}
type Tab = 'genel' | 'guvenlik' | 'sifre'

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
const FOCUS_GOLD = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  (e.target as HTMLElement).style.borderColor = 'rgba(201,168,76,0.35)'
}
const BLUR_DEFAULT = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  (e.target as HTMLElement).style.borderColor = 'var(--border)'
}

export default function AyarlarClient() {
  const [settings,    setSettings]    = useState<Settings | null>(null)
  const [loading,     setLoading]     = useState(true)
  const [saving,      setSaving]      = useState(false)
  const [msg,         setMsg]         = useState('')
  const [tab,         setTab]         = useState<Tab>('genel')
  const [totpUri,     setTotpUri]     = useState('')
  const [totpSecret,  setTotpSecret]  = useState('')
  const [totpCode,    setTotpCode]    = useState('')
  const [qrStep,      setQrStep]      = useState<'idle' | 'scan' | 'done'>('idle')
  const [newPass,     setNewPass]     = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [passMsg,     setPassMsg]     = useState('')

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => { setSettings(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); if (!settings) return
    setSaving(true); setMsg('')
    const res = await fetch('/api/settings', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ site_title: settings.site_title, site_description: settings.site_description, youtube_channel: settings.youtube_channel, instagram_handle: settings.instagram_handle }),
    })
    setMsg(res.ok ? '✓ Kaydedildi' : '✗ Hata oluştu'); setSaving(false)
  }

  const handle2faGenerate = async () => {
    const res = await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'generate' }) })
    const d = await res.json(); setTotpUri(d.uri); setTotpSecret(d.secret); setQrStep('scan')
  }

  const handle2faVerify = async () => {
    const res = await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'verify_and_enable', code: totpCode }) })
    if (res.ok) { setQrStep('done'); setSettings(s => s ? { ...s, totp_enabled: true } : s); setMsg('✓ 2FA aktifleştirildi') }
    else setMsg('✗ Geçersiz kod')
  }

  const handle2faDisable = async () => {
    if (!confirm('2FA\'yı devre dışı bırakmak istediğine emin misin?')) return
    await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'disable' }) })
    setSettings(s => s ? { ...s, totp_enabled: false } : s); setQrStep('idle'); setMsg('2FA devre dışı')
  }

  const handlePassChange = async (e: React.FormEvent) => {
    e.preventDefault(); setPassMsg('')
    if (newPass !== confirmPass) { setPassMsg('Şifreler eşleşmiyor'); return }
    if (newPass.length < 8) { setPassMsg('En az 8 karakter'); return }
    const res = await fetch('/api/auth/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ newPassword: newPass }) })
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

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 3 }}>
          Ayarlar
        </h1>
        <p style={{ fontSize: 11, color: 'rgba(160,160,184,0.38)' }}>Site ve güvenlik ayarları</p>
      </div>

      <div className="gold-line" style={{ marginBottom: 20 }} />

      {/* ── Tab bar ── */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
        {TABS.map(t => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)}
            style={{
              padding: '9px 16px', fontSize: 11, fontWeight: tab === t.id ? 700 : 400,
              background: 'none', border: 'none', cursor: 'pointer',
              letterSpacing: tab === t.id ? '0.08em' : '0.04em',
              color: tab === t.id ? 'rgba(242,242,244,0.9)' : 'rgba(160,160,184,0.38)',
              borderBottom: tab === t.id ? '2px solid rgba(201,168,76,0.65)' : '2px solid transparent',
              marginBottom: -1, transition: 'color 0.15s',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: 42, background: 'var(--surface)', border: '1px solid var(--border)', opacity: 0.5 }} />
          ))}
        </div>
      ) : (
        <>
          {/* ── Genel ── */}
          {tab === 'genel' && settings && (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 500 }}>
              {[
                { key: 'site_title' as const,       label: 'Site Başlığı',    type: 'text' },
                { key: 'youtube_channel' as const,  label: 'YouTube Kanal',   type: 'text' },
                { key: 'instagram_handle' as const, label: 'Instagram Handle', type: 'text' },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label style={LABEL}>{label}</label>
                  <input
                    type={type} value={settings[key]}
                    onChange={e => setSettings(s => s ? { ...s, [key]: e.target.value } : s)}
                    style={INP} onFocus={FOCUS_GOLD} onBlur={BLUR_DEFAULT}
                  />
                </div>
              ))}
              <div>
                <label style={LABEL}>Site Açıklaması</label>
                <textarea rows={3} value={settings.site_description}
                  onChange={e => setSettings(s => s ? { ...s, site_description: e.target.value } : s)}
                  style={{ ...INP, resize: 'none' }}
                  onFocus={FOCUS_GOLD as unknown as React.FocusEventHandler<HTMLTextAreaElement>}
                  onBlur={BLUR_DEFAULT as unknown as React.FocusEventHandler<HTMLTextAreaElement>}
                />
              </div>

              {msg && <p style={{ fontSize: 12, color: msg.startsWith('✓') ? 'var(--green)' : 'var(--red)' }}>{msg}</p>}

              <button type="submit" disabled={saving}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5, width: 'fit-content',
                  padding: '8px 18px', fontSize: 10, fontWeight: 800,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'rgba(6,6,8,0.95)',
                  background: 'linear-gradient(120deg, #C9A84C 0%, #DFC06A 50%, #C9A84C 100%)',
                  border: '1px solid rgba(201,168,76,0.45)',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.5 : 1, transition: 'opacity 0.15s',
                }}>
                <Save size={11} />
                {saving ? 'Kaydediliyor…' : 'Kaydet'}
              </button>
            </form>
          )}

          {/* ── 2FA ── */}
          {tab === 'guvenlik' && (
            <div style={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Durum kartı */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px',
                background: settings?.totp_enabled ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
                border: `1px solid ${settings?.totp_enabled ? 'rgba(34,197,94,0.22)' : 'rgba(239,68,68,0.22)'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {settings?.totp_enabled
                    ? <CheckCircle size={16} color="rgba(34,197,94,0.8)" />
                    : <AlertCircle size={16} color="rgba(239,68,68,0.7)" />
                  }
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: settings?.totp_enabled ? 'rgba(74,222,128,0.9)' : 'rgba(252,165,165,0.8)' }}>
                      2FA {settings?.totp_enabled ? 'Aktif' : 'Devre Dışı'}
                    </p>
                    <p style={{ fontSize: 10, color: 'rgba(160,160,184,0.35)', marginTop: 1 }}>Google Authenticator</p>
                  </div>
                </div>
                {settings?.totp_enabled ? (
                  <button type="button" onClick={handle2faDisable}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '6px 12px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.28)', color: 'rgba(252,165,165,0.8)', cursor: 'pointer',
                    }}>
                    <ShieldOff size={11} /> Devre Dışı
                  </button>
                ) : (
                  <button type="button" onClick={handle2faGenerate}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '6px 12px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                      background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)', color: 'rgba(201,168,76,0.8)', cursor: 'pointer',
                    }}>
                    <Shield size={11} /> Etkinleştir
                  </button>
                )}
              </div>

              {/* QR adımı */}
              {qrStep === 'scan' && (
                <div style={{
                  padding: 18, background: 'var(--surface)', border: '1px solid var(--border)',
                  display: 'flex', flexDirection: 'column', gap: 14,
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <QrCode size={14} color="rgba(201,168,76,0.7)" />
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>Google Authenticator ile Tara</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(totpUri)}`}
                      alt="2FA QR" style={{ border: '1px solid var(--border)' }} />
                  </div>
                  <div style={{ padding: '9px 12px', background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 9, color: 'rgba(160,160,184,0.35)', marginBottom: 4 }}>Manuel giriş için secret:</p>
                    <p style={{ fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.18em', color: 'rgba(201,168,76,0.75)' }}>{totpSecret}</p>
                  </div>
                  <div>
                    <label style={LABEL}>Doğrulama Kodu</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input type="text" inputMode="numeric" maxLength={6} value={totpCode}
                        onChange={e => setTotpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        style={{ ...INP, maxWidth: 130, textAlign: 'center', letterSpacing: '0.32em' }}
                        onFocus={FOCUS_GOLD} onBlur={BLUR_DEFAULT}
                      />
                      <button type="button" onClick={handle2faVerify} disabled={totpCode.length !== 6}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '9px 16px', fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase',
                          color: 'rgba(6,6,8,0.95)',
                          background: 'linear-gradient(120deg, #C9A84C 0%, #DFC06A 50%, #C9A84C 100%)',
                          border: '1px solid rgba(201,168,76,0.45)',
                          cursor: totpCode.length !== 6 ? 'not-allowed' : 'pointer',
                          opacity: totpCode.length !== 6 ? 0.4 : 1, transition: 'opacity 0.15s',
                        }}>
                        <KeyRound size={11} /> Doğrula
                      </button>
                    </div>
                  </div>
                  {msg && <p style={{ fontSize: 12, color: msg.startsWith('✓') ? 'var(--green)' : 'var(--red)' }}>{msg}</p>}
                </div>
              )}
            </div>
          )}

          {/* ── Şifre ── */}
          {tab === 'sifre' && (
            <div style={{ maxWidth: 400 }}>
              {/* Uyarı */}
              <div style={{
                padding: '11px 14px', marginBottom: 18,
                background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.18)',
                fontSize: 11, color: 'rgba(201,168,76,0.7)', lineHeight: 1.65,
              }}>
                Yeni hash üretilir — bunu <strong style={{ color: 'rgba(201,168,76,0.9)' }}>.env.local</strong> dosyasına manuel kaydet.
              </div>

              <form onSubmit={handlePassChange} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={LABEL}>Yeni Şifre</label>
                  <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)}
                    required minLength={8} placeholder="En az 8 karakter" style={INP}
                    onFocus={FOCUS_GOLD} onBlur={BLUR_DEFAULT} />
                </div>
                <div>
                  <label style={LABEL}>Şifre Tekrar</label>
                  <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
                    required placeholder="••••••••" style={INP}
                    onFocus={FOCUS_GOLD} onBlur={BLUR_DEFAULT} />
                </div>

                {passMsg && (
                  <p style={{
                    fontSize: 12, lineHeight: 1.5, wordBreak: 'break-all',
                    color: passMsg.startsWith('✓') ? 'var(--green)' : 'var(--red)',
                    fontFamily: passMsg.includes('$') ? 'monospace' : 'inherit',
                  }}>
                    {passMsg}
                  </p>
                )}

                <button type="submit"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5, width: 'fit-content',
                    padding: '8px 18px', fontSize: 10, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: 'rgba(6,6,8,0.95)',
                    background: 'linear-gradient(120deg, #C9A84C 0%, #DFC06A 50%, #C9A84C 100%)',
                    border: '1px solid rgba(201,168,76,0.45)', cursor: 'pointer',
                  }}>
                  <KeyRound size={11} /> Hash Üret
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  )
}
