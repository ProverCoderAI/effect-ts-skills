import { cpSync, mkdirSync, rmSync } from "node:fs"
import { join, resolve } from "node:path"

const repoRoot = resolve(new URL("..", import.meta.url).pathname)
const wrapperRoot = join(repoRoot, "plugins", "effect-ts-skills")

rmSync(wrapperRoot, { recursive: true, force: true })
mkdirSync(wrapperRoot, { recursive: true })

cpSync(join(repoRoot, ".codex-plugin"), join(wrapperRoot, ".codex-plugin"), {
  recursive: true,
})
cpSync(join(repoRoot, "skills"), join(wrapperRoot, "skills"), {
  recursive: true,
})
