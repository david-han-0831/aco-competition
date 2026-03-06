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
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc, query, where, updateDoc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { applicationSchema, type ApplicationFormData } from '@/utils/validators'
import { mapExistingToForm, buildFirestorePayload } from '@/utils/applicationForm'
import { Button } from '@/components/ui/button'
import { Music2, LogIn, LogOut, AlertCircle, FileDown, Phone } from 'lucide-react'
import SuccessModal from '@/components/ui/SuccessModal'
import { APPLICATION_DEADLINE, OFFLINE_APPLICATION, COMPETITION_INFO } from '@/utils/constants'
import ApplicationForm from '@/components/application/ApplicationForm'

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
  /** 로그아웃 상태에서 온라인/오프라인 선택 (2026-02-28) */
  const [applicationChoice, setApplicationChoice] = useState<'online' | 'offline' | null>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      privacyConsent: false,
      hasAccompanist: false,
    },
  })

  const division = watch('division')
  const category = watch('category')
  const hasAccompanist = watch('hasAccompanist')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
      if (u?.email) setValue('email', u.email)
    })
    return unsubscribe
  }, [setValue])

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

    const unsubscribe = onSnapshot(
      userApplicationsQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const existingApp = snapshot.docs[0]
          const appData = existingApp.data()
          setExistingApplication({ id: existingApp.id, ...appData })
          const mapped = mapExistingToForm(appData)
          Object.entries(mapped).forEach(([key, value]) => {
            if (value !== undefined && value !== '') setValue(key as keyof ApplicationFormData, value)
          })
          if (appData.email) setValue('email', appData.email)
          setIsEditMode(true)
        } else {
          setExistingApplication(null)
          setIsEditMode(false)
        }
      },
      (error) => console.error('기존 신청서 확인 오류:', error)
    )
    return unsubscribe
  }, [user, setValue])

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user
      try {
        const userRef = doc(db, 'users', firebaseUser.uid)
        const userSnap = await getDoc(userRef)
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || '',
            role: 'user',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        }
      } catch (e: any) {
        if (e?.code === 'permission-denied') console.warn('Firestore 사용자 문서 권한 확인 필요')
      }
      setValue('email', firebaseUser.email || '')
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user') return
      alert(`로그인에 실패했습니다: ${error?.message || '알 수 없는 오류'}`)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      reset()
      setExistingApplication(null)
      setIsEditMode(false)
      setApplicationChoice(null)
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }

  const onSubmit = async (data: ApplicationFormData) => {
    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }
    if (existingApplication && !isEditMode) {
      setShowDuplicateModal(true)
      return
    }

    setSubmitting(true)
    try {
      const payload = buildFirestorePayload(data)

      if (existingApplication && isEditMode) {
        await updateDoc(doc(db, 'applications', existingApplication.id), {
          ...payload,
          updatedAt: serverTimestamp(),
        })
      } else {
        const docRef = await addDoc(collection(db, 'applications'), {
          userId: user.uid,
          ...payload,
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
        fetch('/api/slack/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'new_application',
            data: {
              id: docRef.id,
              ...payload,
              createdAt: new Date().toISOString(),
            },
          }),
        }).catch(() => {})
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

  // 2026-06-27 00:00 이후 신청 불가 (2026-02-28)
  if (new Date() >= APPLICATION_DEADLINE) {
    return (
      <div className="relative min-h-screen bg-white">
        <section className="py-48 relative">
          <div className="container relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-gray-500" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-display text-foreground mb-4">신청 마감</h1>
              <p className="text-lg text-muted-foreground">
                {COMPETITION_INFO.name} 접수 기간이 종료되었습니다.
                <br />
                문의사항은 {COMPETITION_INFO.contact.phone}로 연락해 주세요.
              </p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-white">
      <section className="py-48 relative">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl lg:text-6xl font-display text-foreground mb-4">
                {isEditMode ? '신청서 수정' : '콩쿠르 신청'}
              </h1>
              <div className="w-20 h-1 bg-accent-gold mx-auto mb-6" />
              <p className="text-xl text-muted-foreground">
                {isEditMode ? '신청서를 수정할 수 있습니다' : '2026년 제1회 안양시민오케스트라 전국음악콩쿠르'}
              </p>
              {isEditMode && existingApplication && (
                <div className="mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-800">
                    현재 상태:{' '}
                    <span className="font-semibold">
                      {existingApplication.status === 'pending'
                        ? '신청완료'
                        : existingApplication.status === 'paid'
                        ? '입금완료'
                        : existingApplication.status === 'cancelled'
                        ? '취소'
                        : existingApplication.status === 'refunded'
                        ? '환불'
                        : '알 수 없음'}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* 로그인 여부와 관계없이 먼저 온라인/오프라인 선택 */}
            {applicationChoice === null ? (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 mb-8">
                <div className="text-center space-y-8">
                  <h2 className="text-2xl font-display text-foreground">신청 방법 선택</h2>
                  <p className="text-muted-foreground">온라인 또는 오프라인 중 선택해 주세요.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      onClick={() => setApplicationChoice('online')}
                      className="bg-primary-burgundy hover:bg-primary-wine text-white px-8 py-6 rounded-xl font-semibold"
                    >
                      <LogIn className="w-5 h-5 mr-2 inline" />
                      온라인 신청
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setApplicationChoice('offline')}
                      className="border-2 px-8 py-6 rounded-xl font-semibold"
                    >
                      <FileDown className="w-5 h-5 mr-2 inline" />
                      오프라인 신청
                    </Button>
                  </div>
                </div>
              </div>
            ) : applicationChoice === 'offline' ? (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 mb-8">
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-display text-foreground">오프라인 신청 안내</h2>
                  <p className="text-muted-foreground">
                    신청서 양식을 다운로드하여 작성 후 제출해 주세요.
                  </p>
                  {OFFLINE_APPLICATION.formDownloadUrl ? (
                    <Button asChild size="lg" className="rounded-xl">
                      <a href={OFFLINE_APPLICATION.formDownloadUrl} download target="_blank" rel="noopener noreferrer">
                        <FileDown className="w-5 h-5 mr-2 inline" />
                        신청서 양식 다운로드
                      </a>
                    </Button>
                  ) : (
                    <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                      양식 준비 중입니다. 문의 전화로 안내받으실 수 있습니다.
                    </p>
                  )}
                  <div className="flex items-center justify-center gap-2 text-foreground font-medium">
                    <Phone className="w-5 h-5 text-primary-burgundy" />
                    <span>{OFFLINE_APPLICATION.inquiryLabel}:</span>
                    <a href={`tel:${OFFLINE_APPLICATION.inquiryPhone.replace(/-/g, '')}`} className="text-primary-burgundy hover:underline">
                      {OFFLINE_APPLICATION.inquiryPhone}
                    </a>
                  </div>
                  <Button variant="ghost" onClick={() => setApplicationChoice(null)} className="text-muted-foreground">
                    ← 다시 선택
                  </Button>
                </div>
              </div>
            ) : applicationChoice === 'online' && !user ? (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 mb-8">
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-primary-burgundy/10 rounded-full flex items-center justify-center mx-auto">
                    <LogIn className="w-8 h-8 text-primary-burgundy" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display text-foreground mb-2">로그인이 필요합니다</h2>
                    <p className="text-muted-foreground mb-6">구글 계정으로 로그인하여 온라인 신청을 진행해주세요</p>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleGoogleSignIn}
                    className="bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 px-8 py-6 text-base font-semibold rounded-xl shadow-sm"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    구글로 로그인
                  </Button>
                  <Button variant="ghost" onClick={() => setApplicationChoice(null)} className="text-muted-foreground">
                    ← 신청 방법 다시 선택
                  </Button>
                </div>
              </div>
            ) : (
              <>
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
                  <Button variant="outline" onClick={handleSignOut} className="border-2 hover:bg-gray-50">
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </Button>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="bg-white rounded-2xl border-2 border-gray-200 p-10 space-y-8"
                >
                  <ApplicationForm
                    register={register}
                    control={control}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                    submitLabel="신청서 제출하기"
                    submitting={submitting}
                  />
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <SuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        title={isEditMode ? '수정 완료' : '신청 완료'}
        message={isEditMode ? '신청서가 수정되었습니다.' : '신청이 완료되었습니다. 입금 확인 후 최종 확정됩니다.'}
        onConfirm={handleSuccessConfirm}
        confirmText="신청 현황 보기"
      />

      {showDuplicateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-amber-600" />
                </div>
              </div>
              <h3 className="text-2xl font-display text-foreground">이미 신청하셨습니다</h3>
              <p className="text-lg text-muted-foreground">기존 신청서가 있습니다. 수정하시겠습니까?</p>
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
                  className="flex-1 bg-primary-burgundy hover:bg-primary-wine text-white rounded-xl font-semibold"
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
