# Best Practices

## Core Principles

- Keep core logic pure.
- Keep IO in a thin shell.
- Model errors explicitly with tagged unions.
- Prefer immutable data and total functions.

## Composition

- Use `pipe`, `Effect.flatMap`, `Effect.map`, or `Effect.gen` for sequential flows.
- Use `Match.exhaustive` for union handling.
- Use `Effect.try` and `Effect.tryPromise` only at boundaries.

## Dependency Injection

- Define services with `Context.Tag`.
- Provide live layers at runtime.
- Provide test layers in tests.

## Boundary Validation

- Accept `unknown` only at the boundary.
- Decode with `@effect/schema`.
- Pass validated values into core logic.

## Resource Safety

- Use `Effect.acquireRelease` for resources.
- Use `Effect.scoped` for controlled lifetimes.

## Platform Usage

- Prefer `@effect/platform` services over host APIs.
- Use `HttpClient`, `FileSystem`, `Path`, `Command`, and `PlatformLogger` where appropriate.

## Testing

- Write tests as Effects.
- Use test layers and mocks.
- Add property-based tests when a rule should hold for many inputs.
