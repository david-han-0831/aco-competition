import { APPLICATION_DEADLINE } from './constants'

/** 접수 기간 내 여부 (2026-06-26 23:59 KST까지) */
export function isApplicationOpen(now = new Date()): boolean {
  return now < APPLICATION_DEADLINE
}

export const APPLICATION_CLOSED_MESSAGE =
  '접수 기간이 종료되어 신청 및 수정이 불가합니다.'
