import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { COMPETITION_INFO } from '@/utils/constants'

export default function AboutPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-primary-burgundy mb-8 text-center">
        콩쿠르 안내
      </h1>

      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>행사 개요</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex">
                <dt className="font-semibold w-24">일시</dt>
                <dd>{COMPETITION_INFO.dateTime}</dd>
              </div>
              <div className="flex">
                <dt className="font-semibold w-24">장소</dt>
                <dd>{COMPETITION_INFO.location}</dd>
              </div>
              <div className="flex">
                <dt className="font-semibold w-24">주최</dt>
                <dd>안양대학교 평생교육원</dd>
              </div>
              <div className="flex">
                <dt className="font-semibold w-24">운영</dt>
                <dd>안양시민오케스트라</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>참가 대상</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• <strong>부문:</strong> 피아노, 성악, 관현악, 동요</li>
              <li>• <strong>연령:</strong> 초등부, 중등부, 고등부, 성인부</li>
              <li>• <strong>전공 여부:</strong> 전공자 및 아마추어 모두 가능</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>진행 방식</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• <strong>연주 곡목:</strong> 자유곡 1곡 (약 10분 내외)</li>
              <li>• <strong>연주 방식:</strong> 모든 곡은 반복 없이 암보 연주 원칙</li>
              <li>• <strong>반주 기준:</strong></li>
              <ul className="ml-6 mt-2 space-y-1">
                <li>- 피아노: 무반주</li>
                <li>- 성악·관현악: 참가자 개인이 반주자 동반</li>
              </ul>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>시상 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• <strong>전체 대상:</strong> 총장 명의 상장 + 상금 30만원</li>
              <li className="ml-4 text-sm">※ 특전: 2026년 협연 기회 제공</li>
              <li>• <strong>부문별 1등:</strong> 교육원장 명의 상장 + 협연비 50% 면제</li>
              <li>• <strong>부문별 2·3등:</strong> 교육원장 명의 상장 + 협연비 30% 면제</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>유의사항</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• 일정은 변동될 수 있으며, 변경 시 사전 공지됩니다.</li>
              <li>• 모든 곡은 반복 없이 암보로 연주해야 합니다.</li>
              <li>• 연주 시간 초과 시 심사위원 판단에 따라 중단될 수 있습니다.</li>
              <li>• 성악·관현악 참가자는 개인 반주자를 동반해야 합니다.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
