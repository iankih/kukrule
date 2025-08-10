import { supabase } from './supabase'

export interface CarouselItem {
  id: number
  title: string
  subtitle: string
  color: string
  image: string | null
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * 캐러셀 아이템 목록 조회
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
    order: item.order,
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