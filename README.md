# effect-ts-skills

Reusable Effect-TS skills and compliance tooling for [Codex](https://github.com/openai/codex).

## Plugin

This repository publishes one Codex plugin:

| Plugin | Path | Bundled skill |
|--------|------|---------------|
| `effect-ts-skills` | `plugins/effect-ts-skills` | `effect-ts-guide` |

The `effect-ts-guide` skill is intentionally kept inside the plugin. There is no separate root-level standalone skill copy.

## Installation

```bash
codex plugin marketplace add ProverCoderAI/effect-ts-skills
codex plugin add effect-ts-skills@effect-ts-skills
```

For local development from a checkout:

```bash
codex plugin marketplace add .
codex plugin add effect-ts-skills@effect-ts-skills
```

The repo marketplace entry points at `plugins/effect-ts-skills`, which is the canonical plugin directory.

After installation, start a new Codex thread and invoke the skill explicitly with `$effect-ts-guide` or ask for an Effect-TS implementation/review task.

## Development

This repository is a [pnpm workspace](https://pnpm.io/workspaces).

```bash
corepack pnpm install
corepack pnpm run sync:distribution
corepack pnpm run check
```

### Structure

```
plugins/effect-ts-skills/  # Installable Codex plugin with bundled effect-ts-guide skill
packages/effect-ts-check/  # Reusable Effect-TS compliance CLI
tools/                     # Repo-level validation scripts
```

## License

ISC
