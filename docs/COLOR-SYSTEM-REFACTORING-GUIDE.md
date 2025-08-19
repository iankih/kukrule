# 색상 시스템 리팩토링 가이드

> **목표**: 단일 소스에서 모든 색상을 관리하고, theme.ts 파일 하나만 수정하면 전체 프로젝트 색상이 변경되는 시스템 구축

## 1. 현재 상황 분석

### 문제점
- **중복된 색상 정의**: `theme.ts` + `tailwind.config.ts` + 하드코딩된 hex 값들
- **일관성 없는 사용**: `theme.colors.primary.main` vs `bg-primary-main` vs `bg-[#2D5F3F]`
- **유지보수 어려움**: 색상 변경 시 여러 파일을 수정해야 함

### 현재 구조
```
src/lib/theme.ts                 # 중앙 테마 객체
tailwind.config.ts              # Tailwind 커스텀 컬러
컴포넌트들                      # 하드코딩된 색상들 산재
```

## 2. 목표 구조

### 이상적인 구조
```
src/lib/theme.ts                 # 단일 진실 소스 (Single Source of Truth)
├─ colors 정의                  
├─ CSS 변수 생성
└─ Tailwind 연동

tailwind.config.ts              # theme.ts에서 자동 생성
globals.css                     # CSS 변수 정의
컴포넌트들                      # 표준화된 클래스명만 사용
```

### 목표 사용법
```tsx
// 이상적인 컴포넌트 사용법
<button className="bg-primary hover:bg-primary-hover focus:ring-primary">
  버튼
</button>
```

## 3. 리팩토링 단계별 계획

### Phase 1: CSS 변수 기반 시스템 구축
1. **globals.css에 CSS 변수 정의**
   ```css
   :root {
     --color-primary: #2D5F3F;
     --color-primary-hover: #36503F;
     --color-primary-active: #1A3323;
     /* ... */
   }
   ```

2. **theme.ts에서 CSS 변수 참조**
   ```typescript
   export const theme = {
     colors: {
       primary: {
         main: 'var(--color-primary)',
         hover: 'var(--color-primary-hover)',
         // ...
       }
     }
   }
   ```

### Phase 2: Tailwind 통합
1. **tailwind.config.ts를 theme.ts와 연동**
   ```typescript
   import { theme } from './src/lib/theme'
   
   export default {
     theme: {
       extend: {
         colors: theme.colors // 자동 연동
       }
     }
   }
   ```

2. **표준 클래스명 정의**
   - `bg-primary` → `#2D5F3F`
   - `bg-primary-hover` → `#36503F`
   - `text-primary` → `#2D5F3F`
   - `ring-primary` → `#2D5F3F`

### Phase 3: 컴포넌트 표준화
1. **하드코딩된 색상 제거**
   ```tsx
   // Before
   className="bg-[#2D5F3F] hover:bg-[#36503F]"
   
   // After  
   className="bg-primary hover:bg-primary-hover"
   ```

2. **컴포넌트별 색상 매핑 표준화**
   - Button: `bg-primary`, `hover:bg-primary-hover`
   - Badge: `bg-primary-active`, `text-white`
   - Focus rings: `focus:ring-primary`

### Phase 4: 검증 및 테스트
1. **색상 변경 테스트**
   - theme.ts에서 한 색상만 변경
   - 전체 프로젝트 반영 확인

2. **브라우저 호환성 검증**
   - CSS 변수 지원 확인
   - 다크모드 대응 (미래 확장성)

## 4. 구현 세부사항

### 4.1 CSS 변수 명명 규칙
```css
/* Primary Colors */
--color-primary: #2D5F3F;
--color-primary-hover: #36503F;
--color-primary-active: #1A3323;
--color-primary-light: #83A58F;
--color-primary-lighter: #73FAA4;

/* Semantic Colors */
--color-success: #10B981;
--color-warning: #FF9500;
--color-error: #EF4444;
--color-info: #5352ED;

/* Neutral Colors */
--color-gray-50: #F9FAFB;
--color-gray-100: #F3F4F6;
/* ... */
```

### 4.2 Tailwind 클래스 매핑
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          active: 'var(--color-primary-active)',
          light: 'var(--color-primary-light)',
          lighter: 'var(--color-primary-lighter)',
        }
      }
    }
  }
}
```

### 4.3 컴포넌트 표준 패턴
```tsx
// Button Component
const variants = {
  primary: 'bg-primary hover:bg-primary-hover active:bg-primary-active',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
  ghost: 'hover:bg-primary/10 text-primary'
}

// Focus rings
const focusRing = 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
```

## 5. 마이그레이션 체크리스트

### 준비 작업
- [ ] 현재 사용 중인 모든 색상 값 조사
- [ ] 하드코딩된 색상 위치 파악 (grep 검색)
- [ ] 컴포넌트별 색상 사용 패턴 분석

### Phase 1: 기반 구축
- [ ] `src/styles/globals.css`에 CSS 변수 정의
- [ ] `src/lib/theme.ts` CSS 변수 참조로 수정
- [ ] 기본 색상 변수 테스트

### Phase 2: Tailwind 통합  
- [ ] `tailwind.config.ts` theme.ts 연동
- [ ] 새로운 Tailwind 클래스 생성 확인
- [ ] 기존 커스텀 컬러와 충돌 해결

### Phase 3: 컴포넌트 마이그레이션
- [ ] UI 컴포넌트 우선 변경 (`src/components/ui/`)
- [ ] 레이아웃 컴포넌트 변경 (`src/components/layout/`)
- [ ] 페이지 컴포넌트 변경 (`src/app/`)
- [ ] 하드코딩된 색상 제거

### Phase 4: 검증
- [ ] 색상 변경 테스트 (theme.ts 한 곳만 수정)
- [ ] 전체 프로젝트 시각적 검증
- [ ] 브라우저 호환성 테스트
- [ ] 성능 영향 검증

## 6. 예상 효과

### 개발 효율성
- **색상 변경**: theme.ts 한 파일만 수정
- **일관성**: 전체 프로젝트 자동 반영
- **확장성**: 새로운 색상 팔레트 쉽게 추가

### 유지보수성
- **중복 제거**: 단일 진실 소스
- **표준화**: 일관된 네이밍과 사용법
- **문서화**: 명확한 색상 시스템 가이드

### 미래 확장성
- **다크모드**: CSS 변수로 쉬운 테마 전환
- **브랜드 변경**: 빠른 색상 팔레트 교체
- **A/B 테스트**: 실시간 색상 변경 가능

## 7. 주의사항

### CSS 변수 제한사항
- IE 11 이하에서 지원 안 됨 (현재 프로젝트는 모던 브라우저 타깃)
- CSS-in-JS와 혼용 시 복잡도 증가

### Tailwind JIT 모드
- 사용하지 않는 클래스는 자동 제거됨
- 동적 클래스명 생성 시 주의 필요

### 점진적 마이그레이션
- 한 번에 모든 컴포넌트를 변경하지 말고 단계적으로 진행
- 각 단계마다 테스트 후 다음 단계 진행
- 롤백 계획 준비

---

**작성일**: 2025-01-21  
**버전**: 1.0  
**담당자**: Claude Code Assistant