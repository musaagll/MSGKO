'use client'

import dynamic from 'next/dynamic'
import type { Character } from '@/lib/types/character'

const CharacterDetailClient = dynamic(
  () => import('./CharacterDetailClient').then(m => ({ default: m.CharacterDetailClient })),
  { ssr: false }
)

interface Props { character: Character; isMock?: boolean }

export function CharacterPageWrapper({ character, isMock }: Props) {
  return <CharacterDetailClient character={character} isMock={isMock} />
}
