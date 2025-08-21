'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
  error?: boolean
}

export function Select({ 
  value, 
  onChange, 
  options, 
  placeholder = '선택하세요', 
  disabled = false,
  className,
  error = false
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return
    
    onChange(option.value)
    setIsOpen(false)
  }

  return (
    <div className={cn('relative w-full', className)} ref={selectRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 text-left bg-white border rounded-lg transition-all duration-150 flex items-center justify-between',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20',
          error 
            ? 'border-[#FF4757]' 
            : isOpen 
              ? 'border-[#2D5F3F]' 
              : 'border-[#E8E8E8] hover:border-[#2D5F3F]',
          disabled && 'bg-[#F7F7F7] cursor-not-allowed opacity-50'
        )}
      >
        <span className={cn(
          'text-sm',
          selectedOption ? 'text-[#111111]' : 'text-[#AAAAAA]'
        )}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        <svg 
          className={cn(
            'w-4 h-4 text-[#666666] transition-transform duration-150',
            isOpen && 'rotate-180'
          )}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-[#E8E8E8] rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-[#AAAAAA]">
              옵션이 없습니다
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionClick(option)}
                disabled={option.disabled}
                className={cn(
                  'w-full px-3 py-2 text-left text-sm transition-colors duration-150',
                  'first:rounded-t-lg last:rounded-b-lg',
                  option.disabled
                    ? 'text-[#D8D8D8] cursor-not-allowed'
                    : option.value === value
                      ? 'bg-[#E8F0EB] text-[#2D5F3F]'
                      : 'text-[#111111] hover:bg-[#F7F7F7]'
                )}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}