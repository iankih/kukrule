import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdminAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // 관리자 인증 확인
    await requireAdminAuth()

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: '파일이 선택되지 않았습니다.' },
        { status: 400 }
      )
    }

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '이미지 파일만 업로드 가능합니다.' },
        { status: 400 }
      )
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: '파일 크기는 5MB 이하여야 합니다.' },
        { status: 400 }
      )
    }

    // 파일명 생성 (중복 방지)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Supabase Storage에 업로드
    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Storage upload error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: `파일 업로드에 실패했습니다: ${error.message}` },
        { status: 500 }
      )
    }

    // 공개 URL 생성
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        fileName: fileName
      }
    })

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.error('Upload API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}