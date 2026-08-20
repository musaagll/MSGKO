// ============================================================
// GET /api/items/[id]
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { MockItemProvider } from '@/lib/providers/MockItemProvider'

const itemProvider = new MockItemProvider()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const itemId = parseInt(id, 10)

  if (isNaN(itemId)) {
    return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 })
  }

  try {
    const item = await itemProvider.getItem(itemId)

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, item })
  } catch (error) {
    console.error('[API /items/:id] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
