# 어드민 권한 설정 가이드

## 문제
어드민 페이지에서 상태 변경(입금 확인, 신청 취소) 시 권한 오류가 발생합니다.

## 원인
Firestore Security Rules의 `isAdmin()` 함수가 `users` 컬렉션에서 사용자 정보를 읽어 `role`이 `'admin'`인지 확인하는데, 현재 로그인한 사용자가 `users` 컬렉션에 없거나 `role` 필드가 없을 수 있습니다.

## 해결 방법

### 방법 1: 어드민 사용자 설정 (권장)

Firebase Console에서 어드민 권한 부여:

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택
3. **Firestore Database** → **Data** 탭
4. `users` 컬렉션 찾기 (없으면 생성)
5. 문서 ID를 현재 로그인한 사용자의 UID로 설정
6. 다음 필드 추가:
   ```json
   {
     "uid": "사용자_UID",
     "email": "사용자_이메일",
     "displayName": "관리자",
     "role": "admin",
     "createdAt": "2026-01-22T00:00:00Z",
     "updatedAt": "2026-01-22T00:00:00Z"
   }
   ```

### 방법 2: 코드로 어드민 권한 부여

브라우저 콘솔에서 실행:

```javascript
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './lib/firebase'

// 현재 로그인한 사용자를 어드민으로 설정
const user = auth.currentUser
if (user) {
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || '관리자',
    role: 'admin',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true })
  console.log('어드민 권한이 부여되었습니다!')
}
```

또는 React 컴포넌트에서:

```tsx
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

// 임시: 어드민 권한 부여 함수
const grantAdminRole = async () => {
  const user = auth.currentUser
  if (user) {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '관리자',
        role: 'admin',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true })
      console.log('어드민 권한이 부여되었습니다!')
    } catch (error) {
      console.error('어드민 권한 부여 실패:', error)
    }
  }
}
```

### 방법 3: 개발용 임시 규칙 (보안 주의)

개발 단계에서만 사용하고, 프로덕션에서는 반드시 `isAdmin()` 체크를 사용하세요.

`firestore.rules`에서:
```javascript
// 개발용: 인증된 사용자 모두 update 가능
allow update, delete: if isAuthenticated();

// 프로덕션용: 관리자만 가능
// allow update, delete: if isAdmin();
```

## 확인 방법

1. Firebase Console → Firestore → Data
2. `users` 컬렉션에서 현재 사용자 UID로 문서 확인
3. `role` 필드가 `"admin"`인지 확인

## 보안 주의사항

- **프로덕션 환경에서는 반드시 `isAdmin()` 체크를 사용하세요**
- 개발용 임시 규칙은 배포 전에 제거하세요
- 어드민 권한은 신중하게 부여하세요
