import { test, expect } from '../fixtures/test-base';

test.describe('Simple Mobile Tests', () => {
  test('should be responsive to different viewport sizes', async ({ page }) => {
    await page.goto('/');
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);
    
    const desktopLayout = await page.evaluate(() => {
      const body = document.body;
      return {
        scrollWidth: body.scrollWidth,
        clientWidth: body.clientWidth,
        hasHorizontalScroll: body.scrollWidth > body.clientWidth
      };
    });
    
    // Should not have horizontal scroll on desktop
    expect(desktopLayout.hasHorizontalScroll).toBeFalsy();
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const mobileLayout = await page.evaluate(() => {
      const body = document.body;
      return {
        scrollWidth: body.scrollWidth,
        clientWidth: body.clientWidth,
        hasHorizontalScroll: body.scrollWidth > body.clientWidth
      };
    });
    
    // Should not have horizontal scroll on mobile
    expect(mobileLayout.hasHorizontalScroll).toBeFalsy();
  });

  test('should have mobile-friendly meta tags', async ({ page }) => {
    await page.goto('/');
    
    const metaTags = await page.evaluate(() => {
      const viewport = document.querySelector('meta[name="viewport"]');
      const mobileWebAppCapable = document.querySelector('meta[name="mobile-web-app-capable"]');
      const appleCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
      
      return {
        hasViewport: !!viewport,
        viewportContent: viewport?.getAttribute('content') || '',
        hasMobileCapable: !!mobileWebAppCapable || !!appleCapable
      };
    });
    
    expect(metaTags.hasViewport).toBeTruthy();
    expect(metaTags.viewportContent).toContain('width=device-width');
  });

  test('should have touch-friendly interactive elements', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 375, height: 667 });
    
    const touchTargets = await page.evaluate(() => {
      const interactiveElements = Array.from(
        document.querySelectorAll('button, a, input, select, textarea, [role="button"]')
      );
      
      const smallTargets = interactiveElements.filter(el => {
        const rect = el.getBoundingClientRect();
        // Check if visible
        if (rect.width === 0 || rect.height === 0) return false;
        // WCAG recommends 44x44 pixels minimum
        return rect.width < 44 || rect.height < 44;
      });
      
      return {
        total: interactiveElements.length,
        small: smallTargets.length,
        percentage: interactiveElements.length > 0 
          ? (smallTargets.length / interactiveElements.length) * 100 
          : 0
      };
    });
    
    // Allow up to 20% of elements to be smaller than recommended
    expect(touchTargets.percentage).toBeLessThan(20);
  });
});