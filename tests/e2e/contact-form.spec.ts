import { test, expect } from '../fixtures/test-base';

test.describe('Contact Form E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should successfully submit contact form with valid data', async ({ page }) => {
    await page.getByRole('link', { name: /contact/i }).click();
    
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john.doe@example.com');
    await page.fill('textarea[name="message"]', 'I am interested in learning Spanish with LangoMango.');
    
    const responsePromise = page.waitForResponse('/api/contact');
    await page.getByRole('button', { name: /send/i }).click();
    
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    
    await expect(page.getByText(/thank you for your message/i)).toBeVisible();
  });

  test('should show validation errors for empty required fields', async ({ page }) => {
    await page.getByRole('link', { name: /contact/i }).click();
    
    await page.getByRole('button', { name: /send/i }).click();
    
    await expect(page.getByText(/name is required/i)).toBeVisible();
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/message is required/i)).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.getByRole('link', { name: /contact/i }).click();
    
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('textarea[name="message"]', 'Test message');
    
    await page.getByRole('button', { name: /send/i }).click();
    
    await expect(page.getByText(/please enter a valid email/i)).toBeVisible();
  });

  test('should handle server errors gracefully', async ({ page }) => {
    await page.route('/api/contact', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    await page.getByRole('link', { name: /contact/i }).click();
    
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john.doe@example.com');
    await page.fill('textarea[name="message"]', 'Test message');
    
    await page.getByRole('button', { name: /send/i }).click();
    
    await expect(page.getByText(/something went wrong/i)).toBeVisible();
  });

  test('should clear form after successful submission', async ({ page }) => {
    await page.getByRole('link', { name: /contact/i }).click();
    
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john.doe@example.com');
    await page.fill('textarea[name="message"]', 'Test message');
    
    await page.route('/api/contact', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
    
    await page.getByRole('button', { name: /send/i }).click();
    
    await expect(page.locator('input[name="name"]')).toHaveValue('');
    await expect(page.locator('input[name="email"]')).toHaveValue('');
    await expect(page.locator('textarea[name="message"]')).toHaveValue('');
  });
});