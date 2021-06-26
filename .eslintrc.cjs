module.exports = {
  root: true,
	parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['tsconfig.lint.json'],
  },
	env: {
		node: true,
	},
	plugins: ["@typescript-eslint"],
	extends: ["xo", "xo-typescript", "prettier"],
	rules: {
		"@typescript-eslint/ban-types": 0,
		"@typescript-eslint/prefer-literal-enum-member": 0,
		"no-eq-null": 0,
		"eqeqeq": ["error", "smart"],
		"capitalized-comments": 0,
	},
	ignorePatterns: ["**/*.js"],
};
