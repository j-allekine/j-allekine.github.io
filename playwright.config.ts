import { defineConfig, devices } from '@playwright/test';

const acceptanceHost = '127.0.0.1';
const acceptancePort = 4322;
const acceptanceUrl = `http://${acceptanceHost}:${acceptancePort}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: acceptanceUrl,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run preview -- --host ${acceptanceHost} --port ${acceptancePort}`,
    url: acceptanceUrl,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
