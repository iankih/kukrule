import { supabase } from './supabase'

/**
 * carousel_items 테이블 생성 및 초기 데이터 설정
 */
export async function setupCarouselTable() {
  try {
    // 1. 먼저 테이블이 있는지 확인
    const { data: tableCheck, error: tableCheckError } = await supabase
      .from('carousel_items')
      .select('count', { count: 'exact', head: true })

    if (tableCheckError) {
      // 테이블이 없는 경우 오류 발생
      console.log('carousel_items 테이블이 존재하지 않습니다.')
      
      // SQL 쿼리를 사용하여 테이블 생성 시도
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS carousel_items (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          subtitle TEXT,
          color TEXT DEFAULT 'teal',
          image TEXT,
          "order" INTEGER DEFAULT 1,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `

      const { error: createError } = await supabase.rpc('exec_sql', { 
        query: createTableQuery 
      })

      if (createError) {
        console.error('테이블 생성 실패:', createError)
        throw new Error('테이블 생성에 실패했습니다. 직접 SQL을 실행해주세요.')
      }
    }

    // 2. 기본 데이터 확인 및 삽입
    const { data: existingData } = await supabase
      .from('carousel_items')
      .select('*')

    if (!existingData || existingData.length === 0) {
      const defaultItems = [
        {
          id: 1,
          title: '오직, 국룰에서만 만나볼 수 있어요\n특별한 국민 아이템',
          subtitle: '브랜드데이 특가',
          color: 'teal',
          image: null,
          order: 1,
          is_active: true
        },
        {
          id: 2,
          title: '트렌드를 앞서가는\n뷰티 아이템 모음',
          subtitle: '신상품 출시',
          color: 'purple',
          image: null,
          order: 2,
          is_active: true
        },
        {
          id: 3,
          title: '검증된 품질의\n베스트 셀러 상품',
          subtitle: '인기 상품 모음',
          color: 'orange',
          image: null,
          order: 3,
          is_active: true
        }
      ]

      const { error: insertError } = await supabase
        .from('carousel_items')
        .insert(defaultItems)

      if (insertError) {
        console.error('기본 데이터 삽입 실패:', insertError)
        throw insertError
      }
    }

    return { success: true, message: '캐러셀 테이블이 성공적으로 설정되었습니다.' }

  } catch (error) {
    console.error('데이터베이스 설정 오류:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '데이터베이스 설정 실패',
      sqlQuery: `
-- 이 SQL을 Supabase Dashboard의 SQL Editor에서 실행하세요:

CREATE TABLE carousel_items (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  color TEXT DEFAULT 'teal',
  image TEXT,
  "order" INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기본 데이터 삽입
INSERT INTO carousel_items (id, title, subtitle, color, image, "order", is_active) VALUES
(1, '오직, 국룰에서만 만나볼 수 있어요\n특별한 국민 아이템', '브랜드데이 특가', 'teal', null, 1, true),
(2, '트렌드를 앞서가는\n뷰티 아이템 모음', '신상품 출시', 'purple', null, 2, true),
(3, '검증된 품질의\n베스트 셀러 상품', '인기 상품 모음', 'orange', null, 3, true);

-- RLS (Row Level Security) 활성화 (선택사항)
ALTER TABLE carousel_items ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽을 수 있도록 정책 생성
CREATE POLICY "Enable read access for all users" ON "public"."carousel_items"
AS PERMISSIVE FOR SELECT
TO public
USING (true);
      `
    }
  }
}