interface SlackMessage {
  text?: string
  blocks?: any[]
}

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

// 신청서 알림 메시지 포맷팅
export function formatApplicationNotification(application: {
  name: string
  phone?: string
  email?: string
  division: string
  category: string
  instrument?: string
  piece?: string
  createdAt?: any
}) {
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

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '알 수 없음'
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString('ko-KR')
    }
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString('ko-KR')
    }
    return new Date(timestamp).toLocaleString('ko-KR')
  }

  return {
    text: `🎵 새로운 콩쿠르 신청이 접수되었습니다!`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🎵 새로운 콩쿠르 신청',
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*이름:*\n${application.name}`,
          },
          {
            type: 'mrkdwn',
            text: `*연락처:*\n${application.phone || '미입력'}`,
          },
          {
            type: 'mrkdwn',
            text: `*이메일:*\n${application.email || '미입력'}`,
          },
          {
            type: 'mrkdwn',
            text: `*참가 부문:*\n${divisionMap[application.division] || application.division}`,
          },
          {
            type: 'mrkdwn',
            text: `*연령대:*\n${categoryMap[application.category] || application.category}`,
          },
          {
            type: 'mrkdwn',
            text: `*악기:*\n${application.instrument || '미입력'}`,
          },
          {
            type: 'mrkdwn',
            text: `*연주곡:*\n${application.piece || '미입력'}`,
          },
          {
            type: 'mrkdwn',
            text: `*신청 일시:*\n${formatDate(application.createdAt)}`,
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: '어드민 페이지에서 확인하세요: <http://localhost:3000/admin|관리자 페이지>',
          },
        ],
      },
    ],
  }
}
