import assert from "node:assert/strict"
import test from "node:test"

import { minimal, strict } from "../src/index.mjs"
import { lintSnippet } from "./helpers.mjs"

test("minimal exports a flat config array", () => {
  assert.ok(Array.isArray(minimal))
  assert.equal(minimal[0].name, "effect-ts-check/base")
  assert.equal(minimal[0].rules["no-restricted-syntax"][0], "error")
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
