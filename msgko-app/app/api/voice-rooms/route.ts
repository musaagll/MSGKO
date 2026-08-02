import { NextResponse } from 'next/server'
import { RoomServiceClient } from 'livekit-server-sdk'

const LIVEKIT_URL        = process.env.LIVEKIT_URL ?? ''
const LIVEKIT_API_KEY    = process.env.LIVEKIT_API_KEY ?? ''
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET ?? ''

const livekitHttpUrl = LIVEKIT_URL.replace('wss://', 'https://').replace('ws://', 'http://')

export async function GET() {
  try {
    const svc = new RoomServiceClient(livekitHttpUrl, LIVEKIT_API_KEY, LIVEKIT_API_SECRET)
    const lkRooms = await svc.listRooms()

    const rooms = lkRooms.map(r => {
      // Oda metadata'sından icon, description, isLocked, maxUsers çek
      let meta: Record<string, string> = {}
      try { meta = JSON.parse(r.metadata ?? '{}') } catch {}

      return {
        id: r.name,
        name: meta.name ?? r.name,
        description: meta.description ?? '',
        icon: meta.icon ?? '🎙️',
        isLocked: meta.isLocked === 'true',
        maxUsers: parseInt(meta.maxUsers ?? '20'),
        participants: r.numParticipants,
      }
    })

    // Katılımcısı olan odaları önce göster
    rooms.sort((a, b) => b.participants - a.participants)

    return NextResponse.json(rooms, {
      headers: { 'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=10' },
    })
  } catch (err) {
    console.error('[voice-rooms]', err)
    return NextResponse.json([], { status: 200 })
  }
}
