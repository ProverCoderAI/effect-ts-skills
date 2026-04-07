# Platform Map

`@effect/platform` replaces host APIs with typed services and Layers.

## Common Mappings

- `HttpClient` replaces `fetch`, `undici`, and `axios`
- `FileSystem` replaces `fs` and `fs.promises`
- `Path` replaces `node:path`
- `Command` replaces `child_process`
- `Runtime` replaces direct `process` handling
- `PlatformLogger` replaces `console` for structured logging

## Guidance

- Prefer Effect platform services over host APIs.
- Use host APIs only when no Effect replacement is needed and the boundary is already isolated.
- Editor tooling such as `@effect/language-service` is not a runtime replacement for host APIs; it only improves authoring feedback.
