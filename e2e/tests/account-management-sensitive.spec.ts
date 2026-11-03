import { test, expect } from '../fixtures/extension.fixture';
import { AccountManagementPage } from '../pages/extension/AccountManagementPage';
import { TEST_CONFIG } from '../constants';

// Revealed private keys are `0x` + 32 bytes for both C-Chain and X/P-Chain
// (see GetPrivateKeyHandler). We assert the shape only, never the value.
const PRIVATE_KEY_FORMAT = /^0x[0-9a-fA-F]{64}$/;

const { wallet } = TEST_CONFIG;
const MAINNET_SNAPSHOT = TEST_CONFIG.snapshots.mainnet;

test.use({ trace: 'off', video: 'off', screenshot: 'off' });

test.describe('Account Management Tests', () => {
  // On failure Playwright 1.55.1 writes an `error-context.md` aria snapshot of the
  // page; PLAYWRIGHT_NO_COPY_PROMPT disables that capture (read per-test teardown,
  // so scoping to beforeAll/afterAll keeps non-sensitive specs' error-context).
  let previousNoCopyPrompt: string | undefined;
  test.beforeAll(() => {
    previousNoCopyPrompt = process.env.PLAYWRIGHT_NO_COPY_PROMPT;
    process.env.PLAYWRIGHT_NO_COPY_PROMPT = '1';
  });
  test.afterAll(() => {
    if (previousNoCopyPrompt === undefined) {
      delete process.env.PLAYWRIGHT_NO_COPY_PROMPT;
    } else {
      process.env.PLAYWRIGHT_NO_COPY_PROMPT = previousNoCopyPrompt;
    }
  });

  // Second guard: blank every page before fixture teardown runs the failure
  // capture, so no secret is on screen even if a capture happens.
  test.afterEach(async ({ context }) => {
    await Promise.all(
      context.pages().map((page) => page.goto('about:blank').catch(() => {})),
    );
  });

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
        { type: 'sensitive', description: 'exposes account addresses' },
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
        { type: 'sensitive', description: 'exposes account addresses' },
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
        { type: 'sensitive', description: 'exposes account addresses' },
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
        { type: 'sensitive', description: 'exposes a private key' },
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

      await accountManagement.dismissRevealedKey();
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
        { type: 'sensitive', description: 'exposes a private key' },
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

      await accountManagement.dismissRevealedKey();
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
        { type: 'sensitive', description: 'private key reveal screen' },
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
        { type: 'sensitive', description: 'exposes a private key' },
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

      await accountManagement.dismissRevealedKey();
    },
  );
});
