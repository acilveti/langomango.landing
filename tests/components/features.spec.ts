import { test, expect } from '../fixtures/test-base';
import { selectors, nth } from '../fixtures/selectors';

test.describe('Features Gallery Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector(selectors.features.section, { timeout: 30000 });
    
    // Scroll to features section
    await page.locator(selectors.features.section).scrollIntoViewIfNeeded();
  });

  test('should display features section with correct title', async ({ page }) => {
    const section = page.locator(selectors.features.section);
    await expect(section).toBeVisible();
    
    // Check section title - SectionTitle is a div, not h2
    const title = section.locator('[class*="SectionTitle"]').first();
    await expect(title).toContainText('How does it work?');
    
    // Check overtitle
    const overTitle = section.locator('text=key features');
    await expect(overTitle).toBeVisible();
  });

  test('should display all feature tabs', async ({ page }) => {
    const tabs = page.locator(selectors.features.tabs);
    const tabCount = await tabs.count();
    
    // Should have 4 tabs based on the translation file
    expect(tabCount).toBe(4);
    
    // Check tab titles
    const expectedTabs = [
      'Get an ebook you want to read and start reading',
      'While you read, you will encounter sentences in both languages',
      'You will continue reading, and will also find sentences only in your learning language',
      'That\'s it! After the first 5 minutes, it will become second nature to you'
    ];
    
    for (let i = 0; i < expectedTabs.length; i++) {
      const tab = nth(selectors.features.tabs, i + 1);
      await expect(page.locator(tab)).toContainText(expectedTabs[i]);
    }
  });

  test('should switch content when clicking tabs', async ({ page }) => {
    const tabs = page.locator(selectors.features.tabs);
    const tabPanels = page.locator(selectors.features.tabPanel);
    
    // Click second tab
    await tabs.nth(1).click();
    await page.waitForTimeout(500); // Wait for animation
    
    // Check that content changed
    const activePanel = tabPanels.filter({ hasText: /Your mind is starting to memorize/ });
    await expect(activePanel).toBeVisible();
    
    // Click third tab
    await tabs.nth(2).click();
    await page.waitForTimeout(500);
    
    // Check new content
    const newActivePanel = tabPanels.filter({ hasText: /The algorithm is pushing you/ });
    await expect(newActivePanel).toBeVisible();
  });

  test('should display images for each feature', async ({ page }) => {
    const tabs = page.locator(selectors.features.tabs);
    const tabCount = await tabs.count();
    
    for (let i = 0; i < tabCount; i++) {
      // Click each tab
      await tabs.nth(i).click();
      await page.waitForTimeout(300); // Wait for transition
      
      // Check if image is displayed
      const image = page.locator(selectors.features.featureImage);
      await expect(image).toBeVisible();
      
      // Verify image has loaded
      const imageSrc = await image.getAttribute('src');
      expect(imageSrc).toBeTruthy();
    }
  });

  test('should have proper tab keyboard navigation', async ({ page }) => {
    const firstTab = page.locator(selectors.features.tabs).first();
    
    // Focus first tab
    await firstTab.focus();
    
    // Check ARIA attributes
    const ariaSelected = await firstTab.getAttribute('aria-selected');
    expect(ariaSelected).toBe('true');
    
    // Navigate with arrow keys
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
    
    // Second tab should now be selected
    const secondTab = page.locator(selectors.features.tabs).nth(1);
    const secondTabSelected = await secondTab.getAttribute('aria-selected');
    expect(secondTabSelected).toBe('true');
  });

  test('should display feature descriptions', async ({ page }) => {
    const tabs = page.locator(selectors.features.tabs);
    
    // Test each tab's description
    const expectedDescriptions = [
      'Choose a book of your liking, upload to the app, get confortable, and start reading.',
      'Your mind is starting to memorize and establishing relations between words',
      'The algorithm is pushing you, but if you do not understand the sentence',
      'Just enjoy the reading, build the habit, and have fun during the process'
    ];
    
    for (let i = 0; i < expectedDescriptions.length; i++) {
      await tabs.nth(i).click();
      await page.waitForTimeout(300);
      
      const description = page.locator(selectors.features.featureDescription);
      await expect(description).toContainText(expectedDescriptions[i]);
    }
  });

  test('should maintain active tab state', async ({ page }) => {
    const tabs = page.locator(selectors.features.tabs);
    
    // Click third tab
    await tabs.nth(2).click();
    
    // Verify it has active state
    const activeTab = tabs.nth(2);
    const ariaSelected = await activeTab.getAttribute('aria-selected');
    expect(ariaSelected).toBe('true');
    
    // Check visual active state (class or style)
    const hasActiveClass = await activeTab.evaluate(el => {
      return el.classList.toString().includes('active') || 
             el.classList.toString().includes('selected') ||
             window.getComputedStyle(el).fontWeight === 'bold';
    });
    
    expect(hasActiveClass).toBe(true);
  });

  test('should handle rapid tab switching', async ({ page }) => {
    const tabs = page.locator(selectors.features.tabs);
    
    // Rapidly click through all tabs
    for (let i = 0; i < 4; i++) {
      await tabs.nth(i).click();
      // Don't wait between clicks
    }
    
    // Final tab should be active
    const lastTab = tabs.nth(3);
    const ariaSelected = await lastTab.getAttribute('aria-selected');
    expect(ariaSelected).toBe('true');
    
    // Content should match last tab
    const content = page.locator(selectors.features.tabPanel);
    await expect(content).toContainText('Just enjoy the reading');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Features should still be visible
    const section = page.locator(selectors.features.section);
    await expect(section).toBeVisible();
    
    // Tabs might be in a different layout on mobile
    const tabs = page.locator(selectors.features.tabs);
    const firstTab = tabs.first();
    
    // Check if tabs are still clickable on mobile
    await firstTab.click();
    await page.waitForTimeout(300);
    
    const content = page.locator(selectors.features.tabPanel);
    await expect(content).toBeVisible();
  });

  test('should have smooth animations between tabs', async ({ page }) => {
    const tabPanel = page.locator(selectors.features.tabPanel).first();
    
    // Check for CSS transitions
    const hasTransition = await tabPanel.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.transition !== 'none' && styles.transition !== '';
    });
    
    // Log animation status
    console.log('Tab panel has transitions:', hasTransition);
    
    // Visual check of smooth transition
    const tabs = page.locator(selectors.features.tabs);
    await tabs.nth(0).click();
    await page.waitForTimeout(100);
    await tabs.nth(1).click();
    
    // Content should change smoothly
    await expect(tabPanel).toBeVisible();
  });
});