'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/feedback/Spinner'
import { Footer } from '@/components/layout/Footer'
import { getProducts, getCategories } from '@/lib/api'
import { Product, Category } from '@/lib/supabase'

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id as string
  
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState('')

  // 카테고리 매핑 (이미지 파일명과 매칭)
  const categoryMapping: { [key: string]: string } = {
    '화장품': 'cosmetics',
    '가구': 'furniture',
    '생활가전': 'home_appliances',
    'PC주변기기': 'pc_peripherals',
    '스포츠용품': 'sporting_goods',
    '타블렛PC': 'tablet_and_smartphone',
    '생활용품': 'household_goods'
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProducts({ categoryId })
        ])
        
        setCategories(categoriesData)
        setProducts(productsData)
        
        // 현재 카테고리 찾기
        const currentCategory = categoriesData.find(cat => cat.id === categoryId)
        setCategory(currentCategory || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    if (categoryId) {
      fetchData()
    }
  }, [categoryId])

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
            <Button onClick={() => router.push('/home')} variant="primary">
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const getCategoryImage = (categoryName: string) => {
    const imageKey = categoryMapping[categoryName]
    return imageKey ? `/${imageKey}.png` : null
  }

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/home?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
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
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="궁금한 국민 아이템을 검색해 보세요"
                  className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </header>

        {/* Navigation with Back Button */}
        <div className="bg-white px-4">
          <div className="flex items-center space-x-4 border-b border-gray-200 pb-2">
            <button 
              onClick={() => router.back()}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">이전</span>
            </button>
            <div className="h-4 w-px bg-gray-300"></div>
            <span className="text-sm font-medium text-teal-500">{category?.name || '카테고리'}</span>
          </div>
        </div>

        {/* Category Info */}
        {category && (
          <div className="bg-white px-4 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 flex items-center justify-center">
                {getCategoryImage(category.name) && (
                  <Image
                    src={getCategoryImage(category.name)!}
                    alt={category.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{category.name}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  총 {products.length}개의 제품
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        <main className="px-4 py-4">
          {products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product) => (
                <Card 
                  key={product.id}
                  variant="base"
                  className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {(() => {
                        const thumbnailUrl = (product.images && product.images.length > 0) 
                          ? product.images[0] 
                          : product.thumbnail_url
                        
                        return thumbnailUrl ? (
                          <Image 
                            src={thumbnailUrl} 
                            alt={product.title}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">제품</span>
                        )
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      {product.price && (
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-teal-600">
                            ₩{product.price.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">제품이 없습니다</h3>
              <p className="text-gray-500 mb-4">
                이 카테고리에는 아직 등록된 제품이 없습니다.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/home')}
              >
                홈으로 돌아가기
              </Button>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  )
}