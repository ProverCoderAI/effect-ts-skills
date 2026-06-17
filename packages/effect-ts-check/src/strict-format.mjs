import * as effectEslint from "@effect/eslint-plugin";

import { strict } from "./strict.mjs";

export const strictFormat = [
  ...strict,
  ...effectEslint.configs.dprint,
];

export default strictFormat;
