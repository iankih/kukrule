import { supabase, CarouselItem } from './supabase'

/**
 * 캐러셀 아이템 목록 조회 (활성 상태만)
 */
export async function getCarouselItems(): Promise<CarouselItem[]> {
  const { data, error } = await supabase
    .from('carousel_items')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })

  if (error) {
    console.error('캐러셀 데이터 조회 오류:', error)
    throw new Error('캐러셀 데이터를 불러올 수 없습니다.')
  }

  return data || []
}

/**
 * 모든 캐러셀 아이템 조회 (관리자용)
 */
export async function getAllCarouselItems(): Promise<CarouselItem[]> {
  const { data, error } = await supabase
    .from('carousel_items')
    .select('*')
    .order('order', { ascending: true })

  if (error) {
    console.error('캐러셀 데이터 조회 오류:', error)
    throw new Error('캐러셀 데이터를 불러올 수 없습니다.')
  }

  return data || []
}

/**
 * 캐러셀 아이템 업데이트
 */
export async function updateCarouselItem(
  id: number, 
  updates: Partial<Omit<CarouselItem, 'id' | 'created_at' | 'updated_at'>>
): Promise<CarouselItem> {
  const { data, error } = await supabase
    .from('carousel_items')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('캐러셀 업데이트 오류:', error)
    throw new Error('캐러셀 업데이트에 실패했습니다.')
  }

  return data
}

/**
 * 여러 캐러셀 아이템 일괄 업데이트
 */
export async function updateCarouselItems(items: CarouselItem[]): Promise<CarouselItem[]> {
  const updates = items.map(item => ({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    color: item.color,
    image: item.image,
    link_url: item.link_url,
    order: item.order,
    is_active: item.is_active,
    updated_at: new Date().toISOString()
  }))

  const { data, error } = await supabase
    .from('carousel_items')
    .upsert(updates)
    .select()

  if (error) {
    console.error('캐러셀 일괄 업데이트 오류:', error)
    throw new Error('캐러셀 업데이트에 실패했습니다.')
  }

  return data || []
}