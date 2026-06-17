import assert from "node:assert/strict"
import test from "node:test"

import { minimal, strict, strictFormat } from "../src/index.mjs"
import { lintSnippet } from "./helpers.mjs"

test("minimal exports a flat config array", () => {
  assert.ok(Array.isArray(minimal))
  const baseEntry = minimal.find((entry) => entry.name === "effect-ts-check/base")
  assert.ok(baseEntry)
  assert.equal(baseEntry.rules["no-restricted-syntax"][0], "error")
})

test("minimal rejects effect-unsafe syntax", async () => {
  const [result] = await lintSnippet(
    minimal,
    "async function demo() { await Promise.resolve(1) }",
    "demo.js"
  )

  assert.ok(result.messages.some((message) => message.ruleId === "no-restricted-syntax"))
})

test("strict adds import and type policy", async () => {
  const [result] = await lintSnippet(
    strict,
    [
      'import fs from "fs"',
      "const value: any = 1",
      "console.log(value)"
    ].join("\n"),
    "demo.ts"
  )

  const ruleIds = result.messages.map((message) => message.ruleId)

  assert.ok(ruleIds.includes("no-restricted-imports"))
  assert.ok(ruleIds.includes("@typescript-eslint/no-explicit-any"))
  assert.ok(ruleIds.includes("no-console"))
})

test("strict retains minimal syntax policy", async () => {
  const [result] = await lintSnippet(
    strict,
    "async function demo() { await Promise.resolve(1) }",
    "demo.ts"
  )

  assert.ok(result.messages.some((message) => message.ruleId === "no-restricted-syntax"))
})

test("strict adds additional compliance layers", () => {
  assert.ok(strict.length > minimal.length)
})

test("strict-format adds the effect dprint preset separately", () => {
  assert.ok(strictFormat.length > strict.length)
  assert.ok(
    strictFormat.some((entry) =>
      entry.rules && Object.hasOwn(entry.rules, "@effect/dprint")
    )
  )
  assert.ok(
    strict.every((entry) =>
      !entry.rules || !Object.hasOwn(entry.rules, "@effect/dprint")
    )
  )
})

test("minimal leaves import and type policy to strict", async () => {
  const [result] = await lintSnippet(
    minimal,
    ['import fs from "node:fs"', "const value: any = 1", "console.log(fs, value)"].join("\n"),
    "demo.ts"
  )

  const ruleIds = result.messages.map((message) => message.ruleId)

  assert.ok(!ruleIds.includes("no-restricted-imports"))
  assert.ok(!ruleIds.includes("@typescript-eslint/no-explicit-any"))
})

test("minimal applies to common module extensions", async () => {
  for (const filePath of ["demo.jsx", "demo.mts", "demo.cts"]) {
    const [result] = await lintSnippet(
      minimal,
      "async function demo() { await Promise.resolve(1) }",
      filePath
    )

    assert.ok(
      result.messages.some((message) => message.ruleId === "no-restricted-syntax"),
      `${filePath} should be checked`
    )
  }
})

test("strict applies to common module extensions", async () => {
  for (const filePath of ["demo.jsx", "demo.mts", "demo.cts"]) {
    const [result] = await lintSnippet(
      strict,
      "async function demo() { await Promise.resolve(1); console.log(1) }",
      filePath
    )
    const ruleIds = result.messages.map((message) => message.ruleId)

    assert.ok(ruleIds.includes("no-restricted-syntax"), `${filePath} should keep syntax checks`)
    assert.ok(ruleIds.includes("no-console"), `${filePath} should keep strict checks`)
  }
})

test("strict rejects eslint disable comments", async () => {
  const [result] = await lintSnippet(
    strict,
    "/* eslint-disable no-console */\nconsole.log(1)\n",
    "demo.ts"
  )

  const ruleIds = result.messages.map((message) => message.ruleId)

  assert.ok(ruleIds.includes("eslint-comments/no-use"))
})

test("strict rejects direct fetch", async () => {
  const [result] = await lintSnippet(
    strict,
    "fetch('https://example.com')\n",
    "demo.ts"
  )

  assert.ok(result.messages.some((message) => message.ruleId === "no-restricted-syntax"))
})

test("strict rejects thrown literals without typed linting", async () => {
  const [result] = await lintSnippet(
    strict,
    "throw 'BadError: failed'\n",
    "demo.ts"
  )

  assert.ok(result.messages.some((message) => message.ruleId === "no-throw-literal"))
})

test("strict keeps runtime execution at shell boundaries", async () => {
  const coreResult = await lintSnippet(
    strict,
    "Effect.runPromise(Effect.succeed(1))\n",
    "src/core/program.ts"
  )
  const shellResult = await lintSnippet(
    strict,
    "Effect.runPromise(Effect.succeed(1))\n",
    "src/shell/program.ts"
  )

  assert.ok(
    coreResult[0].messages.some((message) => message.ruleId === "no-restricted-syntax")
  )
  assert.ok(
    shellResult[0].messages.every((message) => message.ruleId !== "no-restricted-syntax")
  )
})

test("strict blocks core imports from shell", async () => {
  const [result] = await lintSnippet(
    strict,
    'import { service } from "../shell/service"\nexport { service }\n',
    "src/core/usecase.ts"
  )

  assert.ok(result.messages.some((message) => message.ruleId === "no-restricted-imports"))
})

test("strict keeps casts inside the axioms boundary", async () => {
  const coreResult = await lintSnippet(
    strict,
    "const value = input as string\n",
    "src/core/usecase.ts"
  )
  const axiomsResult = await lintSnippet(
    strict,
    "const value = input as string\n",
    "src/core/axioms.ts"
  )

  assert.ok(
    coreResult[0].messages.some((message) => message.ruleId === "no-restricted-syntax")
  )
  assert.ok(
    axiomsResult[0].messages.every((message) => message.ruleId !== "no-restricted-syntax")
  )
})

test("strict keeps catchAll out of core while allowing outer handlers", async () => {
  const coreResult = await lintSnippet(
    strict,
    "const handler = Effect.catchAll(() => Effect.succeed(1))\n",
    "src/core/usecase.ts"
  )
  const apiResult = await lintSnippet(
    strict,
    "const handler = Effect.catchAll(() => Effect.succeed(1))\n",
    "src/api/http.ts"
  )

  assert.ok(
    coreResult[0].messages.some((message) => message.ruleId === "no-restricted-syntax")
  )
  assert.ok(
    apiResult[0].messages.every((message) => message.ruleId !== "no-restricted-syntax")
  )
})

test("minimal ignores nested tests and fixtures", async () => {
  const [testResult] = await lintSnippet(
    minimal,
    "async function demo() { await Promise.resolve(1) }",
    "packages/demo/tests/nested.test.js"
  )
  const [fixtureResult] = await lintSnippet(
    minimal,
    "async function demo() { await Promise.resolve(1) }",
    "packages/demo/tests/fixtures/fail.js"
  )

  assert.equal(testResult.errorCount, 0)
  assert.equal(fixtureResult.errorCount, 0)
  assert.ok(testResult.messages.every((message) => message.ruleId !== "no-restricted-syntax"))
  assert.ok(fixtureResult.messages.every((message) => message.ruleId !== "no-restricted-syntax"))
})
