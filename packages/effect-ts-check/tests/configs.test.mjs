import assert from "node:assert/strict"
import test from "node:test"

import { minimal, strict } from "../src/index.mjs"
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

test("strict includes additional effect-eslint preset layers", () => {
  assert.ok(strict.length > minimal.length)
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
