import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function GuidePage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-primary-burgundy mb-8 text-center">
        참가 안내
      </h1>

      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>신청 절차</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary-burgundy text-white flex items-center justify-center font-bold mx-auto mb-2">
                  1
                </div>
                <p className="text-sm">회원가입</p>
              </div>
              <div className="flex-1 h-0.5 bg-gray-300 mx-4" />
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary-burgundy text-white flex items-center justify-center font-bold mx-auto mb-2">
                  2
                </div>
                <p className="text-sm">신청서 작성</p>
              </div>
              <div className="flex-1 h-0.5 bg-gray-300 mx-4" />
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary-burgundy text-white flex items-center justify-center font-bold mx-auto mb-2">
                  3
                </div>
                <p className="text-sm">입금</p>
              </div>
              <div className="flex-1 h-0.5 bg-gray-300 mx-4" />
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary-burgundy text-white flex items-center justify-center font-bold mx-auto mb-2">
                  4
                </div>
                <p className="text-sm">확인 완료</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. 회원가입</h4>
                <p className="text-sm text-text-secondary">
                  홈페이지 상단의 '회원가입' 버튼을 클릭하여 이메일과 비밀번호로 가입합니다.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">2. 신청서 작성</h4>
                <p className="text-sm text-text-secondary">
                  로그인 후 '신청하기' 메뉴에서 부문, 연령대, 개인정보를 입력합니다.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">3. 입금</h4>
                <p className="text-sm text-text-secondary">
                  참가비 10만원을 지정 계좌(1234-5678-91011)로 입금합니다.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">4. 확인 완료</h4>
                <p className="text-sm text-text-secondary">
                  관리자가 입금을 확인하면 신청이 최종 완료됩니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>자주 묻는 질문 (FAQ)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Q. 반주자를 구할 수 없는데요?</h4>
                <p className="text-sm text-text-secondary">
                  A. 성악 및 관현악 참가자는 개인적으로 반주자를 섭외해야 합니다. 
                  반주자 섭외가 어려운 경우 운영진에게 문의하시면 도움을 드릴 수 있습니다.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Q. 신청 취소가 가능한가요?</h4>
                <p className="text-sm text-text-secondary">
                  A. 입금 전까지는 자유롭게 취소 가능합니다. 
                  입금 후에는 대회 7일 전까지 50% 환불, 그 이후는 환불이 불가합니다.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Q. 증빙서류가 필요한가요?</h4>
                <p className="text-sm text-text-secondary">
                  A. 별도의 증빙서류는 필요하지 않습니다. 
                  다만, 초중고 학생의 경우 학생증 지참을 권장합니다.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Q. 곡 길이가 10분을 넘으면 어떻게 되나요?</h4>
                <p className="text-sm text-text-secondary">
                  A. 심사위원 판단에 따라 연주가 중단될 수 있습니다. 
                  10분 내외로 선곡해주시기 바랍니다.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Q. 전공자와 비전공자가 같이 경쟁하나요?</h4>
                <p className="text-sm text-text-secondary">
                  A. 네, 본 콩쿠르는 전공 여부를 구분하지 않고 열린 경쟁으로 진행됩니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
