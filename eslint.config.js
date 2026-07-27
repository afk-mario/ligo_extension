import path from 'node:path';
import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import { createNodeResolver, flatConfigs as importX } from 'eslint-plugin-import-x';
import prettier from 'eslint-plugin-prettier/recommended';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(root, 'src');

export default defineConfig([
  {
    ignores: ['dist/**', 'build/**', 'node_modules/**'],
  },
  js.configs.recommended,
  importX.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.webextensions,
        browser: 'readonly',
        chrome: 'readonly',
      },
    },
    plugins: {
      unicorn,
    },
    settings: {
      'import-x/resolver-next': [
        createNodeResolver({
          alias: {
            lib: [path.join(src, 'lib')],
            containers: [path.join(src, 'containers')],
            components: [path.join(src, 'components')],
          },
        }),
      ],
    },
    rules: {
      'no-console': 'off',
      'no-param-reassign': 'off',
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
        },
      ],
    },
  },
  {
    files: ['**/*.test.js'],
    rules: {
      'no-unused-expressions': 'off',
    },
  },
  {
    files: ['scripts/**', 'eslint.config.js', 'prettier.config.js'],
    rules: {
      'unicorn/filename-case': 'off',
      'import-x/no-extraneous-dependencies': 'off',
    },
  },
  prettier,
]);
