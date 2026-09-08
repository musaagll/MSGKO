// ─── Database Types — Mevcut ─────────────────────────────────────────────────

export interface Category {
  id: string
  slug: 'asas' | 'okcu' | string
  name: string
  description: string | null
  icon: string | null
  sort_order: number
  created_at: string
}

export interface Video {
  id: string
  title: string
  slug: string
  thumbnail_url: string | null
  youtube_url: string
  duration: string | null
  views: number
  category_id: string | null
  published_at: string
  is_featured: boolean
  created_at: string
  category?: Category
}

// ─── Database Types — Yeni Entity'ler ────────────────────────────────────────

/** Karakter sınıfı rehberi */
export interface Guide {
  id: number
  slug: string
  title: string
  subtitle: string | null
  character_class: KOClass
  excerpt: string | null
  content: string | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string[] | null
  canonical_url: string | null
  schema_type: string
  difficulty: 'basit' | 'orta' | 'ileri'
  game_version: string
  author: string
  is_published: boolean
  is_featured: boolean
  view_count: number
  sort_order: number
  published_at: string | null
  updated_at: string
  created_at: string
}

/** Sınıf bazlı build rehberi */
export interface Build {
  id: number
  slug: string
  title: string
  character_class: KOClass
  build_type: 'pvp' | 'pve' | 'farm' | 'hybrid'
  excerpt: string | null
  content: string | null
  stats: Record<string, number>
  skill_tree: SkillTreeEntry[]
  recommended_items: RecommendedItem[]
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string[] | null
  difficulty: 'basit' | 'orta' | 'ileri'
  game_version: string
  author: string
  is_published: boolean
  view_count: number
  sort_order: number
  published_at: string | null
  updated_at: string
  created_at: string
}

/** Knight Online item (silah, zırh, aksesuar vb.) */
export interface KOItem {
  id: number
  slug: string
  name: string
  name_en: string | null
  item_type: ItemType
  sub_type: string | null
  character_class: KOClass[]
  race: 'human' | 'karus' | 'all'
  base_stats: Record<string, number>
  bonus_stats: BonusStat[]
  item_grade: 'normal' | 'unique' | 'legendary'
  min_level: number
  upgrade_max: number
  drop_info: DropInfo[]
  obtain_methods: ObtainMethod[]
  description: string | null
  content: string | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string[] | null
  image_url: string | null
  icon_url: string | null
  is_published: boolean
  view_count: number
  sort_order: number
  updated_at: string
  created_at: string
}

/** Boss */
export interface Boss {
  id: number
  slug: string
  name: string
  name_en: string | null
  boss_type: 'world' | 'dungeon' | 'event' | 'mini'
  map_slug: string | null
  spawn_coords: string | null
  spawn_interval: string | null
  level: number | null
  hp: number | null
  element: string | null
  drop_list: BossDropEntry[]
  related_quests: RelatedQuest[]
  spawn_item: string | null
  description: string | null
  content: string | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string[] | null
  image_url: string | null
  is_published: boolean
  view_count: number
  sort_order: number
  updated_at: string
  created_at: string
}

/** Mob (normal düşman) */
export interface Mob {
  id: number
  slug: string
  name: string
  name_en: string | null
  mob_type: 'normal' | 'elite' | 'mini-boss' | 'event'
  map_slug: string | null
  level: number | null
  hp: number | null
  element: string | null
  exp_reward: number | null
  drop_list: DropInfo[]
  description: string | null
  content: string | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string[] | null
  image_url: string | null
  is_published: boolean
  view_count: number
  updated_at: string
  created_at: string
}

/** Harita */
export interface KOMap {
  id: number
  slug: string
  name: string
  name_en: string | null
  map_type: 'pve' | 'pvp' | 'dungeon' | 'town' | 'event'
  min_level: number | null
  max_level: number | null
  is_war_zone: boolean
  is_pk_zone: boolean
  has_dungeon: boolean
  /** Kısa özet — listing sayfaları için */
  excerpt: string | null
  key_features: { text: string }[]
  farm_spots: MapFarmSpot[]
  bosses_here: { boss_slug: string; boss_name: string }[]
  npcs_here: { name: string; function: string }[]
  description: string | null
  content: string | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string[] | null
  image_url: string | null
  is_published: boolean
  view_count: number
  sort_order: number
  updated_at: string
  created_at: string
}

