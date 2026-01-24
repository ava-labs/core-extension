# Wallet Snapshots

This directory contains wallet snapshot files used for E2E testing.

## Important

**Snapshot files are NOT committed to git** for security reasons - they contain encrypted wallet data.

## For CI/CD

Snapshots are automatically downloaded from AWS S3 during CI runs:

```bash
aws s3 sync s3://core-qa-automation-snapshots/extension/ .
```

## For Local Development

To run E2E tests locally, you need to either:

1. **Download from S3** (requires AWS credentials):

   ```bash
   cd e2e/helpers/storage-snapshots
   aws s3 sync s3://core-qa-automation-snapshots/extension/ .
   ```

2. **Create your own snapshots**:
   - Set up a wallet manually in the extension
   - Export the `chrome.storage.local` data
   - Save as a TypeScript file exporting the data object

## Snapshot Format

Each snapshot file should export a default object containing the wallet storage data:

```typescript
export const snapshotName = {
  WALLET_STORAGE_ENCRYPTION_KEY: { ... },
  accounts: { ... },
  wallet: { ... },
  settings: { ... },
  // ... other storage keys
};
```

## Available Snapshots

- `mainnetPrimaryExtWallet.ts` - Primary wallet on mainnet
- `testnetPrimaryExtWallet.ts` - Primary wallet on testnet
