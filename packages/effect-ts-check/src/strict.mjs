import tseslint from "typescript-eslint"

import { effectBaseConfig } from "./base.mjs"
import {
  effectRestrictedImportPatterns,
  effectRestrictedImports,
  effectStrictSyntaxRestrictions,
  effectTypeRules
} from "./rules/index.mjs"

export const strict = [
  ...effectBaseConfig,
  {
    name: "effect-ts-check/strict",
    ignores: ["tests/**"],
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin
    },
    rules: {
      "no-console": "error",
      "no-restricted-imports": [
        "error",
        {
          paths: effectRestrictedImports,
          patterns: effectRestrictedImportPatterns
        }
      ],
      "no-restricted-syntax": ["error", ...effectStrictSyntaxRestrictions],
      ...effectTypeRules
    }
  }
]

export default strict
