export const effectSyntaxRestrictions = Object.freeze([
  {
    selector: "SwitchStatement",
    message: "Use Effect.Match instead of switch.",
  },
  {
    selector: "TryStatement",
    message: "Use Effect.try / Effect.catch* instead of try/catch.",
  },
  {
    selector: "AwaitExpression",
    message: "Use Effect.gen / Effect.flatMap instead of await.",
  },
  {
    selector: "FunctionDeclaration[async=true], FunctionExpression[async=true], ArrowFunctionExpression[async=true]",
    message: "Use Effect.gen / Effect.tryPromise instead of async/await.",
  },
  {
    selector: "NewExpression[callee.name='Promise']",
    message: "Use Effect.async / Effect.tryPromise instead of new Promise.",
  },
  {
    selector: "CallExpression[callee.object.name='Promise']",
    message: "Use Effect combinators instead of Promise.*.",
  },
  {
    selector: "CallExpression[callee.name='require']",
    message: "Use ES module imports instead of require().",
  },
]);

export const effectStrictSyntaxRestrictions = Object.freeze([
  {
    selector: "CallExpression[callee.name='fetch']",
    message: "Use @effect/platform HttpClient instead of fetch.",
  },
  {
    selector: "CallExpression[callee.object.name='window'][callee.property.name='fetch']",
    message: "Use @effect/platform HttpClient instead of window.fetch.",
  },
  {
    selector: "CallExpression[callee.object.name='globalThis'][callee.property.name='fetch']",
    message: "Use @effect/platform HttpClient instead of globalThis.fetch.",
  },
  {
    selector: "CallExpression[callee.object.name='self'][callee.property.name='fetch']",
    message: "Use @effect/platform HttpClient instead of self.fetch.",
  },
  {
    selector: "CallExpression[callee.object.name='global'][callee.property.name='fetch']",
    message: "Use @effect/platform HttpClient instead of global.fetch.",
  },
  {
    selector: "CallExpression[callee.property.name='catchAll']",
    message: "Avoid catchAll that swallows typed errors; map or rethrow explicitly.",
  },
  {
    selector: "CallExpression[callee.property.name='runSync']",
    message: "Use Effect.runSync only at shell boundaries.",
  },
  {
    selector: "CallExpression[callee.property.name='runSyncExit']",
    message: "Use Effect.runSyncExit only at shell boundaries.",
  },
  {
    selector: "CallExpression[callee.property.name='runPromise']",
    message: "Use Effect.runPromise only at shell boundaries.",
  },
  {
    selector: "TSAsExpression",
    message: "Avoid casts in product code; keep them in one axioms boundary if needed.",
  },
  {
    selector: "TSTypeAssertion",
    message: "Avoid casts in product code; keep them in one axioms boundary if needed.",
  },
  {
    selector: "TSUnknownKeyword",
    message: "Use unknown only at shell boundaries with decoding.",
  },
]);
