#!/usr/bin/env node
import { main } from "./run.mjs"

const result = main()

if (typeof result === "number") {
  process.exitCode = result
} else {
  result.then((exitCode) => {
    process.exitCode = exitCode
  })
}
