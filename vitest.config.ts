import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// 테스트 설정.
// - server/** 는 `import "server-only"` 를 쓰는데, 이는 Next 빌드 전용 가드라 테스트 환경에선 빈 모듈로 바꿔치기한다.
// - `@/` 경로 별칭을 루트로 매핑한다.
export default defineConfig({
  test: {
    environment: "node",
    include: ["server/**/*.test.ts", "lib/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "server-only": fileURLToPath(new URL("./test/stubs/server-only.ts", import.meta.url)),
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
