import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdminAuth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

// 관리자용 Supabase 클라이언트 (Service Role 사용)
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category_id')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sort_by') || 'created_at'
    const order = searchParams.get('order') || 'desc'

    let query = supabase
      .from('products')
      .select(`
        *,
        categories:category_id (
          id,
          name
        )
      `)
      .range(offset, offset + limit - 1)

    // 검색 기능
    if (search) {
      // title 또는 description에서 검색어 찾기 (대소문자 구분 없음)
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // 정렬 옵션 적용
    const validSortColumns = ['created_at', 'total_clicks', 'view_count', 'coupang_clicks', 'naver_clicks']
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at'
    const ascending = order === 'asc'
    
    query = query.order(sortColumn, { ascending })

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
    console.log('POST /api/products - Starting product creation')
    
    // 환경 변수 확인
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    
    console.log('POST /api/products - Environment check:', {
      hasServiceKey: !!serviceRoleKey,
      serviceKeyLength: serviceRoleKey?.length,
      hasUrl: !!supabaseUrl,
      urlDomain: supabaseUrl?.split('://')[1]?.split('.')[0]
    })
    
    if (!serviceRoleKey) {
      console.error('POST /api/products - SUPABASE_SERVICE_ROLE_KEY not found!')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    
    // 관리자 인증 확인
    await requireAdminAuth()
    console.log('POST /api/products - Admin auth passed')

    const body = await request.json()
    console.log('POST /api/products - Request body:', body)
    
    const { title, description, category_id, manufacturer, price, thumbnail_url, images, mention_links, coupang_link, naver_link } = body
    
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
      manufacturer,
      price: price ? parseFloat(price) : null,
      thumbnail_url,
      images: images || [],
      mention_links: mention_links || [],
      coupang_link,
      naver_link
    }
    
    console.log('POST /api/products - Product data to insert:', productData)

    // Service Role Key 테스트
    const testResult = await adminSupabase.from('products').select('count', { count: 'exact', head: true })
    console.log('POST /api/products - Service role test:', { 
      error: testResult.error,
      count: testResult.count 
    })

    const { data, error } = await adminSupabase
      .from('products')
      .insert([productData])
      .select(`
        *,
        categories:category_id (
          id,
          name
        )
      `)
      
    console.log('POST /api/products - Supabase response:', { data, error })

    if (error) {
      console.error('Error creating product:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return NextResponse.json(
        { 
          error: 'Failed to create product',
          details: error.message,
          code: error.code
        },
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