---
date: 2024-01-01
category: bug
source: auto/impl
---

# .env.local 누락 시 빌드는 되지만 런타임에 터진다

## 상황
Supabase 환경변수(`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)를 `.env.local`에 넣지 않고 `pnpm dev`를 실행했더니 빌드는 성공했지만, 페이지 접근 시 "Invalid URL" 런타임 에러 발생.

## 배움
Next.js는 빌드 시점에 환경변수가 없어도 에러를 내지 않는다. `NEXT_PUBLIC_` 변수는 빌드 시 인라인되므로 undefined가 문자열로 들어가고, 서버 전용 변수는 런타임에야 터진다.

## 다음에는
- `.env.example`을 복사해서 `.env.local`을 먼저 만든다
- Supabase 클라이언트 생성 시 URL이 비어있으면 명확한 에러 메시지를 던지도록 방어 코드를 넣는다
