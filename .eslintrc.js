module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: {
    "node": true,
    "jest/globals": true
  },
  plugins: ["@typescript-eslint", "jest"],
  extends: [
    "eslint:recommended",
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "prettier"
  ],
  parserOptions: {
    project: "./tsconfig.json"
  }
};
