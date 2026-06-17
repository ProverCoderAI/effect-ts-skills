# Editor Tooling

## Scope

- `@prover-coder-ai/effect-ts-check` is the reusable CLI/compliance package.
- `scripts/run-effect-ts-check.sh` is the self-contained skill entrypoint for running that package before npm publish.
- `@effect/language-service` is the editor-facing TypeScript plugin for Effect-aware diagnostics and suggestions.
- VSCode integration is a separate setup layer, not part of the CLI package.

## What To Mention

- Add `@effect/language-service` to `tsconfig.base.json` `compilerOptions.plugins`.
- Recommend the Effect VSCode extension `effectful-tech.effect-vscode` when the repo is used interactively in the editor.
- Keep `dbaeumer.vscode-eslint` alongside the Effect extension so editor lint feedback matches the CLI package.
- Keep ESLint and language-service responsibilities separate:
  - ESLint/CLI catches repeatable policy violations.
  - The language service improves editor diagnostics and suggestions.

## Practical Guidance

- If a task is about code quality enforcement in CI, use the CLI/package docs.
- If a task is about authoring experience, completion, or diagnostics in the editor, use the editor tooling docs.
- Do not describe the language service as a replacement for the CLI check.
