import tseslint from "typescript-eslint";

import { effectSyntaxRestrictions } from "./rules/index.mjs";

export const effectFileGlobs = Object.freeze(["**/*.{js,mjs,cjs,ts,tsx}"]);

export const effectBaseConfig = Object.freeze([
  {
    name: "effect-ts-check/base",
    ignores: ["tests/**", "**/node_modules/**", "**/dist/**", "**/coverage/**"],
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
