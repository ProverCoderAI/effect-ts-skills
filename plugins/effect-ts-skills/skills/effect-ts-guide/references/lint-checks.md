# Lint Checks

## Quick Command

Run this first:

```bash
SKILL_DIR=<directory containing this SKILL.md>
bash "$SKILL_DIR/scripts/run-effect-ts-check.sh" .
```

Resolve `scripts/run-effect-ts-check.sh` relative to the skill directory. The wrapper resolves the bundled `effect-ts-check` tarball without assuming a specific install location such as `~/.codex`.

If the repository is mostly tooling, docs, or test fixtures for the checker itself, run the command only against the relevant Effect source paths instead of `.`.

The wrapper installs the bundled tarball through `npx --package`, so npm registry access or a warm npm cache is required for the package dependencies.

## Minimal Profile

The minimal profile should catch the high-signal Effect violations:

- `async` functions and `await`
- raw `Promise` construction and `Promise.*`
- `try/catch`
- `switch`
- `require`
- common JavaScript and TypeScript module extensions, including `.jsx`, `.mts`, and `.cts`

## Strict Profile

The strict profile should add deeper policy checks:

- the official `@effect/eslint-plugin` preset
- direct host imports that bypass Effect platform services
- obvious unsafe typing policy violations
- safer handling around casts and `unknown`
- direct `fetch` and other host API restrictions
- eslint comment hygiene

Runtime execution boundaries such as `Effect.runPromise` and CORE/SHELL import direction still need manual review because the correct answer depends on the repository's entrypoint layout.

## Editor Tooling Boundary

- `effect-ts-check` is the reusable command-line compliance layer.
- `@effect/language-service` and VSCode settings belong to the editor experience layer.
- Do not expect the CLI to provide completion or hover behavior; that comes from the language service.

## How To Use Results

- Fix machine-detectable violations first.
- Treat remaining issues as architecture or design decisions.
- Do not use the lint output as a substitute for boundary modeling or type design.
