import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { ContentBlock } from '@/lib/supabase'

// GET: 제품의 콘텐츠 블록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params

    // UUID 형식 검증
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(productId)) {
      return NextResponse.json({
        success: false,
        error: '올바르지 않은 제품 ID 형식입니다.'
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('product_id', productId)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({
        success: false,
        error: '콘텐츠 블록을 가져오는데 실패했습니다.'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data || []
    })

  } catch (error) {
    console.error('Content blocks fetch error:', error)
    return NextResponse.json({
      success: false,
      error: '서버 오류가 발생했습니다.'
    }, { status: 500 })
  }
}

// PUT: 제품의 콘텐츠 블록 업데이트
export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params
    const body = await request.json()
    const { blocks } = body

    // UUID 형식 검증
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(productId)) {
      return NextResponse.json({
        success: false,
        error: '올바르지 않은 제품 ID 형식입니다.'
      }, { status: 400 })
    }

    // 블록 데이터 검증
    if (!Array.isArray(blocks)) {
      return NextResponse.json({
        success: false,
        error: '블록 데이터는 배열이어야 합니다.'
      }, { status: 400 })
    }

    // 블록 타입 검증
    const validTypes = ['text', 'image', 'list', 'heading']
    for (const block of blocks) {
      if (!validTypes.includes(block.type)) {
        return NextResponse.json({
          success: false,
          error: `올바르지 않은 블록 타입: ${block.type}`
        }, { status: 400 })
      }
      
      // 이미지 블록 필수 필드 검증
      if (block.type === 'image') {
        if (!block.image_url || !block.image_alt) {
          return NextResponse.json({
            success: false,
            error: '이미지 블록에는 image_url과 image_alt가 필요합니다.'
          }, { status: 400 })
        }
      }
      
      // 텍스트/리스트/헤딩 블록 필수 필드 검증
      if (['text', 'list', 'heading'].includes(block.type)) {
        if (!block.content || block.content.trim() === '') {
          return NextResponse.json({
            success: false,
            error: `${block.type} 블록에는 content가 필요합니다.`
          }, { status: 400 })
        }
      }
    }

    // 트랜잭션으로 기존 블록 삭제 후 새 블록 삽입
    const { error: deleteError } = await supabase
      .from('content_blocks')
      .delete()
      .eq('product_id', productId)

    if (deleteError) {
      console.error('Delete blocks error:', deleteError)
      return NextResponse.json({
        success: false,
        error: '기존 블록을 삭제하는데 실패했습니다.'
      }, { status: 500 })
    }

    if (blocks.length > 0) {
      const blocksToInsert = blocks.map((block: any, index: number) => ({
        product_id: productId,
        type: block.type,
        content: block.content || null,
        image_url: block.image_url || null,
        image_alt: block.image_alt || null,
        order_index: index
      }))

      const { data, error: insertError } = await supabase
        .from('content_blocks')
        .insert(blocksToInsert)
        .select()

      if (insertError) {
        console.error('Insert blocks error:', insertError)
        return NextResponse.json({
          success: false,
          error: '새 블록을 생성하는데 실패했습니다.'
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        data: data
      })
    }

    return NextResponse.json({
      success: true,
      data: []
    })

  } catch (error) {
    console.error('Content blocks update error:', error)
    return NextResponse.json({
      success: false,
      error: '서버 오류가 발생했습니다.'
    }, { status: 500 })
  }
}