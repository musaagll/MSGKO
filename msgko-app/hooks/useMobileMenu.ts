'use client'

import { useState, useCallback, useEffect } from 'react'

interface UseMobileMenuReturn {
  isOpen: boolean
  openMenu: () => void
  closeMenu: () => void
  toggleMenu: () => void
}

/**
 * Mobil menü açma/kapama state'ini yönetir.
 * Menü açıkken body scroll'u kilitler.
 */
export function useMobileMenu(): UseMobileMenuReturn {
  const [isOpen, setIsOpen] = useState(false)

  const openMenu = useCallback(() => setIsOpen(true), [])
  const closeMenu = useCallback(() => setIsOpen(false), [])
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // ESC ile kapat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeMenu()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeMenu])

  return { isOpen, openMenu, closeMenu, toggleMenu }
}
