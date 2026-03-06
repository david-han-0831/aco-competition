import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { applicationSchema, type ApplicationFormData } from '@/utils/validators'
import { mapExistingToForm, buildFirestorePayload } from '@/utils/applicationForm'
import { formatPhoneDisplay } from '@/utils/phone'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ApplicationForm from './ApplicationForm'

export interface ApplicationEditModalProps {
  application: Record<string, unknown> | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function ApplicationEditModal({
  application,
  open,
  onOpenChange,
  onSuccess,
}: ApplicationEditModalProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      privacyConsent: false,
      hasAccompanist: false,
    },
  })

  useEffect(() => {
    if (open && application) {
      const mapped = mapExistingToForm(application)
      reset({
        name: mapped.name ?? '',
        email: mapped.email ?? '',
        phone: (mapped.phone?.trim() ? formatPhoneDisplay(mapped.phone) : '') || (mapped.phone ?? ''),
        guardianPhone: (mapped.guardianPhone?.trim() ? formatPhoneDisplay(mapped.guardianPhone) : '') || (mapped.guardianPhone ?? ''),
        zipcode: mapped.zipcode ?? '',
        address: mapped.address ?? '',
        addressDetail: mapped.addressDetail ?? '',
        category: mapped.category ?? 'elementary_middle',
        schoolGrade: mapped.schoolGrade ?? '',
        division: mapped.division ?? 'piano',
        isMajor: mapped.isMajor ?? 'non_major',
        piece: mapped.piece ?? '',
        instrument: mapped.instrument ?? '',
        depositorName: mapped.depositorName ?? '',
        hasAccompanist: mapped.hasAccompanist ?? false,
        needAccompanistRequest: mapped.needAccompanistRequest ?? false,
        accompanistName: mapped.accompanistName ?? '',
        accompanistPhone: (mapped.accompanistPhone?.trim() ? formatPhoneDisplay(mapped.accompanistPhone) : '') || (mapped.accompanistPhone ?? ''),
        privacyConsent: true,
      })
    }
  }, [open, application, reset])

  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (data: ApplicationFormData) => {
    const docId = application && (application.id as string)
    if (!docId) return
    setSubmitting(true)
    try {
      const payload = buildFirestorePayload(data)
      const updateData: Record<string, unknown> = {
        ...payload,
        updatedAt: serverTimestamp(),
      }
      // Firestore는 undefined 값을 허용하지 않으므로 제거
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) delete updateData[key]
      })
      await updateDoc(doc(db, 'applications', docId), updateData)
      onOpenChange(false)
      onSuccess?.()
    } catch (e) {
      console.error('신청서 수정 오류:', e)
      alert('수정에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!application) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">신청 상세 / 수정</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="py-4">
          <ApplicationForm
            register={register}
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            submitLabel="수정 완료"
            submitting={submitting}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}
