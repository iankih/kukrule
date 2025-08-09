'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function HomePage() {
  const [language, setLanguage] = useState('한국어')
  const [showScrollTop, setShowScrollTop] = useState(false)

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

        {/* Navigation tabs - not sticky */}
        <div className="bg-white px-4">
          <div className="flex space-x-6 border-b border-gray-200">
            <button className="pb-2 text-sm font-medium text-teal-500 border-b-2 border-teal-500">홈</button>
            <button className="pb-2 text-sm text-gray-500">랭킹</button>
            <button className="pb-2 text-sm text-gray-500">어워드</button>
          </div>
        </div>

        {/* Main content */}
        <main>
          {/* Main Slider (Promotion) */}
          <div className="px-4 pt-4 pb-6">
            <div className="relative overflow-hidden rounded-2xl">
              <div className="bg-gradient-to-r from-green-100 via-teal-50 to-teal-100 p-6">
                <div className="absolute top-3 left-3 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded">
                  5/10
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                      오직, 국룰에서만 만나볼 수 있어요<br />
                      특별한 국민 아이템
                    </h2>
                    <p className="text-sm text-gray-600">
                      브랜드데이 특가 ›
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <div className="w-20 h-24 bg-white rounded-lg shadow-sm flex items-center justify-center">
                      <span className="text-xs text-gray-400">제품</span>
                    </div>
                  </div>
                </div>
                <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="flex justify-center mt-3 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i === 4 ? 'bg-teal-400' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Awards Cards Section */}
          <div className="px-4 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">1,000만의 선택, 국룰 어워드</h2>
              <button className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Horizontal scrolling category cards */}
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { icon: '✿', label: '상반기 베스트\n신제품', color: 'pink' },
                { icon: '⚡', label: '상반기\n효능/효과', color: 'blue' },
                { icon: '🌿', label: '상반기\n비건', color: 'green' },
                { icon: '◉', label: '상반기 넥스트\n뷰티', color: 'purple' },
                { icon: '🎯', label: '신뢰도\n1위', color: 'orange' },
              ].map((category, index) => (
                <Card
                  key={index}
                  variant="base"
                  className="flex-shrink-0 w-24 h-28 p-3 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className={`w-10 h-10 bg-${category.color}-100 rounded-full flex items-center justify-center mb-2`}>
                      <span className={`text-${category.color}-500 text-lg`}>{category.icon}</span>
                    </div>
                    <span className="text-xs text-gray-600 text-center leading-tight whitespace-pre-line">
                      {category.label}
                    </span>
                  </div>
                </Card>
              ))}
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
            <Card variant="base" className="mb-4 p-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-sm">제품</span>
                  </div>
                  <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    1위
                  </div>
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 rounded">
                    ▲1
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">국민 필수템 #1</h4>
                  <p className="text-sm text-gray-500 mb-2">모든 피부타입</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-sm">⭐</span>
                      <span className="text-sm font-medium ml-1">4.8</span>
                    </div>
                    <span className="text-xs text-gray-400">(2,580)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-teal-600">₩15,900</span>
                </div>
              </div>
            </Card>

            {/* Ranking list */}
            <div className="grid grid-cols-2 gap-3">
              {[2, 3, 4, 5].map((rank) => (
                <div key={rank} className="flex items-center space-x-2 p-2">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-medium text-gray-600">
                    {rank}
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs text-gray-400">제품</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-gray-900 truncate">국민템 #{rank}</h5>
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-xs">⭐</span>
                      <span className="text-xs ml-1">4.{9-rank}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Choice Ranking */}
          <div className="px-4 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">국룰 고객들이 직접 선택한 랭킹</h3>
              <button className="text-sm text-teal-500 font-medium">카테고리 전체보기</button>
            </div>
            <div className="space-y-3">
              {[
                { rank: 1, name: "국민 필수 아이템 #1", rating: 4.59, reviews: 12580 },
                { rank: 2, name: "국민 필수 아이템 #2", rating: 4.52, reviews: 8920 },
                { rank: 3, name: "국민 필수 아이템 #3", rating: 4.48, reviews: 7340 },
                { rank: 4, name: "국민 필수 아이템 #4", rating: 4.45, reviews: 6180 },
                { rank: 5, name: "국민 필수 아이템 #5", rating: 4.42, reviews: 5670 },
              ].map((item) => (
                <div key={item.rank} className="flex items-center space-x-3 p-2">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-bold text-gray-700">
                    {item.rank}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600">{item.rating}</span>
                      <span className="text-gray-400">({item.reviews.toLocaleString()})</span>
                    </div>
                  </div>
                </div>
              ))}
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
              {[1, 2, 3, 4, 5, 6].map((rank) => (
                <div key={rank} className="flex items-center space-x-2 p-3 border border-gray-100 rounded-lg">
                  <div className="w-6 h-6 bg-yellow-100 rounded flex items-center justify-center">
                    <span className="text-xs text-yellow-600">🏆</span>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs text-gray-400">제품</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-gray-900 truncate">건성용 #{rank}</h5>
                    <div className="flex items-center text-xs">
                      <span className="text-yellow-400">⭐</span>
                      <span className="ml-1">4.{8-rank}</span>
                      <span className="text-gray-400 ml-1">({1200 + rank * 100})</span>
                    </div>
                  </div>
                </div>
              ))}
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
              {[1, 2, 3, 4, 5, 6].map((rank) => (
                <div key={rank} className="flex items-center space-x-2 p-3 border border-gray-100 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">{rank}</span>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs text-gray-400">제품</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-gray-900 truncate">20대 인기 #{rank}</h5>
                    <div className="flex items-center text-xs">
                      <span className="text-yellow-400">⭐</span>
                      <span className="ml-1">4.{7-rank}</span>
                      <span className="text-gray-400 ml-1">({800 + rank * 80})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full py-2 text-sm text-teal-500 font-medium border border-teal-200 rounded-lg hover:bg-teal-50">
              20대 전체보기
            </button>
          </div>

          {/* Trending Brands */}
          <div className="px-4 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">요즘 뜨는 브랜드</h3>
            
            <div className="space-y-4">
              {[
                { rank: 1, brand: "국룰 브랜드 A", change: 4, products: ["제품1", "제품2", "제품3"] },
                { rank: 2, brand: "국룰 브랜드 B", change: 2, products: ["제품1", "제품2", "제품3"] },
                { rank: 3, brand: "국룰 브랜드 C", change: -1, products: ["제품1", "제품2", "제품3"] },
              ].map((brand) => (
                <Card key={brand.rank} variant="base" className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-gray-900">{brand.rank}위</span>
                      <span className="font-semibold text-gray-900">{brand.brand}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        brand.change > 0 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {brand.change > 0 ? '▲' : '▼'}{Math.abs(brand.change)}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {brand.products.map((product, idx) => (
                      <div key={idx} className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-gray-400">{product}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
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