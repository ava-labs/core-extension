/**
 * Account Management Page - "My wallets" screen, adding accounts, and the
 * add-wallet import flows (private key, recovery phrase, Ledger, keystore file).
 */
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { waitForExtensionLoad } from '../../helpers/extensionHelpers';

/**
 * The feature flags that gate the add-wallet import options. They default to
 * `true` in the extension's DEFAULT_FLAGS, but once PostHog resolves the real
 * flag set they may be turned off. We push an unencrypted storage override so
 * the options remain available for the tests regardless of the PostHog state.
 */
const ADD_WALLET_FLAG_OVERRIDES = {
  'add-wallet-with-seedphrase': true,
  'add-wallet-with-ledger': true,
  'add-wallet-with-keystore-file': true,
};

export class AccountManagementPage extends BasePage {
  // My wallets home
  readonly accountInfoClickable: Locator;
  readonly addConnectWalletButton: Locator;
  readonly addAccountButton: Locator;
  readonly accountListItems: Locator;
  // Add-or-connect wallet menu
  readonly privateKeyOption: Locator;
  readonly recoveryPhraseOption: Locator;
  readonly ledgerOption: Locator;
  readonly keystoreOption: Locator;
  // Import private key
  readonly privateKeyInput: Locator;
  readonly importPrivateKeySubmit: Locator;
  readonly importDuplicateButton: Locator;
  readonly duplicateAccountScreen: Locator;
  // Import keystore file
  readonly keystoreFileInput: Locator;
  readonly keystoreNextButton: Locator;
  readonly keystorePasswordInput: Locator;
  readonly keystoreImportButton: Locator;
  readonly keystoreError: Locator;
  readonly keystoreTryAgainButton: Locator;
  // Account details
  readonly importedAccountsCard: Locator;
  readonly accountAddressAvm: Locator;

  constructor(page: Page) {
    super(page);
    this.accountInfoClickable = page.getByTestId('account-info-clickable');
    this.addConnectWalletButton = page.getByTestId('add-connect-wallet-button');
    this.addAccountButton = page.getByTestId('add-account-button');
    this.accountListItems = page.getByTestId('account-list-item');
    this.privateKeyOption = page.getByTestId('add-wallet-private-key-option');
    this.recoveryPhraseOption = page.getByTestId(
      'add-wallet-recovery-phrase-option',
    );
    this.ledgerOption = page.getByTestId('add-wallet-ledger-option');
    this.keystoreOption = page.getByTestId('add-wallet-keystore-option');
    this.privateKeyInput = page.getByTestId('private-key-input');
    this.importPrivateKeySubmit = page.getByTestId('import-private-key-submit');
    this.importDuplicateButton = page.getByTestId('import-duplicate-button');
    this.duplicateAccountScreen = page.getByTestId('duplicate-account-screen');
    this.keystoreFileInput = page.getByTestId('keystore-file-input');
    this.keystoreNextButton = page.getByTestId('keystore-next-button');
    this.keystorePasswordInput = page.getByTestId('keystore-password-input');
    this.keystoreImportButton = page.getByTestId('keystore-import-button');
    this.keystoreError = page.getByTestId('keystore-error');
    this.keystoreTryAgainButton = page.getByTestId('keystore-try-again-button');
    this.importedAccountsCard = page.getByTestId('wallet-card-__IMPORTED__');
    this.accountAddressAvm = page.getByTestId('account-address-avm');
  }

  private extensionHostFromUrl(url: string): string | null {
    try {
      return new URL(url).host;
    } catch {
      return null;
    }
  }

  /**
   * Opens the "My wallets" screen from the portfolio header. Falls back to
   * hash-based navigation if the header account control cannot be clicked.
   */
  async openMyWallets(): Promise<void> {
    try {
      await this.accountInfoClickable.click({ timeout: 10000 });
    } catch {
      const host = this.extensionHostFromUrl(this.page.url());
      if (!host) {
        throw new Error('Unable to resolve extension id to open My wallets');
      }
      await this.page.goto(
        `chrome-extension://${host}/popup.html#/account-management`,
        { waitUntil: 'domcontentloaded' },
      );
    }
    await this.addConnectWalletButton.waitFor({
      state: 'visible',
      timeout: 15000,
    });
  }

  /** Number of accounts currently rendered across the wallet list. */
  async getAccountCount(): Promise<number> {
    await this.accountListItems.first().waitFor({ state: 'visible' });
    return this.accountListItems.count();
  }

  /**
   * Clicks "Add account" on the active wallet and waits for the success toast.
   * Returns the account count after creation.
   */
  async createNewAccount(): Promise<number> {
    const countBefore = await this.getAccountCount();

    await this.addAccountButton.scrollIntoViewIfNeeded();
    await this.addAccountButton.click();

    await this.page
      .getByText('Account created successfully', { exact: false })
      .waitFor({ state: 'visible', timeout: 30000 });

    // The new account row is appended to the active wallet's list.
    await this.page.waitForFunction(
      (expected) =>
        document.querySelectorAll('[data-testid="account-list-item"]').length >=
        expected,
      countBefore + 1,
      { timeout: 15000 },
    );

    return this.getAccountCount();
  }

