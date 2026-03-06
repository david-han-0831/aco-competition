/**
 * 연락처 저장: 숫자만 저장 (01012345678)
 * 화면 표시: 하이픈 포맷 (010-1234-5678)
 */

/** 입력값에서 숫자만 추출 (저장용) */
export function toPhoneDigits(value: string | undefined | null): string {
  if (value == null || typeof value !== 'string') return ''
  return value.replace(/\D/g, '')
}

/**
 * 화면 표시용 포맷 (010-1234-5678)
 * - 11자리 010: 010-XXXX-XXXX
 * - 10자리: 0XX-XXX-XXXX
 * - 그 외: 숫자만 있으면 적절히 분리, 없으면 원문 반환
 */
export function formatPhoneDisplay(value: string | undefined | null): string {
  if (value == null || typeof value !== 'string') return '—'
  const digits = value.replace(/\D/g, '')
  if (digits.length === 0) return '—'
  if (digits.length === 11 && digits.startsWith('010')) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  if (digits.length >= 9) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }
  return value.trim() || '—'
}
