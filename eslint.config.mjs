/**
 * This is a basic starting point for linting as used in the Indie Stack.
 */
import js from "@eslint/js";

/** @type {import('eslint').Linter.Config} */
export default [
  js.configs.recommended,
  {
    ignores: ["node_modules/*", "build/*", "public/build/*"],
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },

      globals: {
        browser: true,
        commonjs: true,
        es6: true,
      },
    },
    plugins: {
      node: {
        files: ["eslint.config.mjs", "mocks/**/*.js"],
        env: {
          node: true,
        },
      },

      react: {
        files: ["**/*.{js,jsx,ts,tsx}"],
        plugins: ["react", "jsx-a11y"],
        extends: [
          "plugin:react/recommended",
          "plugin:react/jsx-runtime",
          "plugin:react-hooks/recommended",
          "plugin:jsx-a11y/recommended",
          "prettier",
        ],
        settings: {
          react: {
            version: "detect",
          },
          formComponents: ["Form"],
          linkComponents: [
            { name: "Link", linkAttribute: "to" },
            { name: "NavLink", linkAttribute: "to" },
          ],
        },
        rules: {},
      },

      typescript: {
        files: ["**/*.{ts,tsx}"],
        plugins: ["@typescript-eslint", "import"],
        parser: "@typescript-eslint/parser",
        settings: {
          "import/internal-regex": "^~/",
          "import/resolver": {
            node: {
              extensions: [".ts", ".tsx"],
            },
            typescript: {
              alwaysTryTypes: true,
            },
          },
        },
        extends: [
          "plugin:@typescript-eslint/recommended",
          "plugin:@typescript-eslint/stylistic",
          "plugin:import/recommended",
          "plugin:import/typescript",
          "prettier",
        ],
        rules: {
          "import/order": [
            "error",
            {
              alphabetize: { caseInsensitive: true, order: "asc" },
              groups: ["builtin", "external", "internal", "parent", "sibling"],
              "newlines-between": "always",
            },
          ],
          "jsx-a11y/no-autofocus": "off",
        },
      },

      markdown: {
        files: ["**/*.md"],
        plugins: ["markdown"],
        extends: ["plugin:markdown/recommended", "prettier"],
      },

      vitest: {
        files: ["**/*.test.{js,jsx,ts,tsx}"],
        plugins: ["jest", "jest-dom", "testing-library"],
        extends: [
          "plugin:jest/recommended",
          "plugin:jest-dom/recommended",
          "plugin:testing-library/react",
          "prettier",
        ],
        env: {
          "jest/globals": true,
        },
        settings: {
          jest: {
            // we're using vitest which has a very similar API to jest
            // (so the linting plugins work nicely), but it means we have to explicitly
            // set the jest version.
            version: 28,
          },
        },
      },

      cypress: {
        files: ["cypress/**/*.ts"],
        plugins: ["cypress"],
        extends: ["plugin:cypress/recommended", "prettier"],
      },
    },
  },
];
