module.exports = {
  env: {
    "node": true,
    "jest/globals": true,
  },
  extends: [
    "airbnb-base",
    "plugin:jest/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "babel-eslint",
  plugins: ["jest"],
  rules: {
    "class-methods-use-this": 0,
    "import/prefer-default-export": 0,
    "import/no-cycle": 0,
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          // repos with a single test file
          "test.{cjs,js,jsx}",
          // tests where the extension denotes that it is a test
          "**/*.test.{cjs,js,jsx}",
          // config files
          "**/jest.config.{cjs,js}",
          "**/jest.setup.{cjs,js}",
        ],
        optionalDependencies: false,
      },
    ],
  },
};
