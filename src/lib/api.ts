import { Category, Product, Comment, SiteBanner, ContentBlock } from './supabase'

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com' 
  : typeof window !== 'undefined' 
    ? window.location.origin 
    : 'http://localhost:3002'

// API Response types
interface ApiResponse<T> {
  success: boolean
  data: T
  total?: number
  message?: string
  error?: string
}

// Products API
export async function getProducts(params: {
  categoryId?: string
  search?: string
  limit?: number
  offset?: number
  sortBy?: 'created_at' | 'total_clicks' | 'view_count'
  order?: 'asc' | 'desc'
} = {}) {
  const searchParams = new URLSearchParams()
  
  if (params.categoryId) searchParams.set('category_id', params.categoryId)
  if (params.search) searchParams.set('search', params.search)
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.offset) searchParams.set('offset', params.offset.toString())
  if (params.sortBy) searchParams.set('sort_by', params.sortBy)
  if (params.order) searchParams.set('order', params.order)
  
  const url = `${API_BASE_URL}/api/products${searchParams.toString() ? `?${searchParams}` : ''}`
  
  const response = await fetch(url)
  const data: ApiResponse<Product[]> = await response.json()
  
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch products')
  }
  
  return data.data
}

// Categories API
export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/api/categories`)
  const data: ApiResponse<Category[]> = await response.json()
  
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch categories')
  }
  
  return data.data
}

// Comments API
export async function getComments(productId: string, params: {
  limit?: number
  offset?: number
} = {}) {
  const searchParams = new URLSearchParams()
  
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.offset) searchParams.set('offset', params.offset.toString())
  
  const url = `${API_BASE_URL}/api/comments/${productId}${searchParams.toString() ? `?${searchParams}` : ''}`
  
  const response = await fetch(url)
  const data: ApiResponse<Comment[]> = await response.json()
  
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch comments')
  }
  
  return data.data
}

// Create Comment API
export async function createComment(commentData: {
  product_id: string
  author: string
  content: string
  password: string
}) {
  const response = await fetch(`${API_BASE_URL}/api/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commentData),
  })
  
  const data: ApiResponse<Comment> = await response.json()
  
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to create comment')
  }
  
  return data.data
}

// Delete Comment API
export async function deleteComment(commentId: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/comments/delete/${commentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  })
  
  const data: ApiResponse<null> = await response.json()
  
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to delete comment')
  }
  
  return data.message
}

// Admin Product APIs
export async function createProduct(productData: {
  title: string
  description?: string
  category_id: string
  price?: number
  thumbnail_url?: string
  images?: string[]
  coupang_link?: string
  naver_link?: string
}) {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  })
  
  let data: ApiResponse<Product>
  try {
    data = await response.json()
  } catch (jsonError) {
    console.error('JSON parsing error:', jsonError)
    throw new Error(`서버 응답 파싱 오류 (HTTP ${response.status}): ${response.statusText}`)
  }
  
  console.log('Product creation response:', { status: response.status, data })
  
  if (!response.ok || !data.success) {
    throw new Error(data.error || `HTTP ${response.status}: Failed to create product`)
  }
  
  return data.data
}

export async function updateProduct(productId: string, productData: {
  title: string
  description?: string
  category_id: string
  price?: number
  thumbnail_url?: string
  images?: string[]
  coupang_link?: string
  naver_link?: string
}) {
  const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  })
  
  const data: ApiResponse<Product> = await response.json()
  
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to update product')
  }
  
  return data.data
}

export async function deleteProduct(productId: string) {
  const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
    method: 'DELETE',
  })
  
  const data: ApiResponse<null> = await response.json()
  
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to delete product')
  }
  
  return data.message
}

export async function getProduct(productId: string) {
  const response = await fetch(`${API_BASE_URL}/api/products/${productId}`)
  const data: ApiResponse<Product> = await response.json()
  
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch product')
  }
  
  return data.data
}

// Site Banner API
export async function getSiteBanner(): Promise<SiteBanner> {
  const response = await fetch(`${API_BASE_URL}/api/site-banner`)
  
  if (!response.ok) {
    throw new Error('사이트 배너 정보를 가져오는데 실패했습니다.')
  }
  
  const data: ApiResponse<SiteBanner> = await response.json()
  
  if (!data.success) {
    throw new Error(data.error || '사이트 배너 정보를 가져오는데 실패했습니다.')
  }
  
  return data.data
}

export async function updateSiteBanner(banner: {
  title: string
  subtitle: string
  background_image?: string | null
}): Promise<SiteBanner> {
  try {
    console.log('API 요청 데이터:', banner)
    
    const response = await fetch(`${API_BASE_URL}/api/site-banner`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(banner),
    })
    
    console.log('API 응답 상태:', response.status, response.statusText)
    
    const data: ApiResponse<SiteBanner> = await response.json()
    console.log('API 응답 데이터:', data)
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}: 사이트 배너 업데이트에 실패했습니다.`)
    }
    
    if (!data.success) {
      throw new Error(data.error || '사이트 배너 업데이트에 실패했습니다.')
    }
    
    return data.data
  } catch (error) {
    console.error('updateSiteBanner 오류:', error)
    throw error
  }
}

// Content Blocks API
export async function getContentBlocks(productId: string): Promise<ContentBlock[]> {
  const response = await fetch(`${API_BASE_URL}/api/content-blocks/${productId}`)
  const data: ApiResponse<ContentBlock[]> = await response.json()
  
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch content blocks')
  }
  
  return data.data
}

export async function updateContentBlocks(productId: string, blocks: Omit<ContentBlock, 'id' | 'product_id' | 'created_at' | 'updated_at'>[]): Promise<ContentBlock[]> {
  const response = await fetch(`${API_BASE_URL}/api/content-blocks/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ blocks }),
  })
  
  const data: ApiResponse<ContentBlock[]> = await response.json()
  
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to update content blocks')
  }
  
  return data.data
}