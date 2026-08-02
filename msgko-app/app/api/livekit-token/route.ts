import { NextRequest, NextResponse } from 'next/server'
import { AccessToken } from 'livekit-server-sdk'

export async function POST(req: NextRequest) {
  try {
    const { room, username, password } = await req.json()

    if (!room || !username) {
      return NextResponse.json({ error: 'Oda adı ve kullanıcı adı gerekli' }, { status: 400 })
    }

    // Oda şifresi kontrolü — oda adında şifre encode edilmiş
    // Format: "OdaAdi__SIFRE" şeklinde saklanır, client şifreyi kontrol eder
    const roomPasswordKey = `room_password_${room}`
    const storedPassword = process.env[roomPasswordKey] // dinamik env değil, runtime kontrol

    // Şifre kontrolü basit — production için Supabase'e taşınabilir
    if (storedPassword && storedPassword !== password) {
      return NextResponse.json({ error: 'Yanlış şifre' }, { status: 403 })
    }

    const apiKey = process.env.LIVEKIT_API_KEY
    const apiSecret = process.env.LIVEKIT_API_SECRET

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ error: 'LiveKit konfigürasyonu eksik' }, { status: 500 })
    }

    const token = new AccessToken(apiKey, apiSecret, {
      identity: username,
      name: username,
      ttl: '4h',
    })

    token.addGrant({
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    })

    const jwt = await token.toJwt()

    return NextResponse.json({
      token: jwt,
      url: process.env.LIVEKIT_URL,
    })
  } catch (err) {
    console.error('LiveKit token error:', err)
    return NextResponse.json({ error: 'Token oluşturulamadı' }, { status: 500 })
  }
}
