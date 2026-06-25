# AI Agent Coding Starter

비개발자가 **AI로 웹 서비스를 만들어 배포**하고, **그 이후에도 자기 제품을 잘 키워가기 위한 장기 하네스**입니다.
AI 코딩 원데이 클래스용으로 설계되었지만, 수업이 끝난 뒤 혼자 쓰기에도 그대로 좋습니다.

> **핵심 철학: "똑똑한 프롬프트가 아니라 가드레일."**
> 결과물이 무너지지 않게, 검증을 사람이 아니라 구조로 강제합니다.

---

## 기술 스택

**pnpm** · Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · ESLint 9 · **Vitest** · Husky · **Supabase**(DB, 무료 플랜) · Vercel 배포

저장은 1차 **메모리**(영속 X) → 필요해지면 **Supabase 무료 플랜** 어댑터로 한 줄 교체.

---

## 빠른 시작

**필요한 것:** Node.js 20+, pnpm, Claude Code (Pro 이상 / Max 권장), GitHub·Vercel·(선택)Supabase 계정

```bash
corepack enable
pnpm install             # 의존성 + husky 게이트
pnpm dev                 # http://localhost:3000
```

Claude Code에서:

```
/init                    # 환경 정리 + 사용법 소개 + 프로젝트 방향 잡기
```

`/init`이 샘플 데이터 정리 → 환경 소개 → `/interview`(미션 설정)까지 한 번에 이어줍니다.

---

## 표준 워크플로우

```
/interview  →  /spec  →  /impl  →  /review  →  /ship
  방향 잡기    기능 구체화   구현      점검       배포
```

| 커맨드 | 설명 |
|---|---|
| `/init` | 템플릿 초기화 + 환경 소개 + 인터뷰 시작 (처음 한 번) |
| `/interview` | 프로젝트 방향(미션) 잡기 |
| `/spec` | 만들 기능 구체화 — 리뷰 프로필도 참조하여 빠진 관점 보완 |
| `/impl` | 스펙대로 구현 (단계별 자동 검증) |
| `/verify` | 타입·린트·테스트·빌드 검증 |
| `/review` | 전문가 관점 점검 (8종 리뷰 프로필) |
| `/ship` | 리뷰 자동 확인 + 커밋·푸시·배포 |
| `/help` | 현재 상태를 파악해서 맞춤 안내 |
| `/learn` | 배운 것 보기·기록 (작업 중 자동으로도 쌓임) |
| `/decision` | 설계 결정 보기·기록 (판단 시 자동으로도 쌓임) |
| `/add-review-profile` | 커스텀 리뷰 프로필 만들기 |

---

## 가드레일 — 코드가 무너지지 않는 이유

### 4층 결정적 강제

1. **커밋 게이트** (`.husky/pre-commit`) — 타입·린트·테스트 통과 못하면 커밋 불가 + 테스트 커버리지 경고
2. **`/verify` 루프** — 타입·린트·테스트·빌드를 초록불 될 때까지 스스로 반복
3. **ESLint 규칙** — `let`/딥임포트/상대경로 금지
4. **Vercel 배포** — 빌드 깨지면 배포 자체가 실패
   (+ `server-only`: 서버 코드가 클라이언트로 새면 빌드 실패)

### 테스트 커버리지 훅

소스 파일(`server/`, `lib/`)을 수정하면 대응하는 테스트 파일이 있는지 자동으로 확인합니다.
없으면 AI가 테스트 추가를 안내합니다.

### 자동 리뷰 파이프라인

`/ship` 실행 시 세션에서 `/review`가 아직 안 돌았으면 자동으로 리뷰를 먼저 진행합니다.

---

## 8종 리뷰 프로필

`/review`는 변경된 파일 패턴을 보고 관련 프로필을 자동 선택합니다.

| 프로필 | 관점 | 자동 선택 조건 |
|---|---|---|
| **code** | 코드 품질·타입·보안 | 항상 |
| **design** | UI 일관성·상태·반응형 | `app/`, `components/` 변경 시 |
| **product** | 미션 정렬·스펙 범위 | `spec/` 변경 시 |
| **developer** | DX·온보딩·문서화 | README, 설정 파일 변경 시 |
| **marketer** | 가치 제안·전환·카피 | 랜딩 페이지 변경 시 |
| **customer-support** | 에러 안내·사용자 지원 | 에러 처리 코드 변경 시 |
| **infra** | 배포·환경변수·성능 | `server/`, `.env`, 설정 변경 시 |
| **qa** | 엣지 케이스·회귀·테스트 | 테스트 파일 변경 시 |

