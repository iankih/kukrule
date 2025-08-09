'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/feedback/Spinner'
import { getProducts, getComments, createComment, deleteComment } from '@/lib/api'
import { Product, Comment } from '@/lib/supabase'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCommentsLoading, setIsCommentsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
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

  // 댓글 작성
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!commentForm.author.trim() || !commentForm.content.trim() || !commentForm.password.trim()) {
      alert('모든 필드를 입력해주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      
      const newComment = await createComment({
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
        {/* 헤더 */}
        <div className="bg-white sticky top-0 z-50 border-b border-gray-200">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => router.back()}
                className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-900 truncate mx-4">제품 상세</h1>
              <div className="w-8 h-8"></div>
            </div>
          </div>
        </div>

        {/* 제품 정보 */}
        <div className="p-4">
          <Card variant="base" className="mb-6">
            {/* 제품 사진 */}
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-4">
              {product.thumbnail_url ? (
                <img 
                  src={product.thumbnail_url} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">제품 이미지</span>
              )}
            </div>
            
            {/* 제조사 아이콘 / 이름 */}
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-xs font-bold">브</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {product.categories?.name} 브랜드
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
          </Card>

          {/* 댓글 섹션 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">
                국룰 훈수 ({comments.length})
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        닉네임
                      </label>
                      <input
                        type="text"
                        value={commentForm.author}
                        onChange={(e) => setCommentForm(prev => ({ ...prev, author: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white placeholder-gray-500"
                        placeholder="닉네임을 입력하세요"
                        maxLength={50}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        비밀번호 (수정/삭제용)
                      </label>
                      <input
                        type="password"
                        value={commentForm.password}
                        onChange={(e) => setCommentForm(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white placeholder-gray-500"
                        placeholder="비밀번호를 입력하세요"
                        maxLength={20}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        댓글
                      </label>
                      <textarea
                        value={commentForm.content}
                        onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white placeholder-gray-500"
                        placeholder="국룰 훈수를 남겨보세요!"
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
                <p className="text-gray-500">아직 댓글이 없습니다.</p>
                <p className="text-sm text-gray-400 mt-1">첫 번째 국룰 훈수를 남겨보세요!</p>
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
                        <span className="font-semibold text-gray-900">{comment.author}</span>
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
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-3">
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
      </div>
    </div>
  )
}