import { ESLint } from "eslint";

import { minimal } from "./minimal.mjs";
import { strict } from "./strict.mjs";
import { strictFormat } from "./strict-format.mjs";

export function parseArguments(argv) {
  const result = {
    profile: "minimal",
    targets: [],
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === "--help" || value === "-h") {
      result.help = true;
      continue;
    }

    if (value === "--profile" || value === "-p") {
      result.profile = argv[index + 1] ?? "minimal";
      index += 1;
      continue;
    }

    if (value.startsWith("--profile=")) {
      result.profile = value.slice("--profile=".length);
      continue;
    }

    result.targets.push(value);
  }

  if (result.targets.length === 0) {
    result.targets.push(".");
  }

  return result;
}

export function getProfileConfig(profile) {
  if (profile === "strict-format") {
    return strictFormat;
  }

  if (profile === "strict") {
    return strict;
  }

  if (profile === "minimal") {
    return minimal;
  }

  throw new Error(`Unknown profile: ${profile}`);
}

function resolveProfileConfig(profile) {
  if (profile === "strict-format") {
    return {
      ok: true,
      config: strictFormat,
    };
  }

  if (profile === "strict") {
    return {
      ok: true,
      config: strict,
    };
  }

  if (profile === "minimal") {
    return {
      ok: true,
      config: minimal,
    };
  }

  return {
    ok: false,
    message: `Unknown profile: ${profile}`,
  };
}

export function printUsage() {
  process.stdout.write(
    [
      "Usage:",
      "  effect-ts-check [paths...]",
      "  effect-ts-check --profile strict [paths...]",
      "  effect-ts-check --profile strict-format [paths...]",
      "",
      "Profiles:",
      "  minimal  Default fast effect compliance check.",
      "  strict   Adds import/type/host API and Effect boundary policy checks.",
      "  strict-format",
      "           Runs strict plus the official @effect/dprint formatting preset.",
      "",
    ].join("\n"),
  );
}

function formatResults(eslint, results) {
  return eslint.loadFormatter("stylish").then((formatter) => {
    const output = formatter.format(results);

    if (output.trim().length > 0) {
      process.stdout.write(output.endsWith("\n") ? output : `${output}\n`);
    }

    const errorCount = results.reduce(
      (total, result) => total + result.errorCount + result.fatalErrorCount,
      0,
    );

    return {
      errorCount,
      results,
    };
  });
}

export function lintPaths({ profile, targets }) {
  const resolvedProfile = resolveProfileConfig(profile);
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: resolvedProfile.ok ? resolvedProfile.config : getProfileConfig(profile),
  });

  return eslint.lintFiles(targets).then((results) => formatResults(eslint, results));
}

function formatFailure(error) {
  return error instanceof Error ? error.stack ?? error.message : String(error);
}

export function main(argv = process.argv.slice(2)) {
  const parsed = parseArguments(argv);

  if (parsed.help) {
    printUsage();
    return 0;
  }

  const resolvedProfile = resolveProfileConfig(parsed.profile);

  if (!resolvedProfile.ok) {
    process.stderr.write(`${resolvedProfile.message}\n`);
    return 2;
  }

  return lintPaths(parsed).then(
    ({ errorCount }) => (errorCount > 0 ? 1 : 0),
    (error) => {
      process.stderr.write(`${formatFailure(error)}\n`);
      return 2;
    },
  );
}
