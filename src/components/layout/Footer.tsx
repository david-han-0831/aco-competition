import { Music2, Mail, Phone, MapPin } from 'lucide-react'

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
                <span>031-123-4567</span>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-display text-lg mb-4">오시는 길</h3>
            <div className="flex items-start gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4 text-accent-gold mt-1 flex-shrink-0" />
              <span>
                경기도 안양시<br />
                안양대학교 문학관 4층
              </span>
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
