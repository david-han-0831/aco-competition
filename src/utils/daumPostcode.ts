/**
 * 다음(카카오) 우편번호 서비스 API
 * @see https://postcode.map.daum.net/guide
 */

const DAUM_POSTCODE_SCRIPT = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'

export interface DaumPostcodeData {
  zonecode: string
  roadAddress: string
  jibunAddress: string
  userSelectedType: 'R' | 'J'
  buildingName?: string
  address?: string
}

export type DaumPostcodeCallback = (data: DaumPostcodeData) => void

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void
        width?: number
        height?: number
        theme?: Record<string, string>
      }) => { open: (options?: { q?: string; popupTitle?: string }) => void }
    }
  }
}

function loadScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('window undefined'))
  if (window.daum?.Postcode) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src*="postcode.v2.js"]`)
    if (existing) {
      if (window.daum?.Postcode) return resolve()
      const check = setInterval(() => {
        if (window.daum?.Postcode) {
          clearInterval(check)
          resolve()
        }
      }, 50)
      return
    }

    const script = document.createElement('script')
    script.src = `https:${DAUM_POSTCODE_SCRIPT}`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Daum Postcode script load failed'))
    document.head.appendChild(script)
  })
}

/**
 * 다음 우편번호 검색 팝업을 띄우고, 주소 선택 시 콜백을 호출합니다.
 * 우편번호(zonecode), 도로명/지번 주소를 전달합니다.
 */
export function openDaumPostcode(onComplete: DaumPostcodeCallback): void {
  loadScript()
    .then(() => {
      if (!window.daum?.Postcode) {
        throw new Error('Daum Postcode not available')
      }
      new window.daum.Postcode({
        oncomplete(data: DaumPostcodeData) {
          onComplete(data)
        },
      }).open()
    })
    .catch((err) => {
      console.error('Daum Postcode open error:', err)
      alert('우편번호 검색을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
    })
}
