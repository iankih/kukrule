**모든 답변은 한국어로 한다**

# CLAUDE.md

이 파일은 레포지토리에서 코드를 작업할 때 Claude Code(claude.ai/code)에 제공되는 가이드입니다.

## 프로젝트 개요

**Kukrule**은 Next.js 15와 React 19, TypeScript, Tailwind CSS로 구축된 한국형 제품 추천 플랫폼입니다. “모바일-온-데스크톱” 레이아웃 방식을 적용한 모바일 퍼스트 디자인이 특징입니다.

## 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# ESLint 실행
npm run lint

# 타입 검사를 수행하되 파일은 생성하지 않음
npm run type-check
```

### 색상 시스템 개발 시 주의사항

1. **색상 변경 시**: `src/app/globals.css`만 수정하면 전체 프로젝트 색상이 변경됩니다
2. **새 컴포넌트 작성 시**: 하드코딩된 색상(`bg-[#hex]`) 대신 표준 클래스(`bg-primary`) 사용
3. **색상 테스트**: 개발 서버 실행 중 CSS 변수 값을 변경하면 실시간으로 색상이 바뀝니다

## 아키텍처

### App Router 구조

* Next.js 15 App Router(`src/app/`) 사용
* 최상위 레이아웃: `src/app/layout.tsx` (Inter 폰트 및 기본 메타데이터 포함)
* 메인 랜딩 페이지: `src/app/page.tsx`
* 제품 홈 페이지: `src/app/home/page.tsx` (모바일 퍼스트)

### 컴포넌트 아키텍처

```
src/components/
├── ui/           # 재사용 가능한 UI 프리미티브
├── layout/       # 레이아웃 전용 컴포넌트
└── feedback/     # 사용자 피드백 컴포넌트
```

#### UI 컴포넌트

* **Button**: 기본, 세컨더리, 고스트 3가지 변형과 사이즈 옵션
* **Card**: 기본, 제품, 입체 3가지 변형
* **Badge**, **Checkbox**, **Select**, **Dropdown**: 표준 폼 컴포넌트
* **Accordion**, **Carousel**: 인터랙티브 콘텐츠 컴포넌트

#### 레이아웃 컴포넌트

* **Navbar**: 모바일 메뉴가 포함된 반응형 네비게이션
* **Hero**: 랜딩 페이지 히어로 섹션 및 CTA
* **Footer**: 사이트 푸터

#### 피드백 컴포넌트

* **Spinner**: 로딩 인디케이터
* **Toast**: 알림 시스템

### 디자인 시스템

#### 색상 시스템 (2025.08.19 리팩토링 완료)

프로젝트는 **CSS 변수 기반 색상 시스템**을 사용하여 단일 소스에서 모든 색상을 관리합니다.

**현재 브랜드 색상**: Forest Green Palette (#2D5F3F)

##### 색상 변경 방법

```css
/* src/app/globals.css에서 색상 변경 */
:root {
  --color-primary: 45 95 63;        /* #2D5F3F (Forest Green) */
  --color-primary-hover: 54 80 63;  /* #36503F (Hover 상태) */
  --color-primary-active: 26 51 35; /* #1A3323 (Active 상태) */
  --color-primary-light: 131 165 143; /* #83A58F (밝은 변형) */
  --color-primary-lighter: 115 250 164; /* #73FAA4 (가장 밝은 변형) */
}
```

> **중요**: 색상 값은 RGB 값을 공백으로 구분하여 입력합니다 (예: `45 95 63`은 `rgb(45 95 63)`로 사용됨)

##### 컴포넌트에서 사용법

```tsx
// ✅ 올바른 방법 - 표준 Tailwind 클래스 사용
<button className="bg-primary hover:bg-primary-hover text-white">
  버튼
</button>

// ❌ 잘못된 방법 - 하드코딩된 색상 금지
<button className="bg-[#2D5F3F] hover:bg-[#36503F] text-white">
  버튼
</button>
```

##### 사용 가능한 색상 클래스

**Primary Colors**:
- `bg-primary` / `text-primary` - 기본 브랜드 색상
- `bg-primary-hover` / `text-primary-hover` - Hover 상태
- `bg-primary-active` / `text-primary-active` - Active 상태
- `bg-primary-light` / `text-primary-light` - 밝은 변형
- `bg-primary-lighter` / `text-primary-lighter` - 가장 밝은 변형

**Semantic Colors**:
- `bg-success` / `text-success` - 성공 색상
- `bg-warning` / `text-warning` - 경고 색상  
- `bg-error` / `text-error` - 오류 색상
- `bg-info` / `text-info` - 정보 색상

**Text Colors**:
- `text-text-primary` - 주요 텍스트
- `text-text-secondary` - 보조 텍스트
- `text-text-muted` - 비활성 텍스트

**Gray Scale**:
- `bg-gray-50` ~ `bg-gray-900` - 그레이 스케일

##### 색상 시스템 구조

```
src/app/globals.css          # CSS 변수 정의 (단일 진실 소스)
├─ :root { --color-* }       # 모든 색상 변수
│
src/lib/theme.ts            # CSS 변수 참조
├─ colors: { primary: 'rgb(var(--color-primary))' }
│
tailwind.config.ts          # Tailwind 클래스 생성
├─ colors: { primary: 'rgb(var(--color-primary))' }
│
컴포넌트들                   # 표준 클래스 사용
├─ className="bg-primary hover:bg-primary-hover"
```

#### 테마 설정

* `src/lib/theme.ts`에 중앙집중식 테마 객체 (CSS 변수 참조)
* Pretendard Variable 폰트를 사용한 타이포그래피
* 일관된 간격·모서리·그림자 스케일

#### Tailwind 연동

* `tailwind.config.ts`에서 CSS 변수 기반 커스텀 클래스 자동 생성
* `src/lib/utils.ts`의 `cn()` 유틸리티로 `clsx`·`tailwind-merge` 활용
* 모바일 퍼스트 반응형 디자인

### 모바일 퍼스트 설계 철학

* 컨테이너 폭: `max-w-[600px] min-w-[320px]`
* 단일 컬럼 레이아웃으로 모바일 최적화
* 검색 헤더 고정(sticky) 처리로 지속적 접근성 확보
* 320 px\~600 px 뷰포트 폭에서 반응형 스케일

## 핵심 기술 패턴

### TypeScript 설정

* 엄격한 TypeScript(`ignoreBuildErrors: false`)
* 모든 컴포넌트에 적절한 인터페이스 사용
* forwardRef 패턴으로 DOM 접근 필요 UI 프리미티브 구현

### 스타일링 접근법

* 전반에 Tailwind CSS 사용
* 커스텀 테마 값을 Tailwind 설정에 매핑
* 오브젝트 기반 스타일 매핑으로 컴포넌트 변형 관리
* 조건부 클래스에 `cn()` 유틸리티 일관 적용

### 컴포넌트 패턴

* 클라이언트 컴포넌트는 `'use client'` 선언
* DOM 접근이 필요한 UI 프리미티브에 forwardRef 적용
* Props 인터페이스는 HTML 요소 속성 확장
* 변형(variant)·사이즈(size) prop 패턴 일관 유지

## 개발 노트

### 반응형 브레이크포인트

* **모바일**: 320 px – 600 px(주 대상)
* **데스크톱**: 모바일 레이아웃을 중앙 배치하고 그림자 적용
* 태블릿 전용 브레이크포인트는 사용하지 않음

### 상태 관리

* 로컬 컴포넌트 상태는 React 훅 사용
* 현재 전역 상태 관리 도구는 미사용

### 오류 경계 및 로딩 상태

* 기본적인 오류 처리 로직 포함
* 동적 콘텐츠에 로딩 상태 구현 필요
* 프로덕션 환경에서 Error Boundary 도입 고려

### 국제화

* 현재 모든 텍스트가 한국어로 하드코딩
* 언어 전환 UI는 존재하나 기능 미구현
* 프로덕션 배포 전 i18n 적용 검토 필요

## Supabase 백엔드 및 데이터베이스

### 데이터베이스 구조

현재 프로젝트는 Supabase PostgreSQL을 사용하며 다음과 같은 테이블 구조를 가지고 있습니다:

```sql
-- 카테고리 테이블
categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
)

-- 제품 테이블
products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id),
  price integer,
  thumbnail_url text,
  coupang_link text,
  naver_link text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

-- 댓글 테이블
comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id),
  author text NOT NULL,
  content text NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
)

-- 캐러셀 관리 테이블
carousel_items (
  id serial PRIMARY KEY,
  title text NOT NULL,
  subtitle text,
  color text DEFAULT 'teal',
  image text,
  "order" integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

### API 구조

프로젝트는 Next.js API Routes를 사용하여 RESTful API를 구현합니다:

```
/api/
├── products/
│   ├── GET     # 제품 목록 조회
│   ├── POST    # 제품 생성 (관리자)
│   └── [id]/
│       ├── GET    # 개별 제품 조회
│       ├── PUT    # 제품 수정 (관리자)
│       └── DELETE # 제품 삭제 (관리자)
├── comments/
│   ├── [productId]/
│   │   └── GET # 특정 제품 댓글 조회
│   ├── POST    # 댓글 생성
│   └── [id]/
│       └── DELETE # 댓글 삭제
├── carousel/
│   ├── GET     # 캐러셀 데이터 조회
│   └── PUT     # 캐러셀 데이터 업데이트 (관리자)
├── upload/
│   └── POST    # 이미지 업로드 (관리자)
├── admin/
│   ├── auth/
│   │   └── POST # 관리자 인증
│   └── comments/
│       └── DELETE # 관리자 댓글 삭제
└── setup-carousel/
    └── POST    # 캐러셀 테이블 초기 설정
```

## MCP (Model Context Protocol) 연동

### Supabase MCP 기능

프로젝트는 **Supabase MCP**를 활용하여 데이터베이스 작업을 효율적으로 수행합니다.

#### 주요 기능

* **직접 SQL 실행**: `mcp__supabase__execute_sql` 도구를 통한 데이터 조회 및 조작
* **스키마 마이그레이션**: `mcp__supabase__apply_migration` 도구를 통한 데이터베이스 스키마 변경
* **테이블 관리**: `mcp__supabase__list_tables` 도구를 통한 테이블 구조 확인

#### 실제 적용 사례

**캐러셀 관리 시스템 구현**:
```sql
-- MCP를 통해 실행된 carousel_items 테이블 생성
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
(1, '오직, 국룰에서만 만나볼 수 있어요\\n특별한 국민 아이템', '브랜드데이 특가', 'teal', null, 1, true),
(2, '트렌드를 앞서가는\\n뷰티 아이템 모음', '신상품 출시', 'purple', null, 2, true),
(3, '검증된 품질의\\n베스트 셀러 상품', '인기 상품 모음', 'orange', null, 3, true);
```

#### MCP 활용의 장점

1. **개발 효율성**: API 구현 없이 직접 데이터베이스 작업 수행
2. **빠른 프로토타이핑**: 스키마 변경과 데이터 조작을 즉시 실행
3. **안전한 마이그레이션**: 구조화된 SQL 명령으로 데이터베이스 업데이트
4. **실시간 디버깅**: 직접 데이터 확인 및 수정 가능

### MCP 사용 모범 사례

1. **테이블 생성**: 항상 `apply_migration`으로 스키마 변경 기록
2. **데이터 조회**: `execute_sql`로 복잡한 쿼리 실행
3. **백업 전략**: 중요한 변경 전 데이터 백업 확인
4. **에러 처리**: MCP 실행 실패 시 대체 방안 준비