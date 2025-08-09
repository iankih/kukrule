import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: '아이디와 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 환경변수에서 관리자 계정 정보 가져오기
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminUsername || !adminPassword) {
      return NextResponse.json(
        { error: '관리자 계정이 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    // 로그인 정보 확인
    if (username !== adminUsername || password !== adminPassword) {
      return NextResponse.json(
        { error: '아이디 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    // 세션 토큰 생성 (간단한 JWT 대신 해시 사용)
    const sessionToken = await bcrypt.hash(`${username}_${Date.now()}`, 10)
    
    // 쿠키에 세션 토큰 저장 (7일)
    const cookieStore = await cookies()
    cookieStore.set('admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7일
    })

    return NextResponse.json({
      success: true,
      message: '로그인되었습니다.'
    })

  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 로그아웃 - 쿠키 삭제
    const cookieStore = await cookies()
    cookieStore.delete('admin-session')

    return NextResponse.json({
      success: true,
      message: '로그아웃되었습니다.'
    })

  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}