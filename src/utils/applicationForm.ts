import type { ApplicationFormData } from '@/utils/validators'
import { toPhoneDigits } from '@/utils/phone'

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
  return {
    name: (data.name as string) || '',
    email: (data.email as string) || '',
    phone: (data.phone as string) || '',
    guardianPhone: (data.guardianPhone as string) || '',
    zipcode: (data.zipcode as string) || '',
    address: (data.address as string) || '',
    addressDetail: (data.addressDetail as string) || '',
    category: categoryMap[data.category as string] || 'elementary_middle',
    schoolGrade: (data.schoolGrade as string) || '',
    division: divisionMap[data.division as string] || 'piano',
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

/** 신청 폼 데이터를 Firestore applications 문서용 payload로 변환 (연락처는 숫자만 저장) */
export function buildFirestorePayload(data: ApplicationFormData): Record<string, unknown> {
  return {
    name: data.name,
    email: data.email,
    phone: toPhoneDigits(data.phone),
    guardianPhone: toPhoneDigits(data.guardianPhone),
    zipcode: data.zipcode,
    address: data.address,
    addressDetail: data.addressDetail ?? '',
    category: data.category,
    schoolGrade: data.schoolGrade,
    division: data.division,
    isMajor: data.isMajor,
    piece: data.piece,
    instrument: data.division === 'piano' ? '피아노' : (data.instrument ?? ''),
    depositorName: data.depositorName,
    applicationType: 'online',
    hasAccompanist: data.hasAccompanist ?? false,
    needAccompanistRequest: data.needAccompanistRequest ?? false,
    accompanistName: data.accompanistName ?? '',
    accompanistPhone: toPhoneDigits(data.accompanistPhone ?? ''),
    privacyConsent: data.privacyConsent,
  }
}
