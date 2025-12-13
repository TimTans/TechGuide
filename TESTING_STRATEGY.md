# TechGuide Testing Strategy

## Overview
Comprehensive testing strategy for TechGuide platform ensuring quality, reliability, and accessibility.

## Test Coverage Goals
- **Overall Coverage**: 70%+ statement coverage
- **Critical Components**: 95%+ coverage (auth, user management)
- **UI Components**: 80%+ coverage

## Testing Pyramid

### Unit Tests (70% of tests)
- **Location**: `tests/unit/`
- **Framework**: Vitest + React Testing Library
- **Coverage**: Individual components and utility functions
- **Run**: `npm test`

### Integration Tests (20% of tests)
- **Location**: `tests/integration/`
- **Framework**: Vitest
- **Coverage**: API interactions, auth flows, database queries
- **Run**: `npm test` (runs with unit tests)

### E2E Tests (10% of tests)
- **Location**: `tests/e2e/`
- **Framework**: Playwright
- **Coverage**: Complete user journeys, cross-browser testing
- **Run**: `npm run test:e2e`

## Current Test Stats (Sprint #4)
- **Total Tests**: 140
- **Pass Rate**: 100%
- **Coverage**: 70%+
- **E2E Tests**: 17 (homepage + user journeys)
- **Average Run Time**: <4 seconds (unit), <30 seconds (E2E)

## Test Distribution
- **Authentication**: 21 tests (SignIn, SignUp)
- **Dashboard**: 4 tests
- **Navigation**: 8 tests (Navbar)
- **Content Pages**: 39 tests (Safety, Tutorials)
- **Instructor Dashboard**: 40 tests
- **User Components**: 5 tests (UserCourses)
- **Integration**: 7 tests (Auth, Health Check)
- **E2E**: 17 tests (Homepage, User Journeys)

## CI/CD Integration
Tests run automatically on:
- Every push to `main`, `develop`, or feature branches
- Every pull request
- Before deployment to production

## Quality Gates
All PRs must pass:
- ✅ All tests passing (140/140)
- ✅ No critical linting errors
- ✅ Coverage maintained or improved
- ✅ E2E tests passing

## Test Maintenance
- **Weekly**: Review and update test coverage
- **Sprint Basis**: Add tests for new features
- **Quarterly**: Performance test optimization

## Best Practices
1. Write tests alongside feature development
2. Mock external dependencies (Supabase, APIs)
3. Use descriptive test names
4. Test user behavior, not implementation details
5. Maintain test isolation
6. Keep tests fast (<5s total runtime)

## Running Tests Locally
```bash
# All unit + integration tests
npm test

# With coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E with UI
npm run test:e2e:ui

# Health check
npm test healthcheck
```

## Component Test Coverage

### High Coverage (90%+)
- SignInPage: 100%
- Safety: 100%
- Tutorials: 100%
- InstructorDashboard: 100%
- Navbar: 95.45%

### Good Coverage (80-90%)
- SignUpPage: 87.5%
- Dashboard: 85%+

### Adequate Coverage (70-80%)
- UserCourses: 75%+

## Known Issues
- act() warnings in some async tests (non-blocking, tests pass)
- Supabase mocking requires careful setup

## Future Improvements
1. Add visual regression testing
2. Implement performance testing
3. Add load testing for production
4. Expand mobile testing coverage
5. Add API contract testing
6. Implement mutation testing

## Contact
**QA Lead**: Xin Gao  
**Documentation**: See `QA_HANDOFF_CHECKLIST.md`  
**CI/CD**: See `.github/workflows/test.yml`
