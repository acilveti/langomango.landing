import { test as base } from '@playwright/test';

// Custom test fixtures that extend Playwright's base test
export const test = base.extend({
  // Add custom fixtures here if needed
  // For example, authenticated page, test data, etc.
});

export { expect } from '@playwright/test';

// Common test configurations
export const testConfig = {
  // Viewport sizes for responsive testing
  viewports: {
    desktop: { width: 1920, height: 1080 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 667 }
  },
  
  // Common timeouts
  timeouts: {
    navigation: 30000,
    element: 5000,
    animation: 1000
  },
  
  // Test user data
  testUser: {
    email: 'test@example.com',
    name: 'Test User'
  }
};

// Helper to wait for all images to load
export async function waitForImages(page: any) {
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images.every((img: any) => img.complete && img.naturalHeight !== 0);
  });
}

// Helper to check if element is in viewport
export async function isInViewport(page: any, selector: string) {
  return await page.evaluate((sel: string) => {
    const element = document.querySelector(sel);
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, selector);
}