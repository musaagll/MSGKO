/**
 * Knight Online — Önemli Quest'ler
 */

import type { Quest } from '@/lib/types'

export type QuestSeedData = Omit<Quest, 'id' | 'view_count' | 'updated_at' | 'created_at'>

export const KO_QUESTS: QuestSeedData[] = [
  {
    slug: 'guardian-of-7-keys',
    name: 'Guardian of 7 Keys — Anahtar Görevi',
    name_en: 'Guardian of 7 Keys',
    quest_type: 'main',
    race: 'human',
    min_level: 60,
    max_level: null,
    prerequisite_quest: null,
    description:
      'Guardian of 7 Keys, Knight Online\'ın en önemli görevlerinden biridir. Human ırkı için zorunlu olan bu görev, 7 anahtar toplanarak tamamlanır. Görev ödülü çok değerlidir ve üst seviye içeriklere erişim için gereklidir.',
    content:
      '## Guardian of 7 Keys Görevi Nedir?\n\nGuardian of 7 Keys (7 Anahtarın Koruyucusu), Knight Online\'ın en kritik ana görevlerinden biridir. Human ırkı karakterler için 60. seviyede başlanabilir.\n\n## Görev Nasıl Başlatılır?\n\nGörev, El Morad\'daki ilgili NPC\'ye gidilerek başlatılır.\n\n## Görev Adımları\n\n1. Görev NPC\'siyle konuş\n2. 7 farklı bölgeden anahtar topla\n3. Her anahtarın farklı bir guardian\'ı vardır\n4. Anahtarların hepsini topladıktan sonra NPC\'ye geri dön\n5. Ödülünü al\n\n## Anahtar Konumları\n\nHer anahtar, farklı bir haritadaki özel guardian mob\'undan düşer.\n\n## Görev Ödülü\n\nGörev tamamlandığında değerli exp ve özel item ödülü kazanılır.\n\n## Püf Noktaları\n\n- Grup halinde yapmak çok daha hızlıdır\n- Her guardian güçlüdür, solo yapmak zordur\n- Priest buff\'ları kritik önem taşır',
    rewards: [
      { type: 'exp', value: 'Yüksek EXP' },
      { type: 'item', item_name: 'Özel Ödül Item\'ı' },
    ],
    steps: [
      { order: 1, description: 'El Morad\'daki görev NPC\'siyle konuş', npc_name: 'Quest NPC', map_slug: 'el-morad' },
      { order: 2, description: 'Birinci anahtarı bul', kill_target: 'Guardian 1', kill_count: 1 },
      { order: 3, description: 'İkinci anahtarı bul', kill_target: 'Guardian 2', kill_count: 1 },
      { order: 4, description: 'Üçüncü anahtarı bul', kill_target: 'Guardian 3', kill_count: 1 },
      { order: 5, description: 'Dördüncü anahtarı bul', kill_target: 'Guardian 4', kill_count: 1 },
      { order: 6, description: 'Beşinci anahtarı bul', kill_target: 'Guardian 5', kill_count: 1 },
      { order: 7, description: 'Altıncı anahtarı bul', kill_target: 'Guardian 6', kill_count: 1 },
      { order: 8, description: 'Yedinci anahtarı bul', kill_target: 'Guardian 7', kill_count: 1 },
      { order: 9, description: 'Tüm anahtarlarla görev NPC\'sine geri dön', npc_name: 'Quest NPC', map_slug: 'el-morad' },
    ],
    start_npc: 'Guardian Quest NPC',
    start_npc_map: 'el-morad',
    end_npc: 'Guardian Quest NPC',
    seo_title: 'Knight Online Guardian of 7 Keys | Anahtar Görevi Rehberi | MSGKO',
    seo_description:
      'Knight Online Guardian of 7 Keys anahtar görevi rehberi. Görev nasıl yapılır, anahtarlar nerede, adım adım anlatım. Human karakterler için zorunlu görev.',
    seo_keywords: [
      'guardian of 7 keys', 'anahtar görevi', 'knight online anahtar görevi',
      '7 keys', 'guardian quest', 'human görevi', 'anahtar görevi human',
      'knight online görev rehberi', 'guardian of 7 keys nasıl yapılır',
    ],
    is_published: true,
    sort_order: 1,
  },
  {
    slug: 'bifrost-quest',
    name: 'Bifrost Görevi',
    name_en: 'Bifrost Quest',
    quest_type: 'repeatable',
    race: 'all',
    min_level: 70,
    max_level: null,
    prerequisite_quest: null,
    description:
      'Bifrost Görevi, Felankor\'dan düşen Bifrost parçalarını birleştirerek tamamlanan özel bir görevdir. Ödülü çok değerli unique item\'lardır.',
    content:
      '## Bifrost Görevi\n\nBifrost parçaları Felankor\'dan düşer. Parçaları toplayarak özel Bifrost item\'ı elde edilir.\n\n## Nasıl Yapılır?\n\n1. Felankor\'u öldür ve Bifrost parçalarını topla\n2. Yeterli parça sayısına ulaş\n3. Görev NPC\'sine git\n4. Bifrost item\'ını oluştur',
    rewards: [
      { type: 'item', item_name: 'Bifrost Seti', item_slug: 'bifrost-set' },
    ],
    steps: [
      { order: 1, description: 'Felankor\'dan Bifrost parçaları topla', kill_target: 'Felankor', map_slug: 'ronark-land' },
      { order: 2, description: 'Bifrost NPC\'sine git ve item\'ı oluştur' },
    ],
    start_npc: 'Bifrost NPC',
    start_npc_map: 'moradon',
    end_npc: 'Bifrost NPC',
    seo_title: 'Knight Online Bifrost Görevi | Rehber ve Ödüller | MSGKO',
    seo_description:
      'Knight Online Bifrost görevi rehberi. Bifrost parçaları nasıl toplanır, görev nasıl tamamlanır, ödüller neler.',
    seo_keywords: [
      'bifrost görevi', 'knight online bifrost', 'bifrost parça',
      'bifrost quest', 'bifrost nasıl yapılır',
    ],
    is_published: true,
    sort_order: 2,
  },
]

/** Slug'a göre quest verisini döndürür */
export function getQuestBySlug(slug: string): QuestSeedData | undefined {
  return KO_QUESTS.find((q) => q.slug === slug)
}

/** Tüm yayınlanan quest slug'larını döndürür */
export function getPublishedQuestSlugs(): string[] {
  return KO_QUESTS.filter((q) => q.is_published).map((q) => q.slug)
}
