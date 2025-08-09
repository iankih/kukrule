import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, author, content, password } = body

    // 입력값 검증
    if (!product_id || !author || !content || !password) {
      return NextResponse.json(
        { error: 'Required fields missing: product_id, author, content, password' },
        { status: 400 }
      )
    }

    // 기본 스팸 방지 검증
    if (content.length < 5) {
      return NextResponse.json(
        { error: 'Comment too short. Minimum 5 characters required.' },
        { status: 400 }
      )
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Comment too long. Maximum 1000 characters allowed.' },
        { status: 400 }
      )
    }

    if (author.length < 2 || author.length > 50) {
      return NextResponse.json(
        { error: 'Author name must be between 2 and 50 characters.' },
        { status: 400 }
      )
    }

    // 비밀번호 해시
    const password_hash = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          product_id,
          author: author.trim(),
          content: content.trim(),
          password_hash
        }
      ])
      .select('id, author, content, created_at')

    if (error) {
      console.error('Error creating comment:', error)
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: 'Comment created successfully'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}