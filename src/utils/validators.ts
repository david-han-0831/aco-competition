import { z } from 'zod'

// Signup Schema
export const signupSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
  confirmPassword: z.string(),
  displayName: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
}).refine(data => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
})

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
})

// 참가부 (포스터 기준: 유/초등부, 중/고등부, 대학/일반부)
export const categoryOptions = [
  { value: 'elementary_middle', label: '유/초등부' },
  { value: 'middle_high', label: '중/고등부' },
  { value: 'university_general', label: '대학/일반부' },
] as const

// 참가부문 (포스터 기준: 피아노, 관/현악, 성악/동요)
export const divisionOptions = [
  { value: 'piano', label: '피아노' },
  { value: 'orchestra', label: '관/현악' },
  { value: 'vocal_children', label: '성악/동요' },
] as const

// Application Schema (2026-02-19 수정, 2026-02-28 반주자/대학·일반부 반영)
export const applicationSchema = z
  .object({
    name: z.string().min(2, '이름을 입력하세요'),
    email: z.string().email('올바른 이메일 형식이 아닙니다'),
    phone: z.string().min(10, '연락처를 입력하세요').regex(/^[0-9-]+$/, '올바른 연락처 형식이 아닙니다'),
    guardianPhone: z.string().min(10, '보호자 연락처를 입력하세요').regex(/^[0-9-]+$/, '올바른 연락처 형식이 아닙니다'),
    zipcode: z.string().min(1, '우편번호를 입력하세요'),
    address: z.string().min(5, '주소를 입력하세요'),
    addressDetail: z.string().optional(),
    category: z.enum(['elementary_middle', 'middle_high', 'university_general'], {
      errorMap: () => ({ message: '참가부를 선택하세요' }),
    }),
    schoolGrade: z.string(), // 대학/일반부는 optional → superRefine에서 분기
    division: z.enum(['piano', 'orchestra', 'vocal_children'], {
      errorMap: () => ({ message: '참가부문을 선택하세요' }),
    }),
    isMajor: z.enum(['major', 'non_major'], {
      errorMap: () => ({ message: '전공 여부를 선택하세요' }),
    }),
    piece: z.string().min(1, '연주곡을 입력하세요 (자유곡 1곡, 10분 이내)'),
    instrument: z.string().optional(),
    depositorName: z.string().min(2, '입금자성명을 입력하세요 (참가자이름+전공)'),
    hasAccompanist: z.boolean({ required_error: '반주자 여부를 선택하세요' }),
    needAccompanistRequest: z.boolean().optional(),
    accompanistName: z.string().optional(),
    accompanistPhone: z.string().optional(),
    privacyConsent: z.boolean().refine((v) => v === true, {
      message: '개인정보 수집·이용에 동의해 주세요',
    }),
  })
  .superRefine((data, ctx) => {
    // 대학/일반부가 아니면 소속(학교/학년) 필수
    if (data.category !== 'university_general') {
      if (!data.schoolGrade?.trim() || data.schoolGrade.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '소속(학교/학년)을 입력하세요',
          path: ['schoolGrade'],
        })
      }
    }
    // 반주자 있음 → 성명·연락처 필수
    if (data.hasAccompanist === true) {
      if (!data.accompanistName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '반주자 성명을 입력하세요',
          path: ['accompanistName'],
        })
      }
      if (!data.accompanistPhone?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '반주자 연락처를 입력하세요',
          path: ['accompanistPhone'],
        })
      }
      if (data.accompanistPhone && !/^[0-9-]+$/.test(data.accompanistPhone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '올바른 연락처 형식이 아닙니다',
          path: ['accompanistPhone'],
        })
      }
    }
  })

export type SignupFormData = z.infer<typeof signupSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ApplicationFormData = z.infer<typeof applicationSchema>
