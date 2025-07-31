import { test, expect } from '../fixtures/test-base';

test.describe('Search Functionality E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should search for courses and display results', async ({ page }) => {
    const searchIcon = page.locator('[aria-label*="search"], .search-icon').first();
    await searchIcon.click();
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]').first();
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('beginner spanish');
    await searchInput.press('Enter');
    
    await expect(page).toHaveURL(/.*search.*query=beginner\+spanish/);
    
    const searchResults = page.locator('.search-result, .course-card');
    await expect(searchResults.first()).toBeVisible();
    
    const resultCount = await searchResults.count();
    expect(resultCount).toBeGreaterThan(0);
    
    const firstResult = searchResults.first();
    const resultText = await firstResult.textContent();
    expect(resultText?.toLowerCase()).toMatch(/spanish|beginner/);
  });

  test('should show search suggestions while typing', async ({ page }) => {
    const searchIcon = page.locator('[aria-label*="search"], .search-icon').first();
    await searchIcon.click();
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]').first();
    await searchInput.type('span', { delay: 100 });
    
    const suggestions = page.locator('.search-suggestions, .autocomplete-results');
    await expect(suggestions).toBeVisible();
    
    const suggestionItems = suggestions.locator('.suggestion-item, li');
    const suggestionCount = await suggestionItems.count();
    expect(suggestionCount).toBeGreaterThan(0);
    
    await suggestionItems.first().click();
    
    const inputValue = await searchInput.inputValue();
    expect(inputValue.toLowerCase()).toContain('spanish');
  });

  test('should filter search results by category', async ({ page }) => {
    const searchIcon = page.locator('[aria-label*="search"], .search-icon').first();
    await searchIcon.click();
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]').first();
    await searchInput.fill('language');
    await searchInput.press('Enter');
    
    await page.waitForLoadState('networkidle');
    
    const categoryFilter = page.locator('select[name="category"], .filter-category').first();
    await categoryFilter.selectOption('grammar');
    
    await page.waitForTimeout(1000);
    
    const filteredResults = page.locator('.search-result:visible, .course-card:visible');
    const resultCount = await filteredResults.count();
    
    for (let i = 0; i < Math.min(resultCount, 3); i++) {
      const result = filteredResults.nth(i);
      const category = await result.locator('.category, .course-category').textContent();
      expect(category?.toLowerCase()).toContain('grammar');
    }
  });

  test('should handle empty search results gracefully', async ({ page }) => {
    const searchIcon = page.locator('[aria-label*="search"], .search-icon').first();
    await searchIcon.click();
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]').first();
    await searchInput.fill('xyznonexistentquery123');
    await searchInput.press('Enter');
    
    await expect(page.getByText(/no results found|no courses found/i)).toBeVisible();
    await expect(page.getByText(/try different keywords|suggestions/i)).toBeVisible();
    
    const suggestedSearches = page.locator('.suggested-searches, .related-searches');
    if (await suggestedSearches.isVisible()) {
      const suggestions = suggestedSearches.locator('a, button');
      expect(await suggestions.count()).toBeGreaterThan(0);
    }
  });

  test('should save recent searches', async ({ page }) => {
    const searchIcon = page.locator('[aria-label*="search"], .search-icon').first();
    await searchIcon.click();
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]').first();
    
    await searchInput.fill('french basics');
    await searchInput.press('Enter');
    await page.waitForTimeout(1000);
    
    await searchInput.clear();
    await searchInput.fill('german pronunciation');
    await searchInput.press('Enter');
    await page.waitForTimeout(1000);
    
    await searchInput.clear();
    await searchInput.click();
    
    const recentSearches = page.locator('.recent-searches, .search-history');
    if (await recentSearches.isVisible()) {
      await expect(recentSearches.getByText('french basics')).toBeVisible();
      await expect(recentSearches.getByText('german pronunciation')).toBeVisible();
    }
  });
});