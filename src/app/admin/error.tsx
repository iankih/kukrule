'use client'

import { Button } from '@/components/ui/Button'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center max-w-md">
        <h2 className="text-xl font-bold text-red-600 mb-4">관리자 페이지 오류</h2>
        <p className="text-gray-600 mb-6">
          관리자 페이지에서 문제가 발생했습니다.
        </p>
        <div className="space-y-3">
          <Button onClick={reset} variant="primary">
            다시 시도
          </Button>
          <Button 
            onClick={() => window.location.href = '/admin'} 
            variant="ghost"
          >
            관리자 홈으로
          </Button>
        </div>
      </div>
    </div>
  )
}