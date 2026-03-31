import { Music2, Trophy, Users, Target } from 'lucide-react'
import { COMPETITION_INFO } from '@/utils/constants'

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden grain">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-rose-50/20 to-transparent" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-burgundy/5 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-up">
            <h1 className="font-display text-display-lg lg:text-display-xl text-foreground">
              콩쿠르 소개
            </h1>
            <div className="w-24 h-1.5 bg-accent-gold mx-auto" />
            <p className="text-xl lg:text-2xl text-muted-foreground font-light leading-relaxed">
              음악을 사랑하는 모든 이들에게 열린<br />
              안양시민오케스트라의 첫 번째 음악 축제
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-40 bg-white">
        <div className="container">
          {/* 개최 배경 */}
          <div className="max-w-5xl mx-auto mb-40">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl lg:text-5xl font-display text-foreground">
                  개최 배경
                </h2>
                <div className="w-16 h-1 bg-accent-gold" />
                <p className="text-lg text-muted-foreground leading-relaxed">
                  안양시민오케스트라는 지역 사회와 함께 성장하며, 문화예술 발전에 기여하고자 이번 음악콩쿠르를 개최합니다.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  이번 대회는 단순한 경쟁의 장을 넘어, 음악을 사랑하는 모든 이들이 서로의 재능을 격려하고 나누는 축제의 장이 될 것입니다.
                </p>
              </div>
              
              <div className="relative h-96 rounded-2xl bg-gradient-to-br from-primary-burgundy/10 to-accent-gold/10 flex items-center justify-center">
                <Music2 className="w-32 h-32 text-primary-burgundy/30" />
              </div>
            </div>
          </div>

          {/* 대회 목표 */}
          <div className="max-w-6xl mx-auto mb-40">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-display text-foreground mb-4">
                대회 목표
              </h2>
              <div className="w-20 h-1 bg-accent-gold mx-auto" />
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Trophy,
                  title: '재능 발견',
                  desc: '숨겨진 음악적 재능을 발굴하고 격려합니다'
                },
                {
                  icon: Users,
                  title: '문화 교류',
                  desc: '지역 사회의 문화예술 발전에 기여합니다'
                },
                {
                  icon: Target,
                  title: '성장 기회',
                  desc: '참가자들의 음악적 성장을 지원합니다'
                }
              ].map((item, i) => (
                <div key={i} className="group relative p-10 bg-white rounded-2xl border-2 border-gray-100 hover:border-primary-burgundy/30 transition-all duration-500 hover:shadow-brutal">
                  <div className="w-16 h-16 mb-6 bg-primary-burgundy/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-8 h-8 text-primary-burgundy" />
                  </div>
                  <h3 className="text-2xl font-display mb-4 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 참가 부문 */}
          <div className="max-w-5xl mx-auto mb-40">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-display text-foreground mb-4">
                참가 부문
              </h2>
              <div className="w-20 h-1 bg-accent-gold mx-auto mb-6" />
              <p className="text-xl text-muted-foreground">
                피아노 · 관/현악 · 성악/동요, 전공자 및 아마추어 모두 참가 가능
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: '피아노', desc: '자유곡 1곡(10분 이내), 암보 연주' },
                { title: '관/현악', desc: '자유곡 1곡(10분 이내), 반주자 본인 대동' },
                { title: '성악/동요', desc: '자유곡 1곡(10분 이내), 반주자 본인 대동' },
                { title: '연령부', desc: '유/초등부 · 중/고등부 · 대학/일반부' }
              ].map((item, i) => (
                <div key={i} className="group p-8 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-100 hover:border-accent-gold/50 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 mt-2 rounded-full bg-accent-gold group-hover:scale-150 transition-transform duration-300" />
                    <div>
                      <h3 className="text-2xl font-display mb-2 text-foreground">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 대회 정보 */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-primary-burgundy to-primary-wine rounded-3xl p-12 lg:p-16 text-white">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-display mb-8">대회 정보</h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 mt-2 rounded-full bg-accent-gold" />
                      <div>
                        <div className="text-sm opacity-80 mb-1">일시</div>
                        <div className="text-xl font-semibold">{COMPETITION_INFO.dateTime}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 mt-2 rounded-full bg-accent-gold" />
                      <div>
                        <div className="text-sm opacity-80 mb-1">장소</div>
                        <div className="text-xl font-semibold">{COMPETITION_INFO.location}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 mt-2 rounded-full bg-accent-gold" />
                      <div>
                        <div className="text-sm opacity-80 mb-1">접수 기간</div>
                        <div className="text-xl font-semibold">{COMPETITION_INFO.contact.period}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 mt-2 rounded-full bg-accent-gold" />
                      <div>
                        <div className="text-sm opacity-80 mb-1">주최 · 주관</div>
                        <div className="text-xl font-semibold">안양시민오케스트라</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-2 h-2 mt-2 rounded-full bg-accent-gold" />
                      <div>
                        <div className="text-sm opacity-80 mb-1">문의</div>
                        <div className="text-xl font-semibold">{COMPETITION_INFO.contact.phone}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-display mb-6">시상 내역</h3>
                  <div className="space-y-4">
                    {[
                      { award: '전체 대상', prize: '상금 30만원 + 오케스트라 협연 (장소 추후 공지)' },
                      { award: '부문별 1등', prize: '상금 20만원 + 오케스트라 협연' },
                      { award: '부문별 입상자', prize: '오케스트라 협연 기회 제공' },
                      { award: '상장', prize: '안양대학교 평생교육원장 명의 상장 수여' },
                      { award: '참고', prize: '공동수상 또는 입상자 없을 수 있음' }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-start gap-4 py-3 border-b border-white/20">
                        <span className="text-lg font-semibold flex-shrink-0">{item.award}</span>
                        <span className="text-sm opacity-90 text-right">{item.prize}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
