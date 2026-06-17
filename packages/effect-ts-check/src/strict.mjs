import eslintComments from "@eslint-community/eslint-plugin-eslint-comments";
import tseslint from "typescript-eslint";

import {
  effectCoreAxiomsFileGlobs,
  effectCoreFileGlobs,
  effectFileGlobs,
  effectIgnoreConfig,
} from "./base.mjs";
import {
  effectCoreRestrictedImportPatterns,
  effectCoreSyntaxRestrictions,
  effectErrorBoundarySyntaxRestrictions,
  effectRestrictedImportPatterns,
  effectRestrictedImports,
  effectStrictSyntaxRestrictions,
  effectSyntaxRestrictions,
  effectTypeRules,
} from "./rules/index.mjs";

const strictSyntaxRestrictions = Object.freeze([
  ...effectSyntaxRestrictions,
  ...effectStrictSyntaxRestrictions,
]);

const coreSyntaxRestrictions = Object.freeze([
  ...strictSyntaxRestrictions,
  ...effectErrorBoundarySyntaxRestrictions,
  ...effectCoreSyntaxRestrictions,
]);

const coreAxiomsSyntaxRestrictions = Object.freeze([
  ...strictSyntaxRestrictions,
  ...effectErrorBoundarySyntaxRestrictions.filter((rule) =>
    rule.selector !== "TSAsExpression" && rule.selector !== "TSTypeAssertion"
  ),
  ...effectCoreSyntaxRestrictions,
]);

const strictImportPatterns = Object.freeze([...effectRestrictedImportPatterns]);
const coreImportPatterns = Object.freeze([
  ...effectRestrictedImportPatterns,
  ...effectCoreRestrictedImportPatterns,
]);

export const strict = [
  effectIgnoreConfig,
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
      "eslint-comments": eslintComments,
    },
    rules: {
      "no-console": "error",
      "no-throw-literal": "error",
      "no-restricted-imports": [
        "error",
        {
          paths: effectRestrictedImports,
          patterns: strictImportPatterns,
        },
      ],
      "no-restricted-syntax": ["error", ...strictSyntaxRestrictions],
      "eslint-comments/no-use": "error",
      "eslint-comments/no-unlimited-disable": "error",
      "eslint-comments/disable-enable-pair": "error",
      "eslint-comments/no-unused-disable": "error",
      ...effectTypeRules,
    },
  },
  {
    name: "effect-ts-check/strict-core",
    files: effectCoreFileGlobs,
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: effectRestrictedImports,
          patterns: coreImportPatterns,
        },
      ],
      "no-restricted-syntax": ["error", ...coreSyntaxRestrictions],
    },
  },
  {
    name: "effect-ts-check/strict-core-axioms",
    files: effectCoreAxiomsFileGlobs,
    rules: {
      "no-restricted-syntax": ["error", ...coreAxiomsSyntaxRestrictions],
    },
  },
];

export default strict;
