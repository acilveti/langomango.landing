import { test, expect } from '../fixtures/test-base';

test.describe('Features Exploration E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should explore interactive language learning features', async ({ page }) => {
    await page.getByRole('link', { name: /features/i }).click();
    
    await expect(page.getByRole('heading', { name: /features|what.*offer/i })).toBeVisible();
    
    const interactiveCard = page.locator('.feature-card, [data-feature]').filter({ hasText: /interactive/i });
    await interactiveCard.hover();
    
    await expect(interactiveCard.locator('.feature-details, .hover-content')).toBeVisible();
    
    await interactiveCard.getByRole('button', { name: /learn more|explore/i }).click();
    
    await expect(page.getByText(/interactive lessons/i)).toBeVisible();
  });

  test('should view feature comparison table', async ({ page }) => {
    await page.getByRole('link', { name: /features/i }).click();
    
    const comparisonTable = page.locator('table, .comparison-table').filter({ hasText: /feature|compare/i });
    await expect(comparisonTable).toBeVisible();
    
    const rows = comparisonTable.locator('tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(3);
    
    const progressTracking = rows.filter({ hasText: /progress tracking/i });
    await expect(progressTracking.locator('td').nth(1)).toContainText(/✓|yes|included/i);
  });

  test('should play feature demo video', async ({ page }) => {
    await page.getByRole('link', { name: /features/i }).click();
    
    const videoSection = page.locator('.video-demo, [data-testid="feature-video"]').first();
    const playButton = videoSection.getByRole('button', { name: /play|watch/i });
    
    await playButton.click();
    
    const video = page.locator('video, iframe[src*="youtube"], iframe[src*="vimeo"]').first();
    await expect(video).toBeVisible();
    
    await page.waitForTimeout(2000);
    
    const isPlaying = await video.evaluate((el: HTMLVideoElement) => {
      if (el.tagName === 'VIDEO') {
        return !el.paused;
      }
      return true;
    });
    
    expect(isPlaying).toBeTruthy();
  });

  test('should interact with feature tabs', async ({ page }) => {
    await page.getByRole('link', { name: /features/i }).click();
    
    const speakingTab = page.getByRole('tab', { name: /speaking/i });
    const listeningTab = page.getByRole('tab', { name: /listening/i });
    const readingTab = page.getByRole('tab', { name: /reading/i });
    
    await speakingTab.click();
    await expect(page.getByText(/conversation practice/i)).toBeVisible();
    
    await listeningTab.click();
    await expect(page.getByText(/audio lessons/i)).toBeVisible();
    
    await readingTab.click();
    await expect(page.getByText(/reading comprehension/i)).toBeVisible();
  });

  test('should request feature demo', async ({ page }) => {
    await page.getByRole('link', { name: /features/i }).click();
    
    const demoButton = page.getByRole('button', { name: /request.*demo|get.*demo/i });
    await demoButton.click();
    
    const modal = page.locator('.modal, [role="dialog"]');
    await expect(modal).toBeVisible();
    
    await modal.locator('input[name="name"]').fill('Demo User');
    await modal.locator('input[name="email"]').fill('demo@example.com');
    await modal.locator('select[name="language"]').selectOption('spanish');
    
    await modal.getByRole('button', { name: /submit|request/i }).click();
    
    await expect(page.getByText(/demo.*requested|thank you/i)).toBeVisible();
  });
});