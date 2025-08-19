'use client'

import { cn } from '@/lib/utils'

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn(
      'bg-gray-50 border-t border-gray-200',
      className
    )}>
      <div className="px-4 py-6">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-5 h-5 text-[#2D5F3F]">
              ✨
            </div>
            <span className="text-lg font-bold text-[#2D5F3F]">kukrule</span>
          </div>
          
          <div className="text-xs text-gray-600">
            한국형 제품 추천 플랫폼
          </div>
          
          <div className="text-xs text-gray-500">
            © 2025 Kukrule. All rights reserved.
          </div>
          
          <div className="text-xs text-gray-400">
            Made with ❤️ in Korea
          </div>
        </div>
      </div>
    </footer>
  )
}