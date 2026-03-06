import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  User,
  Mail,
  Phone,
  Music,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  FileText,
  CreditCard,
  UserPlus,
} from 'lucide-react'
import { formatPhoneDisplay } from '@/utils/phone'

interface Application {
  id: string
  name: string
  email?: string
  phone?: string
  guardianPhone?: string
  zipcode?: string
  address?: string
  addressDetail?: string
  category?: string
  schoolGrade?: string
  division?: string
  isMajor?: string
  piece?: string
  instrument?: string
  depositorName?: string
  accompanistName?: string
  accompanistPhone?: string
  hasAccompanist?: boolean
  needAccompanistRequest?: boolean
  applicationType?: 'online' | 'offline'
  privacyConsent?: boolean
  age?: number
  gender?: string
  status: string
  appliedAt?: string
  paidAt?: string | null
  refundedAt?: string | null
  createdAt?: string
  updatedAt?: string
}

const divisionMap: Record<string, string> = {
  piano: '피아노',
  vocal: '성악',
  orchestra: '관현악',
  children_song: '동요',
  vocal_children: '성악/동요',
}

const categoryMap: Record<string, string> = {
  elementary: '초등부',
  middle: '중등부',
  high: '고등부',
  adult: '성인',
  elementary_middle: '유/초등부',
  middle_high: '중/고등부',
  university_general: '대학/일반부',
}

interface ApplicationDetailModalProps {
  application: Application | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange?: (id: string, newStatus: string) => void
}

