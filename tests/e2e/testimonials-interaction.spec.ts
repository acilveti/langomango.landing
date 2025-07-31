import { test, expect } from '../fixtures/test-base';

test.describe('Testimonials Interaction E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      const testimonialsSection = document.querySelector('#testimonials, [data-testid="testimonials"]');
      if (testimonialsSection) {
        testimonialsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  test('should navigate through testimonial carousel', async ({ page }) => {
    const testimonialCarousel = page.locator('.testimonials-carousel, .swiper-container').first();
    await expect(testimonialCarousel).toBeVisible();
    
    const firstTestimonial = page.locator('.testimonial-slide, .swiper-slide').first();
    const firstText = await firstTestimonial.locator('.testimonial-text, blockquote').textContent();
    
    const nextButton = page.locator('.swiper-button-next, button[aria-label*="next"]').first();
    await nextButton.click();
    
    await page.waitForTimeout(500);
    
    const activeTestimonial = page.locator('.swiper-slide-active, .testimonial-slide.active').first();
    const activeText = await activeTestimonial.locator('.testimonial-text, blockquote').textContent();
    
    expect(firstText).not.toBe(activeText);
  });

  test('should display testimonial author information', async ({ page }) => {
    const testimonial = page.locator('.testimonial-slide, .testimonial-card').first();
    
    await expect(testimonial.locator('.author-name, .testimonial-author')).toBeVisible();
    await expect(testimonial.locator('.author-role, .testimonial-position')).toBeVisible();
    await expect(testimonial.locator('img[alt*="author"], .author-avatar')).toBeVisible();
    
    const rating = testimonial.locator('.rating, .stars, [aria-label*="rating"]');
    await expect(rating).toBeVisible();
  });

  test('should filter testimonials by language learned', async ({ page }) => {
    const filterDropdown = page.locator('select[name="language-filter"], .testimonial-filter').first();
    
    if (await filterDropdown.isVisible()) {
      await filterDropdown.selectOption('spanish');
      
      await page.waitForTimeout(500);
      
      const visibleTestimonials = page.locator('.testimonial-slide:visible, .testimonial-card:visible');
      const count = await visibleTestimonials.count();
      
      for (let i = 0; i < count; i++) {
        const testimonial = visibleTestimonials.nth(i);
        const text = await testimonial.textContent();
        expect(text?.toLowerCase()).toMatch(/spanish|español/);
      }
    }
  });

  test('should play video testimonials', async ({ page }) => {
    const videoTestimonial = page.locator('.video-testimonial, .testimonial-video').first();
    
    if (await videoTestimonial.isVisible()) {
      const playButton = videoTestimonial.locator('.play-button, button[aria-label*="play"]');
      await playButton.click();
      
      const video = videoTestimonial.locator('video, iframe');
      await expect(video).toBeVisible();
      
      if (await video.evaluate(el => el.tagName === 'VIDEO')) {
        const isPlaying = await video.evaluate((el: HTMLVideoElement) => !el.paused);
        expect(isPlaying).toBeTruthy();
      }
    }
  });

  test('should load more testimonials on scroll or click', async ({ page }) => {
    const initialTestimonials = await page.locator('.testimonial-slide, .testimonial-card').count();
    
    const loadMoreButton = page.getByRole('button', { name: /load more|show more/i });
    
    if (await loadMoreButton.isVisible()) {
      await loadMoreButton.click();
      await page.waitForTimeout(1000);
      
      const updatedTestimonials = await page.locator('.testimonial-slide, .testimonial-card').count();
      expect(updatedTestimonials).toBeGreaterThan(initialTestimonials);
    } else {
      await page.evaluate(() => {
        const testimonialsContainer = document.querySelector('.testimonials-container, #testimonials');
        if (testimonialsContainer) {
          testimonialsContainer.scrollTop = testimonialsContainer.scrollHeight;
        }
      });
      
      await page.waitForTimeout(1000);
      
      const scrolledTestimonials = await page.locator('.testimonial-slide, .testimonial-card').count();
      expect(scrolledTestimonials).toBeGreaterThanOrEqual(initialTestimonials);
    }
  });
});