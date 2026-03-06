import { Timestamp } from 'firebase/firestore'

// User Types
export interface User {
  uid: string
  email: string
  displayName: string
  role: 'user' | 'admin'
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Application Types (2026-02-19 포스터/수정작업 반영 — 신청폼과 Firestore 저장 필드 일치)
export type Division = 'piano' | 'orchestra' | 'vocal_children'
export type Category = 'elementary_middle' | 'middle_high' | 'university_general'
export type ApplicationStatus = 'pending' | 'paid' | 'cancelled' | 'refunded'

/** 온라인/오프라인 신청 구분 (2026-02-28 회의) */
export type ApplicationType = 'online' | 'offline'

/** Firestore applications 컬렉션 문서 스키마 (ApplyPage 신청폼과 1:1 매핑) */
export interface Application {
  id: string
  userId: string

  name: string
  email: string
  phone: string
  guardianPhone: string
  zipcode: string
  address: string
  addressDetail: string
  schoolGrade: string
  division: Division
  category: Category
  isMajor: 'major' | 'non_major'
  piece: string
  instrument: string
  depositorName: string
  accompanistName: string
  accompanistPhone: string
  privacyConsent: boolean

  /** 온라인 신청 / 오프라인 신청 구분 (2026-02-28) */
  applicationType?: ApplicationType
  /** 반주자 동반 여부 (있으면 true, 없으면 false) */
  hasAccompanist?: boolean
  /** 반주자 없을 때 반주자 신청(유료) 희망 여부 — 연락용 (2026-02-28) */
  needAccompanistRequest?: boolean

  /** 구 문서 호환용 (폼에서는 미수집) */
  age?: number
  gender?: 'male' | 'female'

  status: ApplicationStatus
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Form Data Types
export interface SignupFormData {
  email: string
  password: string
  confirmPassword: string
  displayName: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface ApplicationFormData {
  name: string
  email: string
  phone: string
  guardianPhone: string
  zipcode: string
  address: string
  addressDetail?: string
  category: Category
  schoolGrade: string
  division: Division
  isMajor: 'major' | 'non_major'
  piece: string
  instrument?: string
  depositorName: string
  /** 반주자 동반 여부 (있음/없음) */
  hasAccompanist?: boolean
  /** 반주자 없을 때 반주자 신청(유료) 희망 — 안내용 */
  needAccompanistRequest?: boolean
  accompanistName?: string
  accompanistPhone?: string
  privacyConsent: boolean
}

// Settings
export interface Settings {
  applicationDeadline: Timestamp
  competitionDate: Timestamp
  maxApplications?: number
  isApplicationOpen: boolean
  announcements?: string[]
}

// Admin Stats
export interface AdminStats {
  totalUsers: number
  totalApplications: number
  paidApplications: number
  pendingApplications: number
  cancelledApplications: number
  refundedApplications: number
}
