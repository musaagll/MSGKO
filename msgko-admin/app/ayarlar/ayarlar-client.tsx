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

export default function AyarlarClient() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [tab, setTab] = useState<Tab>('genel')

  // 2FA
  const [totpUri, setTotpUri] = useState('')
  const [totpSecret, setTotpSecret] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [qrStep, setQrStep] = useState<'idle' | 'scan' | 'done'>('idle')

  // Şifre değiştirme
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [passMsg, setPassMsg] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => { setSettings(d); setLoading(false) })
      .catch(() => setLoading(false))
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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate' }),
    })
    const d = await res.json()
    setTotpUri(d.uri)
    setTotpSecret(d.secret)
    setQrStep('scan')
  }

  const handle2faVerify = async () => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify_and_enable', code: totpCode }),
    })
    if (res.ok) {
      setQrStep('done')
      setSettings(s => s ? { ...s, totp_enabled: true } : s)
      setMsg('✓ 2FA aktifleştirildi')
    } else {
      setMsg('✗ Geçersiz kod, tekrar dene')
    }
  }

  const handle2faDisable = async () => {
    if (!confirm('2FA\'yı devre dışı bırakmak istediğine emin misin?')) return
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'disable' }),
    })
    setSettings(s => s ? { ...s, totp_enabled: false } : s)
    setQrStep('idle')
    setMsg('2FA devre dışı bırakıldı')
  }

  const handlePassChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPassMsg('')
    if (newPass !== confirmPass) { setPassMsg('Şifreler eşleşmiyor'); return }
    if (newPass.length < 8) { setPassMsg('Şifre en az 8 karakter olmalı'); return }
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword: newPass }),
    })
    setPassMsg(res.ok ? '✓ Şifre güncellendi — .env.local dosyasını güncelleyin' : '✗ Hata')
    if (res.ok) { setNewPass(''); setConfirmPass('') }
  }

  const inp = 'w-full px-3 py-2.5 text-sm text-white outline-none transition-colors'
  const inpStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'genel', label: 'Genel' },
    { id: 'guvenlik', label: 'Güvenlik (2FA)' },
    { id: 'sifre', label: 'Şifre' },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Ayarlar</h1>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Site ve güvenlik ayarları</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {TABS.map(t => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)}
            className="px-4 py-2.5 text-sm font-medium transition-all relative"
            style={{ color: tab === t.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)' }}>
            {t.label}
            {tab === t.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: 'rgba(124,58,237,0.7)' }} />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-12 animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />)}</div>
      ) : (
        <>
          {/* ── Genel ── */}
          {tab === 'genel' && settings && (
            <form onSubmit={handleSave} className="space-y-4 max-w-lg">
              {[
                { key: 'site_title', label: 'Site Başlığı' },
                { key: 'site_description', label: 'Site Açıklaması' },
                { key: 'youtube_channel', label: 'YouTube Kanal URL' },
                { key: 'instagram_handle', label: 'Instagram Handle' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</label>
                  {key === 'site_description' ? (
                    <textarea rows={3} value={(settings as Record<string, string>)[key]}
                      onChange={e => setSettings(s => s ? { ...s, [key]: e.target.value } : s)}
                      className={inp + ' resize-none'} style={inpStyle} />
                  ) : (
                    <input type="text" value={(settings as Record<string, string>)[key]}
                      onChange={e => setSettings(s => s ? { ...s, [key]: e.target.value } : s)}
                      className={inp} style={inpStyle} />
                  )}
                </div>
              ))}
              {msg && <p className="text-sm" style={{ color: msg.startsWith('✓') ? '#4ade80' : '#f87171' }}>{msg}</p>}
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-40"
                style={{ background: 'rgba(124,58,237,0.8)', border: '1px solid rgba(124,58,237,0.5)' }}>
                <Save size={14} />
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              {settings.updated_at && (
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  Son güncelleme: {new Date(settings.updated_at).toLocaleString('tr-TR')}
                </p>
              )}
            </form>
          )}

          {/* ── 2FA ── */}
          {tab === 'guvenlik' && (
            <div className="max-w-lg space-y-6">
              {/* Durum */}
              <div className="flex items-center justify-between p-4"
                style={{ background: settings?.totp_enabled ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)', border: `1px solid ${settings?.totp_enabled ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
                <div className="flex items-center gap-3">
                  {settings?.totp_enabled
                    ? <CheckCircle size={18} style={{ color: '#4ade80' }} />
                    : <AlertCircle size={18} style={{ color: '#f87171' }} />
                  }
                  <div>
                    <p className="text-sm font-semibold" style={{ color: settings?.totp_enabled ? '#4ade80' : '#f87171' }}>
                      2FA {settings?.totp_enabled ? 'Aktif' : 'Devre Dışı'}
                    </p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      Google Authenticator ile doğrulama
                    </p>
                  </div>
                </div>
                {settings?.totp_enabled ? (
                  <button type="button" onClick={handle2faDisable}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all"
                    style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                    <ShieldOff size={12} /> Devre Dışı Bırak
                  </button>
                ) : (
                  <button type="button" onClick={handle2faGenerate}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all"
                    style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}>
                    <Shield size={12} /> Etkinleştir
                  </button>
                )}
              </div>

              {/* QR kod adımı */}
              {qrStep === 'scan' && (
                <div className="p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center gap-2">
                    <QrCode size={16} style={{ color: '#a78bfa' }} />
                    <p className="text-sm font-semibold text-white">Google Authenticator ile Tara</p>
                  </div>

                  {/* QR kod — otpauth URI'den QR üretmek için dışarıdan servis */}
                  <div className="flex justify-center py-4">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(totpUri)}`}
                      alt="2FA QR Kodu"
                      className="rounded"
                    />
                  </div>

                  <div className="p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Manuel giriş için secret:</p>
                    <p className="text-xs font-mono tracking-widest" style={{ color: '#a78bfa' }}>{totpSecret}</p>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Doğrulama Kodu</label>
                    <div className="flex gap-2">
                      <input type="text" inputMode="numeric" maxLength={6} value={totpCode}
                        onChange={e => setTotpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000" className={inp + ' tracking-[0.3em] text-center'}
                        style={{ ...inpStyle, maxWidth: 140 }} />
                      <button type="button" onClick={handle2faVerify} disabled={totpCode.length !== 6}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                        style={{ background: 'rgba(124,58,237,0.8)', border: '1px solid rgba(124,58,237,0.5)' }}>
                        <KeyRound size={14} /> Doğrula
                      </button>
                    </div>
                  </div>
                  {msg && <p className="text-sm" style={{ color: msg.startsWith('✓') ? '#4ade80' : '#f87171' }}>{msg}</p>}
                </div>
              )}

              {qrStep === 'done' && (
                <div className="p-4 flex items-center gap-3" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
                  <CheckCircle size={18} style={{ color: '#4ade80' }} />
                  <p className="text-sm" style={{ color: '#4ade80' }}>2FA başarıyla aktifleştirildi!</p>
                </div>
              )}
            </div>
          )}

          {/* ── Şifre ── */}
          {tab === 'sifre' && (
            <form onSubmit={handlePassChange} className="max-w-lg space-y-4">
              <div className="p-4" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <p className="text-xs" style={{ color: 'rgba(251,191,36,0.8)' }}>
                  Şifre değiştirildikten sonra yeni hash değerini <code className="font-mono">.env.local</code> dosyasındaki
                  <code className="font-mono"> ADMIN_PASSWORD_HASH</code> alanına manuel eklemeniz gerekir.
                  Sunucu yeniden başlatılana kadar eski şifre geçerliliğini korur.
                </p>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Yeni Şifre</label>
                <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} required minLength={8}
                  className={inp} style={inpStyle} placeholder="En az 8 karakter" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Şifreyi Onayla</label>
                <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} required
                  className={inp} style={inpStyle} placeholder="Tekrar girin" />
              </div>
              {passMsg && <p className="text-sm" style={{ color: passMsg.startsWith('✓') ? '#4ade80' : '#f87171' }}>{passMsg}</p>}
              <button type="submit"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white"
                style={{ background: 'rgba(124,58,237,0.8)', border: '1px solid rgba(124,58,237,0.5)' }}>
                <RefreshCw size={14} /> Şifreyi Güncelle
              </button>
            </form>
          )}
        </>
      )}
    </div>
  )
}
