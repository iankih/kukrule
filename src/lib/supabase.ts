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

export interface Product {
  id: string
  title: string
  description: string | null
  category_id: string
  manufacturer: string | null
  price: number | null
  thumbnail_url: string | null
  images: string[] | null // 추가 이미지들 (JSON 배열)
  coupang_link: string | null
  naver_link: string | null
  created_at: string
  updated_at: string
  categories?: Category
}

export interface Comment {
  id: string
  product_id: string
  author: string
  content: string
  password_hash: string
  created_at: string
}