import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    // ── 아키텍처 가드레일 (product-lab 참고) ──
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // 선언형 우선: let 금지 (const + map/filter/reduce)
      "no-restricted-syntax": [
        "error",
        {
          selector: "VariableDeclaration[kind='let']",
          message: "let 대신 const를 쓰세요 (선언형 프로그래밍).",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              // 도메인 내부 딥임포트 금지 → 배럴(@/server/<도메인>, @/server/shared)만
              group: ["@/server/*/*"],
              message:
                "도메인 내부 파일을 직접 import하지 마세요. 배럴(@/server/<도메인> 또는 @/server/shared)을 쓰세요.",
            },
            {
              // 부모 상대경로 금지 → @/ 별칭
              group: ["../*"],
              message: "부모 상대경로(../) 대신 @/ 경로 별칭을 쓰세요.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
