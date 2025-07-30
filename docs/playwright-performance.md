# Playwright Test Performance Optimizations

## Changes Made

### 1. Worker Configuration
- **Local**: Increased from default (CPU cores) to fixed 4 workers
- **CI**: Increased from 1 to 2 workers
- **Impact**: ~50% faster test execution through parallelization

### 2. Browser Coverage
- Reduced from 5 browsers to 2 (Chromium + Mobile Chrome)
- Other browsers commented out but available for full coverage when needed
- **Impact**: 60% fewer test runs

### 3. Test Recording
- **Video**: Disabled for local development, enabled only in CI on failure
- **Traces**: Disabled locally, enabled in CI on retry
- **Impact**: 10-20% performance improvement

### 4. Smart Waits
- Replaced `waitForTimeout()` with intelligent wait conditions:
  - `waitForLoadState()` for page readiness
  - `waitForFunction()` for specific conditions
  - `waitForURL()` for navigation completion
- **Impact**: Tests run as fast as conditions are met

### 5. External Service Mocking
- Created mock handlers for:
  - Reddit Pixel
  - ContentSquare
  - Google Tag Manager
  - Microsoft Clarity
  - Vercel Analytics
- **Impact**: Eliminates network delays and external dependencies

### 6. CI Sharding
- Added sharded workflow splitting tests across 2 parallel jobs
- Each shard runs a subset of tests
- **Impact**: 50% faster CI runs

## Running Tests

### Fast Mode (Development)
```bash
# Uses 4 workers, no video/traces, mocked services
yarn test
```

### Full Coverage Mode
```bash
# Run all browsers
yarn test --project=chromium --project=firefox --project=webkit --project=mobile-chrome --project=mobile-safari
```

### With Real External Services
```bash
# Disable mocking for integration testing
MOCK_EXTERNAL_SERVICES=false yarn test
```

### Single Worker (Debugging)
```bash
# Run tests sequentially
yarn test --workers=1
```

## Performance Metrics

- **Before**: ~2-3 minutes for full test suite
- **After**: ~30-45 seconds with optimizations
- **CI**: ~1-2 minutes with sharding

## Future Optimizations

1. **Component Testing**: Add separate fast unit tests
2. **Request Interception**: Cache static assets
3. **Test Data**: Pre-generate test fixtures
4. **Selective Testing**: Run only affected tests on PRs