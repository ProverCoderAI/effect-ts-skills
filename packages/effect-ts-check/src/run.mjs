import { ESLint } from "eslint"

import { minimal } from "./minimal.mjs"
import { strict } from "./strict.mjs"

export function parseArguments(argv) {
  const result = {
    profile: "minimal",
    targets: [],
    help: false
  }

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]

    if (value === "--help" || value === "-h") {
      result.help = true
      continue
    }

    if (value === "--profile" || value === "-p") {
      result.profile = argv[index + 1] ?? "minimal"
      index += 1
      continue
    }

    if (value.startsWith("--profile=")) {
      result.profile = value.slice("--profile=".length)
      continue
    }

    result.targets.push(value)
  }

  if (result.targets.length === 0) {
    result.targets.push(".")
  }

  return result
}

export function getProfileConfig(profile) {
  if (profile === "strict") {
    return strict
  }

  if (profile === "minimal") {
    return minimal
  }

  throw new Error(`Unknown profile: ${profile}`)
}

export function printUsage() {
  process.stdout.write(
    [
      "Usage:",
      "  effect-ts-check [paths...]",
      "  effect-ts-check --profile strict [paths...]",
      "",
      "Profiles:",
      "  minimal  Default fast effect compliance check.",
      "  strict   Adds import/type/runtime policy checks.",
      ""
    ].join("\n")
  )
}

export async function lintPaths({ profile, targets }) {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: getProfileConfig(profile)
  })

  const results = await eslint.lintFiles(targets)
  const formatter = await eslint.loadFormatter("stylish")
  const output = formatter.format(results)

  if (output.trim().length > 0) {
    process.stdout.write(output.endsWith("\n") ? output : `${output}\n`)
  }

  const errorCount = results.reduce(
    (total, result) => total + result.errorCount + result.fatalErrorCount,
    0
  )

  return {
    errorCount,
    results
  }
}

export async function main(argv = process.argv.slice(2)) {
  const parsed = parseArguments(argv)

  if (parsed.help) {
    printUsage()
    return 0
  }

  try {
    const { errorCount } = await lintPaths(parsed)
    return errorCount > 0 ? 1 : 0
  } catch (error) {
    const message = error instanceof Error ? error.stack ?? error.message : String(error)
    process.stderr.write(`${message}\n`)
    return 2
  }
}
