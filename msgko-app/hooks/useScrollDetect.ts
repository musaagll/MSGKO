'use client'

import { useState, useEffect } from 'react'

/**
 * Sayfanın threshold kadar aşağı kaydırılıp kaydırılmadığını döndürür.
 */
export function useScrollDetect(threshold = 20): boolean {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= threshold)
    }

    handleScroll() // ilk render için kontrol et
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return isScrolled
}
