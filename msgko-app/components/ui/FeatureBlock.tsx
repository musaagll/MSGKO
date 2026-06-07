import type { Feature } from '@/lib/types'

interface FeatureBlockProps {
  feature: Feature
}

export function FeatureBlock({ feature }: FeatureBlockProps) {
  return (
    <div className="flex items-start gap-4 p-7 border-r border-white/[0.08] last:border-r-0 transition-colors duration-200 hover:bg-[#2A2A2A]">
      <div
        className="w-11 h-11 flex-shrink-0 border border-white/[0.08] bg-[#0B0B0F] flex items-center justify-center text-lg"
        aria-hidden="true"
      >
        {feature.icon}
      </div>
      <div>
        <p className="text-[0.8rem] font-bold tracking-[0.08em] uppercase text-white mb-1.5">
          {feature.title}
        </p>
        <p className="text-[0.75rem] text-[#999999] leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  )
}
