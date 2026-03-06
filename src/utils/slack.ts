interface SlackMessage {
  text?: string
  blocks?: any[]
}

/** .env.local 에 VITE_SLACK_WEBHOOK_URL (Slack 웹훅 URL) 설정 필요 */
export async function sendSlackNotification(message: SlackMessage): Promise<boolean> {
  const webhookUrl = import.meta.env.VITE_SLACK_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn('Slack Webhook URL이 설정되지 않았습니다.')
    return false
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      throw new Error(`Slack API 오류: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error('Slack 알림 전송 실패:', error)
    return false
  }
}

// 신청서 알림 메시지 포맷팅 (수정된 신청폼 필드 반영)
export function formatApplicationNotification(application: {
  id?: string
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
  instrument?: string
  piece?: string
  depositorName?: string
  accompanistName?: string
  accompanistPhone?: string
  createdAt?: any
}) {
  const divisionMap: Record<string, string> = {
    piano: '피아노',
    vocal: '성악',
    orchestra: '관/현악',
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

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '알 수 없음'
    if (timestamp.toDate) return timestamp.toDate().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
    if (timestamp instanceof Date) return timestamp.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
    return new Date(timestamp).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
  }

  const fullAddress = [application.zipcode, application.address, application.addressDetail]
    .filter(Boolean)
    .join(' ')
  const isMajorLabel =
    application.isMajor === 'major' ? '전공' : application.isMajor === 'non_major' ? '비전공' : application.isMajor ?? '-'

  return {
    text: `🎵 새로운 콩쿠르 신청이 접수되었습니다! (${application.name})`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '🎵 새로운 콩쿠르 신청', emoji: true },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*이름:*\n${application.name}` },
          { type: 'mrkdwn', text: `*이메일:*\n${application.email ?? '미입력'}` },
          { type: 'mrkdwn', text: `*참가자 연락처:*\n${application.phone ?? '미입력'}` },
          { type: 'mrkdwn', text: `*보호자 연락처:*\n${application.guardianPhone ?? '미입력'}` },
          { type: 'mrkdwn', text: `*참가부:*\n${categoryMap[application.category] ?? application.category}` },
          { type: 'mrkdwn', text: `*참가부문:*\n${divisionMap[application.division] ?? application.division}` },
          { type: 'mrkdwn', text: `*소속(학교/학년):*\n${application.schoolGrade ?? '미입력'}` },
          { type: 'mrkdwn', text: `*전공여부:*\n${isMajorLabel}` },
          { type: 'mrkdwn', text: `*연주곡:*\n${application.piece ?? '미입력'}` },
          { type: 'mrkdwn', text: `*악기:*\n${application.instrument ?? '-'}` },
          { type: 'mrkdwn', text: `*입금자성명:*\n${application.depositorName ?? '미입력'}` },
          { type: 'mrkdwn', text: `*반주자:*\n${application.accompanistName ?? '-'}${application.accompanistPhone ? ` / ${application.accompanistPhone}` : ''}` },
        ],
      },
      {
        type: 'section',
        fields: [{ type: 'mrkdwn', text: `*주소:*\n${fullAddress || '미입력'}` }],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `신청일: ${formatDate(application.createdAt)}${application.id ? ` · ID: ${application.id}` : ''}`,
          },
        ],
      },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: '관리자 페이지에서 확인하세요.' },
        ],
      },
    ],
  }
}
