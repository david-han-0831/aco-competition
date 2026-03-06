import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User as FirebaseUser } from 'firebase/auth'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc, setDoc, serverTimestamp, Timestamp, deleteField } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Search,
  Download,
  Eye,
  RotateCcw,
  UserCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import AdminHeader from '@/components/layout/AdminHeader'
import ApplicationDetailModal from '@/components/admin/ApplicationDetailModal'
import { formatPhoneDisplay } from '@/utils/phone'
import type { Application } from '@/types'

const APPLICATIONS_PER_PAGE = 10

const googleProvider = new GoogleAuthProvider()

interface ApplicationWithId extends Omit<Application, 'createdAt' | 'updatedAt' | 'email' | 'phone' | 'piece'> {
  id: string
  createdAt?: string
  updatedAt?: string
  email?: string
  phone?: string
  piece?: string
  appliedAt?: string
  paidAt?: string | null
  refundedAt?: string | null
  needAccompanistRequest?: boolean
  hasAccompanist?: boolean
}

const statusConfig = {
  pending: { label: '신청완료', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  paid: { label: '입금완료', color: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: '취소', color: 'bg-gray-100 text-gray-800 border-gray-200' },
  refunded: { label: '환불', color: 'bg-red-100 text-red-800 border-red-200' },
}

const divisionMap: Record<string, string> = {
  piano: '피아노',
  vocal: '성악',
  orchestra: '관현악',
  children_song: '동요',
  vocal_children: '성악/동요',
}

const categoryMap: Record<string, string> = {
  elementary: '초등부',
  middle: '중등부',
  high: '고등부',
  adult: '성인',
  elementary_middle: '유/초등부',
  middle_high: '중/고등부',
  university_general: '대학/일반부',
}

export default function AdminPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [accompanistFilter, setAccompanistFilter] = useState<'all' | 'requested'>('all') // 반주자 신청 희망자만
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithId | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [applications, setApplications] = useState<ApplicationWithId[]>([])
  const [loading, setLoading] = useState(true)
  const [listPage, setListPage] = useState(1)

  // 현재 탭 확인
  const currentTab = location.pathname.includes('/applications')
    ? 'applications'
    : location.pathname.includes('/users')
    ? 'users'
    : 'dashboard'

  // 인증 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      if (!firebaseUser) {
        setUserRole(null)
        setAuthLoading(false)
        return
      }
      getDoc(doc(db, 'users', firebaseUser.uid))
        .then((snap) => {
          const role = snap.exists() && snap.data()?.role === 'admin' ? 'admin' : 'user'
          setUserRole(role)
        })
        .catch(() => setUserRole('user'))
        .finally(() => setAuthLoading(false))
    })
    return unsubscribe
  }, [])

  // user일 때 admin 경로 접근 차단 → 홈으로 리다이렉트
  useEffect(() => {
    if (authLoading) return
    if (user && userRole === 'user') {
      navigate('/', { replace: true })
    }
  }, [authLoading, user, userRole, navigate])

  // Firestore에서 실시간 데이터 가져오기 (관리자만)
  useEffect(() => {
    if (!user || userRole !== 'admin') {
      setApplications([])
      setLoading(false)
      return
    }

    const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps: ApplicationWithId[] = snapshot.docs.map((doc) => {
        const data = doc.data()
        
        // Timestamp를 날짜 문자열로 변환
        const formatDate = (timestamp: any) => {
          if (!timestamp) return ''
          if (timestamp.toDate) {
            return timestamp.toDate().toISOString().split('T')[0]
          }
          if (timestamp instanceof Date) {
            return timestamp.toISOString().split('T')[0]
          }
          if (typeof timestamp === 'string') {
            return timestamp.split('T')[0]
          }
          return ''
        }

        return {
          id: doc.id,
          ...data,
          createdAt: formatDate(data.createdAt),
          updatedAt: formatDate(data.updatedAt),
          appliedAt: formatDate(data.createdAt),
          paidAt: data.paidAt ? formatDate(data.paidAt) : null,
          refundedAt: data.refundedAt ? formatDate(data.refundedAt) : null,
          piece: data.piece ?? '',
          instrument: data.instrument ?? '',
          category: data.category,
          division: data.division,
        } as ApplicationWithId
      })
      setApplications(apps)
      setLoading(false)
    }, (error) => {
      console.error('데이터 로드 오류:', error)
      setLoading(false)
    })

    return unsubscribe
  }, [user, userRole])

  // 통계 계산
  const stats = {
    total: applications.length,
    paid: applications.filter(app => app.status === 'paid').length,
    pending: applications.filter(app => app.status === 'pending').length,
    cancelled: applications.filter(app => app.status === 'cancelled').length,
    refunded: applications.filter(app => app.status === 'refunded').length,
  }

  // 필터링
  const filteredApplications = applications.filter(app => {
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus
    const matchesAccompanist = accompanistFilter === 'all' || app.needAccompanistRequest === true
    const searchLower = searchQuery.toLowerCase()
    const divisionName = app.division ? divisionMap[app.division] : ''
    const categoryName = app.category ? categoryMap[app.category] : ''
    const matchesSearch = 
      app.name?.toLowerCase().includes(searchLower) ||
      app.email?.toLowerCase().includes(searchLower) ||
      app.phone?.toLowerCase().includes(searchLower) ||
      divisionName.toLowerCase().includes(searchLower) ||
      categoryName.toLowerCase().includes(searchLower) ||
      app.piece?.toLowerCase().includes(searchLower) ||
      app.instrument?.toLowerCase().includes(searchLower)
    return matchesStatus && matchesAccompanist && matchesSearch
  })

  // 페이지네이션: 10개씩
  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / APPLICATIONS_PER_PAGE))
  const paginatedApplications = filteredApplications.slice(
    (listPage - 1) * APPLICATIONS_PER_PAGE,
    listPage * APPLICATIONS_PER_PAGE
  )

  // 필터/검색 바뀌면 1페이지로; 페이지 수 줄어들면 현재 페이지 보정
  useEffect(() => {
    setListPage(1)
  }, [selectedStatus, accompanistFilter, searchQuery])
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredApplications.length / APPLICATIONS_PER_PAGE))
    setListPage((p) => Math.min(p, maxPage))
  }, [filteredApplications.length])

  // 상태 변경 핸들러
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const appRef = doc(db, 'applications', id)
      const updateData: Record<string, unknown> = {
        status: newStatus,
        updatedAt: Timestamp.now(),
      }

      if (newStatus === 'paid') {
        updateData.paidAt = Timestamp.now()
        updateData.refundedAt = deleteField()
      } else if (newStatus === 'refunded') {
        updateData.refundedAt = Timestamp.now()
      } else {
        // pending, cancelled 등: paidAt/refundedAt 제거
        updateData.paidAt = deleteField()
        updateData.refundedAt = deleteField()
      }

      await updateDoc(appRef, updateData)
    } catch (error) {
      console.error('상태 변경 오류:', error)
      alert('상태 변경에 실패했습니다.')
    }
  }

  // 상세 보기 핸들러
  const handleViewDetail = (app: ApplicationWithId) => {
    setSelectedApplication(app)
    setIsDetailModalOpen(true)
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

  if (authLoading || (user && userRole === null)) {
    return (
      <>
        <AdminHeader />
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </>
    )
  }

  // role이 user면 관리자 접근 불가 → 리다이렉트(useEffect), 그 전까지 아무것도 안 보여줌
  if (user && userRole === 'user') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-muted-foreground">접근 권한이 없습니다. 메인으로 이동합니다.</p>
      </div>
    )
  }

  return (
    <>
      <AdminHeader />
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold text-foreground mb-2">
                {currentTab === 'dashboard' && '대시보드'}
                {currentTab === 'applications' && '신청 목록'}
                {currentTab === 'users' && '회원 관리'}
              </h1>
              <p className="text-muted-foreground">
                {currentTab === 'dashboard' && '콩쿠르 신청 현황을 한눈에 확인하세요'}
                {currentTab === 'applications' && '신청서를 관리하고 상태를 변경하세요'}
                {currentTab === 'users' && '등록된 회원을 관리하세요'}
              </p>
            </div>
            {currentTab === 'applications' && (
              <Button className="bg-primary-burgundy hover:bg-primary-wine text-white px-6 rounded-xl shadow-md">
                <Download className="w-4 h-4 mr-2" />
                Excel 다운로드
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container py-12">
        {/* Login Required Message */}
        {!user && (
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-16 text-center">
            <UserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-display text-foreground mb-2">
              로그인이 필요합니다
            </h3>
            <p className="text-muted-foreground mb-8">
              어드민 페이지를 사용하려면 먼저 로그인해주세요
            </p>
            <Button
              onClick={handleSignIn}
              className="bg-primary-burgundy hover:bg-primary-wine text-white px-8 py-6 rounded-xl font-semibold shadow-elegant hover:shadow-glow transition-all duration-300"
            >
              로그인
            </Button>
          </div>
        )}

        {/* Dashboard Tab */}
        {currentTab === 'dashboard' && user && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <div className="group relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-primary-burgundy/30 transition-all duration-300 hover:shadow-brutal">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary-burgundy/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-primary-burgundy" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-display font-bold text-foreground">
                  {stats.total}
                </div>
                <div className="text-sm text-muted-foreground">명</div>
              </div>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              전체 신청자
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-green-500/30 transition-all duration-300 hover:shadow-brutal">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-display font-bold text-foreground">
                  {stats.paid}
                </div>
                <div className="text-sm text-muted-foreground">명</div>
              </div>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              입금 완료
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-amber-500/30 transition-all duration-300 hover:shadow-brutal">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-display font-bold text-foreground">
                  {stats.pending}
                </div>
                <div className="text-sm text-muted-foreground">명</div>
              </div>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              입금 대기
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-gray-500/30 transition-all duration-300 hover:shadow-brutal">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <XCircle className="w-6 h-6 text-gray-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-display font-bold text-foreground">
                  {stats.cancelled}
                </div>
                <div className="text-sm text-muted-foreground">명</div>
              </div>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              신청 취소
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-red-500/30 transition-all duration-300 hover:shadow-brutal">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <RotateCcw className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-display font-bold text-foreground">
                  {stats.refunded}
                </div>
                <div className="text-sm text-muted-foreground">명</div>
              </div>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              환불
            </div>
          </div>
        </div>
          </>
        )}

        {/* Applications Tab */}
        {currentTab === 'applications' && user && (
          <>
        {/* Filters */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="이름, 이메일, 전화번호로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-primary-burgundy/30 transition-colors"
              />
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-auto">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-primary-burgundy/30 transition-colors font-medium"
              >
                <option value="all">전체 상태</option>
                <option value="pending">신청완료</option>
                <option value="paid">입금완료</option>
                <option value="cancelled">취소</option>
                <option value="refunded">환불</option>
              </select>
            </div>
            {/* 반주자 신청 희망자 필터 (연락용) */}
            <div className="w-full md:w-auto">
              <select
                value={accompanistFilter}
                onChange={(e) => setAccompanistFilter(e.target.value as 'all' | 'requested')}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-primary-burgundy/30 transition-colors font-medium"
              >
                <option value="all">전체</option>
                <option value="requested">반주자 신청 희망만</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-16 text-center">
            <p className="text-lg text-muted-foreground">로딩 중...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-16 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              {searchQuery || selectedStatus !== 'all' ? '검색 결과가 없습니다' : '신청 내역이 없습니다'}
            </p>
          </div>
        ) : (
          <>
          <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">이름</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">이메일</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">연락처</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">부문</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">반주자여부</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">신청일</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">상태</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{app.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-muted-foreground">{app.email || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-muted-foreground">{formatPhoneDisplay(app.phone)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-burgundy/10 text-primary-burgundy text-sm font-medium">
                          {app.division ? divisionMap[app.division] : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {app.hasAccompanist === true
                          ? '동반'
                          : app.needAccompanistRequest === true
                            ? '신청 희망'
                            : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{app.appliedAt}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${statusConfig[app.status as keyof typeof statusConfig].color}`}>
                          {statusConfig[app.status as keyof typeof statusConfig].label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg"
                            onClick={() => handleViewDetail(app)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {app.status === 'pending' && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
                              onClick={() => handleStatusChange(app.id, 'paid')}
                            >
                              입금확인
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-4 mt-4 px-1">
              <p className="text-sm text-muted-foreground">
                {(listPage - 1) * APPLICATIONS_PER_PAGE + 1}–{Math.min(listPage * APPLICATIONS_PER_PAGE, filteredApplications.length)} / {filteredApplications.length}건
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  disabled={listPage <= 1}
                  onClick={() => setListPage((p) => Math.max(1, p - 1))}
                >
                  이전
                </Button>
                <span className="text-sm font-medium px-2">
                  {listPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  disabled={listPage >= totalPages}
                  onClick={() => setListPage((p) => Math.min(totalPages, p + 1))}
                >
                  다음
                </Button>
              </div>
            </div>
          )}
          </>
        )}
          </>
        )}

        {/* Users Tab */}
        {currentTab === 'users' && user && (
          <UsersTab />
        )}
      </div>

      {/* Detail Modal */}
      <ApplicationDetailModal
        application={selectedApplication}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        onStatusChange={handleStatusChange}
      />
      </div>
    </>
  )
}

// Users Tab Component
function UsersTab() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString().split('T')[0] || '',
        }
      })
      setUsers(usersList)
      setLoading(false)
    }, (error) => {
      console.error('회원 로드 오류:', error)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase()
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.displayName?.toLowerCase().includes(searchLower) ||
      user.uid?.toLowerCase().includes(searchLower)
    )
  })

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="이메일, 이름, UID로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-primary-burgundy/30 transition-colors"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  이름
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  이메일
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  권한
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  가입일
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{user.displayName || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-muted-foreground">{user.email || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === 'admin' 
                        ? 'bg-primary-burgundy/10 text-primary-burgundy border border-primary-burgundy/20'
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {user.role === 'admin' ? '관리자' : '일반 사용자'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {user.createdAt || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <UserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              {searchQuery ? '검색 결과가 없습니다' : '등록된 회원이 없습니다'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
