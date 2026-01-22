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
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw
} from 'lucide-react'

interface Application {
  id: string
  name: string
  email?: string
  phone?: string
  category?: string
  division?: string
  piece?: string
  instrument?: string
  age?: number
  gender?: string
  status: string
  appliedAt?: string
  paidAt?: string | null
  refundedAt?: string | null
}

const divisionMap: Record<string, string> = {
  piano: '피아노',
  vocal: '성악',
  orchestra: '관현악',
  children_song: '동요',
}

const categoryMap: Record<string, string> = {
  elementary: '초등부',
  middle: '중등부',
  high: '고등부',
  adult: '성인',
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
    color: 'text-amber-600 bg-amber-50 border-amber-200' 
  },
  paid: { 
    label: '입금완료', 
    icon: CheckCircle,
    color: 'text-green-600 bg-green-50 border-green-200' 
  },
  cancelled: { 
    label: '취소', 
    icon: XCircle,
    color: 'text-gray-600 bg-gray-50 border-gray-200' 
  },
  refunded: { 
    label: '환불', 
    icon: RotateCcw,
    color: 'text-red-600 bg-red-50 border-red-200' 
  },
}

export default function ApplicationDetailModal({
  application,
  open,
  onOpenChange,
  onStatusChange,
}: ApplicationDetailModalProps) {
  if (!application) return null

  const statusInfo = statusConfig[application.status as keyof typeof statusConfig]
  const StatusIcon = statusInfo.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">
            신청 상세 정보
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl border-2 ${statusInfo.color}`}>
                <StatusIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">신청 상태</div>
                <div className="text-lg font-semibold">{statusInfo.label}</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              신청일: {application.appliedAt}
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-primary-burgundy" />
              개인 정보
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-muted-foreground mb-1">이름</div>
                <div className="font-semibold text-foreground">{application.name}</div>
              </div>
              {application.email && (
                <div className="p-4 bg-gray-50 rounded-xl col-span-2">
                  <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    이메일
                  </div>
                  <div className="font-semibold text-foreground">{application.email}</div>
                </div>
              )}
              {application.phone && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    연락처
                  </div>
                  <div className="font-semibold text-foreground">{application.phone}</div>
                </div>
              )}
            </div>
          </div>

          {/* Performance Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Music className="w-5 h-5 text-primary-burgundy" />
              연주 정보
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary-burgundy/5 rounded-xl border-2 border-primary-burgundy/10">
                <div className="text-sm text-muted-foreground mb-1">참가 부문</div>
                <div className="text-xl font-display font-semibold text-primary-burgundy">
                  {application.division ? divisionMap[application.division] : application.category || '-'}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-muted-foreground mb-1">연령대</div>
                <div className="font-semibold text-foreground">
                  {application.category ? categoryMap[application.category] : '-'}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl col-span-2">
                <div className="text-sm text-muted-foreground mb-1">연주곡 / 악기</div>
                <div className="font-semibold text-foreground">{application.piece || application.instrument || '-'}</div>
              </div>
              {application.age && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-muted-foreground mb-1">나이</div>
                  <div className="font-semibold text-foreground">{application.age}세</div>
                </div>
              )}
              {application.gender && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-muted-foreground mb-1">성별</div>
                  <div className="font-semibold text-foreground">{application.gender === 'male' ? '남성' : '여성'}</div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-burgundy" />
              입금 정보
            </h3>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">참가비</span>
                <span className="text-2xl font-display font-bold text-foreground">
                  100,000<span className="text-lg">원</span>
                </span>
              </div>
              {application.status === 'refunded' ? (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <RotateCcw className="w-4 h-4" />
                  환불 처리됨
                  {application.paidAt && (
                    <span className="text-xs opacity-80">(입금일: {application.paidAt})</span>
                  )}
                </div>
              ) : application.paidAt ? (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  입금 완료: {application.paidAt}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-amber-600">
                  <Clock className="w-4 h-4" />
                  입금 대기 중
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {onStatusChange && (
            <div className="flex gap-3 pt-4 border-t">
              {application.status === 'pending' && (
                <>
                  <Button
                    onClick={() => {
                      onStatusChange(application.id, 'paid')
                      onOpenChange(false)
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-6"
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
                    className="flex-1 border-2 rounded-xl py-6"
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
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-6"
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
                    className="flex-1 border-2 rounded-xl py-6"
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
                  className="flex-1 bg-primary-burgundy hover:bg-primary-wine text-white rounded-xl py-6"
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
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-6"
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