`/add-review-profile`로 프로젝트에 맞는 커스텀 프로필도 만들 수 있습니다.

---

## 자동 축적 시스템

작업하면서 **배운 것**과 **설계 결정**이 자동으로 기록됩니다. 별도 트리거 불필요.

- **Learnings** (`learnings/`) — `/impl`, `/review`, `/ship` 중 발견한 삽질·패턴이 자동 기록
- **Decisions** (`decisions/`) — `/interview`, `/spec`, `/impl` 중 설계 판단이 자동 기록

다음 세션에서 AI가 과거 기록을 참고해 같은 실수를 반복하지 않습니다.

---

## 서버 아키텍처 (Port & Adapter)

```
인터페이스(라우트) → 애플리케이션(service) → 도메인(model, 순수)
                                              ↑
                                     인프라(repo 어댑터)가 포트(repo 인터페이스)를 구현
```

저장 방식을 **메모리 → Supabase**로 갈아끼워도 비즈니스 로직은 그대로. `model`·`service`가 순수해서 테스트도 쉽습니다.

---

## 프로젝트 구조

```
ai-agent-coding-starter/
├── .claude/
│   ├── CLAUDE.md              # AI 작업 규칙 (황금 규칙 + 의사결정 프레임)
│   ├── settings.json          # 훅: /verify 리마인드 + 테스트 커버리지 체크
│   ├── hooks/                 # PostToolUse 훅 (테스트 커버리지 검사)
│   └── skills/
│       ├── init/              # 템플릿 초기화 + 온보딩
│       ├── interview/         # 미션 설정
│       ├── spec/              # 기능 구체화
│       ├── impl/              # 구현
│       ├── verify/            # 검증
│       ├── review/            # 리뷰 (8종 프로필)
│       │   └── profiles/      # code·design·product·developer·marketer·
│       │                      # customer-support·infra·qa
│       ├── ship/              # 배포 (자동 리뷰 파이프라인)
│       ├── help/              # 상태 인식 도움말
│       ├── learn/             # 배운 것 기록
│       ├── decision/          # 설계 결정 기록
│       ├── add-review-profile/# 커스텀 리뷰 프로필 생성
│       ├── architecture/      # 구조·저장·설계 의사결정
│       ├── server-architecture/# 서버 레이어 (포트&어댑터)
│       ├── database/          # Supabase(무료 플랜) DB
│       ├── testing/           # Vitest 테스트
│       ├── conventions/       # 코드 규칙 (ESLint 강제)
│       └── ui-design/         # 화면 품질
├── .husky/pre-commit          # 게이트: 타입·린트·테스트 + 커버리지 경고
├── spec/                      # mission.md + spec.md
├── learnings/                 # 자동 축적되는 배움 기록
├── decisions/                 # 자동 축적되는 설계 결정
├── app/                       # Next.js App Router
├── server/                    # 서버 전용 (Port & Adapter)
│   ├── note/                  # 도메인 예시: model·repo·service + test
│   ├── supabase/              # Supabase 클라이언트 (server-only)
│   └── shared/                # 공통 (에러 등)
├── eslint.config.mjs
├── vitest.config.ts
├── .env.example               # Supabase 연결 (복사 → .env.local)
└── supabase/schema.sql        # DB 테이블 생성 SQL
```

---

## 데이터 저장 (Supabase, 선택)

기본은 메모리라 새로고침하면 사라집니다. 영속 저장은 `database` 스킬을 따르세요:

1. `supabase/schema.sql` 실행
2. `.env.example` 복사해 `.env.local` 채우기
3. `server/note/index.ts` 어댑터 한 줄 교체

## 배포 연결 (한 번만)

1. GitHub 저장소로 올린다
2. [vercel.com](https://vercel.com)에서 Import (pnpm 자동 감지)
3. 이후 `git push`마다 자동 배포

(Supabase를 쓰면 Vercel 환경변수에 `SUPABASE_URL`·`SUPABASE_SERVICE_ROLE_KEY` 추가)

---

## 혼자 이어가기

- **`/help`** 를 치면 현재 상태에 맞는 다음 단계를 안내합니다.
- `.claude/skills/`의 각 `SKILL.md`가 워크플로우의 정체입니다.
- `CLAUDE.md`의 **황금 규칙**·**생각 규칙**을 읽어보세요.
- 같은 문제가 반복되면 **재현 테스트**를 남겨 다시는 안 터지게.
