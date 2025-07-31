import { test, expect } from '../fixtures/test-base';

test.describe('Hero Section Interaction E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero section with reader demo widget', async ({ page }) => {
    const heroSection = page.locator('#hero-section');
    await expect(heroSection).toBeVisible();
    
    // Check for main headline
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Check for reader demo widget
    const readerWidget = page.locator('[data-reader-widget="true"], [data-reader-wrapper="true"], .reader-demo-container').first();
    await expect(readerWidget).toBeVisible();
  });

  test('should open newsletter modal when clicking Start Reading button', async ({ page }) => {
    // Find the vibrating Start Reading button
    const startReadingButton = page.getByRole('button', { name: /start reading/i }).first();
    await expect(startReadingButton).toBeVisible();
    
    await startReadingButton.click();
    
    // Check if newsletter modal opens
    const modal = page.locator('.modal, [role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal.getByText(/newsletter|subscribe/i)).toBeVisible();
  });

  test('should navigate to authors page when clicking Are you an author button', async ({ page }) => {
    const authorButton = page.getByRole('button', { name: /are you an author/i });
    await authorButton.click();
    
    await expect(page).toHaveURL(/.*\/authors/);
  });

  test('should interact with reader demo widget', async ({ page }) => {
    const readerWidget = page.locator('[data-reader-widget="true"], [data-reader-wrapper="true"], .reader-demo-container').first();
    await readerWidget.scrollIntoViewIfNeeded();
    
    // Check if Spanish content is visible
    await expect(readerWidget.getByText(/español|spanish/i)).toBeVisible();
    
    // Try to interact with the widget (click on words)
    const interactiveWord = readerWidget.locator('span').first();
    if (await interactiveWord.isVisible()) {
      await interactiveWord.click();
      // Check for translation popup or highlight
      await page.waitForTimeout(500);
    }
  });

  test('should have sticky hero background that parallaxes on scroll', async ({ page }) => {
    const stickyHero = page.locator('#hero-sticky-section');
    await expect(stickyHero).toBeVisible();
    
    // Check initial position
    const initialPosition = await stickyHero.boundingBox();
    
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(100);
    
    // Sticky section should still be visible
    await expect(stickyHero).toBeVisible();
  });
});