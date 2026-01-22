import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Shield, LayoutDashboard, FileText, Users, LogOut, Home, LogIn, User } from 'lucide-react'

const googleProvider = new GoogleAuthProvider()

export default function AdminHeader() {
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

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // 사용자 정보를 Firestore에 저장 (없는 경우에만)
      try {
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            role: 'user',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        }
      } catch (firestoreError: any) {
        console.warn('사용자 정보 저장 실패 (권한 문제일 수 있음):', firestoreError)
        if (firestoreError.code === 'permission-denied') {
          console.warn('Firestore Security Rules를 확인해주세요. 사용자 문서 생성 권한이 필요합니다.')
        }
      }
    } catch (error: any) {
      console.error('구글 로그인 오류:', error)
      if (error.code === 'auth/popup-closed-by-user') {
        return // 사용자가 팝업을 닫은 경우
      }
      alert(`로그인에 실패했습니다: ${error.message || '알 수 없는 오류'}`)
    }
  }
  
  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/'
    }
    return location.pathname.startsWith(path)
  }

  const navLinks = [
    { href: '/admin', label: '대시보드', icon: LayoutDashboard },
    { href: '/admin/applications', label: '신청 목록', icon: FileText },
    { href: '/admin/users', label: '회원 관리', icon: Users },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white border-b border-gray-700">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary-burgundy rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-display text-xl font-bold">
                관리자 페이지
              </div>
              <div className="text-xs text-gray-400">
                Admin Dashboard
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-primary-burgundy text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button 
                variant="outline" 
                className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 rounded-xl"
              >
                <Home className="w-4 h-4 mr-2" />
                사용자 페이지
              </Button>
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700/50">
                      <User className="w-4 h-4 text-gray-300" />
                      <span className="text-sm text-gray-300">{user.displayName || user.email?.split('@')[0]}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleSignOut}
                      className="border-red-500/50 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      로그아웃
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={handleSignIn}
                    className="border-green-500/50 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-xl"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    로그인
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
