'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface CarouselItem {
  id: number | string
  title: string
  content: string
  image?: string
}

interface CarouselProps {
  items: CarouselItem[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showDots?: boolean
  showArrows?: boolean
  className?: string
}

export function Carousel({ 
  items, 
  autoPlay = true, 
  autoPlayInterval = 5000, 
  showDots = true, 
  showArrows = true,
  className 
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, items.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className={cn('relative w-full', className)}>
      {/* Main Content */}
      <div className="relative overflow-hidden rounded-xl bg-white border border-[#E8E8E8] shadow-sm">
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item) => (
            <div key={item.id} className="w-full flex-shrink-0">
              <div className="p-8 md:p-12 text-center">
                {item.image && (
                  <div className="w-full h-48 bg-[#F7F7F7] rounded-lg mb-6 flex items-center justify-center">
{/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <h3 className="text-2xl font-semibold text-[#111111] mb-4">
                  {item.title}
                </h3>
                <p className="text-[#666666] leading-relaxed max-w-2xl mx-auto">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {showArrows && items.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white border border-[#E8E8E8] rounded-full flex items-center justify-center transition-all duration-150 hover:shadow-md"
            >
              <svg className="w-5 h-5 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white border border-[#E8E8E8] rounded-full flex items-center justify-center transition-all duration-150 hover:shadow-md"
            >
              <svg className="w-5 h-5 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {showDots && items.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-150',
                index === currentIndex 
                  ? 'bg-[#19D7D2] w-6' 
                  : 'bg-[#D8D8D8] hover:bg-[#AAAAAA]'
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}