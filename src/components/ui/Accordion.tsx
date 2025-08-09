'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface AccordionItem {
  id: number | string
  title: string
  content: string
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  className?: string
}

export function Accordion({ items, allowMultiple = false, className }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number | string>>(new Set())

  const toggleItem = (id: number | string) => {
    const newOpenItems = new Set(openItems)
    
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      if (!allowMultiple) {
        newOpenItems.clear()
      }
      newOpenItems.add(id)
    }
    
    setOpenItems(newOpenItems)
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id)
        
        return (
          <div 
            key={item.id} 
            className="bg-white border border-[#E8E8E8] rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-[#F7F7F7] transition-colors duration-150"
            >
              <span className="font-medium text-[#111111]">{item.title}</span>
              <svg 
                className={cn(
                  'w-5 h-5 text-[#666666] transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isOpen && (
              <div className="px-4 pb-4 pt-0 border-t border-[#F2F2F2]">
                <div className="pt-3 text-[#666666] leading-relaxed">
                  {item.content}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}