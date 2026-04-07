---
name: effect-ts-guide
description: Effect-TS guidance for architecture, typed errors, Layers, boundary validation, resource safety, compliance checks, and editor tooling. Use when a task is explicitly about reviewing or implementing Effect or @effect/* application and library code, refactoring code to Effect, validating Effect-style conventions, or wiring Effect editor/language-service setup. Do not use for generic package publishing or plugin scaffolding tasks unless the code under review is the Effect code itself.
---

# Effect TS Guide

## Workflow

1. Confirm the codebase or request is actually Effect-oriented. If it is not, stop and do not force this skill.
2. Run the quick compliance check first:

```bash
bash scripts/run-effect-ts-check.sh .
```

If the repository is mostly tooling, docs, or test fixtures for the checker itself, scope the command to the relevant Effect source directories instead of blindly linting the whole workspace.

3. Fix the violations that are machine-detectable.
4. Apply the manual rules from the references for architecture and style decisions.
5. Re-run the check before finishing.

For editor integration tasks, treat `effect-ts-check` as the reusable CLI/compliance package and `@effect/language-service` plus VSCode settings/extensions as a separate setup concern.

The skill is intentionally self-contained. Resolve `scripts/run-effect-ts-check.sh` relative to the skill directory so the same instructions work for standalone installs, repo-local skills, and plugin-contributed skills without hardcoding `~/.codex`.

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
