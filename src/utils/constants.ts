// Division Labels
export const DIVISION_LABELS: Record<string, string> = {
  piano: '피아노',
  vocal: '성악',
  orchestra: '관현악',
  children_song: '동요',
}

// Category Labels
export const CATEGORY_LABELS: Record<string, string> = {
  elementary: '초등부',
  middle: '중등부',
  high: '고등부',
  adult: '성인부',
}

// Status Labels
export const STATUS_LABELS: Record<string, string> = {
  pending: '결제 대기',
  paid: '결제 완료',
  cancelled: '취소',
}

// Status Colors
export const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

// Gender Labels
export const GENDER_LABELS: Record<string, string> = {
  male: '남성',
  female: '여성',
}

/** 지원 마감 (접수기간: 2026.2.1 ~ 6.26 23:59). 이 시점 이후 신청 불가 */
export const APPLICATION_DEADLINE = new Date('2026-06-27T00:00:00+09:00')

/** 오프라인 신청 안내 (양식 다운로드, 문의 전화) */
export const OFFLINE_APPLICATION = {
  /** 오프라인 신청서 양식 다운로드 URL (준비 전이면 빈 문자열 또는 안내 문구만 사용) */
  formDownloadUrl: '',
  /** 오프라인 문의 전화 */
  inquiryPhone: '010-3448-4830',
  inquiryLabel: '안내 문의',
}

// Competition Info (포스터 기준)
export const COMPETITION_INFO = {
  name: '2026년 제1회 안양대학교 평생교육원 음악콩쿠르',
  organizer: '안양대학교 평생교육원',
  host: '안양시민오케스트라',
  location: '안양대학교 문화관 4층',
  /** 대회 일시 */
  dateTime: '2026년 6월 28일(일) 오후 3시',
  participationFee: 100000,
  /** 반주자 신청 비용 (반주자 없을 때 대회 측 반주자 신청 시) */
  accompanistRequestFee: 100000,
  contact: {
    /** 접수기간 */
    period: '2026.2.1 ~ 6.26 23:59',
    participationLimit: 10,
    /** 입금계좌 (안양시민오케스트라) */
    account: '1005-704-491233',
    accountHolder: '안양시민오케스트라',
    /** 문의 전화 (Footer/Guide 등과 동일하게 사용) */
    phone: '010-3448-4830',
    email: 'contact@example.com',
  },
}
