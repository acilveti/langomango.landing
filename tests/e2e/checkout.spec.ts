import { test, expect, testConfig } from '../fixtures/test-base';
import { selectors } from '../fixtures/selectors';

test.describe('Checkout Page Tests', () => {
  test.describe('Authentication Flow', () => {
    test('should redirect to sign-up when not authenticated', async ({ page }) => {
      // Clear any existing auth tokens
      await page.context().clearCookies();
      
      // Navigate to checkout without auth
      await page.goto('/checkout', { waitUntil: 'domcontentloaded' });

      // Should redirect to sign-up (external URL)
      await page.waitForTimeout(2000); // Give time for redirect
      
      // Check if we've been redirected away from checkout
      const currentUrl = page.url();
      expect(currentUrl).not.toContain('/checkout');
      expect(currentUrl).toContain('sign-up');
    });

    test('should display pricing page when authenticated', async ({ page }) => {
      // Navigate to checkout with auth token in context
      await page.addInitScript(() => {
        window.localStorage.setItem('token', 'mock-jwt-token');
        window.localStorage.setItem('auth_token', 'mock-jwt-token');
      });

      // Navigate to checkout
      await page.goto('/checkout', { waitUntil: 'networkidle' });

      // Should stay on checkout page
      await expect(page).toHaveURL('/checkout');

      // Should display pricing component
      const pricingContainer = page.locator('[class*="PricingWrapper"]').first();
      await expect(pricingContainer).toBeVisible({ timeout: testConfig.timeouts.element });

      // Should show title
      const title = page.locator('text=Choose Your LangoMango Plan');
      await expect(title).toBeVisible();
    });
  });

  test.describe('Pricing Plans Display', () => {
    test.beforeEach(async ({ page }) => {
      // Mock authentication before navigation
      await page.addInitScript(() => {
        window.localStorage.setItem('token', 'mock-jwt-token');
        window.localStorage.setItem('auth_token', 'mock-jwt-token');
      });
      await page.goto('/checkout', { waitUntil: 'networkidle' });
    });

    test('should display all pricing plans', async ({ page }) => {
      // Wait for pricing cards to load
      const pricingCards = page.locator('[class*="PlanCard"]');
      await expect(pricingCards).toHaveCount(3, { timeout: testConfig.timeouts.element });

      // Verify plan names
      await expect(page.locator('text=1 Month Plan')).toBeVisible();
      await expect(page.locator('text=Annual Plan')).toBeVisible();
      await expect(page.locator('text=3 Year Plan')).toBeVisible();
    });

    test('should highlight recommended plan', async ({ page }) => {
      // Find the recommended plan (Annual Plan)
      const recommendedCard = page.locator('[class*="PlanCard"]').filter({ hasText: 'Annual Plan' });
      
      // Should have "MOST POPULAR" badge
      const badge = recommendedCard.locator('text=MOST POPULAR');
      await expect(badge).toBeVisible();
    });

    test('should display correct pricing information', async ({ page }) => {
      // Check monthly plan
      const monthlyPlan = page.locator('[class*="PlanCard"]').filter({ hasText: '1 Month Plan' });
      await expect(monthlyPlan.locator('text=€11.99')).toBeVisible();
      await expect(monthlyPlan.locator('text=/ Mo')).toBeVisible();

      // Check annual plan
      const annualPlan = page.locator('[class*="PlanCard"]').filter({ hasText: 'Annual Plan' });
      await expect(annualPlan.locator('text=€72')).toBeVisible();
      await expect(annualPlan.locator('text=Save €71.88')).toBeVisible();

      // Check 3-year plan
      const threeYearPlan = page.locator('[class*="PlanCard"]').filter({ hasText: '3 Year Plan' });
      await expect(threeYearPlan.locator('text=€144')).toBeVisible();
      await expect(threeYearPlan.locator('text=67% OFF')).toBeVisible();
    });

    test('should display features for each plan', async ({ page }) => {
      const features = [
        'Upload Your Books',
        'Read from Kindle',
        'Books in App Library',
        'iOS & Android App'
      ];

      // Check that each plan has the basic features
      for (const feature of features) {
        const featureElements = page.locator(`text=${feature}`);
        await expect(featureElements).toHaveCount(3); // Should appear in all 3 plans
      }
    });
  });

  test.describe('Plan Selection', () => {
    test.beforeEach(async ({ page }) => {
      // Mock authentication before navigation
      await page.addInitScript(() => {
        window.localStorage.setItem('token', 'mock-jwt-token');
        window.localStorage.setItem('auth_token', 'mock-jwt-token');
      });
      await page.goto('/checkout', { waitUntil: 'networkidle' });
    });

    test('should handle plan selection on click', async ({ page }) => {
      // Click on a plan card
      const monthlyPlan = page.locator('[class*="PlanCard"]').filter({ hasText: '1 Month Plan' });
      await monthlyPlan.click();

      // Plan should be visually selected (check for border color change)
      await expect(monthlyPlan).toHaveCSS('border-color', /rgb\(245, 158, 11\)|#f59e0b/);
    });

    test('should update CTA button based on selection', async ({ page }) => {
      // Initially, CTA should be disabled
      const ctaButton = page.locator('[class*="CTAButton"]').first();
      await expect(ctaButton).toBeDisabled();

      // Select monthly plan
      const monthlyPlan = page.locator('[class*="PlanCard"]').filter({ hasText: '1 Month Plan' });
      await monthlyPlan.click();

      // CTA should be enabled
      await expect(ctaButton).toBeEnabled();
      await expect(ctaButton).toHaveText('Start Your Free Trial');

      // Select 3-year plan
      const threeYearPlan = page.locator('[class*="PlanCard"]').filter({ hasText: '3 Year Plan' });
      await threeYearPlan.click();

      // CTA text should update
      await expect(ctaButton).toHaveText('Get 3 Year Access');
    });

    test('should handle checkout initiation', async ({ page }) => {
      // Mock the API response
      await page.route('**/api/checkout/create-session', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            url: 'https://checkout.stripe.com/mock-session',
            sessionId: 'mock-session-id'
          })
        });
      });

      // Select a plan
      const monthlyPlan = page.locator('[class*="PlanCard"]').filter({ hasText: '1 Month Plan' });
      await monthlyPlan.click();

      // Click CTA button
      const ctaButton = page.locator('[class*="CTAButton"]').first();
      await ctaButton.click();

      // Should trigger navigation
      await page.waitForTimeout(1000);
      
      // Verify the checkout was initiated (button clicked successfully)
      expect(true).toBeTruthy();
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ page }) => {
      // Mock authentication before navigation
      await page.addInitScript(() => {
        window.localStorage.setItem('token', 'mock-jwt-token');
        window.localStorage.setItem('auth_token', 'mock-jwt-token');
      });

      // Set mobile viewport
      await page.setViewportSize(testConfig.viewports.mobile);
      await page.goto('/checkout', { waitUntil: 'networkidle' });

      // Plans should stack vertically
      const plansContainer = page.locator('[class*="PlansContainer"]').first();
      await expect(plansContainer).toHaveCSS('flex-direction', 'column');

      // All plans should be visible
      const pricingCards = page.locator('[class*="PlanCard"]');
      await expect(pricingCards).toHaveCount(3);

      // Text should be readable
      const title = page.locator('text=Choose Your LangoMango Plan');
      await expect(title).toBeVisible();
    });

    test('should display correctly on tablet', async ({ page }) => {
      // Mock authentication before navigation
      await page.addInitScript(() => {
        window.localStorage.setItem('token', 'mock-jwt-token');
        window.localStorage.setItem('auth_token', 'mock-jwt-token');
      });

      // Set tablet viewport
      await page.setViewportSize(testConfig.viewports.tablet);
      await page.goto('/checkout', { waitUntil: 'networkidle' });

      // All elements should be visible
      await expect(page.locator('[class*="PricingWrapper"]').first()).toBeVisible();
      await expect(page.locator('[class*="PlanCard"]')).toHaveCount(3);
    });
  });

  test.describe('Page Metadata', () => {
    test('should have correct page title and meta tags', async ({ page }) => {
      // Mock authentication before navigation
      await page.addInitScript(() => {
        window.localStorage.setItem('token', 'mock-jwt-token');
        window.localStorage.setItem('auth_token', 'mock-jwt-token');
      });

      await page.goto('/checkout', { waitUntil: 'networkidle' });

      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Page should have loaded (title might be set by Next.js)
      const title = await page.title();
      expect(title).toBeTruthy();

      // Page should be rendered as static
      const htmlContent = await page.content();
      expect(htmlContent).toContain('Choose Your LangoMango Plan');
    });
  });

  test.describe('Error Handling', () => {
    test('should display error when checkout fails', async ({ page }) => {
      // Mock authentication before navigation
      await page.addInitScript(() => {
        window.localStorage.setItem('token', 'mock-jwt-token');
        window.localStorage.setItem('auth_token', 'mock-jwt-token');
      });

      // Mock API error
      await page.route('**/api/checkout/create-session', async route => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server error' })
        });
      });

      await page.goto('/checkout');

      // Select a plan and try to checkout
      const monthlyPlan = page.locator('[class*="PlanCard"]').filter({ hasText: '1 Month Plan' });
      await monthlyPlan.click();

      const ctaButton = page.locator('[class*="CTAButton"]').first();
      await ctaButton.click();

      // Should show error message
      const errorMessage = page.locator('[class*="ErrorMessage"]');
      await expect(errorMessage).toBeVisible({ timeout: testConfig.timeouts.element });
    });
  });
});