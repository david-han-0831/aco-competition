import { Music2, Mail, Phone, MapPin } from 'lucide-react'
import { COMPETITION_INFO } from '@/utils/constants'

const FOOTER_LOCATION = '경기도 안양시\n' + COMPETITION_INFO.location

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="absolute inset-0 grain opacity-50" />
      
      <div className="container relative z-10 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-burgundy rounded-xl flex items-center justify-center">
                <Music2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-display text-lg font-bold">
                  안양대학교 평생교육원
                </div>
                <div className="text-sm text-gray-400">
                  음악콩쿠르
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              음악을 사랑하는 모든 이들에게<br />
              열린 무대를 제공합니다
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg mb-4">바로가기</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/about" className="hover:text-accent-gold transition-colors">콩쿠르 소개</a></li>
              <li><a href="/guide" className="hover:text-accent-gold transition-colors">신청 안내</a></li>
              <li><a href="/apply" className="hover:text-accent-gold transition-colors">신청하기</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg mb-4">문의</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent-gold" />
                <span>contact@example.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent-gold" />
                <a href={`tel:${COMPETITION_INFO.contact.phone.replace(/-/g, '')}`} className="hover:text-accent-gold transition-colors">
                  {COMPETITION_INFO.contact.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-display text-lg mb-4">오시는 길</h3>
            <div className="flex items-start gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4 text-accent-gold mt-1 flex-shrink-0" />
              <span className="whitespace-pre-line">{FOOTER_LOCATION}</span>
            </div>
          </div>
        </div>

        {/* 주최·주관 / 후원 — 그리드 아래 배치, 한 줄 유지 */}
        <div className="border-t border-gray-600 pt-8 pb-8">
          <div className="flex flex-nowrap items-center gap-3 md:gap-5 w-full overflow-x-auto">
            <span className="font-display text-sm md:text-base font-semibold text-gray-300 whitespace-nowrap flex-shrink-0">주최 및 주관</span>
            <div className="w-px h-14 md:h-16 bg-gray-500 flex-shrink-0" aria-hidden />
            <img src="/logo/logo.png" alt="안양시민오케스트라" className="h-14 md:h-16 w-auto min-w-[100px] md:min-w-[140px] object-contain object-left flex-shrink-0 [filter:brightness(0)_invert(1)]" />
            <div className="w-px h-14 md:h-16 bg-gray-500 flex-shrink-0 hidden sm:block" aria-hidden />
            <span className="font-display text-sm md:text-base font-semibold text-gray-300 whitespace-nowrap flex-shrink-0 sm:pl-0">후원</span>
            <div className="w-px h-14 md:h-16 bg-gray-500 flex-shrink-0 hidden sm:block" aria-hidden />
            <div className="flex flex-1 min-w-0 items-center justify-between md:justify-around gap-3 md:gap-5 flex-nowrap">
              <img src="/img/anyang_university.jpg" alt="안양대학교 평생교육원" className="h-14 md:h-16 w-auto min-w-0 flex-1 max-w-[160px] md:max-w-[220px] object-contain opacity-90 hover:opacity-100 transition-opacity flex-shrink" />
              <img src="/img/contents_culture-place.png" alt="Contents Culture Place" className="h-14 md:h-16 w-auto min-w-0 flex-1 max-w-[160px] md:max-w-[220px] object-contain opacity-90 hover:opacity-100 transition-opacity flex-shrink" />
              <img src="/img/goldenmusic.png" alt="Goldenmusic Entertainment" className="h-14 md:h-16 w-auto min-w-0 flex-1 max-w-[160px] md:max-w-[220px] object-contain opacity-90 hover:opacity-100 transition-opacity flex-shrink" />
              <img src="/img/new-philharmonic.jpg" alt="New Philharmonic Orchestra" className="h-14 md:h-16 w-auto min-w-0 flex-1 max-w-[160px] md:max-w-[220px] object-contain opacity-90 hover:opacity-100 transition-opacity flex-shrink" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2026 안양대학교 평생교육원. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-accent-gold transition-colors">이용약관</a>
              <a href="#" className="hover:text-accent-gold transition-colors">개인정보처리방침</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
