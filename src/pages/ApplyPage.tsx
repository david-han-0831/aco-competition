import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  signOut,
  User as FirebaseUser
} from 'firebase/auth'
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc, query, where, updateDoc, Timestamp, onSnapshot, getDocs } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { applicationSchema, type ApplicationFormData } from '@/utils/validators'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Label } from '@/components/ui/label'
import { Music2, LogIn, LogOut, AlertCircle } from 'lucide-react'
import SuccessModal from '@/components/ui/SuccessModal'

const googleProvider = new GoogleAuthProvider()

export default function ApplyPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [existingApplication, setExistingApplication] = useState<any>(null)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  })

  const division = watch('division')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // 기존 신청서 확인
  useEffect(() => {
    if (!user) {
      setExistingApplication(null)
      setIsEditMode(false)
      return
    }

    const applicationsRef = collection(db, 'applications')
    const userApplicationsQuery = query(
      applicationsRef,
      where('userId', '==', user.uid)
    )
    
    const unsubscribe = onSnapshot(userApplicationsQuery, (snapshot) => {
      if (!snapshot.empty) {
        const existingApp = snapshot.docs[0]
        const appData = existingApp.data()
        setExistingApplication({
          id: existingApp.id,
          ...appData
        })
        
        // 폼에 기존 데이터 채우기
        setValue('name', appData.name || '')
        setValue('age', appData.age || '')
        setValue('gender', appData.gender || 'male')
        setValue('phone', appData.phone || '')
        setValue('division', appData.division || 'piano')
        setValue('category', appData.category || 'elementary')
        setValue('instrument', appData.instrument || '')
        setValue('piece', appData.piece || appData.instrument || '')
        
        setIsEditMode(true)
      } else {
        setExistingApplication(null)
        setIsEditMode(false)
      }
    }, (error) => {
      console.error('기존 신청서 확인 오류:', error)
    })

    return unsubscribe
  }, [user, setValue])

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      // Firestore에 사용자 정보 저장 (없으면 생성)
      // 권한 오류가 발생할 수 있으므로 try-catch로 감싸서 로그인은 진행되도록 함
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
        // Firestore 권한 오류는 로그만 남기고 로그인은 계속 진행
        console.warn('사용자 정보 저장 실패 (권한 문제일 수 있음):', firestoreError)
        // Firestore Rules가 설정되지 않았을 수 있으므로 경고만 표시
        if (firestoreError.code === 'permission-denied') {
          console.warn('Firestore Security Rules를 확인해주세요. 사용자 문서 생성 권한이 필요합니다.')
        }
      }
    } catch (error: any) {
      console.error('구글 로그인 오류:', error)
      if (error.code === 'auth/popup-closed-by-user') {
        // 사용자가 팝업을 닫은 경우
        return
      }
      alert(`로그인에 실패했습니다: ${error.message || '알 수 없는 오류'}`)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      reset()
      setExistingApplication(null)
      setIsEditMode(false)
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }

  const onSubmit = async (data: ApplicationFormData) => {
    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }

    // 중복 신청 확인
    if (existingApplication && !isEditMode) {
      setShowDuplicateModal(true)
      return
    }

    setSubmitting(true)
    try {
      if (existingApplication && isEditMode) {
        // 기존 신청서 수정
        const appRef = doc(db, 'applications', existingApplication.id)
        await updateDoc(appRef, {
          name: data.name,
          age: data.age,
          gender: data.gender,
          phone: data.phone,
          division: data.division,
          category: data.category,
          instrument: data.instrument || '',
          piece: data.piece || '',
          updatedAt: serverTimestamp(),
        })
      } else {
        // 새 신청서 생성
        const docRef = await addDoc(collection(db, 'applications'), {
          userId: user.uid,
          email: user.email,
          name: data.name,
          age: data.age,
          gender: data.gender,
          phone: data.phone,
          division: data.division,
          category: data.category,
          instrument: data.instrument || '',
          piece: data.piece || '',
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })

        // Vercel 서버리스 함수로 Slack 알림 전송 (비동기, 실패해도 신청은 완료)
        fetch('/api/slack/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'new_application',
            data: {
              id: docRef.id,
              name: data.name,
              phone: data.phone,
              email: user.email || '',
              division: data.division,
              category: data.category,
              instrument: data.instrument || '',
              piece: data.piece || '',
            },
          }),
        }).catch((error) => {
          console.error('Slack 알림 전송 실패:', error)
        })
      }

      reset()
      setShowSuccessModal(true)
    } catch (error) {
      console.error('신청서 제출 오류:', error)
      alert('신청서 제출에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditExisting = () => {
    setShowDuplicateModal(false)
    setIsEditMode(true)
  }

  const handleSuccessConfirm = () => {
    navigate('/mypage')
  }

  if (loading) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-white">
      <section className="py-48 relative">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl lg:text-6xl font-display text-foreground mb-4">
                {isEditMode ? '신청서 수정' : '콩쿠르 신청'}
              </h1>
              <div className="w-20 h-1 bg-accent-gold mx-auto mb-6" />
              <p className="text-xl text-muted-foreground">
                {isEditMode ? '신청서를 수정할 수 있습니다' : '음악을 사랑하는 모든 이에게 열린 무대'}
              </p>
              {isEditMode && existingApplication && (
                <div className="mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-800">
                    현재 상태: <span className="font-semibold">
                      {existingApplication.status === 'pending' ? '신청완료' :
                       existingApplication.status === 'paid' ? '입금완료' :
                       existingApplication.status === 'cancelled' ? '취소' :
                       existingApplication.status === 'refunded' ? '환불' : '알 수 없음'}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Login Section */}
            {!user ? (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 mb-8">
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-primary-burgundy/10 rounded-full flex items-center justify-center mx-auto">
                    <LogIn className="w-8 h-8 text-primary-burgundy" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display text-foreground mb-2">
                      로그인이 필요합니다
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      구글 계정으로 로그인하여 신청을 진행해주세요
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleGoogleSignIn}
                    className="bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 px-8 py-6 text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    구글로 로그인
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* User Info */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-burgundy/10 rounded-full flex items-center justify-center">
                      <Music2 className="w-6 h-6 text-primary-burgundy" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{user.displayName || '사용자'}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="border-2 hover:bg-gray-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </Button>
                </div>

                {/* Application Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border-2 border-gray-200 p-10 space-y-8">
                  {/* 개인 정보 */}
                  <div className="space-y-6">
                    <h2 className="text-2xl font-display text-foreground border-b-2 border-gray-200 pb-3">
                      개인 정보
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="mb-2 block">
                          이름 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          {...register('name')}
                          placeholder="이름을 입력하세요"
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="age" className="mb-2 block">
                          나이 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="age"
                          type="number"
                          {...register('age', { valueAsNumber: true })}
                          placeholder="나이를 입력하세요"
                          className={errors.age ? 'border-red-500' : ''}
                        />
                        {errors.age && (
                          <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="gender" className="mb-2 block">
                          성별 <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          id="gender"
                          {...register('gender')}
                          options={[
                            { value: 'male', label: '남성' },
                            { value: 'female', label: '여성' },
                          ]}
                          error={errors.gender?.message}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="mb-2 block">
                          연락처 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          {...register('phone')}
                          placeholder="연락처를 입력하세요 (예: 010-1234-5678)"
                          className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 참가 정보 */}
                  <div className="space-y-6">
                    <h2 className="text-2xl font-display text-foreground border-b-2 border-gray-200 pb-3">
                      참가 정보
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="category" className="mb-2 block">
                          연령대 <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          id="category"
                          {...register('category')}
                          options={[
                            { value: 'elementary', label: '초등부' },
                            { value: 'middle', label: '중등부' },
                            { value: 'high', label: '고등부' },
                            { value: 'adult', label: '성인' },
                          ]}
                          error={errors.category?.message}
                        />
                      </div>

                      <div>
                        <Label htmlFor="division" className="mb-2 block">
                          참가 부문 <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          id="division"
                          {...register('division')}
                          options={[
                            { value: 'piano', label: '피아노' },
                            { value: 'orchestra', label: '관현악' },
                            { value: 'vocal', label: '성악' },
                          ]}
                          error={errors.division?.message}
                        />
                      </div>
                    </div>

                    {/* 악기 필드 */}
                    <div>
                      <Label htmlFor="instrument" className="mb-2 block">
                        악기 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="instrument"
                        {...register('instrument')}
                        placeholder={
                          division === 'piano' 
                            ? '악기를 입력하세요 (예: 피아노)' 
                            : division === 'vocal' 
                            ? '악기를 입력하세요 (예: 성악)' 
                            : division === 'orchestra'
                            ? '악기를 입력하세요 (예: 바이올린, 첼로, 플루트)'
                            : '악기를 입력하세요'
                        }
                        className={errors.instrument ? 'border-red-500' : ''}
                      />
                      {errors.instrument && (
                        <p className="mt-1 text-sm text-red-600">{errors.instrument.message}</p>
                      )}
                    </div>

                    {/* 연주곡 필드 */}
                    <div>
                      <Label htmlFor="piece" className="mb-2 block">
                        연주곡 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="piece"
                        {...register('piece')}
                        placeholder={
                          division === 'piano' 
                            ? '연주곡을 입력하세요 (예: 쇼팽 녹턴 Op.9 No.2)' 
                            : division === 'vocal' 
                            ? '연주곡을 입력하세요 (예: 아베마리아)' 
                            : division === 'orchestra'
                            ? '연주곡을 입력하세요 (예: 비발디 사계 중 봄)'
                            : '연주곡을 입력하세요'
                        }
                        className={errors.piece ? 'border-red-500' : ''}
                      />
                      {errors.piece && (
                        <p className="mt-1 text-sm text-red-600">{errors.piece.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitting}
                      className="w-full bg-primary-burgundy hover:bg-primary-wine text-white px-8 py-6 text-base font-semibold rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300"
                    >
                      {submitting ? '제출 중...' : '신청서 제출하기'}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Success Modal */}
      <SuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        title={isEditMode ? "수정 완료" : "신청 완료"}
        message={isEditMode ? "신청서가 수정되었습니다." : "신청이 완료되었습니다. 입금 확인 후 최종 확정됩니다."}
        onConfirm={handleSuccessConfirm}
        confirmText="신청 현황 보기"
      />

      {/* Duplicate Application Modal */}
      {showDuplicateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-amber-600" />
                </div>
              </div>
              <h3 className="text-2xl font-display text-foreground">
                이미 신청하셨습니다
              </h3>
              <p className="text-lg text-muted-foreground">
                기존 신청서가 있습니다. 수정하시겠습니까?
              </p>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDuplicateModal(false)
                    navigate('/mypage')
                  }}
                  className="flex-1 border-2 rounded-xl"
                >
                  신청 현황 보기
                </Button>
                <Button
                  onClick={handleEditExisting}
                  className="flex-1 bg-primary-burgundy hover:bg-primary-wine text-white rounded-xl font-semibold shadow-elegant hover:shadow-glow transition-all duration-300"
                >
                  수정하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
