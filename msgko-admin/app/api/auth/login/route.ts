import { NextRequest, NextResponse } from 'next/server'
import { createSession, COOKIE, EXPIRES_IN } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { username, password, totpCode } = await req.json()

    const expectedUsername = process.env.ADMIN_USERNAME ?? 'admin'
    const expectedPassword = process.env.ADMIN_PASSWORD ?? ''

    // Username kontrolü
    if (username !== expectedUsername) {
      await new Promise(r => setTimeout(r, 400))
      return NextResponse.json({ error: 'Geçersiz kimlik bilgileri' }, { status: 401 })
    }

    // Şifre kontrolü — önce düz karşılaştırma, sonra hash
    let valid = password === expectedPassword

    if (!valid && process.env.ADMIN_PASSWORD_HASH) {
      try {
        const { compare } = await import('bcryptjs')
        valid = await compare(password, process.env.ADMIN_PASSWORD_HASH)
      } catch {
        // bcrypt hatası
      }
    }

    if (!valid) {
      await new Promise(r => setTimeout(r, 400))
      return NextResponse.json({ error: 'Geçersiz kimlik bilgileri' }, { status: 401 })
    }

    // 2FA kontrolü — opsiyonel
    try {
      const { createServiceClient } = await import('@/lib/supabase')
      const supabase = createServiceClient()
      const { data: settings } = await supabase
        .from('admin_settings')
        .select('totp_secret, totp_enabled')
        .single()

      if (settings?.totp_enabled && settings?.totp_secret) {
        if (!totpCode) {
          return NextResponse.json({ error: '2FA kodu gerekli', require2fa: true }, { status: 401 })
        }
        const { verifyTotp } = await import('@/lib/totp')
        const totpValid = await verifyTotp(settings.totp_secret, totpCode)
        if (!totpValid) {
          return NextResponse.json({ error: 'Geçersiz 2FA kodu' }, { status: 401 })
        }
      }
    } catch {
      // Supabase yoksa 2FA atla
    }

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
