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
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, totpCode: totpCode || undefined }),
    })
    const data = await res.json()

    if (data.require2fa) {
      setRequire2fa(true)
      setLoading(false)
      return
    }

    if (!res.ok) {
      setError(data.error ?? 'Giriş başarısız')
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #09090f 0%, #0f0a1e 50%, #09090f 100%)' }}>

      {/* Arka plan glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 70%)' }} />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 flex items-center justify-center mb-4"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 2 }}>
            <Shield size={28} style={{ color: '#a78bfa' }} />
          </div>
          <h1 className="text-xl font-bold tracking-widest uppercase text-white">MSGKO Admin</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Yönetim Paneli</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}
          className="p-6 space-y-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>

          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.6), transparent)' }} />

          {!require2fa ? (
            <>
              {/* Username */}
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase mb-2"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Kullanıcı Adı
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    className="w-full pl-9 pr-4 py-3 text-sm text-white outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      caretColor: '#a78bfa',
                    }}
                    placeholder="admin"
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase mb-2"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Şifre
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full pl-9 pr-10 py-3 text-sm text-white outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      caretColor: '#a78bfa',
                    }}
                    placeholder="••••••••"
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* 2FA kodu */
            <div>
              <div className="flex items-center gap-2 mb-4 p-3"
                style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
                <Shield size={14} style={{ color: '#a78bfa' }} />
                <p className="text-xs" style={{ color: 'rgba(167,139,250,0.9)' }}>
                  Google Authenticator kodunu girin
                </p>
              </div>
              <label className="block text-xs font-semibold tracking-widest uppercase mb-2"
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                2FA Kodu
              </label>
              <div className="relative">
                <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={totpCode}
                  onChange={e => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  required
                  autoFocus
                  className="w-full pl-9 pr-4 py-3 text-sm text-white outline-none tracking-[0.3em] text-center"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    caretColor: '#a78bfa',
                  }}
                  placeholder="000000"
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 text-xs font-medium"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-bold tracking-widest uppercase text-white transition-all disabled:opacity-50"
            style={{
              background: loading ? 'rgba(124,58,237,0.4)' : 'rgba(124,58,237,0.9)',
              border: '1px solid rgba(124,58,237,0.5)',
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(124,58,237,1)' }}
            onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(124,58,237,0.9)' }}
          >
            {loading ? 'Giriş yapılıyor...' : require2fa ? 'Doğrula' : 'Giriş Yap'}
          </button>

          {require2fa && (
            <button type="button" onClick={() => { setRequire2fa(false); setTotpCode(''); setError('') }}
              className="w-full text-xs text-center py-2 transition-colors"
              style={{ color: 'rgba(255,255,255,0.3)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
              ← Geri dön
            </button>
          )}
        </form>

        <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.15)' }}>
          msgko.net • Yetkisiz erişim yasaktır
        </p>
      </div>
    </div>
  )
}
