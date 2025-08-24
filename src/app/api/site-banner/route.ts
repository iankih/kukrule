import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 사이트 배너 정보 조회
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('site_banner')
      .select('*')
      .eq('is_active', true)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: data || {
        id: 1,
        title: '국룰에 오신 것을 환영합니다',
        subtitle: '한국인들이 선택한 진짜 국민 아이템을 한눈에!\n검증된 제품들로 쇼핑의 새로운 기준을 제시합니다.',
        background_image: null,
        is_active: true
      }
    })
  } catch (error) {
    console.error('사이트 배너 조회 오류:', error)
    return NextResponse.json({
      success: false,
      error: '사이트 배너 정보를 가져오는데 실패했습니다.'
    }, { status: 500 })
  }
}

// 사이트 배너 정보 업데이트 (관리자 전용)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('받은 요청 데이터:', body)
    
    const { title, subtitle, background_image } = body

    // 기본 검증
    if (!title || !subtitle) {
      console.error('유효성 검사 실패:', { title, subtitle })
      return NextResponse.json({
        success: false,
        error: '제목과 부제목은 필수입니다.'
      }, { status: 400 })
    }

    // 먼저 현재 데이터 확인
    const { data: currentData, error: fetchError } = await supabase
      .from('site_banner')
      .select('*')
      .eq('id', 1)
      .single()

    if (fetchError) {
      console.error('현재 데이터 조회 오류:', fetchError)
      return NextResponse.json({
        success: false,
        error: '현재 배너 정보를 조회하는데 실패했습니다.'
      }, { status: 500 })
    }

    console.log('현재 데이터:', currentData)

    const updateData = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      background_image,
      updated_at: new Date().toISOString()
    }

    console.log('업데이트할 데이터:', updateData)

    // 업데이트 실행
    const { error: updateError } = await supabase
      .from('site_banner')
      .update(updateData)
      .eq('id', 1)

    if (updateError) {
      console.error('Supabase 업데이트 오류:', updateError)
      throw updateError
    }

    console.log('업데이트 완료, 결과 데이터 조회 중...')

    // 업데이트된 데이터 조회
    const { data: updatedData, error: selectError } = await supabase
      .from('site_banner')
      .select('*')
      .eq('id', 1)
      .single()

    if (selectError) {
      console.error('업데이트된 데이터 조회 오류:', selectError)
      // 조회 실패해도 업데이트는 성공했으므로 현재 데이터 반환
      return NextResponse.json({
        success: true,
        data: { ...currentData, ...updateData },
        message: '사이트 배너가 성공적으로 업데이트되었습니다.'
      })
    }

    console.log('최종 결과:', updatedData)

    return NextResponse.json({
      success: true,
      data: updatedData,
      message: '사이트 배너가 성공적으로 업데이트되었습니다.'
    })
  } catch (error) {
    console.error('사이트 배너 업데이트 오류:', error)
    return NextResponse.json({
      success: false,
      error: `사이트 배너 업데이트에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
    }, { status: 500 })
  }
}