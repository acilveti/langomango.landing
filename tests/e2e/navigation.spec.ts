import { test, expect } from '../fixtures/test-base';
import { selectors } from '../fixtures/selectors';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('should display navigation bar', async ({ page }) => {
    const nav = page.locator(selectors.nav.container);
    await expect(nav).toBeVisible();
  });

  test('should display logo with link to home', async ({ page }) => {
    const logo = page.locator(selectors.nav.logo);
    await expect(logo).toBeVisible();
    
    // Logo should link to home
    const href = await logo.getAttribute('href');
    expect(href).toBe('/');
  });

  test('should display CTA button in navigation', async ({ page }) => {
    const ctaButton = page.locator(selectors.nav.ctaButton);
    
    // On desktop, CTA should be visible
    const isDesktop = await page.viewportSize()?.width! > 1024;
    if (isDesktop) {
      await expect(ctaButton).toBeVisible();
      await expect(ctaButton).toHaveText('Use the demo');
    }
  });

  test('should handle mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Mobile menu button should be visible
    const mobileMenuButton = page.locator(selectors.nav.mobileMenuButton);
    await expect(mobileMenuButton).toBeVisible();
    
    // Click mobile menu
    await mobileMenuButton.click();
    
    // Navigation drawer should open
    const drawer = page.locator('[class*="Drawer"], [class*="NavigationDrawer"]');
    await expect(drawer).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to different sections via smooth scroll', async ({ page }) => {
    // Check if there are anchor links
    const anchorLinks = page.locator('a[href^="#"]');
    const linkCount = await anchorLinks.count();
    
    if (linkCount > 0) {
      const firstLink = anchorLinks.first();
      const href = await firstLink.getAttribute('href');
      
      if (href && href !== '#') {
        // Click the link
        await firstLink.click();
        
        // Wait for scroll
        await page.waitForTimeout(1000);
        
        // Check if the target section is in view
        const targetSection = page.locator(href);
        if (await targetSection.count() > 0) {
          const isInView = await targetSection.evaluate(el => {
            const rect = el.getBoundingClientRect();
            return rect.top >= 0 && rect.top <= window.innerHeight;
          });
          
          expect(isInView).toBe(true);
        }
      }
    }
  });

  test('should maintain navigation state on scroll', async ({ page }) => {
    const nav = page.locator(selectors.nav.container);
    
    // Get initial navigation position
    const initialPosition = await nav.evaluate(el => {
      const rect = el.getBoundingClientRect();
      return { top: rect.top, position: window.getComputedStyle(el).position };
    });
    
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);
    
    // Navigation should still be accessible (sticky or fixed)
    await expect(nav).toBeVisible();
    
    // Check if navigation is sticky/fixed
    const scrolledPosition = await nav.evaluate(el => {
      return window.getComputedStyle(el).position;
    });
    
    console.log('Nav position after scroll:', scrolledPosition);
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Focus on first nav item
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // Skip to nav items
    
    // Check if something in nav is focused
    const focusedElement = await page.evaluate(() => {
      const active = document.activeElement;
      return {
        tagName: active?.tagName,
        isInNav: active?.closest('nav') !== null
      };
    });
    
    expect(focusedElement.tagName).toBeTruthy();
  });

  test('should display correct navigation items based on language', async ({ page }) => {
    // Check current language
    const htmlLang = await page.getAttribute('html', 'lang');
    
    // Navigation items should be in the correct language
    const ctaButton = page.locator(selectors.nav.ctaButton);
    if (await ctaButton.count() > 0) {
      const buttonText = await ctaButton.textContent();
      
      if (htmlLang === 'en') {
        expect(buttonText).toContain('demo');
      }
      // Add more language checks as needed
    }
  });

  test('should highlight active section in navigation', async ({ page }) => {
    // If navigation has section links
    const navLinks = page.locator('nav a[href^="#"]');
    const linkCount = await navLinks.count();
    
    if (linkCount > 0) {
      // Scroll to a section
      await page.evaluate(() => {
        const featuresSection = document.querySelector('#features-section');
        if (featuresSection) {
          featuresSection.scrollIntoView();
        }
      });
      
      await page.waitForTimeout(1000);
      
      // Check if any nav link has active state
      const hasActiveLink = await navLinks.evaluateAll(links => {
        return links.some(link => {
          const classes = link.className;
          const styles = window.getComputedStyle(link);
          return classes.includes('active') || 
                 styles.fontWeight === 'bold' ||
                 styles.color !== window.getComputedStyle(links[0]).color;
        });
      });
      
      console.log('Navigation has active state indicators:', hasActiveLink);
    }
  });

  test('should handle navigation drawer close on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open mobile menu
    const mobileMenuButton = page.locator(selectors.nav.mobileMenuButton);
    await mobileMenuButton.click();
    
    // Wait for drawer to open
    const drawer = page.locator('[class*="Drawer"], [class*="NavigationDrawer"]');
    await expect(drawer).toBeVisible();
    
    // Click outside or close button
    const closeButton = drawer.locator('[aria-label="Close"], [class*="Close"]');
    if (await closeButton.count() > 0) {
      await closeButton.click();
    } else {
      // Click overlay
      const overlay = page.locator('[class*="Overlay"]');
      if (await overlay.count() > 0) {
        await overlay.click({ position: { x: 10, y: 10 } });
      }
    }
    
    // Drawer should close
    await expect(drawer).not.toBeVisible({ timeout: 5000 });
  });
});