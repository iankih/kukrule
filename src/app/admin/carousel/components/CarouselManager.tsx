'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/feedback/Spinner'
import { getCarouselTheme, carouselThemes, type CarouselThemeKey } from '@/lib/carousel-theme'

interface CarouselItem {
  id: number
  title: string
  subtitle: string
  color: string
  image: string | null
  link_url?: string | null
  order?: number
  is_active?: boolean
}

export default function CarouselManager() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [setupError, setSetupError] = useState<string | null>(null)
  const [carouselEnabled, setCarouselEnabled] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  // 캐러셀 데이터 상태 관리
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

  // 캐러셀 설정 불러오기
  const loadCarouselSettings = async () => {
    try {
      // 먼저 localStorage에서 확인
      const localSettings = localStorage.getItem('carousel-settings')
      if (localSettings) {
        const parsedSettings = JSON.parse(localSettings)
        setCarouselEnabled(parsedSettings.enabled)
      }

      const response = await fetch('/api/carousel/settings')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCarouselEnabled(data.data.enabled)
          // localStorage에도 저장
          localStorage.setItem('carousel-settings', JSON.stringify(data.data))
        }
      }
    } catch (error) {
      console.error('캐러셀 설정 로드 실패:', error)
    }
  }

  // 컴포넌트 마운트 시 데이터베이스에서 데이터 불러오기
  useEffect(() => {
    const loadCarouselData = async () => {
      try {
        setIsLoading(true)
        const credentials = btoa(`${process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin'}:${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'kukrule2025!'}`)
        
        // 관리자 모드로 모든 아이템 조회
        const response = await fetch('/api/carousel?admin=true', {
          headers: {
            'Authorization': `Basic ${credentials}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data.length > 0) {
            setCarouselItems(data.data)
            // 데이터베이스 데이터를 로컬 스토리지에도 저장 (백업용)
            localStorage.setItem('carousel-items', JSON.stringify(data.data))
            return
          }
        }
        
        // 데이터베이스에서 불러오지 못한 경우, 로컬 스토리지 확인
        const savedData = localStorage.getItem('carousel-items')
        if (savedData) {
          const parsedData = JSON.parse(savedData)
          setCarouselItems(parsedData)
        }
      } catch (error) {
        console.error('캐러셀 데이터 로드 실패:', error)
        setSetupError('캐러셀 데이터베이스 테이블이 존재하지 않습니다. 데이터베이스 설정을 진행해주세요.')
        
        // 에러 발생 시 로컬 스토리지에서 로드 시도
        try {
          const savedData = localStorage.getItem('carousel-items')
          if (savedData) {
            const parsedData = JSON.parse(savedData)
            setCarouselItems(parsedData)
          }
        } catch (localError) {
          console.error('로컬 데이터 로드도 실패:', localError)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadCarouselData()
    loadCarouselSettings()
  }, [])

  const handleSetupDatabase = async () => {
    try {
      setIsLoading(true)
      setSetupError(null)
      
      const credentials = btoa(`${process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin'}:${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'kukrule2025!'}`)
      
      const response = await fetch('/api/setup-carousel', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      })

      const result = await response.json()
      
      if (result.success) {
        alert('데이터베이스 설정이 완료되었습니다!')
        // 데이터 다시 로드
        window.location.reload()
      } else {
        setSetupError(result.error)
        if (result.sqlQuery) {
          console.log('SQL 쿼리:', result.sqlQuery)
          alert('Supabase 대시보드에서 SQL 쿼리를 실행해주세요. 콘솔을 확인해주세요.')
        }
      }
    } catch (error) {
      console.error('데이터베이스 설정 오류:', error)
      setSetupError(error instanceof Error ? error.message : '설정 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (itemId: number, file: File) => {
    if (!file) {
      alert('파일을 선택해주세요.')
      return
    }
    
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    try {
      // FormData 생성
      const formData = new FormData()
      formData.append('file', file)

      // 관리자 인증 헤더 생성
      const credentials = btoa(`${process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin'}:${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'kukrule2025!'}`)
      
      // 이미지 업로드 API 호출
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('이미지 업로드 실패')
      }

      const responseData = await response.json()
      const imageUrl = responseData.data.url

      // 캐러셀 아이템 업데이트
      setCarouselItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, image: imageUrl }
            : item
        )
      )

      console.log('이미지 업로드 성공:', imageUrl)
    } catch (error) {
      console.error('이미지 업로드 에러:', error)
      alert('이미지 업로드에 실패했습니다.')
    }
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

  const handleColorChange = (itemId: number, color: string) => {
    setCarouselItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, color }
          : item
      )
    )
  }

  const handleLinkChange = (itemId: number, link_url: string) => {
    setCarouselItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, link_url: link_url || null }
          : item
      )
    )
  }

  const handleToggleActive = (itemId: number) => {
    setCarouselItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, is_active: !item.is_active }
          : item
      )
    )
  }

  const addNewCarouselItem = () => {
    if (carouselItems.length >= 5) {
      alert('캐러셀 아이템은 최대 5개까지 생성할 수 있습니다.')
      return
    }
    
    const newId = Math.max(...carouselItems.map(item => item.id)) + 1
    const newItem: CarouselItem = {
      id: newId,
      title: '새로운 캐러셀 제목\n부제목을 입력하세요',
      subtitle: '새로운 부제목',
      color: 'teal',
      image: null,
      link_url: null,
      order: carouselItems.length + 1,
      is_active: false
    }
    
    setCarouselItems(prev => [...prev, newItem])
  }

  const removeCarouselItem = (itemId: number) => {
    if (carouselItems.length <= 2) {
      alert('캐러셀 아이템은 최소 2개 이상이어야 합니다.')
      return
    }
    
    if (confirm('이 캐러셀 아이템을 삭제하시겠습니까?')) {
      setCarouselItems(prev => prev.filter(item => item.id !== itemId))
    }
  }

  // 캐러셀 토글 핸들러
  const handleToggleCarousel = async () => {
    try {
      setIsToggling(true)
      const credentials = btoa(`${process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin'}:${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'kukrule2025!'}`)
      
      const response = await fetch('/api/carousel/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify({
          enabled: !carouselEnabled
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '설정 변경에 실패했습니다.')
      }

      const result = await response.json()
      if (result.success) {
        setCarouselEnabled(result.data.enabled)
        
        // localStorage에도 저장
        localStorage.setItem('carousel-settings', JSON.stringify(result.data))
        
        // 홈페이지에서 사용할 수 있도록 window 이벤트 발생
        window.dispatchEvent(new CustomEvent('carousel-settings-updated', { 
          detail: result.data 
        }))
        
        alert(`캐러셀이 ${result.data.enabled ? '활성화' : '비활성화'}되었습니다.`)
      } else {
        throw new Error(result.error || '설정 변경에 실패했습니다.')
      }
    } catch (error) {
      console.error('캐러셀 토글 실패:', error)
      alert(error instanceof Error ? error.message : '설정 변경에 실패했습니다.')
    } finally {
      setIsToggling(false)
    }
  }

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true)
      // 관리자 인증 헤더 생성
      const credentials = btoa(`${process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin'}:${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'kukrule2025!'}`)
      
      // 데이터베이스에 저장
      const response = await fetch('/api/carousel', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify({
          items: carouselItems.map((item, index) => ({
            ...item,
            order: index + 1
          }))
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '저장에 실패했습니다.')
      }

      const result = await response.json()
      if (result.success) {
        // 로컬 스토리지에도 백업 저장
        localStorage.setItem('carousel-items', JSON.stringify(carouselItems))
        
        // 홈페이지에서 사용할 수 있도록 window 이벤트 발생
        window.dispatchEvent(new CustomEvent('carousel-updated', { 
          detail: carouselItems 
        }))
        
        alert('캐러셀 설정이 성공적으로 저장되었습니다!')
        setSetupError(null) // 저장 성공 시 에러 상태 초기화
      } else {
        throw new Error(result.error || '저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('저장 실패:', error)
      alert(error instanceof Error ? error.message : '저장에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" />
          <p className="text-gray-600">캐러셀 데이터를 불러오고 있습니다...</p>
        </div>
      </div>
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
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">캐러셀 표시:</span>
                <button
                  onClick={handleToggleCarousel}
                  disabled={isToggling}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    carouselEnabled ? 'bg-[#2D5F3F]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      carouselEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${
                  carouselEnabled ? 'text-[#2D5F3F]' : 'text-gray-400'
                }`}>
                  {isToggling ? '변경 중...' : (carouselEnabled ? 'ON' : 'OFF')}
                </span>
              </div>
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
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">캐러셀 항목 관리</h2>
              <p className="text-gray-600">홈페이지에 표시되는 캐러셀 항목을 관리할 수 있습니다. (최소 2개, 최대 5개)</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={addNewCarouselItem}
              disabled={carouselItems.length >= 5}
              className="ml-4"
            >
              + 캐러셀 추가
            </Button>
          </div>
          
          {!carouselEnabled && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">캐러셀이 비활성화됨</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    현재 캐러셀이 비활성화되어 홈페이지에 표시되지 않습니다. 위의 토글 버튼으로 활성화할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {setupError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-medium text-red-800">데이터베이스 설정 필요</h3>
                  <p className="text-sm text-red-600 mt-1">{setupError}</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSetupDatabase}
                  disabled={isLoading}
                >
                  {isLoading ? '설정 중...' : 'DB 설정'}
                </Button>
              </div>
              <div className="mt-3 p-3 bg-gray-100 border border-gray-200 rounded text-xs">
                <p className="font-medium text-gray-800 mb-2">Supabase 대시보드에서 아래 SQL을 실행하세요:</p>
                <pre className="text-gray-700 whitespace-pre-wrap overflow-x-auto">
{`CREATE TABLE carousel_items (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  color TEXT DEFAULT 'teal',
  image TEXT,
  "order" INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO carousel_items (id, title, subtitle, color, image, "order", is_active) VALUES
(1, '오직, 국룰에서만 만나볼 수 있어요\\n특별한 국민 아이템', '브랜드데이 특가', 'teal', null, 1, true),
(2, '트렌드를 앞서가는\\n뷰티 아이템 모음', '신상품 출시', 'purple', null, 2, true),
(3, '검증된 품질의\\n베스트 셀러 상품', '인기 상품 모음', 'orange', null, 3, true);`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* 캐러셀 항목 리스트 */}
        <div className={`space-y-6 ${!carouselEnabled ? 'opacity-60' : ''}`}>
          {carouselItems.map((item) => (
            <Card key={item.id} variant="base">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: getCarouselTheme(item.color).primary }}
                        ></div>
                        <h3 className="text-lg font-semibold text-gray-900">캐러셀 {item.id}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">활성화:</span>
                          <button
                            onClick={() => handleToggleActive(item.id)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                              item.is_active ? 'bg-[#2D5F3F]' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                item.is_active ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                      {carouselItems.length > 2 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCarouselItem(item.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          삭제
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          제목
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                          value={item.subtitle}
                          onChange={(e) => handleSubtitleChange(item.id, e.target.value)}
                          placeholder="캐러셀 부제목을 입력하세요"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          링크 URL (선택사항)
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                          value={item.link_url || ''}
                          onChange={(e) => handleLinkChange(item.id, e.target.value)}
                          placeholder="/home (내부링크) 또는 https://example.com (외부링크)"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          캐러셀 클릭 시 이동할 URL을 입력하세요. 비어있으면 클릭해도 이동하지 않습니다.
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          제품 이미지
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                          {item.image ? (
                            <div className="text-center">
                              <Image 
                                src={item.image} 
                                alt={`캐러셀 ${item.id} 이미지`}
                                width={128}
                                height={128}
                                className="mx-auto max-h-32 rounded-lg shadow-sm object-contain"
                              />
                              <div className="mt-4">
                                <label htmlFor={`file-upload-${item.id}`} className="cursor-pointer">
                                  <span className="text-sm text-[#2D5F3F] font-medium">
                                    이미지 변경하기
                                  </span>
                                </label>
                                <input
                                  id={`file-upload-${item.id}`}
                                  name={`file-upload-${item.id}`}
                                  type="file"
                                  accept="image/*"
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
                                    이미지 파일 (최대 5MB)
                                  </span>
                                </label>
                                <input
                                  id={`file-upload-${item.id}`}
                                  name={`file-upload-${item.id}`}
                                  type="file"
                                  accept="image/*"
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
                      <div 
                        className="p-6"
                        style={{ background: getCarouselTheme(item.color).gradient }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h2 
                              className="text-lg font-bold mb-2 leading-tight whitespace-pre-line"
                              style={{ color: getCarouselTheme(item.color).textColor }}
                            >
                              {item.title}
                            </h2>
                            <p 
                              className="text-sm"
                              style={{ color: getCarouselTheme(item.color).subtitleColor }}
                            >
                              {item.subtitle}
                            </p>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            <div className="w-20 h-24 rounded-lg flex items-center justify-center">
                              {item.image ? (
                                <Image 
                                  src={item.image} 
                                  alt={`캐러셀 ${item.id} 미리보기`}
                                  width={80}
                                  height={96}
                                  className="w-full h-full object-contain rounded-lg"
                                />
                              ) : (
                                <span className="text-xs text-gray-400">제품</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          배경 색상 테마
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                          value={item.color}
                          onChange={(e) => handleColorChange(item.id, e.target.value)}
                        >
                          {Object.entries(carouselThemes).map(([key, theme]) => (
                            <option key={key} value={key}>
                              {theme.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="primary"
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                  >
                    {isSaving ? '저장 중...' : '저장'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Card variant="base">
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">캐러셀 관리 완료!</h3>
              <p className="text-gray-600 mb-4">
                ✅ 이미지 업로드 기능 구현 완료<br />
                ✅ Supabase Storage 연동 완료<br />
                ✅ 데이터베이스 연동 완료<br />
                ✅ 실시간 홈페이지 반영 완료
              </p>
              <p className="text-sm text-gray-500">
                변경사항은 저장 버튼을 클릭하면 실시간으로 홈페이지에 반영됩니다.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}