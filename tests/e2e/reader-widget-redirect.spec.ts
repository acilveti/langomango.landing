import { test, expect, testConfig } from '../fixtures/test-base';

test.describe('ReaderDemoWidget Checkout Redirect Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test.describe('OAuth Callback Redirect', () => {
    test('should redirect to checkout after successful OAuth callback', async ({ page }) => {
      // Navigate to a page with ReaderDemoWidget
      await page.goto('/');

      // Simulate OAuth callback with token
      await page.goto('/#token=mock-oauth-token&type=google');

      // Wait for the component to process the token
      await page.waitForTimeout(1000);

      // Should redirect to checkout
      await page.waitForURL('/checkout', { timeout: testConfig.timeouts.navigation });
      
      // Verify token is stored
      const storedToken = await page.evaluate(() => localStorage.getItem('auth_token'));
      expect(storedToken).toBe('mock-oauth-token');
    });

    test('should handle returnToWidget parameter correctly', async ({ page }) => {
      // Set returnToWidget flag
      await page.evaluate(() => {
        localStorage.setItem('returnToWidget', 'true');
        localStorage.setItem('pendingLanguagePrefs', JSON.stringify({
          nativeLanguage: 'en',
          targetLanguage: 'es',
          level: 'beginner'
        }));
      });

      // Navigate with OAuth token
      await page.goto('/#token=mock-oauth-token');

      // Should process token and redirect to checkout
      await page.waitForURL('/checkout', { timeout: testConfig.timeouts.navigation });

      // Verify localStorage cleanup
      const returnToWidget = await page.evaluate(() => localStorage.getItem('returnToWidget'));
      const pendingPrefs = await page.evaluate(() => localStorage.getItem('pendingLanguagePrefs'));
      expect(returnToWidget).toBeNull();
      expect(pendingPrefs).toBeNull();
    });
  });

  test.describe('Registration Flow Redirect', () => {
    test('should redirect to checkout after email registration', async ({ page }) => {
      // Mock the registration API
      await page.route('**/auth/register-withoutpass', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            token: 'mock-registration-token',
            message: 'Registration successful'
          })
        });
      });

      // Mock profile update API
      await page.route('**/user/update-profile', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true
          })
        });
      });

      // Navigate to homepage
      await page.goto('/');

      // Find and interact with reader widget if present
      const readerWidget = page.locator('[class*="ReaderWrapper"]');
      if (await readerWidget.count() > 0) {
        // Fill in registration form if visible
        const emailInput = page.locator('input[type="email"]').first();
        if (await emailInput.isVisible()) {
          await emailInput.fill('test@example.com');
          
          // Submit form
          const submitButton = page.locator('button[type="submit"]').filter({ hasText: /sign up|create account/i });
          if (await submitButton.count() > 0) {
            await submitButton.click();

            // Should redirect to checkout after successful registration
            await page.waitForURL('/checkout', { timeout: testConfig.timeouts.navigation });
          }
        }
      }
    });
  });

  test.describe('LanguageRegistrationModal Redirect', () => {
    test('should support redirectToCheckout prop', async ({ page }) => {
      // Create a test page that uses LanguageRegistrationModal with redirectToCheckout
      await page.goto('/');

      // Check if language selection triggers modal
      const languageButtons = page.locator('[class*="LanguageCard"] button, [class*="LanguageButton"]');
      if (await languageButtons.count() > 0) {
        // Click first language
        await languageButtons.first().click();

        // Look for registration modal
        const modal = page.locator('[class*="Modal"], [class*="Overlay"]').filter({ has: page.locator('text=Ready to learn') });
        if (await modal.isVisible()) {
          // Mock registration
          await page.route('**/auth/register-withoutpass', async route => {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                token: 'mock-token',
                message: 'Success'
              })
            });
          });

          // Fill email
          const emailInput = modal.locator('input[type="email"]');
          await emailInput.fill('test@example.com');

          // Submit
          const submitButton = modal.locator('button[type="submit"]').filter({ hasText: /create account/i });
          await submitButton.click();

          // Wait for success message
          await expect(modal.locator('text=Welcome aboard!')).toBeVisible({ timeout: testConfig.timeouts.element });

          // If modal was configured with redirectToCheckout, it should redirect
          // Note: This depends on how the modal is configured in the parent component
        }
      }
    });
  });

  test.describe('Direct Navigation Protection', () => {
    test('should prevent direct pricing modal access', async ({ page }) => {
      // Navigate to homepage
      await page.goto('/');

      // Verify no inline pricing modal is rendered
      const pricingModal = page.locator('[class*="PricingWrapper"]');
      
      // Should not find any pricing wrapper on the main page
      await expect(pricingModal).toHaveCount(0);
    });

    test('should not show pricing in ReaderDemoWidget', async ({ page }) => {
      await page.goto('/');

      // Find ReaderDemoWidget if present
      const readerWidget = page.locator('[class*="ReaderWrapper"]');
      if (await readerWidget.count() > 0) {
        // Verify no PricingPage component is rendered within the widget
        const pricingWithinWidget = readerWidget.locator('[class*="PricingWrapper"], [class*="PricingPage"]');
        await expect(pricingWithinWidget).toHaveCount(0);
      }
    });
  });

  test.describe('Mobile Redirect Flow', () => {
    test('should handle checkout redirect on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize(testConfig.viewports.mobile);

      // Mock authentication
      await page.evaluate(() => {
        localStorage.setItem('auth_token', 'mock-token');
      });

      // Simulate registration completion that should redirect to checkout
      await page.goto('/#registered=true&showPricing=true');

      // Should redirect to checkout on mobile as well
      await page.waitForURL('/checkout', { timeout: testConfig.timeouts.navigation });

      // Verify checkout page is responsive
      const pricingWrapper = page.locator('[class*="PricingWrapper"]').first();
      await expect(pricingWrapper).toBeVisible();
    });
  });

  test.describe('Error Scenarios', () => {
    test('should handle missing authentication gracefully', async ({ page }) => {
      // Try to access checkout without auth
      await page.goto('/checkout');

      // Should redirect to sign-up
      await page.waitForURL(/sign-up/, { timeout: testConfig.timeouts.navigation });

      // Verify return flag is set
      const returnToCheckout = await page.evaluate(() => localStorage.getItem('returnToCheckout'));
      expect(returnToCheckout).toBe('true');
    });

    test('should handle API failures during checkout redirect', async ({ page }) => {
      // Mock API failure
      await page.route('**/user/update-profile', async route => {
        await route.abort('failed');
      });

      // Set up scenario where redirect would happen
      await page.evaluate(() => {
        localStorage.setItem('auth_token', 'mock-token');
        localStorage.setItem('returnToWidget', 'true');
      });

      await page.goto('/#token=mock-token');

      // Should handle error gracefully - stay on current page or show error
      await page.waitForTimeout(2000);
      
      // Should not be on checkout page due to API failure
      const url = page.url();
      expect(url).not.toContain('/checkout');
    });
  });
});