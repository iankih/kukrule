import { Category, Product, Comment } from './supabase'

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
  limit?: number
  offset?: number
} = {}) {
  const searchParams = new URLSearchParams()
  
  if (params.categoryId) searchParams.set('category_id', params.categoryId)
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.offset) searchParams.set('offset', params.offset.toString())
  
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
  
  const data: ApiResponse<Product> = await response.json()
  
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to create product')
  }
  
  return data.data
}

export async function updateProduct(productId: string, productData: {
  title: string
  description?: string
  category_id: string
  price?: number
  thumbnail_url?: string
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