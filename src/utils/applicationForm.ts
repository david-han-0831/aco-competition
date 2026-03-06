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

/** Firestore에 안전하게 넣기 위해 문자열 필드는 항상 string으로 (form/저장값이 number 등일 수 있음) */
function safeStr(v: unknown): string {
  if (v == null) return ''
  if (typeof v === 'string') return v
  return String(v)
}

/** 신청 폼 데이터를 Firestore applications 문서용 payload로 변환 (연락처는 숫자만 저장, undefined 없음) */
export function buildFirestorePayload(data: ApplicationFormData): Record<string, unknown> {
  return {
    name: safeStr(data.name),
    email: safeStr(data.email),
    phone: toPhoneDigits(safeStr(data.phone)),
    guardianPhone: toPhoneDigits(safeStr(data.guardianPhone)),
    zipcode: safeStr(data.zipcode),
    address: safeStr(data.address),
    addressDetail: safeStr(data.addressDetail),
    category: safeStr(data.category) || 'elementary_middle',
    schoolGrade: safeStr(data.schoolGrade),
    division: safeStr(data.division) || 'piano',
    isMajor: safeStr(data.isMajor) || 'non_major',
    piece: safeStr(data.piece),
    instrument: data.division === 'piano' ? '피아노' : safeStr(data.instrument),
    depositorName: safeStr(data.depositorName),
    applicationType: 'online',
    hasAccompanist: data.hasAccompanist === true,
    needAccompanistRequest: data.needAccompanistRequest === true,
    accompanistName: safeStr(data.accompanistName),
    accompanistPhone: toPhoneDigits(safeStr(data.accompanistPhone)),
    privacyConsent: data.privacyConsent === true,
  }
}
