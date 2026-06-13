'use client'

import { useEffect } from 'react'

/**
 * Modal bileşenlerinde tekrarlayan ESC tuşu + body scroll kilidi mantığını
 * merkezi hale getirir.
 *
 * @param isOpen  - Modal açık mı?
 * @param onClose - Kapatma callback'i
 */
export function useModal(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])
}
