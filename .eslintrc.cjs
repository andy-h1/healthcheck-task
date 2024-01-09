module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": [ "error" ],
    "no-shadow": "off",
    // "@typescript-eslint/no-shadow": [ "error" ],
    // "@typescript-eslint/explicit-function-return-type": [ "error", { "allowExpressions": true } ],
    "max-len": [ "warn", { "code": 120, "ignoreComments": true, "ignoreUrls": true } ],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "import/prefer-default-export": "off",
    "react/prop-types": "off",
    "no-prototype-builtins": "off",
    "prettier/prettier": [ "error", { "endOfLine": "auto" } ]
  },
}
