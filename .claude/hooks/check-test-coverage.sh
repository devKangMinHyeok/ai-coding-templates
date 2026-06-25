#!/bin/bash
# PostToolUse hook: 소스 파일이 변경되면 대응하는 테스트 파일이 있는지 확인한다.
# 테스트가 없으면 AI에게 테스트 추가를 지시하는 메시지를 출력한다.

# 변경된 파일 경로는 환경변수로 전달됨 (CLAUDE_FILE_PATH)
FILE="$CLAUDE_FILE_PATH"

# 파일 경로가 없으면 종료
[ -z "$FILE" ] && exit 0

# .ts/.tsx 소스 파일만 검사 (테스트/설정/스킬 파일 제외)
echo "$FILE" | grep -qE '\.(ts|tsx)$' || exit 0
echo "$FILE" | grep -qE '\.(test|spec)\.(ts|tsx)$' && exit 0
echo "$FILE" | grep -qE '(\.claude|node_modules|\.next|\.husky)/' && exit 0
echo "$FILE" | grep -qE '(config|\.config|\.d\.ts)' && exit 0

# server/ 또는 lib/ 아래 순수 로직 파일만 체크
if echo "$FILE" | grep -qE '^(server|lib)/'; then
  BASE="${FILE%.*}"
  if [ ! -f "${BASE}.test.ts" ] && [ ! -f "${BASE}.test.tsx" ] && [ ! -f "${BASE}.spec.ts" ]; then
    echo "🧪 테스트 확인: ${FILE} 에 대응하는 테스트 파일이 없습니다."
    echo "   이 파일에 순수 로직(계산·변환·검증)이 있다면 테스트를 추가해주세요."
    echo "   테스트 파일 위치: ${BASE}.test.ts"
  fi
fi
