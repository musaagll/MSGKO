// ============================================================
// /karakter/[server]/[name] — Character Detail Page (Server Component)
// ============================================================

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MockCharacterProvider } from '@/lib/providers/MockCharacterProvider'
import { MockItemProvider } from '@/lib/providers/MockItemProvider'
import type { Character } from '@/lib/types/character'
import { CharacterPageWrapper } from '@/components/character/CharacterPageWrapper'

interface PageProps {
  params: Promise<{ server: string; name: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { server, name } = await params
  return {
    title: `${decodeURIComponent(name)} — ${server.toUpperCase()} | MSGKO`,
    description: `Knight Online ${decodeURIComponent(name)} karakter bilgileri ve 3D görünüm`,
  }
}

export default async function CharacterDetailPage({ params }: PageProps) {
  const { server, name } = await params
  const decodedName = decodeURIComponent(name)

  const characterProvider = new MockCharacterProvider()
  const itemProvider = new MockItemProvider()

  const result = await characterProvider.getCharacter(server, decodedName)

  if (!result.found || !result.character) {
    notFound()
  }

  const character = result.character

  // Populate equipment items server-side
  if (character.equipment) {
    const itemIds = Object.values(character.equipment)
      .filter(Boolean)
      .map(e => e.item_id)

    if (itemIds.length > 0) {
      const items = await itemProvider.getItemsByIds(itemIds)
      for (const entry of Object.values(character.equipment)) {
        if (entry) {
          entry.item = items.find(i => i.item_id === entry.item_id)
        }
      }
    }
  }

  // Plain object serialisation — no class instances to client
  const characterData: Character = JSON.parse(JSON.stringify(character))

  return (
    <main className="min-h-screen pt-20 pb-16 mesh-bg">
      <CharacterPageWrapper
        character={characterData}
        isMock={result.is_mock}
      />
    </main>
  )
}
