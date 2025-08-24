import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/auth'
import dynamic from 'next/dynamic'

// 관리자 대시보드 동적 로드 (관리자만 접근하므로 필요할 때만 로드)
const AdminDashboard = dynamic(() => import('./components/AdminDashboard'), {
  loading: () => <div className="flex justify-center items-center min-h-screen"><div className="text-lg">관리자 페이지 로딩 중...</div></div>
})

export default async function AdminPage() {
  // 관리자 인증 확인
  const isAuth = await isAdminAuthenticated()
  
  if (!isAuth) {
    redirect('/admin/login')
  }

  return <AdminDashboard />
}