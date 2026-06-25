---
date: 2024-01-01
category: tool
source: auto/verify
---

# npm install 하면 lockfile 충돌난다

## 상황
습관적으로 `npm install`을 실행했더니 `package-lock.json`이 생기면서 `pnpm-lock.yaml`과 충돌. 이후 CI에서도 의존성 불일치 에러 발생.

## 배움
이 프로젝트는 pnpm 전용이다. `npm install`을 쓰면 lockfile이 꼬인다. `package-lock.json`이 생기면 삭제하고 `pnpm install`로 다시 해야 한다.

## 다음에는
패키지 설치는 항상 `pnpm add <패키지>`, 전체 설치는 `pnpm install`. `npm`과 `yarn`은 이 프로젝트에서 쓰지 않는다.
