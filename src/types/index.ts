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

// Application Types
export type Division = 'piano' | 'vocal' | 'orchestra' | 'children_song'
export type Category = 'elementary' | 'middle' | 'high' | 'adult'
export type ApplicationStatus = 'pending' | 'paid' | 'cancelled' | 'refunded'

export interface Application {
  id: string
  userId: string
  
  // 신청자 정보
  name: string
  age: number
  gender: 'male' | 'female'
  
  // 콩쿠르 정보
  division: Division
  category: Category
  instrument?: string
  
  // 상태
  status: ApplicationStatus
  
  // 타임스탬프
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
  age: number
  gender: 'male' | 'female'
  division: Division
  category: Category
  instrument?: string
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
