module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: ['xo', 'xo-typescript'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint'],
	rules: {
		// Managed by Prettier
		'@typescript-eslint/indent': 0,
		'@typescript-eslint/comma-dangle': 0,
		'@typescript-eslint/quotes': 0,
		'quote-props': 0,
		'operator-linebreak': 0,

		// Too strict
		'@typescript-eslint/ban-types': 0,
		'@typescript-eslint/prefer-literal-enum-member': 0,
	},
	ignorePatterns: ['**/*.js'],
};
