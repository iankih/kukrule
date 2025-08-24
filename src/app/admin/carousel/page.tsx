import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/auth'
import dynamic from 'next/dynamic'

// 캐러셀 관리자 동적 로드
const CarouselManager = dynamic(() => import('./components/CarouselManager'), {
  loading: () => <div className="flex justify-center items-center min-h-screen"><div className="text-lg">캐러셀 관리자 로딩 중...</div></div>
})

export default async function AdminCarouselPage() {
  // 관리자 인증 확인
  const isAuth = await isAdminAuthenticated()
  
  if (!isAuth) {
    redirect('/admin/login')
  }

  return <CarouselManager />
}