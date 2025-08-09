import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/layout/Hero'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-12">
        <Hero
          title="국룰에 오신 것을 환영합니다"
          subtitle="여러 제품들의 국민 아이템을 한눈에 볼 수 있는 플랫폼입니다. 클린·신뢰·발견을 통해 최고의 제품을 찾아보세요."
          showCTA={true}
          ctaText="제품 둘러보기"
        />

        <div className="max-w-6xl mx-auto px-5 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="base">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">클린</h3>
                <p className="text-gray-600">깔끔하고 정돈된 인터페이스로 최고의 사용자 경험을 제공합니다.</p>
              </div>
            </Card>

            <Card variant="base">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">신뢰</h3>
                <p className="text-gray-600">일관된 디자인과 품질로 신뢰할 수 있는 서비스를 만들어갑니다.</p>
              </div>
            </Card>

            <Card variant="base">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">발견</h3>
                <p className="text-gray-600">직관적인 탐색으로 새로운 제품과 트렌드를 쉽게 발견하세요.</p>
              </div>
            </Card>
          </div>

          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">컴포넌트 확인하기</h2>
            <p className="text-lg text-gray-600 mb-8">구축된 모든 UI 컴포넌트를 확인해보세요</p>
            <a href="/components">
              <Button variant="primary" size="lg">
                컴포넌트 보기
              </Button>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}