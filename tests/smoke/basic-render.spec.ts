import { test, expect } from '@playwright/test';

test.describe('Basic Smoke Tests', () => {
  test('app renders and is accessible', async ({ page }) => {
    // Navigate to homepage
    const response = await page.goto('/');
    
    // Check response is successful
    expect(response?.status()).toBeLessThan(400);
    
    // Check page has content
    const body = await page.locator('body');
    await expect(body).toBeVisible();
    
    // Check critical elements exist
    await expect(page.locator('#__next')).toBeVisible();
  });

  test('has correct title and meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/LangoMango/);
    
    // Check viewport meta tag exists
    const viewport = await page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
  });

  test('main content areas are visible', async ({ page }) => {
    await page.goto('/');
    
    // Wait for any element with text content
    await page.waitForSelector('text=LangoMango', { timeout: 10000 });
    
    // Check page has meaningful content (not blank)
    const textContent = await page.textContent('body');
    expect(textContent).toBeTruthy();
    expect(textContent?.length).toBeGreaterThan(100);
  });
});