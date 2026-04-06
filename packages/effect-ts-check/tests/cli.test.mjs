import assert from "node:assert/strict"
import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { spawnSync } from "node:child_process"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import test from "node:test"

const packageDir = fileURLToPath(new URL("..", import.meta.url))
const cliPath = fileURLToPath(new URL("../src/cli.mjs", import.meta.url))

function writeTempFixture(name, contents) {
  const root = mkdtempSync(join(packageDir, "tmp-fixture-"))
  const path = join(root, name)
  writeFileSync(path, contents)
  return {
    path,
    cleanup: () => rmSync(root, { recursive: true, force: true })
  }
}

test("cli passes on clean input with minimal profile", () => {
  const fixture = writeTempFixture("pass.js", "const value = 1\nexport { value }\n")
  const result = spawnSync(process.execPath, [cliPath, fixture.path], {
    cwd: packageDir,
    encoding: "utf8"
  })
  fixture.cleanup()

  assert.equal(result.status, 0)
  assert.equal(result.stdout, "")
  assert.equal(result.stderr, "")
})

test("cli fails on effect violations", () => {
  const fixture = writeTempFixture(
    "fail.js",
    "async function demo() {\n  await Promise.resolve(1)\n}\n\ndemo()\n"
  )
  const result = spawnSync(process.execPath, [cliPath, fixture.path], {
    cwd: packageDir,
    encoding: "utf8"
  })
  fixture.cleanup()

  assert.notEqual(result.status, 0)
  assert.match(result.stdout, /no-restricted-syntax/)
})

test("cli supports strict profile", () => {
  const fixture = writeTempFixture(
    "fail.ts",
    ['import fs from "fs"', "const value: any = 1", "console.log(fs, value)"].join("\n")
  )
  const result = spawnSync(
    process.execPath,
    [cliPath, "--profile", "strict", fixture.path],
    {
      cwd: packageDir,
      encoding: "utf8"
    }
  )
  fixture.cleanup()

  assert.notEqual(result.status, 0)
  assert.match(result.stdout, /no-restricted-imports|@typescript-eslint\/no-explicit-any|no-console/)
})

test("cli rejects unknown profiles", () => {
  const result = spawnSync(process.execPath, [cliPath, "--profile", "weird"], {
    cwd: packageDir,
    encoding: "utf8"
  })

  assert.equal(result.status, 2)
  assert.match(result.stderr, /Unknown profile: weird/)
})
