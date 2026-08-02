import { NextRequest, NextResponse } from 'next/server'
import { AccessToken } from 'livekit-server-sdk'
import { createServiceClient } from '@/lib/supabase/server'

const LIVEKIT_API_KEY    = process.env.LIVEKIT_API_KEY!
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET!
const LIVEKIT_URL        = process.env.LIVEKIT_URL!

// Rate limiting — in-memory, serverless'ta per-instance
const joinAttempts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = joinAttempts.get(ip)
  if (!entry || entry.resetAt < now) {
    joinAttempts.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (entry.count >= 10) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Çok fazla istek. Bir dakika bekle.' }, { status: 429 })
  }

  try {
    const { room, username, password } = await req.json()

    // Input validation
    if (!room || typeof room !== 'string' || room.length > 64) {
      return NextResponse.json({ error: 'Geçersiz oda adı' }, { status: 400 })
    }
    if (!username || typeof username !== 'string' || username.length > 32) {
      return NextResponse.json({ error: 'Geçersiz kullanıcı adı' }, { status: 400 })
    }

    const cleanRoom     = room.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-').slice(0, 64)
    const cleanUsername = username.trim().replace(/[<>'"]/g, '').slice(0, 32)

    if (!cleanRoom || !cleanUsername) {
      return NextResponse.json({ error: 'Oda adı veya kullanıcı adı geçersiz' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // DB'den oda bilgisini çek (sadece kalıcı odalar DB'de)
    const { data: voiceRoom } = await supabase
      .from('voice_rooms')
      .select('id, password_hash, max_users, is_permanent')
      .eq('id', cleanRoom)
      .maybeSingle()

    // Şifre kontrolü — sadece DB'deki kalıcı odalar için
    if (voiceRoom?.password_hash) {
      if (!password) {
        return NextResponse.json({ error: 'Bu oda şifreli' }, { status: 403 })
      }
      // Basit şifre kontrolü (production'da bcrypt kullanılabilir)
      // Şimdilik hash = btoa(password) ile saklanıyor
      const inputHash = Buffer.from(password).toString('base64')
      if (inputHash !== voiceRoom.password_hash) {
        return NextResponse.json({ error: 'Şifre yanlış' }, { status: 403 })
      }
    }

    // Ban kontrolü
    const { data: ban } = await supabase
      .from('voice_bans')
      .select('id, expires_at, reason')
      .eq('room_id', cleanRoom)
      .eq('username', cleanUsername)
      .maybeSingle()

    if (ban) {
      const expired = ban.expires_at && new Date(ban.expires_at) < new Date()
      if (!expired) {
        const msg = ban.expires_at
          ? `Bu odadan banlandınız. Bitiş: ${new Date(ban.expires_at).toLocaleString('tr-TR')}`
          : 'Bu odadan kalıcı olarak banlandınız.'
        return NextResponse.json({ error: msg }, { status: 403 })
      }
      // Süresi dolmuş ban'ı temizle
      await supabase.from('voice_bans').delete().eq('id', ban.id)
    }

    if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
      return NextResponse.json({ error: 'Ses sunucusu konfigürasyonu eksik' }, { status: 500 })
    }

    // LiveKit token oluştur
    const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: cleanUsername,
      name: cleanUsername,
      ttl: '4h',
    })

    token.addGrant({
      roomJoin: true,
      room: cleanRoom,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    })

    const jwt = await token.toJwt()
    return NextResponse.json({ token: jwt, url: LIVEKIT_URL, room: cleanRoom })

  } catch (err) {
    console.error('[livekit-token]', err)
    return NextResponse.json({ error: 'Token oluşturulamadı' }, { status: 500 })
  }
}
