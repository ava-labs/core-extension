# E2E Tests for Core Extension

This directory contains end-to-end tests for the Core Extension using Playwright.

## Prerequisites

1. **Node.js 20.18.0** (managed by Volta)
2. **Built extension** - Run `yarn build` from the root directory first

## Setup

```bash
# Navigate to e2e directory
cd e2e

# Install dependencies
yarn install

# Install Playwright browsers
npx playwright install chromium
```

## Running Tests

```bash
# Run all tests
yarn test

# Run tests in headed mode (visible browser)
yarn test:headed

# Run specific test file
npx playwright test tests/onboarding.spec.ts

# Run with UI mode for debugging
yarn test:ui

# Run tests with specific tag
npx playwright test --grep @smoke
```

## Project Structure

```
e2e/
├── config/                      # Playwright configuration
│   ├── base.config.ts           # Base configuration
│   ├── global-setup.ts          # Global setup
│   └── local.config.ts          # Local development config
├── fixtures/                    # Test fixtures
│   └── extension.fixture.ts     # Extension testing fixtures
├── helpers/                     # Helper utilities
│   ├── storage-snapshots/       # Wallet state snapshots
│   ├── extensionHelpers.ts      # Extension utilities
│   ├── loadWalletSnapshot.ts    # Snapshot loading utility
│   ├── walletHelpers.ts         # Wallet utilities
│   └── waits.ts                 # Wait utilities
├── pages/                       # Page Object Models
│   └── extension/
│       ├── BasePage.ts          # Base page class
│       ├── ContactsPage.ts      # Contacts page
│       └── OnboardingPage.ts    # Onboarding page
├── tests/                       # Test specifications
│   ├── contacts.spec.ts         # Contacts tests
│   └── onboarding.spec.ts       # Onboarding tests
├── types/                       # TypeScript types
│   └── contacts.ts              # Contact types
├── constants.ts                 # Test configuration
├── playwright.config.ts         # Playwright main config
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies
```

## Test Tags

| Tag           | Description            |
| ------------- | ---------------------- |
| `@smoke`      | Critical path tests    |
| `@regression` | Full regression tests  |
| `@onboarding` | Onboarding flow tests  |
| `@contacts`   | Contacts feature tests |

## Environment Variables

Set these in `.env` or as environment variables:

| Variable                   | Description                               |
| -------------------------- | ----------------------------------------- |
| `WALLET_PASSWORD`          | Default wallet password                   |
| `RECOVERY_PHRASE_12_WORDS` | 12-word recovery phrase (space-separated) |
| `RECOVERY_PHRASE_24_WORDS` | 24-word recovery phrase (space-separated) |

## Creating Wallet Snapshots

1. Set up a wallet manually
2. Open Chrome DevTools for the extension
3. Run: `chrome.storage.local.get(null, console.log)`
4. Export as TypeScript in `helpers/storage-snapshots/`

## Troubleshooting

### Extension not loading

- Verify `yarn build` completed successfully
- Check extension path in `constants.ts`

### Tests timing out

- Increase timeouts in config files

### Snapshot not loading

- Verify snapshot file exists and exports correctly
