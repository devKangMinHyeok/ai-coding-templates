---
name: ship
description: 변경을 커밋·푸시해서 Vercel에 자동 배포한다. 배포·출시·"올려줘"·"세상에 내보내" 요청 시 사용. verify 통과가 전제.
---

# /ship — 세상에 내보낸다

## 전제
배포 전에 `/verify`가 초록불이어야 한다. 아니면 먼저 verify부터.

## 절차

1. `pnpm verify`로 한 번 더 확인(초록불 아니면 고치고 반복).
2. 커밋:
   ```bash
   git add -A
   git commit -m "<무엇을 했는지 한 줄>"
   ```
   - 커밋 순간 `.husky/pre-commit` 게이트가 자동으로 type-check·lint를 다시 검사한다. **여기서 막히면 통과가 아니다 → 고치고 다시.**
3. 푸시:
   ```bash
   git push
   ```
4. **Vercel이 push를 감지해 자동 빌드·배포**한다. 빌드가 깨지면 배포가 실패하므로, 이것도 하나의 안전장치다.
5. 배포 URL을 사용자에게 알려준다.

## 처음 한 번 (배포 연결)
아직 Vercel에 연결 안 됐다면: GitHub에 레포를 올리고 → vercel.com에서 그 레포를 Import → 이후로는 push만 하면 자동 배포된다. (자세히는 README 참고)
