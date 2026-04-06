export const effectTypeRules = Object.freeze({
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/ban-ts-comment": [
    "error",
    {
      "ts-ignore": true,
      "ts-nocheck": true,
      "ts-check": false,
      "ts-expect-error": true
    }
  ],
  "@typescript-eslint/no-restricted-types": [
    "error",
    {
      types: {
        Promise: {
          message: "Avoid Promise in types. Use Effect.Effect<A, E, R>."
        },
        "Promise<*>": {
          message: "Avoid Promise<T>. Use Effect.Effect<T, E, R>."
        }
      }
    }
  ]
})
