'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/feedback/Spinner'
// Footer 동적 로드
const Footer = dynamic(() => import('@/components/layout/Footer').then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="bg-gray-100 h-32" />
})
import { getProducts, getComments, createComment, deleteComment, getContentBlocks } from '@/lib/api'
import { Product, Comment, ContentBlock } from '@/lib/supabase'
import { ContentBlockRenderer } from '@/components/ui/ContentBlockRenderer'
import { trackProductViewOnce, trackCoupangClick, trackNaverClick } from '@/lib/analytics'
import { getImageProps } from '@/lib/image-utils'
import dynamic from 'next/dynamic'

// 마크다운 프리뷰 동적 로드
const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview'),
  { ssr: false }
)

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  // 이미지 갤러리 상태
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false)
  
  // 스와이프 상태
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  
  // 댓글 작성 폼 상태
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false)
  const [commentForm, setCommentForm] = useState({
    author: '',
    content: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // 댓글 삭제 상태
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null)
  const [deletePassword, setDeletePassword] = useState('')
  
  // 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState('')

  // 제품 정보 가져오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const products = await getProducts({ limit: 100 })
        const foundProduct = products.find(p => p.id === productId)
        
        if (!foundProduct) {
          setError('제품을 찾을 수 없습니다.')
          return
        }
        
        setProduct(foundProduct)
        
        // 제품 조회수 추적 (한 번만)
        trackProductViewOnce(productId)
        
        // 댓글과 콘텐츠 블록도 함께 가져오기
        const [commentsData, contentBlocksData] = await Promise.all([
          getComments(productId),
          getContentBlocks(productId)
        ])
        setComments(commentsData)
        setContentBlocks(contentBlocksData)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

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

  // 댓글 작성
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!commentForm.author.trim() || !commentForm.content.trim() || !commentForm.password.trim()) {
      alert('모든 필드를 입력해주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      
      await createComment({
        product_id: productId,
        author: commentForm.author.trim(),
        content: commentForm.content.trim(),
        password: commentForm.password
      })

      // 댓글 목록 새로고침
      const updatedComments = await getComments(productId)
      setComments(updatedComments)
      
      // 폼 초기화
      setCommentForm({ author: '', content: '', password: '' })
      setIsCommentFormOpen(false)
      
    } catch (err) {
      alert(err instanceof Error ? err.message : '댓글 등록에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 댓글 삭제
  const handleCommentDelete = async (commentId: string) => {
    if (!deletePassword.trim()) {
      alert('비밀번호를 입력해주세요.')
      return
    }

    try {
      await deleteComment(commentId, deletePassword)
      
      // 댓글 목록 새로고침
      const updatedComments = await getComments(productId)
      setComments(updatedComments)
      
      // 상태 초기화
      setDeletingCommentId(null)
      setDeletePassword('')
      
      alert('댓글이 삭제되었습니다.')
      
    } catch (err) {
      alert(err instanceof Error ? err.message : '댓글 삭제에 실패했습니다.')
    }
  }
  
  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // 스와이프 핸들러
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = (allImages: string[]) => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentImageIndex < allImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1)
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center">
        <div className="w-full max-w-[600px] min-w-[320px] bg-white min-h-screen shadow-xl flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Spinner size="lg" />
            <p className="text-gray-600">제품 정보를 불러오고 있습니다...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center">
        <div className="w-full max-w-[600px] min-w-[320px] bg-white min-h-screen shadow-xl flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-red-600 mb-4">{error || '제품을 찾을 수 없습니다.'}</p>
            <Button onClick={() => router.back()} variant="primary">
              이전으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[600px] min-w-[320px] bg-white min-h-screen shadow-xl">
        {/* Top bar - not sticky */}
        <div className="bg-white">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-6 h-6 text-primary">
                  ✨
                </div>
                <span className="text-lg font-bold text-primary">kukrule</span>
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
                  className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
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
            <span className="text-sm font-medium text-primary">제품 상세</span>
          </div>
        </div>

        {/* 제품 정보 */}
        <div className="p-4">
          <div className="bg-white px-4 py-4 mb-6">
            {/* 제품 이미지 갤러리 */}
            <div className="mb-4">
              {/* 메인 이미지 */}
              <div 
                className="relative w-full bg-white rounded-lg overflow-hidden mb-3 group cursor-pointer border border-gray-200" 
                onClick={() => setIsImageGalleryOpen(true)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={() => {
                  const allImages = (product.images && product.images.length > 0) ? product.images : (product.thumbnail_url ? [product.thumbnail_url] : [])
                  onTouchEnd(allImages)
                }}
              >
                <div className="w-full pb-[100%]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                {(() => {
                  const allImages = (product.images && product.images.length > 0) ? product.images : (product.thumbnail_url ? [product.thumbnail_url] : [])
                  const currentImage = allImages[currentImageIndex]
                  
                  if (!currentImage) {
                    return <span className="text-gray-400">제품 이미지</span>
                  }
                  
                  return (
                    <>
                      <Image 
                        {...getImageProps(currentImage, {
                          src: currentImage,
                          alt: `${product.title} - 이미지 ${currentImageIndex + 1}`,
                          width: 600,
                          height: 600,
                          className: "w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
                        }, { priority: currentImageIndex === 0 })}
                      />
                      
                      {/* 좌우 화살표 버튼 */}
                      {allImages.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setCurrentImageIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1)
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setCurrentImageIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1)
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          
                          {/* 이미지 카운터 */}
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {currentImageIndex + 1} / {allImages.length}
                          </div>
                        </>
                      )}
                    </>
                  )
                })()
                }
                </div>
              </div>
            </div>
            
            {/* 카테고리 */}
            {product.categories?.name && (
              <div className="text-sm text-gray-600 mb-3">
                {product.categories.name}
              </div>
            )}
            
            {/* 제조사명 */}
            {product.manufacturer && (
              <div className="text-sm text-gray-500 mb-1">
                {product.manufacturer}
              </div>
            )}
            
            {/* 제품명 */}
            <h2 className="text-base font-medium text-gray-900 mb-2">{product.title}</h2>
            
            {/* 판매가 */}
            <div className="text-xl font-bold text-primary mb-4">
              ₩{product.price?.toLocaleString()}
            </div>
            
            {/* 링크 */}
            <div className="flex space-x-3 mb-4">
              {product.coupang_link && (
                <button
                  onClick={() => {
                    trackCoupangClick(productId)
                    window.open(product.coupang_link!, '_blank')
                  }}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors text-sm"
                >
                  쿠팡에서 보기
                </button>
              )}
              {product.naver_link && (
                <button
                  onClick={() => {
                    trackNaverClick(productId)
                    window.open(product.naver_link!, '_blank')
                  }}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors text-sm"
                >
                  네이버에서 보기
                </button>
              )}
            </div>
            
            {/* 언급 링크 */}
            {product.mention_links && product.mention_links.length > 0 && (
              <div className="border-t border-gray-100 pt-3 pb-3">
                <h3 className="text-xs font-semibold text-gray-700 mb-2">이 제품이 언급된 링크</h3>
                <div className="space-y-2">
                  {product.mention_links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-gray-900 block truncate">
                          {link.title}
                        </span>
                        <span className="text-xs text-gray-500 block truncate">
                          {link.url}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* 설명 */}
            <div className="border-t border-gray-100 pt-3">
              <h3 className="text-xs font-semibold text-gray-700 mb-3">제품 설명</h3>
              
              {/* 콘텐츠 블록 렌더링 */}
              {contentBlocks.length > 0 ? (
                <ContentBlockRenderer 
                  blocks={contentBlocks} 
                  className="space-y-4"
                />
              ) : (
                /* 마크다운 또는 기본 텍스트 설명 (호환성) */
                product.description && (
                  <div className="prose prose-sm max-w-none">
                    <MarkdownPreview
                      source={product.description}
                      style={{ backgroundColor: 'transparent', fontSize: '0.875rem' }}
                      data-color-mode="light"
                    />
                  </div>
                )
              )}
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* 댓글 섹션 */}
          <div className="mb-6 px-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                훈수 두기 ({comments.length})
              </h3>
              <button
                onClick={() => setIsCommentFormOpen(true)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-xs"
              >
                훈수 남기기
              </button>
            </div>

            {/* 댓글 작성 폼 */}
            {isCommentFormOpen && (
              <Card variant="base" className="mb-4">
                <form onSubmit={handleCommentSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        닉네임
                      </label>
                      <input
                        type="text"
                        value={commentForm.author}
                        onChange={(e) => setCommentForm(prev => ({ ...prev, author: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xs text-gray-900 bg-white placeholder-gray-500"
                        placeholder="닉네임을 입력하세요"
                        maxLength={50}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        비밀번호 (수정/삭제용)
                      </label>
                      <input
                        type="password"
                        value={commentForm.password}
                        onChange={(e) => setCommentForm(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xs text-gray-900 bg-white placeholder-gray-500"
                        placeholder="비밀번호를 입력하세요"
                        maxLength={20}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        댓글
                      </label>
                      <textarea
                        value={commentForm.content}
                        onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xs text-gray-900 bg-white placeholder-gray-500"
                        placeholder="훈수를 남겨보세요!"
                        rows={4}
                        maxLength={1000}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {commentForm.content.length}/1000
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="sm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? '등록 중...' : '등록하기'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      size="sm"
                      onClick={() => setIsCommentFormOpen(false)}
                      disabled={isSubmitting}
                    >
                      취소
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* 댓글 목록 */}
            {comments.length === 0 ? (
              <Card variant="base" className="text-center py-8">
                <p className="text-xs text-gray-500">아직 댓글이 없습니다.</p>
                <p className="text-xs text-gray-400 mt-1">첫 번째 훈수를 남겨보세요!</p>
              </Card>
            ) : (
              <div className="bg-white rounded-xl overflow-hidden">
                {comments.map((comment, index) => (
                  <Card key={comment.id} variant="comment" className={index === comments.length - 1 ? 'border-b-0' : ''}>
                    {/* 상단: 닉네임, 날짜 */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        {/* 닉네임 */}
                        <span className="text-xs font-semibold text-gray-900">{comment.author}</span>
                      </div>
                      {/* 날짜 */}
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    {/* 본문 */}
                    <div>
                      <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap mb-3">
                        {comment.content}
                      </p>
                      
                      {/* 댓글 삭제 */}
                      {deletingCommentId === comment.id ? (
                        <div className="flex items-center space-x-1.5">
                          <input
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder="비밀번호"
                            className="px-2 py-0.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary text-gray-900 bg-white placeholder-gray-500 w-20"
                            maxLength={20}
                          />
                          <button 
                            className="px-2 py-0.5 bg-primary text-white rounded text-xs hover:bg-primary-hover transition-colors"
                            onClick={() => handleCommentDelete(comment.id)}
                          >
                            삭제
                          </button>
                          <button 
                            className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 transition-colors"
                            onClick={() => {
                              setDeletingCommentId(null)
                              setDeletePassword('')
                            }}
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setDeletingCommentId(comment.id)}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <Footer />
        
        {/* 이미지 갤러리 모달 */}
        {isImageGalleryOpen && (() => {
          const allImages = (product.images && product.images.length > 0) ? product.images : (product.thumbnail_url ? [product.thumbnail_url] : [])
          if (allImages.length === 0) return null
          
          return (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
              <div className="relative max-w-4xl max-h-full w-full h-full flex flex-col">
                {/* 헤더 */}
                <div className="flex items-center justify-between p-4 text-white">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold">{product.title}</h3>
                    <span className="text-sm text-gray-300">{currentImageIndex + 1} / {allImages.length}</span>
                  </div>
                  <button
                    onClick={() => setIsImageGalleryOpen(false)}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* 메인 이미지 */}
                <div 
                  className="flex-1 flex items-center justify-center p-4 relative"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={() => onTouchEnd(allImages)}
                >
                  <Image
                    {...getImageProps(allImages[currentImageIndex], {
                      src: allImages[currentImageIndex],
                      alt: `${product.title} - 이미지 ${currentImageIndex + 1}`,
                      width: 800,
                      height: 600,
                      className: "max-w-full max-h-full object-contain transition-all duration-300"
                    })}
                  />
                  
                  {/* 이전/다음 버튼 */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
                
                {/* 하단 썸네일 네비게이션 */}
                {allImages.length > 1 && (
                  <div className="p-4">
                    <div className="flex justify-center space-x-2 overflow-x-auto">
                      {allImages.map((imageUrl, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            currentImageIndex === index 
                              ? 'border-primary ring-2 ring-primary/30' 
                              : 'border-gray-600 hover:border-gray-400'
                          }`}
                        >
                          <Image
                            {...getImageProps(imageUrl, {
                              src: imageUrl,
                              alt: `제품 이미지 ${index + 1}`,
                              width: 64,
                              height: 64,
                              className: "w-full h-full object-contain"
                            })}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })()}
        
        {/* Scroll to top button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 bg-primary hover:bg-primary-hover text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-40"
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