# Lint Checks

## Quick Command

Run this first:

```bash
npx @prover-coder-ai/effect-ts-check .
```

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

- shell-only boundaries for runtime execution
- no direct CORE imports from SHELL
- safer handling around casts and `unknown`
- stricter host API restrictions
- eslint comment hygiene

## How To Use Results

- Fix machine-detectable violations first.
- Treat remaining issues as architecture or design decisions.
- Do not use the lint output as a substitute for boundary modeling or type design.
