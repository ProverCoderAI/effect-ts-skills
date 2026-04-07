import { existsSync, lstatSync, readFileSync, realpathSync } from "node:fs"
import { join, resolve } from "node:path"

const repoRoot = resolve(new URL("..", import.meta.url).pathname)
const pluginManifestPath = join(repoRoot, ".codex-plugin", "plugin.json")
const skillDir = join(repoRoot, "skills", "effect-ts-guide")
const skillEntryPath = join(skillDir, "SKILL.md")
const skillScriptPath = join(skillDir, "scripts", "run-effect-ts-check.sh")
const skillAssetPath = join(
  skillDir,
  "assets",
  "effect-ts-check",
  "prover-coder-ai-effect-ts-check-0.1.0.tgz",
)
const repoLocalSkillPath = join(repoRoot, ".agents", "skills", "effect-ts-guide")

function fail(message) {
  process.stderr.write(`${message}\n`)
  process.exitCode = 1
}

function assertPathExists(path, description) {
  if (!existsSync(path)) {
    fail(`${description} not found: ${path}`)
  }
}

function assertPluginManifest() {
  assertPathExists(pluginManifestPath, "Plugin manifest")
  const manifest = JSON.parse(readFileSync(pluginManifestPath, "utf8"))

  if (manifest.name !== "effect-ts-skills") {
    fail(`Unexpected plugin name: ${manifest.name}`)
  }

  if (manifest.skills !== "./skills/") {
    fail(`Unexpected plugin skills path: ${manifest.skills}`)
  }
}

function assertRepoLocalSkillLink() {
  assertPathExists(repoLocalSkillPath, "Repo-local skill entry")

  const stats = lstatSync(repoLocalSkillPath)

  if (!stats.isSymbolicLink()) {
    fail(`Repo-local skill entry must be a symlink: ${repoLocalSkillPath}`)
    return
  }

  if (realpathSync(repoLocalSkillPath) !== realpathSync(skillDir)) {
    fail(`Repo-local skill symlink must resolve to ${skillDir}`)
  }
}

function main() {
  assertPluginManifest()
  assertPathExists(skillEntryPath, "Skill entrypoint")
  assertPathExists(skillScriptPath, "Bundled skill wrapper")
  assertPathExists(skillAssetPath, "Bundled effect-ts-check asset")
  assertRepoLocalSkillLink()
}

main()
