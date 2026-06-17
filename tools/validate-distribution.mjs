import {
  existsSync,
  lstatSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { spawnSync } from "node:child_process"
import { join, resolve } from "node:path"
import { tmpdir } from "node:os"

const repoRoot = resolve(new URL("..", import.meta.url).pathname)
const pluginManifestPath = join(repoRoot, ".codex-plugin", "plugin.json")
const marketplacePath = join(repoRoot, ".agents", "plugins", "marketplace.json")
const skillDir = join(repoRoot, "skills", "effect-ts-guide")
const skillEntryPath = join(skillDir, "SKILL.md")
const skillAgentPath = join(skillDir, "agents", "openai.yaml")
const skillLintChecksPath = join(skillDir, "references", "lint-checks.md")
const skillScriptPath = join(skillDir, "scripts", "run-effect-ts-check.sh")
const skillAssetPath = join(
  skillDir,
  "assets",
  "effect-ts-check",
  "prover-coder-ai-effect-ts-check-0.1.0.tgz",
)
const repoLocalSkillPath = join(repoRoot, ".agents", "skills", "effect-ts-guide")
const repoLocalPluginPath = join(repoRoot, "plugins", "effect-ts-skills")
const packageDir = join(repoRoot, "packages", "effect-ts-check")
const packageSrcDir = join(packageDir, "src")

const pluginAllowedFields = new Set([
  "id",
  "name",
  "version",
  "description",
  "skills",
  "apps",
  "mcpServers",
  "interface",
  "author",
  "homepage",
  "repository",
  "license",
  "keywords",
])

function fail(message) {
  process.stderr.write(`${message}\n`)
  process.exitCode = 1
}

function assertPathExists(path, description) {
  if (!existsSync(path)) {
    fail(`${description} not found: ${path}`)
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"))
}

function assertNoUnknownPluginFields(manifest) {
  for (const field of Object.keys(manifest)) {
    if (!pluginAllowedFields.has(field)) {
      fail(`Unsupported plugin manifest field: ${field}`)
    }
  }
}

function assertPluginManifest() {
  assertPathExists(pluginManifestPath, "Plugin manifest")
  const manifest = readJson(pluginManifestPath)

  assertNoUnknownPluginFields(manifest)

  if (manifest.name !== "effect-ts-skills") {
    fail(`Unexpected plugin name: ${manifest.name}`)
  }

  if (manifest.skills !== "./skills/") {
    fail(`Unexpected plugin skills path: ${manifest.skills}`)
  }

  if (!Array.isArray(manifest.interface?.defaultPrompt)) {
    fail("Plugin manifest must define interface.defaultPrompt")
  }
}

function assertMarketplace() {
  assertPathExists(marketplacePath, "Repo plugin marketplace")
  const marketplace = readJson(marketplacePath)

  if (marketplace.name !== "effect-ts-skills") {
    fail(`Unexpected marketplace name: ${marketplace.name}`)
  }

  const plugin = marketplace.plugins?.find((entry) => entry.name === "effect-ts-skills")

  if (!plugin) {
    fail("Marketplace must include effect-ts-skills plugin entry")
    return
  }

  if (
    plugin.source?.source !== "local" ||
    plugin.source?.path !== "./plugins/effect-ts-skills"
  ) {
    fail("Marketplace effect-ts-skills source must point at plugins/effect-ts-skills")
  }

  if (plugin.policy?.installation !== "AVAILABLE") {
    fail("Marketplace effect-ts-skills policy.installation must be AVAILABLE")
  }

  if (plugin.policy?.authentication !== "ON_INSTALL") {
    fail("Marketplace effect-ts-skills policy.authentication must be ON_INSTALL")
  }

  if (plugin.category !== "Developer Tools") {
    fail("Marketplace effect-ts-skills category must be Developer Tools")
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

function assertRepoLocalPluginWrapper() {
  assertPathExists(repoLocalPluginPath, "Repo-local plugin entry")

  const stats = lstatSync(repoLocalPluginPath)

  if (!stats.isDirectory()) {
    fail(`Repo-local plugin entry must be a directory: ${repoLocalPluginPath}`)
    return
  }
}

function assertSkillAgentMetadata() {
  assertPathExists(skillAgentPath, "Skill OpenAI metadata")
  const agentMetadata = readFileSync(skillAgentPath, "utf8")

  if (!agentMetadata.includes("display_name:")) {
    fail("Skill OpenAI metadata must define interface.display_name")
  }

  if (!agentMetadata.includes("short_description:")) {
    fail("Skill OpenAI metadata must define interface.short_description")
  }

  if (!agentMetadata.includes("$effect-ts-guide")) {
    fail("Skill OpenAI metadata default prompt must mention $effect-ts-guide")
  }
}

function sectionBetween(contents, start, end) {
  const startIndex = contents.indexOf(start)
  const endIndex = contents.indexOf(end)

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    fail(`Unable to find documentation section ${start}`)
    return ""
  }

  return contents.slice(startIndex, endIndex)
}

function assertLintCheckDocs() {
  assertPathExists(skillLintChecksPath, "Skill lint checks reference")
  const contents = readFileSync(skillLintChecksPath, "utf8")
  const minimalSection = sectionBetween(contents, "## Minimal Profile", "## Strict Profile")
  const strictSection = sectionBetween(contents, "## Strict Profile", "## Editor Tooling Boundary")

  for (const expected of [
    "`async`",
    "`Promise`",
    "`try/catch`",
    "`switch`",
    "`require`",
    "`.jsx`",
    "`.mts`",
    "`.cts`",
  ]) {
    if (!minimalSection.includes(expected)) {
      fail(`Minimal profile docs must mention ${expected}`)
    }
  }

  for (const unexpected of ["direct host imports", "unsafe typing"]) {
    if (minimalSection.includes(unexpected)) {
      fail(`Minimal profile docs must not mention ${unexpected}`)
    }
  }

  for (const expected of [
    "direct host imports",
    "unsafe typing",
    "casts",
    "`unknown`",
    "`fetch`",
    "host API restrictions",
  ]) {
    if (!strictSection.includes(expected)) {
      fail(`Strict profile docs must mention ${expected}`)
    }
  }

  if (!contents.includes("Runtime execution boundaries")) {
    fail("Lint docs must call runtime execution boundaries manual review")
  }

  if (!contents.includes("CORE/SHELL import direction")) {
    fail("Lint docs must call CORE/SHELL import direction manual review")
  }
}

function listFiles(root) {
  const entries = []

  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name)

    if (entry.isDirectory()) {
      for (const child of listFiles(path)) {
        entries.push(join(entry.name, child))
      }
      continue
    }

    if (entry.isFile()) {
      entries.push(entry.name)
    }
  }

  return entries.sort()
}

function assertTreeMatches(sourceRoot, copyRoot, description) {
  const sourceFiles = listFiles(sourceRoot)
  const copyFiles = listFiles(copyRoot)

  if (sourceFiles.join("\n") !== copyFiles.join("\n")) {
    fail(`${description} file list is out of sync`)
    return
  }

  for (const file of sourceFiles) {
    const source = readFileSync(join(sourceRoot, file))
    const copy = readFileSync(join(copyRoot, file))

    if (!source.equals(copy)) {
      fail(`${description} is out of sync for ${file}`)
    }
  }
}

function stableJson(value) {
  if (Array.isArray(value)) {
    return value.map(stableJson)
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, stableJson(entry)]),
    )
  }

  return value
}

