'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/layout/Hero'
import { Carousel } from '@/components/ui/Carousel'
import { Accordion } from '@/components/ui/Accordion'
import { Dropdown } from '@/components/ui/Dropdown'
import { Checkbox } from '@/components/ui/Checkbox'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/feedback/Spinner'
import { Toast } from '@/components/feedback/Toast'
import { useState } from 'react'

export default function ComponentsPage() {
  const [showToast, setShowToast] = useState(false)
  const [checkboxValue, setCheckboxValue] = useState(false)
  const [selectValue, setSelectValue] = useState('')

  const carouselItems = [
    { id: 1, title: '첫 번째 슬라이드', content: '이것은 첫 번째 슬라이드입니다.' },
    { id: 2, title: '두 번째 슬라이드', content: '이것은 두 번째 슬라이드입니다.' },
    { id: 3, title: '세 번째 슬라이드', content: '이것은 세 번째 슬라이드입니다.' }
  ]

  const accordionItems = [
    { id: 1, title: '아코디언 항목 1', content: '첫 번째 아코디언의 내용입니다.' },
    { id: 2, title: '아코디언 항목 2', content: '두 번째 아코디언의 내용입니다.' },
    { id: 3, title: '아코디언 항목 3', content: '세 번째 아코디언의 내용입니다.' }
  ]

  const dropdownItems = [
    { label: '옵션 1', value: 'option1' },
    { label: '옵션 2', value: 'option2' },
    { label: '옵션 3', value: 'option3' }
  ]

  const selectOptions = [
    { label: '선택 1', value: 'select1' },
    { label: '선택 2', value: 'select2' },
    { label: '선택 3', value: 'select3' }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-16">
        <Hero
          title="Kukrull 컴포넌트 라이브러리"
          subtitle="국룰 테마를 기반으로 구축된 재사용 가능한 UI 컴포넌트들"
        />

        <div className="max-w-6xl mx-auto px-5 py-10 space-y-16">
          {/* Buttons */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Buttons</h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="primary" disabled>Disabled Button</Button>
            </div>
          </section>

          {/* Cards */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card variant="base">
                <h3 className="text-lg font-semibold mb-2">기본 카드</h3>
                <p className="text-gray-600">기본 카드 컴포넌트입니다.</p>
              </Card>
              
              <Card variant="product">
                <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-400">제품 이미지</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">제품 카드</h3>
                <p className="text-gray-600 mb-4">호버 효과가 있는 제품 카드입니다.</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary-main">₩49,000</span>
                  <Badge variant="success">NEW</Badge>
                </div>
              </Card>

              <Card variant="elevated">
                <h3 className="text-lg font-semibold mb-2">Elevated 카드</h3>
                <p className="text-gray-600">강조된 그림자가 있는 카드입니다.</p>
              </Card>
            </div>
          </section>

          {/* Badges */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Badges</h2>
            <div className="flex flex-wrap gap-4">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
            </div>
          </section>

          {/* Carousel */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Carousel</h2>
            <Carousel items={carouselItems} />
          </section>

          {/* Accordion */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Accordion</h2>
            <Accordion items={accordionItems} />
          </section>

          {/* Form Components */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Form Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Checkbox</h3>
                <Checkbox
                  checked={checkboxValue}
                  onChange={setCheckboxValue}
                  label="체크박스 옵션"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Select</h3>
                <Select
                  value={selectValue}
                  onChange={setSelectValue}
                  options={selectOptions}
                  placeholder="옵션을 선택하세요"
                />
              </div>
            </div>
          </section>

          {/* Interactive Components */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Interactive Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Dropdown</h3>
                <Dropdown
                  trigger={<Button variant="secondary">드롭다운 열기</Button>}
                  items={dropdownItems}
                  onSelect={(value) => console.log('Selected:', value)}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Toast</h3>
                <Button 
                  variant="primary" 
                  onClick={() => setShowToast(true)}
                >
                  토스트 표시
                </Button>
                {showToast && (
                  <Toast
                    message="성공적으로 처리되었습니다!"
                    type="success"
                    onClose={() => setShowToast(false)}
                    duration={3000}
                  />
                )}
              </div>
            </div>
          </section>

          {/* Feedback Components */}
          <section>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Feedback Components</h2>
            <div>
              <h3 className="text-lg font-semibold mb-4">Spinner</h3>
              <div className="flex gap-4">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}