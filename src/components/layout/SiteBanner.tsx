'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { getSiteBanner } from '@/lib/api'
import { SiteBanner as SiteBannerType } from '@/lib/supabase'
import { getImageProps } from '@/lib/image-utils'

interface SiteBannerProps {
  className?: string
}

export function SiteBanner({ className = '' }: SiteBannerProps) {
  const [bannerData, setBannerData] = useState<SiteBannerType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadBanner()
  }, [])

  const loadBanner = async () => {
    try {
      const data = await getSiteBanner()
      setBannerData(data)
    } catch (error) {
      console.error('배너 로드 오류:', error)
      // 기본값 설정
      setBannerData({
        id: 1,
        title: '국룰에 오신 것을 환영합니다',
        subtitle: '한국인들이 선택한 진짜 국민 아이템을 한눈에!\n검증된 제품들로 쇼핑의 새로운 기준을 제시합니다.',
        background_image: null,
        is_active: true,
        created_at: '',
        updated_at: ''
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !bannerData) {
    return (
      <div className={`px-4 pt-4 pb-6 ${className}`}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-hover p-8 animate-pulse">
          <div>
            <div className="h-6 bg-white/20 rounded mb-3 w-3/4"></div>
            <div className="h-4 bg-white/20 rounded mb-2 w-full"></div>
            <div className="h-4 bg-white/20 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`px-4 pt-4 pb-6 ${className}`}>
      <div className="relative overflow-hidden rounded-2xl">
        {bannerData.background_image ? (
          // 이미지 배경이 있는 경우
          <div className="relative">
            <Image
              {...getImageProps(bannerData.background_image, {
                src: bannerData.background_image,
                alt: "사이트 배너 배경",
                width: 800,
                height: 200,
                className: "w-full h-48 object-cover"
              })}
            />
            {/* 어두운 오버레이 */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            
            {/* 콘텐츠 */}
            <div className="absolute inset-0 p-8 flex items-center">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-3 leading-tight text-white">
                  {bannerData.title}
                </h2>
                <p className="text-base text-white/90 leading-relaxed whitespace-pre-line">
                  {bannerData.subtitle}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // 기본 그라데이션 배경
          <div className="bg-gradient-to-r from-primary to-primary-hover p-8">
            <div className="relative z-10">
              <div>
                <h2 className="text-xl font-bold mb-3 leading-tight text-white">
                  {bannerData.title}
                </h2>
                <p className="text-base text-white/80 leading-relaxed whitespace-pre-line">
                  {bannerData.subtitle}
                </p>
              </div>
            </div>
            
            {/* 배경 장식 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-10 -translate-x-10"></div>
          </div>
        )}
      </div>
    </div>
  )
}