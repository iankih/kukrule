'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/feedback/Spinner'

interface CommentWithProduct {
  id: string
  author: string
  content: string
  created_at: string
  products: {
    id: string
    title: string
  } | null
}

export default function CommentsManager() {
  const [comments, setComments] = useState<CommentWithProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/admin/comments?limit=100')
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || '댓글을 불러오는데 실패했습니다.')
      }

      setComments(data.data)

    } catch (error) {
      console.error('Comments loading error:', error)
      alert(error instanceof Error ? error.message : '댓글을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (deleteConfirm !== commentId) {
      setDeleteConfirm(commentId)
      return
    }

    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || '댓글 삭제에 실패했습니다.')
      }

      alert('댓글이 삭제되었습니다.')
      await loadComments()

    } catch (error) {
      console.error('Delete error:', error)
      alert(error instanceof Error ? error.message : '댓글 삭제에 실패했습니다.')
    } finally {
      setDeleteConfirm(null)
    }
  }

  // 검색 필터링
  const filteredComments = comments.filter(comment =>
    comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (comment.products?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-gray-600 mt-4">댓글을 불러오는 중...</p>
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
              <h1 className="text-xl font-semibold text-gray-900">댓글 관리</h1>
              <p className="text-sm text-gray-500">부적절한 댓글 삭제 및 관리</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/admin')}
              >
                대시보드로 돌아가기
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 검색 및 통계 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                전체 댓글 ({filteredComments.length}개)
              </h3>
            </div>
            <div className="w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 bg-white placeholder-gray-500"
                placeholder="작성자, 내용, 제품명으로 검색"
              />
            </div>
          </div>
        </div>

        {/* 댓글 목록 */}
        <Card variant="base">
          <div className="p-6">
            <div className="space-y-4">
              {filteredComments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {searchTerm ? '검색 결과가 없습니다.' : '댓글이 없습니다.'}
                  </p>
                </div>
              ) : (
                filteredComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {/* 댓글 헤더 */}
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">{comment.author}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              {new Date(comment.created_at).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          {comment.products && (
                            <Badge variant="secondary">
                              {comment.products.title}
                            </Badge>
                          )}
                        </div>

                        {/* 댓글 내용 */}
                        <div className="ml-11">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      </div>

                      {/* 삭제 버튼 */}
                      <div className="flex-shrink-0 ml-4">
                        <Button
                          variant={deleteConfirm === comment.id ? "primary" : "secondary"}
                          size="sm"
                          onClick={() => handleDelete(comment.id)}
                          className={deleteConfirm === comment.id ? 'bg-red-600 text-white hover:bg-red-700' : ''}
                        >
                          {deleteConfirm === comment.id ? '확인' : '삭제'}
                        </Button>
                      </div>
                    </div>

                    {/* 제품 링크 */}
                    {comment.products && (
                      <div className="ml-11 mt-2">
                        <button
                          onClick={() => router.push(`/products/${comment.products!.id}`)}
                          className="text-sm text-teal-600 hover:text-teal-800 underline"
                        >
                          제품 보기 →
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}