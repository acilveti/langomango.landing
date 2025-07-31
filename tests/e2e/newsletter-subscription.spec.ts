import { test, expect } from '../fixtures/test-base';

test.describe('Newsletter Subscription E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should successfully subscribe to newsletter', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const emailInput = page.locator('input[placeholder*="email"]').last();
    await emailInput.fill('subscriber@example.com');
    
    const subscribeButton = page.getByRole('button', { name: /subscribe/i }).last();
    await subscribeButton.click();
    
    await expect(page.getByText(/successfully subscribed/i)).toBeVisible();
  });

  test('should show error for invalid email format', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const emailInput = page.locator('input[placeholder*="email"]').last();
    await emailInput.fill('invalid-email');
    
    const subscribeButton = page.getByRole('button', { name: /subscribe/i }).last();
    await subscribeButton.click();
    
    await expect(page.getByText(/please enter a valid email/i)).toBeVisible();
  });

  test('should handle duplicate subscription attempts', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const email = 'duplicate@example.com';
    const emailInput = page.locator('input[placeholder*="email"]').last();
    
    await emailInput.fill(email);
    await page.getByRole('button', { name: /subscribe/i }).last().click();
    
    await page.waitForTimeout(1000);
    
    await emailInput.fill(email);
    await page.getByRole('button', { name: /subscribe/i }).last().click();
    
    await expect(page.getByText(/already subscribed/i)).toBeVisible();
  });

  test('should persist newsletter preference across page navigation', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const emailInput = page.locator('input[placeholder*="email"]').last();
    await emailInput.fill('persistent@example.com');
    await page.getByRole('button', { name: /subscribe/i }).last().click();
    
    await expect(page.getByText(/successfully subscribed/i)).toBeVisible();
    
    await page.getByRole('link', { name: /features/i }).click();
    await page.waitForLoadState('networkidle');
    
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    await expect(page.getByText(/you are subscribed/i)).toBeVisible();
  });

  test('should handle network errors during subscription', async ({ page }) => {
    await page.route('**/api/newsletter/**', async route => {
      await route.abort('failed');
    });
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const emailInput = page.locator('input[placeholder*="email"]').last();
    await emailInput.fill('network-error@example.com');
    
    const subscribeButton = page.getByRole('button', { name: /subscribe/i }).last();
    await subscribeButton.click();
    
    await expect(page.getByText(/connection error|something went wrong/i)).toBeVisible();
  });
});