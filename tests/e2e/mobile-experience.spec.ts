import { test, expect, devices } from '../fixtures/test-base';

test.describe('Mobile Experience E2E', () => {
  test.use({ ...devices['iPhone 12'] });

  test('should display mobile-optimized navigation menu', async ({ page }) => {
    await page.goto('/');
    
    const desktopNav = page.locator('.desktop-nav, nav:not(.mobile-nav)').first();
    await expect(desktopNav).not.toBeVisible();
    
    const mobileMenuButton = page.locator('[aria-label*="menu"], .hamburger-menu, .mobile-menu-toggle').first();
    await expect(mobileMenuButton).toBeVisible();
    
    await mobileMenuButton.click();
    
    const mobileMenu = page.locator('.mobile-menu, .mobile-nav, [data-testid="mobile-menu"]').first();
    await expect(mobileMenu).toBeVisible();
    
    await expect(mobileMenu.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(mobileMenu.getByRole('link', { name: /features/i })).toBeVisible();
    await expect(mobileMenu.getByRole('link', { name: /pricing/i })).toBeVisible();
    
    const closeButton = page.locator('[aria-label*="close"], .close-menu').first();
    await closeButton.click();
    
    await expect(mobileMenu).not.toBeVisible();
  });

  test('should have touch-friendly interactive elements', async ({ page }) => {
    await page.goto('/');
    
    const buttons = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, a'));
      return btns.map(btn => {
        const rect = btn.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          text: btn.textContent?.trim().substring(0, 20)
        };
      });
    });
    
    const smallButtons = buttons.filter(btn => 
      btn.width < 44 || btn.height < 44
    );
    
    expect(smallButtons.length).toBe(0);
  });

  test('should handle swipe gestures on carousel', async ({ page }) => {
    await page.goto('/');
    
    const carousel = page.locator('.swiper-container, .carousel, .slider').first();
    await carousel.scrollIntoViewIfNeeded();
    
    const firstSlide = carousel.locator('.swiper-slide, .slide').first();
    const initialText = await firstSlide.textContent();
    
    const box = await carousel.boundingBox();
    if (box) {
      await page.touchscreen.swipe({
        startX: box.x + box.width - 50,
        startY: box.y + box.height / 2,
        endX: box.x + 50,
        endY: box.y + box.height / 2,
        steps: 10
      });
      
      await page.waitForTimeout(500);
      
      const activeSlide = carousel.locator('.swiper-slide-active, .slide.active').first();
      const activeText = await activeSlide.textContent();
      
      expect(activeText).not.toBe(initialText);
    }
  });

  test('should optimize images for mobile viewport', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);
      const srcset = await img.getAttribute('srcset');
      
      if (srcset) {
        expect(srcset).toMatch(/\d+w/);
        
        const sizes = await img.getAttribute('sizes');
        if (sizes) {
          expect(sizes).toMatch(/\(max-width:|media/);
        }
      }
      
      const loading = await img.getAttribute('loading');
      if (i > 2) {
        expect(loading).toBe('lazy');
      }
    }
  });

  test('should display mobile-specific content layout', async ({ page }) => {
    await page.goto('/');
    
    const heroSection = page.locator('#hero, .hero-section').first();
    const heroLayout = await heroSection.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        flexDirection: style.flexDirection,
        textAlign: style.textAlign
      };
    });
    
    expect(['column', 'block']).toContain(heroLayout.flexDirection);
    expect(heroLayout.textAlign).toBe('center');
    
    const ctaButtons = page.locator('.cta-button, button.primary');
    const buttonCount = await ctaButtons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = ctaButtons.nth(i);
      const width = await button.evaluate(el => el.getBoundingClientRect().width);
      const viewportWidth = await page.viewportSize()?.width || 375;
      
      expect(width).toBeGreaterThan(viewportWidth * 0.8);
    }
  });
});