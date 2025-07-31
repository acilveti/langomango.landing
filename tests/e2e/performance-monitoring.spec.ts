import { test, expect } from '../fixtures/test-base';

test.describe('Performance Monitoring E2E', () => {
  test('should load homepage within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
    
    const performanceTiming = await page.evaluate(() => {
      const timing = performance.timing;
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        fullyLoaded: timing.loadEventEnd - timing.navigationStart
      };
    });
    
    expect(performanceTiming.domContentLoaded).toBeLessThan(2000);
    expect(performanceTiming.fullyLoaded).toBeLessThan(3000);
  });

  test('should have acceptable Largest Contentful Paint (LCP)', async ({ page }) => {
    await page.goto('/');
    
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        setTimeout(() => resolve(0), 5000);
      });
    });
    
    expect(lcp).toBeGreaterThan(0);
    expect(lcp).toBeLessThan(2500);
  });

  test('should minimize Cumulative Layout Shift (CLS)', async ({ page }) => {
    await page.goto('/');
    
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).hadRecentInput) continue;
            clsValue += (entry as any).value;
          }
        }).observe({ entryTypes: ['layout-shift'] });
        
        setTimeout(() => resolve(clsValue), 3000);
      });
    });
    
    expect(cls).toBeLessThan(0.1);
  });

  test('should have low First Input Delay (FID)', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForTimeout(1000);
    
    const startTime = Date.now();
    await page.click('body');
    const clickResponseTime = Date.now() - startTime;
    
    expect(clickResponseTime).toBeLessThan(100);
    
    const buttonStartTime = Date.now();
    await page.getByRole('button').first().click();
    const buttonResponseTime = Date.now() - buttonStartTime;
    
    expect(buttonResponseTime).toBeLessThan(100);
  });

  test('should optimize resource loading', async ({ page }) => {
    const resources: { url: string; size: number; duration: number }[] = [];
    
    page.on('response', response => {
      const url = response.url();
      const resourceTiming = (response as any).timing?.();
      
      if (resourceTiming) {
        resources.push({
          url,
          size: parseInt(response.headers()['content-length'] || '0'),
          duration: resourceTiming.responseEnd - resourceTiming.requestStart
        });
      }
    });
    
    await page.goto('/');
    
    const largeResources = resources.filter(r => r.size > 500000);
    expect(largeResources.length).toBeLessThan(5);
    
    const slowResources = resources.filter(r => r.duration > 1000);
    expect(slowResources.length).toBeLessThan(3);
    
    const totalSize = resources.reduce((sum, r) => sum + r.size, 0);
    expect(totalSize).toBeLessThan(5000000);
  });
});