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

## Next Steps for Jira

Create these tickets:

### 1. KAN-XX: Setup Automated Test Infrastructure
- **Status**: DONE
- **Description**: Install and configure Playwright, Vitest, and testing libraries
- **Evidence**: This setup, all config files created

### 2. KAN-XX: Create Health Check Monitoring System
- **Status**: DONE
- **Description**: Automated tests to monitor server uptime and latency
- **Evidence**: `tests/integration/healthcheck.test.js`

### 3. KAN-XX: Create E2E Test Suite for Core User Flows
- **Status**: IN PROGRESS
- **Description**: Browser tests for homepage, navigation, sign-up, etc.
- **Current**: 2 tests created
- **TODO**: Add tests for:
  - Sign up flow
  - Sign in flow
  - Course navigation
  - Tutorial interaction
  - Scam detection features

### 4. KAN-XX: Setup Test Coverage Reporting
- **Status**: DONE
- **Description**: Configure code coverage tracking
- **Evidence**: Can run `npm run test:coverage`

### 5. KAN-XX: Create Integration Tests for Supabase
- **Status**: TODO
- **Description**: Test authentication, database queries, API calls
- **Location**: `tests/integration/`

### 6. KAN-XX: Manual Testing - [Feature Name]
- **Status**: TODO (create per feature)
- **Description**: Manual test plans for features
- **Examples**: 
  - Scam detection accuracy
  - Tutorial completeness
  - User experience flows

---

## Files to Commit to GitHub
```bash
# Add all new test files
git add vitest.config.js
git add playwright.config.js
git add src/test/
git add tests/
git add package.json
git add package-lock.json

# Commit
git commit -m "feat: Setup QA testing infrastructure with Playwright and Vitest"

# Push
git push origin main
```

---

## Daily QA Workflow

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
