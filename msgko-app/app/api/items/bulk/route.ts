// ============================================================
// GET /api/items/bulk?ids=9000001,9000002,9000003
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { MockItemProvider } from '@/lib/providers/MockItemProvider'

const itemProvider = new MockItemProvider()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const idsParam = searchParams.get('ids')

  if (!idsParam) {
    return NextResponse.json({ error: 'Missing ids parameter' }, { status: 400 })
  }

  const itemIds = idsParam.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id))

  if (itemIds.length === 0) {
    return NextResponse.json({ error: 'No valid item IDs provided' }, { status: 400 })
  }

  try {
    const items = await itemProvider.getItemsByIds(itemIds)
    return NextResponse.json({ success: true, items })
  } catch (error) {
    console.error('[API /items/bulk] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
