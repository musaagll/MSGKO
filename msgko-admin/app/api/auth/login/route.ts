import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { createSession, getJwtSecret, COOKIE, EXPIRES_IN } from '@/lib/auth'

// ── Basit brute-force koruması (instance başına) ────────────────────────────
const WINDOW_MS = 15 * 60_000
const MAX_FAILS = 8
const fails = new Map<string, { count: number; reset: number }>()

function isLocked(ip: string): boolean {
  const e = fails.get(ip)
  return !!e && e.reset > Date.now() && e.count >= MAX_FAILS
}
function recordFail(ip: string) {
  const now = Date.now()
  const e = fails.get(ip)
  if (!e || e.reset < now) fails.set(ip, { count: 1, reset: now + WINDOW_MS })
  else e.count++
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

const reject = (msg: string) =>
  new Promise<NextResponse>(r => setTimeout(() => r(NextResponse.json({ error: msg }, { status: 401 })), 400))

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isLocked(ip)) {
    return NextResponse.json({ error: 'Çok fazla başarısız deneme. 15 dakika sonra tekrar deneyin.' }, { status: 429 })
  }

  try {
    if (!getJwtSecret()) {
      console.error('Login devre dışı: ADMIN_JWT_SECRET tanımlı değil')
      return NextResponse.json({ error: 'Sunucu yapılandırması eksik' }, { status: 500 })
    }

    const { username, password, totpCode } = await req.json()
    if (typeof username !== 'string' || typeof password !== 'string' || !password) {
      recordFail(ip)
      return reject('Geçersiz kimlik bilgileri')
    }

    // Kullanıcı adı gizli değil; mevcut kurulumla uyum için varsayılan 'admin' korunuyor
    const expectedUsername = process.env.ADMIN_USERNAME || 'admin'
    if (!safeEqual(username, expectedUsername)) {
      recordFail(ip)
      return reject('Geçersiz kimlik bilgileri')
    }

    // Şifre: önce bcrypt hash, yoksa (boş olmayan) düz ADMIN_PASSWORD
    let valid = false
    const hash = process.env.ADMIN_PASSWORD_HASH
    const plain = process.env.ADMIN_PASSWORD
    if (hash) {
      const { compare } = await import('bcryptjs')
      valid = await compare(password, hash).catch(() => false)
    }
    if (!valid && plain) valid = safeEqual(password, plain)

    if (!valid) {
      recordFail(ip)
      return reject('Geçersiz kimlik bilgileri')
    }

    // 2FA — ayar okunamazsa giriş REDDEDİLİR (fail-closed)
    const { createServiceClient } = await import('@/lib/supabase')
    const supabase = createServiceClient()
    const { data: settings, error: settingsError } = await supabase
      .from('admin_settings')
      .select('totp_secret, totp_enabled')
      .single()

    if (settingsError) {
      console.error('Login: admin_settings okunamadı:', settingsError.message)
      return NextResponse.json({ error: 'Doğrulama servisine ulaşılamadı' }, { status: 503 })
    }

    if (settings?.totp_enabled && settings?.totp_secret) {
      if (!totpCode) {
        return NextResponse.json({ error: '2FA kodu gerekli', require2fa: true }, { status: 401 })
      }
      const { verifyTotp } = await import('@/lib/totp')
      if (!(await verifyTotp(settings.totp_secret, String(totpCode)))) {
        recordFail(ip)
        return reject('Geçersiz 2FA kodu')
      }
    }

    fails.delete(ip)
    const token = await createSession()
    const res = NextResponse.json({ success: true })
    res.cookies.set(COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: EXPIRES_IN,
      path: '/',
    })
    return res
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
