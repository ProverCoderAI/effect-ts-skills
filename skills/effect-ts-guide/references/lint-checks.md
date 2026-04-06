# Lint Checks

## Quick Command

Run this first:

```bash
bash "${CODEX_HOME:-$HOME/.codex}/skills/effect-ts-guide/scripts/run-effect-ts-check.sh" .
```

This wrapper resolves the bundled `effect-ts-check` tarball from the installed skill directory, so local skill installs work before npm publish.

## Minimal Profile

The minimal profile should catch the high-signal Effect violations:

- `async` functions and `await`
- raw `Promise` construction and `Promise.*`
- `try/catch`
- `switch`
- `require`
- direct host imports that bypass Effect platform services
- obvious unsafe typing policy violations

## Strict Profile

The strict profile should add deeper policy checks:

- the official `@effect/eslint-plugin` preset
- shell-only boundaries for runtime execution
- no direct CORE imports from SHELL
- safer handling around casts and `unknown`
- stricter host API restrictions
- eslint comment hygiene

## Editor Tooling Boundary

- `effect-ts-check` is the reusable command-line compliance layer.
- `@effect/language-service` and VSCode settings belong to the editor experience layer.
- Do not expect the CLI to provide completion or hover behavior; that comes from the language service.

## How To Use Results

- Fix machine-detectable violations first.
- Treat remaining issues as architecture or design decisions.
- Do not use the lint output as a substitute for boundary modeling or type design.
