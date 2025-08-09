import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/auth'
import CarouselManager from './components/CarouselManager'

export default async function AdminCarouselPage() {
  // 관리자 인증 확인
  const isAuth = await isAdminAuthenticated()
  
  if (!isAuth) {
    redirect('/admin/login')
  }

  return <CarouselManager />
}