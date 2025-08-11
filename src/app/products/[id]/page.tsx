'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/feedback/Spinner'
import { Footer } from '@/components/layout/Footer'
import { getProducts, getComments, createComment, deleteComment } from '@/lib/api'
import { Product, Comment } from '@/lib/supabase'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  // 이미지 갤러리 상태
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false)
  
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
        
        // 댓글도 함께 가져오기
        const commentsData = await getComments(productId)
        setComments(commentsData)
        
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
      
      alert('댓글이 성공적으로 등록되었습니다!')
      
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
      router.push(`/home?search=${encodeURIComponent(searchQuery.trim())}`)
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
                  className="w-full px-4 py-2.5 bg-gray-50 border-0 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
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
            <span className="text-sm font-medium text-teal-500">제품 상세</span>
          </div>
        </div>

        {/* 제품 정보 */}
        <div className="p-4">
          <div className="bg-white p-4 mb-6">
            {/* 제품 이미지 갤러리 */}
            <div className="mb-4">
              {/* 메인 이미지 */}
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-3 relative group cursor-pointer" onClick={() => setIsImageGalleryOpen(true)}>
                {(() => {
                  const allImages = (product.images && product.images.length > 0) ? product.images : (product.thumbnail_url ? [product.thumbnail_url] : [])
                  const currentImage = allImages[currentImageIndex]
                  
                  if (!currentImage) {
                    return <span className="text-gray-400">제품 이미지</span>
                  }
                  
                  return (
                    <>
                      <Image 
                        src={currentImage} 
                        alt={`${product.title} - 이미지 ${currentImageIndex + 1}`}
                        width={600}
                        height={256}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
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
            
            {/* 제조사 정보 */}
            <div className="mb-3">
              <Badge variant="secondary" className="text-xs">
                {product.manufacturer || product.categories?.name || '제조사 미등록'}
              </Badge>
            </div>
            
            {/* 제품명 */}
            <h2 className="text-lg font-bold text-gray-900 mb-3">{product.title}</h2>
            
            {/* 판매가 */}
            <div className="text-xl font-bold text-teal-600 mb-3">
              ₩{product.price?.toLocaleString()}
            </div>
            
            {/* 링크 */}
            <div className="flex space-x-2 mb-4">
              {product.coupang_link && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => window.open(product.coupang_link!, '_blank')}
                >
                  쿠팡에서 보기
                </Button>
              )}
              {product.naver_link && (
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => window.open(product.naver_link!, '_blank')}
                >
                  네이버에서 보기
                </Button>
              )}
            </div>
            
            {/* 설명 */}
            <div className="border-t border-gray-100 pt-3">
              <h3 className="text-xs font-semibold text-gray-700 mb-2">제품 설명</h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* 댓글 섹션 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                훈수 두기 ({comments.length})
              </h3>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setIsCommentFormOpen(true)}
              >
                훈수 남기기
              </Button>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs text-gray-900 bg-white placeholder-gray-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs text-gray-900 bg-white placeholder-gray-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs text-gray-900 bg-white placeholder-gray-500"
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
                    {/* 상단: 프로필 아이콘, 닉네임, 날짜 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {/* 프로필 기본 아이콘 */}
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
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
                    
                    {/* 본문: 닉네임 영역 아래에 표시 */}
                    <div className="ml-13">
                      <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap mb-3">
                        {comment.content}
                      </p>
                      
                      {/* 댓글 삭제 */}
                      {deletingCommentId === comment.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder="비밀번호 입력"
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 text-gray-900 bg-white placeholder-gray-500"
                            maxLength={20}
                          />
                          <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => handleCommentDelete(comment.id)}
                          >
                            삭제
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => {
                              setDeletingCommentId(null)
                              setDeletePassword('')
                            }}
                          >
                            취소
                          </Button>
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
                <div className="flex-1 flex items-center justify-center p-4 relative">
                  <Image
                    src={allImages[currentImageIndex]}
                    alt={`${product.title} - 이미지 ${currentImageIndex + 1}`}
                    width={800}
                    height={600}
                    className="max-w-full max-h-full object-contain"
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
                              ? 'border-teal-400 ring-2 ring-teal-300' 
                              : 'border-gray-600 hover:border-gray-400'
                          }`}
                        >
                          <Image
                            src={imageUrl}
                            alt={`제품 이미지 ${index + 1}`}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
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
            className="fixed bottom-6 right-6 w-12 h-12 bg-teal-500 hover:bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-40"
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