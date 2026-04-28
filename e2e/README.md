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

# Create local env file
cp .env.example .env
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
- `PLAYWRIGHT_WORKERS`: optional override for worker count

## Environment Variables

Set these in `.env` (or export in CI). A template is available in
`e2e/.env.example`. Shared values live in 1Password under
"Extension .ENV for development".

| Variable                   | Description                               |
| -------------------------- | ----------------------------------------- |
| `WALLET_PASSWORD`          | Default wallet password                   |
| `RECOVERY_PHRASE_12_WORDS` | 12-word recovery phrase (space-separated) |
| `RECOVERY_PHRASE_24_WORDS` | 24-word recovery phrase (space-separated) |

## TestRail Automation Sync

Reconcile the `custom_automation_id` annotations on Playwright tests with
TestRail's case-level Automation ID custom field. The script lives at
`scripts/testrail-sync.mjs` and uses Playwright's own `--list --reporter=json`
output to enumerate tests, so dynamic IDs (e.g. `` `custom_automation_id:SWP-MOCK-FLOW-${key}` ``)
and parameterized titles are fully resolved before comparison.

### Required env

Add the following to `e2e/.env` (template in `.env.example`). The API key is
generated under TestRail → My Settings → API Keys — it is **not** your password.

```
TESTRAIL_HOST=https://avalabs.testrail.io
TESTRAIL_EMAIL=you@avalabs.org
TESTRAIL_API_KEY=...
TESTRAIL_PROJECT_ID=...
TESTRAIL_SUITE_ID=     # optional
```

### Common usage

```bash
# Read-only drift report (no writes to TestRail)
yarn testrail:report

# Push title-matched updates after reviewing the report
yarn testrail:sync

# Restrict discovery to @smoke or @regression
node scripts/testrail-sync.mjs --grep @regression

# Verify which custom field key TestRail uses on this instance
node scripts/testrail-sync.mjs --debugCases 3
```

### What the report shows

| Section                                         | What it means                                                        |
| ----------------------------------------------- | -------------------------------------------------------------------- |
| Tests missing `custom_automation_id` annotation | Specs that should be tagged but aren't                               |
| Duplicate automation IDs in local tests         | Same ID reused across specs (almost always a copy-paste bug)         |
| Local IDs missing in TestRail                   | Test exists in code but TestRail has no case linked to it            |
| TestRail IDs missing locally                    | TestRail has a case linked to an ID nothing in code references       |
| Title-match sync candidates                     | Single-match-on-both-sides cases where the IDs differ → safe to push |

### CI flags

Useful when wiring this into a workflow:

| Flag                  | Effect                                                  |
| --------------------- | ------------------------------------------------------- |
| `--apply`             | Required to mutate TestRail. Default is report-only.    |
| `--failOnMissing`     | Exit 1 if any local IDs are absent in TestRail.         |
| `--failOnDuplicates`  | Exit 1 if local tests share an automation_id.           |
| `--failOnUnannotated` | Exit 1 if any spec lacks an automation_id annotation.   |
| `--json`              | Append a machine-readable summary at the end of stdout. |
| `--jsonOut <path>`    | Write the same machine-readable summary to a file.      |

Without any `--failOn*` flag the script exits 0 even when drift exists, so it
is safe to run as an advisory check.

The scheduled regression workflow (`.github/workflows/e2e_regression_tests.yaml`)
runs `yarn testrail:report --jsonOut /tmp/drift.json` in a `testrail-drift` job
with `continue-on-error: true`. When drift is detected, it publishes a
GitHub Actions Job Summary; otherwise the summary stays empty. The full JSON
is uploaded as an artifact (`testrail-drift-report`).

## Snapshots

Local snapshots live in `helpers/storage-snapshots/`.
CI downloads snapshots from S3 during the workflow.
CI access is configured via `aws-actions/configure-aws-credentials` using
the role `arn:aws:iam::975050371175:role/github-flow-sa-role` to read from
`s3://core-qa-automation-snapshots/ext/`. For local runs, either populate
`helpers/storage-snapshots/` manually or use AWS credentials with access to
that bucket and run `aws s3 sync s3://core-qa-automation-snapshots/ext/ helpers/storage-snapshots/`.

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
