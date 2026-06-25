@AGENTS.md

# AI Agent Coding Starter — 작업 규칙 (하네스)

이 저장소는 **비개발자가 AI로 웹 서비스를 만들고, 이후에도 자기 제품을 잘 키워가기 위한 장기 하네스**다.
**좋은 코드·좋은 설계 판단을 계속 유도하는 작업 환경**이다.

핵심 철학: **"똑똑한 프롬프트가 아니라 가드레일."** 결과물이 무너지지 않게, 검증을 사람이 아니라 구조로 강제한다.

## 패키지 매니저: pnpm (npm 아님)
- 설치 `pnpm install` · 개발 `pnpm dev` · 검증 `pnpm verify` · 테스트 `pnpm test` · 추가 `pnpm add <패키지>`

## 황금 규칙 (항상 지킨다)

1. **프로젝트를 시작할 때 `/interview`.** 미션(`spec/mission.md`)을 먼저 세운다.
2. **기능을 만들기 전에 `/spec`.** 막연한 요청이 오면 코드부터 짜지 말고, 질답으로 무엇을 만들지부터 좁힌다.
3. **구현은 `/impl` 로.** 스펙이 확정된 뒤에만 구현을 시작한다.
4. **작게 만든다.** 한 번에 기능 하나.
5. **`/verify` 통과 전에는 "다 됐다"고 말하지 않는다.** (타입·린트·테스트·빌드 초록불)
6. **배포 전에 `/review`.** 전문가 관점으로 점검한다. `/ship`이 자동으로 확인하지만, 미리 돌려두면 좋다.
7. **항상 좋은 코드·구조로.** 코드 `conventions`, 화면 `ui-design`, 구조 `architecture`, 서버 `server-architecture`, 저장 `database`, 테스트 `testing`.
8. **반복되는 문제는 구조로 막는다.** 같은 에러가 두 번 나오면 재현 테스트를 남긴다.
9. **mission의 "안 할 것"은 절대 넘지 않는다.** 사용자가 요청해도 먼저 mission 수정을 권한다.
10. **배운 것과 결정은 기록한다.** 삽질·발견은 `/learn`, 설계 결정은 `/decision`으로 남긴다.

## 미션 & 스펙

- **`spec/mission.md`** — 프로젝트 전체의 나침반. 한 줄 정의, 핵심 원칙, 안 할 것. 모든 설계 판단에서 먼저 확인한다.
- **`spec/spec.md`** — 지금 만들고 있는 기능의 구체적 스펙. mission에 정렬되어야 한다.

## 배움 & 결정 기록

- **`learnings/`** — 작업 중 배운 것(삽질, 발견, 패턴). 세션 간 지식이 축적된다.
- **`decisions/`** — 설계 결정의 이유. "왜 이렇게 했지?"를 나중에 찾을 수 있다.

## 생각 규칙 — 모든 설계 판단의 첫 질문 (결정적 vs 비결정적)
- **결정적(기계가 채점: 빌드·타입·테스트·린트)** → 자동 검증으로 **강제**.
- **비결정적(판단 필요: 구조·저장방식·우선순위)** → 결정 전에 **탐색 범위를 좁히고 가장 단순하고 되돌리기 쉬운 것**을 고른다.

## 작업 → 스킬 매핑

| 상황 | 사용할 스킬 |
| --- | --- |
| 템플릿 처음 받았을 때 | `/init` |
| 프로젝트 시작 / 방향 정하기 | `/interview` |
| 기능 구체화 / 스펙 만들기 | `/spec` |
| 스펙대로 실제 구현 | `/impl` |
| 구조·저장·우선순위 등 설계 판단 | `architecture` |
| 서버 코드(저장·외부연동·비밀키) 구조 | `server-architecture` |
| 데이터 영속 저장(DB) 붙이기 | `database` |
| 테스트 작성 | `testing` |
| 코드 작성 규칙 | `conventions` |
| 화면 UI | `ui-design` |
| 코드 바꾼 뒤 검증 | `/verify` |
| 배포 전 점검 | `/review` |
| 배포 | `/ship` |
| 배운 것 기록 | `/learn` |
| 설계 결정 기록 | `/decision` |
| 커스텀 리뷰 프로필 추가 | `/add-review-profile` |
| 뭐부터 할지 모를 때 | `/help` |

## 표준 흐름
`/init`(처음 한 번) → `/interview` → `/spec` → `/impl`(`architecture`·`server-architecture`·`database`·`conventions`·`ui-design`·`testing` 적용 + `/verify` 반복) → `/review` → `/ship`

## 서버·저장 구조 (요약)
- 서버 코드는 `server/<도메인>/` 레이어: `model`(순수) · `repo`(포트) · `repo.memory`/`repo.supabase`(어댑터) · `service` · `index`(배럴). 자세히는 `server-architecture`.
- 저장은 기본 **메모리**(영속 X). 영속이 필요하면 **Supabase(무료 플랜)** 어댑터로 한 줄 교체 → `database` 스킬.
- 모든 `server/**`는 `import "server-only";` 로 시작. 비밀키는 `.env.local`(깃 제외), 서버에서만.

## 결정적 강제 장치 (끄지 말 것)
- **`.husky/pre-commit`**: 타입·린트·테스트 깨지면 커밋 차단.
- **ESLint**: `let`·딥임포트·상대경로(`../`) 금지.
- **`server-only`**: 서버 코드가 클라이언트로 새면 빌드 실패.
- **Vercel**: `next build` 실패 시 배포 실패.

## 기술 스택
- pnpm · Next.js 16 · React 19 · TypeScript · Tailwind v4 · ESLint 9 · Vitest 4 · Husky · **Supabase**(DB, 무료 플랜).
