---
name: review
description: 변경된 코드를 전문가 관점으로 리뷰합니다. 8개 프로필(code·design·product·developer·marketer·customer-support·infra·qa) 중 자동 감지 또는 지정. /ship 직전에 실행.
argument-hint: '[code|design|product|developer|marketer|customer-support|infra|qa|all]'
---

# /review — 전문가 관점으로 점검한다

배포 전에 돌린다. 변경된 코드를 **여러 전문가의 눈**으로 훑어 큰 구멍을 막는다.

## 사용법

```
/review                    → git diff 분석 → 해당 전문가 자동 선택
/review code               → 코드 품질 리뷰만
/review design             → 디자인 리뷰만
/review product            → 제품 방향 리뷰만 (mission 정렬)
/review developer          → 개발자 경험(DX) 리뷰만
/review marketer           → 마케팅·전환 리뷰만
/review customer-support   → 고객 상담·사용자 지원 리뷰만
/review infra              → 인프라·배포·운영 리뷰만
/review qa                 → 품질 보증·엣지 케이스 리뷰만
/review all                → 모든 전문가 리뷰
```

## 실행 흐름

### 1. 프로필 결정

- **인자가 프로필 이름 중 하나**: 해당 프로필 실행
- **인자가 `all`**: 모든 프로필 실행
- **인자가 없음**: 변경 파일을 보고 자동 선택
- `code`는 소스 코드 변경이 있으면 **항상 실행**

### 2. 대상 파일 수집

```bash
# 커밋되지 않은 변경 파일
git diff --name-only HEAD
git diff --name-only --cached

# + 이전 커밋 대비 변경 파일 (있다면)
git diff --name-only origin/main...HEAD 2>/dev/null
```

수집된 파일을 아래 매핑으로 프로필 자동 선택:

| 파일 패턴 | 프로필 |
|---|---|
| `**/*.ts`, `**/*.tsx` (비 UI) | code |
| `**/*.tsx` (컴포넌트·페이지) | code + design + customer-support |
| `app/**/page.tsx` (페이지) | code + design + marketer |
| `spec/mission.md`, `spec/spec.md` | product |
| `server/**` | code + infra |
| `.env*`, `next.config.*`, `vercel.json`, `package.json` | infra |
| `**/*.test.ts`, `**/*.test.tsx` | qa |
| `README.md`, `CLAUDE.md`, `.env.example` | developer |

### 3. 프로필별 리뷰 실행

각 프로필 문서를 읽고 해당 체크리스트로 리뷰한다:

| 프로필 | 문서 | 관점 |
|---|---|---|
| code | `profiles/code.md` | 코드 품질·타입·보안 |
| design | `profiles/design.md` | UI 일관성·상태·반응형 |
| product | `profiles/product.md` | 미션 정렬·스펙 범위 |
| developer | `profiles/developer.md` | 온보딩·DX·문서화 |
| marketer | `profiles/marketer.md` | 가치 제안·전환·카피 |
| customer-support | `profiles/customer-support.md` | 에러 안내·사용자 지원 |
| infra | `profiles/infra.md` | 배포·환경변수·성능 |
| qa | `profiles/qa.md` | 엣지 케이스·회귀·테스트 |

각 프로필 실행 시:
1. 프로필 문서의 **참조 기준** 섹션에 명시된 스킬 문서를 읽음
2. 프로필 문서의 **체크리스트**를 순서대로 평가
3. **위반 항목만** 수집 (통과 항목은 생략)

### 4. 통합 결과 출력

```markdown
# Review

## Code Review
(위반 항목만)

## Design Review
(위반 항목만)

## Product Review
(위반 항목만)

... (실행된 프로필만 표시)

---

## 요약

- Code: Critical N건, Warning N건, Suggestion N건
- Design: Critical N건, Warning N건, Suggestion N건
... (각 프로필별)

## 판정: 🟢 배포 OK / 🟡 고치고 배포 / 🔴 멈추고 수정
```

### 5. 심각도 분류

| 심각도 | 의미 |
|---|---|
| Critical | 즉시 수정 필요 — 핵심 원칙 위반, 안전성·데이터 위험 |
| Warning | 개선 권장 — 일관성 미흡, 품질 미달 |
| Suggestion | 선택적 개선 — 더 나은 패턴 존재 |

### 6. 프로필 간 충돌 해결

복수 프로필이 상충하는 제안을 낼 때 우선순위:

1. **안전** — 비밀키 노출, 데이터 유실은 다른 모든 것보다 우선
2. **동작** — 빌드·타입·에러 처리는 디자인·카피보다 우선
3. **사용자 경험** — UX 일관성 > 코드 엘레강스
4. **전략 정렬** — mission 방향과 맞는가
5. **코드 품질** — 유지보수성, 타입 안전성

### 7. 커스텀 프로필

`profiles/` 폴더에 `.md` 파일을 추가하면 자동으로 사용 가능하다. `/add-review-profile` 스킬로 인터뷰 형태로 새 프로필을 만들 수 있다.

### 8. 자동 기록 (조용히, 확인 안 묻고 기록)

#### learnings 자동 기록
리뷰에서 Critical 또는 Warning 항목이 발견되면 `learnings/` 폴더에 자동 기록한다:
- **반복되는 패턴의 위반** → "이런 실수를 또 했다" 계열은 다음에 안 하도록 기록
- **새로 발견된 위험** → 이번에 처음 잡힌 보안/성능/구조 문제

파일명: `learnings/YYYY-MM-DD-review-{요약}.md`, frontmatter에 `source: auto/review`, 카테고리는 `bug` 또는 `pattern`

Suggestion 수준은 기록하지 않는다.

### 9. 주의사항

- **코드 수정은 하지 않는다** — 리뷰와 제안만 출력
- 위반 항목만 보고한다 (통과한 체크리스트는 생략)
- 수정 제안은 **diff 형식 + 근거**를 포함한다
- 과도한 엔지니어링을 제안하지 않는다 — 현재 규모에 맞는 실용적 수준만
