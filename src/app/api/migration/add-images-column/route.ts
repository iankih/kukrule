import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdminAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // 관리자 인증 확인
    await requireAdminAuth()

    // products 테이블에 images 컬럼 추가
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS images JSON DEFAULT '[]'::json;
        
        COMMENT ON COLUMN products.images IS 'Array of additional product image URLs';
      `
    })

    if (error) {
      console.error('Database migration error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to add images column',
        details: error.message,
        sqlQuery: `
          ALTER TABLE products 
          ADD COLUMN IF NOT EXISTS images JSON DEFAULT '[]'::json;
          
          COMMENT ON COLUMN products.images IS 'Array of additional product image URLs';
        `
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Images column added successfully'
    })

  } catch (error) {
    console.error('Migration API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      sqlQuery: `
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS images JSON DEFAULT '[]'::json;
        
        COMMENT ON COLUMN products.images IS 'Array of additional product image URLs';
      `
    }, { status: 500 })
  }
}