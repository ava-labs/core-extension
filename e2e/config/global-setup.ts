import * as fs from 'node:fs';
import * as path from 'node:path';

export default async function globalSetup() {
  console.log('\n🚀 Starting E2E test setup...\n');

  // Verify extension build exists
  const extensionPath = path.resolve(__dirname, '..', '..', 'dist');
  if (!fs.existsSync(extensionPath)) {
    console.error(`❌ Extension build not found at: ${extensionPath}`);
    console.error('Please run "yarn build" from the root directory first.');
    throw new Error('Extension build not found. Run "yarn build" first.');
  }
  console.log(`✓ Extension build found at: ${extensionPath}`);

  // Clean up old screenshots
  const screenshotsDir = path.resolve(
    __dirname,
    '..',
    'test-results',
    'screenshots',
  );
  if (fs.existsSync(screenshotsDir)) {
    console.log('Cleaning up old screenshots...');
    const files = fs.readdirSync(screenshotsDir);
    for (const file of files) {
      fs.unlinkSync(path.join(screenshotsDir, file));
    }
    console.log('Old screenshots cleaned');
  }

  // Create required directories
  const dirs = [
    path.resolve(__dirname, '..', 'test-results'),
    path.resolve(__dirname, '..', 'test-results', 'screenshots'),
    path.resolve(__dirname, '..', 'test-results', 'user-data'),
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✓ Created directory: ${dir}`);
    }
  }

  console.log('\n✅ E2E setup complete!\n');
}
