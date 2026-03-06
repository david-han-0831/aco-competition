# 안양대학교 평생교육원 음악콩쿠르 신청 시스템

2026년 제1회 안양대학교 평생교육원 음악콩쿠르의 온라인 신청 및 관리 시스템입니다.

## 📋 프로젝트 개요

- **목적**: 콩쿠르 신청 및 관리 자동화
- **대상**: 피아노, 성악, 관현악, 동요 부문 참가자
- **기능**: 회원가입, 신청, 관리자 대시보드, Slack 알림

## 🛠️ 기술 스택

- **Frontend**: Vite + React 18, TypeScript, React Router, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore)
- **Hosting**: Vercel
- **API**: Vercel Serverless Functions
- **Notification**: Slack Webhook

## 🚀 시작하기

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local.example` 파일을 복사하여 `.env.local` 파일을 생성하고 Firebase 설정값을 입력하세요.

```bash
cp .env.local.example .env.local
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

- **Slack 알림**: `npm run dev` 실행 시 슬랙 알림용 로컬 API 서버가 함께 떠서, `.env.local`의 `SLACK_WEBHOOK_URL`로 알림이 전송됩니다. (슬랙 없이 프론트만 띄우려면 `npm run dev:vite` 사용.)

### 4. 빌드

```bash
npm run build
```

### 5. 프리뷰

```bash
npm run preview
```

## 📁 프로젝트 구조

```
aco-competition/
├── src/
│   ├── pages/            # 라우트 페이지
│   ├── components/       # 재사용 컴포넌트
│   │   ├── layout/       # Header, Footer
│   │   └── ui/           # Button, Card, Input 등
│   ├── lib/              # Firebase 설정
│   ├── utils/            # 유틸리티 함수
│   ├── types/            # TypeScript 타입
│   ├── App.tsx           # 라우터 설정
│   └── main.tsx          # 엔트리 포인트
├── api/                  # Vercel Serverless Functions
│   └── slack/            # Slack 알림 API
├── docs/                 # 프로젝트 문서
├── public/               # 정적 파일
└── index.html            # HTML 템플릿
```

## 📚 문서

- [기능정의서](docs/기획문서/2026-01-20-기능정의서.md)
- [기술구현문서](docs/기획문서/2026-01-20-기술구현문서.md)

## 🔐 Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
2. Authentication 활성화 (Email/Password)
3. Firestore 데이터베이스 생성
4. 웹 앱 추가 후 설정값 복사
5. `.env.local`에 설정값 입력

## 📮 Slack 연동

1. Slack Workspace에서 Incoming Webhook 생성
2. Webhook URL을 `.env.local`의 `SLACK_WEBHOOK_URL`에 입력
3. API 엔드포인트: `/api/slack/notify`

## 🚢 배포

### Vercel 배포

1. GitHub에 코드 푸시
2. [Vercel Dashboard](https://vercel.com)에서 프로젝트 생성
3. Framework Preset: **Vite** 선택
4. 환경 변수 설정
5. 자동 배포 완료

### 환경 변수 설정 (Vercel)

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `SLACK_WEBHOOK_URL` (서버 전용)

## 📝 라이선스

이 프로젝트는 안양대학교 평생교육원의 내부 프로젝트입니다.

## 👥 개발팀

- **주최**: 안양대학교 평생교육원
- **운영**: 안양시민오케스트라
