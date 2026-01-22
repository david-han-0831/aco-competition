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

// Application Schema
export const applicationSchema = z.object({
  name: z.string().min(2, '이름을 입력하세요'),
  age: z.number().min(5, '나이는 최소 5세 이상이어야 합니다').max(100, '올바른 나이를 입력하세요'),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: '성별을 선택하세요' }),
  }),
  phone: z.string().min(10, '연락처를 입력하세요').regex(/^[0-9-]+$/, '올바른 연락처 형식이 아닙니다'),
  division: z.enum(['piano', 'vocal', 'orchestra', 'children_song'], {
    errorMap: () => ({ message: '부문을 선택하세요' }),
  }),
  category: z.enum(['elementary', 'middle', 'high', 'adult'], {
    errorMap: () => ({ message: '연령대를 선택하세요' }),
  }),
  instrument: z.string().optional(),
  piece: z.string().optional(),
}).superRefine((data, ctx) => {
  // 모든 부문에서 악기와 연주곡 모두 필수
  if (!data.instrument || data.instrument.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '악기를 입력하세요',
      path: ['instrument'],
    })
  }
  if (!data.piece || data.piece.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '연주곡을 입력하세요',
      path: ['piece'],
    })
  }
})

export type SignupFormData = z.infer<typeof signupSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ApplicationFormData = z.infer<typeof applicationSchema>
