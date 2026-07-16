import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '../fixtures/extension.fixture';
import { AccountManagementPage } from '../pages/extension/AccountManagementPage';
import { TEST_CONFIG } from '../constants';

// Secrets / fixtures are centralized in TEST_CONFIG.wallet & TEST_CONFIG.keystore
// so env parsing lives in one place.
const { wallet, keystore } = TEST_CONFIG;
const MAINNET_SNAPSHOT = TEST_CONFIG.snapshots.mainnet;

const keystorePath = (fileName: string) =>
  path.resolve(__dirname, '..', keystore.dir, fileName);

/**
 * Skips the test locally when a required secret/fixture is missing, but fails
 * loudly in CI so a missing secret or an empty S3 sync doesn't silently drop
 * coverage while the overall run still reports green.
 */
const requireFixture = (isMissing: boolean, message: string) => {
  if (!isMissing) {
    return;
  }
  if (process.env.CI) {
    throw new Error(`Missing required test fixture in CI: ${message}`);
  }
  test.skip(true, message);
};

test.describe('Account Management Tests', () => {
  test(
    'As a CORE ext user with an extension wallet, I can create a new account',
    {
      tag: ['@smoke', '@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-001',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.openMyWallets();

      const countBefore = await accountManagement.getAccountCount();
      const countAfter = await accountManagement.createNewAccount();

      expect(countAfter).toBe(countBefore + 1);
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I can import a private key',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-002',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      requireFixture(!wallet.privateKey, 'PRIVATE_KEY_IMPORT env var not set');
      test.setTimeout(120000);

      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.enableAddWalletFlags();
      await accountManagement.openMyWallets();
      await accountManagement.openAddWalletMenu();

      await expect(accountManagement.privateKeyOption).toBeVisible();
      await accountManagement.importPrivateKey(wallet.privateKey);

      await expect(
        unlockedExtensionPage.getByText('Private Key Imported', {
          exact: false,
        }),
      ).toBeVisible({ timeout: 30000 });
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I can import a private key for XP Chain',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-009',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      requireFixture(
        !wallet.privateKeyXp,
        'XP_PRIVATE_KEY_MAIN_EXT_WALLET env var not set',
      );
      test.setTimeout(120000);

      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.enableAddWalletFlags();
      await accountManagement.openMyWallets();
      await accountManagement.openAddWalletMenu();

      await accountManagement.importPrivateKey(wallet.privateKeyXp);

      await expect(
        unlockedExtensionPage.getByText('Private Key Imported', {
          exact: false,
        }),
      ).toBeVisible({ timeout: 30000 });

      // Open the imported account details and verify its X/P-Chain address.
      await accountManagement.openMyWallets();
      await accountManagement.openImportedAccountDetails();

      await expect(accountManagement.accountAddressAvm).toHaveAttribute(
        'data-address',
        wallet.privateKeyXpExpectedAvmAddress,
      );
    },
  );

  test(
    'As a CORE ext user with an extension wallet, importing an already imported private key shows the duplicate screen and I can import it',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-003',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      requireFixture(
        !wallet.privateKeyMain,
        'PRIVATE_KEY_MAIN_EXT_WALLET env var not set',
      );
      test.setTimeout(120000);

      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.enableAddWalletFlags();
      await accountManagement.openMyWallets();
      await accountManagement.openAddWalletMenu();

      await accountManagement.openImportPrivateKey();
      await accountManagement.submitPrivateKey(wallet.privateKeyMain);

      // The mainnet primary wallet's key is already present -> duplicate screen.
      await expect(accountManagement.duplicateAccountScreen).toBeVisible({
        timeout: 15000,
      });
      await expect(accountManagement.importDuplicateButton).toBeVisible();

      await accountManagement.importDuplicateButton.click();

      await expect(
        unlockedExtensionPage.getByText('Private Key Imported', {
          exact: false,
        }),
      ).toBeVisible({ timeout: 30000 });
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I can import a recovery phrase',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-004',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      requireFixture(
        !wallet.recoveryPhrase24.length,
        'RECOVERY_PHRASE_24_WORDS env var not set',
      );
      test.setTimeout(180000);

      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.enableAddWalletFlags();
      await accountManagement.openMyWallets();
      await accountManagement.openAddWalletMenu();

      await expect(accountManagement.recoveryPhraseOption).toBeVisible({
        timeout: 45000,
      });

      const importPage = await accountManagement.importRecoveryPhrase(
        wallet.recoveryPhrase24,
      );

      // On success the fullscreen import tab closes and returns to the wallet.
      await importPage.waitForEvent('close', { timeout: 60000 });
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I can import a Ledger wallet',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-005',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120000);

      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.enableAddWalletFlags();
      await accountManagement.openMyWallets();
      await accountManagement.openAddWalletMenu();

      await expect(accountManagement.ledgerOption).toBeVisible({
        timeout: 45000,
      });

      const ledgerPage = await accountManagement.openLedgerImportTab();

      const connectTitle = ledgerPage.getByTestId('connect-ledger-title');
      await expect(connectTitle).toBeVisible({ timeout: 30000 });
      await expect(connectTitle).toHaveText(/connect your ledger/i);
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I can import a Keystore file (v4)',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-006',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const { fileName, password } = keystore.v4;
      const filePath = keystorePath(fileName);
      requireFixture(!password, 'PASSWORD_KEYSTORE_V4 env var not set');
      requireFixture(
        !fs.existsSync(filePath),
        `Keystore file not found: ${filePath} (sync from S3)`,
      );
      test.setTimeout(120000);

      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.enableAddWalletFlags();
      await accountManagement.openMyWallets();
      await accountManagement.openAddWalletMenu();

      await expect(accountManagement.keystoreOption).toBeVisible({
        timeout: 45000,
      });

      await accountManagement.importKeystoreFile(filePath, password);

      await expect(
        unlockedExtensionPage.getByText(
          'Successfully imported the keystore file',
          { exact: false },
        ),
      ).toBeVisible({ timeout: 30000 });
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I can import a Keystore file (v6)',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-007',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const { fileName, password } = keystore.v6;
      const filePath = keystorePath(fileName);
      requireFixture(!password, 'PASSWORD_KEYSTORE_V6 env var not set');
      requireFixture(
        !fs.existsSync(filePath),
        `Keystore file not found: ${filePath} (sync from S3)`,
      );
      test.setTimeout(120000);

      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.enableAddWalletFlags();
      await accountManagement.openMyWallets();
      await accountManagement.openAddWalletMenu();

      await expect(accountManagement.keystoreOption).toBeVisible({
        timeout: 45000,
      });

      await accountManagement.importKeystoreFile(filePath, password);

      await expect(
        unlockedExtensionPage.getByText(
          'Successfully imported the keystore file',
          { exact: false },
        ),
      ).toBeVisible({ timeout: 30000 });
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I see an error when importing an invalid Keystore file',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-008',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const { fileName } = keystore.invalid;
      const filePath = keystorePath(fileName);
      requireFixture(
        !fs.existsSync(filePath),
        `Keystore file not found: ${filePath} (sync from S3)`,
      );
      test.setTimeout(120000);

      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.enableAddWalletFlags();
      await accountManagement.openMyWallets();
      await accountManagement.openAddWalletMenu();

      await expect(accountManagement.keystoreOption).toBeVisible({
        timeout: 45000,
      });

      await accountManagement.uploadInvalidKeystoreFile(filePath);

      await expect(accountManagement.keystoreError).toBeVisible();
      await expect(accountManagement.keystoreTryAgainButton).toBeVisible();
    },
  );
});
