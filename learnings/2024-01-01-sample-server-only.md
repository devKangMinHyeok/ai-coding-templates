---
date: 2024-01-01
category: pattern
source: auto/impl
---

# server-only import를 빠뜨리면 비밀키가 클라이언트 번들에 들어간다

## 상황
`server/` 폴더의 서비스 파일에서 `import "server-only";`를 빼먹고 클라이언트 컴포넌트에서 import했더니, 빌드가 성공하면서 `SUPABASE_SERVICE_ROLE_KEY`가 클라이언트 번들에 포함됨.

## 배움
Next.js의 `server-only` 패키지는 해당 모듈이 클라이언트에서 import되면 빌드를 실패시키는 가드레일이다. 이게 없으면 서버 전용 코드가 조용히 클라이언트로 새어나간다.

## 다음에는
`server/` 폴더의 모든 `.ts` 파일 첫 줄에 `import "server-only";`를 반드시 넣는다. ESLint 커스텀 룰이나 pre-commit 훅으로 자동 검사하면 더 좋다.
