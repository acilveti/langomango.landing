import { test, expect } from '../fixtures/test-base';

test.describe('Newsletter Modal E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open newsletter modal from USE DEMO button', async ({ page }) => {
    const useDemoButton = page.getByRole('button', { name: /use demo/i });
    await expect(useDemoButton).toBeVisible();
    
    await useDemoButton.click();
    
    const modal = page.locator('.modal, [role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal.getByText(/newsletter|subscribe/i)).toBeVisible();
  });

  test('should close newsletter modal with close button', async ({ page }) => {
    const useDemoButton = page.getByRole('button', { name: /use demo/i });
    await useDemoButton.click();
    
    const modal = page.locator('.modal, [role="dialog"]');
    await expect(modal).toBeVisible();
    
    const closeButton = modal.locator('[aria-label*="close"], .close-button, button:has-text("×")').first();
    await closeButton.click();
    
    await expect(modal).not.toBeVisible();
  });

  test('should close modal when clicking outside', async ({ page }) => {
    const useDemoButton = page.getByRole('button', { name: /use demo/i });
    await useDemoButton.click();
    
    const modal = page.locator('.modal, [role="dialog"]');
    await expect(modal).toBeVisible();
    
    // Click on backdrop/overlay
    await page.mouse.click(100, 100);
    await page.waitForTimeout(500);
    
    await expect(modal).not.toBeVisible();
  });

  test('should subscribe to newsletter with valid email', async ({ page }) => {
    const useDemoButton = page.getByRole('button', { name: /use demo/i });
    await useDemoButton.click();
    
    const modal = page.locator('.modal, [role="dialog"]');
    
    const emailInput = modal.locator('input[type="email"], input[name="email"]');
    await emailInput.fill('subscriber@example.com');
    
    const subscribeButton = modal.getByRole('button', { name: /subscribe|sign up/i });
    await subscribeButton.click();
    
    await expect(modal.getByText(/thank you|success|subscribed/i)).toBeVisible();
  });

  test('should show error for invalid email in modal', async ({ page }) => {
    const useDemoButton = page.getByRole('button', { name: /use demo/i });
    await useDemoButton.click();
    
    const modal = page.locator('.modal, [role="dialog"]');
    
    const emailInput = modal.locator('input[type="email"], input[name="email"]');
    await emailInput.fill('invalid-email');
    
    const subscribeButton = modal.getByRole('button', { name: /subscribe|sign up/i });
    await subscribeButton.click();
    
    await expect(modal.getByText(/valid email|invalid/i)).toBeVisible();
  });
});