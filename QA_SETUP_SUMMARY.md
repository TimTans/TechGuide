# TechGuide QA Testing Setup - Summary

## What's Been Completed

### 1. Testing Infrastructure Installed
- Playwright (browser testing)
- Vitest (unit/integration testing)
- React Testing Library
- All system dependencies

### 2. Test Directories Created
```
tests/
├── e2e/           # End-to-end browser tests
├── integration/   # Integration tests (API, health checks)
└── unit/          # Unit tests (components, functions)
```

### 3. Configuration Files
- `vitest.config.js` - Unit/integration test config
- `playwright.config.js` - Browser test config
- `src/test/setup.js` - Test utilities setup

### 4. Test Scripts Available
- `npm test` - Run all unit/integration tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run browser tests
- `npm run test:e2e:ui` - Run browser tests with visual UI
- `npx playwright show-report` - View last test report

### 5. Tests Created
- Example unit tests (2 tests)
- Homepage E2E tests (2 tests)
- Health check test (monitors server uptime & latency)

---

## Sprint Metrics You Can Now Track

### Team Metrics (QA Responsibilities)
- **iv. Automated heartbeat test**: `tests/integration/healthcheck.test.js`
  - Monitors server uptime and response latency
  - Run: `npm test healthcheck`

- **xii. Number of integration tests**: Currently 1
  - Location: `tests/integration/`
  - Run: `npm test`

- **xiii. Number of UI tests**: Currently 2
  - Location: `tests/e2e/`
  - Run: `npm run test:e2e`

### Individual Metrics
- Unit test coverage: Run `npm run test:coverage` to see percentage
- Pull requests: Track in GitHub
- Code reviews: Track in GitHub

---

## Coverage Thresholds

This project enforces minimum code coverage requirements:

- **Statements:** 50% (current baseline: 54.8%)
- **Branches:** 25% (current baseline: 30.55%)
- **Functions:** 65% (current baseline: 70.17%)
- **Lines:** 50% (current baseline: 56.25%)

**Note:** These thresholds represent the current project baseline and will be gradually increased as test coverage improves.

### Checking Coverage
```bash
# Run tests with coverage report
npm run test:coverage

# View detailed HTML report
open coverage/index.html
```

### What Happens If Coverage Drops

If your code changes cause coverage to drop below thresholds:
- ❌ Tests will fail locally
- ❌ CI/CD pipeline will fail
- ❌ PR cannot be merged until coverage is restored

### Tips for Meeting Coverage

1. Write tests for new code before submitting PR
2. Check coverage locally: `npm run test:coverage`
3. Focus on testing critical paths and edge cases
4. Review HTML coverage report to find uncovered lines

See [TESTING_STANDARDS.md](TESTING_STANDARDS.md) for detailed guidelines.

---

### Before Starting Work
```bash
cd ~/projects/TechGuide
git pull  # Get latest code
npm install  # Install any new dependencies
```

### Running Tests
```bash
# Start dev server (in one terminal)
npm run dev

# Run all tests (in another terminal)
npm test  # Unit/integration tests
npm run test:e2e  # Browser tests
```

### Creating New Tests
1. **Unit test**: Add to `tests/unit/[component].test.js`
2. **Integration test**: Add to `tests/integration/[feature].test.js`
3. **E2E test**: Add to `tests/e2e/[flow].spec.js`

### Tracking Metrics
- Test count: Count files in each test directory
- Pass rate: Look at test output (X passed / Y total)
- Coverage: Run `npm run test:coverage`
- Latency: Check healthcheck test output

---

## Troubleshooting

### Tests fail with "Cannot find module"
```bash
npm install
```

### Browser tests fail
Make sure dev server is running:
```bash
npm run dev
```

### Health check fails
Start the dev server first in another terminal.

---

## Resources
- Vitest Docs: https://vitest.dev
- Playwright Docs: https://playwright.dev
- Testing Library: https://testing-library.com/react