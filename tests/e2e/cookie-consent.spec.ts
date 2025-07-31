import { test, expect } from '../fixtures/test-base';

test.describe('Cookie Consent E2E', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
  });

  test('should display cookie consent banner on first visit', async ({ page }) => {
    const cookieBanner = page.locator('.cookie-banner, .cookie-consent, [data-testid="cookie-banner"]').first();
    await expect(cookieBanner).toBeVisible();
    
    await expect(cookieBanner.getByText(/cookie|privacy/i)).toBeVisible();
    await expect(cookieBanner.getByRole('button', { name: /accept/i })).toBeVisible();
    await expect(cookieBanner.getByRole('button', { name: /decline|reject/i })).toBeVisible();
  });

  test('should accept all cookies and hide banner', async ({ page }) => {
    const cookieBanner = page.locator('.cookie-banner, .cookie-consent').first();
    await cookieBanner.getByRole('button', { name: /accept all/i }).click();
    
    await expect(cookieBanner).not.toBeVisible();
    
    const cookies = await page.context().cookies();
    const consentCookie = cookies.find(c => c.name.includes('consent') || c.name.includes('cookie'));
    expect(consentCookie).toBeDefined();
    expect(consentCookie?.value).toContain('accept');
    
    await page.reload();
    await expect(cookieBanner).not.toBeVisible();
  });

  test('should manage cookie preferences', async ({ page }) => {
    const cookieBanner = page.locator('.cookie-banner, .cookie-consent').first();
    const manageButton = cookieBanner.getByRole('button', { name: /manage|preferences|settings/i });
    
    if (await manageButton.isVisible()) {
      await manageButton.click();
      
      const preferencesModal = page.locator('.cookie-preferences, [role="dialog"]');
      await expect(preferencesModal).toBeVisible();
      
      const analyticsToggle = preferencesModal.locator('input[type="checkbox"]').filter({ hasText: /analytics/i });
      const marketingToggle = preferencesModal.locator('input[type="checkbox"]').filter({ hasText: /marketing/i });
      
      await analyticsToggle.uncheck();
      await marketingToggle.uncheck();
      
      await preferencesModal.getByRole('button', { name: /save/i }).click();
      
      const cookies = await page.context().cookies();
      const analyticsCookie = cookies.find(c => c.name.includes('analytics') || c.name.includes('ga'));
      expect(analyticsCookie).toBeUndefined();
    }
  });

  test('should decline cookies and limit tracking', async ({ page }) => {
    const cookieBanner = page.locator('.cookie-banner, .cookie-consent').first();
    await cookieBanner.getByRole('button', { name: /decline|reject/i }).click();
    
    await expect(cookieBanner).not.toBeVisible();
    
    const cookies = await page.context().cookies();
    const trackingCookies = cookies.filter(c => 
      c.name.includes('analytics') || 
      c.name.includes('marketing') || 
      c.name.includes('_ga')
    );
    
    expect(trackingCookies.length).toBe(0);
    
    const requests: string[] = [];
    page.on('request', request => {
      requests.push(request.url());
    });
    
    await page.reload();
    
    const analyticsRequests = requests.filter(url => 
      url.includes('google-analytics') || 
      url.includes('gtag') || 
      url.includes('facebook')
    );
    
    expect(analyticsRequests.length).toBe(0);
  });

  test('should link to privacy policy from cookie banner', async ({ page }) => {
    const cookieBanner = page.locator('.cookie-banner, .cookie-consent').first();
    const privacyLink = cookieBanner.getByRole('link', { name: /privacy|policy/i });
    
    await privacyLink.click();
    
    await expect(page).toHaveURL(/.*privacy/);
    await expect(page.getByRole('heading', { name: /privacy policy/i })).toBeVisible();
    
    const cookieSection = page.locator('section, div').filter({ hasText: /cookies|tracking/i }).first();
    await expect(cookieSection).toBeVisible();
  });
});