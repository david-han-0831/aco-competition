import type { ApplicationFormData } from '@/utils/validators'
import { toPhoneDigits } from '@/utils/phone'

const FORM_CATEGORIES: ApplicationFormData['category'][] = ['elementary_middle', 'middle_high', 'university_general']
const FORM_DIVISIONS: ApplicationFormData['division'][] = ['piano', 'orchestra', 'vocal_children']

/** Firestore/기존 문서 데이터를 신청 폼 defaultValues로 매핑 (하위 호환) */
export function mapExistingToForm(data: Record<string, unknown>): Partial<ApplicationFormData> {
  const categoryMap: Record<string, ApplicationFormData['category']> = {
    elementary: 'elementary_middle',
    middle: 'middle_high',
    high: 'middle_high',
    adult: 'university_general',
  }
  const divisionMap: Record<string, ApplicationFormData['division']> = {
    piano: 'piano',
    vocal: 'vocal_children',
    orchestra: 'orchestra',
    children_song: 'vocal_children',
  }
  const rawCategory = data.category as string
  const rawDivision = data.division as string
  const category = FORM_CATEGORIES.includes(rawCategory as ApplicationFormData['category'])
    ? (rawCategory as ApplicationFormData['category'])
    : (categoryMap[rawCategory] || 'elementary_middle')
  const division = FORM_DIVISIONS.includes(rawDivision as ApplicationFormData['division'])
    ? (rawDivision as ApplicationFormData['division'])
    : (divisionMap[rawDivision] || 'piano')

  return {
    name: (data.name as string) || '',
    email: (data.email as string) || '',
    phone: (data.phone as string) || '',
    guardianPhone: (data.guardianPhone as string) || '',
    zipcode: (data.zipcode as string) || '',
    address: (data.address as string) || '',
    addressDetail: (data.addressDetail as string) || '',
    category,
    schoolGrade: (data.schoolGrade as string) || '',
    division,
    isMajor: (data.isMajor as ApplicationFormData['isMajor']) || 'non_major',
    piece: (data.piece as string) || '',
    instrument: (data.instrument as string) || '',
    depositorName: (data.depositorName as string) || '',
    hasAccompanist: (data.hasAccompanist as boolean) ?? false,
    needAccompanistRequest: (data.needAccompanistRequest as boolean) ?? false,
    accompanistName: (data.accompanistName as string) || '',
    accompanistPhone: (data.accompanistPhone as string) || '',
    privacyConsent: true,
  }
}

/** 신청 폼 데이터를 Firestore applications 문서용 payload로 변환 (연락처는 숫자만 저장, undefined 없음) */
export function buildFirestorePayload(data: ApplicationFormData): Record<string, unknown> {
  return {
    name: data.name ?? '',
    email: data.email ?? '',
    phone: toPhoneDigits(data.phone ?? ''),
    guardianPhone: toPhoneDigits(data.guardianPhone ?? ''),
    zipcode: data.zipcode ?? '',
    address: data.address ?? '',
    addressDetail: data.addressDetail ?? '',
    category: data.category ?? 'elementary_middle',
    schoolGrade: data.schoolGrade ?? '',
    division: data.division ?? 'piano',
    isMajor: data.isMajor ?? 'non_major',
    piece: data.piece ?? '',
    instrument: data.division === 'piano' ? '피아노' : (data.instrument ?? ''),
    depositorName: data.depositorName ?? '',
    applicationType: 'online',
    hasAccompanist: data.hasAccompanist ?? false,
    needAccompanistRequest: data.needAccompanistRequest ?? false,
    accompanistName: data.accompanistName ?? '',
    accompanistPhone: toPhoneDigits(data.accompanistPhone ?? ''),
    privacyConsent: data.privacyConsent ?? false,
  }
}
