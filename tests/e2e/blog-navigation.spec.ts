import { test, expect } from '../fixtures/test-base';

test.describe('Blog Navigation E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to blog section and view articles', async ({ page }) => {
    await page.getByRole('link', { name: /blog/i }).click();
    
    await expect(page).toHaveURL(/.*\/blog/);
    await expect(page.getByRole('heading', { name: /blog|articles/i })).toBeVisible();
    
    const firstArticle = page.locator('article, .blog-post').first();
    await expect(firstArticle).toBeVisible();
    
    const articleTitle = await firstArticle.locator('h2, h3').textContent();
    await firstArticle.click();
    
    await expect(page.getByRole('heading', { name: articleTitle! })).toBeVisible();
  });

  test('should filter blog posts by category', async ({ page }) => {
    await page.getByRole('link', { name: /blog/i }).click();
    
    const categoryFilter = page.locator('[data-testid="category-filter"], select[name="category"], .category-filter').first();
    await categoryFilter.selectOption('language-learning');
    
    const articles = page.locator('article, .blog-post');
    const count = await articles.count();
    
    for (let i = 0; i < count; i++) {
      const article = articles.nth(i);
      const category = await article.locator('.category, [data-category]').textContent();
      expect(category?.toLowerCase()).toContain('language');
    }
  });

  test('should search blog posts', async ({ page }) => {
    await page.getByRole('link', { name: /blog/i }).click();
    
    const searchInput = page.locator('input[placeholder*="search"], input[name="search"]').first();
    await searchInput.fill('spanish');
    await searchInput.press('Enter');
    
    await page.waitForTimeout(1000);
    
    const articles = page.locator('article, .blog-post');
    const firstArticle = articles.first();
    const articleText = await firstArticle.textContent();
    
    expect(articleText?.toLowerCase()).toContain('spanish');
  });

  test('should paginate through blog posts', async ({ page }) => {
    await page.getByRole('link', { name: /blog/i }).click();
    
    const firstPageArticle = page.locator('article, .blog-post').first();
    const firstPageTitle = await firstPageArticle.locator('h2, h3').textContent();
    
    const nextButton = page.getByRole('button', { name: /next|→/i });
    await nextButton.click();
    
    await expect(page).toHaveURL(/.*page=2/);
    
    const secondPageArticle = page.locator('article, .blog-post').first();
    const secondPageTitle = await secondPageArticle.locator('h2, h3').textContent();
    
    expect(firstPageTitle).not.toBe(secondPageTitle);
  });

  test('should share blog post on social media', async ({ page }) => {
    await page.getByRole('link', { name: /blog/i }).click();
    
    const firstArticle = page.locator('article, .blog-post').first();
    await firstArticle.click();
    
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('button', { name: /share.*twitter/i }).click()
    ]);
    
    await expect(newPage).toHaveURL(/.*twitter\.com/);
    const url = newPage.url();
    expect(url).toContain('text=');
    expect(url).toContain('url=');
    
    await newPage.close();
  });
});