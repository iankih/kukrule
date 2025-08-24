import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth'
import { getCarouselItems, getAllCarouselItems, updateCarouselItems } from '@/lib/carousel'

/**
 * GET: 캐러셀 아이템 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin') === 'true'
    
    // 관리자 모드인 경우 인증 확인하고 모든 아이템 반환
    if (admin) {
      await requireAdminAuth()
      const items = await getAllCarouselItems()
      return NextResponse.json({
        success: true,
        data: items
      })
    }
    
    // 일반 사용자는 활성 상태인 아이템만
    const items = await getCarouselItems()
    return NextResponse.json({
      success: true,
      data: items
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.error('캐러셀 조회 API 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '캐러셀 데이터 조회 실패' 
      },
      { status: 500 }
    )
  }
}

/**
 * PUT: 캐러셀 아이템 업데이트
 */
export async function PUT(request: NextRequest) {
  try {
    // 관리자 인증 확인
    await requireAdminAuth()

    const body = await request.json()
    const { items } = body

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: '잘못된 데이터 형식입니다.' },
        { status: 400 }
      )
    }

    // 캐러셀 아이템 업데이트
    const updatedItems = await updateCarouselItems(items)

    return NextResponse.json({
      success: true,
      data: updatedItems
    })

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.error('캐러셀 업데이트 API 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '캐러셀 업데이트 실패' 
      },
      { status: 500 }
    )
  }
}