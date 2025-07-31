import { test, expect } from '../fixtures/test-base';

test.describe('Error Handling E2E', () => {
  test('should display 404 page for non-existent routes', async ({ page }) => {
    await page.goto('/non-existent-page-12345');
    
    await expect(page.getByText(/404|not found|page not found/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /home|back/i })).toBeVisible();
    
    await page.getByRole('link', { name: /home|back/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.route('**/api/**', route => route.abort());
    
    await page.goto('/');
    
    const newsletterInput = page.locator('input[placeholder*="email"]').last();
    await newsletterInput.fill('test@example.com');
    await page.getByRole('button', { name: /subscribe/i }).last().click();
    
    await expect(page.getByText(/error|failed|try again/i)).toBeVisible();
  });

  test('should recover from JavaScript errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('pageerror', error => {
      consoleErrors.push(error.message);
    });
    
    await page.goto('/');
    
    await page.evaluate(() => {
      throw new Error('Test error');
    });
    
    await page.waitForTimeout(1000);
    
    const heroVisible = await page.locator('.hero-section, #hero').isVisible();
    expect(heroVisible).toBeTruthy();
    
    const navigationWorks = await page.getByRole('link', { name: /features/i }).isVisible();
    expect(navigationWorks).toBeTruthy();
  });

  test('should show offline message when connection is lost', async ({ page, context }) => {
    await page.goto('/');
    
    await context.setOffline(true);
    
    await page.getByRole('link', { name: /pricing/i }).click().catch(() => {});
    
    await page.waitForTimeout(2000);
    
    const offlineIndicator = await page.locator('.offline-message, [data-testid="offline"]').isVisible() ||
                            await page.getByText(/offline|no connection/i).isVisible();
    
    expect(offlineIndicator).toBeTruthy();
    
    await context.setOffline(false);
    
    await page.reload();
    await expect(page.locator('.hero-section, #hero')).toBeVisible();
  });

  test('should handle form validation errors', async ({ page }) => {
    await page.goto('/');
    
    const contactLink = page.getByRole('link', { name: /contact/i });
    if (await contactLink.isVisible()) {
      await contactLink.click();
      
      await page.fill('input[name="email"]', 'invalid-email');
      await page.fill('input[name="message"]', 'a');
      
      await page.getByRole('button', { name: /send|submit/i }).click();
      
      await expect(page.getByText(/valid email/i)).toBeVisible();
      await expect(page.getByText(/too short|minimum/i)).toBeVisible();
      
      await page.fill('input[name="email"]', 'valid@email.com');
      await page.fill('input[name="message"]', 'This is a valid message with sufficient length');
      
      await page.getByRole('button', { name: /send|submit/i }).click();
      
      await expect(page.getByText(/valid email/i)).not.toBeVisible();
      await expect(page.getByText(/too short|minimum/i)).not.toBeVisible();
    }
  });
});