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
    exclude: [
      'node_modules/',
      'tests/e2e/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        'tests/e2e/**',
        'tests/',
        '**/*.config.js',
        '**/*.config.ts',
        '**/mockData.js',
      ],
      // Coverage thresholds - tests will fail if coverage drops below these
      thresholds: {
        statements: 50,
        branches: 25,
        functions: 65,
        lines: 50,
      },
    }
  }
});