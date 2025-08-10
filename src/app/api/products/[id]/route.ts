import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdminAuth } from '@/lib/auth'

// 개별 제품 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (
          id,
          name
        )
      `)
      .eq('id', id)
      .single()

    if (error || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 제품 수정 (관리자 전용)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 인증 확인
    await requireAdminAuth()

    const { id } = await params
    const body = await request.json()
    const { title, description, category_id, price, thumbnail_url, images, coupang_link, naver_link } = body
    
    // 필수 필드 검증
    if (!title || !category_id) {
      return NextResponse.json(
        { error: '제품명과 카테고리는 필수입니다.' },
        { status: 400 }
      )
    }

    const updateData = {
      title,
      description,
      category_id,
      price: price ? parseFloat(price) : null,
      thumbnail_url,
      images: images || [],
      coupang_link,
      naver_link,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        categories:category_id (
          id,
          name
        )
      `)

    if (error) {
      console.error('Error updating product:', error)
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data[0]
    })

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 제품 삭제 (관리자 전용)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 인증 확인
    await requireAdminAuth()

    const { id } = await params

    // 제품에 연결된 댓글들도 함께 삭제
    const { error: commentsError } = await supabase
      .from('comments')
      .delete()
      .eq('product_id', id)

    if (commentsError) {
      console.error('Error deleting product comments:', commentsError)
      // 댓글 삭제 실패해도 제품 삭제는 진행
    }

    // 제품 삭제
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}