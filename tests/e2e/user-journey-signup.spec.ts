import { test, expect } from '../fixtures/test-base';

test.describe('User Journey - Complete Signup Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete full user journey from landing to signup', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /learn.*language/i })).toBeVisible();
    
    await page.getByRole('button', { name: /get started|start.*free/i }).first().click();
    
    await expect(page).toHaveURL(/.*\/signup/);
    
    await page.fill('input[name="firstName"]', 'Jane');
    await page.fill('input[name="lastName"]', 'Smith');
    await page.fill('input[name="email"]', 'jane.smith@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    
    const termsCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: /terms|privacy/i });
    await termsCheckbox.check();
    
    await page.getByRole('button', { name: /sign up|create account/i }).click();
    
    await expect(page.getByText(/welcome|verify.*email/i)).toBeVisible();
  });

  test('should validate signup form fields', async ({ page }) => {
    await page.getByRole('button', { name: /get started|start.*free/i }).first().click();
    
    await page.getByRole('button', { name: /sign up|create account/i }).click();
    
    await expect(page.getByText(/first name.*required/i)).toBeVisible();
    await expect(page.getByText(/email.*required/i)).toBeVisible();
    await expect(page.getByText(/password.*required/i)).toBeVisible();
  });

  test('should enforce password strength requirements', async ({ page }) => {
    await page.getByRole('button', { name: /get started|start.*free/i }).first().click();
    
    await page.fill('input[name="password"]', 'weak');
    await page.click('body');
    
    await expect(page.getByText(/password must.*8 characters|too short/i)).toBeVisible();
    
    await page.fill('input[name="password"]', 'weakpassword');
    await expect(page.getByText(/must contain.*number|uppercase/i)).toBeVisible();
    
    await page.fill('input[name="password"]', 'StrongPass123!');
    await expect(page.getByText(/password.*strong/i)).toBeVisible();
  });

  test('should handle existing user signup attempt', async ({ page }) => {
    await page.route('**/api/signup', async route => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'User already exists' })
      });
    });
    
    await page.getByRole('button', { name: /get started|start.*free/i }).first().click();
    
    await page.fill('input[name="firstName"]', 'Existing');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', 'existing@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    
    const termsCheckbox = page.locator('input[type="checkbox"]').first();
    await termsCheckbox.check();
    
    await page.getByRole('button', { name: /sign up|create account/i }).click();
    
    await expect(page.getByText(/already.*account|user.*exists/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /log in|sign in/i })).toBeVisible();
  });

  test('should track signup funnel with analytics', async ({ page }) => {
    const analyticsEvents: string[] = [];
    
    await page.addInitScript(() => {
      window.dataLayer = window.dataLayer || [];
      const originalPush = window.dataLayer.push;
      window.dataLayer.push = function(...args: any[]) {
        window.analyticsEvents = window.analyticsEvents || [];
        window.analyticsEvents.push(...args);
        return originalPush.apply(window.dataLayer, args);
      };
    });
    
    await page.getByRole('button', { name: /get started|start.*free/i }).first().click();
    
    await page.fill('input[name="firstName"]', 'Analytics');
    await page.fill('input[name="lastName"]', 'Test');
    await page.fill('input[name="email"]', 'analytics@example.com');
    await page.fill('input[name="password"]', 'TestPass123!');
    
    const events = await page.evaluate(() => window.analyticsEvents || []);
    
    const signupEvents = events.filter((e: any) => 
      e.event?.includes('signup') || e.event?.includes('form')
    );
    
    expect(signupEvents.length).toBeGreaterThan(0);
  });
});