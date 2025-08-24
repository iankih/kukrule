import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth'

// 캐러셀 설정을 간단한 메모리 저장소를 사용 (실제 프로덕션에서는 데이터베이스 사용 권장)
// 클라이언트 측에서는 localStorage도 함께 사용하여 설정 유지
let carouselSettings = {
  enabled: false // 기본값: 비활성화 (명시적으로 활성화한 경우에만 표시)
}

// 서버 시작 시 기본값 설정 (프로덕션에서는 데이터베이스에서 로드)
if (typeof globalThis !== 'undefined' && !(globalThis as any).__carouselSettingsInitialized) {
  carouselSettings = { enabled: false }
  ;(globalThis as any).__carouselSettingsInitialized = true
}

/**
 * GET: 캐러셀 설정 조회
 */
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: carouselSettings
    })
  } catch (error) {
    console.error('캐러셀 설정 조회 API 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '캐러셀 설정 조회 실패' 
      },
      { status: 500 }
    )
  }
}

/**
 * PUT: 캐러셀 설정 업데이트
 */
export async function PUT(request: NextRequest) {
  try {
    // 관리자 인증 확인
    await requireAdminAuth()

    const body = await request.json()
    const { enabled } = body

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { success: false, error: '잘못된 데이터 형식입니다. enabled는 boolean 타입이어야 합니다.' },
        { status: 400 }
      )
    }

    // 캐러셀 설정 업데이트
    carouselSettings.enabled = enabled

    return NextResponse.json({
      success: true,
      data: carouselSettings
    })

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.error('캐러셀 설정 업데이트 API 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '캐러셀 설정 업데이트 실패' 
      },
      { status: 500 }
    )
  }
}