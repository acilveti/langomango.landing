import { Page, Route } from '@playwright/test';

export async function mockExternalServices(page: Page) {
  // Mock Reddit Pixel
  await page.route('**/events/rdt_*.js', (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: '// Mocked Reddit Pixel'
    });
  });

  // Mock ContentSquare
  await page.route('**/tag.js', (route: Route) => {
    if (route.request().url().includes('contentsquare')) {
      route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: 'window._cs_mk = "mocked"; window.CS = {};'
      });
    } else {
      route.continue();
    }
  });

  // Mock Google Tag Manager
  await page.route('**/gtm.js*', (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: 'window.dataLayer = window.dataLayer || [];'
    });
  });

  // Mock Microsoft Clarity
  await page.route('**/clarity/*', (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: 'window.clarity = function() {};'
    });
  });

  // Mock Vercel Analytics
  await page.route('**/vitals*', (route: Route) => {
    if (route.request().url().includes('vercel')) {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true })
      });
    } else {
      route.continue();
    }
  });

  // Speed up image loading by serving placeholder
  if (process.env.MOCK_IMAGES === 'true') {
    await page.route('**/*.{png,jpg,jpeg,gif,webp}', (route: Route) => {
      route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: '<svg width="1" height="1" xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1" fill="#ddd"/></svg>'
      });
    });
  }
}

export async function mockApiEndpoints(page: Page) {
  // Mock contact form endpoint
  await page.route('**/api/contact', (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, message: 'Message sent' })
    });
  });

  // Mock newsletter subscription
  await page.route('**/api/newsletter', (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, subscribed: true })
    });
  });
}