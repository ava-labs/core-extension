# E2E Agent Instructions

## Failure screenshots

Failure screenshots are deny-by-default. Every new or modified E2E test must explicitly evaluate every UI state in which it can fail.

- Add `ALLOW_FAILURE_SCREENSHOT_ANNOTATION` to every test that is demonstrably safe.
- Do not add it if a recovery phrase, private key, API token, keystore secret, or other sensitive value could be visible.
- If safety is uncertain, omit it.
- Never enable screenshots at file, describe, project, or global scope.

```typescript
import { test, expect } from '../fixtures/extension.fixture';
import { ALLOW_FAILURE_SCREENSHOT_ANNOTATION } from '../constants';

test(
  'safe test',
  {
    annotation: [
      { type: ALLOW_FAILURE_SCREENSHOT_ANNOTATION },
      { type: 'snapshot', description: 'mainnetPrimaryExtWallet' },
    ],
  },
  async ({ extensionPage }) => {
    await expect(extensionPage.getByRole('heading')).toBeVisible();
  },
);
```
