import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',

    include: ['tests/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/tests/e2e/**',
    ],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        '**/node_modules/**',
        'src/test/**',
        'tests/**',
        '**/*.config.*',
        '**/mockData.js',
      ],
      thresholds: {
        statements: 25,
        branches: 25,
        functions: 25,
        lines: 25,
      },
    },
  },
});
