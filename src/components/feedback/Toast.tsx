'use client'

import { useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose: () => void
  className?: string
}

export function Toast({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose, 
  className 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const handleClose = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      onClose()
    }, 300) // Animation duration
  }, [onClose])

  useEffect(() => {
    // Show animation
    setIsVisible(true)
    
    // Auto close
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [duration, handleClose])

  const typeStyles = {
    success: {
      bg: 'bg-[#19D7D2]',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    error: {
      bg: 'bg-[#FF4757]',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    },
    warning: {
      bg: 'bg-[#FF9500]',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    info: {
      bg: 'bg-[#5352ED]',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  }

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg text-white min-w-[300px] max-w-[500px] transition-all duration-300',
        typeStyles[type].bg,
        isVisible && !isExiting 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0',
        className
      )}
    >
      <div className="flex-shrink-0">
        {typeStyles[type].icon}
      </div>
      
      <div className="flex-1 text-sm font-medium">
        {message}
      </div>
      
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}