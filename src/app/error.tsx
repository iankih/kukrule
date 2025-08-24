'use client'

import { Button } from '@/components/ui/Button'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('애플리케이션 오류:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[600px] min-w-[320px] bg-white min-h-screen shadow-xl flex items-center justify-center">
        <div className="text-center p-8">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">문제가 발생했습니다</h2>
          <p className="text-gray-600 mb-6">
            페이지를 불러오는 중 오류가 발생했습니다.
          </p>
          <div className="space-y-3">
            <Button onClick={reset} variant="primary" size="lg">
              다시 시도
            </Button>
            <Button 
              onClick={() => window.location.href = '/'} 
              variant="ghost" 
              size="md"
            >
              홈으로 이동
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}