export const effectRestrictedImports = Object.freeze([
  {
    name: "ts-pattern",
    message: "Use Effect.Match instead of ts-pattern.",
  },
  {
    name: "zod",
    message: "Use @effect/schema for schemas and validation.",
  },
  {
    name: "fs",
    message: "Use @effect/platform FileSystem instead of fs.",
  },
  {
    name: "node:fs",
    message: "Use @effect/platform FileSystem instead of node:fs.",
  },
  {
    name: "node:fs/promises",
    message: "Use @effect/platform FileSystem instead of node:fs/promises.",
  },
  {
    name: "path",
    message: "Use @effect/platform Path instead of path.",
  },
  {
    name: "node:path",
    message: "Use @effect/platform Path instead of node:path.",
  },
  {
    name: "node:path/posix",
    message: "Use @effect/platform Path instead of node:path/posix.",
  },
  {
    name: "child_process",
    message: "Use @effect/platform Command instead of child_process.",
  },
  {
    name: "node:child_process",
    message: "Use @effect/platform Command instead of node:child_process.",
  },
  {
    name: "process",
    message: "Use @effect/platform Runtime instead of process.",
  },
  {
    name: "node:process",
    message: "Use @effect/platform Runtime instead of node:process.",
  },
]);

export const effectRestrictedImportPatterns = Object.freeze([
  {
    group: ["node:*"],
    message: "Do not import from node:* directly. Use @effect/platform services.",
  },
]);

export const effectCoreRestrictedImportPatterns = Object.freeze([
  {
    group: [
      "../shell/**",
      "../../shell/**",
      "../../../shell/**",
      "./shell/**",
      "src/shell/**",
      "shell/**",
    ],
    message: "CORE must not import from SHELL.",
  },
]);
