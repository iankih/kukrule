'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/feedback/Spinner'
import { getProducts, getCategories } from '@/lib/api'
import { Product, Category } from '@/lib/supabase'

export default function HomePage() {
  const router = useRouter()
  const [language, setLanguage] = useState('한국어')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const carouselItems = [
    {
      title: '오직, 국룰에서만 만나볼 수 있어요\n특별한 국민 아이템',
      subtitle: '브랜드데이 특가',
      color: 'teal'
    },
    {
      title: '트렌드를 앞서가는\n뷰티 아이템 모음',
      subtitle: '신상품 출시',
      color: 'purple'
    },
    {
      title: '검증된 품질의\n베스트 셀러 상품',
      subtitle: '인기 상품 모음',
      color: 'orange'
    }
  ]

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

    fetchData()
  }, [])

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX)
    setScrollLeft(currentSlide * 100)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX
    const walk = (x - startX) * 0.5 // 드래그 감도
    const newScrollLeft = scrollLeft - walk
    const slideWidth = 100
    const newSlideIndex = Math.round(newScrollLeft / slideWidth)
    const clampedIndex = Math.max(0, Math.min(carouselItems.length - 1, newSlideIndex))
    setCurrentSlide(clampedIndex)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].pageX)
    setScrollLeft(currentSlide * 100)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const x = e.touches[0].pageX
    const walk = (x - startX) * 0.5
    const newScrollLeft = scrollLeft - walk
    const slideWidth = 100
    const newSlideIndex = Math.round(newScrollLeft / slideWidth)
    const clampedIndex = Math.max(0, Math.min(carouselItems.length - 1, newSlideIndex))
    setCurrentSlide(clampedIndex)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

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
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 text-teal-400">
                  ✨
                </div>
                <span className="text-lg font-bold text-[#19D7D2]">kukrule</span>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-1 text-sm text-gray-600">
                  <span>🌐</span>
                  <span>{language}</span>
                  <span className="text-xs">▼</span>
                </button>
                <button className="text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </button>
              </div>
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
                placeholder="궁금한 국민 아이템을 검색해 보세요"
                className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Navigation tabs */}
        <div className="bg-white px-4">
          <div className="flex space-x-6 border-b border-gray-200">
            <button className="pb-2 text-sm font-medium text-teal-500 border-b-2 border-teal-500">홈</button>
            <button className="pb-2 text-sm text-gray-500">이벤트</button>
          </div>
        </div>

        {/* Main content */}
        <main>
          {/* Main Carousel Slider */}
          <div className="px-4 pt-4 pb-6">
            <div className="relative overflow-hidden rounded-2xl">
              {/* Carousel Container */}
              <div 
                className="relative cursor-grab select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              >
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {carouselItems.map((item, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <div className={`bg-gradient-to-r from-${item.color}-100 via-${item.color}-50 to-${item.color}-100 p-8`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight whitespace-pre-line">
                              {item.title}
                            </h2>
                            <p className="text-base text-gray-600">
                              {item.subtitle}
                            </p>
                          </div>
                          <div className="flex-shrink-0 ml-6">
                            <div className="w-24 h-32 rounded-lg flex items-center justify-center">
                              <span className="text-sm text-gray-400">제품</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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


          {/* Rising Ranking Section */}
          <div className="px-4 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm text-gray-500">8월 6일 수요일</span>
                <h3 className="text-lg font-bold text-gray-900">급상승 랭킹</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">1/10</span>
                <button className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Featured 1st place item */}
            {products.length > 0 && (
              <Card 
                variant="base" 
                className="mb-4 p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/products/${products[0].id}`)}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {products[0].thumbnail_url ? (
                        <img 
                          src={products[0].thumbnail_url} 
                          alt={products[0].title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">제품</span>
                      )}
                    </div>
                    <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      1위
                    </div>
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 rounded">
                      ▲1
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{products[0].title}</h4>
                    <p className="text-sm text-gray-500 mb-2">{products[0].categories?.name}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <span className="text-yellow-400 text-sm">⭐</span>
                        <span className="text-sm font-medium ml-1">4.8</span>
                      </div>
                      <span className="text-xs text-gray-400">(2,580)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-teal-600">
                      ₩{products[0].price?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Ranking list */}
            <div className="grid grid-cols-2 gap-3">
              {products.slice(1, 5).map((product, index) => {
                const rank = index + 2
                return (
                  <div key={product.id} className="flex items-center space-x-2 p-2">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-medium text-gray-600">
                      {rank}
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {product.thumbnail_url ? (
                        <img 
                          src={product.thumbnail_url} 
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">제품</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-gray-900 truncate">{product.title}</h5>
                      <div className="flex items-center">
                        <span className="text-yellow-400 text-xs">⭐</span>
                        <span className="text-xs ml-1">4.{8-index}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Customer Choice Ranking */}
          <div className="px-4 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">국룰 고객들이 직접 선택한 랭킹</h3>
              <button className="text-sm text-teal-500 font-medium">카테고리 전체보기</button>
            </div>
            <div className="space-y-3">
              {products.slice(0, 5).map((product, index) => {
                const rank = index + 1
                const baseRating = 4.60 - index * 0.02 // 4.60, 4.58, 4.56, etc.
                const baseReviews = 12000 - index * 1000 // 리뷰 수도 리얼하게 만들기
                
                return (
                  <div 
                    key={product.id} 
                    className="flex items-center space-x-3 p-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => router.push(`/products/${product.id}`)}
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-bold text-gray-700">
                      {rank}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{product.title}</h4>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">{baseRating.toFixed(2)}</span>
                        <span className="text-gray-400">({baseReviews.toLocaleString()})</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Skin Type Ranking */}
          <div className="px-4 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">피부 타입별 랭킹</h3>
            
            {/* Tab navigation */}
            <div className="flex space-x-1 mb-6 overflow-x-auto">
              {['건성', '지성', '중성', '복합성', '민감성', '여드름', '아토피'].map((type, index) => (
                <button
                  key={type}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    index === 0
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Skin type products */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {products.slice(0, 6).map((product, index) => {
                const rank = index + 1
                const rating = 4.8 - index * 0.1
                const reviews = 1200 + index * 100
                
                return (
                  <div key={product.id} className="flex items-center space-x-2 p-3 border border-gray-100 rounded-lg">
                    <div className="w-6 h-6 bg-yellow-100 rounded flex items-center justify-center">
                      <span className="text-xs text-yellow-600">🏆</span>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {product.thumbnail_url ? (
                        <img 
                          src={product.thumbnail_url} 
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">제품</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-gray-900 truncate">
                        {product.title.substring(0, 15)}{product.title.length > 15 ? '...' : ''}
                      </h5>
                      <div className="flex items-center text-xs">
                        <span className="text-yellow-400">⭐</span>
                        <span className="ml-1">{rating.toFixed(1)}</span>
                        <span className="text-gray-400 ml-1">({reviews})</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <button className="w-full py-2 text-sm text-teal-500 font-medium border border-teal-200 rounded-lg hover:bg-teal-50">
              건성 전체보기
            </button>
          </div>

          {/* Age Group Recommendations */}
          <div className="px-4 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">나이대별 추천</h3>
            
            {/* Age tabs */}
            <div className="flex space-x-1 mb-6">
              {['10대', '20대', '30대', '40대 이상'].map((age, index) => (
                <button
                  key={age}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    index === 1
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>

            {/* Age group products */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {products.slice(0, 6).map((product, index) => {
                const rank = index + 1
                const rating = 4.7 - index * 0.1
                const reviews = 800 + index * 80
                
                return (
                  <div key={`age-${product.id}`} className="flex items-center space-x-2 p-3 border border-gray-100 rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">{rank}</span>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {product.thumbnail_url ? (
                        <img 
                          src={product.thumbnail_url} 
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">제품</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-gray-900 truncate">
                        {product.title.substring(0, 15)}{product.title.length > 15 ? '...' : ''}
                      </h5>
                      <div className="flex items-center text-xs">
                        <span className="text-yellow-400">⭐</span>
                        <span className="ml-1">{rating.toFixed(1)}</span>
                        <span className="text-gray-400 ml-1">({reviews})</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <button className="w-full py-2 text-sm text-teal-500 font-medium border border-teal-200 rounded-lg hover:bg-teal-50">
              20대 전체보기
            </button>
          </div>

          {/* Trending Brands */}
          <div className="px-4 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">요즘 뜨는 브랜드</h3>
            
            <div className="space-y-4">
              {categories.slice(0, 3).map((category, index) => {
                const rank = index + 1
                const changes = [4, 2, -1]
                const categoryProducts = products.filter(p => p.category_id === category.id).slice(0, 3)
                
                return (
                  <Card key={category.id} variant="base" className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-gray-900">{rank}위</span>
                        <span className="font-semibold text-gray-900">{category.name} 브랜드</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          changes[index] > 0 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {changes[index] > 0 ? '▲' : '▼'}{Math.abs(changes[index])}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {categoryProducts.length > 0 ? (
                        categoryProducts.map((product) => (
                          <div key={product.id} className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {product.thumbnail_url ? (
                              <img 
                                src={product.thumbnail_url} 
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-gray-400">제품</span>
                            )}
                          </div>
                        ))
                      ) : (
                        // 카테고리에 제품이 없을 경우 기본 플레이스홀더
                        Array.from({ length: 3 }, (_, idx) => (
                          <div key={idx} className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-gray-400">제품</span>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
            
            <button className="w-full py-3 mt-4 text-sm text-teal-500 font-medium border border-teal-200 rounded-lg hover:bg-teal-50">
              브랜드 전체보기
            </button>
          </div>

          {/* Bottom spacing */}
          <div className="h-20"></div>
        </main>
        
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