'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'product' | 'elevated'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'base', children, ...props }, ref) => {
    const baseStyles = 'bg-white border border-[#E8E8E8] transition-all duration-150 ease-out'
    
    const variants = {
      base: 'rounded-xl p-4 shadow-sm hover:shadow-md',
      product: 'rounded-xl p-3 shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-0.5',
      elevated: 'rounded-xl p-6 shadow-lg'
    }

    return (
      <div
        className={cn(
          baseStyles,
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export { Card }