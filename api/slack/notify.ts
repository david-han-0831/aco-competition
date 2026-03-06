import type { VercelRequest, VercelResponse } from '@vercel/node'

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

/** 클라이언트에서 전달하는 payload (Firestore payload + id, createdAt) */
interface NotifyPayload {
  type: 'new_application' | 'payment_confirmed'
  data: {
    id: string
    name: string
    phone?: string
    email?: string
    guardianPhone?: string
    zipcode?: string
    address?: string
    addressDetail?: string
    schoolGrade?: string
    division: string
    category: string
    isMajor?: string
    piece?: string
    instrument?: string
    depositorName?: string
    applicationType?: 'online' | 'offline'
    hasAccompanist?: boolean
    needAccompanistRequest?: boolean
    accompanistName?: string
    accompanistPhone?: string
    createdAt?: string
  }
}

function formatCreatedAt(isoString?: string): string {
  if (!isoString) return new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
  try {
    return new Date(isoString).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
  } catch {
    return new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
  }
}

const DIVISION_LABELS: Record<string, string> = {
  piano: '피아노',
  vocal: '성악',
  orchestra: '관현악',
  children_song: '동요',
  vocal_children: '성악/동요',
}

const CATEGORY_LABELS: Record<string, string> = {
  elementary: '초등부',
  middle: '중등부',
  high: '고등부',
  adult: '성인',
  elementary_middle: '유/초등부',
  middle_high: '중/고등부',
  university_general: '대학/일반부',
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const payload = req.body as NotifyPayload

    if (!SLACK_WEBHOOK_URL) {
      console.error('SLACK_WEBHOOK_URL is not set')
      return res.status(500).json({ error: 'Slack webhook URL not configured' })
    }

    let message = ''

    if (payload?.type === 'new_application' && payload?.data) {
      const d = payload.data
      const divisionLabel = DIVISION_LABELS[d.division] ?? d.division
      const categoryLabel = CATEGORY_LABELS[d.category] ?? d.category
      const fullAddress = [d.zipcode, d.address, d.addressDetail].filter(Boolean).join(' ')
      const isMajorLabel = d.isMajor === 'major' ? '전공' : d.isMajor === 'non_major' ? '비전공' : d.isMajor ?? '-'
      const applicationTypeLabel = d.applicationType === 'offline' ? '오프라인' : '온라인'
      const hasAccompanistLabel = d.hasAccompanist === true ? '예' : d.hasAccompanist === false ? '아니오' : '-'
      const needAccompanistLabel = d.needAccompanistRequest === true ? '예 (연락 필요)' : '아니오'

      message = `
🎵 *신청 접수 알림*

• 이름: ${d.name}
• 이메일: ${d.email ?? '미입력'}
• 참가자 연락처: ${d.phone ?? '미입력'}
• 보호자 연락처: ${d.guardianPhone ?? '미입력'}
• 주소: ${fullAddress || '미입력'}
• 참가부: ${categoryLabel}
• 참가부문: ${divisionLabel}
• 소속(학교/학년): ${d.schoolGrade ?? '미입력'}
• 전공여부: ${isMajorLabel}
• 연주곡: ${d.piece ?? '미입력'}
• 악기: ${d.instrument ?? '-'}
• 입금자성명: ${d.depositorName ?? '미입력'}
• 신청 방법: ${applicationTypeLabel}
• 반주자 동반: ${hasAccompanistLabel}
• 반주자 신청 희망: ${needAccompanistLabel}
• 반주자: ${d.accompanistName ?? '-'}${d.accompanistPhone ? ` / ${d.accompanistPhone}` : ''}

• 신청일: ${formatCreatedAt(d.createdAt)}
• 문서 ID: ${d.id}

관리자 페이지에서 확인하기
      `.trim()
    }

    if (!message) {
      return res.status(400).json({ error: 'Invalid payload or unsupported type' })
    }

    const slackRes = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    })

    if (!slackRes.ok) {
      console.error('Slack webhook error:', slackRes.status, await slackRes.text())
      return res.status(502).json({ error: 'Slack delivery failed' })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Slack notification error:', error)
    return res.status(500).json({ error: 'Failed to send notification' })
  }
}
