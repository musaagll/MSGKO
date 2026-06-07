'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { ButtonProps } from '@/lib/types'
import { cn } from '@/lib/utils'

const variants = {
  primary: 'bg-white text-[#0B0B0F] border border-white hover:bg-[#D8D8D8] hover:border-[#D8D8D8]',
  secondary: 'bg-transparent text-white border border-white/10 hover:bg-[#2A2A2A] hover:border-white/20',
  ghost: 'bg-transparent text-[#999999] border border-white/08 hover:text-white hover:border-white/20 hover:bg-[#2A2A2A]',
  dark: 'bg-[#171717] text-white border border-white/08 hover:bg-[#404040] hover:border-white/20',
  outline: 'bg-transparent text-white border border-white/08 hover:bg-[#2A2A2A] hover:border-white/20',
}

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-[10px] text-[0.78rem]',
  lg: 'px-6 py-[14px] text-[0.82rem]',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  icon,
  className,
  target,
  rel,
  'aria-label': ariaLabel,
  disabled = false,
}: ButtonProps) {
  const baseClass = cn(
    'inline-flex items-center justify-center gap-2 font-bold tracking-[0.08em] uppercase transition-all duration-200 cursor-pointer font-sans',
    variants[variant],
    sizes[size],
    disabled && 'opacity-50 pointer-events-none',
    className
  )

  const content = (
    <>
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </>
  )

  if (href) {
    const isExternal = href.startsWith('http')
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex">
        <Link
          href={href}
          className={baseClass}
          target={isExternal ? '_blank' : target}
          rel={isExternal ? 'noopener noreferrer' : rel}
          aria-label={ariaLabel}
        >
          {content}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={baseClass}
    >
      {content}
    </motion.button>
  )
}
