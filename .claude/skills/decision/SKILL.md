---
name: decision
description: 설계 결정의 이유를 기록하고 조회한다. 자동으로도 쌓이고, 직접 "결정 기록해"로도 사용 가능.
argument-hint: '[add|list|search 검색어|supersede 파일]'
---

# /decision — 설계 결정 기록

"왜 이렇게 했지?"를 나중에 찾아볼 수 있게 기록한다. 방향을 바꿀 때 과거의 맥락을 잃지 않는다.

## 사용법

```
/decision              → 활성 결정 목록 (= /decision list)
/decision add          → 새로운 결정을 직접 기록한다 (인터뷰 형식)
/decision list         → 활성 결정 목록
/decision search <키워드>  → 키워드로 관련 결정을 찾는다
/decision supersede <파일> → 기존 결정을 새 결정으로 대체한다
```

## 자동 기록 (다른 스킬에서 자동으로 쌓임)

**아래 상황에서 사용자가 `/decision add`를 하지 않아도 자동으로 기록된다:**

- **/interview에서 미션을 정의할 때** → 형태 선택(보여주기/기록관리/도구/갤러리), 핵심 원칙, "안 할 것" 결정을 `project` 범위로 기록
- **/spec에서 복잡도 체크 결과** → DB 필요 여부, 외부 서비스 연동 여부, 범위 좁히기 결정을 `feature` 범위로 기록
- **/impl 중 설계 판단을 내릴 때** → 라이브러리 선택, 구조 결정, 데이터 모델 등을 `tech` 범위로 기록
- **/impl 중 "나중에"로 미룬 것** → 무엇을 왜 미뤘는지 기록

자동 기록 시 사용자에게 별도 확인을 묻지 않는다. 조용히 기록하고 넘어간다.

## `/decision add` 절차 (수동)

사용자에게 차례로 질문한다:

### 1단계: 무엇을 결정했나?
> "어떤 결정을 내렸나요? 한 줄로 요약해주세요."

### 2단계: 왜 이렇게 결정했나?
> "이 결정의 이유는 뭔가요? (제약, 트레이드오프, 우선순위 등)"

### 3단계: 어떤 대안을 고려했나?
> "다른 방법도 고려했나요? 왜 그걸 선택하지 않았나요?"

### 4단계: 범위
> "이 결정의 영향 범위는?"
> - `project` — 프로젝트 전체에 영향
> - `feature` — 특정 기능에만 영향
> - `tech` — 기술적 선택 (라이브러리, 구조 등)

### 5단계: 기록

파일명: `decisions/YYYY-MM-DD-{짧은-슬러그}.md`

## 기록 형식

```markdown
---
date: 2024-01-15
scope: tech
status: active
source: auto/impl
---

# Supabase를 DB로 선택

## 결정
데이터베이스로 Supabase(무료 플랜)를 사용한다.

## 이유
- 무료 플랜으로 시작할 수 있다
- PostgreSQL 기반이라 나중에 마이그레이션이 쉽다
- 인증, 스토리지 등 부가 기능이 있다

## 고려한 대안
- **Firebase**: NoSQL이라 관계형 데이터에 부적합
- **PlanetScale**: MySQL 기반, 무료 플랜 축소 중

## 되돌릴 조건
무료 플랜 한도를 넘기거나, PostgreSQL이 아닌 DB가 필요해지면 재검토.
```

- `source: auto/<스킬명>` — 자동 기록 시 어느 스킬에서 기록됐는지
- `source: manual` — `/decision add`로 직접 기록한 경우
- `status: active` — 현재 유효한 결정
- `status: superseded` — 새 결정으로 대체됨

## `/decision list` 절차

1. `decisions/` 폴더의 모든 `.md` 파일을 읽는다
2. `status: active`인 것만 필터한다
3. 테이블로 출력한다:

```markdown
| 날짜 | 범위 | 출처 | 결정 |
|---|---|---|---|
| 2024-01-15 | tech | auto/impl | Supabase를 DB로 선택 |
| 2024-01-14 | project | auto/interview | 모바일 우선 설계 |
```

## `/decision supersede <파일>` 절차

1. 기존 결정 파일의 `status`를 `superseded`로 변경
2. 새 결정을 `/decision add` 절차로 기록
3. 새 결정에 `supersedes: <기존 파일명>` 추가

## `/decision search <키워드>` 절차

1. `decisions/` 폴더에서 키워드가 포함된 파일을 찾는다
2. 활성 결정 우선, 대체된 결정은 (대체됨) 표시

## 세션 시작 시 자동 참조

새 세션이 시작되면 `decisions/` 폴더가 있는 경우 활성 결정을 훑어보고, 현재 작업과 관련 있는 결정이 있으면 자연스럽게 참고한다. 특히 `/impl` 시작 시 관련 기술 결정을 확인한다.

## 폴더 구조

```
decisions/
├── 2024-01-15-supabase-db.md        (status: active)
├── 2024-01-14-mobile-first.md       (status: active)
├── 2024-01-10-firebase-db.md        (status: superseded)
└── ...
```

`decisions/` 폴더가 없으면 첫 기록 시 자동 생성한다.
