# AI Agent Coding Starter

비개발자가 **AI로 웹 서비스를 만들어 배포**하고, **그 이후에도 자기 제품을 잘 키워가기 위한 장기 하네스**입니다.
AI 코딩 원데이 클래스용으로 설계되었지만, 수업이 끝난 뒤 혼자 쓰기에도 그대로 좋습니다.

> 핵심 철학: **"똑똑한 프롬프트가 아니라 가드레일."**
> 결과물이 무너지지 않게, 검증을 사람이 아니라 구조로 강제합니다.

---

## 기술 스택
**pnpm** · Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · ESLint 9 · **Vitest** · Husky · **Supabase**(DB, 무료 플랜) · Vercel 배포.
저장은 1차 **메모리**(영속 X) → 필요해지면 **Supabase 무료 플랜** 어댑터로 한 줄 교체.

## 무엇이 들어 있나 (설계)

```
ai-agent-coding-starter/
├── .claude/
│   ├── CLAUDE.md          # AI 작업 규칙 (황금 규칙 + 의사결정 프레임)
│   ├── settings.json      # 훅: 변경 후 /verify 리마인드
│   └── skills/
│       ├── interview/ impl/ verify/ review/ ship/ help/   # 만들기 흐름
│       ├── architecture/            # 구조·저장·설계 의사결정
│       ├── server-architecture/     # 서버 레이어(포트&어댑터)
│       ├── database/                # Supabase(무료 플랜) DB 붙이기
│       ├── testing/                 # Vitest 테스트
│       ├── conventions/             # 코드 규칙 (ESLint 강제)
│       └── ui-design/               # 화면 품질
├── .husky/pre-commit      # 게이트: 타입·린트·테스트 깨지면 커밋 차단
├── eslint.config.mjs      # let·딥임포트·상대경로 금지 (product-lab 참고)
├── vitest.config.ts       # 테스트 설정 (server-only 스텁, @/ 별칭)
├── .env.example           # Supabase 연결 (복사 → .env.local)
├── supabase/schema.sql    # Supabase SQL Editor에 붙여 테이블 생성
├── spec/                  # 무엇을 만들지 (spec.md)
├── app/
│   └── api/notes/route.ts # 서버 인터페이스 예시 (얇게)
├── server/                # 서버 전용 (클라이언트는 import 안 함)
│   ├── note/              # 도메인 예시: model·repo(포트)·repo.memory/repo.supabase(어댑터)·service·index(배럴) + *.test.ts
│   ├── supabase/          # Supabase 클라이언트 (server-only)
│   └── shared/            # 공통(에러 등) + 배럴
└── package.json
```

### 서버 아키텍처 (product-lab의 Hexagonal을 증류)
서버 코드는 도메인별로 레이어로 나눕니다: **인터페이스(라우트)** → **애플리케이션(service)** → **도메인(model, 순수)**, **인프라(repo 어댑터)** 가 **포트(repo 인터페이스)** 를 구현.
덕분에 **저장 방식을 메모리 → Supabase로 갈아끼워도 비즈니스 로직은 그대로**입니다. `model`·`service`가 순수해서 **테스트도 쉽습니다**. 자세히는 `server-architecture`·`database`·`testing` 스킬과 `server/note` 예시.

### 4층 결정적 강제
1. **커밋 게이트**(`.husky/pre-commit`) — 타입·린트·**테스트** 통과 못하면 커밋 불가
2. **`/verify` 루프** — 타입·린트·테스트·빌드를 초록불 될 때까지 스스로 반복
3. **ESLint 규칙** — `let`/딥임포트/상대경로 금지
4. **Vercel 배포** — 빌드 깨지면 배포 자체가 실패
(+ `server-only`: 서버 코드가 클라이언트로 새면 빌드 실패)

---

## 처음 한 번 (세팅)
필요한 것: **Node.js 20+**, **pnpm**, **Claude Code (Pro 이상 / Max 권장)**, GitHub·Vercel·(선택)Supabase 계정.

```bash
corepack enable
pnpm install             # 의존성 + husky 게이트
pnpm dev                 # http://localhost:3000
pnpm verify              # 타입·린트·테스트·빌드 한 번에
# Claude Code에서 먼저:  /help
```

### 데이터 저장(Supabase, 선택)
기본은 메모리라 새로고침하면 사라집니다. 영속 저장은 **`database` 스킬**을 따르세요:
`supabase/schema.sql` 실행 → `.env.example` 복사해 `.env.local` 채우기 → `server/note/index.ts` 어댑터 한 줄 교체.

### 배포 연결 (한 번만)
1. GitHub 저장소로 올린다 → 2. [vercel.com](https://vercel.com)에서 Import (pnpm 자동 감지) → 3. 이후 `git push` 마다 자동 배포.
(Supabase를 쓰면 Vercel 환경변수에 `SUPABASE_URL`·`SUPABASE_SERVICE_ROLE_KEY` 추가)

---

## 어떻게 쓰나 (표준 흐름)
1. **/interview** → 2. **/impl**(architecture·server-architecture·database·conventions·ui-design·testing + /verify) → 3. **/review** → 4. **/ship**

## 집에서 혼자 이어가기
- `CLAUDE.md`의 **황금 규칙**·**생각 규칙**을 읽어보세요.
- `.claude/skills/`의 각 `SKILL.md`가 워크플로우의 정체입니다. `architecture` → `server-architecture` → `database` → `testing` 순으로.
- 같은 문제가 반복되면 **재현 테스트**를 남겨 다시는 안 터지게.
