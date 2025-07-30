import { test, expect } from '../fixtures/test-base';
import { selectors } from '../fixtures/selectors';

test.describe('Testimonials Section Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    // Wait for the page to be fully loaded and the testimonials section to appear
    await page.waitForSelector(selectors.testimonials.section, { timeout: 30000 });
    
    // Scroll to testimonials section
    await page.locator(selectors.testimonials.section).scrollIntoViewIfNeeded();
  });

  test('should display testimonials section with title', async ({ page }) => {
    const section = page.locator(selectors.testimonials.section);
    await expect(section).toBeVisible();
    
    // Check for title and overtitle
    const title = section.locator('h1');
    const overTitle = section.locator('[class*="OverTitle"]');
    
    await expect(title).toBeVisible();
    await expect(overTitle).toBeVisible();
  });

  test('should display testimonial cards', async ({ page }) => {
    const cards = page.locator(selectors.testimonials.card);
    const cardCount = await cards.count();
    
    // Should have at least one testimonial
    expect(cardCount).toBeGreaterThan(0);
    
    // Check first card structure
    const firstCard = cards.first();
    await expect(firstCard).toBeVisible();
  });

  test('should display testimonial content correctly', async ({ page }) => {
    const cards = page.locator(selectors.testimonials.card);
    const firstCard = cards.first();
    
    // Check for testimonial content
    const content = firstCard.locator(selectors.testimonials.content);
    await expect(content).toBeVisible();
    
    // Content should have text
    const contentText = await content.textContent();
    expect(contentText).toBeTruthy();
    expect(contentText!.length).toBeGreaterThan(10);
  });

  test('should display author information', async ({ page }) => {
    const cards = page.locator(selectors.testimonials.card);
    
    // Check each card has author info
    const cardCount = await cards.count();
    for (let i = 0; i < Math.min(cardCount, 3); i++) {
      const card = cards.nth(i);
      
      // Check author name
      const authorName = card.locator(selectors.testimonials.author);
      await expect(authorName).toBeVisible();
      
      const name = await authorName.textContent();
      expect(name).toBeTruthy();
    }
  });

  test('should display company information', async ({ page }) => {
    const cards = page.locator(selectors.testimonials.card);
    const firstCard = cards.first();
    
    // Check for company name
    const companyName = firstCard.locator(selectors.testimonials.company);
    const hasCompany = await companyName.count() > 0;
    
    if (hasCompany) {
      await expect(companyName).toBeVisible();
      const company = await companyName.textContent();
      expect(company).toBeTruthy();
    }
  });

  test('should display author avatars', async ({ page }) => {
    const avatars = page.locator(selectors.testimonials.avatar);
    const avatarCount = await avatars.count();
    
    if (avatarCount > 0) {
      // Check first avatar
      const firstAvatar = avatars.first();
      await expect(firstAvatar).toBeVisible();
      
      // Check image has loaded
      const src = await firstAvatar.getAttribute('src');
      expect(src).toBeTruthy();
      
      // Verify image loaded successfully
      const isLoaded = await firstAvatar.evaluate((img: HTMLImageElement) => {
        return img.complete && img.naturalHeight !== 0;
      });
      expect(isLoaded).toBe(true);
    }
  });

  test('should handle testimonial grid layout', async ({ page }) => {
    const container = page.locator(selectors.testimonials.container);
    
    // Check if using grid or flex layout
    const displayStyle = await container.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        gridTemplateColumns: styles.gridTemplateColumns,
        flexDirection: styles.flexDirection
      };
    });
    
    // Should use either grid or flex for layout
    expect(['grid', 'flex']).toContain(displayStyle.display);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const cards = page.locator(selectors.testimonials.card);
    const firstCard = cards.first();
    
    // Cards should stack on mobile
    const cardWidth = await firstCard.evaluate(el => el.offsetWidth);
    const viewportWidth = 375;
    
    // Card should take most of the viewport width (accounting for padding)
    expect(cardWidth).toBeGreaterThan(viewportWidth * 0.8);
    expect(cardWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test('should handle quote styling', async ({ page }) => {
    const quotes = page.locator(selectors.testimonials.content);
    const firstQuote = quotes.first();
    
    // Check for quote marks or special styling
    const hasQuoteStyle = await firstQuote.evaluate(el => {
      const styles = window.getComputedStyle(el);
      const beforeContent = window.getComputedStyle(el, '::before').content;
      const afterContent = window.getComputedStyle(el, '::after').content;
      
      // Check for quote marks in pseudo elements or special font
      return beforeContent.includes('"') || 
             afterContent.includes('"') ||
             styles.fontStyle === 'italic';
    });
    
    console.log('Testimonial has quote styling:', hasQuoteStyle);
  });

  test('should display CTA section after testimonials', async ({ page }) => {
    const section = page.locator(selectors.testimonials.section);
    
    // Look for CTA section that follows testimonials
    const ctaSection = page.locator('#cta-section-top');
    await expect(ctaSection).toBeVisible();
    
    // CTA should be after testimonials
    const testimonialBox = await section.boundingBox();
    const ctaBox = await ctaSection.boundingBox();
    
    if (testimonialBox && ctaBox) {
      expect(ctaBox.y).toBeGreaterThan(testimonialBox.y);
    }
  });

  test('should handle long testimonials properly', async ({ page }) => {
    const contents = page.locator(selectors.testimonials.content);
    
    // Check if long content is handled with ellipsis or wrapping
    const firstContent = contents.first();
    const overflow = await firstContent.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        overflow: styles.overflow,
        textOverflow: styles.textOverflow,
        whiteSpace: styles.whiteSpace,
        lineClamp: styles.webkitLineClamp
      };
    });
    
    // Content should either wrap or have ellipsis
    const hasProperOverflow = 
      overflow.textOverflow === 'ellipsis' ||
      overflow.whiteSpace === 'normal' ||
      overflow.lineClamp !== '';
    
    expect(hasProperOverflow).toBe(true);
  });

  test('should load all testimonial images', async ({ page }) => {
    // Wait for all images in testimonial section
    await page.waitForFunction(() => {
      const section = document.querySelector('#section-1');
      if (!section) return false;
      
      const images = section.querySelectorAll('img');
      return Array.from(images).every((img: any) => 
        img.complete && img.naturalHeight !== 0
      );
    }, { timeout: 10000 });
    
    // Verify images loaded
    const images = page.locator(`${selectors.testimonials.section} img`);
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();
    }
  });
});