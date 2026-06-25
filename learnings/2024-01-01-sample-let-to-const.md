---
date: 2024-01-01
category: tip
source: auto/review
---

# ESLint prefer-const 룰이 커밋을 막을 때

## 상황
습관적으로 `let`을 쓴 변수가 ESLint `prefer-const` 룰에 걸려서 커밋이 차단됨. 변수를 재할당하지 않는데 `let`을 쓴 경우.

## 배움
이 프로젝트에서는 `let` 사용이 ESLint로 금지되어 있다. 재할당이 필요한 경우에만 `let`을 쓰고, 나머지는 모두 `const`를 써야 한다. 배열이나 객체도 내용을 바꾸는 건 `const`로 충분하다 (`push`, `splice`, 프로퍼티 할당 등).

## 다음에는
변수 선언 시 기본을 `const`로 쓰고, 재할당이 진짜 필요한 경우(for 루프 카운터, 조건부 값 변경 등)에만 `let`을 쓴다.
