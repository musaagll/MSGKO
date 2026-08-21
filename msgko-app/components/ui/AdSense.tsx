'use client'

import { useEffect } from 'react'

interface AdSenseProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal'
  fullWidthResponsive?: boolean
  className?: string
}

export function AdSense({
  slot,
  format = 'auto',
  fullWidthResponsive = true,
  className = '',
}: AdSenseProps) {
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adsbygoogle = (window as any).adsbygoogle
      if (adsbygoogle) {
        adsbygoogle.push({})
      }
    } catch {
      // AdSense henüz yüklenmediyse sessizce geç
    }
  }, [])

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4962952498469276"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  )
}