/** Quest */
export interface Quest {
  id: number
  slug: string
  name: string
  name_en: string | null
  quest_type: 'main' | 'daily' | 'repeatable' | 'event' | 'guild'
  race: 'human' | 'karus' | 'all'
  min_level: number
  max_level: number | null
  prerequisite_quest: string | null
  rewards: QuestReward[]
  steps: QuestStep[]
  start_npc: string | null
  start_npc_map: string | null
  end_npc: string | null
  description: string | null
  content: string | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string[] | null
  is_published: boolean
  view_count: number
  sort_order: number
  updated_at: string
  created_at: string
}

/** Skill */
export interface Skill {
  id: number
  slug: string
  name: string
  name_en: string | null
  character_class: KOClass
  skill_type: 'active' | 'passive' | 'buff' | 'debuff' | 'summon'
  element: string
  levels: SkillLevel[]
  max_level: number
  description: string | null
  content: string | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string[] | null
  icon_url: string | null
  is_published: boolean
  sort_order: number
  updated_at: string
  created_at: string
}

/** Haber / Güncelleme */
export interface News {
  id: number
  slug: string
  title: string
  news_type: 'update' | 'patch' | 'event' | 'maintenance' | 'announcement'
  excerpt: string | null
  content: string | null
  image_url: string | null
  source_url: string | null
  game_version: string | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string[] | null
  author: string
  is_published: boolean
  is_featured: boolean
  view_count: number
  published_at: string | null
  updated_at: string
  created_at: string
}

/** Oyun hatası / sorun çözüm rehberi */
export interface KOError {
  id: number
  slug: string
  title: string
  error_type: 'launcher' | 'connection' | 'account' | 'graphics' | 'patch' | 'game'
  excerpt: string | null
  content: string | null
  symptoms: string[]
  solutions: ErrorSolution[]
  related_errors: { slug: string; title: string }[]
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string[] | null
  is_published: boolean
  view_count: number
  sort_order: number
  updated_at: string
  created_at: string
}

/** Farm rotası */
export interface FarmSpot {
  id: number
  slug: string
  title: string
  farm_type: 'exp' | 'item' | 'noah' | 'boss' | 'dungeon'
  map_slug: string | null
  min_level: number | null
  max_level: number | null
  best_classes: KOClass[]
  mobs_here: FarmMob[]
  key_drops: KeyDrop[]
  tips: { text: string }[]
  excerpt: string | null
  content: string | null
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string[] | null
  image_url: string | null
  is_published: boolean
  view_count: number
  sort_order: number
  updated_at: string
  created_at: string
}

/** SEO yönlendirme kuralı */
export interface SeoRedirect {
  id: number
  source_path: string
  target_path: string
  redirect_type: 301 | 302
  is_active: boolean
  notes: string | null
  created_at: string
}

/** Entity ilişkisi (internal linking için) */
export interface EntityRelation {
  id: number
  source_type: ContentEntityType
  source_slug: string
  target_type: ContentEntityType
  target_slug: string
  relation_type: RelationType
  weight: number
  created_at: string
}

// ─── Union / Enum Types ───────────────────────────────────────────────────────

/** Tüm Knight Online sınıfları */
export type KOClass =
  | 'warrior'
  | 'rogue'
  | 'mage'
  | 'priest'
  | 'archer'
  | 'battle-priest'
  | 'all'

/** Tüm içerik entity tipleri */
export type ContentEntityType =
  | 'guide'
  | 'build'
  | 'item'
  | 'boss'
  | 'mob'
  | 'map'
  | 'quest'
  | 'skill'
  | 'news'
  | 'error'
  | 'farm'

/** İlişki tipleri */
export type RelationType =
  | 'related'
  | 'drops'
  | 'spawns_in'
  | 'used_in'
  | 'rewards'
  | 'requires'
  | 'upgrade_of'

/** Item tipleri */
export type ItemType =
  | 'weapon'
  | 'armor'
  | 'accessory'
  | 'ring'
  | 'necklace'
  | 'shield'
  | 'helmet'
  | 'gloves'
  | 'boots'
  | 'cape'

