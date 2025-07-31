import { test, expect } from '../fixtures/test-base';

test.describe('Language Selection E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should switch between English and Spanish languages', async ({ page }) => {
    const languageSelector = page.locator('[data-testid="language-selector"], button:has-text("EN"), button:has-text("ES")').first();
    
    await expect(page.getByText(/learn languages/i)).toBeVisible();
    
    await languageSelector.click();
    await page.getByRole('menuitem', { name: /español|spanish|es/i }).click();
    
    await expect(page.getByText(/aprende idiomas/i)).toBeVisible();
    await expect(page).toHaveURL(/.*locale=es/);
    
    await languageSelector.click();
    await page.getByRole('menuitem', { name: /english|inglés|en/i }).click();
    
    await expect(page.getByText(/learn languages/i)).toBeVisible();
    await expect(page).toHaveURL(/.*locale=en/);
  });

  test('should persist language preference in localStorage', async ({ page }) => {
    const languageSelector = page.locator('[data-testid="language-selector"], button:has-text("EN"), button:has-text("ES")').first();
    
    await languageSelector.click();
    await page.getByRole('menuitem', { name: /español|spanish|es/i }).click();
    
    const locale = await page.evaluate(() => localStorage.getItem('locale'));
    expect(locale).toBe('es');
    
    await page.reload();
    await expect(page.getByText(/aprende idiomas/i)).toBeVisible();
  });

  test('should update all page content when language changes', async ({ page }) => {
    const languageSelector = page.locator('[data-testid="language-selector"], button:has-text("EN"), button:has-text("ES")').first();
    
    await languageSelector.click();
    await page.getByRole('menuitem', { name: /español|spanish|es/i }).click();
    
    await expect(page.getByRole('link', { name: /características/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /precios/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /empezar|comenzar/i })).toBeVisible();
  });

  test('should handle language switch during form interaction', async ({ page }) => {
    await page.getByRole('link', { name: /contact/i }).click();
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    
    const languageSelector = page.locator('[data-testid="language-selector"], button:has-text("EN"), button:has-text("ES")').first();
    await languageSelector.click();
    await page.getByRole('menuitem', { name: /español|spanish|es/i }).click();
    
    await expect(page.locator('input[name="name"]')).toHaveValue('Test User');
    await expect(page.locator('input[name="email"]')).toHaveValue('test@example.com');
    await expect(page.getByText(/nombre/i)).toBeVisible();
    await expect(page.getByText(/correo electrónico/i)).toBeVisible();
  });

  test('should update meta tags for SEO when language changes', async ({ page }) => {
    const languageSelector = page.locator('[data-testid="language-selector"], button:has-text("EN"), button:has-text("ES")').first();
    
    await languageSelector.click();
    await page.getByRole('menuitem', { name: /español|spanish|es/i }).click();
    
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('es');
    
    const metaDescription = await page.getAttribute('meta[name="description"]', 'content');
    expect(metaDescription).toContain('idiomas');
  });
});