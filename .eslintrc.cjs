module.exports = {
	parser: "@typescript-eslint/parser",
	env: {
		node: true,
	},
	plugins: ["@typescript-eslint"],
	extends: ["xo", "xo-typescript", "prettier"],
	rules: {
		"@typescript-eslint/ban-types": 0,
		"@typescript-eslint/prefer-literal-enum-member": 0,
		"@typescript-eslint/naming-convention": 0,
		"@typescript-eslint/parameter-properties": 0,
		"no-bitwise": 0,
		"no-eq-null": 0,
		"eqeqeq": ["error", "smart"],
		"capitalized-comments": 0,
		"no-await-in-loop": 0,
		"max-params": 0,
		"complexity": 0,
	},
};
