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
    const { title, subtitle, background_image } = await request.json()

    // 기본 검증
    if (!title || !subtitle) {
      return NextResponse.json({
        success: false,
        error: '제목과 부제목은 필수입니다.'
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('site_banner')
      .update({
        title,
        subtitle,
        background_image,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data,
      message: '사이트 배너가 성공적으로 업데이트되었습니다.'
    })
  } catch (error) {
    console.error('사이트 배너 업데이트 오류:', error)
    return NextResponse.json({
      success: false,
      error: '사이트 배너 업데이트에 실패했습니다.'
    }, { status: 500 })
  }
}