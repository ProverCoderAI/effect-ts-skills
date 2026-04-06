---
name: effect-ts-guide
description: Effect-TS guidance for architecture, typed errors, Layers, boundary validation, resource safety, compliance checks, and editor tooling. Use when a task is explicitly about Effect, @effect/*, refactoring code to Effect, reviewing Effect code, validating Effect-style conventions, or wiring Effect editor/language-service setup.
---

# Effect TS Guide

## When To Use

Use this skill only when the task is clearly Effect-related:

- the code uses `effect` or `@effect/*`
- the user asks to refactor to Effect
- the user asks for an Effect review or compliance check
- the user asks about Effect editor support, language service setup, or VSCode integration
- the task needs typed errors, Layers, scoped resources, or boundary decoding

If the task is not about Effect, do not force this skill.

## Workflow

1. Confirm the codebase or request is actually Effect-oriented.
2. Run the quick compliance check first:

```bash
npx @prover-coder-ai/effect-ts-check .
```

3. Fix the violations that are machine-detectable.
4. Apply the manual rules from the references for architecture and style decisions.
5. Re-run the check before finishing.

For editor integration tasks, treat `effect-ts-check` as the reusable CLI/compliance package and `@effect/language-service` plus VSCode settings/extensions as a separate setup concern.

## What The Check Covers

The compliance check is for fast, repeatable signals:

- direct `async/await`
- raw `Promise` usage
- `try/catch` in product code
- `switch`
- `require`
- unsafe host imports where Effect platform services should be used
- obvious policy violations such as `any`, `ts-ignore`, or unsupported casts in strict areas

The `strict` profile also layers in the official `@effect/eslint-plugin` preset for Effect-aware lint behavior.

## What Still Needs Judgment

The check does not replace architectural reasoning. Apply manual rules for:

- CORE vs SHELL boundaries
- typed error design
- Layer and dependency injection shape
- boundary decoding with `@effect/schema`
- resource safety with `Effect.acquireRelease` and `Effect.scoped`
- exhaustive handling of unions

## References

- [Best Practices](references/best-practices.md)
- [Platform Map](references/platform-map.md)
- [Lint Checks](references/lint-checks.md)
- [Manual Writing Rules](references/manual-writing-rules.md)
- [Editor Tooling](references/editor-tooling.md)
