import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI ? 'github' : 'html',
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: process.env.CI ? 'on-first-retry' : 'off',
    screenshot: 'only-on-failure',
    video: process.env.CI ? 'retain-on-failure' : 'off',
    
    // Emulate browser features
    locale: 'en-US',
    timezoneId: 'America/New_York',
    
    // Viewport
    viewport: { width: 1280, height: 720 },
    
    // Permissions
    permissions: ['clipboard-read', 'clipboard-write'],
    
    // Timeouts
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  projects: [
    // Mobile-first development
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    // Uncomment these browsers for full cross-browser testing
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'mobile-safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // Output folders
  outputDir: 'test-results/',
  
  webServer: {
    command: 'yarn dev',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});