function assertPackageManifestSync(extractedPackage) {
  const source = stableJson(readJson(join(packageDir, "package.json")))
  const bundled = stableJson(readJson(join(extractedPackage, "package.json")))

  if (JSON.stringify(source) !== JSON.stringify(bundled)) {
    fail("Bundled effect-ts-check package.json is out of sync")
  }
}

function assertPluginWrapperSync() {
  assertTreeMatches(
    join(repoRoot, ".codex-plugin"),
    join(repoLocalPluginPath, ".codex-plugin"),
    "Plugin wrapper manifest",
  )
  assertTreeMatches(
    join(repoRoot, "skills"),
    join(repoLocalPluginPath, "skills"),
    "Plugin wrapper skills",
  )
}

function assertTarballSync() {
  const tmpRoot = mkdtempSync(join(tmpdir(), "effect-ts-check-asset-"))

  try {
    const result = spawnSync("tar", ["-xzf", skillAssetPath, "-C", tmpRoot], {
      encoding: "utf8",
    })

    if (result.status !== 0) {
      fail(result.stderr.trim() || "Unable to extract bundled effect-ts-check asset")
      return
    }

    const extractedPackage = join(tmpRoot, "package")
    assertPackageManifestSync(extractedPackage)

    const packageFiles = listFiles(packageSrcDir)
    const tarballFiles = listFiles(join(extractedPackage, "src"))

    if (packageFiles.join("\n") !== tarballFiles.join("\n")) {
      fail("Bundled effect-ts-check asset src file list is out of sync")
      return
    }

    for (const file of packageFiles) {
      const source = readFileSync(join(packageSrcDir, file), "utf8")
      const bundled = readFileSync(join(extractedPackage, "src", file), "utf8")

      if (source !== bundled) {
        fail(`Bundled effect-ts-check asset is out of sync for src/${file}`)
      }
    }
  } finally {
    rmSync(tmpRoot, { recursive: true, force: true })
  }
}

function assertBundledWrapperRuns() {
  const tmpRoot = mkdtempSync(join(repoRoot, ".tmp-effect-check-"))
  const fixture = join(tmpRoot, "fail.mts")

  try {
    writeFileSync(
      fixture,
      "async function demo() {\n  await Promise.resolve(1)\n}\n\ndemo()\n",
    )
    const result = spawnSync("bash", [skillScriptPath, fixture], {
      cwd: repoRoot,
      encoding: "utf8",
    })

    if (result.status !== 1) {
      fail(`Bundled wrapper should reject fixture, got exit ${result.status}`)
    }

    if (!result.stdout.includes("no-restricted-syntax")) {
      fail("Bundled wrapper output should include no-restricted-syntax")
    }
  } finally {
    rmSync(tmpRoot, { recursive: true, force: true })
  }
}

function main() {
  assertPluginManifest()
  assertMarketplace()
  assertPathExists(skillEntryPath, "Skill entrypoint")
  assertPathExists(skillScriptPath, "Bundled skill wrapper")
  assertPathExists(skillAssetPath, "Bundled effect-ts-check asset")
  assertRepoLocalSkillLink()
  assertRepoLocalPluginWrapper()
  assertPluginWrapperSync()
  assertSkillAgentMetadata()
  assertLintCheckDocs()
  assertTarballSync()
  assertBundledWrapperRuns()
}

main()