// ─── Sub-Types (JSON alanları için) ──────────────────────────────────────────

export interface BonusStat {
  stat: string
  value: number
  type: 'flat' | 'percent'
}

export interface DropInfo {
  mob_slug?: string
  mob_name?: string
  map_slug?: string
  map_name?: string
  drop_rate?: string    // '%2', 'Düşük', 'Yüksek'
  notes?: string
}

export interface ObtainMethod {
  type: 'drop' | 'quest' | 'craft' | 'shop' | 'boss' | 'event'
  source: string
  source_slug?: string
  notes?: string
}

export interface BossDropEntry {
  item_slug: string
  item_name: string
  drop_rate?: string
  upgrade_range?: string   // '+0 ~ +7'
}

export interface RelatedQuest {
  quest_slug: string
  quest_name: string
}

export interface MapFarmSpot {
  name: string
  coords?: string
  level_range?: string
  mob_types?: string[]
  notes?: string
}

export interface QuestReward {
  type: 'exp' | 'item' | 'noah' | 'skill'
  value?: number | string
  item_slug?: string
  item_name?: string
}

export interface QuestStep {
  order: number
  description: string
  npc_name?: string
  map_slug?: string
  kill_target?: string
  kill_count?: number
}

export interface SkillLevel {
  level: number
  damage?: number | string
  mp_cost?: number
  cooldown?: number
  required_level?: number
  description?: string
}

export interface SkillTreeEntry {
  name: string
  slug?: string
  level: number
  required?: boolean
  notes?: string
}

export interface RecommendedItem {
  slot: string
  name: string
  slug?: string
  why?: string
}

export interface ErrorSolution {
  order: number
  title: string
  description: string
  is_main: boolean
  code_snippet?: string
}

export interface FarmMob {
  mob_slug?: string
  mob_name: string
  exp?: number
  drop_rate?: string
  notes?: string
}

export interface KeyDrop {
  item_slug?: string
  item_name: string
  drop_rate?: string
  is_highlight?: boolean
}

// ─── SEO Types ────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  label: string
  href: string
}

export interface SeoConfig {
  title: string
  description: string
  keywords?: string[]
  canonical: string
  ogImage?: string
  ogType?: string
  robots?: { index: boolean; follow: boolean }
  publishedAt?: string
  updatedAt?: string
  author?: string
  schema?: object | object[]
}

export interface PageSeoProps {
  title: string
  description: string
  canonical: string
  breadcrumbs: BreadcrumbItem[]
  schema?: object | object[]
  publishedAt?: string
  updatedAt?: string
  author?: string
}

// ─── Related Content (sayfalar arası ilgili içerik widget) ───────────────────

export interface RelatedContentItem {
  type: ContentEntityType
  slug: string
  title: string
  excerpt?: string
  href: string
  badge?: string
  badgeColor?: string
}

// ─── UI Types — Mevcut ───────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
}

export interface NavDropdownItem {
  label: string
  href: string
  description?: string
  badge?: string
}

export interface NavDropdown {
  label: string
  items: NavDropdownItem[]
}

export interface FooterLink {
  label: string
  href: string
}

export interface FooterColumn {
  heading: string
  links: FooterLink[]
}

export interface SocialLink {
  platform: 'youtube' | 'instagram'
  url: string
  label: string
}

export interface HeroCTA {
  label: string
  href: string
  icon: string
  variant: 'primary' | 'secondary'
}

export interface Feature {
  id: string
  icon: string
  title: string
  description: string
}

export interface CategoryCardData {
  id: string
  title: string
  description: string
  icon: string
  href: string
  slug: string
}

// ─── Component Props ──────────────────────────────────────────────────────────

export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  onClick?: () => void
  icon?: React.ReactNode
  className?: string
  target?: string
  rel?: string
  'aria-label'?: string
  disabled?: boolean
}

export interface VideoCardProps {
  video: Video
}

export interface SectionHeaderProps {
  title: string
  actionLabel?: string
  actionHref?: string
  actionIcon?: React.ReactNode
  className?: string
}
