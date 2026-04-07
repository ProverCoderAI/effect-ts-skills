import { ESLint } from "eslint"

export async function lintSnippet(config, code, filePath) {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: config
  })

  return eslint.lintText(code, {
    filePath
  })
}
