import { test, expect } from '../fixtures/test-base';

test.describe('API Integration E2E', () => {
  test('should handle API rate limiting gracefully', async ({ page }) => {
    await page.goto('/');
    
    // Simulate rapid API calls
    const promises = [];
    for (let i = 0; i < 20; i++) {
      promises.push(
        page.evaluate(() => 
          fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com' })
          })
        )
      );
    }
    
    const responses = await Promise.all(promises);
    const rateLimitedResponses = responses.filter(r => r.status === 429);
    
    expect(rateLimitedResponses.length).toBeGreaterThan(0);
    
    // Check for user-friendly rate limit message
    if (rateLimitedResponses.length > 0) {
      await page.getByRole('button', { name: /contact/i }).click();
      await expect(page.getByText(/too many requests|try again later/i)).toBeVisible();
    }
  });

  test('should refresh expired authentication tokens', async ({ page }) => {
    // Set expired token
    await page.evaluate(() => {
      localStorage.setItem('token', 'expired-token');
      localStorage.setItem('user', JSON.stringify({ id: '123', name: 'Test User' }));
    });
    
    await page.goto('/dashboard');
    
    // Intercept refresh token request
    let refreshTokenCalled = false;
    await page.route('**/api/auth/refresh', route => {
      refreshTokenCalled = true;
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'new-token' })
      });
    });
    
    // Make authenticated request
    await page.evaluate(() => 
      fetch('/api/user/profile', {
        headers: { 'Authorization': 'Bearer expired-token' }
      })
    );
    
    expect(refreshTokenCalled).toBeTruthy();
    
    const newToken = await page.evaluate(() => localStorage.getItem('token'));
    expect(newToken).toBe('new-token');
  });

  test('should handle API versioning', async ({ page }) => {
    const apiV1Response = await page.evaluate(() => 
      fetch('/api/v1/courses').then(r => ({ 
        status: r.status, 
        version: r.headers.get('api-version') 
      }))
    );
    
    const apiV2Response = await page.evaluate(() => 
      fetch('/api/v2/courses').then(r => ({ 
        status: r.status, 
        version: r.headers.get('api-version') 
      }))
    );
    
    expect(apiV1Response.version).toBe('1.0');
    expect(apiV2Response.version).toBe('2.0');
  });

  test('should paginate API results correctly', async ({ page }) => {
    await page.goto('/courses');
    
    // Load initial page
    const initialCourses = await page.locator('.course-card').count();
    expect(initialCourses).toBeGreaterThan(0);
    
    // Scroll to bottom to trigger pagination
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Wait for next page to load
    await page.waitForResponse(response => 
      response.url().includes('/api/courses') && 
      response.url().includes('page=2')
    );
    
    const totalCourses = await page.locator('.course-card').count();
    expect(totalCourses).toBeGreaterThan(initialCourses);
    
    // Check pagination metadata
    const paginationInfo = await page.locator('.pagination-info').textContent();
    expect(paginationInfo).toMatch(/showing \d+ - \d+ of \d+/i);
  });

  test('should handle WebSocket connections for real-time features', async ({ page }) => {
    await page.goto('/');
    
    // Set up WebSocket listener
    const wsMessages: any[] = [];
    await page.evaluateOnNewDocument(() => {
      const originalWebSocket = window.WebSocket;
      window.WebSocket = new Proxy(originalWebSocket, {
        construct(target, args) {
          const ws = new target(...args);
          
          ws.addEventListener('message', (event) => {
            window.wsMessages = window.wsMessages || [];
            window.wsMessages.push(JSON.parse(event.data));
          });
          
          return ws;
        }
      });
    });
    
    await page.reload();
    await page.waitForTimeout(2000);
    
    // Check for WebSocket connection
    const hasWebSocket = await page.evaluate(() => {
      return window.wsMessages && window.wsMessages.length > 0;
    });
    
    if (hasWebSocket) {
      const messages = await page.evaluate(() => window.wsMessages);
      expect(messages.some(m => m.type === 'connection' || m.type === 'welcome')).toBeTruthy();
    }
  });
});