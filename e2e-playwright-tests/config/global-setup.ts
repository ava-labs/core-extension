import fs from 'node:fs';
import path from 'node:path';
import { FullConfig } from '@playwright/test';

async function globalSetup(_config: FullConfig) {
  console.log('Starting global setup...');

  // Clean up user data directory from previous runs
  const userDataDir = path.resolve(__dirname, '..', 'user-data-dir');
  if (fs.existsSync(userDataDir)) {
    console.log('Cleaning up user data directory...');
    fs.rmSync(userDataDir, { recursive: true, force: true });
    console.log('User data directory cleaned');
  }

  // Clean up old screenshots
  const screenshotsDir = path.resolve(__dirname, '..', 'test-results', 'screenshots');
  if (fs.existsSync(screenshotsDir)) {
    console.log('Cleaning up old screenshots...');
    const files = fs.readdirSync(screenshotsDir);
    files.forEach((file) => {
      fs.unlinkSync(path.join(screenshotsDir, file));
    });
    console.log('Old screenshots cleaned');
  }

  // Verify extension build exists
  const extensionPath = path.resolve(__dirname, '..', 'dist');
  if (!fs.existsSync(extensionPath)) {
    console.warn('Warning: Extension build not found at', extensionPath);
    console.warn('Please ensure the extension is copied to e2e-playwright-tests/dist');
  } else {
    console.log('Extension build found at', extensionPath);
  }

  // Verify manifest exists
  const manifestPath = path.join(extensionPath, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    console.log(`Extension manifest found - Name: ${manifest.name}, Version: ${manifest.version}`);
  }

  console.log('Global setup completed\n');
}

export default globalSetup;
