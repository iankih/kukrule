import React from 'react'

interface SiteBannerProps {
  className?: string
}

export function SiteBanner({ className = '' }: SiteBannerProps) {
  return (
    <div className={`px-4 pt-4 pb-6 ${className}`}>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2D5F3F] to-[#36503F] p-8">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3 leading-tight text-white">
                국룰에 오신 것을 환영합니다
              </h2>
              <p className="text-base text-white/80 leading-relaxed">
                한국인들이 선택한 진짜 국민 아이템을 한눈에!<br />
                검증된 제품들로 쇼핑의 새로운 기준을 제시합니다.
              </p>
            </div>
            <div className="flex-shrink-0 ml-6">
              <div className="w-24 h-32 rounded-lg flex items-center justify-center bg-white/20 overflow-hidden">
                <div className="text-4xl">🏆</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 배경 장식 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-10 -translate-x-10"></div>
      </div>
    </div>
  )
}