import type { VercelRequest, VercelResponse } from '@vercel/node'

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

interface NotifyPayload {
  type: 'new_application' | 'payment_confirmed'
  data: {
    id: string
    name: string
    phone?: string
    email?: string
    division: string
    category: string
    instrument?: string
    piece?: string
  }
}

const DIVISION_LABELS: Record<string, string> = {
  piano: '피아노',
  vocal: '성악',
  orchestra: '관현악',
  children_song: '동요',
}

const CATEGORY_LABELS: Record<string, string> = {
  elementary: '초등부',
  middle: '중등부',
  high: '고등부',
  adult: '성인부',
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS 허용
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
    const payload: NotifyPayload = req.body

    if (!SLACK_WEBHOOK_URL) {
      console.error('SLACK_WEBHOOK_URL is not set')
      return res.status(500).json({ error: 'Slack webhook URL not configured' })
    }

    let message = ''

    if (payload.type === 'new_application') {
      const divisionLabel = DIVISION_LABELS[payload.data.division] || payload.data.division
      const categoryLabel = CATEGORY_LABELS[payload.data.category] || payload.data.category

      message = `
🎵 *신청 접수 알림*

• 이름: ${payload.data.name}
• 연락처: ${payload.data.phone || '미입력'}
• 이메일: ${payload.data.email || '미입력'}
• 부문: ${divisionLabel} - ${categoryLabel}
• 악기: ${payload.data.instrument || '미입력'}
• 연주곡: ${payload.data.piece || '미입력'}
• 신청일: ${new Date().toLocaleString('ko-KR')}
• ID: ${payload.data.id}

관리자 페이지에서 확인하기
      `.trim()
    }

    await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Slack notification error:', error)
    return res.status(500).json({ error: 'Failed to send notification' })
  }
}
