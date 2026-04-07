# effect-ts-skills

Reusable Effect-TS skills and compliance tooling for [Codex](https://github.com/openai/codex).

## Skills

| Skill | Path | Description |
|-------|------|-------------|
| [effect-ts-guide](skills/effect-ts-guide/SKILL.md) | `skills/effect-ts-guide` | Effect-TS guidance for architecture, typed errors, Layers, boundary validation, resource safety, compliance checks, and editor tooling. |

## Installation

### First install

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo ProverCoderAI/effect-ts-skills \
  --path skills/effect-ts-guide
```

### Update / Reinstall

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

## Development

This repository is a [pnpm workspace](https://pnpm.io/workspaces).

```bash
pnpm install
pnpm run check
```

### Structure

```
skills/effect-ts-guide/   # Publishable skill (SKILL.md + bundled assets)
packages/effect-ts-check/  # Reusable Effect-TS compliance CLI
tools/                     # Repo-level validation scripts
```

## License

ISC
