import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/auth'
import ProductsManager from './components/ProductsManager'

export default async function AdminProductsPage() {
  // 관리자 인증 확인
  const isAuth = await isAdminAuthenticated()
  
  if (!isAuth) {
    redirect('/admin/login')
  }

  return <ProductsManager />
}