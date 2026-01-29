# E2E Tests for Core Extension

End-to-end tests for the Core Extension using Playwright, with page objects and
fixtures that load the built extension, manage snapshots, and drive UI flows.

## Framework Overview

- **Runner**: Playwright (`@playwright/test`)
- **Pattern**: Page Object Model in `pages/extension/`
- **Fixtures**: `fixtures/extension.fixture.ts` launches the extension and
  provides `extensionPage` / `unlockedExtensionPage`.
- **Snapshots**: Wallet state is loaded from `helpers/storage-snapshots/` using
  `helpers/loadWalletSnapshot.ts`.
- **Extension ID**: Resolved from the service worker URL at runtime (fallback to
  `constants.ts`) to avoid CI ID mismatches.

## Prerequisites

1. **Node.js 20.18.x** (via Volta)
2. **Built extension** (from repo root):
   - `yarn build` or `yarn build:alpha`

## Setup

```bash
# From repo root
cd e2e
yarn install
npx playwright install chromium
```

## Running Tests

```bash
# Run all tests
yarn test

# Headed mode
yarn test:headed

# Specific file
npx playwright test tests/onboarding.spec.ts

# Filter by tag
npx playwright test --grep @smoke

# UI mode
yarn test:ui
```

## Tags and CI Behavior

CI runs **only `@smoke`** tests:

```bash
npx playwright test --grep @smoke
```

Tags are defined per test as either a string or array (e.g. `['@smoke', '@regression']`).
If a test lacks `@smoke`, it will be skipped by CI.

## Retries and Timeouts

Configured in `config/base.config.ts`:

- `expect` timeout: **5s**
- `retries`: **2** (applies in CI and local unless overridden)

## Environment Variables

Set these in `.env` (or export in CI):

| Variable                   | Description                               |
| -------------------------- | ----------------------------------------- |
| `WALLET_PASSWORD`          | Default wallet password                   |
| `RECOVERY_PHRASE_12_WORDS` | 12-word recovery phrase (space-separated) |
| `RECOVERY_PHRASE_24_WORDS` | 24-word recovery phrase (space-separated) |

## Snapshots

Local snapshots live in `helpers/storage-snapshots/`.
CI downloads snapshots from S3 during the workflow.

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

## Troubleshooting

### Extension not loading

- Ensure `dist/` exists and is recent (`yarn build` or `yarn build:alpha`)
- Verify `constants.ts` extension path and test config

### `net::ERR_BLOCKED_BY_CLIENT` on `chrome-extension://`

- Extension ID mismatch in CI. Use the runtime service worker ID (already in
  helpers) or ensure your build includes a fixed `manifest.json` key.

### Snapshot not loading

- Confirm files exist in `helpers/storage-snapshots/`
- Check CI download step and S3 credentials
