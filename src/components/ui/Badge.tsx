'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success'
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'primary', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full'
    
    const variants = {
      primary: 'bg-primary-active text-white',
      secondary: 'bg-gray-100 text-text-secondary',
      success: 'bg-success text-white'
    }

    return (
      <span
        className={cn(
          baseStyles,
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }