import { cookies } from 'next/headers'

/**
 * 관리자 세션 확인
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('admin-session')
    
    return !!session?.value
  } catch (error) {
    console.error('Admin auth check error:', error)
    return false
  }
}

/**
 * 관리자 인증 확인 미들웨어
 */
export async function requireAdminAuth() {
  const isAuth = await isAdminAuthenticated()
  
  if (!isAuth) {
    throw new Error('Unauthorized')
  }
  
  return true
}