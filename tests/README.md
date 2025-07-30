# LangoMango Playwright Test Suite

## Overview

This directory contains comprehensive end-to-end and component tests for the LangoMango landing page using Playwright.

## Test Structure

```
tests/
├── e2e/                      # End-to-end integration tests
│   ├── homepage.spec.ts      # Main homepage integration tests
│   ├── navigation.spec.ts    # Navigation and routing tests
│   └── responsive.spec.ts    # Responsive design and accessibility tests
├── components/               # Component-specific tests
│   ├── hero.spec.ts         # Hero section tests
│   ├── features.spec.ts     # Features gallery tests
│   ├── testimonials.spec.ts # Testimonials section tests
│   ├── pricing.spec.ts      # Pricing section tests
│   └── cta.spec.ts          # CTA and other components tests
└── fixtures/                # Test utilities and helpers
    ├── test-base.ts         # Base test configuration
    ├── selectors.ts         # Centralized element selectors
    └── global-setup.ts      # Global test setup

```

## Running Tests

### All Tests
```bash
yarn test
```

### Specific Test File
```bash
yarn test tests/e2e/homepage.spec.ts
```

### Specific Browser
```bash
yarn test --project=chromium
yarn test --project=firefox
yarn test --project=webkit
```

### Mobile Tests
```bash
yarn test --project=mobile-chrome
yarn test --project=mobile-safari
```

### Interactive UI Mode
```bash
yarn test:ui
```

### Debug Mode
```bash
yarn test --debug
```

## Test Categories

### 1. Homepage Integration Tests
- Page load and meta information
- Section visibility and structure
- External script loading
- Analytics tracking
- OAuth flow handling
- Performance metrics

### 2. Component Tests
- **Hero**: Sticky behavior, darkening effect, reader widget
- **Features**: Tab navigation, content switching, animations
- **Testimonials**: Card layout, author info, responsiveness
- **Pricing**: Card display, hover states, CTA buttons
- **CTA**: Button tracking, image loading, content display

### 3. Responsive Tests
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)
- Layout adaptations
- Touch target sizes
- Text readability

### 4. Accessibility Tests
- Heading hierarchy
- Alt text for images
- ARIA labels
- Keyboard navigation
- Color contrast
- Focus indicators
- Screen reader landmarks

## Configuration

The test suite is configured in `playwright.config.ts` with:
- Multiple browser support (Chrome, Firefox, Safari)
- Mobile device emulation
- Screenshot and video capture on failure
- Parallel test execution
- Retry logic for flaky tests

## CI/CD Integration

Tests run automatically in GitHub Actions on:
- Push to master and develop branches
- All pull requests

## Best Practices

1. **Use Page Object Model**: Selectors are centralized in `fixtures/selectors.ts`
2. **Wait for stability**: Use `waitForSelector` and `waitForLoadState`
3. **Test isolation**: Each test should be independent
4. **Descriptive names**: Test names clearly describe what they verify
5. **Console logging**: Important findings are logged for debugging

## Troubleshooting

### Tests fail locally but pass in CI
- Ensure dev server is running: `yarn dev`
- Check Node.js version matches CI (v18+)
- Clear test cache: `rm -rf test-results/`

### Timeout errors
- Increase timeout in specific tests: `test.setTimeout(60000)`
- Check network conditions
- Verify dev server is responding

### Element not found
- Check selectors in `fixtures/selectors.ts`
- Use Playwright Inspector: `yarn test --debug`
- Verify element visibility with `isVisible()`

## Adding New Tests

1. Choose appropriate directory (e2e/ or components/)
2. Use the test base configuration: `import { test, expect } from '../fixtures/test-base'`
3. Use centralized selectors when possible
4. Follow existing test patterns
5. Run tests locally before committing

## Maintenance

- Update selectors when UI changes
- Review and update tests for new features
- Monitor test execution time
- Remove obsolete tests
- Keep test data up to date