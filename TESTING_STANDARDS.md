# Testing Standards for TechGuide

## Code Coverage Requirements

All code submitted to this project must meet the following minimum coverage thresholds:

- **Statements:** 50% minimum (current baseline: 54.8%)
- **Branches:** 25% minimum (current baseline: 30.55%)
- **Functions:** 65% minimum (current baseline: 70.17%)
- **Lines:** 50% minimum (current baseline: 56.25%)

**Note:** These thresholds represent the current project baseline. As more tests are added, these thresholds should be gradually increased toward industry standards (80% statements, 75% branches/functions/lines).

## How Coverage is Enforced

Coverage thresholds are automatically enforced through:
1. **Local development:** Run `npm run test:coverage` to check coverage
2. **CI/CD pipeline:** GitHub Actions automatically runs coverage checks on all PRs
3. **Automated failures:** Tests fail if coverage drops below thresholds

## Running Coverage Reports

### Generate Coverage Report
```bash
npm run test:coverage
```

### View Detailed HTML Report
```bash
npm run test:coverage
open coverage/index.html
```

## Coverage Exclusions

The following files are excluded from coverage calculations:
- Test files (`tests/`, `src/test/`)
- Configuration files (`*.config.js`, `*.config.ts`)
- Node modules and build output
- Mock data files

## Best Practices

1. **Write tests first:** Consider TDD (Test-Driven Development) for new features
2. **Test edge cases:** Don't just test the happy path
3. **Meaningful tests:** Coverage percentage is a metric, not a goal
4. **Keep tests maintainable:** Clear, readable tests are more valuable than high coverage

## What to Test

### High Priority (Must have >90% coverage)
- Authentication logic
- Data validation
- API interactions
- User-facing components

### Medium Priority (Aim for 80%+ coverage)
- UI components with logic
- Form handling
- Navigation
- State management

### Lower Priority (Aim for 60%+ coverage)
- Purely presentational components
- Static content pages
- Simple utility functions

## When Coverage Thresholds Fail

If your PR fails due to coverage thresholds:

1. **Review uncovered code:** Check which lines aren't covered
2. **Add targeted tests:** Write tests for uncovered critical paths
3. **Consider if coverage is needed:** Some code (like error logging) may not need tests
4. **Request threshold adjustment:** If you believe a threshold is too strict, discuss with the team

## Viewing Coverage in CI

Coverage reports are automatically uploaded as artifacts in GitHub Actions:
1. Go to the Actions tab
2. Click on your workflow run
3. Scroll to "Artifacts" section
4. Download "coverage-report"
5. Open `index.html` in a browser

## Current Project Coverage

Check real-time coverage: [![Coverage](https://img.shields.io/badge/coverage-check%20actions-blue)](https://github.com/TimTans/TechGuide/actions)

Run `npm run test:coverage` to see current project coverage stats.