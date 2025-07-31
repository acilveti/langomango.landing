import { test, expect } from '../fixtures/test-base';

test.describe('Analytics Tracking E2E', () => {
  let analyticsEvents: any[] = [];

  test.beforeEach(async ({ page }) => {
    analyticsEvents = [];
    
    // Intercept analytics calls
    await page.addInitScript(() => {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      
      // Mock Google Analytics
      window.ga = function() {
        window.analyticsEvents = window.analyticsEvents || [];
        window.analyticsEvents.push({
          type: 'ga',
          args: Array.from(arguments)
        });
      };
      
      // Mock other analytics providers
      window.analytics = {
        track: (event: string, properties: any) => {
          window.analyticsEvents = window.analyticsEvents || [];
          window.analyticsEvents.push({
            type: 'track',
            event,
            properties
          });
        },
        page: (name: string, properties: any) => {
          window.analyticsEvents = window.analyticsEvents || [];
          window.analyticsEvents.push({
            type: 'page',
            name,
            properties
          });
        }
      };
    });
    
    await page.goto('/');
  });

  test('should track page views correctly', async ({ page }) => {
    // Initial page view
    await page.waitForTimeout(1000);
    
    const pageViewEvents = await page.evaluate(() => 
      window.analyticsEvents?.filter(e => e.type === 'page' || e.args?.[0] === 'pageview')
    );
    
    expect(pageViewEvents.length).toBeGreaterThan(0);
    
    // Navigate to another page
    await page.getByRole('link', { name: /features/i }).click();
    await page.waitForTimeout(1000);
    
    const updatedEvents = await page.evaluate(() => window.analyticsEvents);
    const featurePageViews = updatedEvents.filter(e => 
      (e.type === 'page' && e.name?.includes('features')) ||
      (e.args && e.args[1]?.includes('features'))
    );
    
    expect(featurePageViews.length).toBeGreaterThan(0);
  });

  test('should track user interactions', async ({ page }) => {
    // Track CTA button click
    const ctaButton = page.getByRole('button', { name: /get started/i }).first();
    await ctaButton.click();
    
    await page.waitForTimeout(500);
    
    const clickEvents = await page.evaluate(() => 
      window.analyticsEvents?.filter(e => 
        e.type === 'track' && e.event?.includes('click')
      )
    );
    
    expect(clickEvents.length).toBeGreaterThan(0);
    expect(clickEvents[0].properties).toHaveProperty('button_text');
  });

  test('should track form submissions', async ({ page }) => {
    // Newsletter subscription
    const emailInput = page.locator('input[placeholder*="email"]').last();
    await emailInput.fill('analytics@example.com');
    await page.getByRole('button', { name: /subscribe/i }).last().click();
    
    await page.waitForTimeout(1000);
    
    const formEvents = await page.evaluate(() => 
      window.analyticsEvents?.filter(e => 
        e.type === 'track' && 
        (e.event?.includes('form') || e.event?.includes('subscribe'))
      )
    );
    
    expect(formEvents.length).toBeGreaterThan(0);
    expect(formEvents[0].properties).toHaveProperty('form_type');
  });

  test('should track scroll depth', async ({ page }) => {
    // Scroll to different depths
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.25));
    await page.waitForTimeout(1000);
    
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.5));
    await page.waitForTimeout(1000);
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    const scrollEvents = await page.evaluate(() => 
      window.analyticsEvents?.filter(e => 
        e.type === 'track' && e.event?.includes('scroll')
      )
    );
    
    expect(scrollEvents.length).toBeGreaterThan(0);
    
    const depths = scrollEvents.map(e => e.properties?.depth);
    expect(depths).toContain(25);
    expect(depths).toContain(50);
    expect(depths).toContain(100);
  });

  test('should track engagement time', async ({ page }) => {
    // Simulate user engagement
    await page.waitForTimeout(5000);
    
    // Trigger visibility change to capture time
    await page.evaluate(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    
    await page.waitForTimeout(500);
    
    const timeEvents = await page.evaluate(() => 
      window.analyticsEvents?.filter(e => 
        e.type === 'track' && 
        (e.event?.includes('time') || e.event?.includes('engagement'))
      )
    );
    
    if (timeEvents.length > 0) {
      expect(timeEvents[0].properties?.time_on_page).toBeGreaterThan(4);
    }
  });

  test('should respect user privacy preferences', async ({ page }) => {
    // Decline analytics cookies
    const cookieBanner = page.locator('.cookie-banner, .cookie-consent').first();
    if (await cookieBanner.isVisible()) {
      await cookieBanner.getByRole('button', { name: /decline|reject/i }).click();
    }
    
    // Clear previous events
    await page.evaluate(() => { window.analyticsEvents = []; });
    
    // Try to trigger analytics events
    await page.getByRole('button', { name: /get started/i }).first().click();
    await page.waitForTimeout(1000);
    
    const eventsAfterDecline = await page.evaluate(() => window.analyticsEvents);
    
    // Should have minimal or no tracking
    const trackingEvents = eventsAfterDecline.filter(e => 
      e.type === 'track' && !e.event?.includes('consent')
    );
    
    expect(trackingEvents.length).toBe(0);
  });
});