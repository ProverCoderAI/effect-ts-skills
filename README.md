# effect-ts-skills

Reusable Effect-TS skills and compliance tooling for [Codex](https://github.com/openai/codex).

## Skills

| Skill | Path | Description |
|-------|------|-------------|
| [effect-ts-guide](skills/effect-ts-guide/SKILL.md) | `skills/effect-ts-guide` | Effect-TS guidance for architecture, typed errors, Layers, boundary validation, resource safety, compliance checks, and editor tooling. |

## Standalone Skill Installation

Use this path when you only want the `effect-ts-guide` skill in your local Codex setup.

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo ProverCoderAI/effect-ts-skills \
  --path skills/effect-ts-guide
```

### Standalone Skill Update / Reinstall

The skill installer does not overwrite an existing installation.
To update to the latest version, remove the previous copy first:

```bash
rm -rf ~/.codex/skills/effect-ts-guide

python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo ProverCoderAI/effect-ts-skills \
  --path skills/effect-ts-guide
```

### Verify

After installation, the skill entry point should exist at:

```
~/.codex/skills/effect-ts-guide/SKILL.md
```

Start a new Codex thread after installing or updating so the skill list is refreshed.

## Plugin Installation

Use this path when you want Codex to install the plugin bundle through a marketplace.

```bash
codex plugin marketplace add ProverCoderAI/effect-ts-skills
codex plugin add effect-ts-skills@effect-ts-skills
```

For local development from a checkout:

```bash
codex plugin marketplace add .
codex plugin add effect-ts-skills@effect-ts-skills
```

The marketplace entry points at `plugins/effect-ts-skills`, a generated plugin wrapper synchronized from the root manifest and skills directory by `corepack pnpm run sync:plugin-wrapper`.

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
skills/effect-ts-guide/   # Publishable skill (SKILL.md + bundled assets)
plugins/effect-ts-skills/ # Marketplace plugin wrapper generated from root files
packages/effect-ts-check/  # Reusable Effect-TS compliance CLI
tools/                     # Repo-level validation scripts
```

## License

ISC
