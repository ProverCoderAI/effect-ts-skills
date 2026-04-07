import * as effectEslint from "@effect/eslint-plugin";
import tseslint from "typescript-eslint";

import { effectBaseConfig, effectFileGlobs } from "./base.mjs";
import {
  effectRestrictedImportPatterns,
  effectRestrictedImports,
  effectStrictSyntaxRestrictions,
  effectTypeRules,
} from "./rules/index.mjs";

export const strict = [
  ...effectBaseConfig,
  ...effectEslint.configs.dprint,
  {
    name: "effect-ts-check/strict",
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
      "no-console": "error",
      "no-restricted-imports": [
        "error",
        {
          paths: effectRestrictedImports,
          patterns: effectRestrictedImportPatterns,
        },
      ],
      "no-restricted-syntax": ["error", ...effectStrictSyntaxRestrictions],
      ...effectTypeRules,
    },
  },
];

export default strict;
