import { defineConfig } from 'oxlint';
import astro from 'ultracite/oxlint/astro';
import core from 'ultracite/oxlint/core';

export default defineConfig({
  extends: [core, astro],
  ignorePatterns: core.ignorePatterns,
  overrides: [
    {
      // Astro components are conventionally PascalCase.
      files: ['**/*.astro'],
      rules: {
        'unicorn/filename-case': 'off',
      },
    },
  ],
});
