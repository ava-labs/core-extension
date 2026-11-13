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
  // The copy tests clear/write/read the OS clipboard, which is shared across
  // browser contexts; base.config enables fullyParallel outside CI, so run this
  // block sequentially to stop one clipboard test clobbering another's value.
  test.describe.configure({ mode: 'default' });

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
  // capture, so no secret is on screen even if a capture happens. Clear the OS
  // clipboard first so a copied private key/address (e.g. ACC-024) can't linger
  // on the runner after the test ends.
  test.afterEach(async ({ context }) => {
    const [firstPage] = context.pages();
    if (firstPage) {
      await context.grantPermissions(['clipboard-write']).catch(() => {});
      await firstPage
        .evaluate(() => navigator.clipboard.writeText(''))
        .catch(() => {});
    }
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

      // Poll visibility as a boolean; these elements carry the address in
      // `data-address`, which a failed toBeVisible would print in its DOM preview.
      const addressLocators = [
        accountManagement.accountAddressC,
        accountManagement.accountAddressAvm,
        accountManagement.accountAddressBtc,
        accountManagement.accountAddressEth,
        accountManagement.accountAddressSvm,
      ];
      for (const locator of addressLocators) {
        await expect
          .poll(() => locator.isVisible(), { timeout: 15000 })
          .toBe(true);
      }
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

      // The system clipboard survives context recreation, so a prior run could
      // leave the expected value in place; clear it so the poll proves a fresh copy.
      await unlockedExtensionPage.evaluate(() =>
        navigator.clipboard.writeText(''),
      );

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
      // These rows render the address text; poll visibility as a boolean so a
      // failure never prints the element preview.
      for (const testId of contextMenuAddressIds) {
        await expect
          .poll(() => unlockedExtensionPage.getByTestId(testId).isVisible(), {
            timeout: 15000,
          })
          .toBe(true);
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

      await expect
        .poll(() => accountManagement.revealedPrivateKey.isVisible(), {
          timeout: 15000,
        })
        .toBe(true);
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

      await expect
        .poll(() => accountManagement.revealedPrivateKey.isVisible(), {
          timeout: 15000,
        })
        .toBe(true);
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
      await expect
        .poll(() => accountManagement.revealedPrivateKey.isVisible())
        .toBe(false);
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

      await expect
        .poll(() => accountManagement.revealedPrivateKey.isVisible(), {
          timeout: 15000,
        })
        .toBe(true);
      const revealedKey =
        await accountManagement.revealedPrivateKey.inputValue();
      expect(PRIVATE_KEY_FORMAT.test(revealedKey)).toBe(true);

      // The system clipboard survives context recreation, so a prior run could
      // leave the expected value in place; clear it so the poll proves a fresh copy.
      await unlockedExtensionPage.evaluate(() =>
        navigator.clipboard.writeText(''),
      );

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
        { type: 'sensitive', description: 'opens account details (addresses)' },
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
    'As a CORE ext user with an extension wallet, I see a validation error when renaming with an empty or unchanged name',
    {
      tag: ['@regression'],
      annotation: [
        { type: 'snapshot', description: MAINNET_SNAPSHOT },
        {
          type: 'testrail_case_field',
          description: 'custom_automation_id:ACC-012',
        },
        { type: 'sensitive', description: 'opens account details (addresses)' },
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
        { type: 'sensitive', description: 'opens account details (addresses)' },
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
});
