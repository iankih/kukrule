import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdminAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category_id')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('products')
      .select(`
        *,
        categories:category_id (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // 카테고리 필터링
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data: products, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: products,
      total: products?.length || 0
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 관리자용 제품 생성 API
export async function POST(request: NextRequest) {
  try {
    // 관리자 인증 확인
    await requireAdminAuth()

    const body = await request.json()
    const { title, description, category_id, price, thumbnail_url, coupang_link, naver_link } = body
    
    // 필수 필드 검증
    if (!title || !category_id) {
      return NextResponse.json(
        { error: '제품명과 카테고리는 필수입니다.' },
        { status: 400 }
      )
    }

    const productData = {
      title,
      description,
      category_id,
      price: price ? parseFloat(price) : null,
      thumbnail_url,
      coupang_link,
      naver_link
    }

    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select(`
        *,
        categories:category_id (
          id,
          name
        )
      `)

    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
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