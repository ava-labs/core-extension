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

const ACCOUNT_REMOVAL_FLAG_OVERRIDES = {
  'primary-account-removal': true,
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
  readonly accountAddressC: Locator;
  readonly accountAddressCCopy: Locator;
  readonly accountAddressBtc: Locator;
  readonly accountAddressEth: Locator;
  readonly accountAddressSvm: Locator;
  readonly accountDetailsRenameButton: Locator;
  readonly accountDetailsRemoveButton: Locator;
  readonly renameNameInput: Locator;
  readonly renameSaveButton: Locator;
  readonly renameCancelButton: Locator;
  readonly deleteConfirmButton: Locator;
  readonly deleteCancelButton: Locator;
  readonly manageWalletsButton: Locator;
  readonly deleteSelectedButton: Locator;
  readonly bulkDeleteCancelButton: Locator;
  readonly showPrivateKeyButton: Locator;
  readonly privateKeyChainSelect: Locator;
  readonly privateKeyPasswordInput: Locator;
  readonly revealPrivateKeyButton: Locator;
  readonly revealedPrivateKey: Locator;
  readonly copyPrivateKeyButton: Locator;

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
    this.accountAddressC = page.getByTestId('account-address-c');
    this.accountAddressCCopy = page.getByTestId('account-address-c-copy');
    this.accountAddressBtc = page.getByTestId('account-address-btc');
    this.accountAddressEth = page.getByTestId('account-address-eth');
    this.accountAddressSvm = page.getByTestId('account-address-svm');
    this.accountDetailsRenameButton = page.getByTestId(
      'account-details-rename-button',
    );
    this.accountDetailsRemoveButton = page.getByTestId(
      'account-details-remove-button',
    );
    this.renameNameInput = page.getByTestId('rename-name-input');
    this.renameSaveButton = page.getByTestId('rename-save-button');
    this.renameCancelButton = page.getByTestId('rename-cancel-button');
    this.deleteConfirmButton = page.getByTestId(
      'delete-account-confirm-button',
    );
    this.deleteCancelButton = page.getByTestId('delete-account-cancel-button');
    this.manageWalletsButton = page.getByTestId('manage-wallets-button');
    this.deleteSelectedButton = page.getByTestId('delete-selected-button');
    this.bulkDeleteCancelButton = page.getByTestId('bulk-delete-cancel-button');
    this.showPrivateKeyButton = page.getByTestId('show-private-key-button');
    this.privateKeyChainSelect = page.getByTestId('private-key-chain-select');
    this.privateKeyPasswordInput = page.getByTestId(
      'private-key-password-input',
    );
    this.revealPrivateKeyButton = page.getByTestId('reveal-private-key-button');
    this.revealedPrivateKey = page.getByTestId('revealed-private-key');
    this.copyPrivateKeyButton = page.getByTestId('copy-private-key-button');
  }

  accountRow(index: number): Locator {
    return this.accountListItems.nth(index);
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

  async setFeatureFlagOverrides(
    overrides: Record<string, boolean>,
  ): Promise<void> {
    try {
      await this.page.evaluate((flags) => {
        return new Promise<void>((resolve) => {
          chrome.storage.local.set(
            { '__feature-flag-overrides__': { data: flags } },
            () => resolve(),
          );
        });
      }, overrides);
    } catch {
      // chrome.storage unavailable — DEFAULT_FLAGS already enable these flags.
    }
  }

  async enableAccountRemovalFlag(): Promise<void> {
    await this.setFeatureFlagOverrides(ACCOUNT_REMOVAL_FLAG_OVERRIDES);
  }

  async openAccountDetails(index = 0): Promise<void> {
    const row = this.accountRow(index);
    await row.waitFor({ state: 'visible', timeout: 15000 });
    await row.hover();
    await row.getByRole('button', { name: 'Options', exact: true }).click();
    await this.accountAddressC.waitFor({ state: 'visible', timeout: 15000 });
  }

  async openAccountContextMenu(index = 0): Promise<void> {
    const row = this.accountRow(index);
    await row.waitFor({ state: 'visible', timeout: 15000 });
    await row.click({ button: 'right' });
  }

  async renameAccountFromDetails(newName: string): Promise<void> {
    await this.accountDetailsRenameButton.click();
    await this.renameNameInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.renameNameInput.fill(newName);
    await expect(this.renameSaveButton).toBeEnabled({ timeout: 15000 });
    await this.renameSaveButton.click();
  }

  async openRenameWallet(): Promise<void> {
    const walletCard = this.page
      .locator('[data-testid^="wallet-card-"]')
      .first();
    await walletCard.waitFor({ state: 'visible', timeout: 15000 });
    await walletCard.hover();
    await walletCard.getByTestId('wallet-rename-button').click();
    await this.renameNameInput.waitFor({ state: 'visible', timeout: 15000 });
  }

  async enterManageMode(): Promise<void> {
    await this.manageWalletsButton.click();
    await this.deleteSelectedButton.waitFor({
      state: 'visible',
      timeout: 15000,
    });
  }

  async toggleAccountSelection(index: number): Promise<void> {
    await this.accountRow(index).click();
  }

  accountCheckbox(index: number): Locator {
    return this.accountRow(index)
      .getByTestId('account-list-checkbox')
      .locator('input');
  }

  async confirmDelete(): Promise<void> {
    await this.deleteConfirmButton.click();
  }

  async openShowPrivateKey(): Promise<void> {
    await this.showPrivateKeyButton.scrollIntoViewIfNeeded();
    await this.showPrivateKeyButton.click();
    await this.privateKeyPasswordInput.waitFor({
      state: 'visible',
      timeout: 15000,
    });
  }

  async selectPrivateKeyChain(
    label: 'Avalanche C-Chain' | 'Avalanche X/P-Chain',
  ) {
    await this.privateKeyChainSelect.click();
    await this.page.getByRole('option', { name: label, exact: true }).click();
  }

  async submitRevealPassword(password: string): Promise<void> {
    await this.privateKeyPasswordInput.fill(password);
    await expect(this.revealPrivateKeyButton).toBeEnabled({ timeout: 15000 });
    await this.revealPrivateKeyButton.click();
  }
}
