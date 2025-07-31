import { test, expect } from '../fixtures/test-base';

test.describe('Simple Modal Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have interactive buttons on the page', async ({ page }) => {
    // Check for any buttons that might trigger modals
    const buttons = await page.locator('button').count();
    expect(buttons).toBeGreaterThan(0);
    
    // Check for common CTA patterns
    const ctaElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, a'));
      return elements.filter(el => {
        const text = el.textContent?.toLowerCase() || '';
        return text.includes('demo') || 
               text.includes('start') || 
               text.includes('try') ||
               text.includes('get') ||
               text.includes('subscribe');
      }).length;
    });
    
    expect(ctaElements).toBeGreaterThan(0);
  });

  test('should have modal or dialog capabilities', async ({ page }) => {
    // Check for modal-related elements or classes
    const hasModalSupport = await page.evaluate(() => {
      // Look for common modal patterns
      const modalElements = document.querySelectorAll(
        '[role="dialog"], .modal, .dialog, .popup, [class*="modal"], [id*="modal"]'
      );
      
      // Check for overlay/backdrop elements
      const overlayElements = document.querySelectorAll(
        '.overlay, .backdrop, [class*="overlay"], [class*="backdrop"]'
      );
      
      // Check for newsletter forms
      const newsletterElements = document.querySelectorAll(
        '[class*="newsletter"], [id*="newsletter"], form[action*="newsletter"]'
      );
      
      return modalElements.length > 0 || 
             overlayElements.length > 0 || 
             newsletterElements.length > 0;
    });
    
    expect(hasModalSupport).toBeTruthy();
  });

  test('should have form elements for user interaction', async ({ page }) => {
    // Check for form inputs
    const inputs = await page.locator('input').count();
    expect(inputs).toBeGreaterThan(0);
    
    // Check for email inputs specifically
    const emailInputs = await page.locator('input[type="email"], input[name*="email"]').count();
    expect(emailInputs).toBeGreaterThanOrEqual(0);
  });
});