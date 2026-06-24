---
name: server-architecture
description: Next.js의 서버 레이어(데이터 저장·외부 API·비밀키가 필요한 코드)를 어떻게 구조화할지. API 라우트·서버액션을 만들거나 저장 로직을 짤 때 참조. 도메인별 모듈 + 레이어(인터페이스/애플리케이션/도메인/인프라) + 포트&어댑터. product-lab의 Hexagonal + Modular Monolith를 비개발자용으로 증류.
---

# server-architecture — 잘 자라는 서버 구조

서버 코드(저장·외부연동·비밀키)는 금방 엉킨다. 처음부터 **레이어와 의존 방향**을 잡아두면, 기능이 늘어도 무너지지 않고, 저장 방식도 갈아끼울 수 있다.

## 폴더 구조

```
app/
  api/<리소스>/route.ts     # 인터페이스: HTTP 입출구 (얇게)
  <페이지>/actions.ts       # 인터페이스: 서버 액션 (얇게)
server/                     # 서버 전용 (클라이언트는 절대 import 안 함)
  <도메인>/                 # 비즈니스 관심사 하나 = 폴더 하나 (note, todo, expense…)
    <도메인>.model.ts        # 도메인: 순수 타입 + 규칙 (DB·프레임워크 모름)
    <도메인>.repo.ts         # 포트: "저장"의 인터페이스
    <도메인>.repo.memory.ts  # 인프라 어댑터: 메모리 (기본, 데모)
    <도메인>.repo.prisma.ts  # 인프라 어댑터: Prisma (실제 저장이 필요할 때)
    <도메인>.service.ts      # 애플리케이션: 유스케이스 (포트에만 의존)
    index.ts                 # 배럴: 이 도메인의 공개 API
  shared/                   # 공통(db 클라이언트, 에러 등)
```

이 저장소에 **`server/note` 예시**가 들어 있다. 그대로 따라 새 도메인을 만든다.

## 의존 방향 (한 방향으로만)

```
route/action (인터페이스)
      │  호출
      ▼
service (애플리케이션) ──의존──▶ model (도메인, 순수)
      │  의존
      ▼
repo 포트(인터페이스)  ◀──구현── repo.memory / repo.prisma (인프라)
```

- **도메인(model)** 은 아무것도 import 안 한다(순수). 그래서 테스트가 쉽다.
- **서비스**는 model + 포트에만 의존한다. DB를 직접 모른다.
- **인프라(repo 어댑터)** 가 포트를 구현한다(메모리/Prisma).
- **라우트/액션**은 얇게: 입력 파싱 → 서비스 호출 → 응답. 로직 금지.
- 다른 도메인을 쓸 땐 그 도메인의 **`index.ts`(배럴)만** import 한다. 내부 파일 딥 임포트 금지.

## 핵심: 포트 & 어댑터 = "잘 자라는" 비결

저장 방식을 **포트(인터페이스)** 뒤에 숨겼기 때문에, 비즈니스 로직을 바꾸지 않고 저장소를 교체할 수 있다.

1차에는 메모리 어댑터로 빠르게 → 진짜 저장이 필요해지면 **Prisma 어댑터**만 추가하고 `index.ts` 한 줄 교체:

```ts
// server/note/note.repo.prisma.ts
import "server-only";
import type { NoteRepo } from "./note.repo";
import { db } from "@/server/shared/db"; // Prisma Client

export const prismaNoteRepo: NoteRepo = {
  async list() { return db.note.findMany({ orderBy: { createdAt: "desc" } }); },
  async add(note) { await db.note.create({ data: note }); },
};
```
```ts
// server/note/index.ts — 한 줄만 교체
export const noteService = createNoteService(prismaNoteRepo);
```
Prisma 도입: `pnpm add -D prisma && pnpm add @prisma/client` → `npx prisma init` → 스키마 작성 → `npx prisma migrate dev`. (product-lab도 Prisma 사용)

## 경계 강제 (결정적)

- 모든 `server/**` 파일 맨 위에 **`import "server-only";`** 를 둔다. 클라이언트가 실수로 import하면 **빌드가 깨진다**(비밀키 유출 방지).
- 비밀키는 코드에 박지 말고 `.env.local` → `process.env`로 (서버에서만). 커밋 금지.
- 더 단단히 하려면 `eslint-plugin-boundaries`로 레이어 방향을 룰로 강제(심화, product-lab 방식).

## 서버 vs 클라이언트, 언제?
- 비밀키 사용/외부 API 호출/DB 접근/숨겨야 할 로직 → **서버**(`app/api/.../route.ts` 또는 서버액션 + `server/`).
- 단순 화면 상호작용 → 클라이언트 컴포넌트로 충분.

## 새 서버 기능 만들 때 순서
1. `server/<도메인>/model.ts` 에 타입+규칙
2. `repo.ts`(포트) → `repo.memory.ts`(어댑터)
3. `service.ts`(유스케이스) → `index.ts`(배럴 배선)
4. `app/api/.../route.ts` 에서 배럴 호출 (얇게)
5. `/verify` 로 초록불 확인

## 테스트가 쉬운 이유 (이 구조의 보상)
- `model`(순수 규칙)과 `service`(포트에만 의존)는 **DB 없이 단위 테스트**할 수 있다.
- 포트(repo)를 가짜로 주입해 서비스 유스케이스를 검증한다. 예시: `server/note/note.service.test.ts`.
- 테스트는 검증 게이트의 일부다(`/verify`, 커밋 게이트). 자세히는 `testing` 스킬.

## 경계는 ESLint로도 강제 (보강)
- `@/server/*/*` 딥임포트 금지 → 도메인은 **배럴만** 노출.
- 부모 상대경로(`../`) 금지 → `@/` 별칭.
- 더 강하게는 `eslint-plugin-boundaries`로 레이어 방향까지 룰로 강제(심화, product-lab 방식).

## 이 저장소의 DB (중요)
- **기본 제공 어댑터는 Supabase**(무료 플랜)다: `server/note/note.repo.supabase.ts` + `server/supabase` 클라이언트 + `supabase/schema.sql`.
- DB를 붙이는 절차는 **`database` 스킬**을 따른다 (프로젝트 생성 → 테이블 → env → 어댑터 한 줄 교체).
- 위 "포트 & 어댑터"의 Prisma 코드는 **ORM을 원할 때의 대안**이다. 기본 경로는 Supabase.
