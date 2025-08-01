import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/en');
  await expect(page.getByRole('button', { name: 'Start Learning' })).toBeVisible();
});