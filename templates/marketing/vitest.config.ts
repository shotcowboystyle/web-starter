import path from 'node:path';

import react from '@vitejs/plugin-react';
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
    environment: 'jsdom',
    exclude: ['**/node_modules/**', '**/dist/**', 'tests/**'],
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
