import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function HomePage() {
  return (
    <div className="container py-12">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-primary-burgundy mb-6">
          2026년 제1회
          <br />
          안양대학교 평생교육원
          <br />
          음악콩쿠르
        </h1>
        
        <p className="text-xl text-text-secondary mb-8">
          음악을 사랑하는 모든 이에게 열린 무대
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/apply">
            <Button variant="primary" size="lg">
              콩쿠르 신청하기
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="secondary" size="lg">
              자세히 보기
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">
          <Card>
            <CardHeader>
              <CardTitle>참가 부문</CardTitle>
            </CardHeader>
            <CardContent>
              피아노 · 성악 · 관현악 · 동요
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>개최 일시</CardTitle>
            </CardHeader>
            <CardContent>
              2026년 1월 1일 (변경 예정)
              <br />
              안양대학교 문학관 4층
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>대회 요강</CardTitle>
            </CardHeader>
            <CardContent>
              접수 기간: 2026.12.01~12.31
              <br />
              참가비: 10만원
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
