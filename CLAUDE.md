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

#### 테마 설정

* `src/lib/theme.ts`에 중앙집중식 테마 객체
* 기본 브랜드 색상: `#19D7D2`(민트)
* 의미 기반 컬러 팔레트 전반
* Pretendard Variable 폰트를 사용한 타이포그래피
* 일관된 간격·모서리·그림자 스케일

#### Tailwind 연동

* `tailwind.config.ts`에 커스텀 컬러 클래스 정의
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