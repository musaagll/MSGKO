'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Shield, Lock, User, KeyRound } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [require2fa, setRequire2fa] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 12px 12px 36px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: 14, outline: 'none',
    caretColor: '#a78bfa',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, background: 'linear-gradient(135deg,#09090f 0%,#0f0a1e 50%,#09090f 100%)',
    }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)', marginBottom: 12,
          }}>
            <Shield size={24} color="#a78bfa" />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '0.1em' }}>MSGKO Admin</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Yönetim Paneli</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          padding: 24, background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)', position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg,transparent,rgba(124,58,237,0.6),transparent)',
          }} />

          {!require2fa ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                  Kullanıcı Adı
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                    required autoComplete="username" placeholder="admin" style={inp} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                  Şifre
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    required autoComplete="current-password" placeholder="••••••••"
                    style={{ ...inp, paddingRight: 36 }} />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, color: 'rgba(255,255,255,0.3)' }}>
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <div style={{ padding: 12, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={14} color="#a78bfa" />
                <span style={{ fontSize: 12, color: 'rgba(167,139,250,0.9)' }}>Google Authenticator kodunu girin</span>
              </div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                2FA Kodu
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6}
                  value={totpCode} onChange={e => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  required autoFocus placeholder="000000"
                  style={{ ...inp, letterSpacing: '0.3em', textAlign: 'center' }} />
              </div>
            </div>
          )}

          {error && (
            <div style={{ padding: 10, marginBottom: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: 13 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', fontSize: 13, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff',
            background: loading ? 'rgba(124,58,237,0.4)' : 'rgba(124,58,237,0.9)',
            border: '1px solid rgba(124,58,237,0.5)', cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'Giriş yapılıyor...' : require2fa ? 'Doğrula' : 'Giriş Yap'}
          </button>

          {require2fa && (
            <button type="button" onClick={() => { setRequire2fa(false); setTotpCode(''); setError('') }}
              style={{ width: '100%', marginTop: 8, padding: 8, fontSize: 12, background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
              ← Geri dön
            </button>
          )}
        </form>

        <p style={{ textAlign: 'center', fontSize: 11, marginTop: 16, color: 'rgba(255,255,255,0.15)' }}>
          msgko.net • Yetkisiz erişim yasaktır
        </p>
      </div>
    </div>
  )
}
