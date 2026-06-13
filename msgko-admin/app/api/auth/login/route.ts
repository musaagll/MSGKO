import { NextRequest, NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import { createSession, COOKIE, EXPIRES_IN } from '@/lib/auth'
import { verifyTotp } from '@/lib/totp'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { username, password, totpCode } = await req.json()

    // Username kontrolü
    if (username !== process.env.ADMIN_USERNAME) {
      await new Promise(r => setTimeout(r, 500)) // timing attack önlemi
      return NextResponse.json({ error: 'Geçersiz kimlik bilgileri' }, { status: 401 })
    }

    // Şifre kontrolü
    const hash = process.env.ADMIN_PASSWORD_HASH ?? ''
    const valid = await compare(password, hash)
    if (!valid) {
      await new Promise(r => setTimeout(r, 500))
      return NextResponse.json({ error: 'Geçersiz kimlik bilgileri' }, { status: 401 })
    }

    // 2FA kontrolü — eğer secret ayarlanmışsa
    const supabase = createServiceClient()
    const { data: settings } = await supabase
      .from('admin_settings')
      .select('totp_secret, totp_enabled')
      .single()

    if (settings?.totp_enabled && settings?.totp_secret) {
      if (!totpCode) {
        return NextResponse.json({ error: '2FA kodu gerekli', require2fa: true }, { status: 401 })
      }
      const totpValid = await verifyTotp(settings.totp_secret, totpCode)
      if (!totpValid) {
        return NextResponse.json({ error: 'Geçersiz 2FA kodu' }, { status: 401 })
      }
    }

    // Session oluştur
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
