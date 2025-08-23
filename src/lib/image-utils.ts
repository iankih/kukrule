/**
 * 이미지 관련 유틸리티 함수들
 */

/**
 * 파일 확장자를 기반으로 GIF 파일인지 확인
 * @param src 이미지 URL 또는 경로
 * @returns GIF 파일이면 true, 아니면 false
 */
export function isGifImage(src: string): boolean {
  if (!src) return false
  
  // URL에서 파일 확장자 추출
  const url = new URL(src, window.location.origin)
  const pathname = url.pathname.toLowerCase()
  
  return pathname.endsWith('.gif')
}

/**
 * GIF 파일인지 확인하여 Next.js Image 컴포넌트 props를 반환
 * @param src 이미지 URL 또는 경로
 * @param baseProps 기본 Image props
 * @param options 추가 옵션 (priority 여부 등)
 * @returns GIF이면 unoptimized가 추가된 props, 아니면 기본 props
 */
export function getImageProps<T extends Record<string, any>>(
  src: string,
  baseProps: T,
  options?: { priority?: boolean }
): T & { unoptimized?: boolean; priority?: boolean } {
  // 브라우저 환경이 아니면 기본 props 반환
  if (typeof window === 'undefined') {
    return baseProps
  }
  
  const result = { ...baseProps }
  
  if (isGifImage(src)) {
    result.unoptimized = true
  }
  
  if (options?.priority) {
    result.priority = true
  }
  
  return result
}