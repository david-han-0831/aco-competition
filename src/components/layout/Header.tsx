import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { User, LogOut } from 'lucide-react'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      navigate('/')
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }
  
  const isActive = (path: string) => {
    return location.pathname === path
  }

  const navLinks = [
    { href: '/about', label: '콩쿠르 소개' },
    { href: '/guide', label: '신청 안내' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <img 
                src="/logo/logo.png" 
                alt="안양대학교 평생교육원 음악콩쿠르 로고" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-display text-xl font-bold text-foreground">
                안양대학교 평생교육원
              </div>
              <div className="text-xs text-muted-foreground">
                음악콩쿠르
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative text-sm font-medium transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-primary-burgundy'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary-burgundy" />
                )}
              </Link>
            ))}
            {!loading && user && (
              <Link
                to="/mypage"
                className={`relative text-sm font-medium transition-colors duration-200 ${
                  isActive('/mypage')
                    ? 'text-primary-burgundy'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                신청 현황
                {isActive('/mypage') && (
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary-burgundy" />
                )}
              </Link>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {!loading && user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{user.displayName || user.email?.split('@')[0]}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-xl border-2 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Link to="/apply">
                  <Button 
                    variant="outline" 
                    className="px-5 py-2 rounded-xl border-2 font-medium hover:bg-gray-50 transition-all duration-300"
                  >
                    로그인
                  </Button>
                </Link>
                <Link to="/apply">
                  <Button className="bg-primary-burgundy hover:bg-primary-wine text-white px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                    신청하기
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
