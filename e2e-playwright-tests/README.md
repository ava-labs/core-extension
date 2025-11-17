# E2E Playwright Tests - Core Extension

Complete end-to-end testing framework for the Core Extension using Playwright.

#### 1. Install Dependencies

```bash
cd e2e-playwright-tests
npm install
npx playwright install chromium
```

#### 2. Verify Extension Location

The extension must be in `e2e-playwright-tests/dist/`:

````bash
# Verify manifest exists
ls -la dist/manifest.json

#### 3. Environment Variables (Required)

Create `.env` file from the template:

```bash
cp .env.example .env
````

Then edit `.env` and add your sensitive data:

````bash
# .env
# REQUIRED: Wallet password for tests
WALLET_PASSWORD="#######"

# REQUIRED: Valid BIP39 recovery phrases for onboarding tests
RECOVERY_PHRASE_12_WORDS="your 12 word recovery phrase here"
RECOVERY_PHRASE_24_WORDS="your 24 word recovery phrase here"


### Verification

Verify everything is set up correctly:

```bash
# Check dependencies installed
ls node_modules/@playwright && echo "✓ Playwright installed"

# Check no workspace references
grep "workspace:" package.json || echo "✓ No workspace dependencies"

# Check tests are discoverable
npx playwright test --list

# Should show:
# Total: 1 test in 1 file
````

## Framework Structure

```
e2e-playwright-tests/
├── node_modules/              # Local dependencies (npm)
├── package.json               # Independent package file
├── tsconfig.json              # Standalone TypeScript config
├── playwright.config.ts       # Playwright configuration
├── .npmrc                     # npm settings
├── .gitignore                 # Git ignore rules
│
├── dist/                      # Extension to test
│   └── manifest.json          # Extension manifest
│
├── tests/                     # Test files
│   └── basic-launch.spec.ts   # Basic launch test
│
├── pages/                     # Page Object Models
│   └── extension/
│       ├── BasePage.ts        # Base page class
│       └── OnboardingPage.ts  # Onboarding page
│
├── fixtures/                  # Playwright fixtures
│   └── extension.fixture.ts   # Extension fixtures
│
├── helpers/                   # Helper utilities
│   ├── extensionHelpers.ts    # Extension operations
│   ├── walletHelpers.ts       # Wallet operations
│   ├── waits.ts              # Wait utilities
│   └── storage-snapshots/     # Wallet snapshots
│
├── config/                    # Test configurations
│   ├── base.config.ts        # Base config
│   ├── local.config.ts       # Local config
│   ├── staging.config.ts     # Staging config
│   ├── develop.config.ts     # Develop config
│   └── global-setup.ts       # Global setup
│
└── test-results/              # Test output
    └── screenshots/           # Failure screenshots
```

---

## Writing Tests

### Basic Test Template

```typescript
import { test, expect } from '../fixtures/extension.fixture';
import { OnboardingPage } from '../pages/extension/OnboardingPage';

test.describe('My Feature', () => {
  test('should do something', async ({ extensionPage }) => {
    // Extension starts fresh by default
    const onboardingPage = new OnboardingPage(extensionPage);

    // Your test logic
    await expect(onboardingPage.welcomeTitle).toBeVisible();
  });
});
```

### Fresh Extension (Default Behavior)

All tests start with a **fresh extension** by default - no wallet loaded:

```typescript
test('test onboarding', async ({ extensionPage }) => {
  // Extension is fresh - perfect for onboarding tests
  const onboardingPage = new OnboardingPage(extensionPage);
  await onboardingPage.isOnWelcomeScreen(); // true
});
```

### Using Wallet Snapshots (Optional)

If you need a pre-configured wallet:

```typescript
test('test with wallet', async ({ unlockedExtensionPage }, testInfo) => {
  // Load a wallet snapshot
  testInfo.annotations.push({ type: 'snapshot', description: 'example' });

  // Wallet is already set up
  const homePage = new HomePage(unlockedExtensionPage);
  await expect(homePage.totalBalance).toBeVisible();
});
```

### Available Fixtures

- **`extensionPage`** - Fresh extension, no wallet
- **`unlockedExtensionPage`** - Extension with wallet (requires snapshot)
- **`popupPage`** - Extension popup view
- **`context`** - Browser context with extension
- **`extensionId`** - Auto-detected extension ID

---

## Configuration

### Extension Path

The extension is loaded from `e2e-playwright-tests/dist/`:

```typescript
// constants.ts
export const TEST_CONFIG = {
  extension: {
    path: './dist', // Relative to e2e-playwright-tests/
  },
};
```

### Timeouts

Configure timeouts in `playwright.config.ts`:

```typescript
{
  timeout: 120000,              // Test timeout
  expect: { timeout: 10000 },   // Assertion timeout
  use: {
    actionTimeout: 45000,       // Action timeout
    navigationTimeout: 45000    // Navigation timeout
  }
}
```

### Browser Settings

Tests run in Chromium by default:

```typescript
{
  use: {
    headless: false,            // Show browser
    viewport: { width: 1920, height: 1080 },
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    trace: 'on-first-retry'
  }
}
```
