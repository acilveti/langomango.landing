import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/smoke',
  timeout: 15 * 1000, // 15 seconds max per test
  expect: {
    timeout: 5000
  },
  // No parallel execution for smoke tests
  workers: 1,
  fullyParallel: false,
  
  // No retries for smoke tests
  retries: 0,
  
  // Simple reporter
  reporter: process.env.CI ? 'github' : 'list',
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    // No recording for smoke tests
    trace: 'off',
    screenshot: 'off',
    video: 'off',
    
    // Fast timeouts
    actionTimeout: 5000,
    navigationTimeout: 10000,
  },

  // Only test on one browser (mobile chrome for consistency)
  projects: [
    {
      name: 'smoke',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'yarn dev',
    port: 3000,
    timeout: 60 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});