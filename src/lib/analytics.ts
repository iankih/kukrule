/**
 * 제품 클릭 추적 유틸리티
 */

// 세션 ID 생성 및 관리
function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = sessionStorage.getItem('kukrule-session-id')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem('kukrule-session-id', sessionId)
  }
  return sessionId
}

// 클릭 추적 타입
export type ClickType = 'view' | 'coupang' | 'naver'

// 클릭 추적 함수
export async function trackClick(productId: string, type: ClickType): Promise<void> {
  try {
    const sessionId = getSessionId()
    
    // 백그라운드에서 추적 (사용자 경험에 영향 주지 않음)
    fetch(`/api/products/${productId}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        sessionId
      })
    }).catch(error => {
      // 추적 실패해도 사용자 경험에 영향 주지 않음
      console.warn('클릭 추적 실패:', error)
    })
  } catch (error) {
    console.warn('클릭 추적 오류:', error)
  }
}

// 제품 조회 추적
export function trackProductView(productId: string): void {
  trackClick(productId, 'view')
}

// 쿠팡 링크 클릭 추적
export function trackCoupangClick(productId: string): void {
  trackClick(productId, 'coupang')
}

// 네이버 링크 클릭 추적
export function trackNaverClick(productId: string): void {
  trackClick(productId, 'naver')
}

// 중복 방지를 위한 디바운스 기능
const viewTrackingCache = new Set<string>()

export function trackProductViewOnce(productId: string): void {
  if (viewTrackingCache.has(productId)) {
    return
  }
  
  viewTrackingCache.add(productId)
  trackProductView(productId)
  
  // 5분 후 캐시에서 제거 (같은 세션에서 재방문 시 다시 추적)
  setTimeout(() => {
    viewTrackingCache.delete(productId)
  }, 5 * 60 * 1000)
}