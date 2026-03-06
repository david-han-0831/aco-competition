import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText,
  ArrowRight,
  RotateCcw
} from 'lucide-react'
import ApplicationEditModal from '@/components/application/ApplicationEditModal'

interface ApplicationWithId {
  id: string
  userId: string
  name: string
  email?: string
  phone?: string
  guardianPhone?: string
  zipcode?: string
  address?: string
  addressDetail?: string
  category?: string
  schoolGrade?: string
  division?: string
  isMajor?: string
  piece?: string
  instrument?: string
  depositorName?: string
  accompanistName?: string
  accompanistPhone?: string
  age?: number
  gender?: string
  status: string
  createdAt: Timestamp | string
  updatedAt: Timestamp | string
  appliedAt?: string
  paidAt?: string | null
  /** 소프트 삭제 시 true, 목록에서 숨김 */
  deleted?: boolean
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

const statusConfig = {
  pending: { 
    label: '신청완료', 
    icon: Clock,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    description: '입금 대기 중입니다'
  },
  paid: { 
    label: '입금완료', 
    icon: CheckCircle,
    color: 'text-green-600 bg-green-50 border-green-200',
    description: '입금이 확인되었습니다'
  },
  cancelled: { 
    label: '취소', 
    icon: XCircle,
    color: 'text-gray-600 bg-gray-50 border-gray-200',
    description: '신청이 취소되었습니다'
  },
  refunded: { 
    label: '환불', 
    icon: RotateCcw,
    color: 'text-red-600 bg-red-50 border-red-200',
    description: '환불이 처리되었습니다'
  },
}

export default function MyPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<ApplicationWithId[]>([])
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithId | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
      if (!user) {
        navigate('/apply')
      }
    })
    return unsubscribe
  }, [navigate])

  // 현재 사용자의 신청서만 가져오기
  useEffect(() => {
    if (!user) return

    // 인덱스가 완료되면 서버 측 정렬 사용, 실패 시 클라이언트 측 정렬로 폴백
    const q = query(
      collection(db, 'applications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps: ApplicationWithId[] = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString().split('T')[0] || data.createdAt || '',
          updatedAt: data.updatedAt?.toDate?.()?.toISOString().split('T')[0] || data.updatedAt || '',
          appliedAt: data.createdAt?.toDate?.()?.toISOString().split('T')[0] || '',
          paidAt: data.paidAt ? (data.paidAt?.toDate?.()?.toISOString().split('T')[0] ?? null) : null,
          piece: data.piece ?? '',
          instrument: data.instrument ?? '',
        } as ApplicationWithId
      })
      setApplications(apps)
    }, (error) => {
      console.error('신청서 로드 오류:', error)
      
      // 인덱스 오류인 경우 클라이언트 측 정렬로 폴백
      if (error.code === 'failed-precondition' && error.message.includes('index')) {
        console.warn('인덱스가 아직 준비되지 않았습니다. 클라이언트 측 정렬로 폴백합니다.')
        
        // 폴백: orderBy 없이 쿼리
        const fallbackQuery = query(
          collection(db, 'applications'),
          where('userId', '==', user.uid)
        )
        
        const fallbackUnsubscribe = onSnapshot(fallbackQuery, (snapshot) => {
          const apps: ApplicationWithId[] = snapshot.docs.map((doc) => {
            const data = doc.data()
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate?.()?.toISOString().split('T')[0] || data.createdAt || '',
              updatedAt: data.updatedAt?.toDate?.()?.toISOString().split('T')[0] || data.updatedAt || '',
              appliedAt: data.createdAt?.toDate?.()?.toISOString().split('T')[0] || '',
              paidAt: data.paidAt ? (data.paidAt?.toDate?.()?.toISOString().split('T')[0] ?? null) : null,
              piece: data.piece ?? '',
              instrument: data.instrument ?? '',
            } as ApplicationWithId
          })
          // 클라이언트 측에서 createdAt 기준 내림차순 정렬
          apps.sort((a, b) => {
            const dateA = typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : 0
            const dateB = typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : 0
            return dateB - dateA
          })
          setApplications(apps)
        }, (fallbackError) => {
          console.error('폴백 쿼리 오류:', fallbackError)
        })
        
        return fallbackUnsubscribe
      }
    })

    return unsubscribe
  }, [user])

  const handleViewDetail = (app: ApplicationWithId) => {
    setSelectedApplication(app)
    setIsDetailModalOpen(true)
  }

  if (loading) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <div className="relative min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-white" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-burgundy/5 rounded-full blur-3xl" />
          
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="font-display text-display-lg lg:text-display-xl text-foreground">
                신청 현황
              </h1>
              <div className="w-24 h-1.5 bg-accent-gold mx-auto" />
              <p className="text-xl lg:text-2xl text-muted-foreground font-light leading-relaxed">
                내가 신청한 콩쿠르 현황을 확인하세요
              </p>
            </div>
          </div>
        </section>

        {/* Applications List (소프트 삭제된 항목 제외) */}
        <section className="py-12 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {applications.filter(app => app.deleted !== true).length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-16 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-display text-foreground mb-2">
                    아직 신청한 내역이 없습니다
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    콩쿠르에 신청해보세요
                  </p>
                  <Button
                    onClick={() => navigate('/apply')}
                    className="bg-primary-burgundy hover:bg-primary-wine text-white px-8 py-6 rounded-xl font-semibold shadow-elegant hover:shadow-glow transition-all duration-300"
                  >
                    신청하러 가기
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {applications.filter(app => app.deleted !== true).map((app) => {
                    const statusInfo = statusConfig[app.status as keyof typeof statusConfig]
                    const StatusIcon = statusInfo.icon

                    return (
                      <div
                        key={app.id}
                        className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-primary-burgundy/40 transition-all duration-500 hover:shadow-elegant p-8"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                          {/* Left: Application Info */}
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start gap-4">
                              <div className={`p-3 rounded-xl border-2 ${statusInfo.color}`}>
                                <StatusIcon className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-2xl font-display text-foreground">
                                    {app.name}
                                  </h3>
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${statusInfo.color}`}>
                                    {statusInfo.label}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                  {statusInfo.description}
                                </p>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div>
                                    <div className="text-xs text-muted-foreground mb-1">참가 부문</div>
                                    <div className="font-semibold text-foreground">
                                      {app.division ? divisionMap[app.division] : '-'}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-muted-foreground mb-1">연령대</div>
                                    <div className="font-semibold text-foreground">
                                      {app.category ? categoryMap[app.category] : '-'}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-muted-foreground mb-1">연주곡</div>
                                    <div className="font-semibold text-foreground truncate">
                                      {app.piece || app.instrument || '-'}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-muted-foreground mb-1">신청일</div>
                                    <div className="font-semibold text-foreground">
                                      {app.appliedAt || '-'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right: Action Button */}
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              onClick={() => handleViewDetail(app)}
                              className="border-2 rounded-xl px-6 py-3"
                            >
                              상세 보기
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* 상세보기 / 수정 모달 (신청 폼과 동일, 데이터 연동 + 수정 가능) */}
      <ApplicationEditModal
        application={selectedApplication ? { ...selectedApplication, id: selectedApplication.id } : null}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
      />
    </>
  )
}
