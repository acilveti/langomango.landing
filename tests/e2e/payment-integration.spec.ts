import { test, expect } from '../fixtures/test-base';

test.describe('Payment Integration E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Mock user authentication
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: '123',
        name: 'Test User',
        email: 'test@example.com'
      }));
      localStorage.setItem('token', 'mock-jwt-token');
    });
  });

  test('should complete payment flow for premium subscription', async ({ page }) => {
    await page.getByRole('link', { name: /pricing/i }).click();
    
    const premiumCard = page.locator('.pricing-card').filter({ hasText: /premium/i });
    await premiumCard.getByRole('button', { name: /get started|subscribe/i }).click();
    
    await expect(page).toHaveURL(/.*checkout|payment/);
    
    // Fill payment form
    await page.fill('input[name="cardNumber"], input[placeholder*="card number"]', '4242424242424242');
    await page.fill('input[name="cardExpiry"], input[placeholder*="MM/YY"]', '12/25');
    await page.fill('input[name="cardCvc"], input[placeholder*="CVC"]', '123');
    await page.fill('input[name="billingName"], input[placeholder*="name on card"]', 'Test User');
    
    // Check order summary
    const orderSummary = page.locator('.order-summary, .payment-summary');
    await expect(orderSummary.getByText(/premium/i)).toBeVisible();
    await expect(orderSummary.getByText(/\$\d+\.?\d*/)).toBeVisible();
    
    // Submit payment
    await page.getByRole('button', { name: /pay|subscribe now/i }).click();
    
    // Wait for success page
    await expect(page.getByText(/payment successful|thank you/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/premium.*activated/i)).toBeVisible();
  });

  test('should apply discount code during checkout', async ({ page }) => {
    await page.getByRole('link', { name: /pricing/i }).click();
    
    const premiumCard = page.locator('.pricing-card').filter({ hasText: /premium/i });
    await premiumCard.getByRole('button', { name: /get started|subscribe/i }).click();
    
    const discountInput = page.locator('input[name="discountCode"], input[placeholder*="discount"]');
    await discountInput.fill('SAVE20');
    
    await page.getByRole('button', { name: /apply/i }).click();
    
    await expect(page.getByText(/discount applied|20% off/i)).toBeVisible();
    
    const updatedPrice = page.locator('.total-price, .final-price');
    const priceText = await updatedPrice.textContent();
    expect(priceText).toMatch(/\$\d+\.?\d*/);
  });

  test('should handle payment errors gracefully', async ({ page }) => {
    await page.getByRole('link', { name: /pricing/i }).click();
    
    const premiumCard = page.locator('.pricing-card').filter({ hasText: /premium/i });
    await premiumCard.getByRole('button', { name: /get started|subscribe/i }).click();
    
    // Use card number that triggers decline
    await page.fill('input[name="cardNumber"], input[placeholder*="card number"]', '4000000000000002');
    await page.fill('input[name="cardExpiry"], input[placeholder*="MM/YY"]', '12/25');
    await page.fill('input[name="cardCvc"], input[placeholder*="CVC"]', '123');
    await page.fill('input[name="billingName"], input[placeholder*="name on card"]', 'Test User');
    
    await page.getByRole('button', { name: /pay|subscribe now/i }).click();
    
    await expect(page.getByText(/payment failed|card declined/i)).toBeVisible();
    await expect(page.getByText(/try different card|contact support/i)).toBeVisible();
  });

  test('should save payment method for future use', async ({ page }) => {
    await page.getByRole('link', { name: /pricing/i }).click();
    
    const premiumCard = page.locator('.pricing-card').filter({ hasText: /premium/i });
    await premiumCard.getByRole('button', { name: /get started|subscribe/i }).click();
    
    await page.fill('input[name="cardNumber"], input[placeholder*="card number"]', '4242424242424242');
    await page.fill('input[name="cardExpiry"], input[placeholder*="MM/YY"]', '12/25');
    await page.fill('input[name="cardCvc"], input[placeholder*="CVC"]', '123');
    
    const saveCardCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: /save.*card|remember/i });
    await saveCardCheckbox.check();
    
    await page.getByRole('button', { name: /pay|subscribe now/i }).click();
    
    // Navigate to account settings
    await page.goto('/account/payment-methods');
    
    const savedCard = page.locator('.saved-card, .payment-method').filter({ hasText: /•••• 4242/i });
    await expect(savedCard).toBeVisible();
  });

  test('should display billing history and invoices', async ({ page }) => {
    // Navigate to billing page
    await page.goto('/account/billing');
    
    await expect(page.getByRole('heading', { name: /billing.*history/i })).toBeVisible();
    
    const invoiceTable = page.locator('table, .invoice-list');
    await expect(invoiceTable).toBeVisible();
    
    const invoiceRows = invoiceTable.locator('tr, .invoice-item');
    await expect(invoiceRows).toHaveCount(3); // Expecting at least some invoices
    
    // Download invoice
    const firstInvoice = invoiceRows.first();
    const downloadButton = firstInvoice.getByRole('button', { name: /download|pdf/i });
    
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadButton.click()
    ]);
    
    expect(download.suggestedFilename()).toMatch(/invoice.*\.pdf/i);
  });
});