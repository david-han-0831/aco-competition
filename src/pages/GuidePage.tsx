import { FileText, CreditCard, Calendar, CheckCircle, AlertCircle } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

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
                      <span>신청 마감일은 <strong className="text-foreground">2025년 12월 31일</strong>이며, 마감일 이후 신청은 불가합니다.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>참가비 납부 후 접수 취소 시, <strong className="text-foreground">환불이 불가</strong>하오니 신중히 신청해 주시기 바랍니다.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>연주 시간은 부문별로 <strong className="text-foreground">5분 이내</strong>로 제한됩니다.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>반주자가 필요한 경우, 참가자가 직접 섭외해야 합니다.</span>
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
                  q: '참가 자격에 제한이 있나요?',
                  a: '아니요! 음악을 사랑하는 모든 분들이 참가하실 수 있습니다. 나이, 전공, 경력에 제한이 없습니다.'
                },
                {
                  q: '연주곡은 자유롭게 선택할 수 있나요?',
                  a: '네, 부문별로 연주곡을 자유롭게 선택하실 수 있습니다. 단, 연주 시간은 5분 이내로 제한됩니다.'
                },
                {
                  q: '반주자는 어떻게 준비하나요?',
                  a: '반주자가 필요한 경우 참가자께서 직접 섭외하셔야 합니다. 대회 측에서는 반주자를 제공하지 않습니다.'
                },
                {
                  q: '참가비 환불이 가능한가요?',
                  a: '죄송합니다. 참가비 납부 후에는 환불이 불가합니다. 신중하게 신청해 주시기 바랍니다.'
                },
                {
                  q: '대회 일정이 변경될 수 있나요?',
                  a: '네, 현재 일정은 2026년 1월 1일이지만 변경될 수 있습니다. 확정된 일정은 신청자분들께 개별 안내드립니다.'
                },
                {
                  q: '악보는 제출해야 하나요?',
                  a: '심사위원을 위한 악보를 대회 당일 지참하셔야 합니다. 악보 제출 부수는 추후 공지됩니다.'
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
