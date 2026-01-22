import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, Music2, Award, Calendar, MapPin, Trophy } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section - Full Screen Split Design */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        {/* Background Elements - White tone */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-white" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary-burgundy/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-gold/5 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text */}
            <div className="space-y-12 animate-fade-up">
              {/* Main Title */}
              <div className="space-y-6">
                <h1 className="font-display text-display-lg lg:text-display-xl text-foreground leading-none">
                  안양대학교<br />
                  평생교육원<br />
                  <span className="text-primary-burgundy">음악콩쿠르</span>
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground font-light max-w-lg">
                  음악을 사랑하는 모든 이에게 열린 무대
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/apply" className="group">
                  <Button size="lg" className="w-full sm:w-auto bg-primary-burgundy hover:bg-primary-wine text-white px-8 py-6 text-base font-semibold rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300">
                    콩쿠르 신청하기
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-6 text-base font-semibold rounded-xl border-2 hover:bg-gray-50 transition-all duration-300">
                    자세히 보기
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Visual Element */}
            <div className="relative lg:block hidden">
              <div className="relative w-full aspect-square">
                {/* Decorative Circles - White tone */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Largest circle with image */}
                  <div 
                    className="absolute w-full h-full rounded-full overflow-hidden bg-cover bg-center shadow-lg"
                    style={{
                      backgroundImage: `url(/img/hero-section1.jpg)`
                    }}
                  >
                    {/* Optional overlay for better text/icon visibility if needed */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-burgundy/5 to-accent-gold/5 backdrop-blur-[2px]" />
                  </div>
                  {/* Middle decorative circle */}
                  <div className="absolute w-4/5 h-4/5 rounded-full border-2 border-accent-gold/15" />
                  {/* Outer decorative circle */}
                  <div className="absolute w-full h-full rounded-full border-2 border-primary-burgundy/10 animate-spin-slow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards - Modern Grid */}
      <section className="py-48 relative">
        <div className="absolute inset-0 bg-white" />
        
        <div className="container relative z-10">
          {/* Section Header */}
          <div className="text-center mb-24">
            <h2 className="text-5xl lg:text-6xl font-display text-foreground mb-3">
              행사 안내
            </h2>
            <div className="w-20 h-1 bg-accent-gold mx-auto" />
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Card 1 - 참가 부문 */}
            <div className="group relative p-10 bg-white rounded-2xl border-2 border-gray-200 hover:border-primary-burgundy/40 transition-all duration-500 hover:shadow-elegant flex flex-col h-full">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary-burgundy rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                <Music2 className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-display mb-6 text-foreground">참가 부문</h3>
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">악기</div>
                    <div className="flex flex-wrap gap-2">
                      {['피아노', '관현악', '성악'].map((instrument, i) => (
                        <span key={i} className="px-3 py-1.5 bg-primary-burgundy/10 text-primary-burgundy rounded-full text-sm font-medium">
                          {instrument}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">연령대</div>
                    <div className="space-y-1.5">
                      {['초등부', '중등부', '고등부', '성인'].map((age, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
                          <span className="text-sm text-foreground">{age}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-sm text-muted-foreground mb-1">참가 대상</div>
                  <div className="text-sm text-foreground">전공자, 아마추어 무관</div>
                </div>
              </div>
            </div>

            {/* Card 2 - 개최 일시 */}
            <div className="group relative p-10 bg-white rounded-2xl border-2 border-gray-200 hover:border-primary-burgundy/40 transition-all duration-500 hover:shadow-elegant flex flex-col h-full">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary-burgundy rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-display mb-6 text-foreground">개최 일시</h3>
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">일시</div>
                    <div className="text-lg font-semibold text-foreground">2026년 1월 1일</div>
                    <div className="text-sm text-muted-foreground">(변경 예정)</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      장소
                    </div>
                    <div className="text-lg font-semibold text-foreground">안양대학교 문화관 4층</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 - 대회 요강 */}
            <div className="group relative p-10 bg-white rounded-2xl border-2 border-gray-200 hover:border-accent-gold/50 transition-all duration-500 hover:shadow-elegant flex flex-col h-full">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-accent-gold rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-display mb-6 text-foreground">대회 요강</h3>
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="pb-3 border-b border-gray-200">
                    <div className="text-sm text-muted-foreground mb-1">접수 방법</div>
                    <div className="text-sm font-semibold text-foreground">인터넷 접수</div>
                    <div className="text-xs text-muted-foreground mt-1">www.anyang.kr</div>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-muted-foreground">접수 기간</span>
                    <span className="font-semibold text-foreground">12.01~12.31</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-muted-foreground">참가비</span>
                    <span className="text-2xl font-display font-bold text-primary-burgundy">10<span className="text-base">만원</span></span>
                  </div>
                  <div className="pb-3 border-b border-gray-200">
                    <div className="text-sm text-muted-foreground mb-1">입금계좌</div>
                    <div className="text-sm font-semibold text-foreground">1234-5678-91011</div>
                  </div>
                </div>
                <div className="pt-4 space-y-2">
                  <div className="text-xs text-muted-foreground">• 자유곡 10분 내외 1곡</div>
                  <div className="text-xs text-muted-foreground">• 반복없이 암보로 연주</div>
                  <div className="text-xs text-muted-foreground">• 성악·관현악 참가자는 반주자 대동</div>
                  <div className="text-xs text-muted-foreground">• 시간 초과 시 중간 종료 가능</div>
                </div>
              </div>
            </div>

            {/* Card 4 - 시상 내역 */}
            <div className="group relative p-10 bg-white rounded-2xl border-2 border-gray-200 hover:border-accent-gold/50 transition-all duration-500 hover:shadow-elegant flex flex-col h-full">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-accent-gold rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-display mb-6 text-foreground">시상 내역</h3>
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="pb-3 border-b border-gray-200">
                    <div className="text-sm text-muted-foreground mb-1">전체 대상</div>
                    <div className="text-base font-semibold text-foreground">영산아트홀 협연 기회</div>
                    <div className="text-xs text-muted-foreground mt-1">(2026년)</div>
                  </div>
                  <div className="pb-3 border-b border-gray-200">
                    <div className="text-sm text-muted-foreground mb-1">부문별 1등</div>
                    <div className="text-2xl font-display font-bold text-primary-burgundy">50<span className="text-base">만원</span></div>
                  </div>
                </div>
                <div className="pt-4 space-y-1">
                  <div className="text-xs text-muted-foreground">부문별 2·3등 및 장려상</div>
                  <div className="text-xs text-muted-foreground">심사 결과에 따라 시상</div>
                  <div className="text-xs text-muted-foreground mt-2 italic">※ 공연장은 상황에 따라 변동될 수 있음</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Bold & Simple */}
      <section className="py-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,21,56,0.05),transparent_50%)]" />
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-6 mb-16">
              <h2 className="text-5xl lg:text-7xl font-display text-foreground leading-relaxed">
                당신의 음악,<br />
                세상과 공유하세요
              </h2>
              <p className="text-xl lg:text-2xl text-muted-foreground font-light max-w-2xl mx-auto">
                음악에 대한 열정을 마음껏 펼칠 수 있는 기회
              </p>
            </div>
            <Link to="/apply" className="inline-block">
              <Button size="lg" className="bg-primary-burgundy text-white hover:bg-primary-wine px-12 py-8 text-lg font-bold rounded-2xl shadow-elegant hover:scale-105 transition-transform duration-300">
                지금 신청하기
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
