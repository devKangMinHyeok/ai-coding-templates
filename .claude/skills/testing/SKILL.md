---
name: testing
description: Vitest로 테스트를 작성하는 가이드. 순수 로직(도메인 model, 서비스)을 만들거나 고칠 때 테스트도 함께 쓴다. 버그를 고치면 재현 테스트를 남긴다. 테스트는 검증 게이트의 일부다(/verify와 커밋 게이트가 실행).
---

# testing — 같은 버그를 두 번 겪지 않게

테스트는 "결정적 검증"의 한 축이다. 한 번 통과시켜 두면, 다음에 깨질 때 기계가 잡아준다.

## 무엇을 테스트하나 (쉬운 것부터)
- **도메인 규칙**: `model`의 검증 함수 같은 순수 함수 (입력→출력만 보면 됨).
- **서비스 유스케이스**: 포트(repo)를 **가짜로 주입**해, 저장 없이 로직만 검증.
- UI·외부연동은 뒤로 미뤄도 된다. 순수한 곳부터.

## 어떻게
- 대상 파일 **옆에** `*.test.ts` (co-located). 예: `note.model.test.ts`.
- `import { describe, it, expect } from "vitest";`
- 포트는 가짜 구현으로 주입:
  ```ts
  function fakeRepo(): NoteRepo { /* 메모리 배열 */ }
  const service = createNoteService(fakeRepo());
  ```
- 실행: `pnpm test` (또는 `/verify`가 자동 실행, 커밋 게이트도 실행).

## 버그를 고칠 때 (회귀 방지)
1. 먼저 그 버그를 **재현하는 테스트**를 쓴다(빨강).
2. 고쳐서 통과시킨다(초록).
3. 이제 그 버그는 다시 터지면 즉시 잡힌다. (= "같은 문제 두 번 안 겪기")

## 메모
- `server/**`의 `import "server-only"`는 테스트에서 빈 모듈로 자동 대체된다(`vitest.config.ts`). 신경 쓸 필요 없다.
- product-lab은 서버 코드에 테스트를 **필수**로 둔다(없으면 커밋 차단). 우리도 같은 방향이다.
