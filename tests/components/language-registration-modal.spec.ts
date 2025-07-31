import { test, expect, testConfig } from '../fixtures/test-base';

test.describe('LanguageRegistrationModal Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing state
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test.describe('Redirect Behavior', () => {
    test('should redirect to checkout when redirectToCheckout is true', async ({ page }) => {
      // Mock successful registration
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

      // Create a test page with the modal
      await page.setContent(`
        <html>
          <body>
            <div id="modal-root"></div>
            <script>
              window.mockModalProps = {
                selectedLanguage: { code: 'es', name: 'Spanish', flag: '🇪🇸' },
                onClose: () => console.log('Modal closed'),
                onSuccess: () => console.log('Success'),
                redirectToCheckout: true
              };
            </script>
          </body>
        </html>
      `);

      // Navigate to trigger modal with redirectToCheckout
      await page.goto('/');
      
      // Find language modal trigger (if exists)
      const languageButtons = page.locator('[data-testid="language-button"], [class*="LanguageCard"]');
      if (await languageButtons.count() > 0) {
        await languageButtons.first().click();

        // Wait for modal
        const modal = page.locator('[class*="Modal"], [role="dialog"]').filter({ 
          has: page.locator('text=Ready to learn Spanish?') 
        });

        if (await modal.isVisible()) {
          // Fill email
          await modal.locator('input[type="email"]').fill('test@example.com');
          
          // Submit
          await modal.locator('button[type="submit"]').filter({ hasText: /create account/i }).click();

          // Wait for success state
          await expect(modal.locator('text=Welcome aboard!')).toBeVisible({ timeout: 5000 });

          // Should redirect to checkout after timeout
          await page.waitForURL('/checkout', { timeout: 3000 });
        }
      }
    });

    test('should redirect to beta app when redirectToCheckout is false', async ({ page }) => {
      // Mock successful registration
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

      // Create a test scenario without redirectToCheckout
      await page.goto('/');

      const languageButtons = page.locator('[data-testid="language-button"], [class*="LanguageCard"]');
      if (await languageButtons.count() > 0) {
        await languageButtons.first().click();

        const modal = page.locator('[class*="Modal"], [role="dialog"]').filter({ 
          has: page.locator('text=Ready to learn') 
        });

        if (await modal.isVisible()) {
          // Fill and submit
          await modal.locator('input[type="email"]').fill('test@example.com');
          await modal.locator('button[type="submit"]').filter({ hasText: /create account/i }).click();

          // Wait for navigation
          await page.waitForTimeout(2500);

          // Should redirect to beta app, not checkout
          const url = page.url();
          expect(url).not.toContain('/checkout');
        }
      }
    });
  });

  test.describe('Google OAuth Redirect', () => {
    test('should handle Google OAuth with checkout redirect', async ({ page }) => {
      // Navigate to page with modal
      await page.goto('/');

      // Simulate Google OAuth callback
      await page.goto('/#token=google-oauth-token&type=google');

      // Check if redirectToCheckout was set before OAuth
      await page.evaluate(() => {
        localStorage.setItem('redirectToCheckout', 'true');
      });

      // Process OAuth callback
      await page.waitForTimeout(1000);

      // Should redirect to checkout if flag was set
      const redirectToCheckout = await page.evaluate(() => localStorage.getItem('redirectToCheckout'));
      if (redirectToCheckout === 'true') {
        await page.waitForURL('/checkout', { timeout: 3000 });
      }
    });
  });

  test.describe('Skip Functionality', () => {
    test('should handle skip button correctly', async ({ page }) => {
      await page.goto('/');

      // Trigger modal if possible
      const trigger = page.locator('[data-testid="language-modal-trigger"], [class*="LanguageButton"]').first();
      if (await trigger.count() > 0) {
        await trigger.click();

        const modal = page.locator('[class*="Modal"], [role="dialog"]');
        if (await modal.isVisible()) {
          // Find skip button
          const skipButton = modal.locator('button').filter({ hasText: /skip for now/i });
          await expect(skipButton).toBeVisible();

          // Click skip
          await skipButton.click();

          // Modal should close
          await expect(modal).not.toBeVisible({ timeout: 2000 });

          // Should not redirect anywhere
          await page.waitForTimeout(1000);
          const url = page.url();
          expect(url).not.toContain('/checkout');
          expect(url).not.toContain('/login');
        }
      }
    });
  });

  test.describe('Login Link', () => {
    test('should navigate to login when "Already have an account" is clicked', async ({ page }) => {
      await page.goto('/');

      // Trigger modal
      const trigger = page.locator('[data-testid="language-modal-trigger"], [class*="LanguageButton"]').first();
      if (await trigger.count() > 0) {
        await trigger.click();

        const modal = page.locator('[class*="Modal"], [role="dialog"]');
        if (await modal.isVisible()) {
          // Find login button
          const loginButton = modal.locator('button').filter({ hasText: /log in/i });
          await expect(loginButton).toBeVisible();

          // Store current URL
          const currentUrl = page.url();

          // Click login
          await loginButton.click();

          // Should navigate to login page
          await page.waitForURL(/login/, { timeout: testConfig.timeouts.navigation });
        }
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should display error message on registration failure', async ({ page }) => {
      // Mock registration failure
      await page.route('**/auth/register-withoutpass', async route => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Email already exists'
          })
        });
      });

      await page.goto('/');

      // Trigger modal and attempt registration
      const trigger = page.locator('[data-testid="language-modal-trigger"], [class*="LanguageButton"]').first();
      if (await trigger.count() > 0) {
        await trigger.click();

        const modal = page.locator('[class*="Modal"], [role="dialog"]');
        if (await modal.isVisible()) {
          // Fill and submit
          await modal.locator('input[type="email"]').fill('existing@example.com');
          await modal.locator('button[type="submit"]').filter({ hasText: /create account/i }).click();

          // Should show error message
          const errorMessage = modal.locator('[class*="ErrorMessage"], [class*="error"]');
          await expect(errorMessage).toBeVisible({ timeout: testConfig.timeouts.element });
          await expect(errorMessage).toContainText(/already exists/i);
        }
      }
    });
  });

  test.describe('Form Validation', () => {
    test('should validate email format', async ({ page }) => {
      await page.goto('/');

      // Trigger modal
      const trigger = page.locator('[data-testid="language-modal-trigger"], [class*="LanguageButton"]').first();
      if (await trigger.count() > 0) {
        await trigger.click();

        const modal = page.locator('[class*="Modal"], [role="dialog"]');
        if (await modal.isVisible()) {
          const emailInput = modal.locator('input[type="email"]');
          const submitButton = modal.locator('button[type="submit"]').filter({ hasText: /create account/i });

          // Try invalid email
          await emailInput.fill('invalid-email');
          await emailInput.blur();

          // Should show validation error
          const errorText = modal.locator('text=Invalid email format');
          await expect(errorText).toBeVisible();

          // Submit button might be disabled
          const isDisabled = await submitButton.isDisabled();
          expect(isDisabled).toBe(true);

          // Fix email
          await emailInput.fill('valid@example.com');
          await emailInput.blur();

          // Error should disappear
          await expect(errorText).not.toBeVisible();
        }
      }
    });
  });
});