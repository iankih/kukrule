'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#F2F2F2] shadow-sm',
      className
    )}>
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-[#19D7D2]">kukrull</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-[#666666] hover:text-[#19D7D2] transition-colors">
              홈
            </Link>
            <Link href="/components" className="text-[#666666] hover:text-[#19D7D2] transition-colors">
              컴포넌트
            </Link>
            <Link href="/products" className="text-[#666666] hover:text-[#19D7D2] transition-colors">
              제품
            </Link>
            <Link href="/about" className="text-[#666666] hover:text-[#19D7D2] transition-colors">
              소개
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              로그인
            </Button>
            <Button variant="primary" size="sm">
              회원가입
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#666666] hover:text-[#19D7D2] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#F2F2F2] py-4">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-[#666666] hover:text-[#19D7D2] transition-colors px-1 py-2">
                홈
              </Link>
              <Link href="/components" className="text-[#666666] hover:text-[#19D7D2] transition-colors px-1 py-2">
                컴포넌트
              </Link>
              <Link href="/products" className="text-[#666666] hover:text-[#19D7D2] transition-colors px-1 py-2">
                제품
              </Link>
              <Link href="/about" className="text-[#666666] hover:text-[#19D7D2] transition-colors px-1 py-2">
                소개
              </Link>
              <div className="flex flex-col space-y-2 pt-3 border-t border-[#F2F2F2]">
                <Button variant="ghost" size="sm" className="justify-start">
                  로그인
                </Button>
                <Button variant="primary" size="sm">
                  회원가입
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}