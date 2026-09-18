'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, User, KeyRound } from 'lucide-react'

const INP: React.CSSProperties = {
  width: '100%',
  padding: '10px 10px 10px 34px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: 'rgba(242,242,244,0.9)',
  fontSize: 13,
  outline: 'none',
  caretColor: 'rgba(201,168,76,0.8)',
  transition: 'border-color 0.2s',
}

const LABEL: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'rgba(160,160,184,0.45)',
  marginBottom: 6,
}

export default function LoginPage() {
  const router = useRouter()
  const [username,  setUsername]  = useState('')
  const [password,  setPassword]  = useState('')
  const [totpCode,  setTotpCode]  = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [require2fa,setRequire2fa]= useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, totpCode: totpCode || undefined }),
    })
    const data = await res.json()
    if (data.require2fa) { setRequire2fa(true); setLoading(false); return }
    if (!res.ok) { setError(data.error ?? 'Giriş başarısız'); setLoading(false); return }
    router.push('/'); router.refresh()
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
      background: 'var(--void)',
    }}>
      {/* Subtle radial glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 55% 45% at 50% 40%, rgba(201,168,76,0.04) 0%, transparent 65%)',
      }} />

      <div style={{ width: '100%', maxWidth: 340, position: 'relative' }}>

        {/* ── Logo area ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <div style={{
            width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(201,168,76,0.07)',
            border: '1px solid rgba(201,168,76,0.2)',
            marginBottom: 12,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(242,242,244,0.9)' }}>
            MSG<span style={{ color: 'rgba(201,168,76,0.75)' }}>KO</span>
          </div>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(160,160,184,0.3)', marginTop: 4 }}>
            Yönetim Paneli
          </div>
        </div>

        {/* ── Form kartı ── */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Gold top line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.45), transparent)',
          }} />

          <form onSubmit={handleSubmit} style={{ padding: 24 }}>

            {!require2fa ? (
              <>
                {/* Kullanıcı adı */}
                <div style={{ marginBottom: 14 }}>
                  <label style={LABEL}>Kullanıcı Adı</label>
                  <div style={{ position: 'relative' }}>
                    <User size={13} color="rgba(160,160,184,0.3)"
                      style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type="text" value={username}
                      onChange={e => setUsername(e.target.value)}
                      required autoComplete="username" placeholder="admin"
                      style={INP}
                      onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(201,168,76,0.35)' }}
                      onBlur={e  => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
                    />
                  </div>
                </div>

                {/* Şifre */}
                <div style={{ marginBottom: 16 }}>
                  <label style={LABEL}>Şifre</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={13} color="rgba(160,160,184,0.3)"
                      style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required autoComplete="current-password" placeholder="••••••••"
                      style={{ ...INP, paddingRight: 34 }}
                      onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(201,168,76,0.35)' }}
                      onBlur={e  => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
                    />
                    <button type="button" onClick={() => setShowPass(v => !v)}
                      style={{
                        position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', padding: 0,
                        color: 'rgba(160,160,184,0.35)', cursor: 'pointer',
                      }}>
                      {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ marginBottom: 16 }}>
                <div style={{
                  padding: '10px 12px', marginBottom: 16,
                  background: 'rgba(201,168,76,0.06)',
                  border: '1px solid rgba(201,168,76,0.18)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span style={{ fontSize: 12, color: 'rgba(201,168,76,0.8)' }}>
                    Google Authenticator kodunu girin
                  </span>
                </div>
                <label style={LABEL}>2FA Kodu</label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={13} color="rgba(160,160,184,0.3)"
                    style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6}
                    value={totpCode}
                    onChange={e => setTotpCode(e.target.value.replace(/\D/g, ''))}
                    required autoFocus placeholder="000000"
                    style={{ ...INP, letterSpacing: '0.35em', textAlign: 'center', paddingLeft: 10 }}
                    onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(201,168,76,0.35)' }}
                    onBlur={e  => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
                  />
                </div>
              </div>
            )}

            {/* Hata */}
            {error && (
              <div style={{
                padding: '9px 12px', marginBottom: 12,
                background: 'rgba(239,68,68,0.07)',
                border: '1px solid rgba(239,68,68,0.22)',
                fontSize: 12, color: 'rgba(252,165,165,0.9)',
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '11px',
                fontSize: 11, fontWeight: 800,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: loading ? 'rgba(6,6,8,0.5)' : 'rgba(6,6,8,0.95)',
                background: loading
                  ? 'rgba(201,168,76,0.3)'
                  : 'linear-gradient(120deg, #C9A84C 0%, #DFC06A 50%, #C9A84C 100%)',
                border: '1px solid rgba(201,168,76,0.4)',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Giriş yapılıyor…' : require2fa ? 'Doğrula' : 'Giriş Yap'}
            </button>

            {require2fa && (
              <button
                type="button"
                onClick={() => { setRequire2fa(false); setTotpCode(''); setError('') }}
                style={{
                  width: '100%', marginTop: 8, padding: 8,
                  fontSize: 11, background: 'none', border: 'none',
                  color: 'rgba(160,160,184,0.3)', cursor: 'pointer',
                  letterSpacing: '0.06em',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(160,160,184,0.6)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(160,160,184,0.3)' }}
              >
                ← Geri dön
              </button>
            )}
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 10, marginTop: 14, color: 'rgba(160,160,184,0.15)', letterSpacing: '0.08em' }}>
          msgko.net · Yetkisiz erişim yasaktır
        </p>
      </div>
    </div>
  )
}
