---
name: conventions
description: 코드를 짤 때 지키는 공통 규칙. 코드 작성·수정·리뷰 시 항상 적용. const·순수함수·선언형·작은 단위·TypeScript 타입·명확한 이름·ESLint 준수. 깨끗하고 오래 가는 코드를 위한 장기 규칙.
---

# /conventions — 깨끗하고 오래 가는 코드

수업 이후에도 코드가 무너지지 않게 하는 공통 규칙. AI는 코드를 짤 때 항상 이걸 따른다.

## 1. 변수는 `const`, 로직은 순수 함수
- `let` 대신 `const`. 값을 바꿔가며 쌓지 말고, 만들어서 반환한다.
- 계산/변환 함수는 **순수 함수**로: 같은 입력 → 같은 출력, 바깥 상태를 바꾸지 않음, 인자를 변형하지 않음.

```ts
// ❌ 명령형 + 변형
let result = [];
data.forEach(x => { if (x.active) result.push(x.name); });

// ✅ 선언형 + 순수
const result = data.filter(x => x.active).map(x => x.name);
```

## 2. 선언형 우선
`for` 루프·수동 누적 대신 `map`/`filter`/`reduce`. 의도가 드러나고 버그가 줄어든다.

## 3. 작게 나눈다
- 함수 하나 = 한 가지 일. 화면 컴포넌트 하나 = 한 가지 책임.
- 길어지면 쪼갠다. 깊게 중첩되면 함수로 빼낸다.

## 4. TypeScript는 안전벨트
- `any` 쓰지 않는다(타입 검사를 꺼버리는 것). 모르면 구체 타입을 만든다.
- 타입 에러는 "고쳐야 할 신호"지 우회 대상이 아니다.

## 5. 이름이 곧 문서
- 약어·모호한 이름 금지. `d`, `tmp` ❌ → `dueDate`, `filteredUsers` ✅
- 불리언은 `is/has/can`으로 시작: `isLoading`, `hasError`.

## 6. ESLint 룰은 법이다
- **룰을 끄거나 완화하지 않는다.** 코드가 룰에 안 맞으면 **코드를 고친다.**
- 이게 "결정적 검증을 강제한다"의 실천이다. (`/verify`가 이를 검사)

## 7. 주석은 "왜"만
- 무엇을 하는지는 코드가 말한다. 주석은 **왜 이렇게 했는지**(의도·함정)만 남긴다.

## 8. ESLint가 강제하는 것 (product-lab 참고)
- **`let` 금지** — `const` + 선언형(`map`/`filter`/`reduce`). (`no-restricted-syntax`)
- **딥임포트 금지** — 도메인은 배럴(`@/server/<도메인>`, `@/server/shared`)로만. (`no-restricted-imports`)
- **부모 상대경로(`../`) 금지** — `@/` 별칭 사용.
- 룰을 끄지 말고 코드를 고친다. 이게 결정적 검증의 실천이다.
