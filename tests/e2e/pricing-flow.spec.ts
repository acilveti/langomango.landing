import { test, expect } from '../fixtures/test-base';

test.describe('Pricing Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate through pricing selection to signup', async ({ page }) => {
    await page.getByRole('link', { name: /pricing/i }).click();
    
    await expect(page).toHaveURL(/.*#pricing/);
    await expect(page.getByText(/choose your plan/i)).toBeVisible();
    
    const premiumCard = page.locator('[data-testid="pricing-card-premium"], .pricing-card').filter({ hasText: /premium/i });
    await premiumCard.getByRole('button', { name: /get started|choose plan/i }).click();
    
    await expect(page).toHaveURL(/.*\/signup/);
    await expect(page.getByText(/create.*account/i)).toBeVisible();
  });

  test('should display correct pricing for different billing periods', async ({ page }) => {
    await page.getByRole('link', { name: /pricing/i }).click();
    
    const monthlyButton = page.getByRole('button', { name: /monthly/i });
    const yearlyButton = page.getByRole('button', { name: /yearly|annual/i });
    
    await monthlyButton.click();
    await expect(page.getByText(/\$\d+\.?\d*\/month/)).toBeVisible();
    
    await yearlyButton.click();
    await expect(page.getByText(/\$\d+\.?\d*\/year/)).toBeVisible();
    await expect(page.getByText(/save \d+%/i)).toBeVisible();
  });

  test('should compare features across pricing tiers', async ({ page }) => {
    await page.getByRole('link', { name: /pricing/i }).click();
    
    const freeFeatures = page.locator('.pricing-card').filter({ hasText: /free/i });
    const premiumFeatures = page.locator('.pricing-card').filter({ hasText: /premium/i });
    
    await expect(freeFeatures.getByText(/basic lessons/i)).toBeVisible();
    await expect(premiumFeatures.getByText(/unlimited lessons/i)).toBeVisible();
    await expect(premiumFeatures.getByText(/1-on-1 tutoring/i)).toBeVisible();
  });

  test('should handle pricing FAQ interactions', async ({ page }) => {
    await page.getByRole('link', { name: /pricing/i }).click();
    
    const faqSection = page.locator('[data-testid="pricing-faq"], .faq-section');
    await expect(faqSection).toBeVisible();
    
    const firstQuestion = faqSection.locator('.faq-item, [role="button"]').first();
    await firstQuestion.click();
    
    const answer = faqSection.locator('.faq-answer, .answer-content').first();
    await expect(answer).toBeVisible();
    
    await firstQuestion.click();
    await expect(answer).not.toBeVisible();
  });

  test('should track pricing selection in analytics', async ({ page }) => {
    const analyticsRequests: string[] = [];
    
    page.on('request', request => {
      if (request.url().includes('analytics') || request.url().includes('gtm')) {
        analyticsRequests.push(request.url());
      }
    });
    
    await page.getByRole('link', { name: /pricing/i }).click();
    
    const premiumCard = page.locator('.pricing-card').filter({ hasText: /premium/i });
    await premiumCard.getByRole('button', { name: /get started|choose plan/i }).click();
    
    expect(analyticsRequests.length).toBeGreaterThan(0);
  });
});