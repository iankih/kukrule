import { Spinner } from '@/components/feedback/Spinner'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[600px] min-w-[320px] bg-white min-h-screen shadow-xl flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" />
          <p className="text-gray-600">페이지를 불러오고 있습니다...</p>
        </div>
      </div>
    </div>
  )
}