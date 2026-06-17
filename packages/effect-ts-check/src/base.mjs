import tseslint from "typescript-eslint";

import { effectSyntaxRestrictions } from "./rules/index.mjs";

export const effectFileGlobs = Object.freeze(["**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"]);
export const effectIgnoreGlobs = Object.freeze([
  "tests/**",
  "**/tests/**",
  "__tests__/**",
  "**/__tests__/**",
  "fixtures/**",
  "**/fixtures/**",
  "**/*.test.*",
  "**/*.spec.*",
  "**/tmp-fixture-*/**",
  "**/node_modules/**",
  "**/dist/**",
  "**/coverage/**",
]);
export const effectIgnoreConfig = Object.freeze({
  name: "effect-ts-check/ignores",
  ignores: effectIgnoreGlobs,
});

export const effectBaseConfig = Object.freeze([
  effectIgnoreConfig,
  {
    name: "effect-ts-check/base",
    files: effectFileGlobs,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "no-restricted-syntax": ["error", ...effectSyntaxRestrictions],
    },
  },
]);
