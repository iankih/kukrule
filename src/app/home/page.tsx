'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/feedback/Spinner'
import { Footer } from '@/components/layout/Footer'
import { getProducts, getCategories } from '@/lib/api'
import { Product, Category } from '@/lib/supabase'
import { getCarouselTheme } from '@/lib/carousel-theme'

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null) // 자동 슬라이드 타이머
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null) // 검색 디바운싱 타이머
  
  // 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchMode, setIsSearchMode] = useState(false)

  // 캐러셀 아이템을 상태로 관리
  const [carouselItems, setCarouselItems] = useState([
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

  // URL 파라미터에서 검색어 확인 및 초기화
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search')
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery)
      setIsSearchMode(true)
      performSearch(urlSearchQuery)
    }
  }, [searchParams])

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [productsData, categoriesData] = await Promise.all([
          getProducts({ limit: 10 }),
          getCategories()
        ])
        setProducts(productsData)
        setCategories(categoriesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    // URL에 검색 파라미터가 없을 때만 기본 데이터 로드
    const urlSearchQuery = searchParams.get('search')
    if (!urlSearchQuery) {
      fetchData()
    } else {
      setIsLoading(false)
    }
  }, [])

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 캐러셀 데이터 로드 및 업데이트 이벤트 리스너
  useEffect(() => {
    // 데이터베이스에서 캐러셀 데이터 불러오기
    const loadCarouselData = async () => {
      try {
        const response = await fetch('/api/carousel')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data.length > 0) {
            setCarouselItems(data.data)
            // 로컬 스토리지에도 백업 저장
            localStorage.setItem('carousel-items', JSON.stringify(data.data))
            return
          }
        }
        
        // 데이터베이스에서 불러오지 못한 경우, 로컬 스토리지 확인
        const savedCarouselData = localStorage.getItem('carousel-items')
        if (savedCarouselData) {
          const parsedData = JSON.parse(savedCarouselData)
          setCarouselItems(parsedData)
        }
      } catch (error) {
        console.error('캐러셀 데이터 로드 실패:', error)
        // 에러 발생 시 로컬 스토리지에서 로드 시도
        try {
          const savedCarouselData = localStorage.getItem('carousel-items')
          if (savedCarouselData) {
            const parsedData = JSON.parse(savedCarouselData)
            setCarouselItems(parsedData)
          }
        } catch (localError) {
          console.error('로컬 캐러셀 데이터 로드도 실패:', localError)
        }
      }
    }

    // 초기 로드
    loadCarouselData()

    // 캐러셀 업데이트 이벤트 리스너
    const handleCarouselUpdate = (event: CustomEvent) => {
      setCarouselItems(event.detail)
    }

    window.addEventListener('carousel-updated', handleCarouselUpdate as EventListener)

    return () => {
      window.removeEventListener('carousel-updated', handleCarouselUpdate as EventListener)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 검색 함수
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setIsSearchMode(false)
      return
    }

    try {
      setIsSearching(true)
      setIsSearchMode(true)
      const results = await getProducts({ search: query, limit: 20 })
      setSearchResults(results)
    } catch (error) {
      console.error('검색 오류:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // 검색어 입력 핸들러
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
  }

  // 검색창 클리어
  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setIsSearchMode(false)
    // 검색 타이머도 정리
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
  }

  // 디바운싱된 검색 실행
  useEffect(() => {
    // 기존 타이머 정리
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // 검색어가 있으면 500ms 후에 검색 실행
    if (searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchQuery.trim())
      }, 500)
    } else {
      // 검색어가 없으면 즉시 검색 모드 해제
      setSearchResults([])
      setIsSearchMode(false)
      setIsSearching(false)
    }

    // 클린업 함수
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])


  // 자동 슬라이드 초기화 및 정리
  useEffect(() => {
    // 직접 타이머 설정
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselItems.length)
    }, 3000)
    
    autoSlideRef.current = timer
    
    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current)
      }
    }
  }, [carouselItems.length])


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center">
        <div className="w-full max-w-[600px] min-w-[320px] bg-white min-h-screen shadow-xl flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Spinner size="lg" />
            <p className="text-gray-600">데이터를 불러오고 있습니다...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center">
        <div className="w-full max-w-[600px] min-w-[320px] bg-white min-h-screen shadow-xl flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="primary">
              다시 시도
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* Mobile-first single view container - 120% wider than standard mobile */}
      <div className="w-full max-w-[600px] min-w-[320px] bg-white min-h-screen shadow-xl">
        {/* Top bar - not sticky */}
        <div className="bg-white">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => router.push('/home')}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-6 h-6 text-teal-400">
                  ✨
                </div>
                <span className="text-lg font-bold text-[#19D7D2]">kukrule</span>
              </button>
            </div>
          </div>
        </div>

        {/* Fixed Search Header */}
        <header className="bg-white sticky top-0 z-50">
          {/* Search bar */}
          <div className="px-4 py-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                placeholder="궁금한 국민 아이템을 검색해 보세요"
                className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              {searchQuery ? (
                <button 
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </header>


        {/* Main content */}
        <main>
          {/* 검색 결과 섹션 */}
          {isSearchMode && (
            <div className="px-4 pt-4">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      '{searchQuery}' 검색 결과
                    </h2>
                    {!isSearching && (
                      <p className="text-sm text-gray-500">
                        {searchResults.length}개의 제품을 찾았습니다
                      </p>
                    )}
                  </div>
                  {isSearching && (
                    <div className="flex items-center space-x-2">
                      <Spinner size="sm" />
                      <span className="text-sm text-gray-500">검색 중...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 검색 결과 목록 */}
              {isSearching ? (
                <div className="flex justify-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <Spinner size="lg" />
                    <p className="text-gray-600">검색 중입니다...</p>
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-3 mb-8">
                  {searchResults.map((product, index) => (
                    <Card 
                      key={product.id} 
                      variant="base" 
                      className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {(() => {
                            // 첫 번째 이미지를 썸네일로 사용 (새로운 방식)
                            const thumbnailUrl = (product.images && product.images.length > 0) 
                              ? product.images[0] 
                              : product.thumbnail_url
                            
                            return thumbnailUrl ? (
                              <Image 
                                src={thumbnailUrl} 
                                alt={product.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-400 text-sm">제품</span>
                            )
                          })()
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2" style={{ color: '#111827' }}>
                            {product.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {product.categories?.name || '카테고리'}
                          </p>
                          <div className="flex items-center justify-end">
                            {product.price && (
                              <span className="text-lg font-bold text-teal-600">
                                ₩{product.price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
                  <p className="text-gray-500 mb-4">
                    '{searchQuery}'와 관련된 제품을 찾을 수 없습니다.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                  >
                    검색 초기화
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* 검색 모드가 아닐 때만 기존 콘텐츠 표시 */}
          {!isSearchMode && (
            <>
              {/* Main Carousel Slider */}
              <div className="px-4 pt-4 pb-6">
                <div className="relative overflow-hidden rounded-2xl">
                  {/* Carousel Container */}
                  <div className="relative">
                    <div 
                      className="flex transition-transform duration-300 ease-in-out"
                      style={{ 
                        transform: `translateX(-${currentSlide * 102}%)`, // 102%로 캐러셀 간 간격 추가
                        gap: '8px' // 캐러셀 사이 간격
                      }}
                    >
                      {carouselItems.map((item, index) => {
                        const themeColors = getCarouselTheme(item.color)
                        return (
                          <div key={index} className="w-full flex-shrink-0">
                            <div 
                              className="p-8"
                              style={{ 
                                background: themeColors.gradient,
                                borderRadius: '16px'
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h2 
                                    className="text-xl font-bold mb-3 leading-tight whitespace-pre-line"
                                    style={{ color: themeColors.textColor }}
                                  >
                                    {item.title}
                                  </h2>
                                  <p 
                                    className="text-base"
                                    style={{ color: themeColors.subtitleColor }}
                                  >
                                    {item.subtitle}
                                  </p>
                                </div>
                                <div className="flex-shrink-0 ml-6">
                                  <div className="w-24 h-32 rounded-lg flex items-center justify-center bg-white/20 overflow-hidden">
                                    {item.image ? (
                                      <Image 
                                        src={item.image} 
                                        alt={`캐러셀 ${item.id} 이미지`}
                                        width={96}
                                        height={128}
                                        className="w-full h-full object-contain"
                                      />
                                    ) : (
                                      <span className="text-sm text-gray-400">제품</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Slide Indicators */}
                  <div className="flex justify-center mt-4 space-x-2">
                    {carouselItems.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentSlide ? 'bg-teal-400' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>


          {/* Kukrule Category Section */}
          <div className="px-4 mb-8">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900">국룰템 카테고리</h3>
            </div>
            
            {/* Category Grid - 3x3 with empty card */}
            <div className="grid grid-cols-3 gap-4">
              {/* 화장품 */}
              <Card 
                variant="base" 
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow text-center"
                onClick={() => {
                  const category = categories.find(cat => cat.name === '화장품')
                  if (category) router.push(`/categories/${category.id}`)
                }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Image 
                      src="/cosmetics.png" 
                      alt="화장품"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">화장품</span>
                </div>
              </Card>

              {/* 가구 */}
              <Card 
                variant="base" 
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow text-center"
                onClick={() => {
                  const category = categories.find(cat => cat.name === '가구')
                  if (category) router.push(`/categories/${category.id}`)
                }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Image 
                      src="/furniture.png" 
                      alt="가구"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">가구</span>
                </div>
              </Card>

              {/* 생활가전 */}
              <Card 
                variant="base" 
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow text-center"
                onClick={() => {
                  const category = categories.find(cat => cat.name === '생활가전')
                  if (category) router.push(`/categories/${category.id}`)
                }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Image 
                      src="/home_appliances.png" 
                      alt="생활가전"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">생활가전</span>
                </div>
              </Card>

              {/* PC주변기기 */}
              <Card 
                variant="base" 
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow text-center"
                onClick={() => {
                  const category = categories.find(cat => cat.name === 'PC주변기기')
                  if (category) router.push(`/categories/${category.id}`)
                }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Image 
                      src="/pc_peripherals.png" 
                      alt="PC주변기기"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">PC주변기기</span>
                </div>
              </Card>

              {/* 스포츠용품 */}
              <Card 
                variant="base" 
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow text-center"
                onClick={() => {
                  const category = categories.find(cat => cat.name === '스포츠용품')
                  if (category) router.push(`/categories/${category.id}`)
                }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Image 
                      src="/sporting_goods.png" 
                      alt="스포츠용품"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">스포츠용품</span>
                </div>
              </Card>

              {/* 타블렛PC */}
              <Card 
                variant="base" 
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow text-center"
                onClick={() => {
                  const category = categories.find(cat => cat.name === '타블렛PC')
                  if (category) router.push(`/categories/${category.id}`)
                }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Image 
                      src="/tablet_and_smartphone.png" 
                      alt="타블렛PC"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">타블렛PC</span>
                </div>
              </Card>

              {/* 생활용품 */}
              <Card 
                variant="base" 
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow text-center"
                onClick={() => {
                  const category = categories.find(cat => cat.name === '생활용품')
                  if (category) router.push(`/categories/${category.id}`)
                }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Image 
                      src="/household_goods.png" 
                      alt="생활용품"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">생활용품</span>
                </div>
              </Card>

              {/* 빈 카테고리 카드 */}
              <Card variant="base" className="p-4 text-center bg-gray-50">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full">
                    <span className="text-gray-400 text-xs">+</span>
                  </div>
                  <span className="text-sm font-medium text-gray-400">추가 예정</span>
                </div>
              </Card>

              {/* 빈 카테고리 카드 2 */}
              <Card variant="base" className="p-4 text-center bg-gray-50">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full">
                    <span className="text-gray-400 text-xs">+</span>
                  </div>
                  <span className="text-sm font-medium text-gray-400">추가 예정</span>
                </div>
              </Card>
            </div>
          </div>

          {/* Click-based Ranking */}
          <div className="px-4 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">가장 많은 사용자가 선택한 제품 랭킹</h3>
            </div>
            <div className="space-y-3">
              {products.slice(0, 5).map((product, index) => {
                const rank = index + 1
                
                return (
                  <div 
                    key={product.id} 
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                    onClick={() => router.push(`/products/${product.id}`)}
                  >
                    <div className="w-8 h-8 bg-teal-500 text-white rounded flex items-center justify-center text-sm font-bold">
                      {rank}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{product.title}</h4>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">{product.categories?.name || '카테고리'}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{product.title}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>


            </>
          )}
        </main>
        
        <Footer />
        
        {/* Scroll to top button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 bg-teal-500 hover:bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}