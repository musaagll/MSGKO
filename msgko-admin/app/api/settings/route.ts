import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'
import { generateTotpSecret, getTotpUri, verifyTotp } from '@/lib/totp'

export async function GET() {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('admin_settings')
    .select('id, totp_enabled, site_title, site_description, site_keywords, youtube_channel, instagram_handle, footer_links, updated_at')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  const body = await req.json()
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('admin_settings')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', 1)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// 2FA setup — QR kodu için URI döner
export async function POST(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  const { action, code } = await req.json()
  const supabase = createServiceClient()

  if (action === 'generate') {
    const secret = generateTotpSecret()
    const uri = getTotpUri(secret, 'MSGKO Admin')
    // Geçici olarak sakla (henüz enabled değil)
    await supabase.from('admin_settings').update({ totp_secret: secret }).eq('id', 1)
    return NextResponse.json({ secret, uri })
  }

  if (action === 'verify_and_enable') {
    const { data: settings } = await supabase
      .from('admin_settings')
      .select('totp_secret')
      .single()
    if (!settings?.totp_secret) return NextResponse.json({ error: 'Secret bulunamadı' }, { status: 400 })
    const valid = await verifyTotp(settings.totp_secret, code)
    if (!valid) return NextResponse.json({ error: 'Geçersiz kod' }, { status: 400 })
    await supabase.from('admin_settings').update({ totp_enabled: true }).eq('id', 1)
    return NextResponse.json({ success: true })
  }

  if (action === 'disable') {
    await supabase.from('admin_settings').update({ totp_enabled: false, totp_secret: null }).eq('id', 1)
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Geçersiz action' }, { status: 400 })
}
