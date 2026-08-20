// ============================================================
// GET /api/character/servers
// Returns list of available servers
// ============================================================

import { NextResponse } from 'next/server'
import { MockCharacterProvider } from '@/lib/providers/MockCharacterProvider'

const characterProvider = new MockCharacterProvider()

export async function GET() {
  try {
    const servers = await characterProvider.getServers()
    return NextResponse.json({ success: true, servers })
  } catch (error) {
    console.error('[API /character/servers] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch servers' },
      { status: 500 }
    )
  }
}
