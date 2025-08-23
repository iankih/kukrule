'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/feedback/Spinner'
import { getSiteBanner, updateSiteBanner } from '@/lib/api'
import { SiteBanner } from '@/lib/supabase'
import { getImageProps } from '@/lib/image-utils'

export default function BannerManagementPage() {
  const router = useRouter()
  const [banner, setBanner] = useState<SiteBanner | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    background_image: ''
  })

  useEffect(() => {
    loadBanner()
  }, [])

  const loadBanner = async () => {
    try {
      setIsLoading(true)
      const bannerData = await getSiteBanner()
      setBanner(bannerData)
      setFormData({
        title: bannerData.title,
        subtitle: bannerData.subtitle,
        background_image: bannerData.background_image || ''
      })
    } catch (error) {
      console.error('배너 로드 오류:', error)
      alert('배너 정보를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      const result = await response.json()

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          background_image: result.data.url
        }))
        alert('이미지가 업로드되었습니다.')
      } else {
        alert('이미지 업로드에 실패했습니다.')
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error)
      alert('이미지 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploadingImage(false)
      if (e.target) {
        e.target.value = ''
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.subtitle.trim()) {
      alert('제목과 부제목은 필수입니다.')
      return
    }

    try {
      setIsSubmitting(true)
      
      await updateSiteBanner({
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        background_image: formData.background_image || null
      })

      alert('사이트 배너가 성공적으로 업데이트되었습니다.')
      await loadBanner()
      
    } catch (error) {
      console.error('배너 업데이트 오류:', error)
      alert(error instanceof Error ? error.message : '배너 업데이트에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      background_image: ''
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-gray-600 mt-4">배너 정보를 불러오는 중...</p>
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
              <h1 className="text-xl font-semibold text-gray-900">사이트 배너 관리</h1>
              <p className="text-sm text-gray-500">메인 페이지 배너 이미지 및 텍스트 설정</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => router.push('/admin')}
            >
              대시보드로 돌아가기
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 현재 배너 미리보기 */}
        <Card variant="base" className="mb-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">현재 배너 미리보기</h3>
            <div className="relative overflow-hidden rounded-2xl">
              {formData.background_image ? (
                <div className="relative">
                  <Image
                    {...getImageProps(formData.background_image, {
                      src: formData.background_image,
                      alt: "배너 배경",
                      width: 800,
                      height: 200,
                      className: "w-full h-48 object-cover"
                    })}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  <div className="absolute inset-0 p-8 flex items-center">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-3 leading-tight text-white">
                        {formData.title}
                      </h2>
                      <p className="text-base text-white/80 leading-relaxed whitespace-pre-line">
                        {formData.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-primary to-primary-hover p-8">
                  <div>
                    <h2 className="text-xl font-bold mb-3 leading-tight text-white">
                      {formData.title}
                    </h2>
                    <p className="text-base text-white/80 leading-relaxed whitespace-pre-line">
                      {formData.subtitle}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* 배너 편집 폼 */}
        <Card variant="base">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">배너 편집</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배너 제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white placeholder-gray-500"
                  placeholder="배너 제목을 입력하세요"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* 부제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배너 부제목 *
                </label>
                <textarea
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white placeholder-gray-500"
                  placeholder="배너 부제목을 입력하세요 (줄바꿈 가능)"
                  rows={3}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* 배경 이미지 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배경 이미지 (선택사항)
                </label>
                
                <div className="space-y-4">
                  {/* 이미지 업로드 */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isSubmitting || uploadingImage}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      이미지를 업로드하지 않으면 기본 그라데이션 배경이 사용됩니다.
                    </p>
                    {uploadingImage && (
                      <div className="text-sm text-gray-500 mt-2">업로드 중...</div>
                    )}
                  </div>

                  {/* 현재 이미지 표시 */}
                  {formData.background_image && (
                    <div className="relative inline-block">
                      <Image
                        {...getImageProps(formData.background_image, {
                          src: formData.background_image,
                          alt: "배경 이미지",
                          width: 200,
                          height: 100,
                          className: "w-48 h-24 object-cover rounded-lg border border-gray-200"
                        })}
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        disabled={isSubmitting}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        title="이미지 제거"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 저장 버튼 */}
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '저장 중...' : '배너 업데이트'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/admin')}
                  disabled={isSubmitting}
                >
                  취소
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}