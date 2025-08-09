import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/auth'
import CommentsManager from './components/CommentsManager'

export default async function AdminCommentsPage() {
  // 관리자 인증 확인
  const isAuth = await isAdminAuthenticated()
  
  if (!isAuth) {
    redirect('/admin/login')
  }

  return <CommentsManager />
}