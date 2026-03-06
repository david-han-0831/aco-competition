import { UseFormRegister, Control, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Label } from '@/components/ui/label'
import { Controller } from 'react-hook-form'
import { Search } from 'lucide-react'
import { openDaumPostcode } from '@/utils/daumPostcode'
import { categoryOptions, divisionOptions } from '@/utils/validators'
import { COMPETITION_INFO } from '@/utils/constants'
import type { ApplicationFormData } from '@/utils/validators'

export interface ApplicationFormProps {
  register: UseFormRegister<ApplicationFormData>
  control: Control<ApplicationFormData>
  errors: FieldErrors<ApplicationFormData>
  watch: UseFormWatch<ApplicationFormData>
  setValue: UseFormSetValue<ApplicationFormData>
  submitLabel?: string
  submitting?: boolean
}

export default function ApplicationForm({
  register,
  control,
  errors,
  watch,
  setValue,
  submitLabel = '신청서 제출하기',
  submitting = false,
}: ApplicationFormProps) {
  const division = watch('division')
  const category = watch('category')
  const hasAccompanist = watch('hasAccompanist')

  return (
    <div className="space-y-8">
      {/* 개인 정보 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-display text-foreground border-b-2 border-primary-burgundy/20 pb-3">
          개인 정보
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name" className="mb-2 block">이름 <span className="text-red-500">*</span></Label>
            <Input id="name" {...register('name')} placeholder="성명을 정확히 입력해주세요" className={errors.name ? 'border-red-500' : ''} />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email" className="mb-2 block">이메일 <span className="text-red-500">*</span></Label>
            <Input id="email" type="email" {...register('email')} placeholder="example@email.com" className={errors.email ? 'border-red-500' : ''} />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="phone" className="mb-2 block">참가자 연락처 <span className="text-red-500">*</span></Label>
            <Input id="phone" {...register('phone')} placeholder="010-1234-5678" className={errors.phone ? 'border-red-500' : ''} />
            <p className="mt-1 text-xs text-muted-foreground">접수·입금 후 24시간 이내 접수완료 문자가 발송됩니다.</p>
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
          </div>
          <div>
            <Label htmlFor="guardianPhone" className="mb-2 block">보호자 연락처 <span className="text-red-500">*</span></Label>
            <Input id="guardianPhone" {...register('guardianPhone')} placeholder="010-1234-5678" className={errors.guardianPhone ? 'border-red-500' : ''} />
            {errors.guardianPhone && <p className="mt-1 text-sm text-red-600">{errors.guardianPhone.message}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="mb-2 block">주소 <span className="text-red-500">*</span></Label>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4 flex gap-2">
              <Input {...register('zipcode')} placeholder="우편번호" readOnly className={errors.zipcode ? 'border-red-500' : ''} />
              <Button type="button" variant="outline" className="shrink-0 border-2" onClick={() => openDaumPostcode((data) => { setValue('zipcode', data.zonecode); const fullAddress = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress; setValue('address', fullAddress || data.roadAddress || data.jibunAddress) })}>
                <Search className="w-4 h-4 mr-1" /> 우편번호 찾기
              </Button>
            </div>
            <div className="col-span-8 flex items-center text-sm text-muted-foreground">상장 발송 시 받을 주소를 정확히 기입해 주세요.</div>
          </div>
          <Input {...register('address')} placeholder="주소 (우편번호 찾기로 검색)" readOnly className={errors.address ? 'border-red-500' : ''} />
          <Input {...register('addressDetail')} placeholder="상세주소 (동·호수 등 직접 입력)" />
          {errors.zipcode && <p className="text-sm text-red-600">{errors.zipcode.message}</p>}
          {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
        </div>
      </div>

      {/* 참가 정보 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-display text-foreground border-b-2 border-primary-burgundy/20 pb-3">참가 정보</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="category" className="mb-2 block">참가부 <span className="text-red-500">*</span></Label>
            <Select id="category" {...register('category')} options={categoryOptions.map((o) => ({ value: o.value, label: o.label }))} error={errors.category?.message} />
          </div>
          <div>
            <Label htmlFor="division" className="mb-2 block">참가부문 <span className="text-red-500">*</span></Label>
            <Select id="division" {...register('division')} options={divisionOptions.map((o) => ({ value: o.value, label: o.label }))} error={errors.division?.message} />
          </div>
        </div>
        {(division === 'orchestra' || division === 'vocal_children') && (
          <div>
            <Label htmlFor="instrument" className="mb-2 block">악기</Label>
            <Input id="instrument" {...register('instrument')} placeholder="예: 바이올린, 플루트, 성악 등" />
          </div>
        )}
        <div>
          <Label htmlFor="schoolGrade" className="mb-2 block">
            소속(학교/학년)
            {category !== 'university_general' && <span className="text-red-500"> *</span>}
            {category === 'university_general' && <span className="text-muted-foreground font-normal ml-1">(선택)</span>}
          </Label>
          <Input id="schoolGrade" {...register('schoolGrade')} placeholder={category === 'university_general' ? '일반부는 소속 기재 불필요' : '학교, 학년 반드시 기재 (학년별 구분 시상)'} className={errors.schoolGrade ? 'border-red-500' : ''} />
          {errors.schoolGrade && <p className="mt-1 text-sm text-red-600">{errors.schoolGrade.message}</p>}
        </div>
        <div>
          <Label className="mb-2 block">전공여부 <span className="text-red-500">*</span></Label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer"><input type="radio" value="major" {...register('isMajor')} className="rounded-full" /><span>전공</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="radio" value="non_major" {...register('isMajor')} className="rounded-full" /><span>비전공</span></label>
          </div>
          {errors.isMajor && <p className="mt-1 text-sm text-red-600">{errors.isMajor.message}</p>}
        </div>
        <div>
          <Label htmlFor="piece" className="mb-2 block">연주곡 <span className="text-red-500">*</span></Label>
          <Input id="piece" {...register('piece')} placeholder="자유곡 1곡 (10분 이내). 곡목을 입력하세요." className={errors.piece ? 'border-red-500' : ''} />
          <p className="mt-1 text-xs text-muted-foreground">자유곡 1곡, 10분 이내로 연주됩니다.</p>
          {errors.piece && <p className="mt-1 text-sm text-red-600">{errors.piece.message}</p>}
        </div>
        <div>
          <Label htmlFor="depositorName" className="mb-2 block">입금자성명 <span className="text-red-500">*</span></Label>
          <Input id="depositorName" {...register('depositorName')} placeholder="(참가자이름+전공) 기재 (예: 김이든바이올린)" className={errors.depositorName ? 'border-red-500' : ''} />
          {errors.depositorName && <p className="mt-1 text-sm text-red-600">{errors.depositorName.message}</p>}
        </div>
        <div className="space-y-4">
          <Label className="mb-2 block">반주자 <span className="text-red-500">*</span></Label>
          <Controller name="hasAccompanist" control={control} rules={{ required: '반주자 여부를 선택하세요' }} render={({ field }) => (
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={field.value === true} onChange={() => field.onChange(true)} className="rounded-full" /><span>반주자 있음</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={field.value === false} onChange={() => field.onChange(false)} className="rounded-full" /><span>반주자 없음</span></label>
            </div>
          )} />
          {errors.hasAccompanist && <p className="text-sm text-red-600">{errors.hasAccompanist.message}</p>}
          {hasAccompanist === true && (
            <div className="grid md:grid-cols-2 gap-6 pt-2">
              <div>
                <Label htmlFor="accompanistName" className="mb-2 block">반주자 성명 <span className="text-red-500">*</span></Label>
                <Input id="accompanistName" {...register('accompanistName')} placeholder="반주자 동반 악기는 반드시 기입" className={errors.accompanistName ? 'border-red-500' : ''} />
                {errors.accompanistName && <p className="mt-1 text-sm text-red-600">{errors.accompanistName.message}</p>}
              </div>
              <div>
                <Label htmlFor="accompanistPhone" className="mb-2 block">반주자 연락처 <span className="text-red-500">*</span></Label>
                <Input id="accompanistPhone" {...register('accompanistPhone')} placeholder="010-0000-0000" className={errors.accompanistPhone ? 'border-red-500' : ''} />
                {errors.accompanistPhone && <p className="mt-1 text-sm text-red-600">{errors.accompanistPhone.message}</p>}
              </div>
            </div>
          )}
          {hasAccompanist === false && (
            <div className="rounded-xl border-2 border-amber-200 bg-amber-50/50 p-4 space-y-3">
              <p className="text-sm text-amber-900">반주자가 없으신 경우, 대회 측 반주자 신청이 가능합니다. <strong>비용 {COMPETITION_INFO.accompanistRequestFee?.toLocaleString()}원</strong> (문의: {COMPETITION_INFO.contact.phone})</p>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" {...register('needAccompanistRequest')} className="rounded border-gray-300 text-primary-burgundy" /><span className="text-sm">반주자 신청 희망 (연락 드리겠습니다)</span></label>
            </div>
          )}
        </div>
      </div>

      {/* 개인정보 동의 */}
      <div className="space-y-4 rounded-xl border-2 border-gray-200 p-6 bg-gray-50/50">
        <h2 className="text-xl font-display text-foreground border-b border-gray-200 pb-2">개인정보 수집·이용 동의</h2>
        <p className="text-sm text-muted-foreground">수집 항목: 이름, 이메일, 참가자 연락처, 보호자 연락처, 주소, 참가부, 소속(학교/학년), 참가부문, 전공여부, 연주곡, 입금자성명, 반주자 성명, 반주자 연락처</p>
        <p className="text-sm text-muted-foreground">이용 목적: 콩쿠르 접수·진행, 참가비 정산, 상장·안내 발송, 본인 확인 및 연락</p>
        <p className="text-sm text-muted-foreground">보유·이용 기간: 접수 및 행사 목적 달성 후 지체 없이 파기</p>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" {...register('privacyConsent')} className="mt-1 rounded border-gray-300 text-primary-burgundy focus:ring-primary-burgundy" />
          <span className="text-sm">개인정보 수집·이용에 동의합니다. <span className="text-red-500">*</span></span>
        </label>
        {errors.privacyConsent && <p className="text-sm text-red-600">{errors.privacyConsent.message}</p>}
      </div>

      <div className="pt-6">
        <Button type="submit" size="lg" disabled={submitting} className="w-full bg-primary-burgundy hover:bg-primary-wine text-white px-8 py-6 text-base font-semibold rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300">
          {submitting ? '저장 중...' : submitLabel}
        </Button>
      </div>
    </div>
  )
}
