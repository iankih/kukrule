import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { supabase } from '@/lib/supabase'

interface TrackClickRequest {
  type: 'view' | 'coupang' | 'naver'
  sessionId?: string
}

/**
 * POST: 제품 클릭 추적
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    const body: TrackClickRequest = await request.json()
    const { type, sessionId } = body

    if (!['view', 'coupang', 'naver'].includes(type)) {
      return NextResponse.json(
        { success: false, error: '잘못된 클릭 타입입니다.' },
        { status: 400 }
      )
    }

    // 클라이언트 정보 추출
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || ''
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const userIp = forwardedFor?.split(',')[0] || realIp || '127.0.0.1'

    // 클릭 로그 삽입
    const { error: logError } = await supabase
      .from('product_click_logs')
      .insert({
        product_id: productId,
        click_type: type,
        user_ip: userIp,
        user_agent: userAgent,
        session_id: sessionId || null
      })

    if (logError) {
      console.error('클릭 로그 삽입 실패:', logError)
    }

    // 제품 카운터 업데이트
    const updateColumn = type === 'view' ? 'view_count' : 
                        type === 'coupang' ? 'coupang_clicks' : 'naver_clicks'
    
    const { error: updateError } = await supabase.rpc('increment_product_counter', {
      product_id: productId,
      counter_type: updateColumn
    })

    if (updateError) {
      console.error('RPC 함수 실행 실패:', updateError)
      // RPC 함수가 없으면 현재 값을 가져와서 업데이트
      const { data: currentProduct } = await supabase
        .from('products')
        .select(`${updateColumn}, total_clicks`)
        .eq('id', productId)
        .single()
      
      if (currentProduct) {
        const currentValue = currentProduct[updateColumn as keyof typeof currentProduct] as number || 0
        const newValue = currentValue + 1
        const newTotalClicks = (currentProduct.total_clicks || 0) + 1
        
        const { error: directUpdateError } = await supabase
          .from('products')
          .update({
            [updateColumn]: newValue,
            total_clicks: newTotalClicks
          })
          .eq('id', productId)

        if (directUpdateError) {
          console.error('제품 카운터 업데이트 실패:', directUpdateError)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `${type} 클릭이 기록되었습니다.`
    })

  } catch (error) {
    console.error('클릭 추적 API 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '클릭 추적 실패' 
      },
      { status: 500 }
    )
  }
}