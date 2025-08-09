'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DropdownItem {
  label: string
  value: string
  disabled?: boolean
}

interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  onSelect: (value: string) => void
  className?: string
  align?: 'left' | 'right'
}

export function Dropdown({ trigger, items, onSelect, className, align = 'left' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return
    
    onSelect(item.value)
    setIsOpen(false)
  }

  return (
    <div className={cn('relative inline-block', className)} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div className={cn(
          'absolute z-50 mt-2 min-w-[200px] bg-white border border-[#E8E8E8] rounded-lg shadow-lg py-1',
          align === 'right' ? 'right-0' : 'left-0'
        )}>
          {items.map((item) => (
            <button
              key={item.value}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              className={cn(
                'w-full px-4 py-2 text-left text-sm transition-colors duration-150',
                item.disabled 
                  ? 'text-[#D8D8D8] cursor-not-allowed'
                  : 'text-[#111111] hover:bg-[#F7F7F7] hover:text-[#19D7D2]'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}