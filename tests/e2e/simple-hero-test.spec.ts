import { test, expect } from '../fixtures/test-base';

test.describe('Simple Hero Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have a hero section with content', async ({ page }) => {
    // Check for hero section existence
    const heroSection = await page.evaluate(() => {
      const possibleHero = document.querySelector(
        '#hero, .hero, [class*="hero"], section:first-of-type, header + section'
      );
      return !!possibleHero;
    });
    
    expect(heroSection).toBeTruthy();
    
    // Check for hero content
    const heroContent = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2');
      const buttons = document.querySelectorAll('button, a[role="button"]');
      
      return {
        hasHeadings: headings.length > 0,
        hasButtons: buttons.length > 0,
        headingText: headings[0]?.textContent?.trim() || ''
      };
    });
    
    expect(heroContent.hasHeadings).toBeTruthy();
    expect(heroContent.hasButtons).toBeTruthy();
  });

  test('should have call-to-action elements', async ({ page }) => {
    // Check for CTA buttons
    const ctaElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, a'));
      return elements.filter(el => {
        const text = el.textContent?.toLowerCase() || '';
        const className = el.className?.toLowerCase() || '';
        
        return text.includes('start') || 
               text.includes('begin') ||
               text.includes('get') ||
               text.includes('try') ||
               text.includes('demo') ||
               className.includes('cta') ||
               className.includes('primary');
      }).length;
    });
    
    expect(ctaElements).toBeGreaterThan(0);
  });

  test('should have proper page structure', async ({ page }) => {
    // Check basic page structure
    const structure = await page.evaluate(() => {
      return {
        hasTitle: !!document.title,
        hasMainContent: !!document.querySelector('main, [role="main"], #main'),
        hasHeader: !!document.querySelector('header, [role="banner"], nav'),
        hasFooter: !!document.querySelector('footer, [role="contentinfo"]')
      };
    });
    
    expect(structure.hasTitle).toBeTruthy();
    expect(structure.hasMainContent || structure.hasHeader).toBeTruthy();
  });
});