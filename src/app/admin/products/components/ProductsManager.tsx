'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/feedback/Spinner'
import { getProducts, getCategories, deleteProduct, createProduct, updateProduct } from '@/lib/api'
import { Product, Category, MentionLink } from '@/lib/supabase'
import { getImageProps } from '@/lib/image-utils'

// 마크다운 에디터 동적 로드 (클라이언트 사이드만)
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
)

interface ProductFormData {
  title: string
  description: string
  category_id: string
  manufacturer: string
  price: string
  images: string[]
  mention_links: MentionLink[]
  coupang_link: string
  naver_link: string
}

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    category_id: '',
    manufacturer: '',
    price: '',
    images: [],
    mention_links: [],
    coupang_link: '',
    naver_link: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [productsData, categoriesData] = await Promise.all([
        getProducts({ limit: 100 }),
        getCategories()
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Data loading error:', error)
      alert('데이터를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.category_id) {
      alert('제품명과 카테고리는 필수입니다.')
      return
    }

    try {
      setIsSubmitting(true)

      const productData = {
        title: formData.title,
        description: formData.description || undefined,
        category_id: formData.category_id,
        manufacturer: formData.manufacturer || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        thumbnail_url: formData.images.length > 0 ? formData.images[0] : undefined,
        images: formData.images,
        mention_links: formData.mention_links.length > 0 ? formData.mention_links : undefined,
        coupang_link: formData.coupang_link || undefined,
        naver_link: formData.naver_link || undefined
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
        alert('제품이 수정되었습니다.')
      } else {
        await createProduct(productData)
        alert('제품이 추가되었습니다.')
      }

      // 폼 초기화 및 데이터 새로고침
      resetForm()
      await loadData()

    } catch (error) {
      console.error('Submit error:', error)
      let errorMessage = '처리 중 오류가 발생했습니다.'
      
      if (error instanceof Error) {
        errorMessage = error.message
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          formData
        })
      }
      
      alert(`오류 발생: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    // 기존 데이터에서 이미지 배열 구성 (thumbnail_url이 첫 번째가 아니라면 추가)
    const existingImages = product.images || []
    const allImages = product.thumbnail_url 
      ? (existingImages.includes(product.thumbnail_url) ? existingImages : [product.thumbnail_url, ...existingImages])
      : existingImages
    
    setFormData({
      title: product.title,
      description: product.description || '',
      category_id: product.category_id,
      manufacturer: product.manufacturer || '',
      price: product.price?.toString() || '',
      images: allImages,
      mention_links: product.mention_links || [],
      coupang_link: product.coupang_link || '',
      naver_link: product.naver_link || ''
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (productId: string) => {
    if (deleteConfirm !== productId) {
      setDeleteConfirm(productId)
      return
    }

    try {
      await deleteProduct(productId)
      alert('제품이 삭제되었습니다.')
      await loadData()
    } catch (error) {
      console.error('Delete error:', error)
      alert(error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.')
    } finally {
      setDeleteConfirm(null)
    }
  }

  const handleProductImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      setUploadingImage(true)
      const uploadPromises = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)

        uploadPromises.push(
          fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData
          }).then(response => response.json())
        )
      }

      const results = await Promise.all(uploadPromises)
      const uploadedUrls: string[] = []

      for (const result of results) {
        if (result.success) {
          uploadedUrls.push(result.data.url)
        } else {
          console.error('Upload failed:', result.error)
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls]
        }))
        alert(`${uploadedUrls.length}개의 제품 이미지가 업로드되었습니다.`)
      } else {
        alert('이미지 업로드에 실패했습니다.')
      }

    } catch (error) {
      console.error('Product image upload error:', error)
      alert('이미지 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploadingImage(false)
      // 파일 입력 초기화
      if (e.target) {
        e.target.value = ''
      }
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category_id: '',
      manufacturer: '',
      price: '',
      images: [],
      mention_links: [],
      coupang_link: '',
      naver_link: ''
    })
    setEditingProduct(null)
    setIsFormOpen(false)
  }

  // 언급 링크 관리 함수들
  const addMentionLink = () => {
    if (formData.mention_links.length >= 5) {
      alert('최대 5개까지 링크를 추가할 수 있습니다.')
      return
    }
    setFormData(prev => ({
      ...prev,
      mention_links: [...prev.mention_links, { title: '', url: '' }]
    }))
  }

  const updateMentionLink = (index: number, field: 'title' | 'url', value: string) => {
    setFormData(prev => ({
      ...prev,
      mention_links: prev.mention_links.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }))
  }

  const removeMentionLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      mention_links: prev.mention_links.filter((_, i) => i !== index)
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-gray-600 mt-4">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">제품 관리</h1>
              <p className="text-sm text-gray-500">제품 추가, 편집, 삭제</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="primary"
                onClick={() => setIsFormOpen(true)}
              >
                새 제품 추가
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/admin')}
              >
                대시보드로 돌아가기
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 제품 추가/편집 폼 */}
        {isFormOpen && (
          <Card variant="base" className="mb-8">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingProduct ? '제품 편집' : '새 제품 추가'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      제품명 *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white placeholder-gray-500"
                      placeholder="제품명을 입력하세요"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      카테고리 *
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white placeholder-gray-500"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">카테고리 선택</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      제조사
                    </label>
                    <input
                      type="text"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white placeholder-gray-500"
                      placeholder="제조사명을 입력하세요"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      가격
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white placeholder-gray-500"
                      placeholder="가격을 입력하세요"
                      min="0"
                      step="100"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      제품 이미지
                    </label>
                    <div className="space-y-4">
                      {/* 제품 이미지 업로드 */}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleProductImagesUpload}
                          disabled={isSubmitting || uploadingImage}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-[#E8F0EB]"
                        />
                        <p className="text-xs text-gray-500 mt-1">여러 이미지를 한번에 선택할 수 있습니다. 첫 번째 이미지가 썸네일로 사용됩니다.</p>
                        {uploadingImage && (
                          <div className="text-sm text-gray-500 mt-2">업로드 중...</div>
                        )}
                      </div>

                      {/* 업로드된 제품 이미지들 미리보기 */}
                      {formData.images.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            제품 이미지 ({formData.images.length}개) {formData.images.length > 0 && <span className="text-xs text-[#2D5F3F]">• 첫 번째 이미지가 썸네일입니다</span>}
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {formData.images.map((imageUrl, index) => (
                              <div key={index} className="relative group">
                                <div className={`relative ${index === 0 ? 'ring-2 ring-primary-400' : ''}`}>
                                  <Image
                                    {...getImageProps(imageUrl, {
                                      src: imageUrl,
                                      alt: `제품 이미지 ${index + 1}`,
                                      width: 96,
                                      height: 96,
                                      className: "w-24 h-24 object-cover rounded-lg border border-gray-200"
                                    })}
                                  />
                                  {index === 0 && (
                                    <div className="absolute -top-1 -left-1 bg-primary-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                                      썸네일
                                    </div>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  disabled={isSubmitting}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="이미지 삭제"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      쿠팡 링크
                    </label>
                    <input
                      type="url"
                      value={formData.coupang_link}
                      onChange={(e) => setFormData(prev => ({ ...prev, coupang_link: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white placeholder-gray-500"
                      placeholder="쿠팡 제품 링크"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      네이버 링크
                    </label>
                    <input
                      type="url"
                      value={formData.naver_link}
                      onChange={(e) => setFormData(prev => ({ ...prev, naver_link: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white placeholder-gray-500"
                      placeholder="네이버 제품 링크"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* 언급 링크 섹션 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      이 제품이 언급된 링크 (최대 5개)
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={addMentionLink}
                      disabled={isSubmitting || formData.mention_links.length >= 5}
                    >
                      + 링크 추가
                    </Button>
                  </div>
                  
                  {formData.mention_links.length === 0 ? (
                    <div className="text-sm text-gray-500 py-4 text-center border border-dashed border-gray-300 rounded-lg">
                      제품이 소개된 블로그, 리뷰 사이트 등의 링크를 추가해보세요
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.mention_links.map((link, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-3 border border-gray-200 rounded-lg">
                          <div className="md:col-span-2">
                            <input
                              type="text"
                              value={link.title}
                              onChange={(e) => updateMentionLink(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm text-gray-900 bg-white placeholder-gray-500"
                              placeholder="사이트 설명 (예: 네이버 블로그)"
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) => updateMentionLink(index, 'url', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm text-gray-900 bg-white placeholder-gray-500"
                              placeholder="https://..."
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeMentionLink(index)}
                              disabled={isSubmitting}
                              className="px-2 py-1 text-red-600 hover:text-red-800 text-sm"
                              title="링크 삭제"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    제품 설명
                  </label>
                  
                  {/* 설명 가이드 */}
                  <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm text-green-800">
                      <h4 className="font-semibold mb-2">📝 마크다운으로 이미지 삽입 방법</h4>
                      <div className="space-y-2 text-xs">
                        <p><strong>이미지 삽입:</strong> <code>![이미지 설명](이미지URL)</code></p>
                        <p><strong>이미지 업로드:</strong> 위의 "제품 이미지"에서 업로드 후 URL 복사해서 사용</p>
                        <p><strong>텍스트 서식:</strong> <code>**굵게**</code>, <code>*기울임*</code>, <code>### 제목</code></p>
                        <p><strong>리스트:</strong> <code>- 항목1</code>, <code>1. 번호 리스트</code></p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <MDEditor
                      value={formData.description}
                      onChange={(value) => setFormData(prev => ({ ...prev, description: value || '' }))}
                      preview="edit"
                      hideToolbar={false}
                      data-color-mode="light"
                      height={200}
                      style={{
                        backgroundColor: 'white',
                      }}
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '저장 중...' : (editingProduct ? '수정하기' : '추가하기')}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={resetForm}
                    disabled={isSubmitting}
                  >
                    취소
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}

        {/* 제품 목록 */}
        <Card variant="base">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              제품 목록 ({products.length}개)
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      제품
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      카테고리
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      가격
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      등록일
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {product.thumbnail_url ? (
                              <Image
                                {...getImageProps(product.thumbnail_url, {
                                  className: "h-12 w-12 rounded-lg object-cover",
                                  src: product.thumbnail_url,
                                  alt: product.title,
                                  width: 48,
                                  height: 48
                                })}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.description?.slice(0, 50)}
                              {product.description && product.description.length > 50 ? '...' : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary">
                          {product.categories?.name || '미분류'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₩{product.price?.toLocaleString() || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(product.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            편집
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            className={deleteConfirm === product.id ? 'bg-red-600 text-white' : ''}
                          >
                            {deleteConfirm === product.id ? '확인' : '삭제'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {products.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">등록된 제품이 없습니다.</p>
                  <Button
                    variant="primary"
                    className="mt-4"
                    onClick={() => setIsFormOpen(true)}
                  >
                    첫 번째 제품 추가하기
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}