const statusConfig = {
  pending: {
    label: '신청완료',
    icon: Clock,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  paid: {
    label: '입금완료',
    icon: CheckCircle,
    color: 'text-green-600 bg-green-50 border-green-200',
  },
  cancelled: {
    label: '취소',
    icon: XCircle,
    color: 'text-gray-600 bg-gray-50 border-gray-200',
  },
  refunded: {
    label: '환불',
    icon: RotateCcw,
    color: 'text-red-600 bg-red-50 border-red-200',
  },
}

function FieldRow({
  label,
  value,
  icon: Icon,
  fullWidth,
}: {
  label: string
  value: string | number | boolean | undefined | null
  icon?: React.ComponentType<{ className?: string }>
  fullWidth?: boolean
}) {
  const display =
    value === true
      ? '예'
      : value === false
        ? '아니오'
        : value !== undefined && value !== null && String(value).trim()
          ? String(value)
          : '—'
  return (
    <div
      className={`p-3 bg-gray-50 rounded-lg ${fullWidth ? 'col-span-2' : ''}`}
    >
      <div className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </div>
      <div className="font-medium text-foreground break-words">{display}</div>
    </div>
  )
}

export default function ApplicationDetailModal({
  application,
  open,
  onOpenChange,
  onStatusChange,
}: ApplicationDetailModalProps) {
  if (!application) return null

  const statusInfo =
    statusConfig[application.status as keyof typeof statusConfig] ??
    statusConfig.pending
  const StatusIcon = statusInfo.icon

  const fullAddress = [
    application.zipcode,
    application.address,
    application.addressDetail,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">
            신청 상세 정보
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 상태 & 신청일 */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl border-2 ${statusInfo.color}`}
              >
                <StatusIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">신청 상태</div>
                <div className="text-lg font-semibold">{statusInfo.label}</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-0.5 text-right">
              <div>신청일: {application.appliedAt || application.createdAt || '—'}</div>
              {application.updatedAt && application.updatedAt !== application.appliedAt && (
                <div>수정일: {application.updatedAt}</div>
              )}
            </div>
          </div>

          {/* 개인 정보 */}
          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary-burgundy" />
              개인 정보
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FieldRow label="이름" value={application.name} icon={User} />
              <FieldRow label="이메일" value={application.email} icon={Mail} />
              <FieldRow label="참가자 연락처" value={formatPhoneDisplay(application.phone)} icon={Phone} />
              <FieldRow label="보호자 연락처" value={formatPhoneDisplay(application.guardianPhone)} icon={Phone} />
            </div>
          </section>

          {/* 주소 */}
          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-burgundy" />
              주소
            </h3>
            <FieldRow
              label="우편번호 · 주소 · 상세주소"
              value={fullAddress || undefined}
              fullWidth
            />
          </section>

          {/* 신청 구분 */}
          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-burgundy" />
              신청 구분
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FieldRow
                label="신청 방법"
                value={
                  application.applicationType === 'offline'
                    ? '오프라인'
                    : application.applicationType === 'online'
                      ? '온라인'
                      : application.applicationType
                }
              />
            </div>
          </section>

          {/* 참가 · 연주 정보 */}
          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Music className="w-4 h-4 text-primary-burgundy" />
              참가 · 연주 정보
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FieldRow
                label="참가 부문"
                value={
                  application.division
                    ? divisionMap[application.division] ?? application.division
                    : undefined
                }
              />
              <FieldRow
                label="참가부"
                value={
                  application.category
                    ? categoryMap[application.category] ?? application.category
                    : undefined
                }
              />
              <FieldRow label="소속(학교/학년)" value={application.schoolGrade} />
              <FieldRow
                label="전공 여부"
                value={
                  application.isMajor === 'major'
                    ? '전공'
                    : application.isMajor === 'non_major'
                      ? '비전공'
                      : application.isMajor
                }
              />
              <FieldRow label="연주곡" value={application.piece} fullWidth />
              <FieldRow label="악기" value={application.instrument} />
            </div>
          </section>

          {/* 반주자 정보 */}
          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-primary-burgundy" />
              반주자 정보
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FieldRow
                label="반주자 동반"
                value={
                  application.hasAccompanist === true
                    ? '예'
                    : application.hasAccompanist === false
                      ? '아니오'
                      : application.hasAccompanist
                }
              />
              {application.needAccompanistRequest && (
                <div className="p-3 rounded-lg col-span-2 bg-amber-50 border border-amber-200">
                  <div className="text-xs text-muted-foreground mb-0.5">
                    반주자 신청 희망
                  </div>
                  <div className="font-medium text-amber-800">예 (연락 필요)</div>
                </div>
              )}
              <FieldRow label="반주자 성명" value={application.accompanistName} />
              <FieldRow label="반주자 연락처" value={formatPhoneDisplay(application.accompanistPhone)} />
            </div>
          </section>

          {/* 입금 정보 */}
          <section className="space-y-3">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary-burgundy" />
              입금 정보
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FieldRow label="입금자 성명" value={application.depositorName} />
              <div className="p-3 bg-gray-50 rounded-lg flex flex-col justify-between">
                <div className="text-xs text-muted-foreground mb-0.5">
                  참가비
                </div>
                <div className="font-semibold text-foreground">
                  100,000<span className="text-sm font-normal text-muted-foreground">원</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg col-span-2 flex flex-wrap items-center gap-4">
                {application.status === 'refunded' ? (
                  <>
                    <span className="flex items-center gap-1.5 text-red-600 font-medium">
                      <RotateCcw className="w-4 h-4" />
                      환불 처리됨
                    </span>
                    {application.paidAt && (
                      <span className="text-sm text-muted-foreground">
                        입금일: {application.paidAt}
                      </span>
                    )}
                    {application.refundedAt && (
                      <span className="text-sm text-muted-foreground">
                        환불일: {application.refundedAt}
                      </span>
                    )}
                  </>
                ) : application.paidAt ? (
                  <span className="flex items-center gap-1.5 text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    입금 완료 ({application.paidAt})
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                    <Clock className="w-4 h-4" />
                    입금 대기 중
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* 기타 (구 문서 호환) */}
          {(application.age != null || application.gender) && (
            <section className="space-y-3">
              <h3 className="text-base font-semibold text-foreground">
                기타
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {application.age != null && (
                  <FieldRow label="나이" value={`${application.age}세`} />
                )}
                {application.gender && (
                  <FieldRow
                    label="성별"
                    value={
                      application.gender === 'male'
                        ? '남성'
                        : application.gender === 'female'
                          ? '여성'
                          : application.gender
                    }
                  />
                )}
              </div>
            </section>
          )}

          {/* 액션 버튼 */}
          {onStatusChange && (
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              {application.status === 'pending' && (
                <>
                  <Button
                    onClick={() => {
                      onStatusChange(application.id, 'paid')
                      onOpenChange(false)
                    }}
                    className="flex-1 min-w-[140px] bg-green-600 hover:bg-green-700 text-white rounded-xl py-6"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    입금 확인 완료
                  </Button>
                  <Button
                    onClick={() => {
                      onStatusChange(application.id, 'cancelled')
                      onOpenChange(false)
                    }}
                    variant="outline"
                    className="flex-1 min-w-[140px] border-2 rounded-xl py-6"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    신청 취소
                  </Button>
                </>
              )}
              {application.status === 'paid' && (
                <>
                  <Button
                    onClick={() => {
                      onStatusChange(application.id, 'refunded')
                      onOpenChange(false)
                    }}
                    className="flex-1 min-w-[140px] bg-red-600 hover:bg-red-700 text-white rounded-xl py-6"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    환불 처리
                  </Button>
                  <Button
                    onClick={() => {
                      onStatusChange(application.id, 'cancelled')
                      onOpenChange(false)
                    }}
                    variant="outline"
                    className="flex-1 min-w-[140px] border-2 rounded-xl py-6"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    신청 취소로 변경
                  </Button>
                </>
              )}
              {application.status === 'cancelled' && (
                <Button
                  onClick={() => {
                    onStatusChange(application.id, 'pending')
                    onOpenChange(false)
                  }}
                  className="flex-1 min-w-[140px] bg-primary-burgundy hover:bg-primary-wine text-white rounded-xl py-6"
                >
                  신청 복구
                </Button>
              )}
              {application.status === 'refunded' && (
                <Button
                  onClick={() => {
                    onStatusChange(application.id, 'paid')
                    onOpenChange(false)
                  }}
                  className="flex-1 min-w-[140px] bg-green-600 hover:bg-green-700 text-white rounded-xl py-6"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  입금 확인으로 복구
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
