import { FileText, CreditCard, Calendar, CheckCircle, AlertCircle } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { COMPETITION_INFO } from '@/utils/constants'

export default function GuidePage() {
  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden grain">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-50/20 to-transparent" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent-gold/10 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
            <h1 className="font-display text-display-lg lg:text-display-xl text-foreground">
              신청 안내
            </h1>
            <div className="w-24 h-1.5 bg-accent-gold mx-auto" />
            <p className="text-xl lg:text-2xl text-muted-foreground font-light leading-relaxed">
              신청부터 참가까지의 모든 과정을<br />
              한눈에 확인하세요
            </p>
          </div>
        </div>
      </section>

      {/* Application Steps */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="max-w-5xl mx-auto mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-display text-foreground mb-4">
                신청 절차
              </h2>
              <div className="w-20 h-1 bg-accent-gold mx-auto mb-6" />
              <p className="text-xl text-muted-foreground">
                4단계로 간편하게 신청하세요
              </p>
            </div>

            <div className="relative">
              {/* Connection Line */}
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-burgundy via-accent-gold to-primary-burgundy -translate-x-1/2" />
              
              <div className="space-y-16">
                {[
                  {
                    step: '01',
                    icon: FileText,
                    title: '온라인 신청서 작성',
                    desc: '웹사이트에서 신청서를 작성하고 제출합니다',
                    details: ['개인정보 입력', '부문 선택', '연주곡 등록']
                  },
                  {
                    step: '02',
                    icon: CreditCard,
                    title: '참가비 납부',
                    desc: '안내된 계좌로 참가비를 입금합니다',
                    details: ['참가비: 100,000원', '입금자명: 참가자 본인', '마감일 이전 입금']
                  },
                  {
                    step: '03',
                    icon: CheckCircle,
                    title: '접수 확인',
                    desc: '신청 내역과 입금 확인 후 승인됩니다',
                    details: ['입금 확인 (1-2일)', '이메일 승인 통지', '마이페이지 확인']
                  },
                  {
                    step: '04',
                    icon: Calendar,
                    title: '대회 참가',
                    desc: '지정된 일시에 대회장에 방문합니다',
                    details: ['30분 전 도착', '신분증 지참', '악보 준비']
                  }
                ].map((item, i) => (
                  <div key={i} className={`relative grid lg:grid-cols-2 gap-8 items-center ${i % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                    {/* Step Number */}
                    <div className={`${i % 2 === 0 ? 'lg:text-right' : 'lg:order-2'}`}>
                      <div className="inline-block">
                        <div className="text-8xl lg:text-9xl font-display font-bold text-primary-burgundy/10 mb-4">
                          {item.step}
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 bg-primary-burgundy rounded-2xl flex items-center justify-center">
                            <item.icon className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-3xl font-display text-foreground">{item.title}</h3>
                        </div>
                        <p className="text-lg text-muted-foreground mb-6">{item.desc}</p>
                        <ul className="space-y-2">
                          {item.details.map((detail, j) => (
                            <li key={j} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
                              <span className="text-muted-foreground">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Visual Element */}
                    <div className={`relative h-64 rounded-2xl bg-gradient-to-br from-primary-burgundy/5 to-accent-gold/5 flex items-center justify-center ${i % 2 === 0 ? '' : 'lg:order-1'}`}>
                      <div className="absolute inset-0 grain rounded-2xl" />
                      <item.icon className="w-24 h-24 text-primary-burgundy/20" />
                    </div>

                    {/* Connection Dot */}
                    <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-4 border-primary-burgundy z-10" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="max-w-5xl mx-auto mb-32">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-10">
              <div className="flex items-start gap-4 mb-6">
                <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-display text-foreground mb-4">유의사항</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>전공자 / 아마추어 부문은 <strong className="text-foreground">별도 심사</strong>로 진행됩니다.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>반주자는 <strong className="text-foreground">참가자 본인이 대동</strong>해야 합니다.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>반주자 연결이 필요한 경우, 사전 콩쿨 게시판 신청 필수 (반주비 별도).</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>모든 곡은 <strong className="text-foreground">암보 연주</strong>로 진행됩니다.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>연주 시간이 초과될 경우, 심사위원 판단에 따라 연주가 중단될 수 있습니다.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>접수기간은 <strong className="text-foreground">{COMPETITION_INFO.contact.period}</strong>이며, 마감 이후 신청은 불가합니다.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>참가비 납부 후 접수 취소 시 환불이 불가하오니 신중히 신청해 주시기 바랍니다.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-display text-foreground mb-4">
                자주 묻는 질문
              </h2>
              <div className="w-20 h-1 bg-accent-gold mx-auto" />
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  q: '참가 부문은 어떻게 되나요?',
                  a: '피아노, 관/현악, 성악/동요 부문이 있으며, 전공자 및 아마추어 모두 참가 가능합니다.'
                },
                {
                  q: '참가곡 및 연주 시간은?',
                  a: '피아노, 관/현악, 성악/동요 모두 자유곡 1곡(10분 이내)로 진행됩니다.'
                },
                {
                  q: '참가자격(연령부)은?',
                  a: '유/초등부, 중/고등부, 대학/일반부로 구분됩니다.'
                },
                {
                  q: '접수기간은 언제인가요?',
                  a: `2026년 2월 1일(일) ~ 6월 26일(금) 23:59까지입니다.`
                },
                {
                  q: '참가비 및 입금계좌는?',
                  a: `얼리버드 접수 10만원, 5월 1일부터 12만원입니다. 입금계좌: ${COMPETITION_INFO.contact.account} (${COMPETITION_INFO.contact.accountHolder})`
                },
                {
                  q: '접수방법은 어떻게 되나요?',
                  a: '홈페이지(콩쿨 게시판)를 통해 인터넷 접수합니다. 서면 접수를 원하시면 홈페이지에서 참가신청서 양식을 다운로드해 작성 후 우편으로 제출하시면 됩니다. (우편주소는 전화 문의 바랍니다.)'
                },
                {
                  q: '시상 및 특전은?',
                  a: '전체 대상: 상금 30만원 + 오케스트라 협연 기회(장소 추후 공지). 각 부문별 1등: 상금 20만원 + 오케스트라 협연 기회. 각 부문별 입상자에게도 오케스트라 협연 기회가 제공됩니다. 모든 수상자에게 안양대학교 평생교육원장 명의 상장이 수여되며, 공동수상 또는 입상자가 없을 수 있습니다.'
                },
                {
                  q: '반주자는 어떻게 준비하나요?',
                  a: '반주자는 참가자 본인이 대동해야 합니다. 반주자 연결이 필요한 경우 사전에 콩쿨 게시판에서 신청해야 하며, 반주비는 별도입니다.'
                },
                {
                  q: '문의처는?',
                  a: `${COMPETITION_INFO.contact.phone}`
                }
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-2 border-gray-100 rounded-xl px-6 data-[state=open]:border-primary-burgundy/30 transition-colors">
                  <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary-burgundy transition-colors py-6">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  )
}
