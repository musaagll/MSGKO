import type { AchievementBonus } from './types'

export interface Achievement {
  id: string
  name: string
  bonusObj?: Partial<AchievementBonus>
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: '', name: 'No Achievement' },
  { id: '1', name: 'Apostle of Chaos', bonusObj: { ap: 3 } },
  { id: '2', name: 'Apostle of Order', bonusObj: { ap: 3 } },
  { id: '3', name: 'Master of Chaos', bonusObj: { ap: 5 } },
  { id: '4', name: 'Grand Master of Chaos', bonusObj: { ap: 7 } },
  { id: '5', name: 'Blood Warrior', bonusObj: { str: 5, ap: 3 } },
  { id: '6', name: 'Champion', bonusObj: { hp: 10, ac: 10 } },
  { id: '7', name: 'Conqueror', bonusObj: { ac: 15, ap: 5 } },
  { id: '8', name: 'Eliminator', bonusObj: { ap: 8, ac: 10 } },
  { id: '9', name: 'War Hero', bonusObj: { ap: 10 } },
  { id: '10', name: 'Chaos Knight', bonusObj: { ap: 10, str: 5 } },
  { id: '11', name: 'Inquisitor', bonusObj: { ap: 7, int: 5 } },
  { id: '12', name: 'Berserker Master', bonusObj: { ap: 12 } },
  { id: '13', name: 'Legend', bonusObj: { ap: 15, str: 10 } },
  { id: '14', name: 'Destroyer', bonusObj: { ap: 8, dex: 5 } },
  { id: '15', name: 'Shadow Knight', bonusObj: { ap: 6, dex: 8 } },
  { id: '16', name: 'Flame Guardian', bonusObj: { flameres: 20, ac: 10 } },
  { id: '17', name: 'Ice Guardian', bonusObj: { iceres: 20, ac: 10 } },
  { id: '18', name: 'Thunder Guardian', bonusObj: { lightingres: 20, ac: 10 } },
  { id: '19', name: 'Defender', bonusObj: { ac: 20, hp: 15 } },
  { id: '20', name: 'Warlord', bonusObj: { ap: 12, str: 8, ac: 10 } },
]

export function getAchievementsForCalculator(): Achievement[] {
  return ACHIEVEMENTS
}
