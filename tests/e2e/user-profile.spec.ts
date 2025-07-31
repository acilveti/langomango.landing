import { test, expect } from '../fixtures/test-base';

test.describe('User Profile E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Mock login state
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        avatar: '/avatar.jpg'
      }));
      localStorage.setItem('token', 'mock-jwt-token');
    });
    
    await page.reload();
  });

  test('should display user profile dropdown when logged in', async ({ page }) => {
    const userAvatar = page.locator('.user-avatar, [data-testid="user-menu"]').first();
    await expect(userAvatar).toBeVisible();
    
    await userAvatar.click();
    
    const profileDropdown = page.locator('.profile-dropdown, [role="menu"]');
    await expect(profileDropdown).toBeVisible();
    
    await expect(profileDropdown.getByText('Test User')).toBeVisible();
    await expect(profileDropdown.getByText('test@example.com')).toBeVisible();
    
    await expect(profileDropdown.getByRole('menuitem', { name: /profile|account/i })).toBeVisible();
    await expect(profileDropdown.getByRole('menuitem', { name: /settings/i })).toBeVisible();
    await expect(profileDropdown.getByRole('menuitem', { name: /logout|sign out/i })).toBeVisible();
  });

  test('should navigate to profile settings page', async ({ page }) => {
    const userAvatar = page.locator('.user-avatar, [data-testid="user-menu"]').first();
    await userAvatar.click();
    
    await page.getByRole('menuitem', { name: /profile|account/i }).click();
    
    await expect(page).toHaveURL(/.*profile|account/);
    await expect(page.getByRole('heading', { name: /profile|account/i })).toBeVisible();
    
    const nameInput = page.locator('input[name="name"], input[name="displayName"]');
    await expect(nameInput).toHaveValue('Test User');
    
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('should update profile information', async ({ page }) => {
    const userAvatar = page.locator('.user-avatar, [data-testid="user-menu"]').first();
    await userAvatar.click();
    
    await page.getByRole('menuitem', { name: /profile|account/i }).click();
    
    const nameInput = page.locator('input[name="name"], input[name="displayName"]');
    await nameInput.clear();
    await nameInput.fill('Updated User');
    
    const bioTextarea = page.locator('textarea[name="bio"], textarea[name="about"]');
    await bioTextarea.fill('I love learning languages with LangoMango!');
    
    await page.getByRole('button', { name: /save|update/i }).click();
    
    await expect(page.getByText(/profile updated|saved successfully/i)).toBeVisible();
    
    await page.reload();
    await expect(nameInput).toHaveValue('Updated User');
  });

  test('should show learning progress dashboard', async ({ page }) => {
    const userAvatar = page.locator('.user-avatar, [data-testid="user-menu"]').first();
    await userAvatar.click();
    
    await page.getByRole('menuitem', { name: /dashboard|progress/i }).click();
    
    await expect(page).toHaveURL(/.*dashboard|progress/);
    
    const progressChart = page.locator('.progress-chart, canvas, svg').first();
    await expect(progressChart).toBeVisible();
    
    const stats = page.locator('.stat-card, .progress-stat');
    await expect(stats.first()).toBeVisible();
    
    const lessonsCompleted = stats.filter({ hasText: /lessons.*completed/i });
    await expect(lessonsCompleted).toBeVisible();
    
    const streak = page.locator('.streak-counter, [data-testid="streak"]');
    await expect(streak).toBeVisible();
  });

  test('should handle logout flow', async ({ page }) => {
    const userAvatar = page.locator('.user-avatar, [data-testid="user-menu"]').first();
    await userAvatar.click();
    
    page.on('dialog', dialog => dialog.accept());
    
    await page.getByRole('menuitem', { name: /logout|sign out/i }).click();
    
    await expect(page.locator('.user-avatar')).not.toBeVisible();
    await expect(page.getByRole('button', { name: /sign in|log in/i })).toBeVisible();
    
    const userData = await page.evaluate(() => localStorage.getItem('user'));
    expect(userData).toBeNull();
    
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();
  });
});