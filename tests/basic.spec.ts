import { test, expect } from '@playwright/test';

test('renders page', async ({ page }) => {
  await page.goto('http://localhost:3000/en');
  await expect(page.getByRole('button', { name: 'Start Learning' })).toBeVisible();
});

test('modal registration flow', async ({ page }) => {
  await page.goto('http://localhost:3000/en');
  
  // Click language selector and wait
  await page.getByText('Select your target language▼').click();
  // Select French
  await page.getByText('🇫🇷French').click();
  await page.getByText('🌱A1Beginner').click();
  // Click through the pages
  await page.locator('#portal-root').getByRole('button', { name: 'Next page' }).click();
  await page.locator('#portal-root').getByRole('button', { name: 'Next page' }).click();
  await page.locator('#portal-root').getByRole('button', { name: 'Next page' }).click();
  await page.locator('#portal-root').getByRole('button', { name: 'Next page' }).click();
  
  // Verify Google button is visible
  await expect(page.getByRole('button', { name: 'Google' })).toBeVisible();
});
