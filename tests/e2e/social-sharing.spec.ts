import { test, expect } from '../fixtures/test-base';

test.describe('Social Sharing E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should share page on Twitter/X', async ({ page }) => {
    const shareButton = page.locator('[aria-label*="share"], .share-button').first();
    
    if (await shareButton.isVisible()) {
      await shareButton.click();
      
      const twitterShare = page.locator('[aria-label*="twitter"], [aria-label*="x"], .twitter-share').first();
      
      const [newPage] = await Promise.all([
        page.waitForEvent('popup'),
        twitterShare.click()
      ]);
      
      await expect(newPage).toHaveURL(/.*twitter\.com\/intent\/tweet|x\.com\/intent\/tweet/);
      
      const url = newPage.url();
      expect(url).toContain('text=');
      expect(url).toContain('url=');
      
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const sharedUrl = urlParams.get('url');
      expect(sharedUrl).toContain('langomango');
      
      await newPage.close();
    }
  });

  test('should share page on Facebook', async ({ page }) => {
    const shareButton = page.locator('[aria-label*="share"], .share-button').first();
    
    if (await shareButton.isVisible()) {
      await shareButton.click();
      
      const facebookShare = page.locator('[aria-label*="facebook"], .facebook-share').first();
      
      const [newPage] = await Promise.all([
        page.waitForEvent('popup'),
        facebookShare.click()
      ]);
      
      await expect(newPage).toHaveURL(/.*facebook\.com\/sharer/);
      
      const url = newPage.url();
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const sharedUrl = urlParams.get('u');
      expect(sharedUrl).toContain('langomango');
      
      await newPage.close();
    }
  });

  test('should share page on LinkedIn', async ({ page }) => {
    const shareButton = page.locator('[aria-label*="share"], .share-button').first();
    
    if (await shareButton.isVisible()) {
      await shareButton.click();
      
      const linkedinShare = page.locator('[aria-label*="linkedin"], .linkedin-share').first();
      
      const [newPage] = await Promise.all([
        page.waitForEvent('popup'),
        linkedinShare.click()
      ]);
      
      await expect(newPage).toHaveURL(/.*linkedin\.com\/sharing/);
      
      const url = newPage.url();
      expect(url).toContain('url=');
      
      await newPage.close();
    }
  });

  test('should copy link to clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    const shareButton = page.locator('[aria-label*="share"], .share-button').first();
    
    if (await shareButton.isVisible()) {
      await shareButton.click();
      
      const copyLinkButton = page.locator('[aria-label*="copy link"], .copy-link').first();
      await copyLinkButton.click();
      
      await expect(page.getByText(/link copied|copied to clipboard/i)).toBeVisible();
      
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardText).toContain('http');
      expect(clipboardText).toContain('langomango');
    }
  });

  test('should track social sharing analytics', async ({ page }) => {
    const analyticsRequests: any[] = [];
    
    page.on('request', request => {
      if (request.url().includes('analytics') || request.url().includes('gtm')) {
        analyticsRequests.push({
          url: request.url(),
          postData: request.postData()
        });
      }
    });
    
    const shareButton = page.locator('[aria-label*="share"], .share-button').first();
    
    if (await shareButton.isVisible()) {
      await shareButton.click();
      
      const twitterShare = page.locator('[aria-label*="twitter"], .twitter-share').first();
      
      await Promise.all([
        page.waitForEvent('popup'),
        twitterShare.click()
      ]).catch(() => {});
      
      await page.waitForTimeout(1000);
      
      const shareEvents = analyticsRequests.filter(req => 
        req.url.includes('share') || 
        req.postData?.includes('share') ||
        req.postData?.includes('social')
      );
      
      expect(shareEvents.length).toBeGreaterThan(0);
    }
  });
});