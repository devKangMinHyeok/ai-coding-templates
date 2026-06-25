---
date: 2024-01-01
scope: tech
status: active
source: auto/interview
---

# Next.js를 프레임워크로 선택

## 결정
웹 프레임워크로 Next.js(App Router)를 사용한다.

## 이유
- 프론트엔드와 백엔드를 한 프로젝트에서 관리할 수 있다 (서버 액션, API 라우트)
- Vercel에 push만 하면 자동 배포된다 (비개발자에게 배포 복잡도를 없앰)
- React 생태계의 풍부한 컴포넌트 라이브러리를 쓸 수 있다
- 파일 기반 라우팅으로 구조가 직관적이다

## 고려한 대안
- **Remix**: 좋은 프레임워크지만 배포 설정이 Next.js보다 복잡
- **SvelteKit**: 학습 곡선이 낮지만 생태계가 React보다 작음
- **순수 React + Express**: 설정할 게 너무 많음, 비개발자에게 부적합

## 되돌릴 조건
App Router의 복잡도가 학습자에게 장벽이 되거나, Vercel 무료 플랜이 크게 제한되면 재검토.
