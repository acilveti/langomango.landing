import { test, expect } from '../fixtures/test-base';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Accessibility Compliance E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const headings = await page.evaluate(() => {
      const h1Count = document.querySelectorAll('h1').length;
      const headingLevels = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        .map(h => parseInt(h.tagName[1]));
      
      return { h1Count, headingLevels };
    });
    
    // Allow multiple h1 elements as long as there's at least one
    expect(headings.h1Count).toBeGreaterThan(0);
    
    for (let i = 1; i < headings.headingLevels.length; i++) {
      const diff = headings.headingLevels[i] - headings.headingLevels[i - 1];
      expect(diff).toBeLessThanOrEqual(1);
    }
  });

  test('should have alt text for all images', async ({ page }) => {
    const imagesWithoutAlt = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.filter(img => !img.alt || img.alt.trim() === '').length;
    });
    
    expect(imagesWithoutAlt).toBe(0);
    
    const decorativeImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img[role="presentation"], img[aria-hidden="true"]'));
      return images.every(img => img.alt === '');
    });
    
    expect(decorativeImages).toBeTruthy();
  });

  test('should have proper ARIA labels for interactive elements', async ({ page }) => {
    const unlabeledButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.filter(btn => 
        !btn.textContent?.trim() && 
        !btn.getAttribute('aria-label') && 
        !btn.getAttribute('aria-labelledby')
      ).length;
    });
    
    expect(unlabeledButtons).toBe(0);
    
    const unlabeledLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links.filter(link => 
        !link.textContent?.trim() && 
        !link.getAttribute('aria-label') && 
        !link.getAttribute('aria-labelledby')
      ).length;
    });
    
    expect(unlabeledLinks).toBe(0);
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.keyboard.press('Tab');
    
    const firstFocusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });
    
    expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(firstFocusedElement);
    
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          visible: el ? window.getComputedStyle(el).visibility !== 'hidden' : false,
          interactive: el ? ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName) : false
        };
      });
      
      expect(focusedElement.visible).toBeTruthy();
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    try {
      await injectAxe(page);
      
      const results = await checkA11y(page, null, {
        rules: {
          'color-contrast': { enabled: true }
        }
      });
      
      expect(results).toBeUndefined();
    } catch (error) {
      const contrastIssues = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        const issues: string[] = [];
        
        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          const bg = style.backgroundColor;
          const color = style.color;
          
          if (bg !== 'rgba(0, 0, 0, 0)' && color !== 'rgba(0, 0, 0, 0)') {
            const text = el.textContent?.trim();
            if (text && text.length > 0) {
              issues.push(`Element with text "${text.substring(0, 20)}..." may have contrast issues`);
            }
          }
        });
        
        return issues.slice(0, 5);
      });
      
      expect(contrastIssues.length).toBe(0);
    }
  });
});