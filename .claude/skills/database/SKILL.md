---
name: database
description: 데이터 영속 저장이 필요할 때 Supabase(무료 플랜)로 DB를 붙이는 가이드. "저장이 안 남아요", "새로고침하면 사라져요", "DB 연결", "Supabase", "회원/글/기록 저장" 같은 요청 시 사용. 포트&어댑터 구조라 메모리→Supabase 전환이 한 줄이다.
---

# database — Supabase로 진짜 저장 붙이기

기본 템플릿은 **메모리 어댑터**라 새로고침/배포하면 데이터가 사라진다. 영속 저장이 필요하면 **Supabase(무료 플랜)** 를 붙인다.
구조가 포트&어댑터라 **비즈니스 로직은 그대로**, 어댑터만 바꾸면 된다.

## 1. Supabase 프로젝트 만들기 (무료)
1. supabase.com 가입 → New project (무료 플랜).
2. Project Settings → **API** 에서 두 값 복사: `Project URL`, `service_role` 키.

## 2. 테이블 만들기
- 대시보드 → **SQL Editor** → `supabase/schema.sql` 내용을 붙여넣고 Run.
- (새 도메인이면 그 도메인용 테이블 SQL을 같은 방식으로 추가)

## 3. 환경변수 설정
- `.env.example` 을 복사해 **`.env.local`** 을 만들고 값을 채운다:
  ```
  SUPABASE_URL=https://<ref>.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=<service_role 키>
  ```
- ⚠️ `service_role` 키는 **비밀**이다. 서버에서만 쓰며(`server/supabase` 는 `server-only`), 절대 클라이언트/깃에 노출하지 않는다. `.env.local` 은 이미 깃에서 제외돼 있다.

## 4. 어댑터 갈아끼우기 (한 줄)
`server/note/index.ts` 에서:
```ts
// import { supabaseNoteRepo } from "./note.repo.supabase";  // 주석 해제
export const noteService = createNoteService(supabaseNoteRepo); // memory → supabase
```
→ `/verify` 로 초록불 확인 → `/ship`.

## 5. 배포(Vercel)에도 환경변수 넣기
- Vercel 프로젝트 → Settings → Environment Variables 에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` 추가 → 재배포.

## 새 도메인에 DB 붙이기 (일반화)
1. `supabase/schema.sql` 에 그 도메인 테이블 추가 → SQL Editor 실행.
2. `server/<도메인>/<도메인>.repo.supabase.ts` 에 어댑터 작성(`getSupabase()` 사용, `@/server/supabase`).
3. `index.ts` 배선을 supabase 어댑터로 교체.
- 저장 방식을 바꿔도 `model`/`service`/라우트는 건드리지 않는다. (포트&어댑터의 보상)

## ORM을 원하면 (심화)
Prisma도 가능하다(product-lab 방식). `note.repo.prisma.ts` 어댑터를 추가하고 Supabase의 Postgres 연결 문자열(pooled `DATABASE_URL` + 마이그레이션용 `DIRECT_URL`)을 쓰면 된다. 단 `prisma generate`(엔진 생성)가 필요하다.
