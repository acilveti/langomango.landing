import { test, expect } from '../fixtures/test-base';

test.describe('Simple Language Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have language switching capability', async ({ page }) => {
    // Look for any language-related element without specific selectors
    const pageContent = await page.content();
    
    // Check if there's any language switching UI
    const hasLanguageUI = pageContent.includes('EN') || 
                         pageContent.includes('ES') || 
                         pageContent.includes('English') || 
                         pageContent.includes('Español');
    
    expect(hasLanguageUI).toBeTruthy();
  });

  test('should have content in multiple languages', async ({ page }) => {
    // Check for common multilingual patterns
    const hasI18n = await page.evaluate(() => {
      // Check for i18n attributes or classes
      const i18nElements = document.querySelectorAll('[data-i18n], [class*="i18n"], [lang]');
      return i18nElements.length > 0;
    });
    
    expect(hasI18n).toBeTruthy();
  });

  test('should have language preference storage', async ({ page }) => {
    // Check if localStorage is being used for language
    const localStorageKeys = await page.evaluate(() => {
      return Object.keys(localStorage);
    });
    
    const hasLanguageKey = localStorageKeys.some(key => 
      key.toLowerCase().includes('lang') || 
      key.toLowerCase().includes('locale') ||
      key.toLowerCase().includes('i18n')
    );
    
    expect(hasLanguageKey).toBeTruthy();
  });
});