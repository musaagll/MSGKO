import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { RoomServiceClient } from 'livekit-server-sdk'

const LIVEKIT_URL        = process.env.LIVEKIT_URL ?? ''
const LIVEKIT_API_KEY    = process.env.LIVEKIT_API_KEY ?? ''
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET ?? ''

// HTTP URL — wss:// → https://
const livekitHttpUrl = LIVEKIT_URL.replace('wss://', 'https://').replace('ws://', 'http://')

export async function GET() {
  try {
    const supabase = createServiceClient()

    // DB'den kalıcı odaları çek
    const { data: dbRooms } = await supabase
      .from('voice_rooms')
      .select('id, name, description, icon, password_hash, max_users, sort_order')
      .order('sort_order', { ascending: true })

    // LiveKit'ten aktif room'ları çek (kaç kişi var)
    let livekitParticipants: Record<string, number> = {}
    try {
      const svc = new RoomServiceClient(livekitHttpUrl, LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
      const rooms = await svc.listRooms()
      for (const r of rooms) {
        livekitParticipants[r.name] = r.numParticipants
      }
    } catch {
      // LiveKit erişilemiyorsa 0 göster
    }

    const rooms = (dbRooms ?? []).map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      icon: r.icon,
      isLocked: !!r.password_hash,
      maxUsers: r.max_users,
      participants: livekitParticipants[r.id] ?? 0,
    }))

    return NextResponse.json(rooms, {
      headers: { 'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10' },
    })
  } catch (err) {
    console.error('[voice-rooms]', err)
    return NextResponse.json([], { status: 200 })
  }
}
