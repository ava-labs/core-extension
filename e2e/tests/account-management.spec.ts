import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '../fixtures/extension.fixture';
import { AccountManagementPage } from '../pages/extension/AccountManagementPage';
import { WalletViewPage } from '../pages/extension/WalletViewPage';
import { TEST_CONFIG } from '../constants';

// Revealed private keys are `0x` + 32 bytes for both C-Chain and X/P-Chain
// (see GetPrivateKeyHandler). We assert the shape only, never the value.
const PRIVATE_KEY_FORMAT = /^0x[0-9a-fA-F]{64}$/;

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

  test(
    'As a CORE ext user with an extension wallet, I can rename an account from the account details page',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-010',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.openMyWallets();
      await accountManagement.openAccountDetails(0);
      await accountManagement.renameAccountFromDetails('Renamed Account');

      await expect(
        unlockedExtensionPage.getByText('Account renamed', { exact: false }),
      ).toBeVisible({ timeout: 15000 });
      await expect(
        unlockedExtensionPage.getByText('Renamed Account').first(),
      ).toBeVisible();
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I can rename a wallet',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-011',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.openMyWallets();
      await accountManagement.openRenameWallet();

      await accountManagement.renameNameInput.fill('Renamed Wallet');
      await expect(accountManagement.renameSaveButton).toBeEnabled({
        timeout: 15000,
      });
      await accountManagement.renameSaveButton.click();

      await expect(
        unlockedExtensionPage.getByText('Wallet renamed', { exact: false }),
      ).toBeVisible({ timeout: 15000 });
      await expect(
        unlockedExtensionPage.getByText('Renamed Wallet').first(),
      ).toBeVisible();
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I see a validation error when renaming with an empty or unchanged name',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-012',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.openMyWallets();
      await accountManagement.openAccountDetails(0);
      await accountManagement.accountDetailsRenameButton.click();
      await accountManagement.renameNameInput.waitFor({
        state: 'visible',
        timeout: 15000,
      });

      const currentName =
        (await accountManagement.renameNameInput.getAttribute('placeholder')) ??
        '';

      await accountManagement.renameNameInput.fill(' ');
      await expect(
        unlockedExtensionPage.getByText(
          'Account name must be at least 1 character long',
        ),
      ).toBeVisible();
      await expect(accountManagement.renameSaveButton).toBeDisabled();

      await accountManagement.renameNameInput.fill(currentName);
      await expect(
        unlockedExtensionPage.getByText(
          'Account name must be different from the current name',
        ),
      ).toBeVisible();
      await expect(accountManagement.renameSaveButton).toBeDisabled();
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I can delete a single account',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-013',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120000);
      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.enableAccountRemovalFlag();
      await accountManagement.openMyWallets();
      const baseline = await accountManagement.getAccountCount();
      const afterCreate = await accountManagement.createNewAccount();

      // The last account in a wallet is the only one that can be removed on its own.
      await accountManagement.openAccountDetails(afterCreate - 1);
      await expect(accountManagement.accountDetailsRemoveButton).toBeEnabled({
        timeout: 15000,
      });
      await accountManagement.accountDetailsRemoveButton.click();

      await accountManagement.confirmDelete();

      await expect(
        unlockedExtensionPage.getByText('Account deleted', { exact: false }),
      ).toBeVisible({ timeout: 15000 });
      await expect(accountManagement.accountListItems).toHaveCount(baseline, {
        timeout: 15000,
      });
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I can delete multiple accounts in bulk using Manage mode',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-014',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(150000);
      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.enableAccountRemovalFlag();
      await accountManagement.openMyWallets();
      const baseline = await accountManagement.getAccountCount();
      await accountManagement.createNewAccount();
      const total = await accountManagement.createNewAccount();

      await accountManagement.enterManageMode();
      // The feature-flag override reaches the UI asynchronously; wait until the
      // last account becomes selectable before acting.
      await expect(accountManagement.accountCheckbox(total - 1)).toBeEnabled({
        timeout: 15000,
      });

      // Selection must proceed from the last account upwards (consecutive-only rule).
      await accountManagement.toggleAccountSelection(total - 1);
      await expect(accountManagement.accountCheckbox(total - 2)).toBeEnabled();
      await accountManagement.toggleAccountSelection(total - 2);

      await expect(accountManagement.deleteSelectedButton).toBeEnabled({
        timeout: 15000,
      });
      await accountManagement.deleteSelectedButton.click();

      await accountManagement.confirmDelete();

      await expect(
        unlockedExtensionPage.getByText('Accounts deleted', { exact: false }),
      ).toBeVisible({ timeout: 15000 });
      await expect(accountManagement.accountListItems).toHaveCount(baseline, {
        timeout: 15000,
      });
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I cannot remove the last remaining account',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-015',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120000);
      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.enableAccountRemovalFlag();
      await accountManagement.openMyWallets();
      const count = await accountManagement.getAccountCount();

      await accountManagement.enterManageMode();
      await expect(accountManagement.accountCheckbox(count - 1)).toBeEnabled({
        timeout: 15000,
      });

      // Select every account from the last down to index 1; the guard then keeps
      // index 0 (the single remaining account) unselectable.
      for (let i = count - 1; i >= 1; i--) {
        await expect(accountManagement.accountCheckbox(i)).toBeEnabled();
        await accountManagement.toggleAccountSelection(i);
      }

      await expect(accountManagement.accountCheckbox(0)).toBeDisabled();
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I cannot select a non-last account for deletion in Manage mode',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-016',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120000);
      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.enableAccountRemovalFlag();
      await accountManagement.openMyWallets();
      const count = await accountManagement.getAccountCount();

      await accountManagement.enterManageMode();

      // The base account (index 0) is non-last, so its checkbox is disabled;
      // only the last account can be selected first.
      await expect(accountManagement.accountCheckbox(0)).toBeDisabled({
        timeout: 15000,
      });
      await expect(accountManagement.accountCheckbox(count - 1)).toBeEnabled();
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I can cancel Manage mode',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-017',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.openMyWallets();
      await accountManagement.enterManageMode();

      await accountManagement.bulkDeleteCancelButton.click();

      await expect(accountManagement.manageWalletsButton).toBeVisible({
        timeout: 15000,
      });
      await expect(accountManagement.deleteSelectedButton).toBeHidden();
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I can see all chain addresses on the account details page',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-018',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.openMyWallets();
      await accountManagement.openAccountDetails(0);

      await expect(accountManagement.accountAddressC).toBeVisible();
      await expect(accountManagement.accountAddressAvm).toBeVisible();
      await expect(accountManagement.accountAddressBtc).toBeVisible();
      await expect(accountManagement.accountAddressEth).toBeVisible();
      await expect(accountManagement.accountAddressSvm).toBeVisible();
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I can copy an account address from the account details page',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-019',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      await unlockedExtensionPage
        .context()
        .grantPermissions(['clipboard-read', 'clipboard-write']);

      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.openMyWallets();
      await accountManagement.openAccountDetails(0);

      const address =
        await accountManagement.accountAddressC.getAttribute('data-address');
      expect(address).toBeTruthy();

      await accountManagement.accountAddressCCopy.click();

      await expect(
        unlockedExtensionPage.getByText('Address copied!', { exact: false }),
      ).toBeVisible({ timeout: 15000 });

      // Poll because clipboard writeText is fire-and-forget; compare as a boolean
      // so the address is never printed in assertion output.
      await expect
        .poll(
          async () =>
            (await unlockedExtensionPage.evaluate(() =>
              navigator.clipboard.readText(),
            )) === address,
          { timeout: 15000 },
        )
        .toBe(true);
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I can see account addresses from the right-click context menu',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-020',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.openMyWallets();
      await accountManagement.openAccountContextMenu(0);

      const contextMenuAddressIds = [
        'context-menu-address-c',
        'context-menu-address-avm',
        'context-menu-address-btc',
        'context-menu-address-eth',
        'context-menu-address-svm',
      ];
      for (const testId of contextMenuAddressIds) {
        await expect(unlockedExtensionPage.getByTestId(testId)).toBeVisible({
          timeout: 15000,
        });
      }
    },
  );

  test(
    "As a CORE ext user with an extension wallet, I can reveal an account's private key for the C-Chain",
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-021',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.openMyWallets();
      await accountManagement.openAccountDetails(0);
      await accountManagement.openShowPrivateKey();
      await accountManagement.submitRevealPassword(wallet.password);

      await expect(accountManagement.revealedPrivateKey).toBeVisible({
        timeout: 15000,
      });
      const key = await accountManagement.revealedPrivateKey.inputValue();
      expect(PRIVATE_KEY_FORMAT.test(key)).toBe(true);
    },
  );

  test(
    "As a CORE ext user with an extension wallet, I can reveal an account's private key for the X/P-Chain",
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-022',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.openMyWallets();
      await accountManagement.openAccountDetails(0);
      await accountManagement.openShowPrivateKey();
      await accountManagement.selectPrivateKeyChain('Avalanche X/P-Chain');
      await accountManagement.submitRevealPassword(wallet.password);

      await expect(accountManagement.revealedPrivateKey).toBeVisible({
        timeout: 15000,
      });
      const key = await accountManagement.revealedPrivateKey.inputValue();
      expect(PRIVATE_KEY_FORMAT.test(key)).toBe(true);
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I see an error when revealing the private key with a wrong password',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-023',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.openMyWallets();
      await accountManagement.openAccountDetails(0);
      await accountManagement.openShowPrivateKey();
      await accountManagement.submitRevealPassword('WrongPassword123!');

      await expect(
        unlockedExtensionPage.getByText('Invalid Password', { exact: false }),
      ).toBeVisible({ timeout: 15000 });
      await expect(accountManagement.revealedPrivateKey).toBeHidden();
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I can copy a revealed private key',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-024',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      await unlockedExtensionPage
        .context()
        .grantPermissions(['clipboard-read', 'clipboard-write']);

      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.openMyWallets();
      await accountManagement.openAccountDetails(0);
      await accountManagement.openShowPrivateKey();
      await accountManagement.submitRevealPassword(wallet.password);

      await expect(accountManagement.revealedPrivateKey).toBeVisible({
        timeout: 15000,
      });
      const revealedKey =
        await accountManagement.revealedPrivateKey.inputValue();
      expect(PRIVATE_KEY_FORMAT.test(revealedKey)).toBe(true);

      await accountManagement.copyPrivateKeyButton.click();

      await expect(
        unlockedExtensionPage.getByText('Private key copied!', {
          exact: false,
        }),
      ).toBeVisible({ timeout: 15000 });

      // Poll until the clipboard matches the revealed key; compare as a boolean
      // so the private key never appears in assertion output.
      await expect
        .poll(
          async () =>
            (await unlockedExtensionPage.evaluate(() =>
              navigator.clipboard.readText(),
            )) === revealedKey,
          { timeout: 15000 },
        )
        .toBe(true);
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I can open the wallet view by clicking the wallet name on the Portfolio page',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-025',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const walletView = new WalletViewPage(unlockedExtensionPage);

      await walletView.walletSummaryInfo.waitFor({
        state: 'visible',
        timeout: 15000,
      });
      await walletView.openFromPortfolio();

      expect(unlockedExtensionPage.url()).toContain('/wallet/');
      await expect(walletView.walletViewBalance).toBeVisible();
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I can see the number of accounts and networks for a wallet',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-026',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120000);
      const walletView = new WalletViewPage(unlockedExtensionPage);

      await walletView.walletSummaryInfo.waitFor({
        state: 'visible',
        timeout: 15000,
      });
      await walletView.openFromPortfolio();
      await expect(walletView.walletAccountsSummary).toBeVisible();

      const networkCount = () =>
        walletView.walletAccountsSummary.textContent().then((text) => {
          const over = (text ?? '').match(/over\s+(\d+)\s+/i);
          return over ? Number(over[1]) : 0;
        });

      // The network count starts at 0 and settles once balances load.
      await expect.poll(networkCount, { timeout: 60000 }).toBeGreaterThan(0);

      const summary =
        (await walletView.walletAccountsSummary.textContent()) ?? '';
      const match = summary.match(/has\s+(\d+)\s+accounts?\s+over\s+(\d+)\s+/i);
      expect(match).toBeTruthy();

      const renderedAccountCount = await walletView.accountItems.count();
      expect(Number(match![1])).toBe(renderedAccountCount);
      expect(Number(match![2])).toBeGreaterThan(0);
    },
  );

  test(
    "As a CORE ext user with an extension wallet, I can see a wallet's total balance in the wallet view",
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-027',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120000);
      const walletView = new WalletViewPage(unlockedExtensionPage);

      await walletView.walletSummaryInfo.waitFor({
        state: 'visible',
        timeout: 15000,
      });
      await walletView.openFromPortfolio();

      await expect(walletView.walletViewBalance).toBeVisible();
      // The loading placeholder has no digits; wait for a formatted value.
      // Compared as a boolean so the balance is not printed on failure.
      await expect
        .poll(
          async () =>
            /\d/.test((await walletView.walletViewBalance.textContent()) ?? ''),
          { timeout: 60000 },
        )
        .toBe(true);
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I can see the Swap, Send, Receive and Buy actions in the wallet view',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-028',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );
      // Swap (Fusion) and Buy are feature-flag gated; force them on for determinism.
      await accountManagement.setFeatureFlagOverrides({
        'fusion-feature': true,
        buy: true,
      });

      const walletView = new WalletViewPage(unlockedExtensionPage);
      await walletView.walletSummaryInfo.waitFor({
        state: 'visible',
        timeout: 15000,
      });
      await walletView.openFromPortfolio();

      await expect(walletView.sendButton).toBeVisible();
      await expect(walletView.receiveButton).toBeVisible();
      await expect(walletView.swapButton).toBeVisible({ timeout: 20000 });
      await expect(walletView.buyButton).toBeVisible({ timeout: 20000 });
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I can see the active account indicator in the wallet view',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-029',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const walletView = new WalletViewPage(unlockedExtensionPage);

      await walletView.walletSummaryInfo.waitFor({
        state: 'visible',
        timeout: 15000,
      });
      await walletView.openFromPortfolio();

      await expect(walletView.activeAccountIndicator.first()).toBeVisible();
    },
  );

  test(
    "As a CORE ext user with an extension wallet, I can see each account's networks in the wallet view",
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-030',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120000);
      const walletView = new WalletViewPage(unlockedExtensionPage);

      await walletView.walletSummaryInfo.waitFor({
        state: 'visible',
        timeout: 15000,
      });
      await walletView.openFromPortfolio();

      // A network avatar renders per network the account holds a balance on; the
      // funded snapshot account shows at least one once balances load.
      await expect(walletView.accountItems.first()).toBeVisible();
      await expect(walletView.networkAvatars.first()).toBeVisible({
        timeout: 60000,
      });
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I can switch account from the wallet view',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-031',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      test.setTimeout(120000);
      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await accountManagement.openMyWallets();
      await accountManagement.createNewAccount();

      const walletView = new WalletViewPage(unlockedExtensionPage);
      await walletView.goToPortfolio();
      await walletView.openFromPortfolio();

      // The freshly created account is active, so the first account is inactive.
      await walletView.accountItems.first().click();
      await walletView.goToPortfolio();
      await walletView.openFromPortfolio();

      await expect(
        walletView.accountItems
          .first()
          .getByTestId('wallet-account-active-indicator'),
      ).toBeVisible({ timeout: 15000 });
    },
  );

  test(
    'As a CORE ext user with an extension wallet, I can open My Wallets from the wallet view',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-032',
        },
      ],
    },
    async ({ unlockedExtensionPage }) => {
      const walletView = new WalletViewPage(unlockedExtensionPage);
      const accountManagement = new AccountManagementPage(
        unlockedExtensionPage,
      );

      await walletView.walletSummaryInfo.waitFor({
        state: 'visible',
        timeout: 15000,
      });
      await walletView.openFromPortfolio();

      await walletView.walletViewHeader.click();

      await expect(accountManagement.addConnectWalletButton).toBeVisible({
        timeout: 15000,
      });
    },
  );
});
