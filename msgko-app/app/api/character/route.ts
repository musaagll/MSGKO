// ============================================================
// GET /api/character?server=zero&name=1stMSG
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { MockCharacterProvider } from '@/lib/providers/MockCharacterProvider'
import { MockItemProvider } from '@/lib/providers/MockItemProvider'

const characterProvider = new MockCharacterProvider()
const itemProvider = new MockItemProvider()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const server = searchParams.get('server')
  const name = searchParams.get('name')

  if (!server || !name) {
    return NextResponse.json(
      { error: 'Missing server or name parameter' },
      { status: 400 }
    )
  }

  try {
    const result = await characterProvider.getCharacter(server, name)

    if (!result.found) {
      return NextResponse.json(
        { error: result.error || 'Character not found', is_mock: result.is_mock },
        { status: 404 }
      )
    }

    // Populate equipment items
    if (result.character?.equipment) {
      const itemIds = Object.values(result.character.equipment)
        .filter(Boolean)
        .map(e => e.item_id)

      if (itemIds.length > 0) {
        const items = await itemProvider.getItemsByIds(itemIds)
        for (const [slotKey, entry] of Object.entries(result.character.equipment)) {
          if (entry) {
            entry.item = items.find(i => i.item_id === entry.item_id)
          }
        }
      }
    }

    // Populate cospre items (if any)
    if (result.character?.cospre) {
      const cospreItemIds = Object.values(result.character.cospre)
        .filter(c => c.item_id)
        .map(c => c.item_id!)

      if (cospreItemIds.length > 0) {
        const cospreItems = await itemProvider.getItemsByIds(cospreItemIds)
        for (const entry of Object.values(result.character.cospre)) {
          if (entry?.item_id) {
            entry.item = cospreItems.find(i => i.item_id === entry.item_id)
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      character: result.character,
      is_mock: result.is_mock,
    })
  } catch (error) {
    console.error('[API /character] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
