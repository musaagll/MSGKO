// ─── Database Types ───────────────────────────────────────────────────────────

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
  // joined
  category?: Category
}

// ─── UI Types ─────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
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
