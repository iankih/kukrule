'use client'

import { HTMLAttributes } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface HeroProps extends HTMLAttributes<HTMLElement> {
  title: string
  subtitle?: string
  showCTA?: boolean
  ctaText?: string
  onCTAClick?: () => void
}

export function Hero({ 
  title, 
  subtitle, 
  showCTA = false, 
  ctaText = '시작하기',
  onCTAClick,
  className,
  ...props 
}: HeroProps) {
  return (
    <section className={cn(
      'w-full bg-gradient-to-b from-[#F7FDFD] to-[#EEFBFB] py-20',
      className
    )} {...props}>
      <div className="max-w-4xl mx-auto px-5 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#111111] mb-6 leading-tight">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-lg md:text-xl text-[#666666] mb-8 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        
        {showCTA && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="primary" 
              size="lg"
              onClick={onCTAClick}
              className="min-w-[120px]"
            >
              {ctaText}
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              className="min-w-[120px]"
            >
              더 알아보기
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}