  /**
   * Forces the add-wallet feature-flag overrides so the gated import options
   * (recovery phrase, Ledger, keystore file) are available.
   */
  async enableAddWalletFlags(): Promise<void> {
    try {
      await this.page.evaluate((overrides) => {
        return new Promise<void>((resolve) => {
          chrome.storage.local.set(
            { '__feature-flag-overrides__': { data: overrides } },
            () => resolve(),
          );
        });
      }, ADD_WALLET_FLAG_OVERRIDES);
    } catch {
      // chrome.storage unavailable — DEFAULT_FLAGS already enable these options.
    }
  }

  /** Opens the "Add an account or connect a wallet" menu from My wallets. */
  async openAddWalletMenu(): Promise<void> {
    await this.addConnectWalletButton.click();
    await this.privateKeyOption.waitFor({ state: 'visible', timeout: 15000 });
  }

  /** Opens the Import Private Key screen from the add-wallet menu. */
  async openImportPrivateKey(): Promise<void> {
    await this.privateKeyOption.click();
    await this.privateKeyInput.waitFor({ state: 'visible', timeout: 15000 });
  }

  /** Fills the private key and clicks Import (once enabled). */
  async submitPrivateKey(privateKey: string): Promise<void> {
    await this.privateKeyInput.fill(privateKey);
    await expect(this.importPrivateKeySubmit).toBeEnabled({ timeout: 15000 });
    await this.importPrivateKeySubmit.click();
  }

  /**
   * Imports an account from a raw private key. Handles the "already imported"
   * confirmation dialog if the derived account already exists.
   */
  async importPrivateKey(privateKey: string): Promise<void> {
    await this.openImportPrivateKey();
    await this.submitPrivateKey(privateKey);

    // If the account already exists, confirm the duplicate import.
    const isDuplicate = await this.importDuplicateButton
      .isVisible({ timeout: 3000 })
      .catch(() => false);
    if (isDuplicate) {
      await this.importDuplicateButton.click();
    }
  }

  /**
   * Imports a wallet from a keystore JSON file + password.
   */
  async importKeystoreFile(filePath: string, password: string): Promise<void> {
    await this.keystoreOption.click();
    await this.keystoreFileInput.waitFor({ state: 'attached', timeout: 15000 });
    await this.keystoreFileInput.setInputFiles(filePath);

    await expect(this.keystoreNextButton).toBeEnabled({ timeout: 15000 });
    await this.keystoreNextButton.click();

    await this.keystorePasswordInput.waitFor({
      state: 'visible',
      timeout: 15000,
    });
    await this.keystorePasswordInput.fill(password);

    await expect(this.keystoreImportButton).toBeEnabled({ timeout: 15000 });
    await this.keystoreImportButton.click();
  }

  /**
   * From "My wallets", opens the details of the first account in the
   * "Imported accounts" wallet card and waits for the addresses to render.
   */
  async openImportedAccountDetails(): Promise<void> {
    await this.importedAccountsCard.waitFor({
      state: 'visible',
      timeout: 15000,
    });

    const accountItem = this.importedAccountsCard
      .getByTestId('account-list-item')
      .first();

    // Expand the card if the account rows are collapsed.
    const isItemVisible = await accountItem.isVisible().catch(() => false);
    if (!isItemVisible) {
      await this.importedAccountsCard.click();
    }

    await accountItem.hover();
    await accountItem
      .getByRole('button', { name: 'Options', exact: true })
      .click();

    await this.accountAddressAvm.waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Uploads an unsupported keystore file and waits for the error screen. The
   * file is rejected during selection, so no "Next" click is required.
   */
  async uploadInvalidKeystoreFile(filePath: string): Promise<void> {
    await this.keystoreOption.click();
    await this.keystoreFileInput.waitFor({ state: 'attached', timeout: 15000 });
    await this.keystoreFileInput.setInputFiles(filePath);

    await this.keystoreError.waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Clicks "Import Ledger wallet", which opens a fullscreen tab. Returns the
   * new page once the "Connect your Ledger" screen is shown.
   */
  async openLedgerImportTab(): Promise<Page> {
    const context = this.page.context();
    const [ledgerPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 30000 }),
      this.ledgerOption.click(),
    ]);
    await ledgerPage.waitForLoadState('domcontentloaded');
    await waitForExtensionLoad(ledgerPage, 45000);
    return ledgerPage;
  }

  /**
   * Clicks "Import a recovery phrase", which opens a fullscreen tab, and
   * completes the recovery-phrase import flow with the given words.
   */
  async importRecoveryPhrase(words: string[]): Promise<Page> {
    const context = this.page.context();
    const [importPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 30000 }),
      this.recoveryPhraseOption.click(),
    ]);
    await importPage.waitForLoadState('domcontentloaded');
    await waitForExtensionLoad(importPage, 45000);

    // Enter each recovery-phrase word.
    for (let i = 0; i < words.length; i++) {
      const wordInput = importPage.getByTestId(`recovery-phrase-word-${i}`);
      await wordInput.waitFor({ state: 'visible', timeout: 15000 });
      await wordInput.fill(words[i]);
    }

    // Step 1 -> Step 2 (confirm addresses)
    await importPage.getByRole('button', { name: /^next$/i }).click();
    await importPage
      .getByRole('button', { name: /^confirm$/i })
      .click({ timeout: 30000 });

    // Step 3: name the wallet and save.
    const nameInput = importPage.getByPlaceholder(/enter name/i);
    await nameInput.waitFor({ state: 'visible', timeout: 15000 });
    await nameInput.fill('Imported Recovery Wallet');
    await importPage.getByRole('button', { name: /^save$/i }).click();

    return importPage;
  }
}
