# Manual Writing Rules

## Applicability Gate

Only apply this skill when the task is explicitly Effect-related.

## Architecture Rules

- CORE must not depend on SHELL.
- Effects belong in the shell or boundary layer.
- Every external input should be decoded before entering core.
- Every failure that matters should be typed.

## Code Style Rules

- Prefer `Effect.gen` for readable effect composition.
- Prefer `Match.exhaustive` over `switch`.
- Avoid `async/await` in product logic.
- Avoid `try/catch` except at boundaries where you immediately convert to typed errors.
- Avoid raw `Promise` chains.

## Review Rules

- If the code compiles but violates the architecture, call that out.
- Separate machine-checkable issues from design issues.
- If the one-command check passes, still inspect boundaries, error types, and resource lifetimes.

## Response Rules

- Be concrete about what should change.
- Prefer minimal diffs.
- Explain why a change preserves purity, typing, or boundary safety.

## Editor Integration Rules

- When the user asks about Effect editor support, mention both `@effect/language-service` and the VSCode extension.
- Keep the explanation split between reusable compliance tooling and editor authoring setup.
- If a repo already has CLI checks, do not imply the language service replaces them.
