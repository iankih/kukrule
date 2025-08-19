'use client'

import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onChange, label, description, disabled, ...props }, ref) => {
    return (
      <div className={cn('flex items-start space-x-3', className)}>
        <div className="relative flex items-center">
          <input
            type="checkbox"
            ref={ref}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-5 h-5 border-2 rounded transition-all duration-150 cursor-pointer flex items-center justify-center',
              checked
                ? 'bg-[#2D5F3F] border-[#2D5F3F]'
                : 'bg-white border-[#E8E8E8] hover:border-[#2D5F3F]',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => !disabled && onChange(!checked)}
          >
            {checked && (
              <svg 
                className="w-3 h-3 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label 
                className={cn(
                  'text-sm font-medium cursor-pointer select-none',
                  disabled ? 'text-[#AAAAAA]' : 'text-[#111111]'
                )}
                onClick={() => !disabled && onChange(!checked)}
              >
                {label}
              </label>
            )}
            {description && (
              <p className={cn(
                'text-xs mt-1',
                disabled ? 'text-[#D8D8D8]' : 'text-[#666666]'
              )}>
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }