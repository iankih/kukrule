'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface CarouselItem {
  id: number
  title: string
  subtitle: string
  color: string
  image: string | null
}

export default function CarouselManager() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // 기본 캐러셀 데이터 (하드코딩)
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([
    {
      id: 1,
      title: '오직, 국룰에서만 만나볼 수 있어요\n특별한 국민 아이템',
      subtitle: '브랜드데이 특가',
      color: 'teal',
      image: null
    },
    {
      id: 2,
      title: '트렌드를 앞서가는\n뷰티 아이템 모음',
      subtitle: '신상품 출시',
      color: 'purple',
      image: null
    },
    {
      id: 3,
      title: '검증된 품질의\n베스트 셀러 상품',
      subtitle: '인기 상품 모음',
      color: 'orange',
      image: null
    }
  ])

  const handleImageUpload = (itemId: number, file: File) => {
    if (!file || !file.type.includes('png')) {
      alert('PNG 파일만 업로드 가능합니다.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      setCarouselItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, image: imageUrl }
            : item
        )
      )
    }
    reader.readAsDataURL(file)
  }

  const handleTitleChange = (itemId: number, title: string) => {
    setCarouselItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, title }
          : item
      )
    )
  }

  const handleSubtitleChange = (itemId: number, subtitle: string) => {
    setCarouselItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, subtitle }
          : item
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">캐러셀 관리</h1>
              <p className="text-sm text-gray-500">홈페이지 캐러셀 이미지 및 내용 관리</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/admin')}
              >
                대시보드로 돌아가기
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">캐러셀 항목 관리</h2>
          <p className="text-gray-600">홈페이지에 표시되는 3개의 캐러셀 항목을 관리할 수 있습니다.</p>
        </div>

        {/* 캐러셀 항목 리스트 */}
        <div className="space-y-6">
          {carouselItems.map((item) => (
            <Card key={item.id} variant="base">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-4 h-4 rounded-full bg-${item.color}-400`}></div>
                      <h3 className="text-lg font-semibold text-gray-900">캐러셀 {item.id}</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          제목
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                          rows={3}
                          value={item.title}
                          onChange={(e) => handleTitleChange(item.id, e.target.value)}
                          placeholder="캐러셀 제목을 입력하세요"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          부제목
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
                          value={item.subtitle}
                          onChange={(e) => handleSubtitleChange(item.id, e.target.value)}
                          placeholder="캐러셀 부제목을 입력하세요"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          제품 이미지 (PNG)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                          {item.image ? (
                            <div className="text-center">
                              <img 
                                src={item.image} 
                                alt={`캐러셀 ${item.id} 이미지`}
                                className="mx-auto max-h-32 rounded-lg shadow-sm"
                              />
                              <div className="mt-4">
                                <label htmlFor={`file-upload-${item.id}`} className="cursor-pointer">
                                  <span className="text-sm text-teal-600 font-medium">
                                    이미지 변경하기
                                  </span>
                                </label>
                                <input
                                  id={`file-upload-${item.id}`}
                                  name={`file-upload-${item.id}`}
                                  type="file"
                                  accept=".png"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleImageUpload(item.id, file)
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <div className="mt-4">
                                <label htmlFor={`file-upload-${item.id}`} className="cursor-pointer">
                                  <span className="mt-2 block text-sm font-medium text-gray-900">
                                    클릭하여 이미지 업로드
                                  </span>
                                  <span className="mt-1 block text-xs text-gray-500">
                                    PNG 파일만 지원됩니다
                                  </span>
                                </label>
                                <input
                                  id={`file-upload-${item.id}`}
                                  name={`file-upload-${item.id}`}
                                  type="file"
                                  accept=".png"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleImageUpload(item.id, file)
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 미리보기 영역 */}
                  <div className="ml-8 w-80">
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">미리보기</span>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl">
                      <div className={`bg-gradient-to-r from-${item.color}-100 via-${item.color}-50 to-${item.color}-100 p-6`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h2 className="text-lg font-bold text-gray-900 mb-2 leading-tight whitespace-pre-line">
                              {item.title}
                            </h2>
                            <p className="text-sm text-gray-600">
                              {item.subtitle}
                            </p>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            <div className="w-20 h-24 rounded-lg flex items-center justify-center">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={`캐러셀 ${item.id} 미리보기`}
                                  className="w-full h-full object-contain rounded-lg"
                                />
                              ) : (
                                <span className="text-xs text-gray-400">제품</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="primary"
                    disabled={isLoading}
                  >
                    {isLoading ? '저장 중...' : '저장'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Card variant="base">
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">캐러셀 관리 안내</h3>
              <p className="text-gray-600">
                현재는 기본 구조만 구현되어 있습니다. 이미지 업로드 기능과 데이터베이스 연동은 추후 구현 예정입니다.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}