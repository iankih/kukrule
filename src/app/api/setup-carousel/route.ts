import { NextRequest, NextResponse } from 'next/server'
import { setupCarouselTable } from '@/lib/database-setup'
import { requireAdminAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // 관리자 인증 확인
    await requireAdminAuth()

    // 데이터베이스 설정 실행
    const result = await setupCarouselTable()
    
    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }

  } catch (error) {
    console.error('Carousel setup error:', error)
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Setup failed'
    }, { status: 500 })
  }
}