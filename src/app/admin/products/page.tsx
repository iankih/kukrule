import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/auth'
import dynamic from 'next/dynamic'

// 제품 관리자 동적 로드 (무거운 마크다운 에디터 포함)
const ProductsManager = dynamic(() => import('./components/ProductsManager'), {
  loading: () => <div className="flex justify-center items-center min-h-screen"><div className="text-lg">제품 관리자 로딩 중...</div></div>
})

export default async function AdminProductsPage() {
  // 관리자 인증 확인
  const isAuth = await isAdminAuthenticated()
  
  if (!isAuth) {
    redirect('/admin/login')
  }

  return <ProductsManager />
}