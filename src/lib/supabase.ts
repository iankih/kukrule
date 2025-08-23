import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database type definitions
export interface Category {
  id: string
  name: string
  created_at: string
}

// 제품 언급 링크 타입
export interface MentionLink {
  title: string  // 사이트/블로그 설명 (예: "네이버 블로그")
  url: string    // 실제 URL (예: "https://blog.naver.com/...")
}

export interface Product {
  id: string
  title: string
  description: string | null
  category_id: string
  manufacturer: string | null
  price: number | null
  thumbnail_url: string | null
  images: string[] | null // 추가 이미지들 (JSON 배열)
  mention_links: MentionLink[] | null // 제품 언급 링크들 (최대 5개)
  coupang_link: string | null
  naver_link: string | null
  created_at: string
  updated_at: string
  categories?: Category
  // Analytics 필드
  view_count?: number
  coupang_clicks?: number
  naver_clicks?: number
  total_clicks?: number
}

export interface Comment {
  id: string
  product_id: string
  author: string
  content: string
  password_hash: string
  created_at: string
}

export interface SiteBanner {
  id: number
  title: string
  subtitle: string
  background_image: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// 콘텐츠 블록 시스템
export interface ContentBlock {
  id: string
  product_id: string
  type: 'text' | 'image' | 'list' | 'heading'
  content: string | null
  image_url: string | null
  image_alt: string | null
  order_index: number
  created_at: string
  updated_at: string
}