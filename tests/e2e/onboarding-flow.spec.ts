import { test, expect } from '../fixtures/test-base';

test.describe('Onboarding Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Start fresh for each onboarding test
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    await page.goto('/');
  });

  test('should complete full onboarding flow for new user', async ({ page }) => {
    await page.getByRole('button', { name: /get started|start free/i }).first().click();
    
    // Step 1: Create account
    await page.fill('input[name="email"]', 'newuser@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.getByRole('button', { name: /continue|next/i }).click();
    
    // Step 2: Select learning goal
    await expect(page.getByText(/what.*goal|why.*learning/i)).toBeVisible();
    const travelGoal = page.locator('.goal-option, [data-goal]').filter({ hasText: /travel/i });
    await travelGoal.click();
    await page.getByRole('button', { name: /continue|next/i }).click();
    
    // Step 3: Choose language
    await expect(page.getByText(/which language|choose.*language/i)).toBeVisible();
    const spanishOption = page.locator('.language-option, [data-language]').filter({ hasText: /spanish/i });
    await spanishOption.click();
    await page.getByRole('button', { name: /continue|next/i }).click();
    
    // Step 4: Set experience level
    await expect(page.getByText(/experience|level/i)).toBeVisible();
    const beginnerLevel = page.locator('.level-option, [data-level]').filter({ hasText: /beginner/i });
    await beginnerLevel.click();
    await page.getByRole('button', { name: /continue|next/i }).click();
    
    // Step 5: Schedule preferences
    await expect(page.getByText(/schedule|when.*learn/i)).toBeVisible();
    const morningSlot = page.locator('.time-slot, [data-time]').filter({ hasText: /morning/i });
    await morningSlot.click();
    
    const dailyFrequency = page.locator('.frequency-option').filter({ hasText: /daily/i });
    await dailyFrequency.click();
    
    await page.getByRole('button', { name: /finish|complete/i }).click();
    
    // Verify onboarding completion
    await expect(page.getByText(/welcome|congratulations/i)).toBeVisible();
    await expect(page).toHaveURL(/.*dashboard|home/);
  });

  test('should skip optional onboarding steps', async ({ page }) => {
    await page.getByRole('button', { name: /get started|start free/i }).first().click();
    
    // Create account
    await page.fill('input[name="email"]', 'skipper@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.getByRole('button', { name: /continue|next/i }).click();
    
    // Skip remaining steps
    for (let i = 0; i < 4; i++) {
      const skipButton = page.getByRole('button', { name: /skip|later/i });
      if (await skipButton.isVisible()) {
        await skipButton.click();
      }
    }
    
    await expect(page).toHaveURL(/.*dashboard|home/);
  });

  test('should save onboarding progress', async ({ page }) => {
    await page.getByRole('button', { name: /get started|start free/i }).first().click();
    
    // Complete first two steps
    await page.fill('input[name="email"]', 'progress@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.getByRole('button', { name: /continue|next/i }).click();
    
    await page.locator('.goal-option').filter({ hasText: /business/i }).click();
    await page.getByRole('button', { name: /continue|next/i }).click();
    
    // Refresh page
    await page.reload();
    
    // Should return to the correct step
    await expect(page.getByText(/which language|choose.*language/i)).toBeVisible();
  });

  test('should show personalized recommendations after onboarding', async ({ page }) => {
    // Complete quick onboarding
    await page.getByRole('button', { name: /get started|start free/i }).first().click();
    
    await page.fill('input[name="email"]', 'personalized@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.getByRole('button', { name: /continue|next/i }).click();
    
    await page.locator('.goal-option').filter({ hasText: /travel/i }).click();
    await page.getByRole('button', { name: /continue|next/i }).click();
    
    await page.locator('.language-option').filter({ hasText: /french/i }).click();
    await page.getByRole('button', { name: /continue|next/i }).click();
    
    await page.locator('.level-option').filter({ hasText: /beginner/i }).click();
    await page.getByRole('button', { name: /finish|complete/i }).click();
    
    // Check for personalized content
    await expect(page.getByText(/french.*beginner/i)).toBeVisible();
    await expect(page.getByText(/travel.*vocabulary|phrases/i)).toBeVisible();
  });

  test('should validate onboarding inputs', async ({ page }) => {
    await page.getByRole('button', { name: /get started|start free/i }).first().click();
    
    // Try to continue without filling required fields
    await page.getByRole('button', { name: /continue|next/i }).click();
    
    await expect(page.getByText(/email.*required/i)).toBeVisible();
    await expect(page.getByText(/password.*required/i)).toBeVisible();
    
    // Invalid email
    await page.fill('input[name="email"]', 'invalid-email');
    await page.getByRole('button', { name: /continue|next/i }).click();
    
    await expect(page.getByText(/valid email/i)).toBeVisible();
    
    // Weak password
    await page.fill('input[name="email"]', 'valid@example.com');
    await page.fill('input[name="password"]', '123');
    await page.getByRole('button', { name: /continue|next/i }).click();
    
    await expect(page.getByText(/password.*weak|minimum/i)).toBeVisible();
  });
});